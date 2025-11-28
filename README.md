# 🚀 Twitter/X Video Downloader

A modern, production-ready web application for downloading Twitter/X videos in the highest quality. Built with React, TypeScript, Node.js, and Express.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🎥 **High-Quality Downloads** - Download videos in up to 1080p
- 🚀 **Fast & Efficient** - Optimized scraping with caching
- 🎨 **Modern UI** - Beautiful glassmorphism design with dark mode
- 📱 **Responsive** - Perfect on desktop, tablet, and mobile
- 🔒 **No Login Required** - Works for any public tweet
- ⚡ **Real-time Preview** - See video thumbnail before downloading
- 🎯 **Multiple Qualities** - Choose from all available resolutions
- 💾 **Direct Download** - No redirects or waiting
- 🛡️ **Rate Limited** - Protection against abuse
- 🗄️ **Smart Caching** - Faster repeat downloads

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe code
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Cheerio** - HTML parsing
- **Node-Cache** - In-memory caching
- **Express Rate Limit** - API protection

## 📁 Project Structure

```
twitter-video-downloader/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── VideoDownloader.tsx
│   │   │   ├── QualitySelector.tsx
│   │   │   ├── VideoPreview.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useVideoDownloader.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── backend/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   └── download.ts
│   │   ├── services/        # Business logic
│   │   │   └── twitterScraper.ts
│   │   ├── middleware/      # Express middleware
│   │   │   ├── rateLimiter.ts
│   │   │   └── cache.ts
│   │   ├── utils/           # Utility functions
│   │   │   └── tweetParser.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml        # Docker configuration
├── vercel.json              # Vercel deployment config
└── README.md

```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git**

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd twitter-video-downloader
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Set up Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Commands

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build TypeScript |
| `npm start` | Run production server |

## 🌐 Deployment

### Option 1: Docker (Recommended)

Deploy the entire application with Docker Compose:

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The app will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

3. Set environment variable:
   ```bash
   vercel env add VITE_API_URL
   # Enter your backend URL: https://your-backend.railway.app/api
   ```

#### Deploy Backend to Railway

1. Visit [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `/backend`
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```
6. Deploy!

### Option 3: Render (Full Stack)

#### Backend on Render

1. Visit [Render.com](https://render.com)
2. New → Web Service
3. Connect your repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables
6. Deploy

#### Frontend on Render

1. New → Static Site
2. Connect your repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Deploy

### Option 4: VPS (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone <your-repo>
cd twitter-video-downloader

# Backend
cd backend
npm install
npm run build
pm2 start dist/server.js --name twitter-backend

# Frontend (with Nginx)
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/default
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Configuration

### Environment Variables

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🎯 Usage

1. **Copy Tweet URL**
   - Go to any Twitter/X post with a video
   - Copy the URL (e.g., `https://x.com/username/status/1234567890`)

2. **Paste and Download**
   - Paste the URL into the input field
   - Click "Get Video"
   - Choose your preferred quality
   - Click "Download"

## 🛡️ API Rate Limits

- **General API**: 10 requests/minute per IP
- **Download Endpoint**: 5 requests/minute per IP
- **Cache Duration**: 5 minutes per tweet

## 📝 API Endpoints

### `POST /api/download`

Download video data from a Twitter/X URL.

**Request:**
```json
{
  "url": "https://x.com/username/status/1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tweetId": "1234567890",
    "username": "username",
    "text": "Tweet text...",
    "thumbnail": "https://...",
    "variants": [
      {
        "quality": "1080p",
        "bitrate": 2176000,
        "url": "https://..."
      }
    ],
    "bestQuality": {
      "quality": "1080p",
      "bitrate": 2176000,
      "url": "https://..."
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎨 Features in Detail

### Smart URL Detection
Supports multiple URL formats:
- `https://x.com/user/status/123...`
- `https://twitter.com/user/status/123...`
- `https://mobile.twitter.com/user/status/123...`
- Direct tweet IDs

### Quality Selection
- Automatically detects all available video qualities
- Labels videos as 1080p, 720p, 480p, 360p, or 240p
- Shows bitrate for each quality
- Highlights best quality option

### Error Handling
- ❌ No video found in post
- 🔒 Private/protected tweets
- ❌ Invalid URL format
- ⏳ Rate limit exceeded
- 🚫 Server errors

### Performance
- **Guest Token Caching**: Reuses tokens for 2 hours
- **Video Data Caching**: Caches tweet data for 5 minutes
- **Code Splitting**: Separate vendor and animation bundles
- **Lazy Loading**: Images load on demand

## 🔒 Security

- **Helmet.js**: Security headers
- **CORS**: Configurable origins
- **Rate Limiting**: Prevents abuse
- **Input Validation**: URL sanitization
- **No Authentication**: No user data stored

## 🐛 Troubleshooting

### "Failed to fetch video data"
- Check if the tweet exists and is public
- Verify the URL format is correct
- Check if Twitter's API is accessible

### "Rate limit exceeded"
- Wait 30 seconds before trying again
- Consider increasing rate limits in production

### CORS errors
- Ensure `CORS_ORIGIN` in backend matches your frontend URL
- Check if both servers are running

### Build errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## 📄 License

This project is licensed under the MIT License.

## ⚖️ Legal Notice

This tool is for **personal use only**. Please respect:
- Content creators' rights
- Twitter's Terms of Service
- Copyright laws
- Fair use guidelines

**Do not use this tool to:**
- Download copyrighted content without permission
- Redistribute downloaded videos commercially
- Violate any applicable laws

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with React, TypeScript, and Node.js
- UI inspired by modern web design trends
- Icons by Lucide React

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ♥ for the community**
