# ⚡ Quick Start Guide

Get the Twitter/X Video Downloader running in under 5 minutes!

## 🎯 Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

Check your versions:
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v8 or higher
```

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd twitter-video-downloader
```

### Step 2: Install All Dependencies

**Option A: Install Everything at Once**
```bash
npm run install:all
```

**Option B: Install Manually**
```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 3: Setup Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

The default `.env` should work for local development:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend:**
```bash
cd ../frontend
cp .env.example .env
```

The default `.env` should work for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start the Application

**Option A: Run Both Servers Together (Recommended)**
```bash
# From project root
npm run dev
```

**Option B: Run Separately**

In one terminal:
```bash
cd backend
npm run dev
```

In another terminal:
```bash
cd frontend
npm run dev
```

### Step 5: Open Your Browser

Navigate to: **http://localhost:3000**

You should see the Twitter/X Video Downloader interface!

## 🎮 Test It Out

1. **Find a Twitter/X video post**
   - Go to Twitter/X and find any public post with a video
   - Example: https://x.com/username/status/1234567890

2. **Copy the URL**
   - Copy the full URL from the address bar

3. **Paste and Download**
   - Paste the URL into the input field
   - Click "Get Video"
   - Wait for processing (usually 2-5 seconds)
   - Choose your quality and download!

## 🐛 Troubleshooting

### Port Already in Use

If you get `EADDRINUSE` error:

```bash
# Kill process on port 5000 (Backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Frontend)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Dependencies Installation Failed

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf backend/node_modules frontend/node_modules
npm run install:all
```

### "Cannot find module" Error

```bash
# Make sure you're in the correct directory
cd backend  # for backend issues
cd frontend  # for frontend issues

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Error in Browser

- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000
- Check `.env` files have correct URLs
- Restart both servers

### "Failed to fetch video data"

This could mean:
- The tweet doesn't exist or is private
- The URL format is incorrect
- Twitter's API is temporarily unavailable
- Rate limit exceeded (wait 30 seconds)

## 📊 Project Status Check

To verify everything is working:

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"success":true,"status":"healthy","timestamp":"..."}`

2. **Frontend Running**
   - Open http://localhost:3000
   - Should see the UI with no errors

3. **API Connection**
   - Paste a Twitter URL in the frontend
   - Click "Get Video"
   - Should process without CORS errors

## 🎨 What You Should See

### Frontend (http://localhost:3000)
- Beautiful gradient background with animated blobs
- Dark/Light mode toggle (top right)
- Input field for Twitter/X URLs
- "Get Video" button

### Backend (http://localhost:5000)
- Terminal showing server startup message
- No errors in console
- Logs request when you test downloads

## 🔥 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run build` | Build both for production |
| `npm run install:all` | Install all dependencies |
| `cd backend && npm run dev` | Run backend only |
| `cd frontend && npm run dev` | Run frontend only |

## 📦 Production Build

To test production build locally:

```bash
# Build both
npm run build

# Preview frontend
cd frontend
npm run preview

# Run backend production
cd ../backend
npm start
```

## 🌐 Next Steps

- ✅ Got it running locally? Great!
- 📚 Read the full [README.md](README.md) for features
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for hosting options
- 🎯 Start downloading videos!

## 💡 Tips

1. **Development Speed**: Use `npm run dev` from root to run both servers
2. **Hot Reload**: Both frontend and backend auto-reload on file changes
3. **Browser DevTools**: Open Console (F12) to see any errors
4. **API Testing**: Use Postman or curl to test API directly

## 🆘 Still Having Issues?

1. **Check Node version**: Must be v18 or higher
2. **Check ports**: 3000 and 5000 must be free
3. **Check firewall**: Allow Node.js through firewall
4. **Check antivirus**: May block local servers
5. **Check logs**: Look for errors in terminal

## 📞 Get Help

- 📖 Read the [full README](README.md)
- 🔍 Check [GitHub Issues](../../issues)
- 💬 Open a new issue if you're stuck

---

**Happy Downloading! 🎉**
