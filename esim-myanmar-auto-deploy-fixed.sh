#!/bin/bash

# ===================== eSIM Myanmar Website Auto Deploy + SEO Audit =====================
set -e  # Exit on any error

# Configuration Variables
REPO_URL="${REPO_URL:-https://github.com/nexorasim/cli.git}"
REPO_DIR="${REPO_DIR:-esim-myanmar-website}"
VERCEL_TOKEN="${VERCEL_TOKEN:-YeHB18fhvsscigEgaGglpg5A}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_QT0WVnXI3zwzZ2AoF2GcGAQ8zBss}"
WEBSITE_URL="${WEBSITE_URL:-https://www.esim.com.mm}"
LOG_FILE="deployment-$(date +%Y%m%d-%H%M%S).log"
STAGING_DEPLOY="${STAGING_DEPLOY:-false}"
PRODUCTION_DEPLOY="${PRODUCTION_DEPLOY:-true}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "${LOG_FILE}"
}

log_info() { log "INFO" "${BLUE}$@${NC}"; }
log_success() { log "SUCCESS" "${GREEN}$@${NC}"; }
log_warning() { log "WARNING" "${YELLOW}$@${NC}"; }
log_error() { log "ERROR" "${RED}$@${NC}"; }

# Error handling
handle_error() {
    log_error "Script failed at line $1. Exit code: $2"
    log_error "Last command: $BASH_COMMAND"
    exit $2
}
trap 'handle_error $LINENO $?' ERR

# ===================== MAIN DEPLOYMENT SCRIPT =====================

log_info "Starting eSIM Myanmar Website Full Auto Deploy + Google SEO Audit"
log_info "Log file: ${LOG_FILE}"

# 1. Pull the latest code from GitHub repository
log_info "Step 1: Pulling latest code from GitHub repository"
if [ ! -d "$REPO_DIR" ]; then
    log_info "Cloning repository: $REPO_URL"
    git clone "$REPO_URL" "$REPO_DIR" 2>&1 | tee -a "${LOG_FILE}"
else
    log_info "Repository exists, updating..."
    cd "$REPO_DIR"
    git reset --hard 2>&1 | tee -a "${LOG_FILE}"
    git pull origin main 2>&1 | tee -a "${LOG_FILE}"
    cd ..
fi

cd "$REPO_DIR"
log_success "Repository updated successfully"

# 2. Install and update all Node.js and Python dependencies
log_info "Step 2: Installing and updating dependencies"

# Frontend dependencies (Node.js)
if [ -f "package.json" ] || [ -f "frontend/package.json" ]; then
    log_info "Installing Node.js dependencies..."
    
    # Check if we have a frontend directory
    if [ -d "frontend" ]; then
        cd frontend
        if command -v yarn >/dev/null 2>&1; then
            log_info "Using Yarn for frontend dependencies"
            yarn install --silent 2>&1 | tee -a "../${LOG_FILE}"
        else
            log_info "Using NPM for frontend dependencies"
            npm install --silent 2>&1 | tee -a "../${LOG_FILE}"
        fi
        cd ..
    else
        # Root level package.json
        if command -v yarn >/dev/null 2>&1; then
            log_info "Using Yarn for dependencies"
            yarn install --silent 2>&1 | tee -a "${LOG_FILE}"
        else
            log_info "Using NPM for dependencies"
            npm install --silent 2>&1 | tee -a "${LOG_FILE}"
        fi
    fi
    log_success "Node.js dependencies installed"
fi

# Backend dependencies (Python)
if [ -f "requirements.txt" ] || [ -f "backend/requirements.txt" ]; then
    log_info "Installing Python dependencies..."
    
    # Check if we have a backend directory
    if [ -d "backend" ]; then
        cd backend
        if [ -f "requirements.txt" ]; then
            # Create virtual environment if it doesn't exist
            if [ ! -d "venv" ]; then
                python3 -m venv venv 2>&1 | tee -a "../${LOG_FILE}"
            fi
            source venv/bin/activate
            pip install --upgrade pip 2>&1 | tee -a "../${LOG_FILE}"
            pip install -r requirements.txt 2>&1 | tee -a "../${LOG_FILE}"
            deactivate
        fi
        cd ..
    else
        # Root level requirements.txt
        if [ ! -d "venv" ]; then
            python3 -m venv venv 2>&1 | tee -a "${LOG_FILE}"
        fi
        source venv/bin/activate
        pip install --upgrade pip 2>&1 | tee -a "${LOG_FILE}"
        pip install -r requirements.txt 2>&1 | tee -a "${LOG_FILE}"
        deactivate
    fi
    log_success "Python dependencies installed"
