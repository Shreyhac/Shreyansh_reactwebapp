import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Toaster: React.FC = () => {
  const { notifications, dismissNotification } = useAppContext();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-md shadow-lg flex items-center min-w-[300px] max-w-md backdrop-blur-lg ${
              notification.type === 'success'
                ? 'bg-secondary/20 border border-secondary/50 shadow-glow'
                : notification.type === 'error'
                ? 'bg-accent/20 border border-accent/50 shadow-glow-accent'
                : 'bg-primary/20 border border-primary/30'
            }`}
          >
            <div className="mr-3">
              {notification.type === 'success' ? (
                <Check className="text-secondary" size={20} />
              ) : notification.type === 'error' ? (
                <X className="text-accent" size={20} />
              ) : (
                <Info className="text-white" size={20} />
              )}
            </div>
            <div className="flex-1">{notification.message}</div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="ml-2 text-white/70 hover:text-white"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};