"""Local TTS/STT that speaks the original Waifu Agent websocket protocol.

Cartesia path in the CRX: headerless pcm_f32le mono @ 44100.
Minimax path: encoded audio fed to AudioContext.decodeAudioData (mp3/wav).
STT: PCM16le mono @ 16000, then {interim|final|done}.
"""
from __future__ import annotations

import asyncio
import io
import json
import logging
import os
import re
import shutil
import subprocess
import tempfile
import threading
import wave
from pathlib import Path

import numpy as np

log = logging.getLogger("speech")

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
VOICES_PATH = DATA / "voices.json"
TTS_VOICE = os.environ.get("TTS_VOICE", "ja-JP-NanamiNeural")
WHISPER_MODEL = os.environ.get("WHISPER_MODEL", "base")
CARTESIA_RATE = 44100
STT_RATE = 16000
FFMPEG = shutil.which("ffmpeg") or r"C:\ProgramData\chocolatey\bin\ffmpeg.exe"
FALLBACK_EDGES = (
    "ja-JP-NanamiNeural",
    "en-US-JennyNeural",
    "en-US-AvaNeural",
)
VI_CHARS = re.compile(
    r"[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]",
    re.I,
)
VI_WORDS = re.compile(
    r"\b(mình|không|được|bạn|ủa|chào|gì|rồi|nhé|ơi|ạ|của|này|thế|sao|tiếng|việt|nói)\b",
    re.I,
)

_voices: dict | None = None
_whisper = None
_zerotts = None
_zerotts_error: str | None = None
_zerotts_lock = threading.Lock()
_synth_lock = threading.Lock()
_warmup_started = False

ZEROTTS_DEFAULT = "maichi"
ZEROTTS_SPEAKERS = (
    ("maichi", "Mai Chi", "nữ · trẻ · kể chuyện"),
    ("baotrang", "Bảo Trang", "nữ · tin tức"),
    ("kimoanh", "Kim Oanh", "nữ · ấm áp"),
    ("hamy", "Hà My", "nữ · hoạt hình"),
    ("giahuy", "Gia Huy", "nam · trầm ấm"),
    ("huuduc", "Hữu Đức", "nam · điềm đạm"),
    ("quangminh", "Quang Minh", "nam · tin tức"),
    ("tiendat", "Tiến Đạt", "nam · sôi nổi"),
)
ZEROTTS_IDS = {name for name, _label, _tags in ZEROTTS_SPEAKERS}

EDGE_CATALOG = [
    *[
        {
            "id": f"zerotts-{name}",
            "label": f"ZeroTTS {label} (vi · {tags})",
            "engine": "zerotts",
            "lang": "vi",
            "speaker": name,
        }
        for name, label, tags in ZEROTTS_SPEAKERS
    ],
    {"id": "gtts-vi", "label": "Google TTS — Tiếng Việt (dự phòng)", "engine": "gtts", "lang": "vi"},
    {"id": "ja-JP-NanamiNeural", "label": "Edge Nanami (ja · nữ)", "engine": "edge", "lang": "ja"},
    {"id": "ja-JP-AoiNeural", "label": "Edge Aoi (ja · nữ)", "engine": "edge", "lang": "ja"},
    {"id": "ja-JP-MayuNeural", "label": "Edge Mayu (ja · nữ)", "engine": "edge", "lang": "ja"},
    {"id": "ja-JP-ShioriNeural", "label": "Edge Shiori (ja · nữ)", "engine": "edge", "lang": "ja"},
    {"id": "en-US-JennyNeural", "label": "Edge Jenny (en · nữ)", "engine": "edge", "lang": "en"},
    {"id": "en-US-AvaNeural", "label": "Edge Ava (en · nữ)", "engine": "edge", "lang": "en"},
    {"id": "en-US-AnaNeural", "label": "Edge Ana (en · nữ)", "engine": "edge", "lang": "en"},
    {"id": "en-US-AndrewNeural", "label": "Edge Andrew (en · nam)", "engine": "edge", "lang": "en"},
    {"id": "en-GB-SoniaNeural", "label": "Edge Sonia (en-GB · nữ)", "engine": "edge", "lang": "en"},
    {"id": "zh-CN-XiaoxiaoNeural", "label": "Edge Xiaoxiao (zh · nữ)", "engine": "edge", "lang": "zh"},
    {"id": "zh-CN-XiaoyiNeural", "label": "Edge Xiaoyi (zh · nữ)", "engine": "edge", "lang": "zh"},
    {"id": "vi-VN-HoaiMyNeural", "label": "Edge Hoài My (vi · Microsoft đang lỗi)", "engine": "edge", "lang": "vi"},
    {"id": "vi-VN-NamMinhNeural", "label": "Edge Nam Minh (vi · Microsoft đang lỗi)", "engine": "edge", "lang": "vi"},
]


