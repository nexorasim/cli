# eSIM Myanmar Website - Automated Deployment & SEO Audit Scripts

This repository contains comprehensive automation scripts for the eSIM Myanmar website project that handle deployment, testing, and SEO auditing in a single automated process.

## 📁 Available Scripts

### 1. Main Automation Script
- **`esim-myanmar-auto-deploy.sh`** - Full-featured bash script (Linux/macOS)
- **`esim-myanmar-deploy.bat`** - Windows batch equivalent
- **`quick-deploy.sh`** - Simplified version for rapid deployments

### 2. Configuration Files
- **`deploy-config.env`** - Environment configuration template
- **`DEPLOYMENT_README.md`** - This documentation file

## 🚀 Quick Start

### Linux/macOS
```bash
# Make script executable
chmod +x esim-myanmar-auto-deploy.sh

# Run with default configuration
./esim-myanmar-auto-deploy.sh

# Or run quick deploy
./quick-deploy.sh
```

### Windows
```batch
# Run the batch file
esim-myanmar-deploy.bat
```

## ⚙️ Configuration

### Environment Variables
You can customize the deployment by setting these environment variables:

```bash
# Repository Configuration
export REPO_URL="https://github.com/your-org/esim-myanmar-website.git"
export REPO_DIR="esim-myanmar-website"

# Vercel Configuration  
export VERCEL_TOKEN="your_vercel_token_here"
export VERCEL_PROJECT_ID="your_project_id_here"

# Website Configuration
export WEBSITE_URL="https://www.esim.com.mm"
export STAGING_DEPLOY="true"
export PRODUCTION_DEPLOY="true"
```

### Using Configuration File
1. Copy `deploy-config.env` to your project root
2. Customize the values in the file
3. Source the file before running the script:
```bash
source deploy-config.env
./esim-myanmar-auto-deploy.sh
```

## 📋 What The Script Does

### 1. **Code Management**
- ✅ Pulls latest code from GitHub repository
- ✅ Handles both fresh clones and updates to existing repositories
- ✅ Safely resets any local changes before pulling

### 2. **Dependency Management**
- ✅ **Node.js**: Installs/updates npm/yarn packages
- ✅ **Python**: Sets up virtual environment and installs requirements
- ✅ Supports both root-level and separated frontend/backend structures
- ✅ Automatically detects package managers (yarn preferred over npm)

### 3. **Code Quality & Testing**
- ✅ **ESLint**: Frontend JavaScript/TypeScript linting
- ✅ **Flake8**: Python code style checking  
- ✅ **Black**: Python code formatting validation
- ✅ **MyPy**: Python type checking
- ✅ **Jest/React Testing Library**: Frontend unit/integration tests
- ✅ **Pytest**: Backend unit/integration tests
- ✅ Continues deployment even if some tests fail (with warnings)

### 4. **Build Process**
- ✅ Builds React frontend applications
- ✅ Builds Next.js applications if detected
- ✅ Supports custom build commands
- ✅ Optimizes for production deployment

### 5. **Environment Setup**
- ✅ Creates missing `.env` files with sensible defaults
- ✅ Configures frontend-backend communication URLs
- ✅ Sets up database connections
- ✅ Handles both development and production configurations

### 6. **Version Control**
- ✅ Automatically commits changes with timestamps
- ✅ Pushes to main branch
- ✅ Skips commit if no changes detected
- ✅ Safe to run repeatedly without creating empty commits

### 7. **Deployment**
- ✅ **Vercel Integration**: Deploys to staging and/or production
- ✅ **Automatic CLI Installation**: Installs Vercel CLI if missing
- ✅ **Token Management**: Uses environment variables for secure authentication
- ✅ **Project Linking**: Automatically links to correct Vercel project

### 8. **SEO Audit & Monitoring**
- ✅ **404 Error Detection**: Scans all URLs from sitemap
- ✅ **Meta Tag Analysis**: Validates titles, descriptions, viewport tags
- ✅ **H1 Tag Validation**: Ensures proper heading structure
- ✅ **Robots.txt Verification**: Checks accessibility and content
- ✅ **Sitemap Processing**: Automatically discovers and validates all pages
- ✅ **Performance Insights**: Title/description length optimization

### 9. **Comprehensive Logging**
- ✅ **Timestamped Logs**: Every action logged with precise timestamps
- ✅ **Error Tracking**: Detailed error messages with context
- ✅ **Colored Output**: Easy-to-read console output with status indicators
- ✅ **Report Generation**: Markdown summary reports
- ✅ **Audit Trail**: Complete deployment history

## 🛠️ Technical Requirements

