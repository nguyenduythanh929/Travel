# Builds the images one at a time (parallel builds can run out of memory
# on Docker Desktop's default settings), then starts every service.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

foreach ($service in "backend", "travelweb", "admin") {
    Write-Host "==> Building $service" -ForegroundColor Cyan
    docker compose build $service
    if ($LASTEXITCODE -ne 0) { throw "Build failed for $service" }
}

docker compose up -d
if ($LASTEXITCODE -ne 0) { throw "docker compose up failed" }

Write-Host ""
Write-Host "Website: http://localhost:3000" -ForegroundColor Green
Write-Host "Admin:   http://localhost:3001" -ForegroundColor Green
Write-Host "API:     http://localhost:8088" -ForegroundColor Green
Write-Host "The backend may need up to a minute before data appears."
