export interface VideoData {
  id: string;
  title: string;
  channelTitle: string;
  viewCount: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export interface ThumbnailData {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
}

export interface ShortVideoData {
  id: string;
  title: string;
  originalVideoUrl: string;
  shortVideoUrl: string;
  duration: number;
  createdAt: string;
}

export interface YoutubeApiResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        high: {
          url: string;
        };
      };
    };
    statistics: {
      viewCount: string;
    };
  }[];
}