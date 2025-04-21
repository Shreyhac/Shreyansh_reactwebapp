import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Youtube, Image, Video, BookmarkPlus } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Youtube size={48} className="text-white mb-4" />,
      title: 'YouTube Trend Analyzer',
      description: "Discover what's trending on YouTube and save ideas for your next video.",
      link: '/youtube-trends',
      color: 'from-blue-600/20 to-purple-600/20',
    },
    {
      icon: <Image size={48} className="text-white mb-4" />,
      title: 'Thumbnail Studio',
      description: 'Generate eye-catching thumbnails with AI to increase your click-through rate.',
      link: '/thumbnail-studio',
      color: 'from-green-600/20 to-teal-600/20',
    },
    {
      icon: <Video size={48} className="text-white mb-4" />,
      title: 'Shorts Generator',
      description: 'Create engaging short-form videos by extracting the best parts of your content.',
      link: '/shorts-generator',
      color: 'from-red-600/20 to-orange-600/20',
    },
    {
      icon: <BookmarkPlus size={48} className="text-white mb-4" />,
      title: 'Saved Ideas',
      description: 'Access your collection of saved video ideas, thumbnails, and shorts.',
      link: '/saved-ideas',
      color: 'from-purple-600/20 to-pink-600/20',
    },
  ];

  return (
    <div>
      <div className="w-full text-center py-2 text-lg font-heading text-secondary tracking-wider bg-black/30 rounded-b-lg mb-4">
        Made by Shreyansh Arora 24BCS10252
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card text-center mb-12 py-16"
      >
        <h1 className="text-4xl md:text-5xl font-heading mb-4">
          <span className="text-white">Content</span>
          <span className="text-secondary">Craft</span>
          <span className="text-white"> AI Suite</span>
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">
          Elevate your content creation workflow with AI-powered tools designed to help you analyze trends, 
          generate thumbnails, and create engaging short-form videos.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/youtube-trends" className="cyber-btn px-6 py-3">
            Explore Trends
          </Link>
          <Link to="/thumbnail-studio" className="accent-btn px-6 py-3">
            Create Thumbnails
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link 
              to={feature.link} 
              className="block h-full"
            >
              <div className={`glass-card h-full bg-gradient-to-br ${feature.color} hover:shadow-[0_0_15px_rgba(49,236,86,0.3)] transition-all duration-300 hover:scale-[1.02]`}>
                <div className="text-center p-6">
                  {feature.icon}
                  <h2 className="text-2xl font-heading mb-3">{feature.title}</h2>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;