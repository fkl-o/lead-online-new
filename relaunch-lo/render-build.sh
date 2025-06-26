#!/bin/bash

# Build script for Render.com deployment
# This ensures proper dependency installation and build process

echo "Starting Render.com build process..."

# Clean any existing build artifacts
echo "Cleaning build artifacts..."
rm -rf dist node_modules/.vite

# Install all dependencies (including devDependencies needed for build)
echo "Installing all dependencies..."
npm install

# Verify that vite-plugin-pwa is available
echo "Verifying build dependencies..."
if npm list vite-plugin-pwa --depth=0 > /dev/null 2>&1; then
    echo "vite-plugin-pwa found, using standard config"
    npm run build:production
else
    echo "vite-plugin-pwa not found, using fallback config"
    npx vite build --mode production --config vite.config.render.ts
fi

echo "Build completed successfully!"

# List build output for debugging
echo "Build output:"
ls -la dist/
