import React, { useState } from 'react';
import { Search, Link2, Loader2, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';
import { cn } from '../utils/cn';

interface SearchBarProps {
  theme: ThemeMode;
  onSearch: (url: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ theme, onSearch, isLoading }) => {
  const [url, setUrl] = useState('');
  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSearch(url.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      // Clipboard access denied
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Text */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" />
          <span className={cn('text-xs font-semibold', isDark ? 'text-primary-300' : 'text-primary-600')}>
            Free & Unlimited Downloads
          </span>
        </div>
        <h2 className={cn(
          'text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight',
          isDark ? 'text-white' : 'text-dark-900'
        )}>
          Download YouTube Videos
          <br />
          <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            In Any Format & Quality
          </span>
        </h2>
        <p className={cn(
          'text-lg max-w-2xl mx-auto',
          isDark ? 'text-dark-400' : 'text-dark-500'
        )}>
          Paste a YouTube video URL below to download videos, audio, and transcripts.
          Supports MP4, WEBM, MP3, FLAC, and more.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className={cn(
          'relative flex items-center rounded-2xl border-2 transition-all duration-300 shadow-xl',
          isDark
            ? 'bg-dark-800 border-dark-600 focus-within:border-primary-500 focus-within:shadow-primary-500/20'
            : 'bg-white border-dark-200 focus-within:border-primary-500 focus-within:shadow-primary-500/20',
          isLoading && 'animate-pulse-glow'
        )}>
          <div className="pl-5 pr-2">
            <Link2 className={cn('w-5 h-5', isDark ? 'text-dark-500' : 'text-dark-400')} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube video URL here..."
            className={cn(
              'flex-1 py-4 px-2 text-base bg-transparent outline-none placeholder:text-dark-400',
              isDark ? 'text-white' : 'text-dark-900'
            )}
            disabled={isLoading}
          />
          <div className="flex items-center gap-2 pr-3">
            <button
              type="button"
              onClick={handlePaste}
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all',
                isDark
                  ? 'text-dark-400 hover:text-primary-400 hover:bg-dark-700'
                  : 'text-dark-500 hover:text-primary-600 hover:bg-primary-50'
              )}
            >
              Paste
            </button>
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-300',
                'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Supported platforms */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        {['YouTube', 'YouTube Shorts', 'YouTube Music', 'YouTube Live'].map((platform) => (
          <span
            key={platform}
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full',
              isDark ? 'bg-dark-800 text-dark-400' : 'bg-dark-100 text-dark-500'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {platform}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
