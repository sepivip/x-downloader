# 🚀 Deployment Guide

Complete deployment instructions for all major platforms.

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [Vercel + Railway](#vercel--railway)
- [Render (Full Stack)](#render-full-stack)
- [Netlify + Railway](#netlify--railway)
- [VPS Deployment](#vps-deployment)

---

## 🐳 Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd twitter-video-downloader
   ```

2. **Configure environment**
   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Build and run**
   ```bash
   docker-compose up -d
   ```

4. **Verify deployment**
   ```bash
   # Check running containers
   docker-compose ps

   # View logs
   docker-compose logs -f
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Useful Commands

```bash
# Stop containers
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Remove everything including volumes
docker-compose down -v
```

---

## ☁️ Vercel + Railway

### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment Variables**
   ```bash
   # Add API URL after deploying backend
   vercel env add VITE_API_URL production
   # Enter: https://your-backend.railway.app/api

   # Redeploy with environment variable
   vercel --prod
   ```

### Backend on Railway

1. **Visit [Railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select your repository

3. **Configure Service**
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Copy the generated URL

6. **Update Frontend**
   - Update `VITE_API_URL` in Vercel to point to Railway backend
   - Redeploy frontend

---

## 🎨 Render (Full Stack)

### Backend Deployment

1. **Visit [Render.com](https://render.com)**

2. **New Web Service**
   - Dashboard → New → Web Service
   - Connect your GitHub repository

3. **Configure**
   ```
   Name: twitter-downloader-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free (or upgrade for production)
   ```

4. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend.onrender.com
   ```

5. **Create Web Service**
   - Wait for deployment
   - Copy the backend URL

### Frontend Deployment

1. **New Static Site**
   - Dashboard → New → Static Site
   - Connect your GitHub repository

2. **Configure**
   ```
   Name: twitter-downloader-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. **Create Static Site**
   - Wait for deployment
   - Access your live app!

### Auto-Deploy Configuration

Render automatically deploys on git push. To disable:
- Go to Service Settings
- Toggle "Auto-Deploy" off

---

## 🌐 Netlify + Railway

### Frontend on Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   cd frontend
   netlify init

   # Follow prompts:
   # Build command: npm run build
   # Publish directory: dist
   ```

4. **Configure Environment**
   ```bash
   netlify env:set VITE_API_URL "https://your-backend.railway.app/api"
   ```

5. **Deploy to Production**
   ```bash
   netlify deploy --prod
   ```

### Backend on Railway
Follow the Railway instructions from the Vercel + Railway section above.

---

## 🖥️ VPS Deployment (Ubuntu/Debian)

### Prerequisites
- Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- Domain name (optional)

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### 2. Clone and Setup Application

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> twitter-downloader
cd twitter-downloader
sudo chown -R $USER:$USER /var/www/twitter-downloader
```

### 3. Setup Backend

```bash
cd /var/www/twitter-downloader/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
nano .env
```

Edit `.env`:
```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://yourdomain.com
```

```bash
# Build
npm run build

# Start with PM2
pm2 start dist/server.js --name twitter-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs
```

### 4. Setup Frontend

```bash
cd /var/www/twitter-downloader/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
nano .env
```

Edit `.env`:
```env
VITE_API_URL=/api
```

```bash
# Build
npm run build

# Copy to Nginx web root
sudo cp -r dist/* /var/www/html/
```

### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/twitter-downloader
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/twitter-downloader /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test renewal
sudo certbot renew --dry-run
```

### 7. Setup Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 8. Monitoring and Maintenance

```bash
# View backend logs
pm2 logs twitter-backend

# Monitor resources
pm2 monit

# Restart backend
pm2 restart twitter-backend

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Update application
cd /var/www/twitter-downloader
git pull
cd backend && npm install && npm run build && pm2 restart twitter-backend
cd ../frontend && npm install && npm run build && sudo cp -r dist/* /var/www/html/
```

---

## 🔄 Update Procedures

### Docker
```bash
git pull
docker-compose down
docker-compose up -d --build
```

### Vercel
```bash
git push origin main
# Vercel auto-deploys
```

### Railway
```bash
git push origin main
# Railway auto-deploys
```

### Render
```bash
git push origin main
# Render auto-deploys
```

### VPS
```bash
cd /var/www/twitter-downloader
git pull
cd backend && npm install && npm run build && pm2 restart twitter-backend
cd ../frontend && npm install && npm run build && sudo cp -r dist/* /var/www/html/
sudo systemctl restart nginx
```

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :5000
# Kill it
sudo kill -9 <PID>
```

### PM2 Process Not Starting
```bash
pm2 delete twitter-backend
pm2 start dist/server.js --name twitter-backend
pm2 save
```

### Nginx Configuration Error
```bash
sudo nginx -t  # Test configuration
sudo systemctl status nginx  # Check status
```

### CORS Errors
- Ensure `CORS_ORIGIN` in backend matches frontend URL exactly
- Check if both http/https match

---

## 📊 Performance Tips

1. **Enable Caching**: Already configured in backend
2. **Use CDN**: Cloudflare or similar for static assets
3. **Optimize Images**: Use WebP format for thumbnails
4. **Database**: Consider Redis for caching in production
5. **Monitoring**: Setup UptimeRobot or similar
6. **Logging**: Use service like Logtail or Papertrail

---

## 🔐 Security Checklist

- [ ] Enable HTTPS (SSL certificate)
- [ ] Configure firewall
- [ ] Set secure environment variables
- [ ] Enable rate limiting (already configured)
- [ ] Regular security updates
- [ ] Backup configuration files
- [ ] Monitor logs for suspicious activity
- [ ] Use strong server passwords
- [ ] Disable root SSH login

---

## 📞 Support

If you encounter issues:
1. Check the logs
2. Review this guide
3. Search existing GitHub issues
4. Open a new issue with details

---

**Happy Deploying! 🚀**
