# ✅ COMPLETE SOLUTION FOR SUPUNCOMPANIES.COM

## 🎯 Your Exact Issue & Fix

### Current Problem:
- ✅ Backend API working: `https://supuncompanies.com/api/companies`
- ❌ Frontend not loading: Nginx proxying everything to Node.js instead of serving dist/

### Root Cause:
Your Nginx config has this:
```nginx
location / {
    proxy_pass http://127.0.0.1:{{app_port}}/;  # ❌ WRONG! Proxies everything
}
```

Should be this:
```nginx
root /home/supuncompanies/htdocs/dist;  # ✅ Serve static files

location / {
    try_files $uri $uri/ /index.html;  # ✅ Serve dist folder
}

location /api/ {
    proxy_pass http://127.0.0.1:3001;  # ✅ Proxy only API
}
```

---

## 🚀 COMPLETE FIX (Copy & Paste)

### On Your Server (SSH):

```bash
cd /home/supuncompanies/htdocs/

# Step 1: Create .env with correct API URL
cat > .env << 'EOF'
PORT=3001
NODE_ENV=production
VITE_API_URL=https://supuncompanies.com/api
JWT_SECRET=your-secure-random-secret-key-here
DATABASE_PATH=/home/supuncompanies/htdocs/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/home/supuncompanies/htdocs/server/uploads
EOF

# Step 2: Build frontend with correct API URL
npm run build

# Step 3: Verify dist folder exists
ls -la dist/

# Step 4: Make sure backend is running
pm2 status
pm2 start server/index.js --name supun-backend || pm2 restart supun-backend
pm2 save
```

### Update Nginx Config:

1. Login to CloudPanel → Your Site → **Vhost** tab
2. Replace entire config with this:

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

  location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache";
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

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
  }

  location /uploads/ {
    alias /home/supuncompanies/htdocs/server/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

3. Click **Save**
4. Nginx will automatically reload

---

## ✅ Test Everything

```bash
# 1. Test frontend
curl https://supuncompanies.com
# Should return HTML (your website)

# 2. Test API
curl https://supuncompanies.com/api/companies
# Should return JSON

# 3. Check backend
pm2 status
pm2 logs supun-backend --lines 20
```

### In Browser:

1. Visit: https://supuncompanies.com
2. Press F12 → Network tab
3. Reload page
4. Check:
   - ✅ HTML loaded from supuncompanies.com
   - ✅ JS/CSS loaded from supuncompanies.com/assets/
   - ✅ API calls to supuncompanies.com/api/

---

## 📋 Summary of What You Have

| Component | Status | Location |
|-----------|--------|----------|
| Frontend | Static files | `/home/supuncompanies/htdocs/dist/` |
| Backend API | Node.js + PM2 | Port 3001 |
| Database | SQLite | `/home/supuncompanies/htdocs/server/database.sqlite` |
| Uploads | File storage | `/home/supuncompanies/htdocs/server/uploads/` |
| Nginx | Web server | Serves dist/ + proxies /api/ |

---

## 🚫 DON'T DO THIS

```bash
npm start       # ❌ Development only
npm run dev     # ❌ Development only
```

These run on localhost ports (8080/8081) and won't work with your domain.

## ✅ DO THIS INSTEAD

```bash
npm run build                                 # Build frontend
pm2 start server/index.js --name supun-backend  # Start backend
```

---

## 🔄 How to Update Site Later

```bash
# 1. SSH into server
ssh root@your-server-ip
cd /home/supuncompanies/htdocs/

# 2. Pull latest code
git pull origin main

# 3. Install dependencies (if changed)
npm install

# 4. Rebuild frontend
npm run build

# 5. Restart backend
pm2 restart supun-backend

# Done!
```

---

## 🎉 That's It!

Your site should now work perfectly:

- **Website:** https://supuncompanies.com ← Frontend from dist/
- **API:** https://supuncompanies.com/api/ ← Backend on port 3001
- **Admin:** https://supuncompanies.com/admin ← Admin panel

All working through Nginx with proper routing! 🚀
