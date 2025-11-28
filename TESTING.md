# 🧪 Testing Guide

Complete guide for testing the Twitter/X Video Downloader application.

## Manual Testing Checklist

### ✅ Basic Functionality

- [ ] **Valid Twitter URL**
  - Paste a valid Twitter/X video URL
  - Click "Get Video"
  - Verify video preview appears
  - Verify all quality options are shown
  - Download each quality option
  - Verify files download correctly

- [ ] **Multiple URL Formats**
  - Test `https://twitter.com/user/status/123...`
  - Test `https://x.com/user/status/123...`
  - Test `https://mobile.twitter.com/user/status/123...`
  - Test direct tweet ID if supported

### ❌ Error Handling

- [ ] **Invalid URL**
  - Enter random text
  - Verify error message: "Please enter a valid Twitter/X post URL"

- [ ] **No Video in Tweet**
  - Enter URL of tweet with only text/images
  - Verify error message: "No video found in this post"

- [ ] **Private Tweet**
  - Enter URL of protected account's tweet
  - Verify error message about private/protected content

- [ ] **Non-existent Tweet**
  - Enter URL with invalid tweet ID
  - Verify appropriate error message

- [ ] **Rate Limiting**
  - Make 6+ requests quickly
  - Verify rate limit error message appears

### 🎨 UI/UX Testing

- [ ] **Dark/Light Mode**
  - Click dark mode toggle
  - Verify all colors change appropriately
  - Check text readability in both modes
  - Verify icons change color

- [ ] **Responsive Design**
  - Test on desktop (1920x1080)
  - Test on tablet (768px width)
  - Test on mobile (375px width)
  - Verify layout adapts properly

- [ ] **Loading States**
  - Verify loading spinner appears during fetch
  - Verify button is disabled while loading
  - Verify smooth transitions

- [ ] **Animations**
  - Check button hover effects
  - Check quality card animations
  - Check error message animations
  - Verify no janky animations

### 🔧 Functional Testing

- [ ] **Quality Selection**
  - Verify qualities are sorted (highest first)
  - Verify quality labels are correct (1080p, 720p, etc.)
  - Verify bitrate information is shown
  - Download each quality and verify correctness

- [ ] **Copy URL Feature**
  - Click copy button for a quality
  - Paste in browser address bar
  - Verify video plays directly

- [ ] **Best Quality Auto-Download**
  - Click "Download Best Quality" button
  - Verify highest quality downloads

- [ ] **New Download**
  - After successful download
  - Click "Download another video"
  - Verify form resets correctly

### 🌐 Browser Compatibility

Test in these browsers:

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Mobile Chrome** (Android)

### ⚡ Performance Testing

- [ ] **Load Time**
  - Measure initial page load (<2 seconds)
  - Check bundle size
  - Verify lazy loading works

- [ ] **API Response Time**
  - First request (no cache): <5 seconds
  - Cached request: <1 second

- [ ] **Memory Leaks**
  - Download 10+ videos
  - Check browser memory usage
  - Verify no significant memory increase

## API Testing

### Using curl

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Download Video:**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://x.com/user/status/123..."}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "tweetId": "123...",
    "username": "user",
    "text": "Tweet text...",
    "thumbnail": "https://...",
    "variants": [...],
    "bestQuality": {...}
  }
}
```

**Invalid URL:**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "invalid"}'
```

Expected response:
```json
{
  "success": false,
  "error": "Invalid URL format",
  "message": "❌ Please enter a valid Twitter/X post URL"
}
```

### Using Postman

1. **Import Collection:**
   - Create new collection "Twitter Video Downloader"

2. **Add Requests:**

   **Request 1: Health Check**
   - Method: GET
   - URL: `http://localhost:5000/api/health`

   **Request 2: Download Video**
   - Method: POST
   - URL: `http://localhost:5000/api/download`
   - Body (JSON):
     ```json
     {
       "url": "https://x.com/user/status/123..."
     }
     ```

3. **Run Tests:**
   - Click "Send" for each request
   - Verify responses match expected format

## Rate Limiting Tests

**Test 1: Normal Usage (Should Pass)**
```bash
# Make 3 requests in a minute (under limit)
for i in {1..3}; do
  curl -X POST http://localhost:5000/api/download \
    -H "Content-Type: application/json" \
    -d '{"url": "https://x.com/user/status/123..."}'
  sleep 20
done
```

