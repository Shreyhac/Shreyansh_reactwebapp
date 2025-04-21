import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Download, RefreshCw } from 'lucide-react';
import { generateThumbnail, downloadThumbnail } from '../../../services/thumbnailService';
import { useAppContext } from '../../../context/AppContext';
import { sendEmail } from '../../../services/emailService';

interface ThumbnailFormProps {
  onGenerated: (imageUrl: string) => void;
}

const ThumbnailForm: React.FC<ThumbnailFormProps> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const { addNotification } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      addNotification('Please enter a prompt for your thumbnail', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const imageUrl = await generateThumbnail(
        `High quality YouTube thumbnail for a video about ${prompt}, 16:9 ratio, professional looking, vibrant colors, no text`
      );
      
      setGeneratedUrl(imageUrl);
      onGenerated(imageUrl);
      addNotification('Thumbnail generated successfully!', 'success');
      
      // Send email if provided
      if (email) {
        const emailSent = await sendEmail({
          to_email: email,
          subject: 'Your Thumbnail is Ready!',
          message: `Your thumbnail for "${prompt}" has been generated successfully.`,
          type: 'thumbnail',
          content_url: 'Available in the app',
        });
        
        if (emailSent) {
          addNotification('Email notification sent successfully!', 'success');
        } else {
          addNotification('Failed to send email notification', 'error');
        }
      }
    } catch (error: any) {
      console.error('Error generating thumbnail:', error);
      addNotification(error.message || 'Failed to generate thumbnail. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedUrl) {
      downloadThumbnail(generatedUrl, `thumbnail-${Date.now()}.png`);
      addNotification('Thumbnail downloaded successfully!', 'success');
    }
  };

  return (
    <div className="glass-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block mb-2 text-white">
            Describe your video content
          </label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Tech video about AI, Gaming tutorial for Minecraft..."
            className="w-full p-3 rounded-md bg-black/30 border border-white/20 text-white placeholder:text-white/50 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-2 text-white">
            Email for notification (optional)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full p-3 rounded-md bg-black/30 border border-white/20 text-white placeholder:text-white/50 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex-1 cyber-btn flex items-center justify-center gap-2 py-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} />
                <span>Generate Thumbnail</span>
              </>
            )}
          </motion.button>
          
          {generatedUrl && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleDownload}
              className="accent-btn flex items-center justify-center gap-2 py-3"
            >
              <Download size={20} />
              <span>Download</span>
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ThumbnailForm;