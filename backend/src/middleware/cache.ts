import NodeCache from 'node-cache';

// Cache for tweet video data (5 minutes TTL)
export const videoCache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false
});

// Cache statistics
export function getCacheStats() {
  return {
    keys: videoCache.keys().length,
    stats: videoCache.getStats()
  };
}

// Clear cache manually
export function clearCache() {
  videoCache.flushAll();
}
