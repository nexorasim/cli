#!/bin/bash

# ===== Test Script for eSIM Myanmar Deployment Automation =====
# This script validates that all dependencies and configurations are correct

set -e

echo "🧪 Testing eSIM Myanmar Deployment Automation Setup"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0

test_command() {
    local cmd=$1
    local name=$2
    
    if command -v "$cmd" >/dev/null 2>&1; then
        echo -e "✅ ${GREEN}$name is installed${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "❌ ${RED}$name is NOT installed${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

test_file() {
    local file=$1
    local name=$2
    
    if [ -f "$file" ]; then
        echo -e "✅ ${GREEN}$name exists${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "❌ ${RED}$name is missing${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

test_url() {
    local url=$1
    local name=$2
    
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        echo -e "✅ ${GREEN}$name is accessible${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "❌ ${RED}$name is NOT accessible${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "1. Testing System Dependencies"
echo "------------------------------"
test_command "git" "Git"
test_command "curl" "cURL"
test_command "node" "Node.js" || echo -e "   ${YELLOW}Install from: https://nodejs.org/${NC}"
test_command "npm" "NPM" || echo -e "   ${YELLOW}Usually comes with Node.js${NC}"
test_command "python3" "Python 3" || echo -e "   ${YELLOW}Install from: https://python.org/${NC}"
test_command "pip3" "pip3" || echo -e "   ${YELLOW}Install with: sudo apt install python3-pip${NC}"

echo ""
echo "2. Testing Optional Dependencies"
echo "--------------------------------"
test_command "yarn" "Yarn" || echo -e "   ${YELLOW}Install with: npm install -g yarn${NC}"
test_command "vercel" "Vercel CLI" || echo -e "   ${YELLOW}Will be auto-installed by script${NC}"

echo ""
echo "3. Testing Script Files"
echo "-----------------------"
test_file "/app/esim-myanmar-auto-deploy.sh" "Main deployment script"
test_file "/app/quick-deploy.sh" "Quick deployment script"
test_file "/app/deploy-config.env" "Configuration template"
test_file "/app/DEPLOYMENT_README.md" "Documentation"

# Check if scripts are executable
if [ -x "/app/esim-myanmar-auto-deploy.sh" ]; then
    echo -e "✅ ${GREEN}Main script is executable${NC}"
    ((TESTS_PASSED++))
else
    echo -e "❌ ${RED}Main script is NOT executable${NC}"
    echo -e "   ${YELLOW}Fix with: chmod +x /app/esim-myanmar-auto-deploy.sh${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "4. Testing Environment Variables"
echo "--------------------------------"
if [ -n "$VERCEL_TOKEN" ]; then
    echo -e "✅ ${GREEN}VERCEL_TOKEN is set${NC}"
    ((TESTS_PASSED++))
else
    echo -e "⚠️  ${YELLOW}VERCEL_TOKEN is not set (will use default)${NC}"
fi

if [ -n "$REPO_URL" ]; then
    echo -e "✅ ${GREEN}REPO_URL is set${NC}"
    ((TESTS_PASSED++))
else
    echo -e "⚠️  ${YELLOW}REPO_URL is not set (will use default)${NC}"
fi

echo ""
echo "5. Testing Network Connectivity"
echo "-------------------------------"
test_url "https://api.github.com" "GitHub API"
test_url "https://api.vercel.com" "Vercel API"
test_url "https://registry.npmjs.org" "NPM Registry"
test_url "https://pypi.org" "Python Package Index"

# Test website if configured
WEBSITE_URL=${WEBSITE_URL:-"https://www.esim.com.mm"}
echo ""
echo "6. Testing Target Website"
echo "-------------------------"
test_url "$WEBSITE_URL" "Target website ($WEBSITE_URL)"
test_url "$WEBSITE_URL/robots.txt" "Robots.txt"

# Test sitemap
if curl -s --head "$WEBSITE_URL/sitemap.xml" | head -n 1 | grep -q "200 OK"; then
    echo -e "✅ ${GREEN}Sitemap is accessible${NC}"
    ((TESTS_PASSED++))
else
    echo -e "⚠️  ${YELLOW}Sitemap not found (will check common pages instead)${NC}"
fi

echo ""
echo "7. Testing Git Configuration"
echo "----------------------------"
if git config --global user.name >/dev/null 2>&1; then
    echo -e "✅ ${GREEN}Git user.name is configured${NC}"
    ((TESTS_PASSED++))
else
    echo -e "❌ ${RED}Git user.name is NOT configured${NC}"
    echo -e "   ${YELLOW}Set with: git config --global user.name 'Your Name'${NC}"
    ((TESTS_FAILED++))
fi

if git config --global user.email >/dev/null 2>&1; then
    echo -e "✅ ${GREEN}Git user.email is configured${NC}"
    ((TESTS_PASSED++))
else
    echo -e "❌ ${RED}Git user.email is NOT configured${NC}"
    echo -e "   ${YELLOW}Set with: git config --global user.email 'your@email.com'${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "8. Testing Project Structure (if present)"
echo "-----------------------------------------"
if [ -f "package.json" ]; then
    echo -e "✅ ${GREEN}package.json found${NC}"
    ((TESTS_PASSED++))
    
    # Check for scripts
    if grep -q '"build"' package.json; then
        echo -e "✅ ${GREEN}Build script found in package.json${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "⚠️  ${YELLOW}No build script in package.json${NC}"
    fi
    
    if grep -q '"test"' package.json; then
        echo -e "✅ ${GREEN}Test script found in package.json${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "⚠️  ${YELLOW}No test script in package.json${NC}"
    fi
else
    echo -e "⚠️  ${YELLOW}No package.json found (will check in frontend/ directory)${NC}"
fi

if [ -f "requirements.txt" ]; then
    echo -e "✅ ${GREEN}requirements.txt found${NC}"
    ((TESTS_PASSED++))
else
    echo -e "⚠️  ${YELLOW}No requirements.txt found (will check in backend/ directory)${NC}"
fi

echo ""
echo "=========================================="
echo "📊 Test Results Summary"
echo "=========================================="
echo -e "✅ Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "❌ Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e ""
    echo -e "🎉 ${GREEN}All critical tests passed! You're ready to run the deployment automation.${NC}"
    echo -e ""
    echo -e "To get started:"
    echo -e "1. Review and customize ${YELLOW}deploy-config.env${NC}"
    echo -e "2. Run: ${YELLOW}./esim-myanmar-auto-deploy.sh${NC}"
    echo -e "3. Check the generated logs for detailed results"
    exit 0
else
    echo -e ""
    echo -e "⚠️  ${YELLOW}Some tests failed. Please address the issues above before running the automation.${NC}"
    echo -e ""
    echo -e "Critical issues to fix:"
    echo -e "- Install missing system dependencies"
    echo -e "- Configure Git user information"
    echo -e "- Ensure network connectivity"
    echo -e ""
    echo -e "After fixing issues, run this test again: ${YELLOW}./test-automation.sh${NC}"
    exit 1
fi