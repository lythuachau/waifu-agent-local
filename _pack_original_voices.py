"""Download original-voice research pack: CDN training clips + live Cartesia/Minimax.

Writes under server/static/voices/. Does not print the Zw_ key.
"""
from __future__ import annotations

import asyncio
import json
import struct
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

import httpx
import websockets

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "server" / "data"
OUT = ROOT / "server" / "static" / "voices"
CDN = "https://cdn-public.zeroweight.ai/"
ZW_API = "https://api.zeroweight.ai/api/v1"
NS = "{http://doc.s3.amazonaws.com/2006-03-01}"
PHRASES = {
    "ja": "こんにちは、これは元の声のテストです。",
    "en": "Hello, this is the original cloned voice.",
    "vi": "Xin chào, đây là giọng clone gốc.",
    "zh": "你好，这是原始克隆音色。",
}


def zw_key() -> str:
    p = DATA / "zw_key.txt"
    if p.exists():
        return p.read_text(encoding="utf-8").strip()
    return ""


def load_voices() -> dict:
    return json.loads((DATA / "voices.json").read_text(encoding="utf-8")).get("voices") or {}


def list_cdn(prefix: str, n: int = 8) -> list[tuple[str, int]]:
    url = CDN + "?prefix=" + urllib.parse.quote(prefix) + f"&max-keys={n}"
    raw = urllib.request.urlopen(url, timeout=20).read()
    root = ET.fromstring(raw)
    out = []
    for c in root.findall(f"{NS}Contents"):
        k = c.find(f"{NS}Key").text
        sz = int(c.find(f"{NS}Size").text)
        if k.endswith(".wav"):
            out.append((k, sz))
    return out


def download(key: str, dest: Path) -> int:
    dest.parent.mkdir(parents=True, exist_ok=True)
    url = CDN + urllib.parse.quote(key)
    urllib.request.urlretrieve(url, dest)
    return dest.stat().st_size


def pcm_f32_to_wav(pcm: bytes, dest: Path, rate: int = 44100) -> None:
    n = len(pcm) // 4
    samples = [struct.unpack_from("<f", pcm, i * 4)[0] for i in range(n)]
    frames = b"".join(
        struct.pack("<h", max(-32768, min(32767, int(x * 32767)))) for x in samples
    )
    dest.parent.mkdir(parents=True, exist_ok=True)
    import wave

    with wave.open(str(dest), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(frames)


async def live_tts(voice_id: str, provider: str, text: str) -> bytes:
    key = zw_key()
    headers = {"X-ZW-Api-Key": key, "Content-Type": "application/json"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(
            f"{ZW_API}/realtime/speech/session",
            headers=headers,
            json={
                "kind": "tts",
                "sample_rate": 24000,
                "voice_id": voice_id,
                "voice_provider": provider,
            },
        )
        body = r.json()
    url = body.get("url")
    if r.status_code >= 400 or not url:
        raise RuntimeError(f"mint {r.status_code} {body}")
    audio = bytearray()
    async with websockets.connect(url, max_size=None, open_timeout=20) as ws:
        await ws.send(json.dumps({"voice_id": voice_id, "text": text}))
        while True:
            try:
                msg = await asyncio.wait_for(ws.recv(), timeout=20)
            except asyncio.TimeoutError:
                break
            if isinstance(msg, (bytes, bytearray)):
                audio.extend(msg)
            else:
                try:
                    payload = json.loads(msg)
                except Exception:
                    payload = {}
                if payload.get("type") in ("done", "error"):
                    if payload.get("type") == "error":
                        raise RuntimeError(payload.get("message") or msg)
                    break
    return bytes(audio)


async def main() -> None:
    voices = load_voices()
    catalog = []
    OUT.mkdir(parents=True, exist_ok=True)
    for vid, rec in voices.items():
        if vid.endswith("-local"):
            continue
        provider = (rec.get("provider") or "cartesia").lower()
        label = rec.get("label") or vid
        lang = rec.get("lang") or "en"
        folder = OUT / vid
        folder.mkdir(parents=True, exist_ok=True)
        row = {
            "voice_id": vid,
            "label": label,
            "provider": provider,
            "lang": lang,
            "cdn_clips": [],
            "live": None,
        }
        prefix = f"voice/{vid}/"
        try:
            keys = list_cdn(prefix, 6)
        except Exception as e:
            keys = []
            row["cdn_error"] = str(e)
        for i, (key, sz) in enumerate(keys[:2], 1):
            dest = folder / f"cdn_{i}.wav"
            try:
                download(key, dest)
                row["cdn_clips"].append(
                    {"file": dest.name, "bytes": dest.stat().st_size, "cdn_key": key}
                )
            except Exception as e:
                row["cdn_clips"].append({"error": str(e), "cdn_key": key, "listed_bytes": sz})
        phrase = PHRASES.get(lang, PHRASES["en"])
        try:
            raw = await live_tts(vid, provider, phrase)
            if provider == "cartesia":
                dest = folder / "live.wav"
                pcm_f32_to_wav(raw, dest)
            else:
                dest = folder / "live.mp3"
                dest.write_bytes(raw)
            row["live"] = {
                "file": dest.name,
                "bytes": dest.stat().st_size,
                "raw_bytes": len(raw),
                "text": phrase,
            }
            print("live ok", label, dest.name, dest.stat().st_size)
        except Exception as e:
            row["live"] = {"error": str(e)[:240]}
            print("live fail", label, e)
        catalog.append(row)
        await asyncio.sleep(0.4)
    (OUT / "catalog.json").write_text(
        json.dumps(
            {
                "created": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "note": "cdn_*.wav = public training cache. live.* = original Cartesia/Minimax inference via ZeroWeight speech API.",
                "voices": catalog,
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    print("wrote", OUT / "catalog.json", "n=", len(catalog))


if __name__ == "__main__":
    asyncio.run(main())
