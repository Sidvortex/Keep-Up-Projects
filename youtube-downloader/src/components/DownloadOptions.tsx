import React, { useState } from 'react';
import {
  Video, Music, Download, Check, X, Film, Headphones,
  ChevronDown, ChevronUp, Shield, Zap, HardDrive
} from 'lucide-react';
import { VideoFormat, AudioFormat, ThemeMode } from '../types';
import { cn } from '../utils/cn';

interface DownloadOptionsProps {
  videoFormats: VideoFormat[];
  audioFormats: AudioFormat[];
  theme: ThemeMode;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ videoFormats, audioFormats, theme }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2500);
  };

  const availableVideo = videoFormats.filter(f => f.available);
  const unavailableVideo = videoFormats.filter(f => !f.available);
  const availableAudio = audioFormats.filter(f => f.available);
  const unavailableAudio = audioFormats.filter(f => !f.available);

  const displayedVideo = showAll ? availableVideo : availableVideo.slice(0, 5);
  const displayedAudio = showAll ? availableAudio : availableAudio.slice(0, 5);

  const getQualityBadge = (quality: string) => {
    if (quality.includes('4K') || quality.includes('2160')) return { label: '4K', color: 'from-yellow-500 to-orange-500' };
    if (quality.includes('2K') || quality.includes('1440')) return { label: '2K', color: 'from-purple-500 to-pink-500' };
    if (quality.includes('FHD') || quality.includes('1080')) return { label: 'FHD', color: 'from-primary-500 to-primary-600' };
    if (quality.includes('HD') || quality.includes('720')) return { label: 'HD', color: 'from-green-500 to-emerald-500' };
    if (quality === 'Ultra High') return { label: 'HiFi', color: 'from-yellow-500 to-orange-500' };
    if (quality === 'High') return { label: 'HQ', color: 'from-primary-500 to-primary-600' };
    return null;
  };

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden transition-all duration-300',
      isDark ? 'bg-dark-800/60 border-dark-700/50' : 'bg-white border-dark-200/50',
      'glass-card shadow-xl'
    )}>
      {/* Tab Header */}
      <div className={cn(
        'flex border-b',
        isDark ? 'border-dark-700/50' : 'border-dark-200/50'
      )}>
        {[
          { id: 'video' as const, icon: Video, label: 'Video', count: videoFormats.length },
          { id: 'audio' as const, icon: Music, label: 'Audio', count: audioFormats.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowAll(false); }}
            className={cn(
              'flex-1 flex items-center justify-center gap-2.5 py-4 text-sm font-semibold transition-all duration-300 relative',
              activeTab === tab.id
                ? isDark ? 'text-primary-400' : 'text-primary-600'
                : isDark ? 'text-dark-400 hover:text-dark-300' : 'text-dark-500 hover:text-dark-600'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
              activeTab === tab.id
                ? 'bg-primary-500/20 text-primary-400'
                : isDark ? 'bg-dark-700 text-dark-400' : 'bg-dark-100 text-dark-500'
            )}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500" />
            )}
          </button>
        ))}
      </div>

      {/* Info Bar */}
      <div className={cn(
        'flex items-center gap-6 px-6 py-3 text-xs border-b',
        isDark ? 'bg-dark-800/80 border-dark-700/30 text-dark-400' : 'bg-dark-50/80 border-dark-100 text-dark-500'
      )}>
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500" /> Virus Free</span>
        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500" /> Fast Download</span>
        <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-primary-500" /> No Limit</span>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-3">
        {activeTab === 'video' ? (
          <>
            {/* Video Header */}
            <div className={cn(
              'grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider',
              isDark ? 'text-dark-500' : 'text-dark-400'
            )}>
              <span className="col-span-3">Quality</span>
              <span className="col-span-2">Format</span>
              <span className="col-span-2">Codec</span>
              <span className="col-span-1">FPS</span>
              <span className="col-span-2">Size</span>
              <span className="col-span-2"></span>
            </div>

            {/* Available Video */}
            {displayedVideo.map((format) => {
              const badge = getQualityBadge(format.quality);
              return (
                <div
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={cn(
                    'grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 border',
                    selectedFormat === format.id
                      ? isDark
                        ? 'bg-primary-500/10 border-primary-500/30'
                        : 'bg-primary-50 border-primary-200'
                      : isDark
                        ? 'bg-dark-700/30 border-transparent hover:bg-dark-700/60'
                        : 'bg-dark-50/50 border-transparent hover:bg-dark-100'
                  )}
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <Film className={cn('w-4 h-4 flex-shrink-0', isDark ? 'text-primary-400' : 'text-primary-500')} />
                    <span className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-dark-900')}>
                      {format.quality}
                    </span>
                    {badge && (
                      <span className={cn(
                        'text-[9px] font-bold px-1.5 py-0.5 rounded text-white bg-gradient-to-r',
                        badge.color
                      )}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <span className={cn('col-span-2 text-xs font-medium', isDark ? 'text-dark-300' : 'text-dark-600')}>
                    {format.format}
                  </span>
                  <span className={cn('col-span-2 text-xs', isDark ? 'text-dark-400' : 'text-dark-500')}>
                    {format.codec}
                  </span>
                  <span className={cn('col-span-1 text-xs', isDark ? 'text-dark-400' : 'text-dark-500')}>
                    {format.fps}
                  </span>
                  <span className={cn('col-span-2 text-xs font-medium', isDark ? 'text-dark-300' : 'text-dark-600')}>
                    {format.size}
                  </span>
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(format.id); }}
                      disabled={downloading === format.id}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all',
                        downloading === format.id
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-sm'
                      )}
                    >
                      {downloading === format.id ? (
                        <><Check className="w-3.5 h-3.5" /> Done</>
                      ) : (
                        <><Download className="w-3.5 h-3.5" /> Get</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {availableVideo.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className={cn(
                  'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isDark ? 'text-primary-400 hover:bg-dark-700/50' : 'text-primary-600 hover:bg-primary-50'
                )}
              >
                {showAll ? <><ChevronUp className="w-3.5 h-3.5" /> Show Less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show All ({availableVideo.length})</>}
              </button>
            )}

            {/* Unavailable Video */}
            {unavailableVideo.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dashed" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                <p className={cn('text-xs font-semibold mb-3 flex items-center gap-1.5', isDark ? 'text-dark-500' : 'text-dark-400')}>
                  <X className="w-3.5 h-3.5 text-red-400" /> Unavailable Formats
                </p>
                {unavailableVideo.map((format) => (
                  <div
                    key={format.id}
                    className={cn(
                      'grid grid-cols-12 gap-2 items-center px-4 py-2.5 rounded-xl opacity-50 mb-1.5',
                      isDark ? 'bg-dark-700/20' : 'bg-dark-50/50'
                    )}
                  >
                    <span className={cn('col-span-3 text-sm line-through', isDark ? 'text-dark-500' : 'text-dark-400')}>
                      {format.quality}
                    </span>
                    <span className={cn('col-span-2 text-xs', isDark ? 'text-dark-500' : 'text-dark-400')}>{format.format}</span>
                    <span className={cn('col-span-2 text-xs', isDark ? 'text-dark-500' : 'text-dark-400')}>{format.codec}</span>
                    <span className={cn('col-span-1 text-xs', isDark ? 'text-dark-500' : 'text-dark-400')}>{format.fps}</span>
                    <span className={cn('col-span-2 text-xs', isDark ? 'text-dark-500' : 'text-dark-400')}>{format.size}</span>
                    <div className="col-span-2 flex justify-end">
                      <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-md">N/A</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Audio Header */}
            <div className={cn(
              'grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider',
              isDark ? 'text-dark-500' : 'text-dark-400'
            )}>
              <span className="col-span-3">Quality</span>
              <span className="col-span-2">Format</span>
              <span className="col-span-3">Bitrate</span>
              <span className="col-span-2">Size</span>
              <span className="col-span-2"></span>
            </div>

            {/* Available Audio */}
            {displayedAudio.map((format) => {
              const badge = getQualityBadge(format.quality);
              return (
                <div
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={cn(
                    'grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 border',
                    selectedFormat === format.id
                      ? isDark
                        ? 'bg-primary-500/10 border-primary-500/30'
                        : 'bg-primary-50 border-primary-200'
                      : isDark
                        ? 'bg-dark-700/30 border-transparent hover:bg-dark-700/60'
                        : 'bg-dark-50/50 border-transparent hover:bg-dark-100'
                  )}
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <Headphones className={cn('w-4 h-4 flex-shrink-0', isDark ? 'text-accent-400' : 'text-accent-500')} />
                    <span className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-dark-900')}>
                      {format.quality}
                    </span>
                    {badge && (
                      <span className={cn(
                        'text-[9px] font-bold px-1.5 py-0.5 rounded text-white bg-gradient-to-r',
                        badge.color
                      )}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <span className={cn('col-span-2 text-xs font-medium', isDark ? 'text-dark-300' : 'text-dark-600')}>
                    {format.format}
                  </span>
                  <span className={cn('col-span-3 text-xs', isDark ? 'text-dark-400' : 'text-dark-500')}>
                    {format.bitrate}
                  </span>
                  <span className={cn('col-span-2 text-xs font-medium', isDark ? 'text-dark-300' : 'text-dark-600')}>
                    {format.size}
                  </span>
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(format.id); }}
                      disabled={downloading === format.id}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all',
                        downloading === format.id
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-primary-600 shadow-sm'
                      )}
                    >
                      {downloading === format.id ? (
                        <><Check className="w-3.5 h-3.5" /> Done</>
                      ) : (
                        <><Download className="w-3.5 h-3.5" /> Get</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {availableAudio.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className={cn(
                  'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isDark ? 'text-primary-400 hover:bg-dark-700/50' : 'text-primary-600 hover:bg-primary-50'
                )}
              >
                {showAll ? <><ChevronUp className="w-3.5 h-3.5" /> Show Less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show All ({availableAudio.length})</>}
              </button>
            )}

            {/* Unavailable Audio */}
            {unavailableAudio.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dashed" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                <p className={cn('text-xs font-semibold mb-3 flex items-center gap-1.5', isDark ? 'text-dark-500' : 'text-dark-400')}>
                  <X className="w-3.5 h-3.5 text-red-400" /> Unavailable Formats
                </p>
                {unavailableAudio.map((format) => (
                  <div
                    key={format.id}
                    className={cn(
                      'grid grid-cols-12 gap-2 items-center px-4 py-2.5 rounded-xl opacity-50 mb-1.5',
                      isDark ? 'bg-dark-700/20' : 'bg-dark-50/50'
                    )}
                  >
                    <span className={cn('col-span-3 text-sm line-through', isDark ? 'text-dark-500' : 'text-dark-400')}>{format.quality}</span>
                    <span className={cn('col-span-2 text-xs', isDark ? 'text-dark-500' : 'text-dark-400')}>{format.format}</span>
                    <span className={cn('col-span-3 text-xs', isDark ? 'text-dark-500' : 'text-dark-400')}>{format.bitrate}</span>
                    <span className={cn('col-span-2 text-xs', isDark ? 'text-dark-500' : 'text-dark-400')}>{format.size}</span>
                    <div className="col-span-2 flex justify-end">
                      <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-md">N/A</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DownloadOptions;
