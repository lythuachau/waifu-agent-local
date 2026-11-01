# Bootstrap a new PC from the GitHub clone.
# Preferred: Docker Desktop (API at Windows logon, GPU TTS).
# Native Python is CPU TTS only (Edge / gTTS / ZeroTTS). VieNeu GPU needs Docker.
# GitHub already has: code, extension, personas, RapidOCR ONNX, VieNeu clone WAVs.
# Copy yourself: server\static\zai (~3 GB, ~333 files). First TTS downloads HF weights.

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

function Test-Cmd([string]$name) {
  [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Find-Chrome {
  foreach ($p in @(
      (Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe"),
      (Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe"),
      (Join-Path $env:LOCALAPPDATA "Google\Chrome\Application\chrome.exe")
    )) {
    if ($p -and (Test-Path $p)) { return $p }
  }
  return $null
}

function Write-Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

Write-Step "Preflight"
$fail = $false

if (-not (Test-Cmd "git")) {
  Write-Host "Git missing. Installing Git.Git via winget..."
  if (Test-Cmd "winget") {
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
  }
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
  if (-not (Test-Cmd "git")) {
    Write-Host "ERROR: Git is required (clone + Docker pip git+ZeroTTS). Install https://git-scm.com then re-run."
    $fail = $true
  } else {
    Write-Host "Git OK: $((Get-Command git).Source)"
  }
} else {
  Write-Host "Git OK: $((Get-Command git).Source)"
}

$chrome = Find-Chrome
if ($chrome) {
  Write-Host "Chrome OK: $chrome"
} else {
  Write-Host "WARNING: Chrome not found. Load unpacked needs Chrome. Install Google Chrome, then chrome://extensions."
}

$zai = Join-Path $Root "server\static\zai"
$zaiCount = @(Get-ChildItem $zai -Recurse -File -ErrorAction SilentlyContinue).Count
if ($zaiCount -lt 300) {
  Write-Host "Avatar .zai: $zaiCount files (want ~333, ~3 GB)."
  Write-Host "  Copy into: $zai"
  Write-Host "  From the old PC, USB, or Drive folder waifu-agent-runtime/zai"
  Write-Host "  Chat still runs with static PNGs until you copy them."
} else {
  Write-Host "Avatar .zai: $zaiCount files"
}

$ext = Join-Path $Root "extension"
Write-Host "Load unpacked: $ext"

if ($fail) { exit 1 }

Write-Host ""
Write-Host "Docker path (recommended):"
Write-Host "  1. Docker Desktop (WSL2) + NVIDIA driver for GPU TTS"
Write-Host "  2. Copy server\static\zai if the count above is low"
Write-Host "  3. .\scripts\setup-docker.ps1"
Write-Host "  4. Chrome Load unpacked: $ext"
Write-Host "  5. Side panel → Cài đặt → Não → Đăng nhập Codex"
Write-Host "Details: DOCKER.md"
Write-Host ""

if (Test-Cmd "docker") {
  & (Join-Path $PSScriptRoot "setup-docker.ps1")
  exit $LASTEXITCODE
}

Write-Step "Docker CLI missing — native Python (CPU TTS)"
if (-not (Test-Cmd "python")) {
  Write-Host "ERROR: Python 3.11+ required for native fallback. Install Python, or install Docker Desktop and re-run."
  exit 1
}
Write-Host "python: $((Get-Command python).Source)"
Write-Host "Native path does not install PyTorch. VieNeu GPU TTS will not run here. Use Docker for GPU."

python -m pip install -r server/requirements.txt
if ($LASTEXITCODE -ne 0) { throw "pip install -r server/requirements.txt failed" }

Write-Host "Next:"
Write-Host "  1. .\start.ps1"
Write-Host "  2. Chrome Load unpacked: $ext"
Write-Host "  3. Side panel → Cài đặt → Não → Đăng nhập Codex"
Write-Host "First ZeroTTS/VieNeu download Hugging Face weights (~once)."
