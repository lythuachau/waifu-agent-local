# Ensure NVIDIA driver + CUDA so Docker `gpus: all` / VieNeu TTS can run.
# Docker image already has CUDA 12.4 runtime. The host needs a recent NVIDIA driver.
# If nvidia-smi is missing, install NVIDIA CUDA Toolkit (winget Nvidia.CUDA).
#
# Usage:
#   .\scripts\install-cuda.ps1
#   .\scripts\setup-docker.ps1   # calls this automatically

$ErrorActionPreference = "Continue"

function Get-NvidiaSmi {
    $cmd = Get-Command nvidia-smi -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    foreach ($p in @(
            (Join-Path $env:ProgramFiles "NVIDIA Corporation\NVSMI\nvidia-smi.exe"),
            (Join-Path $env:SystemRoot "System32\nvidia-smi.exe")
        )) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

function Test-NvidiaGpu {
    $g = Get-CimInstance Win32_VideoController -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match "NVIDIA" }
    return [bool]$g
}

function Install-WingetId([string]$id) {
    Write-Host "winget install $id ..."
    winget install -e --id $id --accept-package-agreements --accept-source-agreements
    return ($LASTEXITCODE -eq 0)
}

Write-Host "==> NVIDIA / CUDA"

if (-not (Test-NvidiaGpu)) {
    Write-Host "No NVIDIA GPU. Chat and Codex work. GPU TTS (VieNeu) will not."
    Write-Host "Need an NVIDIA card (this stack uses CUDA 12.4 in Docker)."
    return
}

$smi = Get-NvidiaSmi
if ($smi) {
    & $smi --query-gpu=name,driver_version,memory.total --format=csv,noheader
    Write-Host "nvidia-smi OK. Docker GPU uses the driver; CUDA toolkit inside the image."
    return
}

Write-Host "NVIDIA GPU present, nvidia-smi missing. Installing CUDA Toolkit (Nvidia.CUDA)..."
$ok = $false
if (Get-Command winget -ErrorAction SilentlyContinue) {
    $ok = Install-WingetId "Nvidia.CUDA"
} else {
    Write-Host "winget not found."
}

$smi = Get-NvidiaSmi
if ($smi) {
    & $smi --query-gpu=name,driver_version --format=csv,noheader
    Write-Host "CUDA/driver ready."
    return
}

Write-Host "Still no nvidia-smi. Install a Game Ready/Studio driver, then reboot:"
Write-Host "  https://www.nvidia.com/Download/index.aspx"
Write-Host "  CUDA Toolkit: https://developer.nvidia.com/cuda-downloads"
Write-Host "Re-run .\scripts\setup-docker.ps1 after reboot."
if (-not $ok) {
    Write-Host "winget Nvidia.CUDA did not finish. TTS GPU will fail until the driver is installed."
}
