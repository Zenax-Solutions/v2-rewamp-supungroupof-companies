# Fix 404 Error for Uploaded Files

## Problem
Uploads work, but files return 404 when accessed:
```
GET https://supuncompanies.com/uploads/1760294042329-439772863-1.jpg 404 (Not Found)
```

## Root Cause
The uploaded files are stored in `server/uploads/` directory, but Nginx is not configured to serve them from the correct location.

## Solution

### Step 1: Find Your Nginx Configuration File
On CloudPanel, the Nginx config is usually at:
```bash
/etc/nginx/sites-available/supuncompanies.com.conf
```

Or check:
```bash
sudo find /etc/nginx -name "*supuncompanies*"
```

### Step 2: Update Nginx Configuration

Edit your Nginx config file:
```bash
sudo nano /etc/nginx/sites-available/supuncompanies.com.conf
```

Add this location block for serving uploaded files:

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name supuncompanies.com www.supuncompanies.com;

    # Your existing SSL configuration...

    # Root directory for static files (frontend)
    root /home/your-username/htdocs/supuncompanies.com/dist;
    index index.html;

    # Serve uploaded files directly from server/uploads directory
    location /uploads/ {
        alias /home/your-username/htdocs/supuncompanies.com/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API proxy to Node.js backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend SPA - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**IMPORTANT:** Replace `/home/your-username/htdocs/supuncompanies.com/` with your actual project path.

### Step 3: Find Your Actual Project Path

Run this command on the server to find your project location:
```bash
pwd
```

Or check where PM2 is running from:
```bash
pm2 list
pm2 info 0  # Replace 0 with your app ID
```

Common CloudPanel paths:
- `/home/cloudpanel/htdocs/supuncompanies.com/`
- `/home/supuncompanies/htdocs/supuncompanies.com/`
- `/var/www/supuncompanies.com/`

### Step 4: Verify Uploads Directory Exists

```bash
# Navigate to your project
cd /path/to/your/project

# Check if uploads directory exists
ls -la server/uploads/

# If it exists, you should see your uploaded files
ls -la server/uploads/*.jpg
```

### Step 5: Set Correct Permissions

```bash
# Navigate to project root
cd /path/to/your/project

# Ensure uploads directory has correct permissions
chmod 755 server/uploads
chmod 644 server/uploads/*

# If running as cloudpanel user
sudo chown -R cloudpanel:cloudpanel server/uploads/
```

### Step 6: Test Nginx Configuration

```bash
# Test configuration syntax
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

### Step 7: Verify It Works

1. Check if file exists on server:
```bash
ls -la /path/to/project/server/uploads/1760294042329-439772863-1.jpg
```

2. Try accessing directly in browser:
```
https://supuncompanies.com/uploads/1760294042329-439772863-1.jpg
```

3. Check Nginx error logs if still not working:
```bash
sudo tail -f /var/log/nginx/error.log
```

## Quick Reference Commands

```bash
# Find project path
pwd

# Check PM2 app location
pm2 list
pm2 info <app-id>

# Edit Nginx config
sudo nano /etc/nginx/sites-available/supuncompanies.com.conf

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Check uploads directory
ls -la server/uploads/

# Fix permissions
chmod 755 server/uploads
chmod 644 server/uploads/*

# View error logs
sudo tail -f /var/log/nginx/error.log
```

## Example Complete Nginx Configuration

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name supuncompanies.com www.supuncompanies.com;

    # SSL Configuration (managed by CloudPanel/Certbot)
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Static frontend files
    root /home/cloudpanel/htdocs/supuncompanies.com/dist;
    index index.html;

    # Serve uploaded files
    location /uploads/ {
        alias /home/cloudpanel/htdocs/supuncompanies.com/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Add CORS if needed
        add_header Access-Control-Allow-Origin *;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Troubleshooting

### Still Getting 404?

1. **Check file exists:**
   ```bash
   ls -la /full/path/to/server/uploads/filename.jpg
   ```

2. **Check Nginx user permissions:**
   ```bash
   sudo -u www-data ls -la /full/path/to/server/uploads/
   ```

3. **Check Nginx error log:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Test alias path in Nginx config:**
   ```nginx
   location /uploads/ {
       alias /home/cloudpanel/htdocs/supuncompanies.com/server/uploads/;
       # Add this temporarily for debugging:
       autoindex on;
   }
   ```
   Then visit `https://supuncompanies.com/uploads/` to see directory listing.

### Permission Denied Errors?

```bash
# Fix ownership (replace cloudpanel with your user)
sudo chown -R cloudpanel:cloudpanel /path/to/project/server/uploads/

# Fix permissions
chmod 755 /path/to/project/server/uploads
chmod 644 /path/to/project/server/uploads/*
```

### Files Upload But Disappear?

Check PM2 app is running from correct directory:
```bash
pm2 info 0  # Your app ID
# Check "cwd" field
```

If wrong, update PM2:
```bash
pm2 delete 0
cd /correct/project/path
pm2 start server/index.js --name "supun-companies"
pm2 save
```

## Next Steps

After fixing Nginx configuration:
1. ✅ Upload should work
2. ✅ Files should be accessible
3. ✅ Images should display on frontend
4. ✅ PDF catalogs should open

Test by uploading a new company image or PDF catalog in the admin panel.
