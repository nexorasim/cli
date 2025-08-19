#!/bin/bash

# ===== eSIM Myanmar Smart System AI - Intelligent Setup & Validation =====
# This script prepares and validates the environment for Smart System AI deployment

set -e

# Colors for enhanced output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Configuration
SETUP_LOG="smart-setup-$(date +%Y%m%d-%H%M%S).log"

print_banner() {
    echo -e "${CYAN}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║                    eSIM Myanmar Smart System AI Setup                       ║
║                   Intelligent Environment Preparation                       ║
║                              Version 2.0                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

log_info() { echo -e "${BLUE}[INFO]${NC} $@" | tee -a "${SETUP_LOG}"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $@" | tee -a "${SETUP_LOG}"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $@" | tee -a "${SETUP_LOG}"; }
log_error() { echo -e "${RED}[ERROR]${NC} $@" | tee -a "${SETUP_LOG}"; }
log_ai() { echo -e "${PURPLE}[AI]${NC} $@" | tee -a "${SETUP_LOG}"; }

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
WARNINGS_COUNT=0

test_command() {
    local cmd=$1
    local name=$2
    local install_hint=$3
    
    if command -v "$cmd" >/dev/null 2>&1; then
        local version=$(${cmd} --version 2>/dev/null | head -1 || echo "Version unknown")
        log_success "$name is installed: $version"
        ((TESTS_PASSED++))
        return 0
    else
        log_error "$name is NOT installed"
        if [ -n "$install_hint" ]; then
            log_info "Install with: $install_hint"
        fi
        ((TESTS_FAILED++))
        return 1
    fi
}

test_file() {
    local file=$1
    local name=$2
    
    if [ -f "$file" ]; then
        log_success "$name exists: $file"
        ((TESTS_PASSED++))
        return 0
    else
        log_error "$name is missing: $file"
        ((TESTS_FAILED++))
        return 1
    fi
}

test_url() {
    local url=$1
    local name=$2
    
    if curl -s --head "$url" --max-time 10 | head -n 1 | grep -q "200 OK"; then
        log_success "$name is accessible: $url"
        ((TESTS_PASSED++))
        return 0
    else
        log_error "$name is NOT accessible: $url"
        ((TESTS_FAILED++))
        return 1
    fi
}

install_missing_tools() {
    log_ai "Attempting to install missing tools automatically..."
    
    # Detect package manager
    if command -v apt-get >/dev/null 2>&1; then
        PKG_MANAGER="apt-get"
        PKG_UPDATE="sudo apt-get update"
        PKG_INSTALL="sudo apt-get install -y"
    elif command -v yum >/dev/null 2>&1; then
        PKG_MANAGER="yum"
        PKG_UPDATE="sudo yum update"
        PKG_INSTALL="sudo yum install -y"
    elif command -v brew >/dev/null 2>&1; then
        PKG_MANAGER="brew"
        PKG_UPDATE="brew update"
        PKG_INSTALL="brew install"
    else
        log_warning "No supported package manager found, manual installation required"
        return 1
    fi
    
    log_info "Detected package manager: $PKG_MANAGER"
    
    # Update package lists
    log_info "Updating package lists..."
    $PKG_UPDATE >/dev/null 2>&1 || log_warning "Failed to update package lists"
    
    # Install missing essentials
    local tools_to_install=()
    
    if ! command -v git >/dev/null 2>&1; then
        tools_to_install+=("git")
    fi
    
    if ! command -v curl >/dev/null 2>&1; then
        tools_to_install+=("curl")
    fi
    
    if ! command -v node >/dev/null 2>&1; then
        if [ "$PKG_MANAGER" = "brew" ]; then
            tools_to_install+=("node")
        else
            log_info "Installing Node.js via NodeSource repository..."
            if [ "$PKG_MANAGER" = "apt-get" ]; then
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                tools_to_install+=("nodejs")
            elif [ "$PKG_MANAGER" = "yum" ]; then
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                tools_to_install+=("nodejs")
            fi
        fi
    fi
    
    if ! command -v python3 >/dev/null 2>&1; then
        if [ "$PKG_MANAGER" = "apt-get" ]; then
            tools_to_install+=("python3" "python3-pip" "python3-venv")
        elif [ "$PKG_MANAGER" = "yum" ]; then
            tools_to_install+=("python3" "python3-pip")
        else
            tools_to_install+=("python3")
        fi
    fi
    
    # Install tools
    if [ ${#tools_to_install[@]} -gt 0 ]; then
        log_info "Installing missing tools: ${tools_to_install[*]}"
        $PKG_INSTALL "${tools_to_install[@]}" >/dev/null 2>&1 || log_warning "Some tools failed to install"
    fi
    
    # Install Yarn if Node.js is available
    if command -v npm >/dev/null 2>&1 && ! command -v yarn >/dev/null 2>&1; then
        log_info "Installing Yarn package manager..."
        sudo npm install -g yarn >/dev/null 2>&1 || log_warning "Failed to install Yarn"
    fi
    
    log_success "Automatic installation completed"
}

optimize_system() {
    log_ai "Applying intelligent system optimizations..."
    
    # Git configuration optimization
    if command -v git >/dev/null 2>&1; then
        log_info "Optimizing Git configuration..."
        
        # Set safe defaults if not configured
        if ! git config --global user.name >/dev/null 2>&1; then
            git config --global user.name "eSIM Myanmar Smart System"
            log_info "Set default Git user name"
        fi
        
        if ! git config --global user.email >/dev/null 2>&1; then
            git config --global user.email "smartsystem@esimmyanmar.com"
            log_info "Set default Git user email"
        fi
        
        # Performance optimizations
        git config --global core.preloadindex true
        git config --global core.fscache true
        git config --global gc.auto 256
        
        log_success "Git configuration optimized"
    fi
    
    # NPM/Yarn optimization
    if command -v npm >/dev/null 2>&1; then
        log_info "Optimizing NPM configuration..."
        npm config set fund false >/dev/null 2>&1
        npm config set audit-level moderate >/dev/null 2>&1
        log_success "NPM configuration optimized"
    fi
    
    if command -v yarn >/dev/null 2>&1; then
        log_info "Optimizing Yarn configuration..."
        yarn config set silent true >/dev/null 2>&1
        log_success "Yarn configuration optimized"
    fi
    
    # Python optimization
    if command -v pip3 >/dev/null 2>&1; then
        log_info "Optimizing Python pip configuration..."
        pip3 config set global.disable-pip-version-check true >/dev/null 2>&1 || true
        log_success "Python pip optimized"
    fi
}

create_smart_workspace() {
    log_ai "Creating intelligent workspace structure..."
    
    # Create smart directories
    mkdir -p smart-workspace/{logs,reports,backups,cache,temp} 2>/dev/null
    
    # Create smart configuration
    if [ ! -f "smart-workspace/smart-ai.config" ]; then
        cat > smart-workspace/smart-ai.config << EOF
# eSIM Myanmar Smart System AI Configuration
# Generated: $(date)

[workspace]
version=2.0
created=$(date -u +%Y-%m-%dT%H:%M:%SZ)
last_updated=$(date -u +%Y-%m-%dT%H:%M:%SZ)

[optimization]
auto_cleanup=true
cache_enabled=true
performance_monitoring=true
intelligent_scheduling=true

[security]
secure_mode=true
audit_enabled=true
vulnerability_scanning=true
access_logging=true
EOF
        log_success "Smart workspace configuration created"
    fi
    
    # Create intelligent .gitignore for workspace
    cat > smart-workspace/.gitignore << EOF
# Smart System AI Workspace
logs/
cache/
temp/
*.log
*.tmp
audit-*.txt
deployment-*.md
security-*.json
vulnerability-*.json
EOF
    
    log_success "Intelligent workspace structure created"
}

print_banner
log_ai "Starting eSIM Myanmar Smart System AI Setup & Validation"
log_info "Setup log: $SETUP_LOG"

echo ""
echo "🧪 COMPREHENSIVE SYSTEM VALIDATION"
echo "===================================="

# Phase 1: Core System Dependencies
echo ""
echo "📋 Phase 1: Core System Dependencies"
echo "-------------------------------------"
test_command "git" "Git" "sudo apt-get install git"
test_command "curl" "cURL" "sudo apt-get install curl"
test_command "wget" "wget" "sudo apt-get install wget"
test_command "unzip" "unzip" "sudo apt-get install unzip"

# Phase 2: Development Environment
echo ""
echo "🛠️  Phase 2: Development Environment"
echo "------------------------------------"
test_command "node" "Node.js" "Install from https://nodejs.org/ or use package manager"
test_command "npm" "NPM" "Usually comes with Node.js"
test_command "python3" "Python 3" "sudo apt-get install python3"
test_command "pip3" "pip3" "sudo apt-get install python3-pip"

# Phase 3: Optional but Recommended Tools
echo ""
echo "⚡ Phase 3: Performance Tools"
echo "-----------------------------"
test_command "yarn" "Yarn" "npm install -g yarn" || ((WARNINGS_COUNT++))
test_command "bc" "Basic Calculator" "sudo apt-get install bc" || ((WARNINGS_COUNT++))

# Phase 4: Smart System AI Files
echo ""
echo "📁 Phase 4: Smart System AI Components"
echo "--------------------------------------"
test_file "/app/esim-myanmar-smart-ai.sh" "Smart System AI Script"
test_file "/app/smart-config.env" "Smart Configuration File"

# Check if main script is executable
if [ -x "/app/esim-myanmar-smart-ai.sh" ]; then
    log_success "Smart System AI script is executable"
    ((TESTS_PASSED++))
else
    log_error "Smart System AI script is NOT executable"
    log_info "Fix with: chmod +x /app/esim-myanmar-smart-ai.sh"
    ((TESTS_FAILED++))
fi

# Phase 5: Network Connectivity
echo ""
echo "🌐 Phase 5: Network Connectivity"
echo "--------------------------------"
test_url "https://api.github.com" "GitHub API"
test_url "https://api.vercel.com" "Vercel API"
test_url "https://registry.npmjs.org" "NPM Registry"
test_url "https://pypi.org" "Python Package Index"

# Phase 6: Environment Variables
echo ""
echo "⚙️  Phase 6: Environment Configuration"
echo "--------------------------------------"
if [ -n "$VERCEL_TOKEN" ]; then
    log_success "VERCEL_TOKEN is configured"
    ((TESTS_PASSED++))
else
    log_warning "VERCEL_TOKEN is not set (will use default from config)"
    ((WARNINGS_COUNT++))
fi

if [ -n "$REPO_URL" ]; then
    log_success "REPO_URL is configured"  
    ((TESTS_PASSED++))
else
    log_warning "REPO_URL is not set (will use default from config)"
    ((WARNINGS_COUNT++))
fi

# Phase 7: Git Configuration
echo ""
echo "📝 Phase 7: Git Configuration"
echo "-----------------------------"
if git config --global user.name >/dev/null 2>&1; then
    git_user=$(git config --global user.name)
    log_success "Git user.name is configured: $git_user"
    ((TESTS_PASSED++))
else
    log_warning "Git user.name is not configured"
    log_info "Will set intelligent default during deployment"
    ((WARNINGS_COUNT++))
fi

if git config --global user.email >/dev/null 2>&1; then
    git_email=$(git config --global user.email)
    log_success "Git user.email is configured: $git_email"
    ((TESTS_PASSED++))
else
    log_warning "Git user.email is not configured"
    log_info "Will set intelligent default during deployment"
    ((WARNINGS_COUNT++))
fi

# Phase 8: Auto-Installation (if needed)
if [ $TESTS_FAILED -gt 0 ]; then
    echo ""
    echo "🔧 Phase 8: Automatic Installation"
    echo "----------------------------------"
    read -p "Would you like to automatically install missing dependencies? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_missing_tools
        log_info "Re-running critical tests..."
        
        # Re-test critical tools
        RETESTS_PASSED=0
        test_command "git" "Git (retest)" && ((RETESTS_PASSED++))
        test_command "curl" "cURL (retest)" && ((RETESTS_PASSED++))
        test_command "node" "Node.js (retest)" && ((RETESTS_PASSED++))
        test_command "python3" "Python 3 (retest)" && ((RETESTS_PASSED++))
        
        if [ $RETESTS_PASSED -eq 4 ]; then
            log_success "All critical tools now available!"
            TESTS_FAILED=0  # Reset failure count
        fi
    fi
fi

# Phase 9: System Optimization
echo ""
echo "🚀 Phase 9: Intelligent System Optimization"  
echo "-------------------------------------------"
optimize_system

# Phase 10: Workspace Creation
echo ""
echo "📁 Phase 10: Smart Workspace Setup"
echo "----------------------------------"
create_smart_workspace

# Phase 11: Final Validation
echo ""
echo "✅ Phase 11: Final Validation"
echo "-----------------------------"

# Test the Smart AI script syntax
if bash -n /app/esim-myanmar-smart-ai.sh 2>/dev/null; then
    log_success "Smart System AI script syntax is valid"
    ((TESTS_PASSED++))
else
    log_error "Smart System AI script has syntax errors"
    ((TESTS_FAILED++))
fi

# Summary Report
echo ""
echo "=========================================="
echo "📊 SETUP & VALIDATION SUMMARY"
echo "=========================================="
echo -e "✅ Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "❌ Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS_COUNT${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "🎉 ${GREEN}EXCELLENT! Your system is ready for Smart System AI deployment!${NC}"
    echo ""
    echo -e "${CYAN}🚀 Ready to launch Smart System AI:${NC}"
    echo -e "1. ${WHITE}Review configuration:${NC} edit smart-config.env"
    echo -e "2. ${WHITE}Launch Smart AI:${NC} ./esim-myanmar-smart-ai.sh"
    echo -e "3. ${WHITE}Monitor progress:${NC} tail -f smart-deploy-*.log"
    echo ""
    echo -e "${PURPLE}🎯 Smart System AI v2.0 Features:${NC}"
    echo "   • AI-powered dependency optimization"
    echo "   • Automatic asset generation (favicons, manifests)"
    echo "   • Advanced SEO optimization with meta tag generation"
    echo "   • Google Tag Manager integration"
    echo "   • Comprehensive security hardening"
    echo "   • Performance monitoring and optimization"
    echo "   • Intelligent error handling and recovery"
    echo "   • Complete automation with zero manual intervention"
    echo ""
    
    # Create quick launch script
    cat > launch-smart-ai.sh << 'EOF'
#!/bin/bash
echo "🚀 Launching eSIM Myanmar Smart System AI..."
source smart-config.env 2>/dev/null || true
./esim-myanmar-smart-ai.sh
EOF
    chmod +x launch-smart-ai.sh
    log_success "Created quick launch script: ./launch-smart-ai.sh"
    
    exit 0
elif [ $TESTS_FAILED -le 2 ] && [ $WARNINGS_COUNT -le 3 ]; then
    echo ""
    echo -e "⚠️  ${YELLOW}GOOD! Your system is mostly ready with minor issues.${NC}"
    echo ""
    echo -e "${BLUE}You can proceed with Smart System AI, but consider addressing:${NC}"
    echo "• Install missing optional tools for optimal performance"
    echo "• Configure environment variables for better customization" 
    echo "• Review warnings above and fix if possible"
    echo ""
    echo -e "${WHITE}To proceed anyway:${NC} ./esim-myanmar-smart-ai.sh"
    exit 0
else
    echo ""
    echo -e "❌ ${RED}CRITICAL ISSUES DETECTED! Please fix the following before proceeding:${NC}"
    echo ""
    echo -e "${WHITE}Required actions:${NC}"
    echo "• Install missing critical dependencies (Git, Node.js, Python)"
    echo "• Ensure network connectivity to required services"
    echo "• Fix any critical configuration issues"
    echo ""
    echo -e "${BLUE}After fixing issues, run this setup again:${NC} ./smart-setup.sh"
    echo ""
    echo -e "${YELLOW}Need help?${NC}"
    echo "• Check the setup log: $SETUP_LOG"
    echo "• Review system requirements in documentation"
    echo "• Ensure you have administrative privileges for installations"
    exit 1
fi