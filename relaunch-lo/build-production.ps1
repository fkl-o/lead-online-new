# Build script for Production deployment
# PowerShell version for Windows

Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "node_modules\.vite") { Remove-Item -Recurse -Force "node_modules\.vite" }

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci --no-audit --no-fund

Write-Host "🔍 Type checking..." -ForegroundColor Yellow
npx tsc --noEmit

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type checking failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🏗️ Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Verify build output
if (Test-Path "dist\index.html") {
    Write-Host "✅ Build verification: index.html exists" -ForegroundColor Green
} else {
    Write-Host "❌ Build verification: index.html missing" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Build output created in dist/ folder" -ForegroundColor Cyan