"""Vietnamese TTS must produce audible audio on both wire formats."""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "server"))
import speech as local_speech  # noqa: E402

CARTESIA = "28d0e1eb-e92e-4360-acc5-cda4776f720a"
MINIMAX = "ShiinaMahiru_61114a76a76f"
TEXT = "Xin chào, mình nói tiếng Việt được rồi nhé."


async def main() -> None:
    assert local_speech.looks_vietnamese(TEXT)
    pcm, fmt = await local_speech.synthesise(TEXT, voice_id=CARTESIA, provider="cartesia")
    peak = local_speech.pcm_f32_peak(pcm)
    print("cartesia", fmt, len(pcm), "peak", round(peak, 3))
    assert fmt == "pcm_f32le"
    assert peak > 0.01

    mp3, fmt = await local_speech.synthesise(TEXT, voice_id=MINIMAX, provider="minimax")
    print("minimax", fmt, len(mp3), "head", mp3[:4])
    assert fmt == "mp3"
    assert mp3[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2", b"ID") or mp3[:3] == b"ID3"
    assert len(mp3) > 4000
    print("VI_TTS_OK")


if __name__ == "__main__":
    asyncio.run(main())
