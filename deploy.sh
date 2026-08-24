#!/bin/bash

# 🚀 Supun Group - Quick Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting Supun Group Website Deployment..."
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="supun-group"
APP_DIR="/var/www/supungroup"
DOMAIN="your-domain.com"  # Change this!
GIT_REPO="https://github.com/Zenax-Solutions/web-folio-prime.git"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Running as root"

# Step 1: Update system
echo -e "\n${YELLOW}[1/10]${NC} Updating system packages..."
apt update && apt upgrade -y

# Step 2: Install Node.js
echo -e "\n${YELLOW}[2/10]${NC} Installing Node.js 20.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo -e "${GREEN}✓${NC} Node.js version: $(node -v)"

# Step 3: Install PM2
echo -e "\n${YELLOW}[3/10]${NC} Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
echo -e "${GREEN}✓${NC} PM2 installed"

# Step 4: Install Nginx
echo -e "\n${YELLOW}[4/10]${NC} Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
fi
echo -e "${GREEN}✓${NC} Nginx installed"

# Step 5: Install build tools
echo -e "\n${YELLOW}[5/10]${NC} Installing build tools..."
apt-get install -y build-essential git

# Step 6: Clone repository
echo -e "\n${YELLOW}[6/10]${NC} Setting up application..."
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}⚠${NC} Directory exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    echo -e "Cloning repository..."
    mkdir -p $APP_DIR
    git clone $GIT_REPO $APP_DIR
    cd $APP_DIR
fi

# Step 7: Install dependencies and build
echo -e "\n${YELLOW}[7/10]${NC} Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "\n${YELLOW}Creating .env file...${NC}"
    JWT_SECRET=$(openssl rand -base64 32)
    cat > .env << EOL
PORT=3001
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
DATABASE_PATH=$APP_DIR/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=$APP_DIR/server/uploads
EOL
    echo -e "${GREEN}✓${NC} Environment file created"
fi

# Step 8: Setup directories and database
echo -e "\n${YELLOW}[8/10]${NC} Setting up database..."
mkdir -p server/uploads
chmod -R 755 server/uploads
npm run db:init
echo -e "${GREEN}✓${NC} Database initialized"

# Build frontend
echo -e "\n${YELLOW}Building frontend...${NC}"
npm run build
echo -e "${GREEN}✓${NC} Frontend built"

# Step 9: Setup PM2
echo -e "\n${YELLOW}[9/10]${NC} Setting up PM2 process manager..."
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start server/index.js --name $APP_NAME
pm2 save
pm2 startup | tail -n 1 | bash || true
echo -e "${GREEN}✓${NC} Backend running on PM2"

# Step 10: Configure Nginx
echo -e "\n${YELLOW}[10/10]${NC} Configuring Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $APP_DIR/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
    
    location /uploads/ {
        alias $APP_DIR/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOL

# Enable site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
echo -e "${GREEN}✓${NC} Nginx configured"

# Display summary
echo -e "\n${GREEN}=============================================="
echo -e "🎉 Deployment Complete!"
echo -e "==============================================${NC}"
echo -e "\n📋 Summary:"
echo -e "  • Application: $APP_NAME"
echo -e "  • Directory: $APP_DIR"
echo -e "  • Domain: http://$DOMAIN"
echo -e "  • Backend: http://localhost:3001"
echo -e "  • Admin Panel: http://$DOMAIN/admin"
echo -e "\n🔐 Default Admin Credentials:"
echo -e "  • Username: admin"
echo -e "  • Password: admin123"
echo -e "  ${RED}⚠️  CHANGE THIS IMMEDIATELY!${NC}"

echo -e "\n🔧 Useful Commands:"
echo -e "  • View logs: ${YELLOW}pm2 logs $APP_NAME${NC}"
echo -e "  • Restart app: ${YELLOW}pm2 restart $APP_NAME${NC}"
echo -e "  • Stop app: ${YELLOW}pm2 stop $APP_NAME${NC}"
echo -e "  • Nginx logs: ${YELLOW}tail -f /var/log/nginx/error.log${NC}"

echo -e "\n🔒 Next Steps:"
echo -e "  1. Update domain in /etc/nginx/sites-available/$APP_NAME"
echo -e "  2. Install SSL: ${YELLOW}apt install certbot python3-certbot-nginx${NC}"
echo -e "  3. Run: ${YELLOW}certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}"
echo -e "  4. Login to admin panel and change password"

echo -e "\n${GREEN}✅ Your website should be live at: http://$DOMAIN${NC}\n"
