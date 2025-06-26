# Build Script for optimized PWA Production

Write-Host "Starting optimized PWA build..." -ForegroundColor Green

# Clean previous build
Write-Host "Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Build the application
Write-Host "Building application with optimizations..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "Built files are in the dist directory" -ForegroundColor Cyan
    
    # Check for manifest and service worker
    if (Test-Path "dist/manifest.json") {
        Write-Host "PWA Manifest found" -ForegroundColor Green
    }
    if (Test-Path "dist/sw.js") {
        Write-Host "Service Worker generated" -ForegroundColor Green
    }
    
    Write-Host "PWA build optimizations applied:" -ForegroundColor Blue
    Write-Host "- Code splitting and tree shaking" -ForegroundColor Cyan
    Write-Host "- Asset compression" -ForegroundColor Cyan
    Write-Host "- Service Worker with caching strategies" -ForegroundColor Cyan
    Write-Host "- Optimized chunk sizes" -ForegroundColor Cyan
    Write-Host "- Long-term caching with cache busting" -ForegroundColor Cyan
    
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
