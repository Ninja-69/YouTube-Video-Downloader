
export enum AppView {
  DOWNLOADER = 'DOWNLOADER',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY',
  IMAGE_GENERATOR = 'IMAGE_GENERATOR'
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}

export interface VideoInfo {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
}

export interface DownloadHistoryItem {
  id: string;
  youtubeId: string;
  title: string;
  thumbnail: string;
  timestamp: number;
}

// Response from your VPS
export interface VpsResponse {
  success: boolean;
  download_url?: string;
  error?: string;
  meta?: {
    title?: string;
    duration?: string;
  }
}
