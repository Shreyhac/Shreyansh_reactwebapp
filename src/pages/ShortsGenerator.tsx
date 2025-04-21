import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import VideoUploader from '../components/features/ai/VideoUploader';
import VideoShortPreview from '../components/features/ai/VideoShortPreview';
import { uploadVideo, analyzeVideo, generateShort } from '../services/shortsService';
import { sendEmail } from '../services/emailService';
import { useAppContext } from '../context/AppContext';

// ShortsGenerator page component: lets users upload videos and generate shorts
const ShortsGenerator = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shortVideoUrl, setShortVideoUrl] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [transcriptText, setTranscriptText] = useState<string>('');
  
  const { addNotification } = useAppContext();

  // Handles the video file upload and short generation process
  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setProcessingProgress(0);
    setProcessingStage('Uploading video...');
    setShortVideoUrl(null);
    
    try {
      
      const uploadUrl = await uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setIsUploading(false);
      setIsProcessing(true);
      setProcessingStage('Analyzing video content...');
      setProcessingProgress(10);
      
      
      const analysisResult = await analyzeVideo(uploadUrl, (progress) => {
        setProcessingProgress(10 + progress * 0.3); 
        setProcessingStage('Analyzing video content...');
      });
      
      setProcessingProgress(40);
      setProcessingStage('Identifying highlights...');
      
      
      let transcriptTextValue = '';
      if (analysisResult && Array.isArray(analysisResult.utterances)) {
        transcriptTextValue = analysisResult.utterances.map((u: any) => u.text).join(' ');
      } else if (analysisResult && Array.isArray(analysisResult.words)) {
        transcriptTextValue = analysisResult.words.map((w: any) => w.text).join(' ');
      } else if (analysisResult && Array.isArray(analysisResult.sentences)) {
        transcriptTextValue = analysisResult.sentences.map((s: any) => s.text).join(' ');
      } else if (analysisResult && analysisResult.text) {
        transcriptTextValue = analysisResult.text;
      }
      setTranscriptText(transcriptTextValue);
      
      
      console.log('Analysis Result:', analysisResult);
      let highlights: Array<{ start: number; end: number; text: string }> = [];
      if (analysisResult && Array.isArray(analysisResult.utterances)) {
        console.log('Using utterances for highlights');
        highlights = analysisResult.utterances.map((utterance: any) => ({
          start: utterance.start / 1000,
          end: utterance.end / 1000,
          text: utterance.text,
        }));
      } else if (analysisResult && Array.isArray(analysisResult.words)) {
        console.log('Using words for highlights');
        
        let chunk = [];
        let chunkStart = null;
        for (const word of analysisResult.words) {
          if (chunkStart === null) chunkStart = word.start;
          chunk.push(word);
          if ((word.end - chunkStart) > 5000) { 
            highlights.push({
              start: chunkStart / 1000,
              end: word.end / 1000,
              text: chunk.map((w: any) => w.text).join(' ')
            });
            chunk = [];
            chunkStart = null;
          }
        }
        if (chunk.length > 0) {
          highlights.push({
            start: chunkStart / 1000,
            end: chunk[chunk.length - 1].end / 1000,
            text: chunk.map((w: any) => w.text).join(' ')
          });
        }
      } else if (analysisResult && Array.isArray(analysisResult.sentences)) {
        console.log('Using sentences for highlights');
        highlights = analysisResult.sentences.map((sentence: any) => ({
          start: sentence.start / 1000,
          end: sentence.end / 1000,
          text: sentence.text,
        }));
      } else {
        console.error('Error: No utterances, words, or sentences array found', analysisResult);
        if (analysisResult && analysisResult.audio_url) {
          console.log('AssemblyAI audio_url:', analysisResult.audio_url);
        }
        setIsProcessing(false);
        addNotification('No speech detected in the video. Please upload a video with clear spoken audio.', 'error');
        return;
      }

      
      if (!highlights.length) {
        if (analysisResult && analysisResult.audio_url) {
          console.log('AssemblyAI audio_url:', analysisResult.audio_url);
        }
        setIsProcessing(false);
        addNotification('No speech detected in the video. Please upload a video with clear spoken audio.', 'error');
        return;
      }
      
      setProcessingProgress(50);
      setProcessingStage('Generating short video...');
      
      
      const shortUrl = await generateShort(uploadUrl, highlights, (progress) => {
        setProcessingProgress(50 + progress * 0.5); 
        setProcessingStage('Generating short video...');
      });
      
      setShortVideoUrl(shortUrl);
      setProcessingProgress(100);
      setProcessingStage('Done!');
      setIsProcessing(false);
      addNotification('Short video generated successfully!', 'success');
      
      
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
  
  // Render the shorts generator page layout
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

            
            {transcriptText && (
              <div className="glass-card mt-6">
                <h3 className="text-xl font-heading mb-2">Transcript (All Spoken Text)</h3>
                <div className="text-white/80 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto border border-white/10 rounded-md p-3 bg-black/20">
                  {transcriptText}
                </div>
              </div>
            )}
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