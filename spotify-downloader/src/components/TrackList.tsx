import React, { useState } from 'react';
import { Check, Image, Clock, Music2, CheckCheck, XCircle, Search } from 'lucide-react';
import { Track } from '../types';
import { cn } from '../utils/cn';

interface TrackListProps {
  tracks: Track[];
  onToggleTrack: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  contentType: string;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, onToggleTrack, onSelectAll, onDeselectAll, contentType }) => {
  const [filter, setFilter] = useState('');
  const selectedCount = tracks.filter(t => t.selected).length;
  
  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(filter.toLowerCase()) ||
    t.artist.toLowerCase().includes(filter.toLowerCase()) ||
    t.album.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Music2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {contentType === 'track' ? 'Track' : contentType === 'album' ? 'Album' : 'Playlist'}
              </h3>
              <p className="text-xs text-gray-500">
                {selectedCount} of {tracks.length} tracks selected
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Select All
            </button>
            <button
              onClick={onDeselectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              <XCircle className="w-3.5 h-3.5" />
              Deselect All
            </button>
          </div>
        </div>
        
        {tracks.length > 5 && (
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter tracks..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/30 transition-all"
            />
          </div>
        )}
      </div>

      {/* Track list */}
      <div className="max-h-[500px] overflow-y-auto">
        {filteredTracks.map((track, index) => (
          <div
            key={track.id}
            onClick={() => onToggleTrack(track.id)}
            className={cn(
              "group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 cursor-pointer transition-all border-b border-white/[0.03] last:border-b-0",
              track.selected
                ? "bg-green-500/[0.05] hover:bg-green-500/[0.08]"
                : "hover:bg-white/[0.03] opacity-50"
            )}
          >
            {/* Checkbox */}
            <div className={cn(
              "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
              track.selected
                ? "bg-green-500 border-green-500"
                : "border-gray-600 group-hover:border-gray-400"
            )}>
              {track.selected ? <Check className="w-3 h-3 text-white" /> : null}
            </div>

            {/* Number */}
            <span className="text-xs text-gray-600 w-6 text-right shrink-0">{index + 1}</span>

            {/* Cover */}
            <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden shrink-0 relative group/img">
              <img
                src={track.cover}
                alt={track.album}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <Image className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{track.title}</div>
              <div className="text-xs text-gray-500 truncate">{track.artist} • {track.album}</div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
              <Clock className="w-3 h-3" />
              {track.duration}
            </div>
          </div>
        ))}
      </div>

      {filteredTracks.length === 0 && filter && (
        <div className="px-6 py-12 text-center text-gray-500 text-sm">
          No tracks match "{filter}"
        </div>
      )}
    </div>
  );
};

export default TrackList;
