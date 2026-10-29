"""VieNeu v3 Turbo (ONNX/CPU) with ZeroTTS speaker clones.

Clone is from 5–8 s ZeroTTS WAVs, not from voice.npz latents.
i7-10700 has no VNNI → fp32 only (int8 babbles).
"""
from __future__ import annotations

import logging
import threading
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


def available() -> bool:
    return all((REFS / f"{name}.wav").exists() for name, _label, _g in SPEAKERS)


def status() -> dict:
    return {
        "loaded": _engine is not None,
        "error": _error,
        "voices_file": str(VOICES_JSON) if VOICES_JSON.exists() else None,
        "cloned": [name for name, _l, _g in SPEAKERS if (REFS / f"{name}.wav").exists()],
    }


def get_engine():
    global _engine, _error
    with _lock:
        if _engine is not None:
            return _engine
        from vieneu import Vieneu

        log.info("loading VieNeu v3 Turbo ONNX fp32")
        tts = Vieneu(mode="v3turbo", backend="onnx", precision="fp32")
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
        tts._preset_voices[name] = {
            "description": rec.get("description") or "",
            "gender": rec.get("gender") or "",
            "speaker_emb": np.asarray(rec["speaker_emb"], dtype=np.float32),
            "codes": np.asarray(rec["codes"], dtype=np.int64) if rec.get("codes") is not None else None,
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


def iter_pcm_f32le(text: str, speaker: str, sample_rate: int = 44100):
    tts = get_engine()
    sr = int(getattr(tts, "sample_rate", 48000))
    with _lock:
        for chunk in tts.infer_stream(text, voice=speaker, apply_watermark=False):
            pcm = resample_linear(chunk, sr, sample_rate)
            if pcm.size:
                yield pcm.tobytes()
