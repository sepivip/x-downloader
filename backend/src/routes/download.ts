import express, { Request, Response } from 'express';
import twitterScraper from '../services/twitterScraper.js';
import { videoCache } from '../middleware/cache.js';
import { downloadLimiter } from '../middleware/rateLimiter.js';
import { ApiResponse } from '../types/index.js';
import { extractTweetId } from '../utils/tweetParser.js';

const router = express.Router();

/**
 * POST /api/download
 * Download video data from Twitter/X URL
 */
router.post('/download', downloadLimiter, async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      const response: ApiResponse = {
        success: false,
        error: 'URL is required',
        message: '❌ Please enter a valid Twitter/X post URL'
      };
      return res.status(400).json(response);
    }

    const tweetId = extractTweetId(url);

    if (!tweetId) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid URL format',
        message: '❌ Please enter a valid Twitter/X post URL'
      };
      return res.status(400).json(response);
    }

    // Check cache first
    const cacheKey = `tweet_${tweetId}`;
    const cachedData = videoCache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for tweet ${tweetId}`);
      const response: ApiResponse = {
        success: true,
        data: cachedData as any
      };
      return res.json(response);
    }

    // Fetch video data
    console.log(`Fetching tweet ${tweetId}`);
    const videoData = await twitterScraper.getVideoData(url);

    // Cache the result
    videoCache.set(cacheKey, videoData);

    const response: ApiResponse = {
      success: true,
      data: videoData
    };

    res.json(response);
  } catch (error: any) {
    console.error('Download error:', error.message);

    let errorMessage = error.message;
    let statusCode = 500;

    if (error.message.includes('not found') || error.message.includes('private')) {
      errorMessage = '🔒 This post is private, protected, or does not exist';
      statusCode = 404;
    } else if (error.message.includes('No video')) {
      errorMessage = '❌ No video found in this post';
      statusCode = 404;
    } else if (error.message.includes('Rate limit')) {
      errorMessage = '⏳ Too many requests. Please wait 30 seconds';
      statusCode = 429;
    } else if (error.message.includes('Invalid')) {
      errorMessage = '❌ Please enter a valid Twitter/X post URL';
      statusCode = 400;
    }

    const response: ApiResponse = {
      success: false,
      error: errorMessage,
      message: errorMessage
    };

    res.status(statusCode).json(response);
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
