import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image } from 'lucide-react';
import ThumbnailForm from '../components/features/ai/ThumbnailForm';
import ThumbnailPreview from '../components/features/ai/ThumbnailPreview';

const ThumbnailStudio = () => {
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);

  return (
    <div>
      <div className="w-full text-center py-2 text-lg font-heading text-secondary tracking-wider bg-black/30 rounded-b-lg mb-4">
        Made by Shreyansh Arora 24BCS10252
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-heading flex items-center gap-2">
            <Image className="text-secondary" />
            Thumbnail Studio
          </h1>
          <p className="text-white/70 mt-2">
            Generate eye-catching thumbnails with AI to increase your click-through rate
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ThumbnailForm onGenerated={setCurrentThumbnail} />
          </div>
          <div className="h-full">
            <ThumbnailPreview imageUrl={currentThumbnail} />
          </div>
        </div>

        <div className="mt-12">
          <div className="glass-card">
            <h2 className="text-xl font-heading mb-4">Thumbnail Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="font-heading text-secondary mb-2">High Contrast</h3>
                <p className="text-white/70 text-sm">
                  Use contrasting colors to make your thumbnail stand out in search results and recommendations.
                </p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="font-heading text-secondary mb-2">Clear Focal Point</h3>
                <p className="text-white/70 text-sm">
                  Ensure your main subject is clearly visible and draws the viewer's attention immediately.
                </p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="font-heading text-secondary mb-2">Minimal Text</h3>
                <p className="text-white/70 text-sm">
                  Use short, large text that's readable even on mobile devices. Let the image do most of the talking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThumbnailStudio;