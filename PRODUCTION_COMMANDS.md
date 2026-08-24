# ⚠️ CRITICAL: How to Run on Production Server

## 🚫 DO NOT RUN THESE COMMANDS ON YOUR SERVER:

```bash
npm start        # ❌ This is for LOCAL DEVELOPMENT ONLY
npm run dev      # ❌ This runs Vite dev server
npm run server:dev # ❌ This runs nodemon (development)
```

**These commands run on localhost (127.0.0.1) and are NOT accessible from your domain!**

---

## ✅ CORRECT Commands for Production Server

### On Your Server (via SSH):

```bash
# 1. Create .env file with your domain
nano .env
```

Add this content (replace `your-domain.com`):
```bash
PORT=3001
NODE_ENV=production
VITE_API_URL=https://your-domain.com/api
JWT_SECRET=your-random-secret-key-here
DATABASE_PATH=/var/www/supungroup/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/supungroup/server/uploads
```

```bash
# 2. Install dependencies
npm install

# 3. Build the frontend (creates dist/ folder)
npm run build

# 4. Start ONLY the backend with PM2
pm2 start server/index.js --name supun-backend
pm2 save
pm2 startup

# 5. Configure Nginx to serve the built files
# (See PRODUCTION_SERVER_SETUP.md for nginx config)

# 6. Restart Nginx
systemctl restart nginx
```

**That's it!** Your site will now be accessible at `https://your-domain.com`

---

## 📋 Quick Command Reference

| Task | Command |
|------|---------|
| **Build frontend** | `npm run build` |
| **Start backend** | `pm2 start server/index.js --name supun-backend` |
| **Check backend status** | `pm2 status` |
| **View backend logs** | `pm2 logs supun-backend` |
| **Restart backend** | `pm2 restart supun-backend` |
| **Stop backend** | `pm2 stop supun-backend` |
| **Update site** | `git pull && npm install && npm run build && pm2 restart supun-backend` |

---

## 🏗️ Architecture

### ❌ Wrong (Running npm start on server):
```
npm start → 
  Vite dev server (localhost:8080) ← Can't access from domain
  Backend (localhost:3001)
```

### ✅ Correct (Production setup):
```
PM2 → Backend only (localhost:3001)
Nginx → 
  Serves dist/ folder (your domain)
  Proxies /api/ to backend (localhost:3001)
```

---

## 🎯 Why This Matters

1. **`npm start`** runs development servers on localhost (127.0.0.1)
   - Not accessible from your domain
   - Uses ports 8080/8081
   - Meant for development only

2. **Production** uses built files + Nginx
   - Nginx serves optimized files from `dist/` folder
   - Accessible via your domain
   - PM2 manages backend process
   - Uses standard HTTP/HTTPS ports (80/443)

---

## ✅ Verification Steps

After proper setup, check:

```bash
# 1. Backend is running
pm2 status
# Should show "supun-backend" as "online"

# 2. Dist folder exists
ls -la dist/
# Should show index.html, assets/, etc.

# 3. Backend responds
curl http://localhost:3001/api/companies
# Should return JSON

# 4. Visit your domain
# Open browser: https://your-domain.com
# Should show your website
```

---

## 📞 Still Having Issues?

Follow these guides in order:

1. **First**: Read `PRODUCTION_SERVER_SETUP.md`
2. **If API not working**: Read `FIX_PRODUCTION_API.md`
3. **General help**: Read `CLOUDPANEL_GUIDE.md`

---

## 🎉 Summary

**On Production Server:**
- ❌ Don't use `npm start` (it's for local development)
- ✅ Use `npm run build` (creates production files)
- ✅ Use `pm2 start server/index.js` (runs backend only)
- ✅ Let Nginx serve the built files
- ✅ Access via your domain, not localhost

**On Your Local Computer:**
- ✅ Use `npm start` (for development)
- ✅ Access via `http://localhost:8080`

Done! 🚀
