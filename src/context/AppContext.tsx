import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoData } from '../types';

interface IAppContext {
  savedIdeas: VideoData[];
  addToSavedIdeas: (video: VideoData) => void;
  removeFromSavedIdeas: (videoId: string) => void;
  isVideoSaved: (videoId: string) => boolean;
  notifications: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIdeas, setSavedIdeas] = useState<VideoData[]>(() => {
    const saved = localStorage.getItem('savedIdeas');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  useEffect(() => {
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  const addToSavedIdeas = (video: VideoData) => {
    if (!savedIdeas.some(item => item.id === video.id)) {
      setSavedIdeas(prev => [...prev, video]);
      addNotification(`Added "${video.title}" to saved ideas`, 'success');
    }
  };

  const removeFromSavedIdeas = (videoId: string) => {
    setSavedIdeas(prev => prev.filter(item => item.id !== videoId));
    addNotification('Removed from saved ideas', 'info');
  };

  const isVideoSaved = (videoId: string) => {
    return savedIdeas.some(item => item.id === videoId);
  };

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(note => note.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        savedIdeas,
        addToSavedIdeas,
        removeFromSavedIdeas,
        isVideoSaved,
        notifications,
        addNotification,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};