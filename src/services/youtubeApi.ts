import axios from 'axios';
import { VideoData, YoutubeApiResponse } from '../types';

// Use environment variable for API key
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyCKhcazqpw94FBC1lblkwwmIG39pYw_McI';
const API_URL = 'https://www.googleapis.com/youtube/v3';

const validateRegionCode = (regionCode: string): boolean => {
  // List of valid YouTube region codes
  const validRegionCodes = ['US', 'GB', 'DE', 'FR', 'CA', 'JP', 'IN', 'BR', 'RU', 'MX', 'AU'];
  return validRegionCodes.includes(regionCode);
};

export async function fetchTrendingVideos(regionCode = 'US', category = '', maxResults = 20): Promise<VideoData[]> {
  try {
    // Validate region code
    if (!validateRegionCode(regionCode)) {
      throw new Error(`Invalid region code: ${regionCode}`);
    }

    // Validate maxResults
    if (maxResults < 1 || maxResults > 50) {
      maxResults = 20; // Reset to default if invalid
    }

    // First, get the trending video IDs
    const videosResponse = await axios.get<YoutubeApiResponse>(`${API_URL}/videos`, {
      params: {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        regionCode,
        videoCategoryId: category || undefined,
        maxResults,
        key: API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });

    if (!videosResponse.data.items || !Array.isArray(videosResponse.data.items)) {
      throw new Error('Invalid response format from YouTube API');
    }

    return videosResponse.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      viewCount: item.statistics.viewCount,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('Invalid request parameters or API key');
      } else if (error.response?.status === 403) {
        throw new Error('YouTube API quota exceeded or invalid API key');
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later');
      }
    }
    console.error('Error fetching trending videos:', error);
    throw new Error('Failed to fetch trending videos. Please check your API key and try again');
  }
}

export async function fetchVideoCategories(regionCode = 'US'): Promise<{ id: string; title: string }[]> {
  try {
    const response = await axios.get(`${API_URL}/videoCategories`, {
      params: {
        part: 'snippet',
        regionCode,
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
    }));
  } catch (error) {
    console.error('Error fetching video categories:', error);
    throw new Error('Failed to fetch video categories');
  }
}

export async function searchVideos(query: string, maxResults = 10): Promise<VideoData[]> {
  try {
    // First search for videos
    const searchResponse = await axios.get(`${API_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: API_KEY,
      },
    });

    // Get video IDs
    const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId).join(',');

    // Then get full video details including statistics
    const videosResponse = await axios.get<YoutubeApiResponse>(`${API_URL}/videos`, {
      params: {
        part: 'snippet,statistics',
        id: videoIds,
        key: API_KEY,
      },
    });

    return videosResponse.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      viewCount: item.statistics.viewCount,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('Error searching videos:', error);
    throw new Error('Failed to search videos');
  }
}