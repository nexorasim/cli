# eSIM Myanmar Deployment Scripts - Usage Examples

This document provides practical examples for using the eSIM Myanmar automated deployment and SEO audit scripts.

## 🚀 Basic Usage Examples

### 1. Simple Deployment
```bash
# Most basic usage with default settings
./esim-myanmar-auto-deploy.sh
```

### 2. Custom Repository
```bash
# Deploy from a different repository
export REPO_URL="https://github.com/your-org/esim-myanmar-website.git"
./esim-myanmar-auto-deploy.sh
```

### 3. Staging Only Deployment
```bash
# Deploy to staging environment only
export STAGING_DEPLOY="true"
export PRODUCTION_DEPLOY="false"
./esim-myanmar-auto-deploy.sh
```

### 4. Custom Website URL for SEO Audit
```bash
# Audit a different website
export WEBSITE_URL="https://staging.esim.com.mm"
./esim-myanmar-auto-deploy.sh
```

## 🔧 Configuration Examples

### Example 1: Full Production Setup
```bash
#!/bin/bash
# production-deploy.sh

# Repository configuration
export REPO_URL="https://github.com/esim-myanmar/website.git"
export REPO_DIR="esim-production"

# Vercel configuration
export VERCEL_TOKEN="your_production_vercel_token"
export VERCEL_PROJECT_ID="your_production_project_id"

# Website configuration
export WEBSITE_URL="https://www.esim.com.mm"
export STAGING_DEPLOY="false"
export PRODUCTION_DEPLOY="true"

# Run the deployment
./esim-myanmar-auto-deploy.sh
```

### Example 2: Development/Staging Setup
```bash
#!/bin/bash
# staging-deploy.sh

# Use staging configurations
export REPO_URL="https://github.com/esim-myanmar/website.git"
export REPO_DIR="esim-staging"
export VERCEL_TOKEN="your_staging_vercel_token"
export VERCEL_PROJECT_ID="your_staging_project_id"
export WEBSITE_URL="https://staging.esim.com.mm"
export STAGING_DEPLOY="true"
export PRODUCTION_DEPLOY="false"

# Run deployment
./esim-myanmar-auto-deploy.sh
```

## 📊 Output Examples

### Successful Deployment Output
```
2025-01-15 14:30:15 [INFO] Starting eSIM Myanmar Website Full Auto Deploy + Google SEO Audit
2025-01-15 14:30:15 [INFO] Log file: deployment-20250115-143015.log
2025-01-15 14:30:16 [INFO] Step 1: Pulling latest code from GitHub repository
2025-01-15 14:30:17 [SUCCESS] Repository updated successfully
2025-01-15 14:30:18 [INFO] Step 2: Installing and updating dependencies
2025-01-15 14:30:45 [SUCCESS] Node.js dependencies installed
2025-01-15 14:31:20 [SUCCESS] Project build completed
2025-01-15 14:31:35 [SUCCESS] Tests completed
2025-01-15 14:32:10 [SUCCESS] Production deployment completed
2025-01-15 14:32:25 [INFO] Step 9: Starting Google Search SEO Audit
2025-01-15 14:32:26 [INFO] Title OK (45 chars): eSIM Myanmar - Global Connectivity
2025-01-15 14:32:27 [INFO] Meta description OK (135 chars)
2025-01-15 14:32:28 [INFO] H1 tag OK: https://www.esim.com.mm
2025-01-15 14:32:29 [SUCCESS] ===== eSIM Myanmar Website Auto Deploy + SEO Audit Completed Successfully =====
```

### SEO Issues Detected
```
2025-01-15 14:32:25 [WARNING] Title too long (75 chars): /about -> eSIM Myanmar About Us - Learn About Our Global eSIM Solutions
2025-01-15 14:32:26 [WARNING] Missing meta description: /contact
2025-01-15 14:32:27 [ERROR] 404 Found: https://www.esim.com.mm/old-pricing
2025-01-15 14:32:28 [WARNING] Multiple H1 tags (3): /plans
2025-01-15 14:32:29 [WARNING] Missing viewport meta tag: /support
```

