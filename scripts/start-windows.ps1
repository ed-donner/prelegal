$ErrorActionPreference = "Stop"

Set-Location (Split-Path -Parent $PSScriptRoot)
docker compose up --build -d
Write-Host "Prelegal started at http://localhost:8000"
