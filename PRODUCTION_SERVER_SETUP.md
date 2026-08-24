# 🚀 CORRECT Way to Run on Production Server

## ⚠️ IMPORTANT: Don't Run These on Server!
```bash
npm start        ❌ This runs development servers (Vite + Nodemon)
npm run dev      ❌ This runs Vite dev server (port 8080/8081)
npm run server:dev ❌ This runs backend with nodemon (for development)
```

## ✅ CORRECT Production Setup

### Option 1: Using PM2 (Recommended)

#### Step 1: Build Frontend
```bash
cd /var/www/supungroup  # or your project path
npm run build
```
This creates the `dist/` folder with optimized production files.

#### Step 2: Start Backend with PM2
```bash
pm2 start server/index.js --name supun-backend
pm2 save
pm2 startup
```

#### Step 3: Configure Nginx to Serve Built Files
Nginx will serve the `dist/` folder and proxy API requests to port 3001.

---

### Option 2: Using Direct Node (Without PM2)

#### Step 1: Build Frontend
```bash
npm run build
```

#### Step 2: Start Backend
```bash
# Using nohup (keeps running after SSH disconnect)
nohup node server/index.js > server.log 2>&1 &

# Or using screen
screen -S backend
node server/index.js
# Press Ctrl+A then D to detach
```

---

## 🔧 Complete Server Setup Commands

Copy and paste these commands on your server:

```bash
# 1. Navigate to project
cd /var/www/supungroup

# 2. Create .env file (IMPORTANT!)
cat > .env << 'EOL'
PORT=3001
NODE_ENV=production
VITE_API_URL=https://your-domain.com/api
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_PATH=/var/www/supungroup/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/supungroup/server/uploads
EOL

# 3. Edit domain in .env
nano .env
# Change 'your-domain.com' to your actual domain!
# Save: Ctrl+X, Y, Enter

# 4. Install dependencies
npm install

# 5. Initialize database
npm run db:init

# 6. Build frontend
npm run build

# 7. Start backend with PM2
pm2 start server/index.js --name supun-backend
pm2 save

# 8. Configure Nginx (see below)
# 9. Restart Nginx
nginx -t
systemctl restart nginx
```

---

## 📝 Nginx Configuration

Create/Edit: `/etc/nginx/sites-available/supungroup`

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Serve the built React app (dist folder)
    root /var/www/supungroup/dist;
    index index.html;
    
    # React Router - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache control
        add_header Cache-Control "no-cache";
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy API requests to backend
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Serve uploaded files
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

---

## 🔍 How to Check if Running Correctly

```bash
# 1. Check if backend is running
pm2 status
# Should show "supun-backend" as "online"

# 2. Check backend logs
pm2 logs supun-backend --lines 50

# 3. Check if backend responds
curl http://localhost:3001/api/companies
# Should return JSON data

# 4. Check if dist folder exists
ls -la /var/www/supungroup/dist
# Should show index.html and assets/ folder

# 5. Check Nginx status
systemctl status nginx

# 6. Test your domain
curl https://your-domain.com
# Should return HTML

# 7. Test API through domain
curl https://your-domain.com/api/companies
# Should return JSON
```

---

## 🎯 Architecture Explanation

### Development (Local Computer)
```
npm start → Runs 2 servers:
  1. Vite (port 8080) - React dev server with hot reload
  2. Backend (port 3001) - Node.js API server
```

### Production (Server)
```
Only Backend Running:
  - PM2 runs backend (port 3001)
  
Nginx Handles:
  - Serves built React files from dist/ folder
  - Proxies /api/ requests to backend (port 3001)
  - Serves /uploads/ static files
```

---

## 🔄 Update Process

When you make changes and want to update:

```bash
# 1. SSH into server
ssh root@your-server-ip

# 2. Navigate to project
cd /var/www/supungroup

# 3. Pull latest code
git pull origin main

# 4. Install new dependencies (if any)
npm install

# 5. Rebuild frontend
npm run build

# 6. Restart backend
pm2 restart supun-backend

# 7. Check status
pm2 status
pm2 logs supun-backend
```

---

## ❌ Common Mistakes

| Mistake | Why It's Wrong | Correct Way |
|---------|---------------|-------------|
| Running `npm start` on server | Starts dev servers, uses ports 8080/8081 | Use PM2 + build |
| Running `npm run dev` | Vite dev server, not for production | `npm run build` |
| Not building before deploy | Frontend not optimized | Always build first |
| Running backend without PM2 | Stops when SSH disconnects | Use PM2 or nohup |
| Not setting VITE_API_URL | Frontend can't find API | Set in .env before build |

---

## 🆘 Troubleshooting

### Problem: Website shows blank page
```bash
# Check if dist folder has files
ls -la /var/www/supungroup/dist

# Check Nginx error log
tail -f /var/log/nginx/error.log

# Rebuild
npm run build
systemctl restart nginx
```

### Problem: API calls fail (Network Error)
```bash
# Check backend is running
pm2 status
pm2 logs supun-backend

# Check .env has correct VITE_API_URL
cat .env | grep VITE_API_URL

# Rebuild with correct API URL
npm run build
```

### Problem: Port 8081 is running
```bash
# Kill Vite dev server
pkill -f vite

# Don't run npm start on server!
```

### Problem: Backend crashes
```bash
# Check logs
pm2 logs supun-backend

# Restart
pm2 restart supun-backend

# Check .env configuration
cat .env
```

---

## ✅ Production Checklist

After setup, you should have:

- [ ] `.env` file with production values
- [ ] `VITE_API_URL` pointing to your domain
- [ ] Built `dist/` folder exists
- [ ] Backend running via PM2 (port 3001)
- [ ] Nginx serving `dist/` folder
- [ ] Nginx proxying `/api/` to backend
- [ ] SSL certificate installed
- [ ] No Vite dev server running
- [ ] Website loads at your domain
- [ ] API calls work
- [ ] Admin panel accessible

---

## 🎉 Summary

**On Production Server:**

1. ✅ Build frontend once: `npm run build`
2. ✅ Run backend with PM2: `pm2 start server/index.js`
3. ✅ Let Nginx serve the `dist/` folder
4. ✅ Never run `npm start` or `npm run dev`

**Your site architecture:**
- **Frontend**: Static files in `dist/` served by Nginx
- **Backend**: Node.js API on port 3001 managed by PM2
- **Proxy**: Nginx forwards `/api/` requests to backend

Done! 🚀
