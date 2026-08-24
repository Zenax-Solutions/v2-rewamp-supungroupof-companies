# 🔧 Fix Nginx Configuration for Static Frontend + API Backend

## Problem
Your current Nginx config proxies ALL requests to Node.js app, but you need:
- Frontend: Serve static files from `dist/` folder
- Backend: Proxy only `/api/` requests to Node.js (port 3001)

## Solution: Update Nginx Configuration

### Step 1: SSH into Server
```bash
ssh root@your-server-ip
```

### Step 2: Edit CloudPanel Vhost

**Option A: Using CloudPanel UI** (Easier)

1. Login to CloudPanel
2. Go to your site (supuncompanies.com)
3. Click "Vhost" tab
4. Replace the entire config with the corrected one below

**Option B: Using SSH**
```bash
# Find your vhost file
ls /etc/nginx/sites-available/ | grep supuncompanies

# Edit it
nano /etc/nginx/sites-available/supuncompanies.com-443.conf
```

### Step 3: Corrected Nginx Configuration

Replace your current config with this:

```nginx
server {
  listen 80;
  listen [::]:80;
  listen 443 quic;
  listen 443 ssl;
  listen [::]:443 quic;
  listen [::]:443 ssl;
  http2 on;
  http3 off;
  {{ssl_certificate_key}}
  {{ssl_certificate}}
  server_name www.supuncompanies.com;
  return 301 https://supuncompanies.com$request_uri;
}

server {
  listen 80;
  listen [::]:80;
  listen 443 quic;
  listen 443 ssl;
  listen [::]:443 quic;
  listen [::]:443 ssl;
  http2 on;
  http3 off;
  {{ssl_certificate_key}}
  {{ssl_certificate}}
  server_name supuncompanies.com www1.supuncompanies.com;

  # IMPORTANT: Point to dist folder, not root
  root /home/supuncompanies/htdocs/dist;

  {{nginx_access_log}}
  {{nginx_error_log}}

  if ($scheme != "https") {
    rewrite ^ https://$host$request_uri permanent;
  }

  location ~ /.well-known {
    auth_basic off;
    allow all;
  }

  {{settings}}

  include /etc/nginx/global_settings;

  index index.html;

  # Serve static files from dist folder
  location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache";
  }

  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Proxy API requests to backend
  location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_pass_request_headers on;
    proxy_max_temp_file_size 0;
    proxy_connect_timeout 900;
    proxy_send_timeout 900;
    proxy_read_timeout 900;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
    proxy_temp_file_write_size 256k;
  }

  # Serve uploaded files
  location /uploads/ {
    alias /home/supuncompanies/htdocs/server/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

### Step 4: Key Changes Explained

**Old (Wrong):**
```nginx
location / {
    proxy_pass http://127.0.0.1:{{app_port}}/;  # ❌ Proxies everything
    ...
}
```

**New (Correct):**
```nginx
root /home/supuncompanies/htdocs/dist;  # ✅ Serve from dist folder

location / {
    try_files $uri $uri/ /index.html;  # ✅ Serve static files
}

location /api/ {
    proxy_pass http://127.0.0.1:3001;  # ✅ Proxy only API
}
```

### Step 5: Test and Restart Nginx

```bash
# Test configuration
nginx -t

# Should show:
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Restart Nginx
systemctl restart nginx
```

### Step 6: Verify dist Folder Exists

```bash
# Check if dist folder exists and has files
ls -la /home/supuncompanies/htdocs/dist/

# Should show:
# index.html
# assets/
# etc.
```

If dist folder is empty or doesn't exist:

```bash
cd /home/supuncompanies/htdocs/

# Create .env with your domain
nano .env
# Add: VITE_API_URL=https://supuncompanies.com/api

# Build frontend
npm run build

# Verify dist was created
ls -la dist/
```

### Step 7: Update CloudPanel App Settings (Optional)

In CloudPanel:
1. Go to your site
2. Click "Settings" or "App Settings"
3. Set:
   - **Document Root:** `/home/supuncompanies/htdocs/dist`
   - **App Port:** `3001`

---

## Verification

### 1. Check Frontend Loading
```bash
# Should return HTML
curl https://supuncompanies.com

# Should show your index.html content
```

### 2. Check API Working
```bash
# Should return JSON
curl https://supuncompanies.com/api/companies
```

### 3. Check in Browser
1. Visit: `https://supuncompanies.com`
2. Should see your website (not proxy error)
3. Open DevTools (F12) → Network tab
4. Reload page
5. Should see:
   - HTML loaded from supuncompanies.com
   - JS/CSS loaded from supuncompanies.com/assets/
   - API calls to supuncompanies.com/api/

---

## Common Issues

### Issue 1: 403 Forbidden
**Cause:** Dist folder doesn't exist or has wrong permissions

**Fix:**
```bash
cd /home/supuncompanies/htdocs/
npm run build
chmod -R 755 dist/
```

### Issue 2: 502 Bad Gateway on /api/
**Cause:** Backend not running

**Fix:**
```bash
pm2 status
pm2 start server/index.js --name supun-backend
```

### Issue 3: Still seeing localhost in browser
**Cause:** Frontend not rebuilt with correct API URL

**Fix:**
```bash
# 1. Set correct API URL in .env
echo "VITE_API_URL=https://supuncompanies.com/api" >> .env

# 2. Rebuild
rm -rf dist/
npm run build

# 3. Clear browser cache
```

---

## Summary

The key differences:

**Before (Wrong):**
- Nginx proxies EVERYTHING to Node.js app
- Static files not served
- dist/ folder ignored

**After (Correct):**
- Nginx serves static files from dist/
- Only /api/ proxied to Node.js backend
- Frontend works properly

---

## Quick Fix Commands

Run these on your server:

```bash
cd /home/supuncompanies/htdocs/

# 1. Ensure .env has correct API URL
echo "VITE_API_URL=https://supuncompanies.com/api" > .env

# 2. Rebuild frontend
npm run build

# 3. Check dist exists
ls -la dist/

# 4. Update nginx config (use the corrected config above)
# Edit via CloudPanel Vhost tab or:
# nano /etc/nginx/sites-available/supuncompanies.com-443.conf

# 5. Test and restart nginx
nginx -t && systemctl restart nginx

# 6. Check backend is running
pm2 status

# 7. Test site
curl https://supuncompanies.com
curl https://supuncompanies.com/api/companies
```

Done! Your site should now load properly! 🚀
