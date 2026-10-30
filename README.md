# Waifu Agent — local self-host

Run the unpacked Chrome extension against a local API. No ZeroWeight account, no `api.zeroweight.ai`, no metered credits.

What this stack replaces, and what it cannot:

| ZeroWeight piece | Local replacement |
|---|---|
| `GET /avatars/system` + `/mine` | 9 public system companions, covers saved under `server/static/avatars/` |
| `GET /avatars/{id}/persona` | `server/data/personas.json` (edit these) |
| `GET /avatars/bundle/{id}` | Offline `SignedPayloadToken` (exp 2099) pointing at `http://127.0.0.1:8787/static/zai/{id}/*.zai` |
| `/llm`, `/companion`, `/vision` | OpenAI-compatible proxy → Ollama, or Codex (ChatGPT login on this PC) |
| `/jev/systemone` | Heuristic stub (routes chat vs task; `act` returns `none` so the LLM uses index tools) |
| speech `wss://` TTS | Local websocket `/speech/tts`: cartesia = pcm_f32le @ 44100, minimax = mp3 (edge-tts + ffmpeg) |
| speech STT | Local websocket `/speech/stt`: faster-whisper on PCM16 @ 16 kHz. VAD (`ten_vad.wasm`) stays in the CRX |
| LiveKit | 501, unused by the extension chat path |

Animated avatars run fully offline. `offline_pack.py` downloaded the 9 system `.zai` packs (~887 MiB), re-encrypted the bundles with localhost URLs, and replaced the RSA public key inside `renderer.js` WASM with `server/data/offline_rsa.pem`. Tokens live in `server/data/offline_tokens/`. No ZeroWeight API key is required at runtime. Chat, agent tools, screenshots, memory, and TTS stay on the local stack.

## 0. Prerequisites

- Python 3.11+
- Chrome (load unpacked)
- ZeroTTS Python package from `https://github.com/lythuachau/ZeroTTS` (pulled by `start.ps1` via `server/requirements.txt`; not PyPI)
- An LLM backend:
  - Default brain: **Codex** (`codex login`) for Jev + agent; Ollama then regex if Codex fails
  - Ollama fallback: `ollama serve` then `ollama pull dolphin-llama3:8b`. Heavier local: `ollama pull qwen2.5:7b` at `/settings`
  - Offline: `/settings` → Backend **Ollama only**
  - LM Studio: local server on `http://127.0.0.1:1234/v1`

## 1. Build the local extension (once)

```powershell
cd E:\ll\waifu-agent-extract\self-host
python .\build.py
```

This copies `unpacked\`, rewrites `https://api.zeroweight.ai` → `http://127.0.0.1:8787`, injects the overlay, downloads the 9 public covers. Do not re-run `build.py` after the offline pack — it wipes the patched `renderer.js` and content-script overlay.

## 2. Start the API

**Docker (Windows, starts at logon):** see `DOCKER.md`. New machine:

```powershell
cd E:\ll\waifu-agent-extract\self-host
.\scripts\setup-docker.ps1
```

That builds the image, `docker compose up -d`, and registers scheduled task `WaifuAgent-Docker`. After reboot you do not run commands by hand.

**Native Python (debug / no Docker):**

```powershell
cd E:\ll\waifu-agent-extract\self-host
# optional:
# $env:LLM_BASE_URL = "http://127.0.0.1:11434/v1"
# $env:LLM_MODEL = "dolphin-llama3:8b"
# $env:LLM_API_KEY = "ollama"
# $env:TTS_VOICE = "ja-JP-NanamiNeural"
.\start.ps1
```

If the `waifu-agent` container is already up, `start.ps1` exits and leaves Docker in charge.

Check `http://127.0.0.1:8787/` → `{"message":"AI Avatar Public Service Running","local":true,...}`

Pick the LLM and voice at `http://127.0.0.1:8787/settings` (Ollama vs Codex, model list, per-avatar TTS).

## 3. Load the extension

1. Chrome → `chrome://extensions` → Developer mode → **Load unpacked**
2. Pick `E:\ll\waifu-agent-extract\self-host\extension` (manifest `1.0.4.18`)
3. Reload unpacked after each renderer patch
4. Open `http://127.0.0.1:8787/stage` (not `chrome://`). Side panel no longer asks for an API key; it uses `local` against this host.
5. Advanced LLM: **Ollama local** (default) or **ChatGPT (Codex trên máy này)**. Paid OpenAI / Anthropic / Typesafe Jev key fields are removed.

## 4. Edit characters

`server/data/personas.json` — `persona_prompt`, `persona_knowledge`, `actions`, `voice_id`.
`server/data/avatars.json` — picker list. Drop extra PNGs into `server/static/avatars/<id>.png` and add an entry.

Restart the API after edits. The extension caches personas; toggle the companion or reload the extension.

## 5. Files

```
self-host/
  build.py
  start.ps1
  Dockerfile
  docker-compose.yml
  DOCKER.md
  scripts/setup-docker.ps1
  README.md
  extension/          patched CRX (generated)
  server/
    app.py
    requirements.txt
    data/personas.json
    data/avatars.json
    data/offline_tokens/
    data/offline_bundles/
    data/offline_rsa.pem
    static/avatars/
    static/zai/{id}/*.zai   # local only, not on GitHub (~3 GB)
```

## GitHub (private)

Repo: `https://github.com/lythuachau/waifu-agent-local` (private). Working copy: this folder.

Two tracks:

1. **Mỗi lần sửa** — commit `main` + `git push`. Snapshot đang làm.
2. **Phiên bản hoàn thành** (bạn nói chốt, ví dụ `1.0.4.11`) — bump `extension/manifest.json` + `VERSION`, tag `vX.Y.Z.W`, `gh release create`.

Không đẩy: `server/data/zw_key.txt`, `server/static/zai/` (clip avatar, giữ trên máy). Clone máy mới cần copy lại thư mục `zai/` từ máy này.
