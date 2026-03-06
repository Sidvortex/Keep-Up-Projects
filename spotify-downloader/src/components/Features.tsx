import React from 'react';
import { Shield, Zap, Music, Headphones, Globe, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Download tracks and playlists at maximum speed with parallel processing',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Headphones,
    title: 'Hi-Fi Quality',
    description: 'Support for FLAC, ALAC, WAV lossless formats up to 1411kbps',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Music,
    title: 'Bulk Downloads',
    description: 'Download entire playlists up to 500 songs and complete albums at once',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: Shield,
    title: 'Safe & Private',
    description: 'No account required. Your data stays on your device',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Globe,
    title: 'All Regions',
    description: 'Access tracks from any region without geo-restrictions',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Fully responsive design that works perfectly on any device',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
];

const Features: React.FC = () => {
  return (
    <div className="mt-16 sm:mt-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Choose SpotDown?</h2>
        <p className="mt-2 text-gray-400 text-sm">The most powerful Spotify downloader on the web</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/[0.05] transition-all"
          >
            <div className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center mb-3`}>
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
            </div>
            <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
