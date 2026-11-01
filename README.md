# Waifu Agent — local self-host

Run the unpacked Chrome extension against a local API. No ZeroWeight account, no `api.zeroweight.ai`, no metered credits.

What this stack replaces, and what it cannot:

| ZeroWeight piece | Local replacement |
|---|---|
| `GET /avatars/system` + `/mine` | 9 public system companions, covers saved under `server/static/avatars/` |
| `GET /avatars/{id}/persona` | `server/data/personas.json` (edit these) |
| `GET /avatars/bundle/{id}` | Offline `SignedPayloadToken` (exp 2099) pointing at `http://127.0.0.1:8787/static/zai/{id}/*.zai` |
| `/llm`, `/companion`, `/vision` | Codex (ChatGPT login on this PC) |
| `/jev/systemone` | Heuristic stub (routes chat vs task; `act` returns `none` so the LLM uses index tools) |
| speech `wss://` TTS | Local websocket `/speech/tts`: cartesia = pcm_f32le @ 44100, minimax = mp3 (edge-tts + ffmpeg) |
| speech STT | Local websocket `/speech/stt`: faster-whisper on PCM16 @ 16 kHz. VAD (`ten_vad.wasm`) stays in the CRX |
| LiveKit | 501, unused by the extension chat path |

Animated avatars run fully offline. `offline_pack.py` downloaded the 9 system `.zai` packs (~887 MiB), re-encrypted the bundles with localhost URLs, and replaced the RSA public key inside `renderer.js` WASM with `server/data/offline_rsa.pem`. Tokens live in `server/data/offline_tokens/`. No ZeroWeight API key is required at runtime. Chat, agent tools, screenshots, memory, and TTS stay on the local stack.

## 0. Prerequisites

- Git
- Chrome (load unpacked)
- Docker Desktop (WSL2) — recommended. Native Python 3.11+ is CPU TTS only.
- NVIDIA driver for GPU TTS (Docker image already has CUDA 12.4)
- Codex: side panel Cài đặt → Não → Đăng nhập Codex (or `codex login`). Ollama is off.
- Copy `server/static/zai` (~3 GB) from the old PC / USB / Drive `waifu-agent-runtime/zai`. Not on GitHub.

## 1. Build the local extension (once)

```powershell
cd E:\ll\waifu-agent-extract\self-host
python .\build.py
```

This copies `unpacked\`, rewrites `https://api.zeroweight.ai` → `http://127.0.0.1:8787`, injects the overlay, downloads the 9 public covers. Do not re-run `build.py` after the offline pack — it wipes the patched `renderer.js` and content-script overlay.

## 2. Start the API

**Docker (Windows, starts at logon):** see `DOCKER.md`. New machine:

```powershell
cd <clone>
.\scripts\new-machine.ps1
```

That builds the image, `docker compose up -d`, and registers scheduled task `WaifuAgent-Docker`. After reboot you do not run commands by hand.

**Native Python (debug / no Docker):**

```powershell
cd E:\ll\waifu-agent-extract\self-host
# optional:
# $env:TTS_DEVICE = "cuda"
.\start.ps1
```

If the `waifu-agent` container is already up, `start.ps1` exits and leaves Docker in charge.

Check `http://127.0.0.1:8787/` → `{"message":"AI Avatar Public Service Running","local":true,...}`

Pick the voice at `http://127.0.0.1:8787/settings` (Codex brain, per-avatar TTS).

## 3. Load the extension

1. Chrome → `chrome://extensions` → Developer mode → **Load unpacked**
2. Pick the `extension` folder in this clone (manifest matches `VERSION`, currently `1.0.4.61`)
3. Reload unpacked after each renderer patch
4. Open a normal `http`/`https` page (not `chrome://`). Side panel key is `local`.
5. Brain is **Codex** (Cài đặt → Não → Đăng nhập Codex). Ollama is off.

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
