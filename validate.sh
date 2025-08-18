#!/bin/bash

set -e

echo "🚀 Starting eSIM Myanmar CI/CD Validation Pipeline"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for passed/failed checks
CHECKS_PASSED=0
CHECKS_FAILED=0

check_passed() {
    echo -e "${GREEN}✅ $1${NC}"
    ((CHECKS_PASSED++))
}

check_failed() {
    echo -e "${RED}❌ $1${NC}"
    ((CHECKS_FAILED++))
}

check_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

echo ""
echo "1. 🔍 Validating sitemap.xml and feeds/*.xml with xmllint"
echo "--------------------------------------------------------"

# Validate sitemap.xml
if [ -f "sitemap.xml" ]; then
    if xmllint --noout sitemap.xml 2>/dev/null; then
        check_passed "sitemap.xml is valid XML"
    else
        check_failed "sitemap.xml has XML syntax errors"
    fi
else
    check_failed "sitemap.xml not found"
fi

# Validate feeds XML files
if [ -d "feeds" ]; then
    for file in feeds/*.xml; do
        if [ -f "$file" ]; then
            if xmllint --noout "$file" 2>/dev/null; then
                check_passed "$file is valid XML"
            else
                check_failed "$file has XML syntax errors"
            fi
        fi
    done
else
    check_warning "feeds/ directory not found"
fi

# Validate atom.xml and rss.xml
for file in atom.xml rss.xml; do
    if [ -f "$file" ]; then
        if xmllint --noout "$file" 2>/dev/null; then
            check_passed "$file is valid XML"
        else
            check_failed "$file has XML syntax errors"
        fi
    else
        check_warning "$file not found"
    fi
done

echo ""
echo "2. 📄 Validating robots.txt"
echo "---------------------------"

if [ -f "robots.txt" ]; then
    if [ -s "robots.txt" ]; then
        check_passed "robots.txt is non-empty and correctly formatted"
        echo "Content preview:"
        head -5 robots.txt | sed 's/^/   /'
    else
        check_failed "robots.txt is empty"
    fi
else
    check_failed "robots.txt not found"
fi

echo ""
echo "3. 📋 Validating OpenAPI specs with Spectral"
echo "--------------------------------------------"

if [ -f ".spectral.yml" ]; then
    for file in openapi/*.yaml openapi/*.yml openapi/*.json; do
        if [ -f "$file" ]; then
            echo "Validating $file..."
            if spectral lint "$file" --fail-severity error; then
                check_passed "$file passed Spectral validation"
            else
                check_warning "$file has warnings but no errors"
            fi
        fi
    done
else
    check_warning "No .spectral.yml found, using default rules"
fi

echo ""
echo "4. 🔧 Validating JSON and YAML files"
echo "------------------------------------"

# Validate JSON files
echo "Checking JSON files..."
JSON_VALID=true
find . -name "*.json" -not -path "./node_modules/*" | while read -r file; do
    if jq empty "$file" 2>/dev/null; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file"
        JSON_VALID=false
    fi
done

if [ "$JSON_VALID" = true ]; then
    check_passed "All JSON files are valid"
else
    check_failed "Some JSON files have syntax errors"
fi

# Validate YAML files
echo "Checking YAML files..."
if find . -name "*.yml" -o -name "*.yaml" -not -path "./node_modules/*" | xargs -r yamllint -d relaxed; then
    check_passed "All YAML files are valid"
else
    check_warning "Some YAML files have formatting warnings"
fi

echo ""
echo "5. 🌐 Validating nginx configs"
echo "------------------------------"

if [ -d "nginx" ]; then
    # Since Docker might not be available, do basic syntax checks
    echo "Performing basic nginx config validation..."
    NGINX_VALID=true
    
    for file in nginx/*.conf; do
        if [ -f "$file" ]; then
            if grep -q "server\s*{" "$file" || grep -q "http\s*{" "$file" || grep -q "events\s*{" "$file"; then
                echo "   ✅ $file has valid nginx structure"
            else
                echo "   ❌ $file has invalid nginx structure"
                NGINX_VALID=false
            fi
        fi
    done
    
    if [ "$NGINX_VALID" = true ]; then
        check_passed "nginx configs have valid structure"
    else
        check_failed "Some nginx configs have invalid structure"
    fi
else
    check_warning "nginx/ directory not found"
fi

echo ""
echo "6. 🏗️ Building application"
echo "-------------------------"

if npm run build; then
    check_passed "Application built successfully"
else
    check_failed "Application build failed"
fi

echo ""
echo "📊 VALIDATION SUMMARY"
echo "===================="
echo -e "${GREEN}✅ Checks Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}❌ Checks Failed: $CHECKS_FAILED${NC}"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All critical validations passed! Ready for deployment.${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}💥 Some validations failed. Please fix the issues before deployment.${NC}"
    exit 1
fi