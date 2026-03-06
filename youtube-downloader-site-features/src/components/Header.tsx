import React from 'react';
import { Download, Moon, Sun, Youtube } from 'lucide-react';
import { ThemeMode } from '../types';
import { cn } from '../utils/cn';

interface HeaderProps {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-500',
        isDark
          ? 'bg-dark-900/80 border-dark-700/50'
          : 'bg-white/80 border-dark-200/50',
        'glass-card'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <Youtube className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className={cn(
                'text-xl font-bold tracking-tight',
                isDark ? 'text-white' : 'text-dark-900'
              )}>
                Save<span className="text-primary-500">Tube</span>
              </h1>
              <p className={cn(
                'text-[10px] font-medium -mt-1 tracking-wider uppercase',
                isDark ? 'text-dark-400' : 'text-dark-500'
              )}>
                Video Downloader
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {['Home', 'How It Works', 'FAQ', 'Contact'].map((item) => (
              <button
                key={item}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-500',
                  isDark ? 'text-dark-300' : 'text-dark-600'
                )}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'relative w-14 h-7 rounded-full transition-all duration-500 flex items-center',
              isDark
                ? 'bg-primary-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'bg-dark-200 shadow-inner'
            )}
          >
            <div
              className={cn(
                'absolute w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center',
                isDark
                  ? 'translate-x-8 bg-dark-900'
                  : 'translate-x-1 bg-white shadow-md'
              )}
            >
              {isDark ? (
                <Moon className="w-3 h-3 text-primary-400" />
              ) : (
                <Sun className="w-3 h-3 text-yellow-500" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
