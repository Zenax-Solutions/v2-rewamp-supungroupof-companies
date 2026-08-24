# 🎯 Quick CloudPanel Deployment Guide

## Step-by-Step Instructions for Beginners

### 📌 Before You Start

You need:
1. A server with CloudPanel installed
2. Your domain name pointed to the server IP
3. SSH access to your server

---

## 🚀 Deployment Steps

### Step 1: Access Your Server

```bash
# Open PowerShell/Terminal and connect to your server
ssh root@your-server-ip

# Example: ssh root@165.227.123.45
```

### Step 2: Install Node.js (if not installed)

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

### Step 3: Install PM2 Process Manager

```bash
npm install -g pm2
```

### Step 4: Create Site in CloudPanel

1. Open CloudPanel in browser: `https://your-server-ip:8443`
2. Login with your credentials
3. Click **"Sites"** in left menu
4. Click **"Add Site"** button
5. Fill in the form:
   - **Domain Name**: `supungroup.com` (your domain)
   - **Type**: Choose "Node.js"
   - **Node.js Version**: 20.x
   - Click **"Add Site"**

CloudPanel will create: `/home/supungroup/htdocs/`

### Step 5: Upload Your Project

**Option A: Using Git (Recommended)**

```bash
# Navigate to the site directory
cd /home/supungroup/htdocs/

# Clone your repository
git clone https://github.com/Zenax-Solutions/web-folio-prime.git .

# Or if you already cloned, pull latest changes
git pull origin main
```

**Option B: Using FileZilla/SFTP**

1. Open FileZilla
2. Connect to your server using SFTP
3. Upload all project files to `/home/supungroup/htdocs/`

### Step 6: Install Dependencies

```bash
cd /home/supungroup/htdocs/
npm install
```

### Step 7: Create Environment File

```bash
# Create .env file
nano .env
```

Paste this content (press Ctrl+Shift+V):

```env
PORT=3001
NODE_ENV=production
JWT_SECRET=change-this-to-random-long-string-123456789
DATABASE_PATH=/home/supungroup/htdocs/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/home/supungroup/htdocs/server/uploads
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 8: Setup Database

```bash
# Create uploads directory
mkdir -p server/uploads

# Initialize database
npm run db:init
```

### Step 9: Build Frontend

```bash
npm run build
```

This creates a `dist` folder with your website files.

### Step 10: Start Backend with PM2

```bash
# Start the backend server
pm2 start server/index.js --name supun-backend

# Save PM2 configuration
pm2 save

# Make PM2 start on server reboot
pm2 startup
```

Copy and run the command that PM2 shows you.

### Step 11: Configure Nginx in CloudPanel

1. In CloudPanel, go to your site
2. Click **"Vhost"** tab
3. Replace the configuration with:

```nginx
server {
    listen 80;
    server_name supungroup.com www.supungroup.com;
    
    # Frontend (React built files)
    root /home/supungroup/htdocs/dist;
    index index.html;
    
    # Frontend routing (React Router)
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Serve uploaded files (images, PDFs)
    location /uploads/ {
        alias /home/supungroup/htdocs/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

4. Click **"Save"**
5. Nginx will reload automatically

### Step 12: Setup SSL Certificate (HTTPS)

1. In CloudPanel, go to your site
2. Click **"SSL/TLS"** tab
3. Click **"New Let's Encrypt Certificate"**
4. Check both:
   - ☑ supungroup.com
   - ☑ www.supungroup.com
5. Click **"Create and Install"**

Done! Your site is now secure with HTTPS! 🔒

---

## ✅ Verification

### Check if everything is working:

1. **Check PM2 status:**
   ```bash
   pm2 status
   pm2 logs supun-backend
   ```

2. **Check Nginx:**
   ```bash
   systemctl status nginx
   tail -f /var/log/nginx/error.log
   ```

3. **Visit your website:**
   - Frontend: `https://supungroup.com`
   - Admin Panel: `https://supungroup.com/admin`
   - Default Login:
     - Username: `admin`
     - Password: `admin123`
     - ⚠️ **CHANGE THIS IMMEDIATELY!**

---

## 🔄 Updating Your Site (After Changes)

When you make changes and want to update:

```bash
# SSH into server
ssh root@your-server-ip

# Navigate to project
cd /home/supungroup/htdocs/

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild frontend
npm run build

# Restart backend
pm2 restart supun-backend

# Check status
pm2 status
```

---

## 🐛 Troubleshooting

### Problem: Website not loading

**Solution:**
```bash
# Check PM2
pm2 logs supun-backend

# Check Nginx
tail -f /var/log/nginx/error.log

# Restart services
pm2 restart supun-backend
systemctl restart nginx
```

### Problem: Can't upload images/PDFs

**Solution:**
```bash
# Check permissions
cd /home/supungroup/htdocs/
chmod -R 755 server/uploads
chown -R clp:clp server/uploads
```

### Problem: 502 Bad Gateway

**Solution:**
```bash
# Backend might not be running
pm2 restart supun-backend
pm2 logs supun-backend

# Check if port 3001 is in use
netstat -tulpn | grep 3001
```

### Problem: Database errors

**Solution:**
```bash
cd /home/supungroup/htdocs/
npm run db:init
```

---

## 📞 Common Commands Reference

```bash
# PM2 Commands
pm2 status                  # Show all running apps
pm2 logs supun-backend      # Show logs
pm2 restart supun-backend   # Restart app
pm2 stop supun-backend      # Stop app
pm2 delete supun-backend    # Remove app

# Nginx Commands
systemctl status nginx      # Check Nginx status
systemctl restart nginx     # Restart Nginx
nginx -t                    # Test configuration

# File Permissions
chmod -R 755 directory/     # Set directory permissions
chown -R user:group file    # Change file owner

# Git Commands
git pull origin main        # Pull latest changes
git status                  # Check current status
git log --oneline -5        # Show last 5 commits
```

---

## 🎉 Success!

Your website should now be live at:
- 🌐 **Website**: https://supungroup.com
- 👤 **Admin Panel**: https://supungroup.com/admin

**Remember to:**
1. ✅ Change admin password
2. ✅ Test all features
3. ✅ Setup regular backups
4. ✅ Monitor PM2 logs

---

## 📧 Need Help?

If you encounter issues:
1. Check the logs: `pm2 logs supun-backend`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Restart services: `pm2 restart supun-backend && systemctl restart nginx`

Good luck with your deployment! 🚀
