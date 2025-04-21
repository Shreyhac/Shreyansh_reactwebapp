import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';
import ReactPlayer from 'react-player';

interface VideoShortPreviewProps {
  videoUrl: string | null;
  isProcessing: boolean;
  processingProgress: number;
  processingStage: string;
}

const VideoShortPreview: React.FC<VideoShortPreviewProps> = ({
  videoUrl,
  isProcessing,
  processingProgress,
  processingStage,
}) => {
  const handleDownload = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className="glass-card h-full flex flex-col">
      <h3 className="text-xl font-heading mb-4">Generated Short</h3>
      
      <div className="flex-1 bg-black/30 rounded-lg overflow-hidden relative">
        {isProcessing ? (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="w-full bg-black/50 rounded-full h-4 mb-4">
              <motion.div 
                className="bg-secondary h-4 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${processingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-white text-lg mb-2">
              {processingStage}
            </p>
            <p className="text-white/70 text-sm text-center">
              This may take a few minutes. We're analyzing your video and creating an optimized short.
            </p>
          </div>
        ) : videoUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col"
          >
            <div className="relative w-full pt-[56.25%]">
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls={true}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button 
                onClick={handleDownload}
                className="cyber-btn flex-1 py-2 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                <span>Download</span>
              </button>
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="accent-btn flex items-center justify-center gap-2 py-2"
              >
                <ExternalLink size={18} />
                <span>Open</span>
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <ExternalLink size={48} className="mb-4 text-white/30" />
            <p className="text-white/50">
              Your generated short will appear here
            </p>
            <p className="text-white/30 text-sm mt-2">
              Upload a video and process it to create your short
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoShortPreview;