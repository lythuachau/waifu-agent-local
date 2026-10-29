# Bootstrap a new PC from the GitHub clone.
# GitHub already has: code, extension, personas, RapidOCR, VieNeu clones, .zai clips.
# Still downloads: pip wheels, VieNeu/ZeroTTS HF weights, Ollama models, optional CUDA 13.

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

python -m pip install -r server/requirements.txt
python -m pip install onnxruntime-gpu
if (Test-Path "E:\ll\cuda13-runtime\bin") {
  $env:PATH = "E:\ll\cuda13-runtime\bin;$env:PATH"
}

Write-Host "Next:"
Write-Host "  1. ollama serve && ollama pull llama3.2"
Write-Host "  2. optional: ollama pull llava   (heavy vision)"
Write-Host "  3. optional: codex login"
Write-Host "  4. .\start.ps1"
Write-Host "  5. Chrome Load unpacked: $(Join-Path (Get-Location) 'extension')"
Write-Host "First VieNeu TTS downloads ONNX from Hugging Face (~once)."
