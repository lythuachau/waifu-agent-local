"""Mint local TTS for one cartesia id and one minimax id; check wire formats.

Cartesia: headerless pcm_f32le mono @ 44100 (leading encoder silence is normal).
Minimax: mp3 for AudioContext.decodeAudioData.
STT: PCM16le @ 16000 -> {interim,final,done}.
"""
from __future__ import annotations

import asyncio
import json
import struct
import sys
import urllib.request
from pathlib import Path

import numpy as np
import websockets

sys.path.insert(0, str(Path(__file__).resolve().parent / "server"))
import speech as local_speech  # noqa: E402

BASE = "http://127.0.0.1:8787"
CARTESIA = "28d0e1eb-e92e-4360-acc5-cda4776f720a"
MINIMAX = "ShiinaMahiru_61114a76a76f"


def mint(kind: str, **kw) -> dict:
    req = urllib.request.Request(
        BASE + "/api/v1/realtime/speech/session",
        data=json.dumps({"kind": kind, **kw}).encode(),
        headers={"Content-Type": "application/json", "X-ZW-Api-Key": "local"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


async def tts(voice_id: str, text: str) -> tuple[dict, bytes]:
    minted = mint("tts", voice_id=voice_id, sample_rate=24000)
    url = minted["url"]
    print("mint", voice_id, url, "provider", minted.get("voice_provider"), "format", minted.get("format"))
    async with websockets.connect(url, open_timeout=20) as ws:
        await ws.send(json.dumps({"voice_id": voice_id, "text": text}))
        chunks = []
        while True:
            msg = await asyncio.wait_for(ws.recv(), timeout=90)
            if isinstance(msg, bytes):
                chunks.append(msg)
                continue
            payload = json.loads(msg)
            print("msg", payload)
            if payload.get("type") in ("done", "error"):
                break
        return minted, b"".join(chunks)


def f32_stats(raw: bytes) -> tuple[int, float, float]:
    n = len(raw) // 4
    if n == 0:
        return 0, 0.0, 0.0
    samples = np.frombuffer(raw[: n * 4], dtype=np.float32)
    peak = float(np.max(np.abs(samples)))
    rms = float(np.sqrt(np.mean(np.square(samples))))
    return n, peak, rms


async def stt_roundtrip() -> str:
    import tempfile

    mp3 = await local_speech.edge_mp3("hello this is a voice test", "en-US-JennyNeural")
    src = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
    src.write(mp3)
    src.close()
    dest = tempfile.NamedTemporaryFile(suffix=".s16", delete=False)
    dest.close()
    try:
        pcm = local_speech.ffmpeg_convert(
            Path(src.name),
            ["-ac", "1", "-ar", "16000", "-f", "s16le", "-acodec", "pcm_s16le"],
            Path(dest.name),
        )
    finally:
        Path(src.name).unlink(missing_ok=True)
        Path(dest.name).unlink(missing_ok=True)

    minted = mint("stt", sample_rate=16000, language="en")
    url = minted["url"]
    print("stt mint", url)
    texts = []
    async with websockets.connect(url, open_timeout=20) as ws:
        first = json.loads(await asyncio.wait_for(ws.recv(), timeout=10))
        print("stt first", first)
        assert first.get("type") == "ready"
        step = 3200
        for i in range(0, len(pcm), step):
            await ws.send(pcm[i : i + step])
        await ws.send(json.dumps({"type": "end_of_speech"}))
        while True:
            msg = await asyncio.wait_for(ws.recv(), timeout=180)
            payload = json.loads(msg)
            print("stt msg", payload)
            texts.append(payload)
            if payload.get("type") in ("done", "error"):
                break
    done = next((p.get("text") or "" for p in texts if p.get("type") == "done"), "")
    return done


async def main() -> None:
    voices = json.loads(urllib.request.urlopen(BASE + "/api/v1/voices/system", timeout=10).read())
    print("voices", len(voices), [v["name"] for v in voices[:5]], "...")

    minted, raw = await tts(CARTESIA, "こんにちは、ゼラです。")
    assert minted.get("voice_provider") == "cartesia", minted
    n, peak, rms = f32_stats(raw)
    head = struct.unpack("<ffff", raw[:16]) if len(raw) >= 16 else ()
    print("cartesia bytes", len(raw), "samples", n, "head", head, "peak", peak, "rms", rms)
    assert len(raw) % 4 == 0
    assert n > 8000
    assert peak > 0.01

    minted, mp3 = await tts(MINIMAX, "Xin chào, mình là Mahiru.")
    assert minted.get("voice_provider") == "minimax", minted
    print("minimax bytes", len(mp3), "head", mp3[:8])
    mpeg = mp3[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2", b"\xff\xfa")
    wav = mp3[:4] == b"RIFF"
    assert mp3[:3] == b"ID3" or mpeg or wav
    assert len(mp3) > 4000
    if wav:
        assert mp3[8:12] == b"WAVE"

    text = await stt_roundtrip()
    print("stt text", text)
    assert text.strip(), "empty transcript"
    print("TTS_STT_OK")


if __name__ == "__main__":
    asyncio.run(main())
