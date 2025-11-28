import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoPreviewProps {
  thumbnail: string;
  username: string;
  text: string;
}

export default function VideoPreview({ thumbnail, username, text }: VideoPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden shadow-2xl mb-6"
    >
      <div className="relative aspect-video bg-gray-900">
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-twitter-blue/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
      </div>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-twitter-blue mb-1">@{username}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {text}
        </p>
      </div>
    </motion.div>
  );
}
