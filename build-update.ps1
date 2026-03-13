# Build LaraUpdater release package
# Run from project root: .\build-update.ps1
# Creates: public/updates/RELEASE-X.X.X.zip and public/updates/laraupdater.json
#
# Usage:
#   .\build-update.ps1                         # Auto-detect changed files via git diff
#   .\build-update.ps1 -All                    # Include all updatable directories
#   .\build-update.ps1 -Description "Bug fix"  # Custom description for laraupdater.json

param(
    [switch]$All,
    [string]$Description = ""
)

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot
$versionFile = Join-Path $projectRoot "version.txt"

if (-not (Test-Path $versionFile)) {
    Write-Host "[ERROR] version.txt not found at $versionFile" -ForegroundColor Red
    exit 1
}
$version = (Get-Content $versionFile -Raw).Trim()
$zipName = "RELEASE-$version.zip"
$updatesDir = Join-Path $projectRoot "public\updates"
$zipPath = Join-Path $updatesDir $zipName

# Directories that are safe to include in updates
$updatableDirs = @(
    "app",
    "config",
    "database/migrations",
    "database/seeders",
    "resources/views",
    "routes",
    "public/images",
    "public/build"
)

# Files always included
$alwaysInclude = @(
    "version.txt"
)

# Files/dirs to always exclude
$excludePatterns = @(
    "*.log", ".env", ".env.*", "storage/*", "vendor/*",
    "node_modules/*", ".git/*", "*.sqlite3"
)

Write-Host "`n=== Building LaraUpdater package v$version ===" -ForegroundColor Cyan

# Collect files
$filesToInclude = @()

if ($All) {
    Write-Host "`nMode: ALL updatable files" -ForegroundColor Yellow
    foreach ($dir in $updatableDirs) {
        $fullDir = Join-Path $projectRoot $dir
        if (Test-Path $fullDir) {
            Get-ChildItem -Path $fullDir -Recurse -File | ForEach-Object {
                $relative = $_.FullName.Substring($projectRoot.Length + 1) -replace '\\', '/'
                $filesToInclude += $relative
            }
        }
    }
} else {
    Write-Host "`nMode: Git diff (changed files only)" -ForegroundColor Yellow
    try {
        $gitFiles = git -C $projectRoot diff --name-only HEAD 2>&1
        if ($LASTEXITCODE -ne 0) {
            # Fallback: diff against nothing (all tracked files)
            $gitFiles = git -C $projectRoot diff --name-only --cached 2>&1
        }
        # Also include untracked files in updatable dirs
        $untrackedFiles = git -C $projectRoot ls-files --others --exclude-standard 2>&1

        $allGitFiles = @()
        if ($gitFiles) { $allGitFiles += $gitFiles }
        if ($untrackedFiles) { $allGitFiles += $untrackedFiles }

        foreach ($file in $allGitFiles) {
            $file = $file.Trim() -replace '\\', '/'
            if ($file -eq "") { continue }

            $isUpdatable = $false
            foreach ($dir in $updatableDirs) {
                if ($file.StartsWith("$dir/") -or $file -eq $dir) {
                    $isUpdatable = $true
                    break
                }
            }
            # Also include individual files in the always-include list
            if ($file -in $alwaysInclude) { $isUpdatable = $true }

            if ($isUpdatable -and (Test-Path (Join-Path $projectRoot $file))) {
                $filesToInclude += $file
            }
        }
    } catch {
        Write-Host "[WARN] Git not available or not a repo. Use -All flag instead." -ForegroundColor Yellow
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
}

# Always include these
foreach ($f in $alwaysInclude) {
    if ($f -notin $filesToInclude -and (Test-Path (Join-Path $projectRoot $f))) {
        $filesToInclude += $f
    }
}

# Always include new migrations (critical for updates)
$migrationsDir = Join-Path $projectRoot "database/migrations"
if (Test-Path $migrationsDir) {
    Get-ChildItem -Path $migrationsDir -File -Filter "*.php" | ForEach-Object {
        $relative = "database/migrations/$($_.Name)"
        if ($relative -notin $filesToInclude) {
            $filesToInclude += $relative
        }
    }
}

# De-duplicate
$filesToInclude = $filesToInclude | Select-Object -Unique | Sort-Object

if ($filesToInclude.Count -eq 0) {
    Write-Host "`n[INFO] No changed files found. Nothing to package." -ForegroundColor Yellow
    Write-Host "  Use -All flag to include all updatable directories." -ForegroundColor Gray
    exit 0
}

Write-Host "`nFiles to include: $($filesToInclude.Count)" -ForegroundColor Cyan

# Create temp dir and copy files
if (-not (Test-Path $updatesDir)) {
    New-Item -ItemType Directory -Path $updatesDir | Out-Null
}

$tempDir = Join-Path $env:TEMP "Forever-love-update-$version"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

foreach ($f in $filesToInclude) {
    $src = Join-Path $projectRoot $f
    if (Test-Path $src) {
        $destDir = Join-Path $tempDir (Split-Path $f -Parent)
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item -Path $src -Destination (Join-Path $tempDir $f) -Force
        Write-Host "  + $f" -ForegroundColor Gray
    } else {
        Write-Host "  ! Skip (not found): $f" -ForegroundColor Yellow
    }
}

# Create zip
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$tempDirFull = (Resolve-Path $tempDir).Path
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
try {
    Get-ChildItem -Path $tempDir -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring($tempDirFull.Length + 1) -replace '\\', '/'
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relativePath, 'Optimal') | Out-Null
    }
} finally { $zip.Dispose() }
Remove-Item $tempDir -Recurse -Force

# Auto-generate description if not provided
if ($Description -eq "") {
    $Description = "Update to version $version."
}

# Create laraupdater.json
$json = @{
    version = $version
    archive = $zipName
    description = $Description
} | ConvertTo-Json
$jsonPath = Join-Path $updatesDir "laraupdater.json"
$json | Set-Content -Path $jsonPath -Encoding UTF8

Write-Host "`n=== Done ===" -ForegroundColor Green
Write-Host "Output: $updatesDir" -ForegroundColor Green
Write-Host "  - $zipName ($($filesToInclude.Count) files)" -ForegroundColor Green
Write-Host "  - laraupdater.json" -ForegroundColor Green
Write-Host "`nFiles are in public/updates/ - web-accessible at " -NoNewline -ForegroundColor Cyan
Write-Host "APP_URL/updates" -ForegroundColor Yellow
