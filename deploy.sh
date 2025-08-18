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

# Copy static files to dist
if [ -f "sitemap.xml" ]; then
    cp sitemap.xml dist/
fi

if [ -f "robots.txt" ]; then
    cp robots.txt dist/
fi

if [ -f "atom.xml" ]; then
    cp atom.xml dist/
fi

if [ -f "rss.xml" ]; then
    cp rss.xml dist/
fi

if [ -d "feeds" ]; then
    cp -r feeds dist/
fi

echo "Deployment preparation completed!"
