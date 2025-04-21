import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import VideoUploader from '../components/features/ai/VideoUploader';
import VideoShortPreview from '../components/features/ai/VideoShortPreview';
import { uploadVideo, analyzeVideo, generateShort } from '../services/shortsService';
import { sendEmail } from '../services/emailService';
import { useAppContext } from '../context/AppContext';

const ShortsGenerator = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shortVideoUrl, setShortVideoUrl] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  
  const { addNotification } = useAppContext();

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setProcessingProgress(0);
    setProcessingStage('Uploading video...');
    setShortVideoUrl(null);
    
    try {
      // Upload the video
      const uploadUrl = await uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setIsUploading(false);
      setIsProcessing(true);
      setProcessingStage('Analyzing video content...');
      setProcessingProgress(10);
      
      // Analyze the video
      const analysisResult = await analyzeVideo(uploadUrl, (progress) => {
        setProcessingProgress(10 + progress * 0.3); // 10-40% progress
        setProcessingStage('Analyzing video content...');
      });
      
      setProcessingProgress(40);
      setProcessingStage('Identifying highlights...');
      
      // Get highlights from the analysis
      const highlights = analysisResult.sentences.map((sentence: any) => ({
        start: sentence.start / 1000, // Convert to seconds
        end: sentence.end / 1000,
        text: sentence.text,
      }));
      
      setProcessingProgress(50);
      setProcessingStage('Generating short video...');
      
      // Generate the short video
      const shortUrl = await generateShort(uploadUrl, highlights, (progress) => {
        setProcessingProgress(50 + progress * 0.5); // 50-100% progress
        setProcessingStage('Generating short video...');
      });
      
      setShortVideoUrl(shortUrl);
      setProcessingProgress(100);
      setProcessingStage('Done!');
      setIsProcessing(false);
      addNotification('Short video generated successfully!', 'success');
      
      // Send email notification if provided
      if (emailInput) {
        await sendEmail({
          to_email: emailInput,
          subject: 'Your Short Video is Ready!',
          message: 'Your video has been successfully processed and the short is ready to download.',
          type: 'short',
          content_url: shortUrl,
        });
        addNotification('Email notification sent!', 'success');
      }
      
    } catch (error) {
      console.error('Error processing video:', error);
      setIsUploading(false);
      setIsProcessing(false);
      addNotification('Failed to process video. Please try again.', 'error');
    }
  };
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-heading flex items-center gap-2">
            <Video className="text-secondary" />
            Shorts Generator
          </h1>
          <p className="text-white/70 mt-2">
            Create engaging short-form videos by extracting the most interesting parts of your content
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <VideoUploader 
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
            
            <div className="glass-card mt-6">
              <h3 className="text-xl font-heading mb-4">Email Notification</h3>
              <p className="text-white/70 mb-4 text-sm">
                Enter your email to receive a notification when your short video is ready
              </p>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 rounded-md bg-black/30 border border-white/20 text-white placeholder:text-white/50 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                disabled={isProcessing || isUploading}
              />
            </div>
          </div>
          
          <div className="h-full">
            <VideoShortPreview
              videoUrl={shortVideoUrl}
              isProcessing={isUploading || isProcessing}
              processingProgress={isUploading ? uploadProgress : processingProgress}
              processingStage={processingStage}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShortsGenerator;