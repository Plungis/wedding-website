# =============================================================================
# Wedding Website & QR RSVP CMS (Fall Goth Edition) - Clean Re-Deploy Script
# Target Directory: C:\docker\wedding-website
# GitHub Repo:      https://github.com/Plungis/wedding-website
# =============================================================================

$ErrorActionPreference = "Stop"

$DockerRoot = "C:\docker"
$AppDir     = Join-Path $DockerRoot "wedding-website"
$DataDir    = Join-Path $AppDir "data"
$ZipUrl     = "https://github.com/Plungis/wedding-website/archive/refs/heads/main.zip"
$Port       = 3001

Write-Host "==> 1. Stopping and removing old wedding-website container (if running)..." -ForegroundColor Cyan
docker rm -f wedding-website 2>$null | Out-Null

Write-Host "==> 2. Deleting old C:\docker\wedding-website folder & old cached data..." -ForegroundColor Cyan
if (Test-Path $AppDir) {
    Remove-Item -Path $AppDir -Recurse -Force
}
New-Item -ItemType Directory -Path $AppDir -Force | Out-Null

Write-Host "==> 3. Downloading latest Fall Goth Wedding Website from GitHub..." -ForegroundColor Cyan
$TempDir = Join-Path $env:TEMP "wedding-website-setup-$(Get-Random)"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
$ZipFile = Join-Path $TempDir "repo.zip"

Invoke-WebRequest -Uri "$ZipUrl?t=$(Get-Date -Format 'yyyyMMddHHmmss')" -OutFile $ZipFile -UseBasicParsing
Expand-Archive -Path $ZipFile -DestinationPath $TempDir -Force
$ExtractedFolder = Get-ChildItem -Path $TempDir -Directory | Select-Object -First 1
Copy-Item -Path "$($ExtractedFolder.FullName)\*" -Destination $AppDir -Recurse -Force
Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "==> 4. Creating fresh data folder at $DataDir..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $DataDir -Force | Out-Null

Write-Host "==> 5. Building and launching new Fall Goth Docker container..." -ForegroundColor Cyan
Push-Location $AppDir
try {
    docker compose up -d --build --force-recreate
} finally {
    Pop-Location
}

Write-Host "==> 6. Verifying Wedding Website & CMS Server on http://localhost:$Port ..." -ForegroundColor Cyan
$MaxAttempts = 20
$Ready = $false
for ($i = 1; $i -le $MaxAttempts; $i++) {
    try {
        $Response = Invoke-RestMethod -Uri "http://localhost:$Port/api/content" -TimeoutSec 3 -ErrorAction Stop
        if ($Response.siteSettings) {
            $Ready = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

if ($Ready) {
    Write-Host ""
    Write-Host "==================================================================" -ForegroundColor Magenta
    Write-Host "  Fall Goth Wedding Website & QR CMS is LIVE!" -ForegroundColor Green
    Write-Host "  URL:            http://localhost:$Port" -ForegroundColor White
    Write-Host "  Sample QR Link: http://localhost:$Port/?rsvp=ROSE-4829" -ForegroundColor White
    Write-Host "  CMS Passcode:   wedding2026" -ForegroundColor Yellow
    Write-Host "==================================================================" -ForegroundColor Magenta
    Start-Process "http://localhost:$Port"
} else {
    Write-Host "Container started! Check logs with: docker logs -f wedding-website" -ForegroundColor Yellow
}
