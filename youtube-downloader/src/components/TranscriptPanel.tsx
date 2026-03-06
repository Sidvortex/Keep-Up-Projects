import React, { useState } from 'react';
import {
  FileText, Download, Check, X, Globe, Search,
  Copy, CheckCheck, ChevronDown
} from 'lucide-react';
import { TranscriptInfo, ThemeMode } from '../types';
import { cn } from '../utils/cn';

interface TranscriptPanelProps {
  transcripts: TranscriptInfo[];
  theme: ThemeMode;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcripts, theme }) => {
  const [selectedLang, setSelectedLang] = useState<string>(
    transcripts.find(t => t.available)?.language || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const isDark = theme === 'dark';

  const available = transcripts.filter(t => t.available);
  const unavailable = transcripts.filter(t => !t.available);
  const selectedTranscript = transcripts.find(t => t.language === selectedLang);

  const filteredEntries = selectedTranscript?.entries?.filter(
    entry => entry.text.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCopy = () => {
    const text = selectedTranscript?.entries?.map(e => `[${e.time}] ${e.text}`).join('\n') || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTranscript = (format: 'txt' | 'srt') => {
    if (!selectedTranscript?.entries) return;
    let content = '';
    if (format === 'txt') {
      content = selectedTranscript.entries.map(e => `[${e.time}] ${e.text}`).join('\n');
    } else {
      content = selectedTranscript.entries.map((e, i) => {
        return `${i + 1}\n${e.time},000 --> ${e.time},999\n${e.text}\n`;
      }).join('\n');
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${selectedLang}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden transition-all duration-300',
      isDark ? 'bg-dark-800/60 border-dark-700/50' : 'bg-white border-dark-200/50',
      'glass-card shadow-xl'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-6 py-4 border-b',
        isDark ? 'border-dark-700/50' : 'border-dark-200/50'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className={cn('text-base font-bold', isDark ? 'text-white' : 'text-dark-900')}>
              Transcripts
            </h3>
            <p className={cn('text-xs', isDark ? 'text-dark-400' : 'text-dark-500')}>
              {available.length} available · {unavailable.length} unavailable
            </p>
          </div>
        </div>

        {/* Download Transcript Buttons */}
        {selectedTranscript?.available && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                copied
                  ? 'bg-green-500/20 text-green-400'
                  : isDark
                    ? 'bg-dark-700 text-dark-300 hover:text-white'
                    : 'bg-dark-100 text-dark-600 hover:text-dark-900'
              )}
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => handleDownloadTranscript('txt')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> .TXT
            </button>
            <button
              onClick={() => handleDownloadTranscript('srt')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> .SRT
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Language Selector */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                isDark
                  ? 'bg-dark-700/50 border-dark-600 text-white hover:border-primary-500'
                  : 'bg-dark-50 border-dark-200 text-dark-900 hover:border-primary-500'
              )}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary-500" />
                {selectedLang || 'Select Language'}
              </span>
              <ChevronDown className={cn('w-4 h-4 transition-transform', showLangDropdown && 'rotate-180')} />
            </button>

            {showLangDropdown && (
              <div className={cn(
                'absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-xl z-20 max-h-52 overflow-y-auto',
                isDark ? 'bg-dark-800 border-dark-700' : 'bg-white border-dark-200'
              )}>
                {/* Available */}
                <div className="p-2">
                  <p className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-1', isDark ? 'text-dark-500' : 'text-dark-400')}>
                    Available
                  </p>
                  {available.map((t) => (
                    <button
                      key={t.language}
                      onClick={() => { setSelectedLang(t.language); setShowLangDropdown(false); }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                        selectedLang === t.language
                          ? isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-600'
                          : isDark ? 'text-dark-300 hover:bg-dark-700' : 'text-dark-700 hover:bg-dark-50'
                      )}
                    >
                      <Check className={cn('w-3.5 h-3.5 text-green-500', selectedLang !== t.language && 'invisible')} />
                      {t.language}
                      <span className="text-[10px] ml-auto text-green-500 font-semibold">{t.entries?.length} lines</span>
                    </button>
                  ))}
                </div>
                {/* Unavailable */}
                {unavailable.length > 0 && (
                  <div className={cn('p-2 border-t', isDark ? 'border-dark-700' : 'border-dark-100')}>
                    <p className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-1', isDark ? 'text-dark-500' : 'text-dark-400')}>
                      Unavailable
                    </p>
                    {unavailable.map((t) => (
                      <div
                        key={t.language}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm opacity-50 cursor-not-allowed',
                          isDark ? 'text-dark-500' : 'text-dark-400'
                        )}
                      >
                        <X className="w-3.5 h-3.5 text-red-400" />
                        {t.language}
                        <span className="text-[10px] ml-auto text-red-400 font-semibold">N/A</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Transcript */}
          <div className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border flex-1 sm:max-w-xs',
            isDark
              ? 'bg-dark-700/50 border-dark-600 focus-within:border-primary-500'
              : 'bg-dark-50 border-dark-200 focus-within:border-primary-500'
          )}>
            <Search className={cn('w-4 h-4', isDark ? 'text-dark-500' : 'text-dark-400')} />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'flex-1 text-sm bg-transparent outline-none',
                isDark ? 'text-white placeholder:text-dark-500' : 'text-dark-900 placeholder:text-dark-400'
              )}
            />
          </div>
        </div>

        {/* Transcript Content */}
        {selectedTranscript?.available ? (
          <div className={cn(
            'rounded-xl border max-h-80 overflow-y-auto',
            isDark ? 'bg-dark-900/50 border-dark-700/50' : 'bg-dark-50/50 border-dark-200/50'
          )}>
            {filteredEntries.length > 0 ? (
              <div className="divide-y" style={{ borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
                {filteredEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex gap-4 px-4 py-3 transition-colors',
                      isDark ? 'hover:bg-dark-800/50' : 'hover:bg-white'
                    )}
                  >
                    <span className={cn(
                      'text-xs font-mono font-bold flex-shrink-0 pt-0.5',
                      isDark ? 'text-primary-400' : 'text-primary-600'
                    )}>
                      {entry.time}
                    </span>
                    <span className={cn(
                      'text-sm leading-relaxed',
                      isDark ? 'text-dark-300' : 'text-dark-700'
                    )}>
                      {entry.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className={cn('w-8 h-8 mb-2', isDark ? 'text-dark-600' : 'text-dark-300')} />
                <p className={cn('text-sm', isDark ? 'text-dark-500' : 'text-dark-400')}>
                  No matching transcript entries
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={cn(
            'flex flex-col items-center justify-center py-16 rounded-xl',
            isDark ? 'bg-dark-900/50' : 'bg-dark-50'
          )}>
            <X className="w-12 h-12 text-red-400 mb-3" />
            <p className={cn('text-sm font-semibold mb-1', isDark ? 'text-white' : 'text-dark-900')}>
              Transcript Unavailable
            </p>
            <p className={cn('text-xs', isDark ? 'text-dark-400' : 'text-dark-500')}>
              This language transcript is not available for this video.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;
