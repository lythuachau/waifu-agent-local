# Bootstrap a new PC from the GitHub clone.
# Preferred: Docker Desktop so the API starts at Windows logon.
# Fallback: native Python (below) if you skip Docker.
# GitHub already has: code, extension, personas, RapidOCR, VieNeu clones.
# Still needed locally: .zai packs (~3 GB), HF weights (first TTS), optional CUDA 13.

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "Docker path (recommended):"
Write-Host "  1. Install Docker Desktop (WSL2)"
Write-Host "  2. Copy server\static\zai from Drive waifu-agent-runtime/zai or the old PC"
Write-Host "  3. Codex: side panel Cài đặt → Não → Đăng nhập Codex"
Write-Host "  4. .\scripts\setup-docker.ps1"
Write-Host "  5. Chrome Load unpacked: $(Join-Path (Get-Location) 'extension')"
Write-Host "Details: DOCKER.md"
Write-Host ""

if (Get-Command docker -ErrorAction SilentlyContinue) {
  & (Join-Path $PSScriptRoot "setup-docker.ps1")
  exit $LASTEXITCODE
}

Write-Host "Docker CLI missing — native Python fallback."
python -m pip install -r server/requirements.txt
python -m pip install onnxruntime-gpu
if (Test-Path "E:\ll\cuda13-runtime\bin") {
  $env:PATH = "E:\ll\cuda13-runtime\bin;$env:PATH"
}

Write-Host "Next:"
Write-Host "  1. Codex login (side panel Cài đặt → Não)"
Write-Host "  2. .\start.ps1"
Write-Host "  3. Chrome Load unpacked: $(Join-Path (Get-Location) 'extension')"
Write-Host "First VieNeu TTS downloads weights from Hugging Face (~once)."
