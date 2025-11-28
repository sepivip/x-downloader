import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, AlertCircle, Twitter, Sparkles } from 'lucide-react';
import { useVideoDownloader } from '../hooks/useVideoDownloader';
import LoadingSpinner from './LoadingSpinner';
import VideoPreview from './VideoPreview';
import QualitySelector from './QualitySelector';

export default function VideoDownloader() {
  const [url, setUrl] = useState('');
  const { status, videoData, error, fetchVideoData, downloadVideo, reset } = useVideoDownloader();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      fetchVideoData(url.trim());
    }
  };

  const handleNewDownload = () => {
    setUrl('');
    reset();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Twitter className="w-12 h-12 text-twitter-blue" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-twitter-blue to-purple-600 bg-clip-text text-transparent">
            X Video Downloader
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Download Twitter/X videos in highest quality • Fast, free, no login required
        </p>
      </motion.div>

      {/* Input Form */}
      <AnimatePresence mode="wait">
        {status !== 'success' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="mb-8"
          >
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Twitter/X video URL here (e.g., https://x.com/username/status/...)"
                className="w-full px-6 py-4 pr-32 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-twitter-blue focus:ring-4 focus:ring-twitter-blue/20 transition-all text-lg shadow-lg"
                disabled={status === 'loading'}
              />
              <motion.button
                type="submit"
                disabled={status === 'loading' || !url.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-twitter-blue hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                Get Video
              </motion.button>
            </div>

            {/* URL Format Examples */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex flex-wrap gap-2 justify-center"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">Examples:</span>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                x.com/user/status/123...
              </code>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                twitter.com/user/status/123...
              </code>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {status === 'loading' && (
          <LoadingSpinner message="Fetching video data..." />
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {status === 'error' && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                  Error
                </h3>
                <p className="text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State - Video Preview & Download Options */}
      <AnimatePresence>
        {status === 'success' && videoData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <VideoPreview
              thumbnail={videoData.thumbnail}
              username={videoData.username}
              text={videoData.text}
            />

            <QualitySelector
              variants={videoData.variants}
              onDownload={downloadVideo}
            />

            {/* Auto Download Best Quality Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadVideo(videoData.bestQuality.url, 'highest_quality')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-2xl flex items-center gap-3 mx-auto transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Download Best Quality ({videoData.bestQuality.quality})
                <Download className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* New Download Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <button
                onClick={handleNewDownload}
                className="text-twitter-blue hover:text-blue-600 font-medium underline transition-colors"
              >
                Download another video
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2"
      >
        <p>
          For personal use only. Respect content creators and copyright laws.
        </p>
        <p className="flex items-center justify-center gap-2">
          <span>Made with</span>
          <span className="text-red-500">♥</span>
          <span>for the community</span>
        </p>
      </motion.div>
    </div>
  );
}
