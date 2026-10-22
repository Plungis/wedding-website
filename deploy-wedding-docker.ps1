# =============================================================================
# Wedding Website & QR RSVP CMS (Gothic Noir Edition) - Safe Update Script
# Target Directory: C:\docker\wedding-website
# GitHub Repo:      https://github.com/Plungis/wedding-website
# NOTE: Preserves C:\docker\wedding-website\data\db.json across all updates!
# =============================================================================

$ErrorActionPreference = "Stop"

$DockerRoot = "C:\docker"
$AppDir     = Join-Path $DockerRoot "wedding-website"
$DataDir    = Join-Path $AppDir "data"
$DbFile     = Join-Path $DataDir "db.json"
$BackupFile = Join-Path $env:TEMP "wedding-db-backup.json"
$ZipUrl     = "https://github.com/Plungis/wedding-website/archive/refs/heads/main.zip"
$Port       = 3001

Write-Host "==> 1. Backing up existing CMS & Guest RSVP database (if present)..." -ForegroundColor Cyan
if (Test-Path $DbFile) {
    Copy-Item -Path $DbFile -Destination $BackupFile -Force
    Write-Host "    Saved backup of db.json to $BackupFile" -ForegroundColor Green
}

Write-Host "==> 2. Stopping old wedding-website container..." -ForegroundColor Cyan
docker rm -f wedding-website 2>$null | Out-Null

Write-Host "==> 3. Ensuring $AppDir and $DataDir exist..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $AppDir -Force | Out-Null
New-Item -ItemType Directory -Path $DataDir -Force | Out-Null

Write-Host "==> 4. Downloading latest Gothic Noir Wedding Website code from GitHub..." -ForegroundColor Cyan
$TempDir = Join-Path $env:TEMP "wedding-website-update-$(Get-Random)"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
$ZipFile = Join-Path $TempDir "repo.zip"

Invoke-WebRequest -Uri "$ZipUrl?t=$(Get-Date -Format 'yyyyMMddHHmmss')" -OutFile $ZipFile -UseBasicParsing
Expand-Archive -Path $ZipFile -DestinationPath $TempDir -Force
$ExtractedFolder = Get-ChildItem -Path $TempDir -Directory | Select-Object -First 1

Write-Host "==> 5. Updating application files while keeping C:\docker\wedding-website\data intact..." -ForegroundColor Cyan
Get-ChildItem -Path $ExtractedFolder.FullName | ForEach-Object {
    if ($_.Name -ne "data") {
        Copy-Item -Path $_.FullName -Destination $AppDir -Recurse -Force
    }
}
Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue

if ((Test-Path $BackupFile) -and (-not (Test-Path $DbFile))) {
    Copy-Item -Path $BackupFile -Destination $DbFile -Force
}

Write-Host "==> 6. Building and launching updated Docker container..." -ForegroundColor Cyan
Push-Location $AppDir
try {
    docker compose up -d --build --force-recreate
} finally {
    Pop-Location
}

Write-Host "==> 7. Verifying Wedding Website & CMS Server on http://localhost:$Port ..." -ForegroundColor Cyan
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
    Write-Host "  Gothic Noir Wedding Website & Visual CMS is LIVE!" -ForegroundColor Green
    Write-Host "  Your existing CMS edits & Guest RSVPs were preserved!" -ForegroundColor Green
    Write-Host "  URL:            http://localhost:$Port" -ForegroundColor White
    Write-Host "  CMS Passcode:   wedding2026" -ForegroundColor Yellow
    Write-Host "==================================================================" -ForegroundColor Magenta
    Start-Process "http://localhost:$Port"
} else {
    Write-Host "Container started! Check logs with: docker logs -f wedding-website" -ForegroundColor Yellow
}
