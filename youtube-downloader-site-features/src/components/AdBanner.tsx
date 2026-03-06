import React from 'react';
import { Megaphone } from 'lucide-react';
import { ThemeMode } from '../types';
import { cn } from '../utils/cn';

interface AdBannerProps {
  theme: ThemeMode;
  size?: 'small' | 'medium' | 'large' | 'sidebar';
  className?: string;
}

const adContent: Record<string, { title: string; subtitle: string; cta: string; gradient: string }> = {
  small: {
    title: '🚀 SuperVPN Pro',
    subtitle: 'Browse privately & securely. 70% OFF!',
    cta: 'Get Deal',
    gradient: 'from-emerald-500 to-teal-600',
  },
  medium: {
    title: '🎵 MusicStream Premium',
    subtitle: 'Unlimited music downloads. Ad-free listening. Try 3 months free!',
    cta: 'Start Free Trial',
    gradient: 'from-purple-500 to-pink-600',
  },
  large: {
    title: '💻 CloudHost Ultra — Web Hosting That Scales With You',
    subtitle: 'Lightning-fast SSD servers, 99.9% uptime, free SSL & domain. Plans starting at $2.99/mo',
    cta: 'Launch Your Site',
    gradient: 'from-blue-500 to-cyan-500',
  },
  sidebar: {
    title: '🎮 GamePass+',
    subtitle: '500+ Premium Games. One subscription.',
    cta: 'Play Now',
    gradient: 'from-orange-500 to-red-500',
  },
};

const AdBanner: React.FC<AdBannerProps> = ({ theme, size = 'medium', className }) => {
  const isDark = theme === 'dark';
  const ad = adContent[size];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300',
        isDark
          ? 'bg-dark-800/50 border-dark-700/50'
          : 'bg-white/50 border-dark-200/50',
        className
      )}
    >
      {/* Ad Label */}
      <div className={cn(
        'absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider',
        isDark ? 'bg-dark-700/80 text-dark-400' : 'bg-dark-100 text-dark-500'
      )}>
        <Megaphone className="w-2.5 h-2.5" />
        Ad
      </div>

      {/* Content */}
      <div className={cn(
        'p-4',
        size === 'large' ? 'p-6' : '',
        size === 'sidebar' ? 'p-4' : ''
      )}>
        <div className={cn(
          'rounded-xl bg-gradient-to-r p-4',
          ad.gradient,
          size === 'large' ? 'p-6' : '',
        )}>
          <h3 className={cn(
            'font-bold text-white',
            size === 'large' ? 'text-xl mb-2' : 'text-sm mb-1',
          )}>
            {ad.title}
          </h3>
          <p className={cn(
            'text-white/80',
            size === 'large' ? 'text-sm mb-4' : 'text-xs mb-3',
          )}>
            {ad.subtitle}
          </p>
          <button className={cn(
            'rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-all backdrop-blur-sm border border-white/20',
            size === 'large' ? 'px-6 py-2.5 text-sm' : 'px-4 py-1.5 text-xs',
          )}>
            {ad.cta} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
