# 🔧 CloudPanel Static HTML Setup - Complete Fix

## Your Current Setup

✅ **Frontend**: Static HTML site in CloudPanel (working)  
❌ **Backend**: PM2 running but API URL is wrong

---

## The Problem

When you build the frontend, it's using `http://localhost:3001/api` instead of your actual domain API URL.

---

## ✅ Complete Fix - Step by Step

### Step 1: Create .env File (On Server)

SSH into your server:
```bash
ssh root@your-server-ip
cd /var/www/supungroup  # or wherever your project is
```

Create `.env` file with **YOUR ACTUAL DOMAIN**:
```bash
nano .env
```

Paste this (⚠️ **CHANGE `your-domain.com` to your real domain!**):
```env
PORT=3001
NODE_ENV=production
VITE_API_URL=https://your-domain.com/api
JWT_SECRET=your-secure-random-secret-key-here
DATABASE_PATH=/var/www/supungroup/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/supungroup/server/uploads
```

**IMPORTANT:** Replace `your-domain.com` with your actual domain!

Examples:
- `https://supungroup.lk/api`
- `https://www.supungroup.com/api`

Save: `Ctrl+X` → `Y` → `Enter`

---

### Step 2: Rebuild Frontend with Correct API URL

```bash
# This reads the VITE_API_URL from .env and builds with it
npm run build
```

---

### Step 3: Copy Built Files to CloudPanel Site Directory

```bash
# Find your CloudPanel site directory (usually something like):
# /home/sitename/htdocs/

# Example - adjust path to match YOUR site:
cp -r dist/* /home/supungroup/htdocs/

# Or if you're already in the site directory:
npm run build
# The dist/ folder is already there, CloudPanel serves from it
```

---

### Step 4: Configure Backend to Accept Domain Requests

Edit your backend server file:
```bash
nano server/index.js
```

Make sure CORS is configured to allow your domain. Find or add this near the top:
```javascript
import cors from 'cors';

// Allow your domain
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:3001', 
    'https://your-domain.com',
    'https://www.your-domain.com'
  ],
  credentials: true
}));
```

Save: `Ctrl+X` → `Y` → `Enter`

---

### Step 5: Restart Backend with PM2

```bash
# Stop existing backend
pm2 delete supun-backend

# Start with correct environment
pm2 start server/index.js --name supun-backend
pm2 save
```

---

### Step 6: Configure Nginx to Proxy API Requests

Since you're using CloudPanel static site, you need to add API proxy configuration.

In CloudPanel:
1. Go to your site
2. Click **"Vhost"** or **"Nginx"** settings
3. Find your server configuration

Add this **inside the server block**:

```nginx
# Your existing static site config...
location / {
    # existing config
}

# ADD THIS - Proxy API requests to backend
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

# ADD THIS - Serve uploaded files
location /uploads/ {
    alias /var/www/supungroup/server/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

Save and CloudPanel will reload Nginx automatically.

---

### Step 7: Complete Nginx Configuration Example

Your complete Nginx config should look like this:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # SSL config (if you have SSL)
    # listen 443 ssl http2;
    # ssl_certificate /path/to/cert;
    # ssl_certificate_key /path/to/key;

    # Root directory for static files
    root /home/supungroup/htdocs;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # IMPORTANT: Proxy API to backend
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

    # Serve uploaded files
    location /uploads/ {
        alias /var/www/supungroup/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🔍 Verification

### Test Backend Directly:
```bash
# Test if backend is running
curl http://localhost:3001/api/companies

# Should return JSON data
```

### Test API Through Domain:
```bash
# Test if Nginx proxy works
curl https://your-domain.com/api/companies

# Should return same JSON data
```

### Check PM2 Status:
```bash
pm2 status
pm2 logs supun-backend
```

### Test in Browser:
1. Open: `https://your-domain.com`
2. Open browser DevTools (F12)
3. Go to Network tab
4. Try to login or load companies
5. Check if API calls go to `https://your-domain.com/api/` (not localhost!)

---

## 🎯 Summary of What We Fixed

| Before | After |
|--------|-------|
| Frontend calls `http://localhost:3001/api` | Frontend calls `https://your-domain.com/api` |
| API fails (localhost not accessible) | Nginx proxies to backend |
| Backend not configured for domain | Backend accepts domain requests |

---

## 📝 Quick Update Process

When you make changes later:

```bash
# 1. Make sure .env has correct domain
cat .env | grep VITE_API_URL

# 2. Pull changes
git pull

# 3. Install deps
npm install

# 4. Build with correct API URL
npm run build

# 5. Copy to CloudPanel directory
cp -r dist/* /home/supungroup/htdocs/

# 6. Restart backend
pm2 restart supun-backend
```

---

## 🐛 Troubleshooting

### Problem: API still calls localhost

**Solution**: 
```bash
# Check .env file
cat .env | grep VITE_API_URL

# Must show your domain, not localhost!
# If wrong, fix it and rebuild:
nano .env
npm run build
cp -r dist/* /home/supungroup/htdocs/
```

### Problem: CORS errors in browser

**Solution**: Check `server/index.js` has your domain in CORS config

### Problem: 502 Bad Gateway on /api/

**Solution**:
```bash
# Backend not running
pm2 status
pm2 restart supun-backend

# Check logs
pm2 logs supun-backend
```

### Problem: Can't see uploaded images

**Solution**: Check Nginx `/uploads/` location points to correct path

---

## ✅ Final Checklist

After following all steps:

- [ ] `.env` file has `VITE_API_URL=https://your-domain.com/api`
- [ ] Ran `npm run build` with correct .env
- [ ] Copied `dist/*` to CloudPanel site directory
- [ ] Backend running via PM2
- [ ] Nginx has `/api/` proxy configuration
- [ ] Nginx has `/uploads/` location
- [ ] SSL certificate installed
- [ ] Website loads at your domain
- [ ] Can login to admin panel
- [ ] Can upload files
- [ ] No CORS errors in browser console

---

## 🎉 Done!

Your setup:
- **Frontend**: CloudPanel serves static files from `/home/supungroup/htdocs/`
- **Backend**: PM2 runs `server/index.js` on port 3001
- **Nginx**: Proxies `/api/` requests to backend

Website should work at: `https://your-domain.com` ✅

Admin panel: `https://your-domain.com/admin` ✅