def settings_overlay() -> dict:
    path = DATA / "settings.json"
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def reload_voices() -> None:
    global _voices
    _voices = None


def load_voices() -> dict:
    global _voices
    if _voices is None:
        raw = json.loads(VOICES_PATH.read_text(encoding="utf-8"))
        overlay = settings_overlay()
        if overlay.get("default_edge"):
            raw["default_edge"] = overlay["default_edge"]
        if overlay.get("default_engine"):
            raw["default_engine"] = overlay["default_engine"]
        vmap = overlay.get("voice_map") or {}
        voices = dict(raw.get("voices") or {})
        for vid, spec in vmap.items():
            base = dict(voices.get(vid) or {"provider": "minimax", "label": vid, "lang": "vi"})
            if isinstance(spec, str):
                spec = {"edge": spec}
            if isinstance(spec, dict):
                base.update({k: v for k, v in spec.items() if v is not None})
            edge_id = str(base.get("edge") or "")
            if edge_id.startswith("zerotts"):
                base["engine"] = "zerotts"
            elif edge_id.startswith("gtts"):
                base["engine"] = "gtts"
            voices[vid] = base
        raw["voices"] = voices
        _voices = raw
    return _voices


def voice_info(voice_id: str | None) -> dict:
    table = load_voices()
    rec = (table.get("voices") or {}).get(voice_id or "")
    if rec:
        return rec
    return {
        "provider": "minimax",
        "edge": table.get("default_edge") or TTS_VOICE,
        "engine": table.get("default_engine") or "auto",
        "label": voice_id or "local",
        "lang": "vi",
    }


def provider_for(voice_id: str | None, personas: dict | None = None) -> str:
    if personas:
        for p in personas.values():
            if p.get("voice_id") == voice_id and p.get("voice_provider"):
                return p["voice_provider"]
    return voice_info(voice_id).get("provider") or "minimax"


def looks_vietnamese(text: str) -> bool:
    raw = text or ""
    if VI_CHARS.search(raw):
        return True
    return bool(VI_WORDS.search(raw))


def zerotts_speaker(edge: str | None) -> str:
    raw = (edge or "").strip().lower()
    if raw.startswith("zerotts-"):
        name = raw.split("-", 1)[1]
    elif raw in ZEROTTS_IDS:
        name = raw
    else:
        name = ZEROTTS_DEFAULT
    return name if name in ZEROTTS_IDS else ZEROTTS_DEFAULT


def zerotts_providers() -> list:
    """CPU is default: DirectML runs on the GPU but AR TTS is slower (~1.7×).

    Set ZEROTTS_DEVICE=dml|cuda|cpu to override. CUDA needs ORT GPU + CUDA 13.
    """
    want = (os.environ.get("ZEROTTS_DEVICE") or "cuda").strip().lower()
    try:
        import onnxruntime as ort
        avail = set(ort.get_available_providers())
    except Exception:
        return ["CPUExecutionProvider"]
    if want in ("dml", "gpu") and "DmlExecutionProvider" in avail:
        return [("DmlExecutionProvider", {"device_id": 0}), "CPUExecutionProvider"]
    if want == "cuda" and "CUDAExecutionProvider" in avail:
        return [
            ("CUDAExecutionProvider", {
                "device_id": 0,
                "arena_extend_strategy": "kSameAsRequested",
            }),
            "CPUExecutionProvider",
        ]
    return ["CPUExecutionProvider"]


def get_zerotts():
    """Load ONNX weights once. First call may download ~900 MB from Hugging Face."""
    global _zerotts, _zerotts_error
    with _zerotts_lock:
        if _zerotts is not None:
            return _zerotts
        from zerotts import ZeroTTS

        providers = zerotts_providers()
        head = providers[0][0] if isinstance(providers[0], tuple) else providers[0]
        log.info("loading ZeroTTS providers=%s", [p[0] if isinstance(p, tuple) else p for p in providers])
        try:
            _zerotts = ZeroTTS.from_pretrained(
                "zeroweight-ai/ZeroTTS",
                warmup=True,
                providers=providers,
                intra_op_num_threads=2 if head != "CPUExecutionProvider" else 4,
            )
        except Exception as e:
            if head == "CPUExecutionProvider":
                raise
            log.warning("ZeroTTS GPU load failed (%s), retrying CPU", e)
            _zerotts = ZeroTTS.from_pretrained(
                "zeroweight-ai/ZeroTTS",
                warmup=True,
                providers=["CPUExecutionProvider"],
                intra_op_num_threads=4,
            )
        _zerotts_error = None
        used = []
        for sess in (
            getattr(_zerotts, "text_encoder_sess", None),
            getattr(_zerotts, "prefix_step_sess", None),
            getattr(_zerotts, "local_frame_decode_sess", None),
        ):
            if sess is not None:
                used = sess.get_providers()
                break
        log.info("ZeroTTS ready voices=%s providers=%s", _zerotts.list_voices(), used)
        return _zerotts