**Test 2: Rate Limit Hit (Should Fail)**
```bash
# Make 6 requests quickly (over limit of 5/min)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/download \
    -H "Content-Type: application/json" \
    -d '{"url": "https://x.com/user/status/123..."}'
done
```

Expected: 6th request returns 429 error

## Cache Testing

**Test 1: Cache Miss**
```bash
# First request (no cache)
time curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://x.com/user/status/123..."}'
```
Expected: Takes 2-5 seconds

**Test 2: Cache Hit**
```bash
# Second request (cached)
time curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://x.com/user/status/123..."}'
```
Expected: Takes <1 second

**Test 3: Cache Expiry**
```bash
# Wait 5+ minutes and retry
sleep 301
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://x.com/user/status/123..."}'
```
Expected: Cache expired, takes 2-5 seconds again

## Security Testing

### CORS Testing

**Test 1: Allowed Origin (Should Pass)**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"url": "https://x.com/user/status/123..."}'
```

**Test 2: Unauthorized Origin (Should Fail in Production)**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -H "Origin: http://malicious-site.com" \
  -d '{"url": "https://x.com/user/status/123..."}'
```

### Input Validation

**Test 1: SQL Injection Attempt**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://x.com/user/status/123; DROP TABLE users;"}'
```
Expected: Returns validation error

**Test 2: XSS Attempt**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "<script>alert(\"xss\")</script>"}'
```
Expected: Returns validation error

**Test 3: Very Long URL**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "'$(python3 -c 'print("a"*10000)')'"}'
```
Expected: Handles gracefully (rejects or truncates)

## Load Testing

### Using Apache Bench (ab)

**Install Apache Bench:**
```bash
# Ubuntu/Debian
sudo apt-get install apache2-utils

# macOS
brew install httpd
```

**Run Load Test:**
```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 -p post_data.json -T application/json \
  http://localhost:5000/api/health
```

Where `post_data.json`:
```json
{"url": "https://x.com/user/status/123..."}
```

**Interpret Results:**
- Requests per second: Should be >10
- Average response time: Should be <500ms
- Failed requests: Should be 0 (or only rate limit errors)

## Frontend Testing Checklist

### Accessibility

- [ ] **Keyboard Navigation**
  - Tab through all interactive elements
  - Verify focus indicators visible
  - Test Enter key on buttons

- [ ] **Screen Reader**
  - Use screen reader (NVDA/JAWS/VoiceOver)
  - Verify all buttons have labels
  - Verify error messages are announced

- [ ] **Color Contrast**
  - Check contrast ratios (use browser DevTools)
  - Verify text readable on backgrounds
  - Test in both light and dark modes

### SEO

- [ ] **Meta Tags**
  - Check page title
  - Verify description meta tag
  - Check Open Graph tags

- [ ] **Performance**
  - Run Lighthouse audit
  - Target scores: >90 for all categories

## Automated Testing (Future)

### Backend Tests (Jest)

Create `backend/src/__tests__/twitterScraper.test.ts`:

```typescript
import twitterScraper from '../services/twitterScraper';

describe('Twitter Scraper', () => {
  it('should extract tweet ID from URL', () => {
    // Test implementation
  });

  it('should fetch video data', async () => {
    // Test implementation
  });

  it('should handle errors gracefully', async () => {
    // Test implementation
  });
});
```

Run tests:
```bash
cd backend
npm test
```

### Frontend Tests (Vitest)

Create `frontend/src/__tests__/VideoDownloader.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import VideoDownloader from '../components/VideoDownloader';

describe('VideoDownloader', () => {
  it('renders input field', () => {
    // Test implementation
  });

  it('shows error on invalid URL', () => {
    // Test implementation
  });
});
```

Run tests:
```bash
cd frontend
npm test
```

## Test Coverage Goals

- **Backend**: >80% code coverage
- **Frontend**: >70% code coverage
- **Critical paths**: 100% coverage

## Continuous Testing

Set up GitHub Actions for automated testing on every commit:

`.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm run install:all
      - run: cd backend && npm test
      - run: cd frontend && npm test
```

## Test Reports

After testing, document:

- ✅ Features tested
- ❌ Issues found
- 🐛 Bugs reported
- 📊 Performance metrics
- 💡 Improvement suggestions

## Bug Reporting Template

When you find a bug:

```markdown
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- App Version: 1.0.0

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Paste any errors from browser console]
```

---

**Happy Testing! 🧪**
