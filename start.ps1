$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$dockerName = docker ps --filter "name=waifu-agent" --filter "status=running" --format "{{.Names}}" 2>$null
if ($dockerName -match "waifu-agent") {
  Write-Host "API already in Docker ($dockerName): http://127.0.0.1:8787/healthz"
  Write-Host "Logs: docker compose logs -f waifu-agent"
  Write-Host "Stop: docker compose down"
  exit 0
}

if (-not (Test-Path ".\extension\manifest.json")) {
  python .\build.py
}

$env:ZW_LOCAL_HOST = "127.0.0.1"
$env:ZW_LOCAL_PORT = "8787"
if (-not $env:LLM_BASE_URL) { $env:LLM_BASE_URL = "http://127.0.0.1:11434/v1" }
if (-not $env:LLM_API_KEY) { $env:LLM_API_KEY = "ollama" }
if (-not $env:LLM_MODEL) { $env:LLM_MODEL = "llama3.2" }
if (-not $env:TTS_VOICE) { $env:TTS_VOICE = "ja-JP-NanamiNeural" }
if (-not $env:LLM_BACKEND) { $env:LLM_BACKEND = "codex" }
if ($env:CUDA13_BIN -and (Test-Path $env:CUDA13_BIN)) {
  $env:PATH = "$($env:CUDA13_BIN);$env:PATH"
}

$busy = Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($busy) {
  Write-Host "Port 8787 already in use by PID $($busy.OwningProcess). API may already be running: http://127.0.0.1:8787/healthz"
  Write-Host "To restart: Stop-Process -Id $($busy.OwningProcess) -Force"
  exit 1
}

python -m pip install -q -r .\server\requirements.txt
Write-Host "Local API  http://127.0.0.1:8787"
Write-Host "LLM        $env:LLM_BASE_URL  model=$env:LLM_MODEL"
Write-Host "Load unpacked extension from: $PSScriptRoot\extension"
Write-Host "In the side panel: ZeroWeight API key = local"
Set-Location .\server
python .\app.py