def start_warmup() -> None:
    global _warmup_started
    if _warmup_started:
        return
    _warmup_started = True

    def _run() -> None:
        global _zerotts_error
        try:
            get_zerotts()
        except Exception as e:
            _zerotts_error = str(e)
            log.exception("ZeroTTS warmup failed")

    threading.Thread(target=_run, daemon=True, name="zerotts-warmup").start()


def zerotts_status() -> dict:
    providers = []
    if _zerotts is not None:
        sess = getattr(_zerotts, "local_frame_decode_sess", None)
        if sess is not None:
            providers = list(sess.get_providers())
    return {
        "loaded": _zerotts is not None,
        "error": _zerotts_error,
        "speakers": [name for name, _label, _tags in ZEROTTS_SPEAKERS],
        "providers": providers or [p[0] if isinstance(p, tuple) else p for p in zerotts_providers()],
    }


def _write_wav16(audio: np.ndarray, sample_rate: int, dest: Path) -> None:
    pcm = np.clip(np.asarray(audio, dtype=np.float32).reshape(-1) * 32767.0, -32768, 32767).astype(np.int16)
    with wave.open(str(dest), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(int(sample_rate))
        w.writeframes(pcm.tobytes())


def float_to_mp3(audio: np.ndarray, sample_rate: int) -> bytes:
    src = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    src.close()
    dest = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
    dest.close()
    try:
        _write_wav16(audio, sample_rate, Path(src.name))
        return ffmpeg_convert(
            Path(src.name),
            ["-ac", "1", "-ar", "24000", "-codec:a", "libmp3lame", "-q:a", "4"],
            Path(dest.name),
        )
    finally:
        Path(src.name).unlink(missing_ok=True)
        Path(dest.name).unlink(missing_ok=True)


def float_to_pcm_f32le(audio: np.ndarray, sample_rate: int, rate: int = CARTESIA_RATE) -> bytes:
    src = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    src.close()
    dest = tempfile.NamedTemporaryFile(suffix=".f32", delete=False)
    dest.close()
    try:
        _write_wav16(audio, sample_rate, Path(src.name))
        return ffmpeg_convert(
            Path(src.name),
            ["-ac", "1", "-ar", str(rate), "-f", "f32le", "-acodec", "pcm_f32le"],
            Path(dest.name),
        )
    finally:
        Path(src.name).unlink(missing_ok=True)
        Path(dest.name).unlink(missing_ok=True)


def resample_linear(audio: np.ndarray, src_rate: int, dst_rate: int) -> np.ndarray:
    x = np.asarray(audio, dtype=np.float32).reshape(-1)
    if src_rate == dst_rate or x.size < 2:
        return x
    n_out = max(1, int(round(x.size * dst_rate / src_rate)))
    t_src = np.linspace(0.0, 1.0, x.size, endpoint=False)
    t_dst = np.linspace(0.0, 1.0, n_out, endpoint=False)
    return np.interp(t_dst, t_src, x).astype(np.float32)


def zerotts_text_segments(text: str) -> list[str]:
    from zerotts.chunking import chunk_text, clean_segment_punctuation, normalize_punctuation

    segs = [
        clean_segment_punctuation(s)
        for s in chunk_text(normalize_punctuation(text), max_chunk_sec=15.0)
    ]
    return [s for s in segs if s.strip()] or [text]


def will_use_zerotts(text: str, voice_id: str | None) -> tuple[bool, str]:
    info = voice_info(voice_id)
    table = load_voices()
    edge = info.get("edge") or table.get("default_edge") or TTS_VOICE
    engine = (info.get("engine") or table.get("default_engine") or "auto").lower()
    if str(edge).startswith("zerotts"):
        engine = "zerotts"
    speaker = zerotts_speaker(edge)
    use = engine == "zerotts" or (engine == "auto" and looks_vietnamese(text or ""))
    return use, speaker


def iter_zerotts_pcm_f32le(text: str, speaker: str):
    """Yield Cartesia-wire pcm_f32le @ 44100 chunks from ZeroTTS.synthesize_stream."""
    tts = get_zerotts()
    sr = int(tts.sample_rate)
    with _synth_lock:
        for seg in zerotts_text_segments(text):
            for chunk in tts.synthesize_stream(
                seg,
                voice=speaker,
                first_chunk_frames=2,
                max_chunk_frames=8,
            ):
                pcm = resample_linear(chunk, sr, CARTESIA_RATE)
                if pcm.size:
                    yield pcm.tobytes()


def _zerotts_float(text: str, speaker: str) -> tuple[np.ndarray, int]:
    tts = get_zerotts()
    from zerotts.audio import concat_with_silence

    segs = zerotts_text_segments(text)
    chunks: list[np.ndarray] = []
    with _synth_lock:
        for seg in segs:
            chunks.append(tts.synthesize(seg, voice=speaker))
    audio = concat_with_silence(chunks, 0.12, tts.sample_rate) if len(chunks) > 1 else chunks[0]
    return np.asarray(audio, dtype=np.float32), int(tts.sample_rate)


def gtts_mp3(text: str, lang: str = "vi") -> bytes:
    from gtts import gTTS

    buf = io.BytesIO()
    gTTS(text=text, lang=lang, slow=False).write_to_fp(buf)
    return buf.getvalue()


async def vi_mp3(text: str) -> bytes:
    try:
        data = await asyncio.to_thread(gtts_mp3, text, "vi")
        if data:
            return data
    except Exception as e:
        log.warning("gTTS vi failed: %s", e)
    return b""


async def edge_mp3(text: str, voice: str) -> bytes:
    import edge_tts

    buf = bytearray()
    async for chunk in edge_tts.Communicate(text, voice).stream():
        if chunk.get("type") == "audio":
            buf.extend(chunk.get("data") or b"")
    return bytes(buf)


async def edge_mp3_with_fallback(text: str, preferred: str) -> bytes:
    tried: list[str] = []
    for voice in (preferred, TTS_VOICE, *FALLBACK_EDGES):
        if not voice or voice in tried:
            continue
        tried.append(voice)
        try:
            data = await edge_mp3(text, voice)
        except Exception as e:
            log.warning("edge-tts %s: %s", voice, e)
            continue
        if data:
            if voice != preferred:
                log.warning("edge-tts fallback %s -> %s (%s bytes)", preferred, voice, len(data))
            return data
        log.warning("edge-tts %s returned empty audio", voice)
    return b""


def ffmpeg_convert(src: Path, args: list[str], dest: Path) -> bytes:
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src), *args, str(dest)]
    proc = subprocess.run(cmd, capture_output=True, timeout=60)
    if proc.returncode != 0:
        err = (proc.stderr or b"").decode("utf-8", "replace").strip()
        raise RuntimeError(err or f"ffmpeg exit {proc.returncode}")
    return dest.read_bytes()


