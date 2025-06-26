# PowerShell script for clean build on Windows
# Run this script: .\build-clean.ps1

Write-Host "🧹 Cleaning previous build artifacts..." -ForegroundColor Yellow

# Remove dist folder
if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force
    Write-Host "✅ Removed dist folder" -ForegroundColor Green
}

# Remove node_modules/.vite cache
if (Test-Path "node_modules\.vite") {
    Remove-Item "node_modules\.vite" -Recurse -Force
    Write-Host "✅ Removed Vite cache" -ForegroundColor Green
}

# Clear npm cache
Write-Host "🧹 Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "🔨 Starting clean build..." -ForegroundColor Yellow
$env:NODE_ENV = "production"

# Install dependencies
npm ci

# Run TypeScript compilation
Write-Host "📝 Compiling TypeScript..." -ForegroundColor Blue
npx tsc -b

# Build with Vite
Write-Host "⚡ Building with Vite..." -ForegroundColor Blue
npx vite build --mode production

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "📦 Build output is in the 'dist' folder" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
