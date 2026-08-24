# 🔧 FIX: Frontend Not Connecting to Backend

## Current Status:
✅ Backend working: https://supuncompanies.com/api/companies
❌ Frontend not connecting: Still trying localhost

## Solution: Rebuild Frontend with Correct API URL

### Step 1: SSH into Your Server

```bash
ssh root@your-server-ip
cd /home/supuncompanies/htdocs  # Your project directory
```

### Step 2: Create/Edit .env File

```bash
nano .env
```

Make sure it has this content (use your actual domain):

```bash
PORT=3001
NODE_ENV=production
VITE_API_URL=https://supuncompanies.com/api
JWT_SECRET=your-secure-random-secret
DATABASE_PATH=/home/supuncompanies/htdocs/server/database.sqlite
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/home/supuncompanies/htdocs/server/uploads
```

**IMPORTANT:** The `VITE_API_URL` must be set BEFORE building!

Save: Ctrl+X, Y, Enter

### Step 3: Delete Old Build and Rebuild

```bash
# Remove old build
rm -rf dist/

# Rebuild with correct API URL
npm run build
```

This will create a new `dist/` folder with the correct API URL baked into the JavaScript files.

### Step 4: Verify the Build Contains Correct URL

```bash
# Check if the built files contain your domain
grep -r "supuncompanies.com" dist/assets/*.js
```

You should see your domain URL in the output.

### Step 5: Clear Browser Cache

In your browser:
- Press `Ctrl+Shift+Delete`
- Clear "Cached images and files"
- Or open in Incognito/Private mode

### Step 6: Test Your Site

Visit: `https://supuncompanies.com`

Open browser console (F12) and check:
- Network tab should show requests to `https://supuncompanies.com/api/...`
- NOT to `localhost:3001`

---

## Alternative: Quick Check if .env is Being Used

```bash
# Check current .env
cat .env

# Should show:
# VITE_API_URL=https://supuncompanies.com/api
```

If not, create it properly and rebuild.

---

## Common Mistakes:

1. ❌ Building BEFORE creating .env file
2. ❌ .env has wrong domain
3. ❌ Not rebuilding after changing .env
4. ❌ Browser cache showing old version

## Correct Order:

1. ✅ Create .env with VITE_API_URL
2. ✅ Run `npm run build`
3. ✅ Clear browser cache
4. ✅ Test site

---

## Verification Commands:

```bash
# 1. Check .env exists and has correct domain
cat .env | grep VITE_API_URL

# 2. Check dist folder was recently created
ls -lah dist/

# 3. Check built files contain your domain (not localhost)
grep -r "localhost:3001" dist/assets/*.js
# Should return NOTHING

grep -r "supuncompanies.com" dist/assets/*.js
# Should show your domain

# 4. Check backend is running
pm2 status

# 5. Test backend directly
curl https://supuncompanies.com/api/companies
```

---

## Still Not Working?

### Check Nginx Configuration:

```bash
# Check CloudPanel Vhost
nano /etc/nginx/sites-available/supuncompanies.com.conf
```

Should have:

```nginx
server {
    server_name supuncompanies.com www.supuncompanies.com;
    
    # Serve built files
    root /home/supuncompanies/htdocs/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads/ {
        alias /home/supuncompanies/htdocs/server/uploads/;
    }
}
```

Test and restart Nginx:

```bash
nginx -t
systemctl restart nginx
```

---

## Summary:

The frontend JavaScript files are built with the API URL hardcoded during the build process. You MUST:

1. Set `VITE_API_URL=https://supuncompanies.com/api` in `.env`
2. Run `npm run build`
3. Clear browser cache

Done! 🚀