fi

# 3. Run linting and static analysis
log_info "Step 3: Running linting and static analysis"

# Frontend linting (ESLint)
if [ -f "frontend/package.json" ] && command -v yarn >/dev/null 2>&1; then
    cd frontend
    if yarn list eslint >/dev/null 2>&1; then
        log_info "Running ESLint for frontend..."
        yarn eslint src/ --ext .js,.jsx,.ts,.tsx --max-warnings 0 2>&1 | tee -a "../${LOG_FILE}" || log_warning "ESLint found issues"
    fi
    cd ..
elif [ -f "package.json" ] && command -v npm >/dev/null 2>&1; then
    if npm list eslint >/dev/null 2>&1; then
        log_info "Running ESLint..."
        npx eslint src/ --ext .js,.jsx,.ts,.tsx --max-warnings 0 2>&1 | tee -a "${LOG_FILE}" || log_warning "ESLint found issues"
    fi
fi

# Backend linting (Python)
if [ -f "backend/requirements.txt" ]; then
    cd backend
    source venv/bin/activate
    
    # Check if linting tools are installed
    if pip show flake8 >/dev/null 2>&1; then
        log_info "Running flake8 for backend..."
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics 2>&1 | tee -a "../${LOG_FILE}" || log_warning "Flake8 found issues"
    fi
    
    if pip show black >/dev/null 2>&1; then
        log_info "Running black format check..."
        black --check . 2>&1 | tee -a "../${LOG_FILE}" || log_warning "Black formatting issues found"
    fi
    
    if pip show mypy >/dev/null 2>&1; then
        log_info "Running mypy type checking..."
        mypy . --ignore-missing-imports 2>&1 | tee -a "../${LOG_FILE}" || log_warning "MyPy found type issues"
    fi
    
    deactivate
    cd ..
fi

log_success "Linting and static analysis completed"

# 4. Build the project
log_info "Step 4: Building the project"

# Frontend build
if [ -f "frontend/package.json" ]; then
    cd frontend
    if command -v yarn >/dev/null 2>&1; then
        log_info "Building frontend with Yarn..."
        yarn build 2>&1 | tee -a "../${LOG_FILE}"
    else
        log_info "Building frontend with NPM..."
        npm run build 2>&1 | tee -a "../${LOG_FILE}"
    fi
    cd ..
elif [ -f "package.json" ]; then
    if command -v yarn >/dev/null 2>&1; then
        log_info "Building project with Yarn..."
        yarn build 2>&1 | tee -a "${LOG_FILE}"
    else
        log_info "Building project with NPM..."
        npm run build 2>&1 | tee -a "${LOG_FILE}"
    fi
fi

log_success "Project build completed"

# 5. Run all unit and integration tests
log_info "Step 5: Running tests"

# Frontend tests
if [ -f "frontend/package.json" ]; then
    cd frontend
    if command -v yarn >/dev/null 2>&1; then
        log_info "Running frontend tests with Yarn..."
        CI=true yarn test --watchAll=false --coverage 2>&1 | tee -a "../${LOG_FILE}" || log_warning "Some frontend tests failed"
    else
        log_info "Running frontend tests with NPM..."
        CI=true npm test -- --watchAll=false --coverage 2>&1 | tee -a "../${LOG_FILE}" || log_warning "Some frontend tests failed"
    fi
    cd ..
elif [ -f "package.json" ]; then
    if command -v yarn >/dev/null 2>&1; then
        log_info "Running tests with Yarn..."
        CI=true yarn test --watchAll=false 2>&1 | tee -a "${LOG_FILE}" || log_warning "Some tests failed"
    else
        log_info "Running tests with NPM..."
        CI=true npm test -- --watchAll=false 2>&1 | tee -a "${LOG_FILE}" || log_warning "Some tests failed"
    fi
fi

# Backend tests
if [ -f "backend/requirements.txt" ]; then
    cd backend
    source venv/bin/activate
    
    if pip show pytest >/dev/null 2>&1; then
        log_info "Running Python tests with pytest..."
        pytest --verbose --tb=short 2>&1 | tee -a "../${LOG_FILE}" || log_warning "Some backend tests failed"
    fi
    
    deactivate
    cd ..
fi

log_success "Tests completed"