## 🗂️ File Structure Examples

### Project Structure for Full-Stack App
```
esim-myanmar-website/
├── frontend/
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── .env
├── backend/
│   ├── requirements.txt
│   ├── server.py
│   └── .env
├── .gitignore
└── README.md
```

### Project Structure for Frontend-Only App
```
esim-myanmar-website/
├── package.json
├── src/
├── public/
├── .env
├── .gitignore
└── README.md
```

## 🔄 CI/CD Integration Examples

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy eSIM Myanmar Website

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
        
    - name: Download deployment script
      run: |
        curl -O https://raw.githubusercontent.com/your-org/deployment-scripts/main/esim-myanmar-auto-deploy.sh
        chmod +x esim-myanmar-auto-deploy.sh
        
    - name: Run deployment
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        REPO_URL: ${{ github.server_url }}/${{ github.repository }}
        WEBSITE_URL: "https://www.esim.com.mm"
      run: ./esim-myanmar-auto-deploy.sh
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - deploy

deploy_production:
  stage: deploy
  image: ubuntu:latest
  before_script:
    - apt-get update -qq && apt-get install -y git curl nodejs npm python3 python3-pip
    - curl -O https://raw.githubusercontent.com/your-org/deployment-scripts/main/esim-myanmar-auto-deploy.sh
    - chmod +x esim-myanmar-auto-deploy.sh
  script:
    - export VERCEL_TOKEN=$VERCEL_TOKEN
    - export VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID
    - export REPO_URL=$CI_PROJECT_URL
    - export WEBSITE_URL="https://www.esim.com.mm"
    - ./esim-myanmar-auto-deploy.sh
  only:
    - main
