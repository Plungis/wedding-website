# =============================================================================
# Wedding Website & QR RSVP CMS (Gothic Noir Edition) - Bulletproof Update Script
# Code Directory:   C:\docker\wedding-website
# Data Directory:   C:\docker\wedding-data (OUTSIDE code directory - never deleted!)
# GitHub Repo:      https://github.com/Plungis/wedding-website
# =============================================================================

$ErrorActionPreference = "Stop"

$DockerRoot     = "C:\docker"
$AppDir         = Join-Path $DockerRoot "wedding-website"
$ExternalData   = Join-Path $DockerRoot "wedding-data"
$LegacyDataDir  = Join-Path $AppDir "data"
$TargetDbFile   = Join-Path $ExternalData "db.json"
$ZipUrl         = "https://github.com/Plungis/wedding-website/archive/refs/heads/main.zip"
$Port           = 3001

New-Item -ItemType Directory -Path $DockerRoot -Force | Out-Null
New-Item -ItemType Directory -Path $ExternalData -Force | Out-Null

Write-Host "==> 1. Scanning for all existing/backed-up wedding databases..." -ForegroundColor Cyan
$CandidatePaths = @(
    $TargetDbFile,
    (Join-Path $ExternalData "db.backup.json"),
    (Join-Path $LegacyDataDir "db.json"),
    (Join-Path $LegacyDataDir "db.json.tmp"),
    (Join-Path $LegacyDataDir "db.backup.json"),
    (Join-Path $LegacyDataDir "data\db.json"),
    (Join-Path $env:TEMP "wedding-db-backup.json"),
    (Join-Path $env:TEMP "wedding-data-backup\db.json"),
    (Join-Path $env:TEMP "wedding-data-backup\data\db.json")
)

$BestFile = $null
$BestScore = -1

foreach ($Cand in $CandidatePaths) {
    if (Test-Path $Cand) {
        try {
            $Raw = Get-Content -Path $Cand -Raw -ErrorAction Stop
            $Json = $Raw | ConvertFrom-Json -ErrorAction Stop
            $Score = 0
            if ($Json.siteSettings.coupleNames -and $Json.siteSettings.coupleNames -ne "Elena Vance & Julian Sterling") {
                $Score += 1000
            }
            if ($Json.revisions) {
                $Score += ($Json.revisions.Count * 10)
            }
            if ($Json.guests) {
                $Score += $Json.guests.Count
            }
            Write-Host "    Found DB candidate: $Cand (Customization Score: $Score)" -ForegroundColor Gray
            if ($Score -gt $BestScore) {
                $BestScore = $Score
                $BestFile = $Cand
            }
        } catch {
            # Ignore invalid JSON
        }
    }
}

if ($BestFile) {
    if ((Resolve-Path $BestFile).Path -ne (Resolve-Path $TargetDbFile -ErrorAction SilentlyContinue).Path) {
        Copy-Item -Path $BestFile -Destination $TargetDbFile -Force
    }
    $BackupTarget = Join-Path $ExternalData "db.backup.json"
    if ((Resolve-Path $BestFile).Path -ne (Resolve-Path $BackupTarget -ErrorAction SilentlyContinue).Path) {
        Copy-Item -Path $BestFile -Destination $BackupTarget -Force
    }
    Write-Host "    ✅ Preserved/Recovered best database from: $BestFile" -ForegroundColor Green
}

Write-Host "==> 2. Stopping old wedding-website container..." -ForegroundColor Cyan
Set-Location $DockerRoot
docker rm -f wedding-website 2>$null | Out-Null

Write-Host "==> 3. Downloading latest Wedding Website code from GitHub..." -ForegroundColor Cyan
$TempDir = Join-Path $env:TEMP "wedding-website-update-$(Get-Random)"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
$ZipFile = Join-Path $TempDir "repo.zip"

$DownloadUrl = "https://codeload.github.com/Plungis/wedding-website/zip/refs/heads/main"
Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipFile -UseBasicParsing
Expand-Archive -Path $ZipFile -DestinationPath $TempDir -Force
$ExtractedFolder = Get-ChildItem -Path $TempDir -Directory | Select-Object -First 1

Write-Host "==> 4. Updating code in $AppDir (Data in $ExternalData is completely separate)..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $AppDir -Force | Out-Null
Get-ChildItem -Path $ExtractedFolder.FullName | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $AppDir -Recurse -Force
}
Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "==> 5. Building and launching updated Docker container..." -ForegroundColor Cyan
Push-Location $AppDir
try {
    docker compose up -d --build --force-recreate
} finally {
    Pop-Location
}

Write-Host "==> 6. Verifying Wedding Website & CMS Server on http://localhost:$Port ..." -ForegroundColor Cyan
for ($i = 1; $i -le 20; $i++) {
    try {
        $Response = Invoke-RestMethod -Uri "http://localhost:$Port/api/content" -TimeoutSec 3 -ErrorAction Stop
        if ($Response.siteSettings) { break }
    } catch {
        Start-Sleep -Seconds 2
    }
}

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host "  Wedding Website & Visual CMS is LIVE!" -ForegroundColor Green
Write-Host "  Permanent Data Folder: C:\docker\wedding-data\db.json" -ForegroundColor Green
Write-Host "  URL:                   http://localhost:$Port" -ForegroundColor White
Write-Host "  CMS Passcode:          wedding2026" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Magenta
Start-Process "http://localhost:$Port"
