#!/bin/bash

set -e

echo "Deploying eSIM Myanmar to GitHub Pages"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building application..."
npm run build

# Copy built files to public directory (preserving existing static files)
echo "Copying built files to public directory..."
cp dist/index.html public/
cp -r dist/assets public/

echo "Deployment preparation completed for public/ directory"
