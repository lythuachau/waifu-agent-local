"""VieNeu v3 Turbo with ZeroTTS speaker clones.

GPU (default): PyTorch CUDA acoustic + codec.
CPU: ONNX fp32 (i7-10700 has no VNNI; int8 babbles).
Clone is from 5–8 s ZeroTTS WAVs, not from voice.npz latents.
"""
from __future__ import annotations

import json
import logging
import os
import threading
import time
from pathlib import Path

import numpy as np

log = logging.getLogger("vieneu_tts")

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
REFS = DATA / "zerotts-refs"
VOICES_JSON = DATA / "vieneu_voices.json"

SPEAKERS = (
    ("maichi", "Mai Chi", "female"),
    ("baotrang", "Bảo Trang", "female"),
    ("kimoanh", "Kim Oanh", "female"),
    ("hamy", "Hà My", "female"),
    ("giahuy", "Gia Huy", "male"),
    ("huuduc", "Hữu Đức", "male"),
    ("quangminh", "Quang Minh", "male"),
    ("tiendat", "Tiến Đạt", "male"),
)

_engine = None
_lock = threading.Lock()
_error: str | None = None
_cuda_dead = False
CUDA_FAIL_PATH = DATA / "cuda_fail.json"
USER_CUDA_MSG = "GPU TTS đứt, đang khởi động lại Docker. Chờ khoảng 1 phút rồi nói lại."


def available() -> bool:
    return all((REFS / f"{name}.wav").exists() for name, _label, _g in SPEAKERS)


def is_cuda_error(exc: BaseException | str) -> bool:
    s = str(exc).lower()
    return any(k in s for k in ("cuda", "cublas", "cudnn", "nvrtc", "gpu tts đứt"))


def cuda_is_dead() -> bool:
    return _cuda_dead


def fail_cuda(exc: BaseException | str) -> str:
    global _engine, _error, _cuda_dead
    with _lock:
        _engine = None
        _cuda_dead = True
        _error = str(exc)
        try:
            import torch

            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        except Exception:
            pass
        try:
            CUDA_FAIL_PATH.write_text(
                json.dumps({"at": time.time(), "error": _error, "restart": True}, ensure_ascii=False),
                encoding="utf-8",
            )
        except Exception:
            pass
        log.warning("VieNeu CUDA dead, requested docker restart: %s", _error)
    return USER_CUDA_MSG


def reset_engine() -> None:
    global _engine, _error
    with _lock:
        if _cuda_dead:
            return
        _engine = None
        _error = None
        try:
            import torch

            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        except Exception:
            pass
        log.warning("VieNeu engine reset (CUDA/session)")


def want_cuda() -> bool:
    return (os.environ.get("TTS_DEVICE") or os.environ.get("VIENEU_DEVICE") or "cuda").strip().lower() in ("cuda", "gpu")


def _engine_device() -> str:
    if _engine is None:
        return ""
    backend = getattr(_engine, "backend", "") or ""
    eng = getattr(_engine, "engine", None)
    dev = getattr(eng, "device", None) if eng is not None else None
    if dev is not None:
        kind = getattr(dev, "type", None) or str(dev)
        return str(kind)
    return backend


def status() -> dict:
    return {
        "loaded": _engine is not None,
        "error": _error,
        "cuda_dead": _cuda_dead,
        "backend": getattr(_engine, "backend", None) if _engine is not None else None,
        "device": _engine_device(),
        "want_cuda": want_cuda(),
        "voices_file": str(VOICES_JSON) if VOICES_JSON.exists() else None,
        "cloned": [name for name, _l, _g in SPEAKERS if (REFS / f"{name}.wav").exists()],
    }


def get_engine():
    global _engine, _error, _cuda_dead
    with _lock:
        if _cuda_dead:
            raise RuntimeError(USER_CUDA_MSG)
        if _engine is not None:
            return _engine
        from vieneu import Vieneu

        try:
            if want_cuda():
                import torch

                if not torch.cuda.is_available():
                    raise RuntimeError(
                        "TTS_DEVICE=cuda nhưng torch không thấy GPU. "
                        "Compose cần gpus: all và Docker Desktop NVIDIA."
                    )
                log.info(
                    "loading VieNeu v3 Turbo PyTorch CUDA device=%s",
                    torch.cuda.get_device_name(0),
                )
                tts = Vieneu(mode="v3turbo", backend="pytorch", device="cuda")
            else:
                log.info("loading VieNeu v3 Turbo ONNX fp32")
                tts = Vieneu(mode="v3turbo", backend="onnx", precision="fp32")
        except Exception as e:
            _error = str(e)
            log.exception("VieNeu load failed")
            if is_cuda_error(e):
                _cuda_dead = True
                try:
                    CUDA_FAIL_PATH.write_text(
                        json.dumps({"at": time.time(), "error": _error, "restart": True}, ensure_ascii=False),
                        encoding="utf-8",
                    )
                except Exception:
                    pass
                raise RuntimeError(USER_CUDA_MSG) from e
            raise
        loaded = _load_cloned(tts)
        if loaded:
            log.info("VieNeu loaded clones from %s: %s", VOICES_JSON, loaded)
        else:
            cloned = []
            for name, label, gender in SPEAKERS:
                wav = REFS / f"{name}.wav"
                if not wav.exists():
                    continue
                tts.add_voice(
                    name,
                    str(wav),
                    denoise=True,
                    description=f"ZeroTTS {label} clone",
                    gender=gender,
                    save=False,
                )
                cloned.append(name)
            if cloned:
                tts.save_voices(VOICES_JSON)
                log.info("VieNeu cloned voices=%s saved=%s", cloned, VOICES_JSON)
        _engine = tts
        _error = None
        _cuda_dead = False
        try:
            if CUDA_FAIL_PATH.exists():
                CUDA_FAIL_PATH.unlink()
        except Exception:
            pass
        return _engine


