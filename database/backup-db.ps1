# Database Backup Script for Forever-love
# Run: .\database\backup-db.ps1
# Or: powershell -File database\backup-db.ps1

$dbName = "forever_love"
$backupDir = Join-Path $PSScriptRoot "backups"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFile = Join-Path $backupDir "forever_love_$timestamp.sql"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$mysqlPath = "C:\xampp\mysql\bin\mysqldump.exe"
if (-not (Test-Path $mysqlPath)) {
    Write-Host "mysqldump not found at $mysqlPath" -ForegroundColor Red
    exit 1
}

Write-Host "Backing up $dbName to $backupFile ..." -ForegroundColor Cyan
& $mysqlPath -u root $dbName > $backupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup saved: $backupFile" -ForegroundColor Green
} else {
    Write-Host "Backup failed. Is MySQL running?" -ForegroundColor Red
    exit 1
}