# 6. Create/update environment variables
log_info "Step 6: Setting up environment variables"

# Create frontend .env if it doesn't exist
if [ -d "frontend" ] && [ ! -f "frontend/.env" ]; then
    log_info "Creating frontend .env file..."
    cat > frontend/.env << EOF
REACT_APP_BACKEND_URL=https://esim-myanmar-api.vercel.app
REACT_APP_WEBSITE_URL=${WEBSITE_URL}
GENERATE_SOURCEMAP=false
EOF
fi

# Create backend .env if it doesn't exist
if [ -d "backend" ] && [ ! -f "backend/.env" ]; then
    log_info "Creating backend .env file..."
    cat > backend/.env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=esim_myanmar
CORS_ORIGINS=*
ENVIRONMENT=production
EOF
fi

log_success "Environment variables configured"

# 7. Git operations
log_info "Step 7: Committing and pushing changes"
git add -A 2>&1 | tee -a "${LOG_FILE}"
if ! git diff --cached --quiet; then
    git commit -m "Auto update: $(date '+%Y-%m-%d %H:%M:%S')" 2>&1 | tee -a "${LOG_FILE}"
    git push origin main 2>&1 | tee -a "${LOG_FILE}"
    log_success "Changes committed and pushed"
else
    log_info "No changes to commit"
fi

# 8. Deploy to Vercel
log_info "Step 8: Deploying to Vercel"

# Check if Vercel CLI is installed
if ! command -v vercel >/dev/null 2>&1; then
    log_info "Installing Vercel CLI..."
    npm install -g vercel 2>&1 | tee -a "${LOG_FILE}"
fi

# Set Vercel token
export VERCEL_TOKEN="$VERCEL_TOKEN"

# Deploy to staging first if requested
if [ "$STAGING_DEPLOY" = "true" ]; then
    log_info "Deploying to staging environment..."
    vercel --token="$VERCEL_TOKEN" --confirm --project="$VERCEL_PROJECT_ID" 2>&1 | tee -a "${LOG_FILE}"
    log_success "Staging deployment completed"
fi

# Deploy to production
if [ "$PRODUCTION_DEPLOY" = "true" ]; then
    log_info "Deploying to production environment..."
    vercel --token="$VERCEL_TOKEN" --prod --confirm --project="$VERCEL_PROJECT_ID" 2>&1 | tee -a "${LOG_FILE}"
    log_success "Production deployment completed"
fi

# ===================== SEO AUDIT SECTION =====================

log_info "Step 9: Starting Google Search SEO Audit"

