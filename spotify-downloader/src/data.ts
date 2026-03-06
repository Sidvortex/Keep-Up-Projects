import { QualityOption, Track } from './types';

export const qualityOptions: QualityOption[] = [
  { id: 'mp3-128', label: 'MP3 128kbps', format: 'MP3', bitrate: '128 kbps', size: '~3 MB/min', lossless: false },
  { id: 'mp3-192', label: 'MP3 192kbps', format: 'MP3', bitrate: '192 kbps', size: '~4.5 MB/min', lossless: false },
  { id: 'mp3-256', label: 'MP3 256kbps', format: 'MP3', bitrate: '256 kbps', size: '~6 MB/min', lossless: false },
  { id: 'mp3-320', label: 'MP3 320kbps', format: 'MP3', bitrate: '320 kbps', size: '~7.5 MB/min', lossless: false },
  { id: 'aac-256', label: 'AAC 256kbps', format: 'AAC', bitrate: '256 kbps', size: '~5.5 MB/min', lossless: false },
  { id: 'ogg-320', label: 'OGG Vorbis 320kbps', format: 'OGG', bitrate: '320 kbps', size: '~7 MB/min', lossless: false },
  { id: 'flac-lossless', label: 'FLAC (Lossless)', format: 'FLAC', bitrate: '~1411 kbps', size: '~30 MB/min', lossless: true },
  { id: 'alac-lossless', label: 'ALAC (Lossless)', format: 'ALAC', bitrate: '~1411 kbps', size: '~30 MB/min', lossless: true },
  { id: 'wav-lossless', label: 'WAV (Lossless)', format: 'WAV', bitrate: '1411 kbps', size: '~50 MB/min', lossless: true },
];

const albumCovers = [
  'https://picsum.photos/seed/album1/300/300',
  'https://picsum.photos/seed/album2/300/300',
  'https://picsum.photos/seed/album3/300/300',
  'https://picsum.photos/seed/album4/300/300',
  'https://picsum.photos/seed/album5/300/300',
  'https://picsum.photos/seed/album6/300/300',
  'https://picsum.photos/seed/album7/300/300',
  'https://picsum.photos/seed/album8/300/300',
  'https://picsum.photos/seed/album9/300/300',
  'https://picsum.photos/seed/album10/300/300',
];

const artists = [
  'Arctic Monkeys', 'Tame Impala', 'Dua Lipa', 'The Weeknd', 'Billie Eilish',
  'Kendrick Lamar', 'Taylor Swift', 'Drake', 'SZA', 'Tyler, the Creator',
  'Frank Ocean', 'Radiohead', 'Daft Punk', 'Gorillaz', 'Mac DeMarco'
];

const albums = [
  'Midnight Echoes', 'Neon Dreams', 'Golden Hour', 'Starlight', 'Afterglow',
  'Velocity', 'Crystal Clear', 'Ocean Drive', 'Lunar Phase', 'Electric Soul'
];

const songTitles = [
  'Midnight Rain', 'Electric Dreams', 'Fading Light', 'Ocean Eyes', 'Starfire',
  'Neon Pulse', 'Golden Sunset', 'Crystal Waves', 'Shadow Dance', 'Lunar Eclipse',
  'Velvet Sky', 'Iron Heart', 'Silver Lining', 'Crimson Tide', 'Emerald City',
  'Phantom Touch', 'Solar Flare', 'Arctic Wind', 'Thunder Road', 'Wildflower',
  'Paper Planes', 'Digital Love', 'Burning Gold', 'Silent Storm', 'Paradise Lost',
  'Gravity Falls', 'Echoes', 'Interstellar', 'Supernova', 'Twilight Zone',
  'Blue Monday', 'Feel Good Inc', 'Karma Police', 'Bohemian Rhapsody', 'Hotel California',
  'Stairway to Heaven', 'Lose Yourself', 'Purple Rain', 'Sweet Child', 'Paint it Black'
];

function randomDuration(): string {
  const min = Math.floor(Math.random() * 4) + 2;
  const sec = Math.floor(Math.random() * 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function generateMockTracks(count: number): Track[] {
  const tracks: Track[] = [];
  for (let i = 0; i < count; i++) {
    tracks.push({
      id: `track-${i}-${Date.now()}`,
      title: songTitles[i % songTitles.length] + (i >= songTitles.length ? ` (${Math.floor(i / songTitles.length) + 1})` : ''),
      artist: artists[Math.floor(Math.random() * artists.length)],
      album: albums[Math.floor(Math.random() * albums.length)],
      duration: randomDuration(),
      cover: albumCovers[Math.floor(Math.random() * albumCovers.length)],
      selected: true,
    });
  }
  return tracks;
}
