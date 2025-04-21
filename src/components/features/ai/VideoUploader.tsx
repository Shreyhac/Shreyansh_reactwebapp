import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileVideo, X, RefreshCw } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  onFileSelect, 
  isUploading,
  uploadProgress 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useAppContext();

  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      addNotification('Please select a valid video file (MP4, MOV, AVI, or WebM)', 'error');
      return false;
    }
    
    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      addNotification('File size exceeds 100MB limit', 'error');
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="glass-card">
      <h3 className="text-xl font-heading mb-4">Upload Video</h3>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-secondary bg-secondary/10' 
            : 'border-white/20 hover:border-white/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!selectedFile && !isUploading ? triggerFileSelect : undefined}
        style={{ cursor: !selectedFile && !isUploading ? 'pointer' : 'default' }}
      >
        {isUploading ? (
          <div>
            <RefreshCw size={48} className="mx-auto mb-4 text-secondary animate-spin" />
            <p className="text-white mb-2">Uploading video...</p>
            <div className="w-full bg-black/50 rounded-full h-4 mt-4">
              <motion.div 
                className="bg-secondary h-4 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-white/70 text-sm mt-2">{uploadProgress}% complete</p>
          </div>
        ) : selectedFile ? (
          <div>
            <FileVideo size={48} className="mx-auto mb-4 text-secondary" />
            <p className="text-white mb-2">{selectedFile.name}</p>
            <p className="text-white/70 text-sm">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <button 
              onClick={handleRemoveFile}
              className="mt-4 accent-btn py-2 px-4"
            >
              <X size={16} className="mr-2" />
              Remove file
            </button>
          </div>
        ) : (
          <div>
            <Upload size={48} className="mx-auto mb-4 text-white/50" />
            <p className="text-white mb-2">Drag and drop your video here</p>
            <p className="text-white/50 text-sm">or click to browse files</p>
            <p className="text-white/30 text-xs mt-4">
              Supported formats: MP4, MOV, AVI, WebM (max 100MB)
            </p>
          </div>
        )}
      </div>
      
      {selectedFile && !isUploading && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="cyber-btn w-full mt-4 py-3 flex items-center justify-center gap-2"
          onClick={() => onFileSelect(selectedFile)}
        >
          <Upload size={20} />
          <span>Process Video</span>
        </motion.button>
      )}
    </div>
  );
};

export default VideoUploader;