# One-shot Docker setup for this PC and for a new machine.
# Installs/starts Docker Desktop, builds the API image, compose up,
# and registers a logon task so the stack comes back after reboot.
#
# Usage:
#   .\scripts\setup-docker.ps1
#   .\scripts\setup-docker.ps1 -BundledOllama     # Ollama inside Compose (new PC)
#   .\scripts\setup-docker.ps1 -SkipBuild         # reuse image

param(
    [switch]$BundledOllama,
    [switch]$SkipBuild,
    [switch]$SkipOllamaPull
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

function Write-Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

function Test-DockerEngine {
    try {
        docker info --format "{{.ServerVersion}}" 2>$null | Out-Null
        return ($LASTEXITCODE -eq 0)
    } catch {
        return $false
    }
}

function Wait-DockerEngine([int]$timeoutSec = 180) {
    $deadline = (Get-Date).AddSeconds($timeoutSec)
    while ((Get-Date) -lt $deadline) {
        if (Test-DockerEngine) { return $true }
        Start-Sleep -Seconds 4
    }
    return $false
}

function Test-HostOllama {
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:11434/api/tags" -TimeoutSec 3 -UseBasicParsing
        return ($r.StatusCode -eq 200)
    } catch {
        return $false
    }
}

Write-Step "Docker Desktop"
$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerCmd) {
    Write-Host "Docker CLI not on PATH. Installing Docker Desktop via winget..."
    winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
    Write-Host "Start Docker Desktop once, finish the first-run wizard, then re-run this script."
    exit 1
}

if (-not (Test-DockerEngine)) {
    $dd = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dd) {
        Write-Host "Starting Docker Desktop..."
        Start-Process $dd | Out-Null
    }
    if (-not (Wait-DockerEngine 180)) {
        throw "Docker engine did not become ready. Open Docker Desktop and re-run."
    }
}
Write-Host "Docker engine ready."

Write-Step "Docker Desktop auto-start at logon"
$runKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
$dd = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dd) {
    New-ItemProperty -Path $runKey -Name "Docker Desktop" -Value "`"$dd`"" -PropertyType String -Force | Out-Null
}

Write-Step ".env"
$envPath = Join-Path $Root ".env"
$example = Join-Path $Root ".env.example"
if (-not (Test-Path $envPath)) {
    Copy-Item $example $envPath
}

$hostOllama = Test-HostOllama
$useBundled = $BundledOllama -or (-not $hostOllama)
$envLines = Get-Content $envPath
$envLines = $envLines | Where-Object { $_ -notmatch '^\s*LLM_BASE_URL=' -and $_ -notmatch '^\s*COMPOSE_PROFILES=' }
if ($useBundled) {
    $envLines += "LLM_BASE_URL=http://ollama:11434/v1"
    $envLines += "COMPOSE_PROFILES=bundled-ollama"
    Write-Host "LLM: bundled Ollama container"
} else {
    $envLines += "LLM_BASE_URL=http://host.docker.internal:11434/v1"
    Write-Host "LLM: host Ollama at 127.0.0.1:11434"
}
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines($envPath, @($envLines), $utf8)

$codexDir = Join-Path $env:USERPROFILE ".codex"
New-Item -ItemType Directory -Force -Path $codexDir | Out-Null

$zai = Join-Path $Root "server\static\zai"
$zaiCount = @(Get-ChildItem $zai -Recurse -File -ErrorAction SilentlyContinue).Count
if ($zaiCount -lt 300) {
    Write-Host "Avatar .zai packs: $zaiCount files (want 333). Chat still works with static PNGs."
    Write-Host "Copy from the other PC or: rclone copy hi:waifu-agent-runtime/zai `"$zai`""
} else {
    Write-Host "Avatar .zai packs: $zaiCount files"
}

Write-Step "Free port 8787 (native python)"
Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($proc -and $proc.ProcessName -match "python|uvicorn") {
            Write-Host "Stopping native API PID $($proc.Id)"
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
Start-Sleep -Seconds 1

if (-not $SkipBuild) {
    Write-Step "docker compose build (first run takes several minutes)"
    docker compose build
    if ($LASTEXITCODE -ne 0) { throw "docker compose build failed" }
}

Write-Step "docker compose up -d"
docker compose up -d --remove-orphans
if ($LASTEXITCODE -ne 0) { throw "docker compose up failed" }

if ($useBundled -and -not $SkipOllamaPull) {
    Write-Step "ollama pull dolphin-llama3:8b (inside waifu-ollama)"
    $pullDeadline = (Get-Date).AddMinutes(2)
    while ((Get-Date) -lt $pullDeadline) {
        docker exec waifu-ollama ollama list 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { break }
        Start-Sleep -Seconds 3
    }
    docker exec waifu-ollama ollama pull dolphin-llama3:8b
}

Write-Step "Autostart at Windows logon"
$taskName = "WaifuAgent-Docker"
$ps = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$script = Join-Path $PSScriptRoot "docker-autostart.ps1"
$arg = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$script`""
$runCmd = "`"$ps`" $arg"
New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name $taskName -Value $runCmd -PropertyType String -Force | Out-Null
Write-Host "Run key: $taskName"

$startupDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"
New-Item -ItemType Directory -Force -Path $startupDir | Out-Null
$cmdFile = Join-Path $startupDir "WaifuAgent-Docker.cmd"
@(
    "@echo off"
    "cd /d `"$Root`""
    "`"$ps`" $arg"
) | Set-Content -Path $cmdFile -Encoding ASCII
Write-Host "Startup folder: $cmdFile"

try {
    $action = New-ScheduledTaskAction -Execute $ps -Argument $arg -WorkingDirectory $Root
    $trigger = New-ScheduledTaskTrigger -AtLogOn
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 2)
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
    Write-Host "Scheduled task: $taskName"
} catch {
    Write-Host "Scheduled task skipped (no admin). Run key + Startup folder still apply."
}

Write-Step "Wait for /healthz"
$ok = $false
for ($i = 0; $i -lt 40; $i++) {
    try {
        $h = Invoke-RestMethod -Uri "http://127.0.0.1:8787/healthz" -TimeoutSec 4
        if ($h.ok) {
            $h | ConvertTo-Json -Compress
            $ok = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 3
    }
}
if (-not $ok) {
    Write-Host "API not healthy yet. Logs:"
    docker compose logs --tail 80 waifu-agent
    throw "healthz failed"
}

Write-Host ""
Write-Host "API        http://127.0.0.1:8787/healthz"
Write-Host "Settings   http://127.0.0.1:8787/settings"
Write-Host "Stage      http://127.0.0.1:8787/stage"
Write-Host "Extension  Chrome Load unpacked: $(Join-Path $Root 'extension')"
Write-Host "Logs       docker compose logs -f waifu-agent"
Write-Host "Stop       docker compose down"
Write-Host "Reboot     Docker Desktop + task $taskName bring the stack back."
