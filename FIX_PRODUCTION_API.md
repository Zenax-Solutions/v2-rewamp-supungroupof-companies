# 🔧 Fix: API Connection Issues on Production Server

## Problem
When running on the server, the frontend tries to connect to `http://localhost:3001/api` but should connect to your actual domain.

## Quick Fix (On Your Server)

### Step 1: Create/Update .env File
```bash
# SSH into your server
ssh root@your-server-ip

# Navigate to your project directory
cd /var/www/supungroup  # or your actual path

# Create .env file if it doesn't exist
nano .env
```

### Step 2: Add the Correct Configuration
Add/update these lines in your `.env` file:

```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# IMPORTANT: Change to your actual domain!
VITE_API_URL=https://your-domain.com/api

# JWT Secret (generate a secure one)
JWT_SECRET=your-secure-random-secret-here

# Database path
DATABASE_PATH=/var/www/supungroup/server/database.sqlite

# Uploads
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/supungroup/server/uploads
```

**Important:** Replace `your-domain.com` with your actual domain!

Examples:
- `https://supungroup.com/api`
- `https://www.supungroup.com/api`
- `https://217.15.164.141/api` (if using IP, but domain is better)

Save: `Ctrl+X` → `Y` → `Enter`

### Step 3: Rebuild Frontend with New Environment
```bash
# Rebuild the frontend with production environment
npm run build

# This will use the VITE_API_URL from .env file
```

### Step 4: Restart Backend
```bash
# Restart the backend server
pm2 restart supun-backend

# Or if not using PM2
pkill -f "node server/index.js"
node server/index.js &
```

### Step 5: Verify Nginx Configuration
Make sure your Nginx is configured to serve both frontend and proxy API requests:

```bash
# Edit nginx config
nano /etc/nginx/sites-available/supungroup
```

Should look like this:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Serve frontend static files
    root /var/www/supungroup/dist;
    index index.html;
    
    # Frontend routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API proxy
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
    
    # Serve uploaded files
    location /uploads/ {
        alias /var/www/supungroup/server/uploads/;
    }
}
```

Test and restart Nginx:
```bash
nginx -t
systemctl restart nginx
```

---

## Alternative: Quick Fix Without Rebuild

If you need a quick fix without rebuilding, you can set the API URL in your Nginx config:

```nginx
location / {
    root /var/www/supungroup/dist;
    try_files $uri $uri/ /index.html;
    
    # Add this to inject the API URL at runtime
    sub_filter 'http://localhost:3001/api' 'https://your-domain.com/api';
    sub_filter_once off;
}
```

But **rebuilding is recommended** for proper production deployment.

---

## Complete Production Setup Steps

### 1. Stop Vite Dev Server (Don't run this in production!)
```bash
# Kill any running vite dev servers
pkill -f "vite"
```

Vite dev server (`npm run dev`) is only for development!

### 2. Production Environment File
```bash
cd /var/www/supungroup

# Create production .env
cat > .env << 'EOL'
PORT=3001
NODE_ENV=production
VITE_API_URL=https://your-domain.com/api
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_PATH=/var/www/supungroup/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/supungroup/server/uploads
EOL

# Replace 'your-domain.com' with your actual domain!
nano .env  # Edit the domain
```

### 3. Build for Production
```bash
# Install dependencies
npm install

# Build frontend (creates optimized dist folder)
npm run build
```

### 4. Start Backend Only
```bash
# Start backend with PM2
pm2 delete supun-backend  # Remove old
pm2 start server/index.js --name supun-backend
pm2 save
```

### 5. Configure Nginx (Full Config)
```bash
nano /etc/nginx/sites-available/supungroup
```

Complete configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect to HTTPS (after SSL is setup)
    # return 301 https://$server_name$request_uri;
    
    root /var/www/supungroup/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Frontend SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Uploads
    location /uploads/ {
        alias /var/www/supungroup/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable and test:
```bash
ln -sf /etc/nginx/sites-available/supungroup /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 6. Setup SSL (HTTPS)
```bash
# Install certbot
apt install certbot python3-certbot-nginx -y

# Get certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal test
certbot renew --dry-run
```

---

## Verification Checklist

After setup, verify:

```bash
# 1. Check PM2 is running
pm2 status
pm2 logs supun-backend --lines 50

# 2. Check Nginx
systemctl status nginx
tail -f /var/log/nginx/error.log

# 3. Test API endpoint
curl http://localhost:3001/api/companies
# Should return companies JSON

# 4. Test frontend
curl http://your-domain.com
# Should return HTML

# 5. Test API through Nginx
curl https://your-domain.com/api/companies
# Should return companies JSON
```

Visit your site:
- Frontend: `https://your-domain.com`
- Admin: `https://your-domain.com/admin`

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch" or "Network Error"
**Cause:** Frontend can't reach backend API

**Solution:**
```bash
# Check if backend is running
pm2 status
curl http://localhost:3001/api/companies

# Rebuild frontend with correct API URL
nano .env  # Make sure VITE_API_URL is correct
npm run build
```

### Issue 2: CORS errors
**Cause:** Backend rejecting requests from frontend domain

**Solution:** Already handled by Nginx proxy. If using direct connection:
```bash
# In server/index.js, ensure CORS is configured:
# app.use(cors({ origin: 'https://your-domain.com' }));
```

### Issue 3: 502 Bad Gateway
**Cause:** Nginx can't connect to backend

**Solution:**
```bash
# Check backend is running on port 3001
netstat -tulpn | grep 3001
pm2 restart supun-backend
```

### Issue 4: 404 on page refresh
**Cause:** Nginx not configured for SPA routing

**Solution:** Ensure `try_files $uri $uri/ /index.html;` is in nginx config

---

## Environment Variables Reference

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_API_URL` | `http://localhost:3001/api` | `https://your-domain.com/api` |
| `NODE_ENV` | `development` | `production` |
| `PORT` | `3001` | `3001` |
| `JWT_SECRET` | `dev-secret` | `random-secure-string` |

---

## Need to Update Later?

```bash
# 1. Pull changes
cd /var/www/supungroup
git pull origin main

# 2. Install dependencies
npm install

# 3. Rebuild frontend
npm run build

# 4. Restart backend
pm2 restart supun-backend

# 5. Check logs
pm2 logs supun-backend
```

---

## Summary

**Key Points:**
1. ✅ Don't run `npm start` or `npm run dev` in production
2. ✅ Use `npm run build` to create production files
3. ✅ Set `VITE_API_URL` in `.env` before building
4. ✅ Use PM2 to run backend only
5. ✅ Let Nginx serve the built frontend (`dist/` folder)
6. ✅ Setup SSL with certbot

Your site should now work properly on your domain! 🚀
