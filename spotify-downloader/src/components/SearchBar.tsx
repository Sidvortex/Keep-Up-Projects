import React, { useState } from 'react';
import { Search, Link2, Loader2, AlertCircle } from 'lucide-react';
import { ContentType } from '../types';

interface SearchBarProps {
  onSearch: (url: string, type: ContentType) => void;
  isLoading: boolean;
}

function detectContentType(url: string): ContentType {
  if (url.includes('/track/')) return 'track';
  if (url.includes('/playlist/')) return 'playlist';
  if (url.includes('/album/')) return 'album';
  return 'unknown';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a Spotify URL');
      return;
    }
    if (!url.includes('spotify.com') && !url.includes('spotify:')) {
      setError('Please enter a valid Spotify URL');
      return;
    }
    setError('');
    const type = detectContentType(url);
    onSearch(url, type);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch {
      // Clipboard access denied
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-400">
            <Link2 className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="Paste Spotify URL here (track, album, or playlist)..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-36 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm sm:text-base"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Paste
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{isLoading ? 'Fetching...' : 'Fetch'}</span>
            </button>
          </div>
        </div>
      </form>
      
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
        <span>Supported:</span>
        <button
          type="button"
          onClick={() => { setUrl('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT'); setError(''); }}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-green-500/30 hover:text-green-400 transition-all cursor-pointer"
        >
          🎵 Single Track
        </button>
        <button
          type="button"
          onClick={() => { setUrl('https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv'); setError(''); }}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-green-500/30 hover:text-green-400 transition-all cursor-pointer"
        >
          💿 Album
        </button>
        <button
          type="button"
          onClick={() => { setUrl('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'); setError(''); }}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-green-500/30 hover:text-green-400 transition-all cursor-pointer"
        >
          📋 Playlist (up to 500)
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
