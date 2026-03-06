import { useState, useEffect } from 'react';
import { ThemeMode } from './types';
import { mockVideoInfo, mockVideoFormats, mockAudioFormats, mockTranscripts } from './mockData';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import VideoDetails from './components/VideoDetails';
import DownloadOptions from './components/DownloadOptions';
import TranscriptPanel from './components/TranscriptPanel';
import AdBanner from './components/AdBanner';
import Footer from './components/Footer';
import { cn } from './utils/cn';
import {
  Clipboard, MousePointerClick, ArrowDown,
  CheckCircle2, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';

function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isDark = theme === 'dark';

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSearch = (_url: string) => {
    setShowResults(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 2000);
  };

  useEffect(() => {
    document.body.className = isDark ? 'bg-dark-950' : 'bg-white';
  }, [isDark]);

  const faqItems = [
    {
      q: 'Is SaveTube free to use?',
      a: 'Yes! SaveTube is completely free with no hidden charges. You can download unlimited videos, audio, and transcripts without any subscription.'
    },
    {
      q: 'What video formats are supported?',
      a: 'We support MP4, WEBM, MKV, and AVI formats. Video quality ranges from 144p to 4K (2160p) depending on the source video availability.'
    },
    {
      q: 'Can I download only the audio?',
      a: 'Absolutely! You can extract audio in MP3, AAC, OGG, FLAC, and WAV formats with bitrates from 64kbps to 1411kbps (lossless).'
    },
    {
      q: 'Are transcripts available for all videos?',
      a: 'Transcripts depend on what the video creator has provided. We show all available languages and clearly mark unavailable ones. You can download transcripts as TXT or SRT files.'
    },
    {
      q: 'Is it legal to download YouTube videos?',
      a: 'Downloading copyrighted content without permission may violate YouTube\'s Terms of Service and copyright laws. Only download content you have the right to access. This tool is for educational demonstration purposes.'
    },
  ];

  const steps = [
    { icon: Clipboard, title: 'Copy URL', desc: 'Copy the YouTube video URL from your browser' },
    { icon: MousePointerClick, title: 'Paste & Search', desc: 'Paste the URL in the search box and click Download' },
    { icon: ArrowDown, title: 'Choose Format', desc: 'Select your preferred video/audio format and quality' },
    { icon: CheckCircle2, title: 'Download', desc: 'Click the download button and enjoy your content' },
  ];

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-500',
      isDark ? 'bg-dark-950 text-white' : 'bg-white text-dark-900'
    )}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={cn(
          'absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20',
          isDark ? 'bg-primary-600' : 'bg-primary-200'
        )} />
        <div className={cn(
          'absolute top-1/3 -left-40 w-96 h-96 rounded-full blur-3xl opacity-10',
          isDark ? 'bg-accent-600' : 'bg-accent-200'
        )} />
        <div className={cn(
          'absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10',
          isDark ? 'bg-emerald-600' : 'bg-emerald-200'
        )} />
      </div>

      <div className="relative z-10">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Ad Banner */}
          <div className="mt-6">
            <AdBanner theme={theme} size="large" />
          </div>

          {/* Search Section */}
          <section className="py-12 sm:py-16">
            <SearchBar theme={theme} onSearch={handleSearch} isLoading={isLoading} />
          </section>

          {/* Results Section */}
          {showResults && (
            <div className="animate-fade-in-up space-y-6 pb-12">
              {/* Video Details */}
              <VideoDetails video={mockVideoInfo} theme={theme} />

              {/* Main Content Grid with Sidebar Ads */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Download Options - takes 3 cols */}
                <div className="xl:col-span-3 space-y-6">
                  <DownloadOptions
                    videoFormats={mockVideoFormats}
                    audioFormats={mockAudioFormats}
                    theme={theme}
                  />
                  <TranscriptPanel transcripts={mockTranscripts} theme={theme} />

                  {/* Mid Ad Banner */}
                  <AdBanner theme={theme} size="medium" />
                </div>

                {/* Sidebar - takes 1 col */}
                <div className="xl:col-span-1 space-y-6">
                  <AdBanner theme={theme} size="sidebar" />
                  <AdBanner theme={theme} size="small" />

                  {/* Quick Tips */}
                  <div className={cn(
                    'rounded-2xl border p-5',
                    isDark ? 'bg-dark-800/60 border-dark-700/50' : 'bg-white border-dark-200/50',
                    'glass-card'
                  )}>
                    <h4 className={cn('text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-dark-900')}>
                      <span className="text-lg">💡</span> Quick Tips
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Use 720p MP4 for best quality/size ratio',
                        'MP3 320kbps is perfect for music',
                        'FLAC for lossless audio quality',
                        'Download transcripts for study notes',
                        'WEBM files are smaller but less compatible',
                      ].map((tip, i) => (
                        <li
                          key={i}
                          className={cn(
                            'flex items-start gap-2 text-xs leading-relaxed',
                            isDark ? 'text-dark-400' : 'text-dark-500'
                          )}
                        >
                          <span className="text-primary-500 mt-0.5 font-bold">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Supported Formats */}
                  <div className={cn(
                    'rounded-2xl border p-5',
                    isDark ? 'bg-dark-800/60 border-dark-700/50' : 'bg-white border-dark-200/50',
                    'glass-card'
                  )}>
                    <h4 className={cn('text-sm font-bold mb-3', isDark ? 'text-white' : 'text-dark-900')}>
                      📦 Supported Formats
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className={cn('text-[10px] uppercase font-bold tracking-wider mb-1.5', isDark ? 'text-dark-500' : 'text-dark-400')}>
                          Video
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {['MP4', 'WEBM', 'MKV', 'AVI'].map(f => (
                            <span key={f} className={cn(
                              'text-[10px] font-bold px-2 py-1 rounded-md',
                              isDark ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'
                            )}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className={cn('text-[10px] uppercase font-bold tracking-wider mb-1.5', isDark ? 'text-dark-500' : 'text-dark-400')}>
                          Audio
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {['MP3', 'AAC', 'OGG', 'FLAC', 'WAV'].map(f => (
                            <span key={f} className={cn(
                              'text-[10px] font-bold px-2 py-1 rounded-md',
                              isDark ? 'bg-accent-500/10 text-accent-400' : 'bg-pink-50 text-accent-600'
                            )}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className={cn('text-[10px] uppercase font-bold tracking-wider mb-1.5', isDark ? 'text-dark-500' : 'text-dark-400')}>
                          Transcript
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {['TXT', 'SRT'].map(f => (
                            <span key={f} className={cn(
                              'text-[10px] font-bold px-2 py-1 rounded-md',
                              isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                            )}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How It Works Section */}
          {!showResults && (
            <section className="pb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center mb-10">
                <h3 className={cn(
                  'text-2xl font-bold mb-2',
                  isDark ? 'text-white' : 'text-dark-900'
                )}>
                  How It Works
                </h3>
                <p className={cn('text-sm', isDark ? 'text-dark-400' : 'text-dark-500')}>
                  Download any YouTube video in just 4 simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={cn(
                      'relative rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group',
                      isDark
                        ? 'bg-dark-800/60 border-dark-700/50 hover:border-primary-500/30'
                        : 'bg-white border-dark-200/50 hover:border-primary-300',
                      'glass-card'
                    )}
                  >
                    <div className={cn(
                      'absolute -top-3 -left-1 text-xs font-black w-7 h-7 rounded-full flex items-center justify-center',
                      'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg'
                    )}>
                      {index + 1}
                    </div>
                    <div className={cn(
                      'w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all',
                      isDark
                        ? 'bg-dark-700 group-hover:bg-primary-500/20'
                        : 'bg-dark-100 group-hover:bg-primary-50'
                    )}>
                      <step.icon className={cn(
                        'w-6 h-6 transition-colors',
                        isDark ? 'text-primary-400' : 'text-primary-500'
                      )} />
                    </div>
                    <h4 className={cn('text-sm font-bold mb-1.5', isDark ? 'text-white' : 'text-dark-900')}>
                      {step.title}
                    </h4>
                    <p className={cn('text-xs leading-relaxed', isDark ? 'text-dark-400' : 'text-dark-500')}>
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '10M+', label: 'Downloads' },
                  { value: '500K+', label: 'Happy Users' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: '4.9/5', label: 'User Rating' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      'text-center rounded-2xl border p-6',
                      isDark ? 'bg-dark-800/40 border-dark-700/50' : 'bg-dark-50/50 border-dark-200/50'
                    )}
                  >
                    <p className="text-2xl font-extrabold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className={cn('text-xs mt-1', isDark ? 'text-dark-400' : 'text-dark-500')}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mid Ad */}
              <div className="mt-10">
                <AdBanner theme={theme} size="medium" />
              </div>

              {/* FAQ Section */}
              <div className="mt-16">
                <div className="text-center mb-8">
                  <h3 className={cn(
                    'text-2xl font-bold mb-2 flex items-center justify-center gap-2',
                    isDark ? 'text-white' : 'text-dark-900'
                  )}>
                    <HelpCircle className="w-6 h-6 text-primary-500" />
                    Frequently Asked Questions
                  </h3>
                  <p className={cn('text-sm', isDark ? 'text-dark-400' : 'text-dark-500')}>
                    Got questions? We've got answers.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-3">
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        'rounded-xl border overflow-hidden transition-all duration-300',
                        isDark
                          ? 'bg-dark-800/60 border-dark-700/50'
                          : 'bg-white border-dark-200/50',
                        openFaq === index && (isDark ? 'border-primary-500/30' : 'border-primary-300')
                      )}
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className={cn(
                          'w-full flex items-center justify-between px-5 py-4 text-left',
                          isDark ? 'hover:bg-dark-700/30' : 'hover:bg-dark-50'
                        )}
                      >
                        <span className={cn('text-sm font-semibold pr-4', isDark ? 'text-white' : 'text-dark-900')}>
                          {item.q}
                        </span>
                        {openFaq === index ? (
                          <ChevronUp className={cn('w-4 h-4 flex-shrink-0', isDark ? 'text-primary-400' : 'text-primary-500')} />
                        ) : (
                          <ChevronDown className={cn('w-4 h-4 flex-shrink-0', isDark ? 'text-dark-400' : 'text-dark-500')} />
                        )}
                      </button>
                      {openFaq === index && (
                        <div className={cn(
                          'px-5 pb-4 text-sm leading-relaxed',
                          isDark ? 'text-dark-400' : 'text-dark-600'
                        )}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Ad */}
              <div className="mt-10">
                <AdBanner theme={theme} size="small" />
              </div>
            </section>
          )}
        </main>

        <Footer theme={theme} />
      </div>
    </div>
  );
}

export default App;
