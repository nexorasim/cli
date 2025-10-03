#!/bin/bash

# eSIM Myanmar Deployment Script
# Company: ESIM MYANMAR COMPANY LIMITED
# Website: https://www.esim.com.mm

set -e

echo "=== eSIM Myanmar Deployment Script ==="
echo "Company: ESIM MYANMAR COMPANY LIMITED"
echo "Website: https://www.esim.com.mm"
echo "========================================="

# Configuration
BACKEND_PORT=8000
FRONTEND_PORT=3000
DOMAIN="www.esim.com.mm"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   log_warn "Running as root. Consider using a non-root user for security."
fi

# Update system packages
log_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
log_info "Installing required packages..."
sudo apt install -y nginx python3 python3-pip nodejs npm redis-server mongodb

# Install Python dependencies
log_info "Installing Python dependencies..."
cd backend
pip3 install -r requirements.txt
cd ..

# Install Node.js dependencies
log_info "Installing Node.js dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

# Create systemd service for backend
log_info "Creating systemd service for backend..."
sudo tee /etc/systemd/system/esim-backend.service > /dev/null <<EOF
[Unit]
Description=eSIM Myanmar Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/esim-myanmar/backend
Environment=PATH=/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/local/bin/uvicorn server:app --host 0.0.0.0 --port $BACKEND_PORT
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Configure nginx
log_info "Configuring nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/esim-myanmar
sudo ln -sf /etc/nginx/sites-available/esim-myanmar /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
log_info "Testing nginx configuration..."
sudo nginx -t

# Create SSL certificate directory
sudo mkdir -p /etc/ssl/certs/esim-myanmar

# Generate self-signed certificate for testing (replace with real certificate in production)
log_warn "Generating self-signed SSL certificate for testing..."
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/certs/esim-myanmar/key.pem \
    -out /etc/ssl/certs/esim-myanmar/cert.pem \
    -subj "/C=MM/ST=Yangon/L=Yangon/O=ESIM MYANMAR COMPANY LIMITED/CN=$DOMAIN"

# Update nginx configuration with SSL paths
sudo sed -i "s|/path/to/cert.pem|/etc/ssl/certs/esim-myanmar/cert.pem|g" /etc/nginx/sites-available/esim-myanmar
sudo sed -i "s|/path/to/key.pem|/etc/ssl/certs/esim-myanmar/key.pem|g" /etc/nginx/sites-available/esim-myanmar

# Create web directory
sudo mkdir -p /var/www/esim-myanmar
sudo cp -r . /var/www/esim-myanmar/
sudo chown -R www-data:www-data /var/www/esim-myanmar

# Start and enable services
log_info "Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable esim-backend
sudo systemctl start esim-backend
sudo systemctl enable nginx
sudo systemctl restart nginx
sudo systemctl enable redis-server
sudo systemctl start redis-server
sudo systemctl enable mongod
sudo systemctl start mongod

# Check service status
log_info "Checking service status..."
if sudo systemctl is-active --quiet esim-backend; then
    log_info "✓ Backend service is running"
else
    log_error "✗ Backend service failed to start"
    sudo systemctl status esim-backend
fi

if sudo systemctl is-active --quiet nginx; then
    log_info "✓ Nginx is running"
else
    log_error "✗ Nginx failed to start"
    sudo systemctl status nginx
fi

# Test API endpoints
log_info "Testing API endpoints..."
sleep 5

if curl -f http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
    log_info "✓ Backend API is responding"
else
    log_error "✗ Backend API is not responding"
fi

# Setup firewall
log_info "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create backup script
log_info "Creating backup script..."
sudo tee /usr/local/bin/esim-backup.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/esim-myanmar"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
mongodump --out $BACKUP_DIR/mongodb_$DATE

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/esim-myanmar

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "mongodb_*" -mtime +7 -exec rm -rf {} +

echo "Backup completed: $DATE"
EOF

sudo chmod +x /usr/local/bin/esim-backup.sh

# Setup daily backup cron job
log_info "Setting up daily backups..."
echo "0 2 * * * /usr/local/bin/esim-backup.sh" | sudo crontab -

# Display deployment summary
echo ""
echo "========================================="
echo "         DEPLOYMENT COMPLETE"
echo "========================================="
echo "Company: ESIM MYANMAR COMPANY LIMITED"
echo "Website: https://$DOMAIN"
echo "Backend API: http://localhost:$BACKEND_PORT"
echo "Contact: info@esim.com.mm"
echo "Phone: (+95) 96 50000172"
echo ""
echo "Services Status:"
echo "- Backend API: $(sudo systemctl is-active esim-backend)"
echo "- Nginx: $(sudo systemctl is-active nginx)"
echo "- Redis: $(sudo systemctl is-active redis-server)"
echo "- MongoDB: $(sudo systemctl is-active mongod)"
echo ""
echo "Next Steps:"
echo "1. Configure DNS to point $DOMAIN to this server"
echo "2. Replace self-signed certificate with valid SSL certificate"
echo "3. Configure payment gateways (MPU, KBZPay, WavePay, Stripe)"
echo "4. Set up monitoring and alerting"
echo "5. Test eSIM activation workflow"
echo ""
echo "Logs:"
echo "- Backend: sudo journalctl -u esim-backend -f"
echo "- Nginx: sudo tail -f /var/log/nginx/error.log"
echo "- Access: sudo tail -f /var/log/nginx/access.log"
echo "========================================="