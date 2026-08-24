# 🚀 Deployment Guide - CloudPanel / VPS Hosting

This guide will help you deploy the Supun Group of Companies website to a cloud server using CloudPanel or a standard VPS.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ A VPS or Cloud Server (DigitalOcean, Linode, AWS, etc.)
- ✅ CloudPanel installed (or Nginx/Apache)
- ✅ Node.js 18+ installed on the server
- ✅ PM2 for process management
- ✅ Domain name pointed to your server

---

## 🎯 Deployment Options

### Option 1: CloudPanel Deployment (Recommended for Beginners)

#### Step 1: Server Setup
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install build tools
apt-get install -y build-essential
```

#### Step 2: Create Application in CloudPanel
1. Login to CloudPanel (usually at `https://your-server-ip:8443`)
2. Go to **Sites** → **Add Site**
3. Choose **Node.js** application
4. Set domain name (e.g., `supungroup.com`)
5. Choose Node.js version (20.x)
6. CloudPanel will create the directory structure

#### Step 3: Upload Your Project
```bash
# On your local machine, create a production build
npm run build

# Create a deployment package (exclude node_modules)
# Option A: Using git (recommended)
git push origin main

# Option B: Using SCP
cd d:\Projects\supun_groups_of_companies\web-folio-prime
tar -czf supun-app.tar.gz --exclude=node_modules --exclude=.git .
scp supun-app.tar.gz root@your-server-ip:/home/supungroup/htdocs/
```

#### Step 4: Server-Side Setup
```bash
# SSH into server
ssh root@your-server-ip

# Navigate to site directory
cd /home/supungroup/htdocs/

# If you uploaded tar.gz
tar -xzf supun-app.tar.gz
rm supun-app.tar.gz

# Or clone from git
git clone https://github.com/Zenax-Solutions/web-folio-prime.git .

# Install dependencies
npm install --production

# Create production environment file
nano .env
```

#### Step 5: Configure Environment Variables
Create `.env` file with production settings:
```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=your-random-super-secret-production-jwt-key-here

# Database
DATABASE_PATH=/home/supungroup/htdocs/server/database.sqlite

# Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/home/supungroup/htdocs/server/uploads

# Frontend URL (your domain)
FRONTEND_URL=https://supungroup.com
```

#### Step 6: Initialize Database
```bash
# Create database and uploads directory
mkdir -p server/uploads
npm run db:init

# Optional: Seed with initial data
npm run db:seed
```

#### Step 7: Build Frontend
```bash
# Build the frontend
npm run build

# This creates a 'dist' folder with static files
```

#### Step 8: Setup PM2 Process Manager
```bash
# Start the backend server with PM2
pm2 start server/index.js --name "supun-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

#### Step 9: Configure Nginx (CloudPanel does this automatically)
Create or edit nginx configuration:
```nginx
# Frontend (React App)
server {
    listen 80;
    server_name supungroup.com www.supungroup.com;
    
    root /home/supungroup/htdocs/dist;
    index index.html;
    
    # Frontend routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Serve uploaded files
    location /uploads/ {
        alias /home/supungroup/htdocs/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 10: SSL Certificate (HTTPS)
```bash
# In CloudPanel, go to your site → SSL/TLS
# Click "New Let's Encrypt Certificate"
# Or manually with certbot:

apt install certbot python3-certbot-nginx
certbot --nginx -d supungroup.com -d www.supungroup.com
```

---

### Option 2: Manual VPS Deployment (Advanced)

#### Complete Setup Script
```bash
#!/bin/bash

# Run this script on your fresh Ubuntu 22.04 VPS

# Update system
apt update && apt upgrade -y

# Install Nginx
apt install -y nginx

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install build tools
apt-get install -y build-essential

# Create application directory
mkdir -p /var/www/supungroup
cd /var/www/supungroup

# Clone repository
git clone https://github.com/Zenax-Solutions/web-folio-prime.git .

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=3001
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_PATH=/var/www/supungroup/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/supungroup/server/uploads
EOL

# Setup directories
mkdir -p server/uploads
chmod -R 755 server/uploads

# Initialize database
npm run db:init

# Build frontend
npm run build

# Start backend with PM2
pm2 start server/index.js --name supun-backend
pm2 save
pm2 startup

# Configure Nginx
cat > /etc/nginx/sites-available/supungroup << 'EOL'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/supungroup/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads/ {
        alias /var/www/supungroup/server/uploads/;
    }
}
EOL

# Enable site
ln -s /etc/nginx/sites-available/supungroup /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Install SSL
apt install -y certbot python3-certbot-nginx
# certbot --nginx -d your-domain.com -d www.your-domain.com

echo "Deployment complete!"
```

---

## 🔄 Update/Redeploy Process

When you make changes and want to update:

```bash
# On your local machine
git add .
git commit -m "Your changes"
git push origin main

# On the server
cd /var/www/supungroup  # or your app directory
git pull origin main
npm install  # if package.json changed
npm run build  # rebuild frontend
pm2 restart supun-backend
```

---

## 🐳 Docker Deployment (Alternative)

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "server/index.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - ./server/uploads:/app/server/uploads
      - ./server/database.sqlite:/app/server/database.sqlite
    environment:
      - NODE_ENV=production
      - PORT=3001
      - JWT_SECRET=your-secret-key
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

---

## ✅ Post-Deployment Checklist

- [ ] Website accessible via domain
- [ ] SSL certificate installed (HTTPS working)
- [ ] Admin panel accessible at `/admin`
- [ ] Can upload images and PDFs
- [ ] Database initialized
- [ ] PM2 running and saved
- [ ] Nginx configured correctly
- [ ] File permissions set correctly
- [ ] Environment variables configured
- [ ] Backup strategy in place

---

## 🔧 Troubleshooting

### Backend not starting:
```bash
pm2 logs supun-backend
# Check for errors in logs
```

### Frontend not showing:
```bash
# Check nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Database issues:
```bash
# Reinitialize database
cd /var/www/supungroup
npm run db:init
```

### File upload not working:
```bash
# Check permissions
chmod -R 755 server/uploads
chown -R www-data:www-data server/uploads
```

---

## 📞 Need Help?

Common hosting providers:
- **DigitalOcean** - Easy droplets with CloudPanel
- **Linode** - Great for Node.js apps
- **AWS Lightsail** - Simple and affordable
- **Hetzner** - European servers
- **Vultr** - Global locations

Default admin credentials:
- Username: `admin`
- Password: `admin123`
- ⚠️ **CHANGE IMMEDIATELY AFTER FIRST LOGIN!**

---

## 🎉 Your site should now be live!

Visit: `https://your-domain.com`
Admin: `https://your-domain.com/admin`