def pcm_f32_peak(raw: bytes) -> float:
    if len(raw) < 4:
        return 0.0
    n = (len(raw) // 4) * 4
    return float(np.max(np.abs(np.frombuffer(raw[:n], dtype=np.float32)))) if n else 0.0


def mp3_to_pcm_f32le(mp3: bytes, rate: int = CARTESIA_RATE) -> bytes:
    src = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
    src.write(mp3)
    src.close()
    dest = tempfile.NamedTemporaryFile(suffix=".f32", delete=False)
    dest.close()
    try:
        return ffmpeg_convert(
            Path(src.name),
            ["-ac", "1", "-ar", str(rate), "-f", "f32le", "-acodec", "pcm_f32le"],
            Path(dest.name),
        )
    finally:
        Path(src.name).unlink(missing_ok=True)
        Path(dest.name).unlink(missing_ok=True)


def silent_pcm_f32(seconds: float = 0.4, rate: int = CARTESIA_RATE) -> bytes:
    n = max(int(rate * seconds), 1)
    return b"\x00\x00\x00\x00" * n


def silent_wav(seconds: float = 0.4, rate: int = 24000) -> bytes:
    n = max(int(rate * seconds), 1)
    buf = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    buf.close()
    with wave.open(buf.name, "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(b"\x00\x00" * n)
    data = Path(buf.name).read_bytes()
    Path(buf.name).unlink(missing_ok=True)
    return data


async def synthesise(
    text: str,
    *,
    voice_id: str | None,
    provider: str | None,
    edge: str | None = None,
    engine: str | None = None,
    strict: bool = False,
) -> tuple[bytes, str]:
    """Return (audio_bytes, wire_format) where wire_format is 'pcm_f32le' or 'mp3'."""
    text = (text or "").strip() or "."
    info = voice_info(voice_id)
    table = load_voices()
    prov = (provider or info.get("provider") or "minimax").lower()
    edge = edge or info.get("edge") or table.get("default_edge") or TTS_VOICE
    engine = (engine or info.get("engine") or table.get("default_engine") or "auto").lower()
    if str(edge).startswith("zerotts"):
        engine = "zerotts"
    elif str(edge).startswith("gtts"):
        engine = "gtts"
    speaker = zerotts_speaker(edge)
    mp3 = b""
    zt_audio: np.ndarray | None = None
    zt_sr = 48000
    use_zerotts = engine == "zerotts" or (engine == "auto" and looks_vietnamese(text))
    if use_zerotts:
        try:
            zt_audio, zt_sr = await asyncio.to_thread(_zerotts_float, text, speaker)
            if zt_audio is None or not np.asarray(zt_audio).size:
                zt_audio = None
            else:
                log.info(
                    "tts vi ZeroTTS speaker=%s samples=%s sr=%s",
                    speaker,
                    int(np.asarray(zt_audio).size),
                    zt_sr,
                )
        except Exception as e:
            log.warning("ZeroTTS failed: %s", e)
            zt_audio = None
            if engine == "zerotts" and strict:
                raise RuntimeError(f"ZeroTTS lỗi: {e}") from e
    if zt_audio is not None:
        if prov == "cartesia":
            try:
                pcm = float_to_pcm_f32le(zt_audio, zt_sr)
                if pcm_f32_peak(pcm) > 1e-4:
                    return pcm, "pcm_f32le"
                log.warning("ZeroTTS cartesia peak ~0 speaker=%s", speaker)
            except Exception as e:
                log.warning("ZeroTTS pcm convert: %s", e)
        try:
            mp3 = float_to_mp3(zt_audio, zt_sr)
        except Exception as e:
            log.warning("ZeroTTS mp3 convert: %s", e)
            if engine == "zerotts" and strict:
                raise RuntimeError(f"ZeroTTS convert lỗi: {e}") from e
    if not mp3:
        allow_gtts = engine == "gtts" or (
            looks_vietnamese(text) and engine in ("auto", "zerotts") and not (strict and engine == "zerotts")
        )
        if allow_gtts:
            mp3 = await vi_mp3(text)
            if mp3:
                log.info("tts vi gTTS %s bytes", len(mp3))
    if not mp3 and engine not in ("gtts", "zerotts"):
        if strict:
            try:
                mp3 = await edge_mp3(text, edge)
            except Exception as e:
                log.warning("edge-tts preview %s: %s", edge, e)
                mp3 = b""
        else:
            mp3 = await edge_mp3_with_fallback(text, edge)
    if strict and not mp3:
        raise RuntimeError(f"Không tạo được audio cho {edge or engine}")
    if prov == "cartesia":
        if mp3:
            try:
                pcm = mp3_to_pcm_f32le(mp3)
                if pcm_f32_peak(pcm) > 1e-4:
                    return pcm, "pcm_f32le"
                log.warning("cartesia pcm peak ~0, voice=%s bytes=%s", edge, len(pcm))
            except Exception as e:
                log.warning("ffmpeg pcm_f32le failed: %s", e)
        return silent_pcm_f32(max(0.35, min(len(text.split()) * 0.28, 8.0))), "pcm_f32le"
    if mp3:
        return mp3, "mp3"
    return silent_wav(max(0.35, min(len(text.split()) * 0.28, 8.0))), "wav"


def pcm16_to_float32(pcm: bytes) -> np.ndarray:
    if not pcm:
        return np.zeros(0, dtype=np.float32)
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0


def whisper_model():
    global _whisper
    if _whisper is None:
        from faster_whisper import WhisperModel

        _whisper = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
    return _whisper


def transcribe_pcm16(pcm: bytes, language: str | None = None, prompt: str | None = None) -> str:
    audio = pcm16_to_float32(pcm)
    if audio.size < STT_RATE * 0.15:
        return ""
    model = whisper_model()
    kwargs = {"beam_size": 1, "vad_filter": True}
    if language:
        kwargs["language"] = language
    if prompt:
        kwargs["initial_prompt"] = prompt
    segments, _info = model.transcribe(audio, **kwargs)
    return "".join(seg.text for seg in segments).strip()


def list_system_voices() -> list[dict]:
    table = load_voices()
    out = []
    for vid, rec in (table.get("voices") or {}).items():
        out.append(
            {
                "id": vid,
                "name": rec.get("label") or vid,
                "provider": rec.get("provider"),
                "local_engine": rec.get("engine") or "edge-tts",
                "local_voice": rec.get("edge"),
                "lang": rec.get("lang"),
            }
        )
    return out
