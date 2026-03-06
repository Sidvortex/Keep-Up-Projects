import { useState, useCallback, useRef, useEffect } from 'react';
import { Download, ArrowDown, Disc3 } from 'lucide-react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import QualitySelector from './components/QualitySelector';
import OptionsPanel from './components/OptionsPanel';
import TrackList from './components/TrackList';
import DownloadPanel from './components/DownloadPanel';
import Features from './components/Features';
import AdBanner from './components/AdBanner';
import { AudioQuality, Track, DownloadItem, ContentType } from './types';
import { generateMockTracks, qualityOptions } from './data';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [contentType, setContentType] = useState<ContentType>('unknown');
  const [quality, setQuality] = useState<AudioQuality>('mp3-320');
  const [downloadCovers, setDownloadCovers] = useState(true);
  const [embedMetadata, setEmbedMetadata] = useState(true);
  const [createFolder, setCreateFolder] = useState(true);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showStickyAd, setShowStickyAd] = useState(true);
  const downloadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((_url: string, type: ContentType) => {
    setIsLoading(true);
    setContentType(type);

    setTimeout(() => {
      let count = 1;
      if (type === 'playlist') {
        count = Math.floor(Math.random() * 80) + 20;
      } else if (type === 'album') {
        count = Math.floor(Math.random() * 12) + 8;
      }
      const mockTracks = generateMockTracks(count);
      setTracks(mockTracks);
      setIsLoading(false);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1500 + Math.random() * 1000);
  }, []);

  const handleToggleTrack = useCallback((id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  }, []);

  const handleSelectAll = useCallback(() => {
    setTracks(prev => prev.map(t => ({ ...t, selected: true })));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setTracks(prev => prev.map(t => ({ ...t, selected: false })));
  }, []);

  const handleStartDownload = useCallback(() => {
    const selectedTracks = tracks.filter(t => t.selected);
    if (selectedTracks.length === 0) return;

    const qualityOpt = qualityOptions.find(q => q.id === quality)!;

    const newDownloads: DownloadItem[] = selectedTracks.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      cover: t.cover,
      progress: 0,
      status: 'queued' as const,
      quality: qualityOpt.label,
      size: qualityOpt.size,
    }));

    setDownloads(prev => [...newDownloads, ...prev]);
    setIsDownloading(true);

    let currentIndex = 0;
    const processQueue = () => {
      if (currentIndex >= newDownloads.length) {
        setIsDownloading(false);
        return;
      }

      const currentId = newDownloads[currentIndex].id;

      setDownloads(prev => prev.map(d => d.id === currentId ? { ...d, status: 'downloading' as const } : d));

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          const failed = Math.random() < 0.05;
          setDownloads(prev => prev.map(d =>
            d.id === currentId
              ? { ...d, progress: 100, status: failed ? 'failed' as const : 'completed' as const }
              : d
          ));

          currentIndex++;
          setTimeout(processQueue, 200);
        } else {
          setDownloads(prev => prev.map(d =>
            d.id === currentId ? { ...d, progress } : d
          ));
        }
      }, 150 + Math.random() * 200);

      downloadIntervalRef.current = interval;
    };

    processQueue();
  }, [tracks, quality]);

  const handleRetry = useCallback((id: string) => {
    setDownloads(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'downloading' as const, progress: 0 } : d
    ));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setDownloads(prev => prev.map(d =>
          d.id === id ? { ...d, progress: 100, status: 'completed' as const } : d
        ));
      } else {
        setDownloads(prev => prev.map(d =>
          d.id === id ? { ...d, progress } : d
        ));
      }
    }, 150);
  }, []);

  const handleClearCompleted = useCallback(() => {
    setDownloads(prev => prev.filter(d => d.status !== 'completed'));
  }, []);

  useEffect(() => {
    return () => {
      if (downloadIntervalRef.current) {
        clearInterval(downloadIntervalRef.current);
      }
    };
  }, []);

  const selectedCount = tracks.filter(t => t.selected).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* === TOP LEADERBOARD AD === */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="hidden md:block">
            <AdBanner size="leaderboard" id="ad-top-leaderboard" />
          </div>
          <div className="block md:hidden">
            <AdBanner size="mobile-banner" id="ad-top-mobile" />
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400 font-medium mb-6">
              <Disc3 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              Free • No Sign-up • Unlimited Downloads
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Download Spotify Music
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                in Any Quality
              </span>
            </h2>
            <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Convert and download songs, albums, and playlists from Spotify.
              Choose from MP3, AAC, OGG, FLAC, ALAC, or WAV formats.
              <br />
              <span className="text-green-400/80">Up to 500 songs per playlist.</span>
            </p>
          </div>

          {/* Search */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {/* === AD BELOW SEARCH === */}
          <div className="mt-8">
            <div className="hidden md:block">
              <AdBanner size="leaderboard" id="ad-below-search" />
            </div>
            <div className="block md:hidden">
              <AdBanner size="mobile-banner" id="ad-below-search-mobile" />
            </div>
          </div>

          {/* Results */}
          {tracks.length > 0 && (
            <div ref={resultsRef} className="mt-10 sm:mt-14 space-y-6">
              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <ArrowDown className="w-5 h-5 text-green-400 animate-bounce" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* === IN-CONTENT AD BEFORE RESULTS === */}
              <div className="hidden md:block">
                <AdBanner size="large-banner" id="ad-above-results" />
              </div>
              <div className="block md:hidden">
                <AdBanner size="mobile-banner" id="ad-above-results-mobile" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar Ad (Skyscraper) - visible on xl */}
                <div className="hidden xl:flex xl:col-span-2 flex-col items-center gap-6 pt-4">
                  <AdBanner size="skyscraper" id="ad-left-skyscraper" className="sticky top-4" />
                </div>

                {/* Center: Track List */}
                <div className="lg:col-span-8 xl:col-span-7">
                  <TrackList
                    tracks={tracks}
                    onToggleTrack={handleToggleTrack}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                    contentType={contentType}
                  />

                  {/* === AD BETWEEN TRACKS AND DOWNLOADS === */}
                  <div className="mt-6">
                    <div className="hidden md:block">
                      <AdBanner size="leaderboard" id="ad-mid-content" />
                    </div>
                    <div className="block md:hidden">
                      <AdBanner size="mobile-banner" id="ad-mid-content-mobile" />
                    </div>
                  </div>
                </div>

                {/* Right: Settings + Download + Sidebar Ad */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-5">
                  <QualitySelector selected={quality} onChange={setQuality} />
                  
                  <OptionsPanel
                    downloadCovers={downloadCovers}
                    onToggleCovers={() => setDownloadCovers(p => !p)}
                    embedMetadata={embedMetadata}
                    onToggleMetadata={() => setEmbedMetadata(p => !p)}
                    createFolder={createFolder}
                    onToggleFolder={() => setCreateFolder(p => !p)}
                  />

                  {/* Download Button */}
                  <button
                    onClick={handleStartDownload}
                    disabled={selectedCount === 0 || isDownloading}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 px-6 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-green-500/20 hover:shadow-green-500/30 active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    <span>
                      {isDownloading
                        ? 'Downloading...'
                        : `Download ${selectedCount} Track${selectedCount !== 1 ? 's' : ''}`}
                    </span>
                  </button>

                  {selectedCount > 0 && (
                    <p className="text-xs text-gray-500 text-center">
                      Estimated size: ~{(selectedCount * (quality.includes('lossless') ? 120 : quality.includes('320') ? 30 : 15)).toFixed(0)} MB
                    </p>
                  )}

                  {/* === SIDEBAR RECTANGLE AD === */}
                  <div className="pt-2">
                    <AdBanner size="rectangle" id="ad-sidebar-rect" />
                  </div>

                  {/* === SIDEBAR SECOND AD (Sticky) === */}
                  <div className="hidden lg:block sticky top-4">
                    <AdBanner size="rectangle" id="ad-sidebar-rect-sticky" />
                  </div>
                </div>
              </div>

              {/* Downloads Progress */}
              {downloads.length > 0 && (
                <>
                  <DownloadPanel
                    downloads={downloads}
                    onRetry={handleRetry}
                    onClear={handleClearCompleted}
                  />
                  {/* === AD BELOW DOWNLOADS === */}
                  <div className="hidden md:block">
                    <AdBanner size="leaderboard" id="ad-below-downloads" />
                  </div>
                  <div className="block md:hidden">
                    <AdBanner size="mobile-banner" id="ad-below-downloads-mobile" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Features */}
          {tracks.length === 0 && (
            <>
              <Features />

              {/* === AD BETWEEN FEATURES AND FAQ === */}
              <div className="mt-12">
                <div className="hidden md:block">
                  <AdBanner size="leaderboard" id="ad-between-features-faq" />
                </div>
                <div className="block md:hidden">
                  <AdBanner size="mobile-banner" id="ad-between-features-faq-mobile" />
                </div>
              </div>
            </>
          )}

          {/* FAQ */}
          {tracks.length === 0 && (
            <div className="mt-16 sm:mt-20">
              {/* FAQ with sidebar ads */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left sidebar ad */}
                <div className="hidden lg:flex lg:col-span-2 justify-center pt-12">
                  <AdBanner size="skyscraper" id="ad-faq-left-sky" className="sticky top-4" />
                </div>

                {/* FAQ content */}
                <div className="lg:col-span-8 max-w-3xl mx-auto w-full">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        q: 'What audio quality options are available?',
                        a: 'We support MP3 (128-320kbps), AAC (256kbps), OGG Vorbis (320kbps), and lossless formats including FLAC, ALAC, and WAV at CD-quality 1411kbps.',
                      },
                      {
                        q: 'How many songs can I download from a playlist?',
                        a: 'You can download up to 500 songs from a single playlist. For larger playlists, simply split them and download in batches.',
                      },
                      {
                        q: 'Can I download album artwork?',
                        a: 'Yes! SpotDown can download high-resolution album covers and song thumbnails as separate image files, or embed them directly into the audio file metadata.',
                      },
                    ].map((faq, i) => (
                      <div key={faq.q}>
                        <details
                          className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden"
                        >
                          <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:text-green-400 transition-colors list-none flex items-center justify-between">
                            {faq.q}
                            <span className="text-gray-500 group-open:rotate-45 transition-transform text-xl ml-4">+</span>
                          </summary>
                          <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                            {faq.a}
                          </div>
                        </details>

                        {/* === IN-FAQ AD (after 2nd question) === */}
                        {i === 1 && (
                          <div className="my-4">
                            <div className="hidden md:block">
                              <AdBanner size="leaderboard" id="ad-in-faq" />
                            </div>
                            <div className="block md:hidden">
                              <AdBanner size="mobile-banner" id="ad-in-faq-mobile" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {[
                      {
                        q: 'What is lossless audio?',
                        a: 'Lossless formats like FLAC, ALAC, and WAV preserve the full audio quality without any compression artifacts. They produce larger files but sound identical to the original recording.',
                      },
                      {
                        q: 'Is SpotDown free to use?',
                        a: 'Yes, SpotDown is completely free with no sign-up required. There are no download limits or hidden fees.',
                      },
                      {
                        q: 'Which devices are supported?',
                        a: 'SpotDown works on any device with a modern web browser — desktop, laptop, tablet, or smartphone. No app installation required.',
                      },
                    ].map((faq) => (
                      <details
                        key={faq.q}
                        className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden"
                      >
                        <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:text-green-400 transition-colors list-none flex items-center justify-between">
                          {faq.q}
                          <span className="text-gray-500 group-open:rotate-45 transition-transform text-xl ml-4">+</span>
                        </summary>
                        <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                          {faq.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                {/* Right sidebar ad */}
                <div className="hidden lg:flex lg:col-span-2 justify-center pt-12">
                  <AdBanner size="skyscraper" id="ad-faq-right-sky" className="sticky top-4" />
                </div>
              </div>

              {/* === BOTTOM LEADERBOARD AD === */}
              <div className="mt-14">
                <div className="hidden md:block">
                  <AdBanner size="large-banner" id="ad-bottom-leaderboard" />
                </div>
                <div className="block md:hidden">
                  <AdBanner size="mobile-banner" id="ad-bottom-mobile" />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Footer ad */}
            <div className="mb-8">
              <div className="hidden md:block">
                <AdBanner size="leaderboard" id="ad-footer" />
              </div>
              <div className="block md:hidden">
                <AdBanner size="mobile-banner" id="ad-footer-mobile" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">
                  Spot<span className="text-green-400 font-semibold">Down</span> — Spotify Music Downloader
                </span>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-600">
                <span>For educational purposes only</span>
                <span>•</span>
                <span>Not affiliated with Spotify</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* === STICKY FOOTER AD === */}
      {showStickyAd && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-sm border-t border-white/10 shadow-2xl shadow-black/50">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center relative">
            {/* Close button */}
            <button
              onClick={() => setShowStickyAd(false)}
              className="absolute top-1 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all text-xs font-bold"
              aria-label="Close ad"
            >
              ✕
            </button>
            <div className="hidden md:block">
              <AdBanner size="sticky-footer" id="ad-sticky-footer" />
            </div>
            <div className="block md:hidden">
              <AdBanner size="mobile-banner" id="ad-sticky-footer-mobile" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
