# =============================================================================
# Wedding Website & QR RSVP CMS - Docker Setup & Launch Script
# Target Directory: C:\docker\wedding-website
# GitHub Repo:      https://github.com/Plungis/wedding-website.git
# =============================================================================

$ErrorActionPreference = "Stop"

$DockerRoot = "C:\docker"
$AppDir     = Join-Path $DockerRoot "wedding-website"
$DataDir    = Join-Path $AppDir "data"
$RepoUrl    = "https://github.com/Plungis/wedding-website.git"
$Port       = 3001

Write-Host "==> 1. Ensuring C:\docker directory exists..." -ForegroundColor Cyan
if (-not (Test-Path $DockerRoot)) {
    New-Item -ItemType Directory -Path $DockerRoot -Force | Out-Null
}

Write-Host "==> 2. Setting up $AppDir from GitHub ($RepoUrl)..." -ForegroundColor Cyan
if (-not (Test-Path $AppDir)) {
    git clone $RepoUrl $AppDir
} elseif (Test-Path (Join-Path $AppDir ".git")) {
    Write-Host "    Existing repository found. Pulling latest changes..." -ForegroundColor Yellow
    Push-Location $AppDir
    git pull origin main
    Pop-Location
} else {
    Write-Host "    Folder exists but is not a git repo. Cloning into temp and copying..." -ForegroundColor Yellow
    $TempClone = Join-Path $env:TEMP "wedding-website-clone-$(Get-Random)"
    git clone $RepoUrl $TempClone
    Copy-Item -Path "$TempClone\*" -Destination $AppDir -Recurse -Force
    Remove-Item -Path $TempClone -Recurse -Force
}

Write-Host "==> 3. Ensuring persistent CMS & RSVP database folder exists at $DataDir..." -ForegroundColor Cyan
if (-not (Test-Path $DataDir)) {
    New-Item -ItemType Directory -Path $DataDir -Force | Out-Null
}

Write-Host "==> 4. Building and starting Docker container (wedding-website)..." -ForegroundColor Cyan
Push-Location $AppDir
try {
    docker compose up -d --build
} finally {
    Pop-Location
}

Write-Host "==> 5. Verifying Wedding Website & CMS Server on http://localhost:$Port ..." -ForegroundColor Cyan
$MaxAttempts = 15
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
    Write-Host "==================================================================" -ForegroundColor Green
    Write-Host "  Wedding Website & QR CMS is LIVE!" -ForegroundColor Green
    Write-Host "  URL:            http://localhost:$Port" -ForegroundColor White
    Write-Host "  Sample QR Link: http://localhost:$Port/?rsvp=ROSE-4829" -ForegroundColor White
    Write-Host "  CMS Passcode:   wedding2026" -ForegroundColor Yellow
    Write-Host "  Data Volume:    $DataDir\db.json" -ForegroundColor Gray
    Write-Host "==================================================================" -ForegroundColor Green
    Start-Process "http://localhost:$Port"
} else {
    Write-Host "Container started! Check logs with: docker logs -f wedding-website" -ForegroundColor Yellow
}
