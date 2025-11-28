export interface VideoVariant {
  bitrate: number;
  content_type: string;
  url: string;
}

export interface VideoQuality {
  quality: string;
  bitrate: number;
  url: string;
  size?: string;
}

export interface VideoData {
  tweetId: string;
  username: string;
  text: string;
  thumbnail: string;
  variants: VideoQuality[];
  bestQuality: VideoQuality;
}

export interface DownloadResponse {
  success: boolean;
  data?: VideoData;
  error?: string;
  message?: string;
}

export interface DownloadError {
  type: 'NO_VIDEO' | 'PRIVATE' | 'INVALID_URL' | 'RATE_LIMIT' | 'SERVER_ERROR';
  message: string;
}

export type DownloadStatus = 'idle' | 'loading' | 'success' | 'error';
