import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, RefreshCw } from 'lucide-react';
import TrendCard from '../components/features/youtube/TrendCard';
import CategoryFilter from '../components/features/youtube/CategoryFilter';
import { fetchTrendingVideos, searchVideos } from '../services/youtubeApi';
import { VideoData } from '../types';
import { useAppContext } from '../context/AppContext';

const YouTubeTrends = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addNotification } = useAppContext();

  useEffect(() => {
    loadTrendingVideos();
  }, [selectedCategory]);

  const loadTrendingVideos = async () => {
    setLoading(true);
    try {
      const data = await fetchTrendingVideos('US', selectedCategory);
      setVideos(data);
    } catch (error) {
      addNotification('Failed to load trending videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      const results = await searchVideos(searchQuery);
      setVideos(results);
    } catch (error) {
      addNotification('Failed to search videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  };

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-heading flex items-center gap-2">
              <TrendingUp className="text-secondary" />
              YouTube Trends
            </h1>
            <p className="text-white/70 mt-2">
              Discover what's trending and get ideas for your next video
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for videos..."
                className="p-2 px-4 rounded-l-md bg-black/30 border border-white/20 text-white w-full md:w-64 focus:outline-none focus:border-secondary"
              />
              <button 
                type="submit" 
                className="cyber-btn rounded-l-none px-4"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        <CategoryFilter 
          onSelectCategory={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        {loading ? (
          <div className="flex items-center justify-center my-12">
            <RefreshCw size={32} className="animate-spin text-secondary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <TrendCard key={video.id} video={video} />
              ))}
            </div>
            
            {videos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-white/70">No videos found</p>
                <button 
                  onClick={loadTrendingVideos}
                  className="cyber-btn mt-4"
                >
                  Load Trending Videos
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default YouTubeTrends;