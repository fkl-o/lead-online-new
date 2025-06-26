#!/bin/bash

# Build script for Render deployment
set -e  # Exit on any error

echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf node_modules/.vite

echo "📦 Installing dependencies..."
npm ci --no-audit --no-fund

echo "🔍 Type checking..."
npx tsc --noEmit

echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"

# Verify build output
if [ -f "dist/index.html" ]; then
    echo "✅ Build verification: index.html exists"
else
    echo "❌ Build verification: index.html missing"
    exit 1
fi

echo "📂 Build output size:"
du -sh dist/