```

### Jenkins Pipeline
```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        VERCEL_TOKEN = credentials('vercel-token')
        VERCEL_PROJECT_ID = credentials('vercel-project-id')
        REPO_URL = "${GIT_URL}"
        WEBSITE_URL = "https://www.esim.com.mm"
    }
    
    stages {
        stage('Setup') {
            steps {
                sh '''
                    curl -O https://raw.githubusercontent.com/your-org/deployment-scripts/main/esim-myanmar-auto-deploy.sh
                    chmod +x esim-myanmar-auto-deploy.sh
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh './esim-myanmar-auto-deploy.sh'
            }
        }
        
        stage('Archive Logs') {
            steps {
                archiveArtifacts artifacts: 'deployment-*.log, deployment-report-*.md'
            }
        }
    }
    
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: '.',
                reportFiles: 'deployment-report-*.md',
                reportName: 'Deployment Report'
            ])
        }
    }
}
```

## 📅 Scheduled Deployment Examples

### Cron Job for Daily Deployment
```bash
# Add to crontab with: crontab -e
# Deploy every day at 2 AM
0 2 * * * cd /path/to/scripts && ./esim-myanmar-auto-deploy.sh >> /var/log/esim-deploy.log 2>&1

# Deploy every weekday at 6 AM
0 6 * * 1-5 cd /path/to/scripts && ./esim-myanmar-auto-deploy.sh

# Deploy twice daily (6 AM and 6 PM)
0 6,18 * * * cd /path/to/scripts && ./esim-myanmar-auto-deploy.sh
```

### Systemd Timer
```ini
# /etc/systemd/system/esim-deploy.service
[Unit]
Description=eSIM Myanmar Website Deployment
Wants=esim-deploy.timer

[Service]
Type=oneshot
WorkingDirectory=/path/to/scripts
ExecStart=/path/to/scripts/esim-myanmar-auto-deploy.sh
User=deploy
Group=deploy

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/esim-deploy.timer
[Unit]
Description=Run eSIM deployment daily
Requires=esim-deploy.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

Enable with:
```bash
sudo systemctl enable esim-deploy.timer
sudo systemctl start esim-deploy.timer
```

## 🧪 Testing Examples

### Test Before Production
```bash
# Test the script without actual deployment
export STAGING_DEPLOY="true"
export PRODUCTION_DEPLOY="false"
export WEBSITE_URL="https://staging.esim.com.mm"
./esim-myanmar-auto-deploy.sh

# Review logs
tail -f deployment-*.log
```

### Validate Configuration
```bash
# Run the test script first
./test-automation.sh

# If tests pass, run deployment
if [ $? -eq 0 ]; then
    ./esim-myanmar-auto-deploy.sh
else
    echo "Tests failed, fix issues before deployment"
fi
```

## 🔍 SEO Audit Examples

### Focus Only on SEO
```bash
# Skip deployment, run SEO audit only
export STAGING_DEPLOY="false"
export PRODUCTION_DEPLOY="false"
./esim-myanmar-auto-deploy.sh
```

### Custom SEO Checks
```bash
# Audit multiple domains
for domain in "https://www.esim.com.mm" "https://staging.esim.com.mm" "https://dev.esim.com.mm"; do
    export WEBSITE_URL="$domain"
    echo "Auditing $domain..."
    ./esim-myanmar-auto-deploy.sh
done
```

## 📧 Notification Examples

### Slack Notification
```bash
#!/bin/bash
# deploy-with-slack.sh

# Run deployment
./esim-myanmar-auto-deploy.sh

# Send Slack notification
if [ $? -eq 0 ]; then
    curl -X POST -H 'Content-type: application/json' \
      --data '{"text":"✅ eSIM Myanmar website deployed successfully!"}' \
      $SLACK_WEBHOOK_URL
else
    curl -X POST -H 'Content-type: application/json' \
      --data '{"text":"❌ eSIM Myanmar website deployment failed!"}' \
      $SLACK_WEBHOOK_URL
fi
```

### Email Notification
```bash
#!/bin/bash
# deploy-with-email.sh

LOG_FILE="deployment-$(date +%Y%m%d-%H%M%S).log"

# Run deployment
./esim-myanmar-auto-deploy.sh 2>&1 | tee "$LOG_FILE"

# Send email with results
if [ $? -eq 0 ]; then
    mail -s "✅ eSIM Myanmar Deployment Successful" admin@esim.com.mm < "$LOG_FILE"
else
    mail -s "❌ eSIM Myanmar Deployment Failed" admin@esim.com.mm < "$LOG_FILE"
fi
```

## 🎯 Advanced Examples

### Multi-Branch Deployment
```bash
#!/bin/bash
# multi-branch-deploy.sh

branches=("main" "staging" "development")
environments=("production" "staging" "development")

for i in "${!branches[@]}"; do
    branch="${branches[$i]}"
    env="${environments[$i]}"
    
    echo "Deploying branch $branch to $env environment..."
    
    export REPO_BRANCH="$branch"
    export VERCEL_PROJECT_ID="${env}_project_id"
    export WEBSITE_URL="https://${env}.esim.com.mm"
    
    ./esim-myanmar-auto-deploy.sh
done
```

### Rollback Capability
```bash
#!/bin/bash
# deploy-with-rollback.sh

# Store current deployment
CURRENT_COMMIT=$(git rev-parse HEAD)

# Run deployment
./esim-myanmar-auto-deploy.sh

# Check if deployment was successful
if ! curl -f "https://www.esim.com.mm" > /dev/null 2>&1; then
    echo "Deployment failed, rolling back..."
    git reset --hard "$CURRENT_COMMIT"
    git push origin main --force
    ./esim-myanmar-auto-deploy.sh
fi
```

---

## 📝 Notes

- Always test scripts in a staging environment first
- Monitor logs carefully for any issues
- Keep Vercel tokens secure and rotate them regularly
- Consider using environment-specific configuration files
- Set up proper monitoring and alerting for production deployments