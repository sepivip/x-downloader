import { useState } from 'react';
import axios from 'axios';
import { VideoData, DownloadStatus, DownloadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

export function useVideoDownloader() {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoData = async (url: string) => {
    setStatus('loading');
    setError(null);
    setVideoData(null);

    try {
      const response = await axios.post<DownloadResponse>(`${API_URL}/download`, { url });

      if (response.data.success && response.data.data) {
        setVideoData(response.data.data);
        setStatus('success');
      } else {
        setError(response.data.message || 'Failed to fetch video data');
        setStatus('error');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setStatus('error');
    }
  };

  const downloadVideo = (url: string, quality: string) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `twitter_video_${quality}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setStatus('idle');
    setVideoData(null);
    setError(null);
  };

  return {
    status,
    videoData,
    error,
    fetchVideoData,
    downloadVideo,
    reset
  };
}
