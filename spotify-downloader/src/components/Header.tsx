import React from 'react';
import { Music, Download, Disc3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden border-b border-white/10">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-500/10 to-green-600/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Disc3 className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Spot<span className="text-green-400">Down</span>
              </h1>
              <p className="text-xs text-gray-400 tracking-wide">Spotify Music Downloader</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-green-400" />
              <span>Songs & Playlists</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-green-400" />
              <span>Multiple Formats</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
