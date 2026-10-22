# =============================================================================
# Wedding Website & QR RSVP CMS - Docker Setup & Launch Script
# Target Directory: C:\docker\wedding-website
# GitHub Repo:      https://github.com/Plungis/wedding-website
# =============================================================================

$ErrorActionPreference = "Stop"

# Ensure Git is in PATH if installed in standard Program Files location
if ((Test-Path "C:\Program Files\Git\cmd") -and ($env:Path -notlike "*C:\Program Files\Git\cmd*")) {
    $env:Path += ";C:\Program Files\Git\cmd"
}

$DockerRoot = "C:\docker"
$AppDir     = Join-Path $DockerRoot "wedding-website"
$DataDir    = Join-Path $AppDir "data"
$RepoUrl    = "https://github.com/Plungis/wedding-website.git"
$ZipUrl     = "https://github.com/Plungis/wedding-website/archive/refs/heads/main.zip"
$Port       = 3001

Write-Host "==> 1. Ensuring C:\docker\wedding-website directory exists..." -ForegroundColor Cyan
if (-not (Test-Path $AppDir)) {
    New-Item -ItemType Directory -Path $AppDir -Force | Out-Null
}

Write-Host "==> 2. Downloading Wedding Website from GitHub into $AppDir..." -ForegroundColor Cyan
$TempDir = Join-Path $env:TEMP "wedding-website-setup-$(Get-Random)"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "    Using Git to fetch repository..." -ForegroundColor Gray
    $CloneTarget = Join-Path $TempDir "repo"
    git clone $RepoUrl $CloneTarget
    Copy-Item -Path "$CloneTarget\*" -Destination $AppDir -Recurse -Force
} else {
    Write-Host "    Downloading GitHub archive via HTTPS (no Git required)..." -ForegroundColor Gray
    $ZipFile = Join-Path $TempDir "repo.zip"
    Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipFile -UseBasicParsing
    Expand-Archive -Path $ZipFile -DestinationPath $TempDir -Force
    $ExtractedFolder = Get-ChildItem -Path $TempDir -Directory | Select-Object -First 1
    Copy-Item -Path "$($ExtractedFolder.FullName)\*" -Destination $AppDir -Recurse -Force
}

Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue

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
