import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Bookmark, CheckCircle } from 'lucide-react';
import { VideoData } from '../../../types';
import { useAppContext } from '../../../context/AppContext';

interface TrendCardProps {
  video: VideoData;
}

const TrendCard: React.FC<TrendCardProps> = ({ video }) => {
  const { addToSavedIdeas, isVideoSaved } = useAppContext();
  const saved = isVideoSaved(video.id);

  // Format view count with commas
  const formatViewCount = (count: string) => {
    return parseInt(count).toLocaleString();
  };

  // Format published date
  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card group overflow-hidden"
    >
      <div className="relative">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-48 object-cover rounded transition-transform group-hover:scale-105 duration-500"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
          {formatViewCount(video.viewCount)} views
        </div>
      </div>
      
      <div className="pt-4">
        <h3 className="font-heading text-lg font-bold line-clamp-2 min-h-[3.5rem]">{video.title}</h3>
        
        <div className="flex items-center mt-2 text-white/70 text-sm">
          <span>{video.channelTitle}</span>
          <span className="mx-2">•</span>
          <span>{formatPublishedDate(video.publishedAt)}</span>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
          <a 
            href={`https://youtube.com/watch?v=${video.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <ExternalLink size={16} />
            <span>Watch on YouTube</span>
          </a>
          
          <button
            onClick={() => !saved && addToSavedIdeas(video)}
            className={`cyber-btn py-1 px-3 text-sm flex items-center gap-1 ${
              saved ? 'opacity-70 cursor-default' : ''
            }`}
            disabled={saved}
          >
            {saved ? (
              <>
                <CheckCircle size={16} />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark size={16} />
                <span>Save Idea</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendCard;