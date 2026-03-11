# Push Forever-Love to GitHub - does everything automatically
# Run: .\push-to-github.ps1

$ErrorActionPreference = "Stop"
$repoName = "Forever-Loved"
cd $PSScriptRoot

# Refresh PATH for gh
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "`n=== Connecting Forever-Love to GitHub ===" -ForegroundColor Cyan

# Step 1: Check GitHub auth
$authOk = $false
try {
    $null = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) { $authOk = $true }
} catch {}

if (-not $authOk) {
    Write-Host "`nGitHub login required. A browser will open." -ForegroundColor Yellow
    Write-Host "Enter the code shown below at https://github.com/login/device`n" -ForegroundColor Yellow
    gh auth login --web --git-protocol https
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Login failed or cancelled." -ForegroundColor Red
        exit 1
    }
}

# Step 2: Get username from GitHub
Write-Host "`nGetting your GitHub username..." -ForegroundColor Gray
$username = gh api user --jq .login 2>$null
if (-not $username) {
    $username = Read-Host "Enter your GitHub username"
}

# Step 3: Add remote and push
$repoUrl = "https://github.com/$username/$repoName.git"
Write-Host "`nAdding remote: $repoUrl" -ForegroundColor Gray
git remote remove origin 2>$null
git remote add origin $repoUrl
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Gray
git push -u origin main

Write-Host "`nDone! Your code is at https://github.com/$username/$repoName" -ForegroundColor Green
