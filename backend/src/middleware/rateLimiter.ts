import rateLimit from 'express-rate-limit';

// Rate limiter for general API requests
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: {
    success: false,
    error: 'Too many requests. Please wait a moment before trying again.',
    message: 'Rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for download endpoint
export const downloadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 downloads per minute per IP
  message: {
    success: false,
    error: '⏳ Too many requests. Please wait 30 seconds and try again.',
    message: 'Download rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
