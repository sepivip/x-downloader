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

export interface TweetVideoData {
  tweetId: string;
  username: string;
  text: string;
  thumbnail: string;
  variants: VideoQuality[];
  bestQuality: VideoQuality;
}

export interface ApiResponse {
  success: boolean;
  data?: TweetVideoData;
  error?: string;
  message?: string;
}

export interface GuestToken {
  token: string;
  expiresAt: number;
}
