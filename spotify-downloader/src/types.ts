export type AudioQuality = 
  | 'mp3-128'
  | 'mp3-192'
  | 'mp3-256'
  | 'mp3-320'
  | 'aac-256'
  | 'ogg-320'
  | 'flac-lossless'
  | 'alac-lossless'
  | 'wav-lossless';

export interface QualityOption {
  id: AudioQuality;
  label: string;
  format: string;
  bitrate: string;
  size: string;
  lossless: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  selected: boolean;
}

export interface DownloadItem {
  id: string;
  title: string;
  artist: string;
  cover: string;
  progress: number;
  status: 'queued' | 'downloading' | 'completed' | 'failed';
  quality: string;
  size: string;
}

export type ContentType = 'track' | 'playlist' | 'album' | 'unknown';
