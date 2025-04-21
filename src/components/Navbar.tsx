import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Youtube, Image, Video, BookmarkPlus, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const links = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/youtube-trends', label: 'YouTube Trends', icon: <Youtube size={20} /> },
    { to: '/thumbnail-studio', label: 'Thumbnail Studio', icon: <Image size={20} /> },
    { to: '/shorts-generator', label: 'Shorts Generator', icon: <Video size={20} /> },
    { to: '/saved-ideas', label: 'Saved Ideas', icon: <BookmarkPlus size={20} /> },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-primary sticky top-0 z-50 px-4 py-4 shadow-md border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-heading font-bold text-white">
            Content<span className="text-secondary">Craft</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-300 ${
                location.pathname === link.to
                  ? 'bg-black/30 border-l-2 border-secondary shadow-glow'
                  : 'hover:bg-black/20'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden cyber-btn py-1 px-2" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col space-y-2 py-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={`flex items-center gap-2 py-3 px-4 rounded-md transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'bg-black/30 border-l-2 border-secondary shadow-glow'
                      : 'hover:bg-black/20'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;