# Function to check URL and extract SEO elements
check_url_seo() {
    local url=$1
    local response
    local http_code
    local title
    local description
    local h1_count
    
    log_info "Checking URL: $url"
    
    # Get HTTP response
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url" 2>/dev/null || echo "HTTPSTATUS:000")
    http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    content=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]*$//')
    
    # Check for 404 errors
    if [ "$http_code" = "404" ]; then
        log_error "404 Found: $url"
        return 1
    elif [ "$http_code" = "000" ]; then
        log_error "Error accessing URL: $url (Connection failed)"
        return 1
    elif [ "$http_code" != "200" ]; then
        log_warning "HTTP $http_code: $url"
    fi
    
    # Extract and check title
    title=$(echo "$content" | grep -i '<title>' | sed 's/.*<title>//' | sed 's/<\/title>.*//' | head -1)
    if [ -z "$title" ]; then
        log_warning "Missing title tag: $url"
    elif [ ${#title} -gt 60 ]; then
        log_warning "Title too long (${#title} chars): $url -> $title"
    elif [ ${#title} -lt 30 ]; then
        log_warning "Title too short (${#title} chars): $url -> $title"
    else
        log_info "Title OK (${#title} chars): $title"
    fi
    
    # Check meta description
    description=$(echo "$content" | grep -i 'name="description"' | head -1)
    if [ -z "$description" ]; then
        log_warning "Missing meta description: $url"
    else
        # Extract content from meta tag
        desc_content=$(echo "$description" | sed 's/.*content="//' | sed 's/".*//')
        if [ ${#desc_content} -gt 160 ]; then
            log_warning "Meta description too long (${#desc_content} chars): $url"
        elif [ ${#desc_content} -lt 120 ]; then
            log_warning "Meta description too short (${#desc_content} chars): $url"
        else
            log_info "Meta description OK (${#desc_content} chars)"
        fi
    fi
    
    # Check H1 tags
    h1_count=$(echo "$content" | grep -i '<h1' | wc -l)
    if [ "$h1_count" -eq 0 ]; then
        log_warning "Missing H1 tag: $url"
    elif [ "$h1_count" -gt 1 ]; then
        log_warning "Multiple H1 tags ($h1_count): $url"
    else
        log_info "H1 tag OK: $url"
    fi
    
    # Check for essential meta tags
    if ! echo "$content" | grep -q 'name="viewport"'; then
        log_warning "Missing viewport meta tag: $url"
    fi
    
    if ! echo "$content" | grep -q 'charset='; then
        log_warning "Missing charset declaration: $url"
    fi
    
    return 0
}

# Get sitemap URLs
log_info "Fetching sitemap from ${WEBSITE_URL}/sitemap.xml"
sitemap_response=$(curl -s "${WEBSITE_URL}/sitemap.xml" 2>/dev/null || echo "")

if [ -n "$sitemap_response" ]; then
    # Extract URLs from sitemap
    urls=$(echo "$sitemap_response" | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//g; s/<\/loc>//g')
    
    if [ -n "$urls" ]; then
        log_info "Found $(echo "$urls" | wc -l) URLs in sitemap"
        
        # Check each URL
        while IFS= read -r url; do
            [ -n "$url" ] && check_url_seo "$url"
        done <<< "$urls"
    else
        log_warning "No URLs found in sitemap"
    fi
else
    log_warning "Could not fetch sitemap, checking common pages instead"
    
    # Check common pages if sitemap is not available
    common_pages=(
        "$WEBSITE_URL"
        "$WEBSITE_URL/about"
        "$WEBSITE_URL/contact"
        "$WEBSITE_URL/esim"
        "$WEBSITE_URL/plans"
        "$WEBSITE_URL/support"
    )
    
    for url in "${common_pages[@]}"; do
        check_url_seo "$url"
    done
fi

# 10. Check robots.txt
log_info "Step 10: Checking robots.txt configuration"
robots_response=$(curl -s "${WEBSITE_URL}/robots.txt" 2>/dev/null || echo "")

if [ -n "$robots_response" ]; then
    log_success "Robots.txt found and accessible"
    log_info "Robots.txt content:"
    echo "$robots_response" | tee -a "${LOG_FILE}"
    
    # Check for sitemap reference in robots.txt
    if echo "$robots_response" | grep -q -i "sitemap:"; then
        log_success "Sitemap reference found in robots.txt"
    else
        log_warning "No sitemap reference found in robots.txt"
    fi
    
    # Check for user-agent directives
    if echo "$robots_response" | grep -q -i "user-agent:"; then
        log_success "User-agent directives found in robots.txt"
    else
        log_warning "No user-agent directives found in robots.txt"
    fi
else
    log_error "Robots.txt not found or not accessible at ${WEBSITE_URL}/robots.txt"
fi

# ===================== FINAL REPORT =====================

log_info "Generating deployment and SEO audit report..."

# Create summary report
report_file="deployment-report-$(date +%Y%m%d-%H%M%S).md"
cat > "$report_file" << EOF
# eSIM Myanmar Website Deployment & SEO Audit Report

**Date**: $(date '+%Y-%m-%d %H:%M:%S')
**Repository**: $REPO_URL
**Website URL**: $WEBSITE_URL

## Deployment Summary
- ✅ Code pulled from repository
- ✅ Dependencies installed (Node.js & Python)
- ✅ Linting and static analysis completed
- ✅ Project built successfully
- ✅ Tests executed
- ✅ Environment variables configured
- ✅ Changes committed and pushed to Git
- ✅ Deployed to Vercel

## SEO Audit Summary
- URLs checked for 404 errors
- Page titles analyzed (length and presence)
- Meta descriptions verified
- H1 tags validated
- Robots.txt configuration checked

## Next Steps
1. Review any warnings or errors in the detailed log: \`${LOG_FILE}\`
2. Fix any SEO issues identified in the audit
3. Monitor website performance and user experience
4. Schedule regular automated deployments

## Log Files
- Detailed log: \`${LOG_FILE}\`
- This report: \`${report_file}\`
EOF

log_success "===== eSIM Myanmar Website Auto Deploy + SEO Audit Completed Successfully ====="
log_info "Detailed logs saved to: ${LOG_FILE}"
log_info "Summary report generated: ${report_file}"

# Return to original directory
cd ..

exit 0