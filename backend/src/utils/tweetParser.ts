import { VideoQuality } from '../types/index.js';

/**
 * Extract tweet ID from various Twitter/X URL formats
 */
export function extractTweetId(url: string): string | null {
  const patterns = [
    /(?:twitter|x)\.com\/(?:#!\/)?(?:\w+)\/status(?:es)?\/(\d+)/,
    /(?:twitter|x)\.com\/(?:\w+)\/status\/(\d+)/,
    /^(\d{15,})$/  // Direct tweet ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Determine quality label from bitrate
 */
export function getQualityLabel(bitrate: number): string {
  if (bitrate >= 2000000) return '1080p';
  if (bitrate >= 1000000) return '720p';
  if (bitrate >= 500000) return '480p';
  if (bitrate >= 250000) return '360p';
  return '240p';
}

/**
 * Format file size from bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Sort video variants by bitrate (highest first)
 */
export function sortVideosByQuality(variants: VideoQuality[]): VideoQuality[] {
  return variants.sort((a, b) => b.bitrate - a.bitrate);
}

/**
 * Validate Twitter/X URL
 */
export function isValidTwitterUrl(url: string): boolean {
  const tweetId = extractTweetId(url);
  return tweetId !== null && tweetId.length >= 15;
}
