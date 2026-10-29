# Official backend map — what source exists, what does not

The Chrome extension is **not** the TTS engine. It mints a websocket and plays bytes. The clone timbre lives on Cartesia / Minimax, reached through ZeroWeight's speech Cloud Run.

```
CRX (source we have)
  POST api.zeroweight.ai /realtime/speech/session   + X-ZW-Api-Key
        │
        ▼
  wss://speech-api-prod-….run.app /realtime/speak?token=zwss_1.…
        │
        ├─ POST /api/v1/tts/cartesia   → Cartesia cloud clone (pcm_f32le)
        └─ POST /api/v1/tts/minimax    → Minimax cloud clone (mp3)
```

## What was extracted

| Piece | Where | Enough to self-host? |
|---|---|---|
| Extension UI / agent / voice player | `unpacked/`, `src-reconstructed/`, `self-host/extension/` | Yes (already running) |
| `api.zeroweight.ai` FastAPI contract | `s3-dump/files/api/openapi-discovered.json` | Contract only, no Python |
| Speech Cloud Run contract | `self-host/server/data/speech-openapi.json` | Contract only. Service title **API Speech Service 1.0.0** |
| ZeroTTS (Vietnamese, CPU, ONNX) | `backend-src/ZeroTTS/` clone of https://github.com/zeroweight-ai/ZeroTTS | Yes, for 8 VI speakers + `.zip` latents |
| Avatar clone audio | `self-host/server/static/voices/` | Samples for research, not an engine |
| CDN `zerotts.pt` (899 MiB) | public bucket | Research checkpoint; inference is the HF/ONNX ZeroTTS repo, not this `.pt` |

Speech OpenAPI routes (no worker source on the CDN):

- `POST /api/v1/tts/cartesia` `{text, voice_id}` → `{audio}` base64 pcm_f32le
- `POST /api/v1/tts/minimax` `{text, voice_id}` → `{audio}` mp3
- `POST /api/v1/public/tts/{cartesia,minimax}` same, header `X-ZW-Api-Key`
- `POST /api/v1/internal/session-token` `{api_key, scope: stt|tts}`
- `POST /api/v1/transcribe`, realtime-token, tts upload-url

`GET https://speech-api-prod-572699095798.asia-southeast1.run.app/` → `{"message":"API Speech Service running"}`. `/health` → `{"status":"ok"}`. `/docs` is Swagger.

## What cannot be pulled

- Python of `speech-api-prod` (Cloud Run image, not on `cdn-public`)
- Cartesia / Minimax weights or their clone databases (third-party SaaS; ZW holds the vendor keys)
- ZeroTTS **voice encoder** (HF README: encoder is unpublished; clones come as `.npz` / platform `.zip`)

So avatar voices (Zera Cartesia UUID, Minimax `zw_minimax_voice_*`) **cannot** be reproduced offline as the original engine. They can be used live via the local mint proxy (`tts_gateway=zeroweight`).

## How to use original clones today

1. `http://127.0.0.1:8787/settings` → **Gốc ZeroWeight** → Lưu
2. Chat. Side-panel key stays `local`; server mints with `Zw_`
3. Listen to captured originals: `http://127.0.0.1:8787/voices`

## ZeroTTS local (Vietnamese chat / preview)

Wired into `server/speech.py`. `default_engine=auto` plus Vietnamese text uses ZeroTTS (speaker `maichi` unless the catalog id is `zerotts-<name>`). Catalog ids: `zerotts-maichi`, `zerotts-baotrang`, `zerotts-kimoanh`, `zerotts-hamy`, `zerotts-giahuy`, `zerotts-huuduc`, `zerotts-quangminh`, `zerotts-tiendat`. gTTS remains the fallback. Settings: `/settings` → Engine local.

```
pip install zerotts
```

Eight baked speakers. Platform `.zip` clones install with `tts.add_voices("voice.zip")`. This is **not** Cartesia Zera. First load downloads ~900 MB from Hugging Face (`zeroweight-ai/ZeroTTS`).

## Frontend source already on disk

`src-reconstructed/packages/extension/src/character/voice/` — `playback.ts` (Cartesia pcm_f32le @ 44100 vs Minimax decodeAudioData), `stt.ts`, `vad.ts`.
