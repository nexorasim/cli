#!/bin/bash

# eSIM Myanmar - Update Check & Validation Script
# Usage: ./update-check.sh [environment]

set -e

ENVIRONMENT=${1:-production}
BASE_URL="https://esim-myanmar.com"
STAGING_URL="https://staging.esim-myanmar.com"
LOG_FILE="update-check-$(date +%Y%m%d-%H%M%S).log"

if [ "$ENVIRONMENT" = "staging" ]; then
    BASE_URL=$STAGING_URL
fi

echo "🚀 Starting update validation for $ENVIRONMENT environment" | tee -a $LOG_FILE
echo "Base URL: $BASE_URL" | tee -a $LOG_FILE
echo "Timestamp: $(date)" | tee -a $LOG_FILE
echo "----------------------------------------" | tee -a $LOG_FILE

# Function to check HTTP status
check_url() {
    local url=$1
    local expected_status=${2:-200}
    local description=$3
    
    echo -n "Checking $description... " | tee -a $LOG_FILE
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$status" = "$expected_status" ]; then
        echo "✅ OK ($status)" | tee -a $LOG_FILE
        return 0
    else
        echo "❌ FAILED ($status, expected $expected_status)" | tee -a $LOG_FILE
        return 1
    fi
}

# Function to validate XML
validate_xml() {
    local url=$1
    local description=$2
    
    echo -n "Validating $description XML... " | tee -a $LOG_FILE
    
    if curl -s "$url" | xmllint --noout - 2>/dev/null; then
        echo "✅ Valid XML" | tee -a $LOG_FILE
        return 0
    else
        echo "❌ Invalid XML" | tee -a $LOG_FILE
        return 1
    fi
}

# Function to check JSON API
check_json_api() {
    local url=$1
    local description=$2
    
    echo -n "Checking $description JSON... " | tee -a $LOG_FILE
    
    response=$(curl -s -H "Accept: application/json" "$url")
    
    if echo "$response" | jq . >/dev/null 2>&1; then
        echo "✅ Valid JSON" | tee -a $LOG_FILE
        return 0
    else
        echo "❌ Invalid JSON" | tee -a $LOG_FILE
        return 1
    fi
}

# Initialize counters
TOTAL_CHECKS=0
FAILED_CHECKS=0

# Core page checks
echo "📄 Checking core pages..." | tee -a $LOG_FILE
urls=(
    "$BASE_URL/ Homepage"
    "$BASE_URL/store Store"
    "$BASE_URL/blog Blog"
    "$BASE_URL/support Support"
)

for url_desc in "${urls[@]}"; do
    url=$(echo $url_desc | cut -d' ' -f1)
    desc=$(echo $url_desc | cut -d' ' -f2-)
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    check_url "$url" 200 "$desc" || FAILED_CHECKS=$((FAILED_CHECKS + 1))
done

# SEO & Feed validation
echo -e "\n🔍 Validating SEO and feeds..." | tee -a $LOG_FILE

# Sitemap validation
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
validate_xml "$BASE_URL/sitemap.xml" "Sitemap" || FAILED_CHECKS=$((FAILED_CHECKS + 1))

# RSS feed validation
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
validate_xml "$BASE_URL/rss.xml" "RSS Feed" || FAILED_CHECKS=$((FAILED_CHECKS + 1))

# Atom feed validation
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
validate_xml "$BASE_URL/atom.xml" "Atom Feed" || FAILED_CHECKS=$((FAILED_CHECKS + 1))

# Robots.txt check
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
check_url "$BASE_URL/robots.txt" 200 "Robots.txt" || FAILED_CHECKS=$((FAILED_CHECKS + 1))

# API checks
echo -e "\n🔌 Checking API endpoints..." | tee -a $LOG_FILE

# Health check
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
check_json_api "$BASE_URL/api/v1/health" "API Health" || FAILED_CHECKS=$((FAILED_CHECKS + 1))

# Plans endpoint
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
check_json_api "$BASE_URL/api/v1/plans" "Plans API" || FAILED_CHECKS=$((FAILED_CHECKS + 1))

# OpenAPI spec
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
check_url "$BASE_URL/api/openapi.yaml" 200 "OpenAPI Spec" || FAILED_CHECKS=$((FAILED_CHECKS + 1))

# Performance check
echo -e "\n⚡ Performance checks..." | tee -a $LOG_FILE
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
echo -n "Checking homepage load time... " | tee -a $LOG_FILE
load_time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL/")
if (( $(echo "$load_time < 3.0" | bc -l) )); then
    echo "✅ Fast (${load_time}s)" | tee -a $LOG_FILE
else
    echo "⚠️  Slow (${load_time}s)" | tee -a $LOG_FILE
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

# Security headers check
echo -e "\n🔒 Security headers check..." | tee -a $LOG_FILE
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
echo -n "Checking security headers... " | tee -a $LOG_FILE
headers=$(curl -s -I "$BASE_URL/" | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)" | wc -l)
if [ "$headers" -ge 2 ]; then
    echo "✅ Security headers present" | tee -a $LOG_FILE
else
    echo "⚠️  Missing security headers" | tee -a $LOG_FILE
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

# Summary
echo -e "\n📊 SUMMARY" | tee -a $LOG_FILE
echo "----------------------------------------" | tee -a $LOG_FILE
echo "Total checks: $TOTAL_CHECKS" | tee -a $LOG_FILE
echo "Failed checks: $FAILED_CHECKS" | tee -a $LOG_FILE
echo "Success rate: $(( (TOTAL_CHECKS - FAILED_CHECKS) * 100 / TOTAL_CHECKS ))%" | tee -a $LOG_FILE
echo "Log file: $LOG_FILE" | tee -a $LOG_FILE

if [ $FAILED_CHECKS -eq 0 ]; then
    echo "🎉 All checks passed!" | tee -a $LOG_FILE
    exit 0
else
    echo "❌ $FAILED_CHECKS checks failed. Please review the issues above." | tee -a $LOG_FILE
    exit 1
fi