def _load_cloned(tts) -> list[str]:
    if not VOICES_JSON.exists():
        return []
    import json
    data = json.loads(VOICES_JSON.read_text(encoding="utf-8"))
    presets = data.get("presets") or {}
    names = []
    want = {n for n, _l, _g in SPEAKERS}
    for name, rec in presets.items():
        if name not in want or not rec.get("speaker_emb"):
            continue
        codes = None
        if rec.get("codes") is not None:
            codes = np.asarray(rec["codes"], dtype=np.int64)
            try:
                from vieneu_utils.core_utils import strip_encoder_pad_frame

                codes = strip_encoder_pad_frame(codes)
            except Exception:
                pass
        tts._preset_voices[name] = {
            "description": rec.get("description") or "",
            "gender": rec.get("gender") or "",
            "speaker_emb": np.asarray(rec["speaker_emb"], dtype=np.float32),
            "codes": codes,
        }
        names.append(name)
    return names


def resample_linear(audio: np.ndarray, src_rate: int, dst_rate: int) -> np.ndarray:
    x = np.asarray(audio, dtype=np.float32).reshape(-1)
    if src_rate == dst_rate or x.size < 2:
        return x
    n_out = max(1, int(round(x.size * dst_rate / src_rate)))
    t_src = np.linspace(0.0, 1.0, x.size, endpoint=False)
    t_dst = np.linspace(0.0, 1.0, n_out, endpoint=False)
    return np.interp(t_dst, t_src, x).astype(np.float32)


def _fade_out(audio: np.ndarray, sr: int, fade_s: float = 0.03) -> np.ndarray:
    x = np.asarray(audio, dtype=np.float32).reshape(-1)
    n = int(fade_s * sr)
    if n <= 0 or x.size <= n:
        return x
    out = np.array(x, dtype=np.float32, copy=True)
    out[-n:] *= np.linspace(1.0, 0.0, n, dtype=np.float32)
    return out


def trim_trailing_extra(audio: np.ndarray, sr: int) -> np.ndarray:
    """Drop a short extra syllable VieNeu sometimes emits after the sentence.

    v3 turbo AR can miss the stop token and add ~80–380 ms of extra phones
    (heard as 'nhỏ hơn' / 'nha' / a blip). Same family as codec pad frame 455.
    Only mute a re-attack in the last 0.5 s after >= 70 ms of low energy.
    Always fade the last 30 ms.
    """
    x = np.asarray(audio, dtype=np.float32).reshape(-1)
    if x.size < int(0.3 * sr):
        return _fade_out(x, sr)
    win = max(1, int(0.01 * sr))
    n = x.size // win
    env = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(axis=1))
    low = env < max(0.015, float(np.median(env)) * 0.22)
    span = min(n, int(0.50 * sr / win))
    end = n - 1
    while end >= n - span and low[end]:
        end -= 1
    if end < n - span:
        return _fade_out(x, sr)
    extra_start = end
    while extra_start >= n - span and not low[extra_start]:
        extra_start -= 1
    extra_start += 1
    extra_s = (end - extra_start + 1) * win / sr
    gap_end = extra_start - 1
    gap_start = gap_end
    while gap_start >= n - span and low[gap_start]:
        gap_start -= 1
    gap_s = (gap_end - gap_start) * win / sr if gap_end >= gap_start else 0.0
    extra_near_end = ((n - 1 - end) * win / sr) <= 0.08
    extra_in_tail = ((n - extra_start) * win / sr) <= 0.48
    keep_body = extra_start > int(0.25 * sr / win)
    if (
        extra_near_end
        and extra_in_tail
        and 0.05 <= extra_s <= 0.38
        and gap_s >= 0.07
        and keep_body
    ):
        cut = extra_start * win
        x = x[: max(int(0.2 * sr), cut)]
        log.info("vieneu trimmed extra tail %.0f ms (gap %.0f ms)", extra_s * 1000, gap_s * 1000)
    return _fade_out(x, sr)


def iter_pcm_f32le(text: str, speaker: str, sample_rate: int = 44100):
    tts = get_engine()
    sr = int(getattr(tts, "sample_rate", 48000))
    step = int(sample_rate * 0.32) * 4
    if getattr(tts, "backend", "") == "pytorch":
        with _lock:
            wav = tts.infer(text, voice=speaker, apply_watermark=False)
        wav = trim_trailing_extra(np.asarray(wav, dtype=np.float32).reshape(-1), sr)
        raw = resample_linear(wav, sr, sample_rate).tobytes()
        if not raw:
            return
        for i in range(0, len(raw), step):
            yield raw[i : i + step]
        return
    hold = int(sr * 0.40)
    pending: list[np.ndarray] = []
    pending_n = 0
    with _lock:
        for chunk in tts.infer_stream(text, voice=speaker, apply_watermark=False):
            x = np.asarray(chunk, dtype=np.float32).reshape(-1)
            if not x.size:
                continue
            pending.append(x)
            pending_n += x.size
            while pending_n > hold and len(pending) > 1:
                emit = pending.pop(0)
                pending_n -= emit.size
                pcm = resample_linear(emit, sr, sample_rate)
                if pcm.size:
                    yield pcm.tobytes()
        if pending:
            tail = np.concatenate(pending)
            tail = trim_trailing_extra(tail, sr)
            pcm = resample_linear(tail, sr, sample_rate)
            if pcm.size:
                yield pcm.tobytes()
