import axios from 'axios';

const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function generateThumbnail(prompt: string, retryCount = 0): Promise<string> {
  try {
    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, low quality, distorted, text, watermark",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 1280,
          height: 720
        },
        options: {
          wait_for_model: true,
          use_cache: true
        }
      },
      responseType: 'arraybuffer',
      timeout: 30000 // 30 second timeout
    });

    // Convert the image buffer to base64 (browser compatible)
    const base64Image = arrayBufferToBase64(response.data);
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error: any) {
    console.error('Error generating thumbnail:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 503 && retryCount < MAX_RETRIES) {
      // Model is loading, implement exponential backoff
      const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      await wait(retryDelay);
      return generateThumbnail(prompt, retryCount + 1);
    }

    if (error.response?.status === 503) {
      throw new Error('Model is currently unavailable. Please try again in a few moments.');
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The server might be experiencing high load.');
    }

    if (axios.isAxiosError(error) && !error.response) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }

    throw new Error('Failed to generate thumbnail. Please try again.');
  }
}

export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

export function downloadThumbnail(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}