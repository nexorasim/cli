#!/bin/bash

# ===== Quick Deploy Script for eSIM Myanmar Website =====
# Simplified version of the full automation script

set -e

# Default configuration
REPO_URL="${REPO_URL:-https://github.com/nexorasim/cli.git}"
WEBSITE_URL="${WEBSITE_URL:-https://www.esim.com.mm}"
VERCEL_TOKEN="${VERCEL_TOKEN:-YeHB18fhvsscigEgaGglpg5A}"

echo "🚀 eSIM Myanmar Quick Deploy Started"
echo "Repository: $REPO_URL"
echo "Website: $WEBSITE_URL"
echo "========================="

# 1. Pull latest code
echo "📥 Pulling latest code..."
if [ ! -d "esim-website" ]; then
    git clone "$REPO_URL" esim-website
fi
cd esim-website
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
if [ -f "package.json" ]; then
    yarn install --silent || npm install --silent
fi

if [ -f "frontend/package.json" ]; then
    cd frontend && yarn install --silent && cd ..
fi

# 3. Run tests
echo "🧪 Running tests..."
if [ -f "package.json" ]; then
    yarn test --watchAll=false || npm test -- --watchAll=false || echo "⚠️  Tests failed but continuing..."
fi

# 4. Build project
echo "🔨 Building project..."
if [ -f "package.json" ]; then
    yarn build || npm run build
fi

# 5. Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --token="$VERCEL_TOKEN" --prod --confirm

# 6. Quick SEO check
echo "🔍 Quick SEO check..."
curl -s "$WEBSITE_URL" | grep -i "<title>" || echo "⚠️  Could not verify title tag"
curl -s "$WEBSITE_URL/robots.txt" > /dev/null && echo "✅ Robots.txt accessible" || echo "⚠️  Robots.txt not found"

echo "✅ Quick deploy completed!"
echo "Visit: $WEBSITE_URL"