import React from 'react';
import { motion } from 'framer-motion';
import { Image } from 'lucide-react';

interface ThumbnailPreviewProps {
  imageUrl: string | null;
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ imageUrl }) => {
  return (
    <div className="glass-card h-full flex flex-col">
      <h3 className="text-xl font-heading mb-4">Thumbnail Preview</h3>
      
      <div className="flex-1 flex items-center justify-center bg-black/30 rounded-lg overflow-hidden relative">
        {imageUrl ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={imageUrl}
            alt="Generated thumbnail"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center p-8">
            <Image size={64} className="mx-auto mb-4 text-white/30" />
            <p className="text-white/50">
              Your generated thumbnail will appear here
            </p>
            <p className="text-white/30 text-sm mt-2">
              Enter a prompt and click Generate to create your first thumbnail
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailPreview;