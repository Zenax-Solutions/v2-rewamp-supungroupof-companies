# Fix Uploads 404 Error - Troubleshooting Guide

## Problem
Files are uploading successfully, but getting 404 errors when trying to access them:
```
GET https://supuncompanies.com/uploads/1760294042329-439772863-1.jpg 404 (Not Found)
```

## Your Nginx Configuration (Correct ✅)
```nginx
location /uploads/ {
    alias /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting Steps

### Step 1: Verify File Exists on Server
```bash
# SSH into your server
ssh your-user@your-server

# Navigate to the uploads directory
cd /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/

# List all uploaded files
ls -lah

# Check if your specific file exists
ls -lah | grep "1760294042329-439772863-1.jpg"
```

**Expected Result:** You should see the file listed

---

### Step 2: Check File Permissions
```bash
# Check permissions of uploads directory
ls -ld /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/

# Should show something like: drwxr-xr-x (755 or 775)

# Check permissions of files inside
ls -lah /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/

# Files should be readable (644 or 664)
```

**If permissions are wrong, fix them:**
```bash
# Fix directory permissions
chmod 755 /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/

# Fix file permissions
chmod 644 /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/*

# Make sure Nginx user can read them
sudo chown -R www-data:www-data /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/
# OR (depending on your system)
sudo chown -R nginx:nginx /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/
# OR (for CloudPanel)
sudo chown -R supuncompanies:supuncompanies /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/
```

---

### Step 3: Verify Nginx Configuration
```bash
# Test Nginx configuration for syntax errors
sudo nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If syntax is OK, reload Nginx:**
```bash
sudo systemctl reload nginx
# OR
sudo service nginx reload
```

---

### Step 4: Check Nginx Error Logs
```bash
# View Nginx error log
sudo tail -f /var/log/nginx/error.log

# Or check site-specific logs
sudo tail -f /home/supuncompanies/logs/supuncompanies.com/nginx_error.log

# Then try to access the image in browser and watch for errors
```

**Common errors to look for:**
- `Permission denied` → Fix with Step 2
- `No such file or directory` → File doesn't exist or path is wrong
- `403 Forbidden` → Permission issue

---

### Step 5: Test Direct File Access
```bash
# Test if Nginx can access the file directly
curl -I https://supuncompanies.com/uploads/1760294042329-439772863-1.jpg

# Expected: 200 OK
# If 404: File doesn't exist or path is wrong
# If 403: Permission issue
```

---

### Step 6: Check Upload Path in Backend
The backend should be saving files to the correct location:

```javascript
// In server/routes/companies.js or wherever multer is configured
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/') // ← Should be relative to project root
  },
  // ...
});
```

**Verify the actual upload path:**
```bash
# Check where PM2 is running from
pm2 info supuncompanies-api

# Look at "exec cwd" - this is the working directory
# Files will be uploaded to: <exec cwd>/server/uploads/
```

---

### Step 7: Alternative - Use Root Instead of Alias

If the alias approach isn't working, you can try using `root`:

```nginx
location /uploads/ {
    root /home/supuncompanies/htdocs/supuncompanies.com/server;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**Note:** With `root`, Nginx will serve files from:
- `/home/supuncompanies/htdocs/supuncompanies.com/server/uploads/filename.jpg`

With `alias`, it serves from:
- `/home/supuncompanies/htdocs/supuncompanies.com/server/uploads/filename.jpg`

They're the same in this case, but `alias` is more flexible.

---

## Quick Fix Commands (Run on Server)

```bash
# 1. Go to project directory
cd /home/supuncompanies/htdocs/supuncompanies.com

# 2. Create uploads directory if it doesn't exist
mkdir -p server/uploads

# 3. Fix permissions
chmod 755 server/uploads
chmod 644 server/uploads/* 2>/dev/null || true

# 4. Check Nginx user
ps aux | grep nginx | grep -v grep

# 5. Fix ownership (replace 'supuncompanies' with actual user if different)
sudo chown -R supuncompanies:supuncompanies server/uploads

# 6. Test Nginx config
sudo nginx -t

# 7. Reload Nginx
sudo systemctl reload nginx

# 8. Check if files exist
ls -lah server/uploads/

# 9. Test upload endpoint
curl https://supuncompanies.com/api/companies
```

---

## Testing Upload After Fix

1. **Upload a new file** through your admin panel
2. **Check the response** - should include the file path like `/uploads/filename.jpg`
3. **Check if file exists:**
   ```bash
   ls -lah /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/
   ```
4. **Access the file directly:**
   ```
   https://supuncompanies.com/uploads/filename.jpg
   ```

---

## Most Likely Issue

Based on the 404 error, the most common causes are:

1. **File doesn't exist in the expected location** ✓ Most likely
   - Backend might be saving to a different path
   - Check PM2's working directory: `pm2 info supuncompanies-api`
   - Files might be in `/home/supuncompanies/htdocs/supuncompanies.com/uploads/` instead

2. **Permissions issue**
   - Nginx user (www-data/nginx/clp) can't read the files
   - Fix with `chmod` and `chown` commands above

3. **Nginx config not reloaded**
   - After changing config, must reload: `sudo systemctl reload nginx`

---

## Debugging Command

Run this one-liner to check everything:

```bash
cd /home/supuncompanies/htdocs/supuncompanies.com && \
echo "=== Checking uploads directory ===" && \
ls -lah server/uploads/ && \
echo -e "\n=== Checking permissions ===" && \
ls -ld server/uploads/ && \
echo -e "\n=== Checking Nginx user ===" && \
ps aux | grep nginx | grep worker | head -1 && \
echo -e "\n=== Testing Nginx config ===" && \
sudo nginx -t
```

This will show you:
- All uploaded files
- Directory permissions
- Nginx worker user
- Config validation

---

## If Nothing Works - Check PM2 Working Directory

The issue might be that PM2 is running from a different directory:

```bash
# Check PM2 process info
pm2 info supuncompanies-api

# Look for "exec cwd" field - this is where Node.js is running
# Files will be uploaded to: <exec cwd>/server/uploads/

# If PM2 is running from wrong directory, restart it from correct location:
cd /home/supuncompanies/htdocs/supuncompanies.com
pm2 restart supuncompanies-api
pm2 save
```

---

## Final Check - Create Test File

```bash
# Create a test file manually
cd /home/supuncompanies/htdocs/supuncompanies.com/server/uploads/
echo "test" > test.txt

# Try to access it
curl https://supuncompanies.com/uploads/test.txt

# If this works, the Nginx config is correct
# If this doesn't work, there's an issue with Nginx config or permissions
```
