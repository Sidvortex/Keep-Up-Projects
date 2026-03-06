import React from 'react';

type AdSize = 'leaderboard' | 'banner' | 'large-banner' | 'rectangle' | 'large-rectangle' | 'skyscraper' | 'wide-skyscraper' | 'half-page' | 'mobile-banner' | 'sticky-footer';

const adDimensions: Record<AdSize, { width: string; height: string; label: string }> = {
  'leaderboard': { width: '728px', height: '90px', label: '728 × 90 — Leaderboard' },
  'banner': { width: '468px', height: '60px', label: '468 × 60 — Banner' },
  'large-banner': { width: '100%', height: '100px', label: '970 × 100 — Large Banner' },
  'rectangle': { width: '300px', height: '250px', label: '300 × 250 — Rectangle' },
  'large-rectangle': { width: '336px', height: '280px', label: '336 × 280 — Large Rectangle' },
  'skyscraper': { width: '160px', height: '600px', label: '160 × 600 — Skyscraper' },
  'wide-skyscraper': { width: '300px', height: '600px', label: '300 × 600 — Wide Skyscraper' },
  'half-page': { width: '300px', height: '600px', label: '300 × 600 — Half Page' },
  'mobile-banner': { width: '320px', height: '50px', label: '320 × 50 — Mobile Banner' },
  'sticky-footer': { width: '100%', height: '90px', label: '728 × 90 — Sticky Footer Ad' },
};

interface AdBannerProps {
  size: AdSize;
  className?: string;
  id?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size, className = '', id }) => {
  const dim = adDimensions[size];

  return (
    <div
      id={id || `ad-${size}-${Math.random().toString(36).slice(2, 7)}`}
      className={`flex items-center justify-center mx-auto ${className}`}
      style={{
        maxWidth: dim.width === '100%' ? '100%' : dim.width,
        width: '100%',
        height: dim.height,
      }}
    >
      <div
        className="w-full h-full rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-1 relative overflow-hidden group hover:border-white/20 transition-colors"
      >
        {/* Subtle animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/[0.03] via-transparent to-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            Advertisement
          </span>
          <span className="text-[10px] text-gray-700 font-mono">
            {dim.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
