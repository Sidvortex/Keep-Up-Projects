import React from 'react';
import { Download, Youtube, Heart, Shield, Zap, Globe } from 'lucide-react';
import { ThemeMode } from '../types';
import { cn } from '../utils/cn';

interface FooterProps {
  theme: ThemeMode;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <footer className={cn(
      'border-t mt-16',
      isDark ? 'bg-dark-900 border-dark-800' : 'bg-dark-50 border-dark-200'
    )}>
      {/* Features Row */}
      <div className={cn(
        'border-b',
        isDark ? 'border-dark-800' : 'border-dark-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Safe & Secure', desc: '100% virus-free downloads' },
              { icon: Zap, title: 'Lightning Fast', desc: 'High-speed download servers' },
              { icon: Globe, title: 'All Formats', desc: 'MP4, WEBM, MP3, FLAC & more' },
              { icon: Download, title: 'Unlimited', desc: 'No daily download limits' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className={cn(
                  'w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center',
                  isDark ? 'bg-dark-800' : 'bg-white shadow-sm'
                )}>
                  <feature.icon className="w-5 h-5 text-primary-500" />
                </div>
                <h4 className={cn('text-sm font-bold mb-1', isDark ? 'text-white' : 'text-dark-900')}>
                  {feature.title}
                </h4>
                <p className={cn('text-xs', isDark ? 'text-dark-400' : 'text-dark-500')}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
              <span className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-dark-900')}>
                Save<span className="text-primary-500">Tube</span>
              </span>
            </div>
            <p className={cn('text-xs leading-relaxed mb-4', isDark ? 'text-dark-400' : 'text-dark-500')}>
              The fastest and most reliable YouTube video downloader. Download videos, audio, and transcripts for free.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: ['Features', 'How It Works', 'Pricing', 'API'] },
            { title: 'Support', links: ['FAQ', 'Contact Us', 'Help Center', 'Status'] },
            { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'DMCA', 'Cookie Policy'] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className={cn('text-sm font-bold mb-4', isDark ? 'text-white' : 'text-dark-900')}>
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <button className={cn(
                      'text-xs transition-colors hover:text-primary-500',
                      isDark ? 'text-dark-400' : 'text-dark-500'
                    )}>
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={cn(
        'border-t',
        isDark ? 'border-dark-800' : 'border-dark-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={cn('text-xs', isDark ? 'text-dark-500' : 'text-dark-400')}>
            © 2025 SaveTube. All rights reserved. Not affiliated with{' '}
            <Youtube className="w-3 h-3 inline text-red-500" /> YouTube.
          </p>
          <p className={cn('text-xs flex items-center gap-1', isDark ? 'text-dark-500' : 'text-dark-400')}>
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the community
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className={cn(
        'border-t',
        isDark ? 'border-dark-800' : 'border-dark-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className={cn('text-[10px] text-center leading-relaxed', isDark ? 'text-dark-600' : 'text-dark-400')}>
            <strong>Disclaimer:</strong> SaveTube is a demonstration project. Downloading copyrighted content without permission is illegal. 
            This tool is designed for educational purposes and for downloading content that you have the right to download. 
            Please respect content creators' rights and YouTube's Terms of Service.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
