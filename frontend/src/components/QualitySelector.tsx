import { motion } from 'framer-motion';
import { Download, Copy, Check } from 'lucide-react';
import { VideoQuality } from '../types';
import { useState } from 'react';

interface QualitySelectorProps {
  variants: VideoQuality[];
  onDownload: (url: string, quality: string) => void;
}

export default function QualitySelector({ variants, onDownload }: QualitySelectorProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getQualityColor = (quality: string) => {
    if (quality.includes('1080p')) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (quality.includes('720p')) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (quality.includes('480p')) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    return 'bg-gradient-to-r from-gray-500 to-slate-500';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Available Qualities
      </h3>
      {variants.map((variant, index) => (
        <motion.div
          key={variant.url}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className={`${getQualityColor(variant.quality)} px-4 py-2 rounded-lg text-white font-bold text-sm shadow-md`}>
                {variant.quality}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {(variant.bitrate / 1000000).toFixed(1)} Mbps
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopyUrl(variant.url)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Copy video URL"
              >
                {copiedUrl === variant.url ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDownload(variant.url, variant.quality)}
                className="px-6 py-2 bg-twitter-blue hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
