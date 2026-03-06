import React from 'react';
import { Clock, Eye, ThumbsUp, Users, Calendar, ExternalLink } from 'lucide-react';
import { VideoInfo, ThemeMode } from '../types';
import { cn } from '../utils/cn';

interface VideoDetailsProps {
  video: VideoInfo;
  theme: ThemeMode;
}

const VideoDetails: React.FC<VideoDetailsProps> = ({ video, theme }) => {
  const isDark = theme === 'dark';

  const stats = [
    { icon: Eye, label: 'Views', value: video.views },
    { icon: ThumbsUp, label: 'Likes', value: video.likes },
    { icon: Clock, label: 'Duration', value: video.duration },
    { icon: Calendar, label: 'Uploaded', value: video.uploadDate },
  ];

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden transition-all duration-300',
      isDark
        ? 'bg-dark-800/60 border-dark-700/50'
        : 'bg-white border-dark-200/50',
      'glass-card shadow-xl'
    )}>
      <div className="flex flex-col lg:flex-row">
        {/* Thumbnail */}
        <div className="relative lg:w-[420px] flex-shrink-0">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover aspect-video lg:aspect-auto"
          />
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
            {video.duration}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Info */}
        <div className="flex-1 p-6">
          <h3 className={cn(
            'text-xl font-bold mb-2 leading-tight',
            isDark ? 'text-white' : 'text-dark-900'
          )}>
            {video.title}
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
              {video.channel[0]}
            </div>
            <div>
              <p className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-dark-900')}>
                {video.channel}
              </p>
              <p className={cn('text-xs', isDark ? 'text-dark-400' : 'text-dark-500')}>
                <Users className="w-3 h-3 inline mr-1" />
                {video.subscribers} subscribers
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-xl p-3 text-center',
                  isDark ? 'bg-dark-700/50' : 'bg-dark-50'
                )}
              >
                <stat.icon className={cn(
                  'w-4 h-4 mx-auto mb-1',
                  isDark ? 'text-primary-400' : 'text-primary-500'
                )} />
                <p className={cn('text-xs font-bold', isDark ? 'text-white' : 'text-dark-900')}>
                  {stat.value}
                </p>
                <p className={cn('text-[10px]', isDark ? 'text-dark-400' : 'text-dark-500')}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className={cn(
            'rounded-xl p-3 text-sm leading-relaxed',
            isDark ? 'bg-dark-700/30 text-dark-300' : 'bg-dark-50 text-dark-600'
          )}>
            <p className="line-clamp-3">{video.description}</p>
          </div>

          <button className={cn(
            'mt-3 flex items-center gap-1.5 text-xs font-semibold transition-colors',
            isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
          )}>
            <ExternalLink className="w-3.5 h-3.5" />
            Open on YouTube
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
