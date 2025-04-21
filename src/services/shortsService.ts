import axios from 'axios';

// API keys
const ASSEMBLY_AI_KEY = import.meta.env.VITE_ASSEMBLY_AI_KEY;
const REPLICATE_KEY = import.meta.env.VITE_REPLICATE_KEY;

// Supported video formats
const SUPPORTED_FORMATS = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// Upload video to AssemblyAI
export async function uploadVideo(file: File, onProgress?: (progress: number) => void): Promise<string> {
  try {
    // Validate file format
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      throw new Error('Unsupported video format. Please upload MP4, MOV, AVI, or WebM files.');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 100MB limit.');
    }

    // Get the upload URL
    const response = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      {},
      {
        headers: {
          'Authorization': ASSEMBLY_AI_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    if (!response.data.upload_url) {
      throw new Error('Failed to get upload URL from AssemblyAI');
    }

    const uploadUrl = response.data.upload_url;

    // Upload the file using XMLHttpRequest for progress tracking
    const uploadPromise = new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(uploadUrl);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.timeout = 60000; // 60 second timeout for large files
      // Set the correct Content-Type header for the file upload
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });

    return uploadPromise;
  } catch (error: any) {
    console.error('Error uploading video:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timed out. Please check your internet connection.');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your AssemblyAI credentials.');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid request format. Please ensure you are uploading a valid video file.');
      }
    }
    throw new Error(error.message || 'Failed to upload video');
  }
}

// Analyze video for highlights using AssemblyAI
export async function analyzeVideo(audioUrl: string, onProgress?: (progress: number) => void): Promise<any> {
  try {
    // Create transcription request
    const transcriptResponse = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      {
        audio_url: audioUrl,
        sentiment_analysis: true,
        entity_detection: true,
        summarization: true,
      },
      {
        headers: {
          'Authorization': ASSEMBLY_AI_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (!transcriptResponse.data.id) {
      throw new Error('Failed to start transcription');
    }

    const transcriptId = transcriptResponse.data.id;
    let retries = 0;
    const maxRetries = 30; // 5 minutes maximum waiting time
    const pollingInterval = 10000; // 10 seconds

    // Poll for completion
    while (retries < maxRetries) {
      const pollingResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            'Authorization': ASSEMBLY_AI_KEY,
          },
          timeout: 10000,
        }
      );

      const status = pollingResponse.data.status;

      if (status === 'completed') {
        return pollingResponse.data;
      } else if (status === 'error') {
        throw new Error(pollingResponse.data.error || 'Transcription failed');
      } else {
        // Update progress if available
        if (onProgress && pollingResponse.data.percent_complete) {
          onProgress(pollingResponse.data.percent_complete);
        }
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
        retries++;
      }
    }
    
    throw new Error('Analysis timed out. Please try again with a shorter video.');
  } catch (error: any) {
    console.error('Error analyzing video:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your AssemblyAI credentials.');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid request format. Please check the video URL and ensure it is accessible.');
      }
    }
    throw new Error(error.message || 'Failed to analyze video');
  }
}

// Generate short video using Replicate
export async function generateShort(
  videoUrl: string, 
  highlights: { start: number; end: number; text: string }[],
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    if (!highlights || highlights.length === 0) {
      throw new Error('No highlights found in the video');
    }

    // Select the most interesting 15-second segment
    const bestHighlight = highlights[0]; // Assuming highlights are sorted by interest
    
    // Start the prediction with Replicate
    const startResponse = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'fe63569d6fe76ebd5eae2ff1ae7d8815dabcc9de2f7b30c2acce5c0f62061ed0',
        input: {
          video_url: videoUrl,
          start_time: bestHighlight.start,
          duration: Math.min(15, bestHighlight.end - bestHighlight.start),
          prompt: bestHighlight.text,
        },
      },
      {
        headers: {
          'Authorization': `Token ${REPLICATE_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (!startResponse.data.id) {
      throw new Error('Failed to start video generation');
    }

    const predictionId = startResponse.data.id;
    let retries = 0;
    const maxRetries = 30; // 5 minutes maximum waiting time
    const pollingInterval = 10000; // 10 seconds

    // Poll for completion
    while (retries < maxRetries) {
      const pollingResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${REPLICATE_KEY}`,
          },
          timeout: 10000,
        }
      );

      if (pollingResponse.data.status === 'succeeded') {
        if (!pollingResponse.data.output) {
          throw new Error('No output received from video generation');
        }
        return pollingResponse.data.output;
      } else if (pollingResponse.data.status === 'failed') {
        throw new Error(pollingResponse.data.error || 'Short generation failed');
      } else {
        // Update progress
        if (onProgress) {
          onProgress(pollingResponse.data.status === 'processing' ? 50 : 25);
        }
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
        retries++;
      }
    }

    throw new Error('Video generation timed out. Please try again.');
  } catch (error: any) {
    console.error('Error generating short:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your Replicate credentials.');
      }
      if (error.response?.status === 402) {
        throw new Error('API quota exceeded. Please try again later.');
      }
    }
    throw new Error(error.message || 'Failed to generate short video');
  }
}