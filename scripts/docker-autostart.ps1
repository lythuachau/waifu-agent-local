# Called at Windows logon. Waits for Docker Desktop, then starts the compose stack.
$ErrorActionPreference = "Continue"
$Root = Split-Path $PSScriptRoot -Parent
$LogDir = Join-Path $env:LOCALAPPDATA "waifu-agent"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$Log = Join-Path $LogDir "docker-autostart.log"

function Write-Log([string]$msg) {
    $line = "{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
    Add-Content -Path $Log -Value $line
}

Write-Log "autostart begin root=$Root"

$dockerExe = @(
    "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    "${env:ProgramFiles}\Docker\Docker\Docker Desktop.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

$deadline = (Get-Date).AddMinutes(6)
$engine = $false
while ((Get-Date) -lt $deadline) {
    try {
        docker info --format "{{.ServerVersion}}" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $engine = $true; break }
    } catch {}
    if ($dockerExe -and -not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
        Write-Log "starting Docker Desktop"
        Start-Process $dockerExe | Out-Null
    }
    Start-Sleep -Seconds 5
}

if (-not $engine) {
    Write-Log "FAILED docker engine not ready"
    exit 1
}

Set-Location $Root
Write-Log "docker compose up -d"
docker compose up -d --remove-orphans 2>&1 | ForEach-Object { Write-Log "$_" }
$code = $LASTEXITCODE
Write-Log "compose exit=$code"
exit $code
