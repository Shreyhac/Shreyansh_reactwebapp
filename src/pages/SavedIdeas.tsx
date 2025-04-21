import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus, Trash2, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SavedIdeas = () => {
  const { savedIdeas, removeFromSavedIdeas } = useAppContext();

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
            <BookmarkPlus className="text-secondary" />
            Saved Ideas
          </h1>
          <p className="text-white/70 mt-2">
            Access your collection of saved video ideas for future content creation
          </p>
        </div>

        {savedIdeas.length === 0 ? (
          <div className="glass-card text-center py-12">
            <BookmarkPlus size={48} className="mx-auto mb-4 text-white/30" />
            <h2 className="text-2xl font-heading mb-3">No saved ideas yet</h2>
            <p className="text-white/70 mb-6">
              Browse trending videos and save the ones that inspire you for your next content
            </p>
            <a href="/youtube-trends" className="cyber-btn px-6 py-3">
              Explore Trending Videos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedIdeas.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                layout
                className="glass-card"
              >
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-heading text-lg line-clamp-2 mb-2">{video.title}</h3>
                <p className="text-white/70 text-sm mb-4">{video.channelTitle}</p>
                
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
                    onClick={() => removeFromSavedIdeas(video.id)}
                    className="accent-btn py-1 px-3 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SavedIdeas;