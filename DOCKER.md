# Docker (Windows) — máy mới và tự chạy lúc đăng nhập

API local `http://127.0.0.1:8787` chạy trong Docker Desktop. Chrome extension vẫn load unpacked từ thư mục `extension/` trên Windows. Avatar `.zai` (~3 GB) **không** nằm trong image; compose bind-mount từ `server/static/zai`.

Không đưa `zw_key.txt` vào image.

## Máy mới (một lần)

1. Cài [Docker Desktop](https://www.docker.com/products/docker-desktop/) (WSL2) và Git.
2. Clone repo private, copy `.zai` (Drive `waifu-agent-runtime/zai` hoặc USB) vào `server/static/zai`.
3. Codex: trong side panel → Cài đặt → Não → **Đăng nhập Codex** (mã trên https://auth.openai.com/codex/device), hoặc `codex login` trên Windows. File `%USERPROFILE%\.codex\auth.json` được mount vào container.
4. Chạy:

```powershell
cd <clone>\self-host
.\scripts\setup-docker.ps1
```

Script sẽ:

- bật Docker Desktop nếu chưa chạy
- ghi `.env` (não **Codex**, không Ollama)
- `docker compose build` + `up -d`
- ghi Run key + file Startup `WaifuAgent-Docker.cmd` (logon, không cần admin)
- scheduled task cùng tên nếu Windows cho phép
- ghi Run key Docker Desktop để engine lên cùng Windows
- khởi động `cuda-watch.ps1` (CUDA fail → `docker restart` tối đa 1 lần / 10 phút)
- đợi `http://127.0.0.1:8787/healthz`

Chrome → Load unpacked → thư mục `extension`. Side panel key = `local`.

## Mỗi lần khởi động Windows

Không cần gõ lệnh. Chuỗi là:

1. Docker Desktop (Run key + AutoStart)
2. `WaifuAgent-Docker` (Startup folder + Run key) → `scripts/docker-autostart.ps1` → `docker compose up -d`
3. Container `restart: unless-stopped` cũng tự lên khi engine sẵn sàng

Log autostart: `%LOCALAPPDATA%\waifu-agent\docker-autostart.log`  
Log CUDA watch: `%LOCALAPPDATA%\waifu-agent\cuda-watch.log`

## Lệnh thường dùng

```powershell
docker compose ps
docker compose logs -f waifu-agent
docker compose down          # dừng stack
docker compose up -d         # chạy lại
.\scripts\setup-docker.ps1 -SkipBuild   # chỉ up + task, không build lại
```

Não mặc định **Codex** (không Ollama). TTS mặc định **GPU** (VieNeu PyTorch CUDA). Compose có `gpus: all`. Image CPU: `docker compose build --file Dockerfile.cpu`.

## Volume

| Mount | Mục đích |
|---|---|
| `./server/static` | avatar PNG + `.zai` |
| `./server/data` | settings, RapidOCR, VieNeu clones, personas |
| `%USERPROFILE%\.codex` | ChatGPT OAuth cho Codex |
| volume `waifu-agent-hf` | Hugging Face weights (VieNeu / ZeroTTS / whisper) lần đầu tải trong container |

Native `.\start.ps1` vẫn dùng được nếu Docker không chạy. Nếu container `waifu-agent` đang up, `start.ps1` không mở Python thứ hai.
