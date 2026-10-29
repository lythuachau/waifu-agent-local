"""Live check: avatar bundle/image, chat reply schema, TTS socket."""
from __future__ import annotations

import asyncio
import json
import urllib.request
from pathlib import Path

import httpx
import websockets

BASE = "http://127.0.0.1:8787"
EMOTIONS = {"neutral", "happy", "sad", "angry", "excited", "scared", "content"}
OUT = Path(r"E:\ll\waifu-agent-extract\self-host")
ZERA = "YMwiCnO91hgpyi1mMMHv"


def get(path: str):
    with urllib.request.urlopen(BASE + path, timeout=30) as r:
        return r.status, r.read()


async def main():
    st, body = get("/healthz")
    print("health", st, body.decode())

    st, body = get("/api/v1/avatars/system")
    avatars = json.loads(body)
    print("system", st, len(avatars), [a["name"] for a in avatars])

    st, body = get(f"/api/v1/avatars/{ZERA}/persona")
    persona = json.loads(body)
    print("persona", st, persona["display_name"], "prompt_len", len(persona["persona_prompt"]))

    req = urllib.request.Request(
        BASE + f"/api/v1/avatars/bundle/{ZERA}",
        headers={"X-ZW-Api-Key": "local"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        bundle = json.loads(r.read())
    payload = bundle["payload"]
    print("bundle", payload)
    assert payload.get("zw_local") is True
    img = payload["image"]
    st, raw = get(img.replace(BASE, "") if img.startswith(BASE) else "/static/avatars/" + ZERA + ".png")
    print("png", st, len(raw), raw[:8])
    assert raw[:8] == b"\x89PNG\r\n\x1a\n"

    chat_body = {
        "model": "zeroweight",
        "messages": [
            {"role": "system", "content": persona["persona_prompt"] + "\nAlways call the reply tool."},
            {"role": "user", "content": "Chào, nói một câu ngắn bằng tiếng Việt."},
        ],
        "tools": [{
            "type": "function",
            "function": {
                "name": "reply",
                "description": "Your reply to the user.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "emotion": {"type": "string", "enum": list(EMOTIONS)},
                        "messages": {
                            "type": "array",
                            "minItems": 1,
                            "maxItems": 3,
                            "items": {
                                "type": "object",
                                "properties": {
                                    "text": {"type": "string"},
                                    "tts_text": {"type": "string"},
                                },
                                "required": ["text", "tts_text"],
                            },
                        },
                    },
                    "required": ["emotion", "messages"],
                },
            },
        }],
        "tool_choice": {"type": "function", "function": {"name": "reply"}},
    }
    async with httpx.AsyncClient(timeout=180.0) as client:
        r = await client.post(
            BASE + "/api/v1/companion/chat/completions",
            json=chat_body,
            headers={"X-ZW-Api-Key": "local"},
        )
        print("chat status", r.status_code)
        data = r.json()
        args = json.loads(data["choices"][0]["message"]["tool_calls"][0]["function"]["arguments"])
        print("chat args", json.dumps(args, ensure_ascii=False)[:600])
        assert args["emotion"] in EMOTIONS
        assert args["messages"]
        text = args["messages"][0]["text"]
        assert text and not text.strip().startswith("{"), text
        print("CHAT_OK", args["emotion"], text)

        minted = (await client.post(
            BASE + "/api/v1/realtime/speech/session",
            json={"kind": "tts", "voice_id": "zera-local", "voice_provider": "minimax"},
            headers={"X-ZW-Api-Key": "local"},
        )).json()
        print("mint", minted["url"])

    async with websockets.connect(minted["url"], open_timeout=20) as ws:
        await ws.send(json.dumps({"voice_id": "zera-local", "text": text[:80]}))
        chunks = []
        while True:
            msg = await asyncio.wait_for(ws.recv(), timeout=60)
            if isinstance(msg, bytes):
                chunks.append(msg)
                continue
            payload = json.loads(msg)
            print("tts msg", payload)
            if payload.get("type") in ("done", "error"):
                break
        audio = b"".join(chunks)
        print("tts bytes", len(audio), audio[:12])
        (OUT / "tts-sample.bin").write_bytes(audio)
        assert len(audio) > 100
        print("TTS_OK")

    print("ALL_OK")


if __name__ == "__main__":
    asyncio.run(main())