### System Dependencies
- **Git** (for repository operations)
- **Node.js & npm/yarn** (for frontend dependencies)
- **Python 3.7+** (for backend dependencies)
- **curl** (for SEO auditing)
- **Internet connection** (for deployments and auditing)

### Optional Dependencies
- **Vercel CLI** (automatically installed if missing)
- **Virtual environment tools** (venv, automatically created)

## 📊 Output Examples

### Successful Deployment
```
2025-01-XX 10:30:15 [INFO] Starting eSIM Myanmar Website Full Auto Deploy + Google SEO Audit
2025-01-XX 10:30:16 [SUCCESS] Repository updated successfully
2025-01-XX 10:30:45 [SUCCESS] Node.js dependencies installed
2025-01-XX 10:31:20 [SUCCESS] Project build completed
2025-01-XX 10:31:35 [SUCCESS] Tests completed
2025-01-XX 10:32:10 [SUCCESS] Production deployment completed
2025-01-XX 10:32:25 [INFO] Title OK (45 chars): eSIM Myanmar - Global Connectivity
2025-01-XX 10:32:26 [SUCCESS] ===== Auto Deploy + SEO Audit Completed Successfully =====
```

### SEO Issues Detected
```
2025-01-XX 10:32:25 [WARNING] Title too long (75 chars): /about -> eSIM Myanmar About Us - Learn About Our Global eSIM Solutions and Services
2025-01-XX 10:32:26 [WARNING] Missing meta description: /contact
2025-01-XX 10:32:27 [ERROR] 404 Found: https://www.esim.com.mm/old-page
```

## 🔧 Customization Options

### Custom Build Commands
Edit the script to use different build commands:
```bash
# Frontend
FRONTEND_BUILD_CMD="npm run build:prod"

# Backend  
BACKEND_BUILD_CMD="python setup.py build"
```

### Additional SEO Checks
Add custom SEO validation rules in the `check_url_seo()` function:
```bash
# Check for specific meta tags
if ! echo "$content" | grep -q 'property="og:title"'; then
    log_warning "Missing Open Graph title: $url"
fi
```

### Notification Integration
Add webhook notifications for deployment status:
```bash
# Slack notification
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Deployment completed for eSIM Myanmar website"}' \
  $SLACK_WEBHOOK_URL
```

## 🚨 Troubleshooting

### Common Issues

#### Permission Errors
```bash
chmod +x esim-myanmar-auto-deploy.sh
```

#### Vercel Token Issues
```bash
# Set your token explicitly
export VERCEL_TOKEN="your_actual_token"
```

#### Git Authentication
```bash
# Use SSH instead of HTTPS
export REPO_URL="git@github.com:your-org/esim-myanmar-website.git"
```

#### Node.js Version Issues
```bash
# Use Node Version Manager
nvm use 18
./esim-myanmar-auto-deploy.sh
```

### Debug Mode
Run with verbose logging:
```bash
bash -x esim-myanmar-auto-deploy.sh
```

## 📈 Advanced Usage

### CI/CD Integration
Use with GitHub Actions, GitLab CI, or Jenkins:
```yaml
# .github/workflows/deploy.yml
name: Deploy eSIM Myanmar Website
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run deployment script
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: ./esim-myanmar-auto-deploy.sh
```

### Scheduled Deployments
Run automatically with cron:
```bash
# Deploy every day at 2 AM
0 2 * * * /path/to/esim-myanmar-auto-deploy.sh
```

### Multi-Environment Deployments
```bash
# Deploy to staging
STAGING_DEPLOY=true PRODUCTION_DEPLOY=false ./esim-myanmar-auto-deploy.sh

# Deploy to production only
STAGING_DEPLOY=false PRODUCTION_DEPLOY=true ./esim-myanmar-auto-deploy.sh
```

## 📝 Log Files

The script generates several types of logs:

- **`deployment-YYYYMMDD-HHMMSS.log`** - Detailed execution log
- **`deployment-report-YYYYMMDD-HHMMSS.md`** - Summary report in Markdown
- **Console output** - Real-time status with color coding

## 🔐 Security Considerations

- **Tokens**: Store sensitive tokens in environment variables, not in scripts
- **Logs**: Review logs before sharing as they may contain sensitive information
- **Permissions**: Ensure scripts have appropriate file system permissions
- **Git**: Be cautious with automatic commits in production environments

## 📞 Support & Contributing

### Getting Help
1. Check the troubleshooting section above
2. Review the generated log files for specific error messages
3. Ensure all dependencies are properly installed
4. Verify environment variables are correctly set

### Contributing
1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request with a clear description

---

**Last Updated**: January 2025  
**Compatible With**: Linux, macOS, Windows (WSL), CI/CD environments