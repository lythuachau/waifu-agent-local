# Voice in Waifu Agent — original CRX and local self-host

## What the original extension does

Voice is **not** Web Speech API and **not** a file on disk. The side panel mints a short-lived websocket, then streams audio.

```
persona.voice_id + persona.voice_provider
        │
        ▼
POST /api/v1/realtime/speech/session
  { kind: "tts"|"stt", sample_rate, voice_id?, voice_provider?, language? }
  header X-ZW-Api-Key
        │
        ▼
{ url: wss://speech-api-prod-….run.app/api/v1/realtime/{speak|transcribe}?token=zwss_1.…,
  expires_in_seconds: 600, credits_per_second: 1, max_concurrent_sessions: 1 }
```

The API key never goes on the socket URL. `SpeechUrls` reuses a mint until <90s remain, then renews. Plan `free` allows **one** concurrent speech socket.

### TTS (Playback)

1. `say(chunks)` queues `{text, action}` from the companion `reply` tool.
2. Open `wss` (`binaryType = arraybuffer`).
3. Send JSON `{ voice_id, text }`.
4. Collect binary frames until `{type:"done"}` (or `{type:"error"}`). Timeout 20s.
5. Decode by **persona provider**, not by the mint response:
   - `cartesia` → headerless **pcm_f32le mono @ 44100** (`pcmF32ToBuffer`)
   - anything else (`minimax`) → `AudioContext.decodeAudioData` (mp3/wav/aac)
6. Play via `AudioBufferSourceNode`. `onAudio(true)` drives avatar `speaking`; end → `listening`.
7. Optional `action` chunks (`wave_hand`, …) wait on the overlay gesture (15s cap).
8. Idle socket closes after 20s.

Cartesia is the default for 22/31 local personas (Zera `28d0e1eb-…`). Minimax ids look like `zw_minimax_voice_*` or `ShiinaMahiru_61114a76a76f`.

Live TTS is billed per second the socket is open. Sample rate requested is 24 kHz; Cartesia still returns 44.1 kHz raw.

### STT (VoiceInput)

1. Mic `getUserMedia` → `AudioContext({sampleRate: 16000})`.
2. **ten_vad.wasm** runs **in the extension** (16 ms hops). No server VAD.
3. On `speechStart`, mint/open one STT socket (`/realtime/transcribe`).
4. Client sends **PCM16le mono @ 16 kHz** binary frames, then `{type:"end_of_speech"}`.
5. Server: `{type:"ready"}` → `{interim|final, text}` → `{type:"done", text}`.
6. Display name is appended as `?keywords=` on the socket URL (boost the character's name).
7. Echo: `warmUp()` while she speaks so the VAD ignores her TTS.

### What is **not** cloned locally

Cartesia/Minimax **voice clones** live on their clouds (`voice/<id>/{cartesia|minimax}/<uuid>.wav` on the public CDN is the training cache, not a player). The CRX never downloads a voice model. Self-host substitutes **edge-tts** neural speakers mapped in `server/data/voices.json`. Timbre is similar-language, not the original clone.

Platform dashboard voice catalog (`api-prod /api/v1/voices/{public,system,clone}`) needs a Firebase JWT. The extension never calls those routes; it only uses `persona.voice_id`.

## Local self-host

| Piece | Local stand-in |
|---|---|
| `POST /realtime/speech/session` | `ws://127.0.0.1:8787/speech/{tts\|stt}`, 600s, 0 credits |
| TTS cartesia | ZeroTTS (tiếng Việt) / edge-tts → ffmpeg `pcm_f32le` 44.1 kHz mono |
| TTS minimax | ZeroTTS (tiếng Việt) / edge-tts **mp3** (`decodeAudioData`) |
| STT | faster-whisper (`WHISPER_MODEL`, default `base`) on the PCM16 the CRX already sends |
| VAD | unchanged: `ten_vad.wasm` in the extension |
| Voice ids | kept from live personas; mapped to Edge Neural names |

Env: `TTS_VOICE` fallback (`ja-JP-NanamiNeural`). Microsoft `vi-VN-*` currently refuses Vietnamese text (`NoAudioReceived`). Vietnamese replies go through **ZeroTTS** (`zerotts-*` speakers, ONNX CPU @ 48 kHz) then ffmpeg; **gTTS** is the fallback. First ZeroTTS load downloads `zeroweight-ai/ZeroTTS` (~900 MB) from Hugging Face. `WHISPER_MODEL=base`. Needs `ffmpeg` on PATH.

First STT turn downloads the Whisper weight; later turns are local.

## Files

- `server/speech.py` — synth + transcribe
- `server/data/voices.json` — 25 live `voice_id` → edge voice
- `server/app.py` — mint + `/speech/{kind}` + `GET /api/v1/voices/system`

Do not re-run `build.py`; it does not touch speech. Reload unpacked after API restart only if the extension itself changed (it did not for this voice patch).

## Original Cartesia / Minimax voices (optional)

The CRX never ships a voice model. Original timbre is a cloud clone on ZeroWeight's speech gateway (`wss://speech-api-prod-….run.app`). The operator `Zw_` key can mint that socket (live check: Cartesia Zera ~395 KiB pcm_f32le peak 0.60; Minimax `ID3` mp3).

Self-host can **proxy the mint** and hand the real `wss://` URL to the extension:

1. Put the key in `ZW_KEY` or `server/data/zw_key.txt` (not in README).
2. Open `http://127.0.0.1:8787/settings` → **Nguồn giọng khi chat** → **Gốc ZeroWeight** → Lưu.
3. Chat as usual. The side-panel key stays `local`; the server uses `Zw_` only on the mint request.
4. STT stays on local Whisper so the free plan's **one concurrent speech socket** is free for TTS.
5. Billed `credits_per_second: 1` while the TTS socket is open. Local Edge/gTTS is still the fallback and the settings preview.

CDN `voice/<id>/{cartesia|minimax}/*.wav` files are clone **training** caches, not a player.

## How to use

1. `ffmpeg` on PATH (Chocolatey: `C:\ProgramData\chocolatey\bin\ffmpeg.exe`).
2. `pip install -r server/requirements.txt` (adds `edge-tts`, `faster-whisper`, `numpy`).
3. Start the API (`.\start.ps1` or `python server/app.py`). First STT turn downloads the Whisper weight (`WHISPER_MODEL`, default `base`).
4. Side panel key = any string (`local`). Unmute the character. Mic permission is the CRX page `mic-permission.html`.
5. Per-avatar Edge voice: edit `server/data/voices.json`, restart the API.

Optional env: `TTS_VOICE` (fallback Edge speaker), `WHISPER_MODEL=tiny|base|small`.

Clones are **language substitutes**. Cartesia/Minimax timbre is not reproduced. Playback in the CRX picks the decoder from `persona.voice_provider`, not from the mint JSON.
