# Polls TTS health. On CUDA death, docker restart waifu-agent at most once per 10 minutes.
$ErrorActionPreference = "Continue"
$Root = Split-Path $PSScriptRoot -Parent
$LogDir = Join-Path $env:LOCALAPPDATA "waifu-agent"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$Log = Join-Path $LogDir "cuda-watch.log"
$State = Join-Path $LogDir "cuda-restart.json"
$Health = "http://127.0.0.1:8787/healthz"
$CooldownMin = 10

function Write-Log([string]$msg) {
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $Log -Value "$stamp $msg"
}

function Read-LastRestart {
    if (-not (Test-Path $State)) {
        return [datetime]::MinValue
    }
    try {
        $j = Get-Content $State -Raw | ConvertFrom-Json
        if ($j.at) {
            return [datetime]$j.at
        }
    } catch {
    }
    return [datetime]::MinValue
}

function Save-LastRestart {
    $payload = @{
        at = (Get-Date).ToString("o")
        ok = $true
    }
    $payload | ConvertTo-Json | Set-Content -Path $State -Encoding utf8
}

function Get-Health {
    try {
        return Invoke-RestMethod -Uri $Health -TimeoutSec 5
    } catch {
        return $null
    }
}

Write-Log "cuda-watch start root=$Root"
while ($true) {
    try {
        $h = Get-Health
        if ($null -eq $h) {
            Start-Sleep -Seconds 15
            continue
        }
        $v = $h.vieneu
        $err = [string]$v.error
        $dead = $false
        if ($v.cuda_dead) { $dead = $true }
        if ($err -match "CUDA") { $dead = $true }
        if ($err -match "cublas") { $dead = $true }
        if ($err -match "cudnn") { $dead = $true }
        if ($err -match "GPU TTS") { $dead = $true }
        if (-not $dead) {
            Start-Sleep -Seconds 15
            continue
        }
        $last = Read-LastRestart
        $wait = ([datetime]::Now - $last).TotalMinutes
        if ($wait -lt $CooldownMin) {
            Write-Log ("cuda dead, cooldown {0:n1} / {1} min, skip" -f $wait, $CooldownMin)
            Start-Sleep -Seconds 30
            continue
        }
        Write-Log "cuda dead, docker restart waifu-agent"
        docker restart waifu-agent 2>&1 | ForEach-Object { Write-Log "$_" }
        Save-LastRestart
        $deadline = (Get-Date).AddMinutes(3)
        $up = $false
        while ((Get-Date) -lt $deadline) {
            Start-Sleep -Seconds 8
            $h2 = Get-Health
            if ($h2 -and $h2.vieneu.loaded -and -not $h2.vieneu.cuda_dead) {
                Write-Log "vieneu loaded after restart"
                $up = $true
                break
            }
        }
        if (-not $up) {
            Write-Log "WARNING still dead after restart. Reboot Windows if it persists."
        }
    } catch {
        $em = $_.Exception.Message
        Write-Log ("watch error " + $em)
    }
    Start-Sleep -Seconds 15
}
