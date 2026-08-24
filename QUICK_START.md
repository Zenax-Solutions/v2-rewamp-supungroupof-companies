# 🚀 Quick Start - Deployment Overview

## Choose Your Hosting Method

### 🎯 Option 1: CloudPanel (Easiest - Recommended for Beginners)
**Best for:** Non-technical users, small businesses
**Cost:** $5-10/month (DigitalOcean, Linode)
**Time:** 30-45 minutes

📖 **Follow:** `CLOUDPANEL_GUIDE.md`

```
1. Get a VPS with CloudPanel → 2. Create Node.js site → 
3. Upload code → 4. Configure → 5. Done! ✅
```

### 🛠️ Option 2: Manual VPS Setup (More Control)
**Best for:** Developers, custom configurations
**Cost:** $5-10/month
**Time:** 45-60 minutes

📖 **Follow:** `DEPLOYMENT_GUIDE.md` (Option 2)

```
1. Get Ubuntu VPS → 2. Install software → 3. Run deploy.sh → 
4. Configure Nginx → 5. Setup SSL → 6. Done! ✅
```

### 🐳 Option 3: Docker (Advanced)
**Best for:** Containerized deployments, scalability
**Cost:** Variable
**Time:** 20-30 minutes (if familiar with Docker)

📖 **Follow:** `DEPLOYMENT_GUIDE.md` (Docker section)

---

## 📋 What You Need

### Required:
- [ ] VPS/Cloud Server (Ubuntu 20.04/22.04)
- [ ] Domain name
- [ ] SSH access
- [ ] Basic terminal knowledge

### Recommended Providers:
| Provider | Cost | Setup Ease | Notes |
|----------|------|-----------|-------|
| **DigitalOcean** | $6/mo | ⭐⭐⭐⭐⭐ | Best for beginners, 1-click CloudPanel |
| **Linode** | $5/mo | ⭐⭐⭐⭐⭐ | Great support, easy setup |
| **Vultr** | $5/mo | ⭐⭐⭐⭐ | Good global locations |
| **Hetzner** | €4/mo | ⭐⭐⭐⭐ | Cheapest, EU servers |
| **AWS Lightsail** | $5/mo | ⭐⭐⭐ | More complex but powerful |

---

## ⚡ Quick Commands Cheat Sheet

### SSH Connect
```bash
ssh root@your-server-ip
```

### Quick Deploy (One Command)
```bash
# Download and run deployment script
wget https://raw.githubusercontent.com/Zenax-Solutions/web-folio-prime/main/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

### Check Status
```bash
pm2 status              # Backend status
systemctl status nginx  # Web server status
pm2 logs supun-backend  # View logs
```

### Update Site
```bash
cd /home/supungroup/htdocs/
git pull origin main
npm run build
pm2 restart supun-backend
```

---

## 🎯 Deployment Checklist

### Before Deployment:
- [ ] Code is working locally
- [ ] All features tested
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Domain DNS pointed to server IP

### During Deployment:
- [ ] Server software installed (Node.js, PM2, Nginx)
- [ ] Code uploaded/cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment file created (`.env`)
- [ ] Database initialized (`npm run db:init`)
- [ ] Frontend built (`npm run build`)
- [ ] Backend started with PM2
- [ ] Nginx configured
- [ ] SSL certificate installed

### After Deployment:
- [ ] Website loads correctly
- [ ] Admin panel accessible
- [ ] Can login to admin
- [ ] Can upload images/PDFs
- [ ] All pages working
- [ ] Mobile responsive
- [ ] HTTPS working (green lock)
- [ ] Changed default admin password
- [ ] Setup backup strategy
- [ ] Monitor logs for errors

---

## 🆘 Common Issues & Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| **502 Bad Gateway** | `pm2 restart supun-backend` |
| **Website not loading** | `systemctl restart nginx` |
| **Can't upload files** | `chmod -R 755 server/uploads` |
| **Database errors** | `npm run db:init` |
| **CSS not loading** | Clear browser cache, check `dist/` folder |
| **API not working** | Check `.env` file, restart PM2 |

---

## 📞 Get Help

### 1. Check Logs First
```bash
# Backend logs
pm2 logs supun-backend

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### 2. Verify Services
```bash
# Check if backend is running
pm2 status

# Check if Nginx is running
systemctl status nginx

# Check if port is in use
netstat -tulpn | grep 3001
```

### 3. Restart Everything
```bash
pm2 restart supun-backend
systemctl restart nginx
```

---

## 🎉 Success Indicators

✅ Your deployment is successful when:

1. **Website loads** at `https://your-domain.com`
2. **Green lock** appears (HTTPS working)
3. **Admin panel** accessible at `/admin`
4. **Can login** with admin credentials
5. **Can create/edit companies** and upload files
6. **No errors** in PM2 logs
7. **PM2 shows** backend as "online"

---

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `CLOUDPANEL_GUIDE.md` | Step-by-step CloudPanel deployment | Beginners |
| `DEPLOYMENT_GUIDE.md` | Comprehensive all-in-one guide | Everyone |
| `deploy.sh` | Automated deployment script | Developers |
| `README.md` | Project overview | Everyone |

---

## 💡 Pro Tips

1. **Use CloudPanel** if you're not comfortable with command line
2. **Always backup** before making changes
3. **Test locally** before deploying
4. **Use PM2** for process management (auto-restart on crash)
5. **Enable firewall** after deployment
6. **Monitor logs** regularly
7. **Keep Node.js updated**
8. **Setup automated backups** for database and uploads

---

## 🔐 Security Checklist

After deployment, secure your site:

```bash
# Change admin password immediately
# Visit: https://your-domain.com/admin

# Setup firewall
ufw allow 22      # SSH
ufw allow 80      # HTTP
ufw allow 443     # HTTPS
ufw allow 8443    # CloudPanel
ufw enable

# Disable root SSH (optional)
# Edit: nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
```

---

## 📈 Next Steps After Deployment

1. ✅ Test all website features
2. ✅ Add your companies and brands
3. ✅ Upload company images and catalogs
4. ✅ Test mobile responsiveness
5. ✅ Setup Google Analytics (optional)
6. ✅ Submit sitemap to Google Search Console
7. ✅ Setup regular backups
8. ✅ Monitor server resources

---

## 🎊 You're All Set!

Your Supun Group website is now live! 🚀

**Default Admin Access:**
- URL: `https://your-domain.com/admin`
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change the password immediately after first login!**

Need help? Check the detailed guides:
- 📘 CloudPanel: `CLOUDPANEL_GUIDE.md`
- 📗 Full Guide: `DEPLOYMENT_GUIDE.md`

Good luck! 🎉
