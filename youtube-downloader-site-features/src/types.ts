export interface VideoInfo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  description: string;
  uploadDate: string;
  likes: string;
  subscribers: string;
}

export interface VideoFormat {
  id: string;
  quality: string;
  format: string;
  size: string;
  fps?: string;
  codec?: string;
  available: boolean;
}

export interface AudioFormat {
  id: string;
  quality: string;
  format: string;
  bitrate: string;
  size: string;
  available: boolean;
}

export interface TranscriptEntry {
  time: string;
  text: string;
}

export interface TranscriptInfo {
  language: string;
  available: boolean;
  entries?: TranscriptEntry[];
}

export type ThemeMode = 'light' | 'dark';
