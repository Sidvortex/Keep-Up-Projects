import React from 'react';
import { Download, Loader2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { DownloadItem } from '../types';
import { cn } from '../utils/cn';

interface DownloadPanelProps {
  downloads: DownloadItem[];
  onRetry: (id: string) => void;
  onClear: () => void;
}

const DownloadPanel: React.FC<DownloadPanelProps> = ({ downloads, onRetry, onClear }) => {
  if (downloads.length === 0) return null;

  const completed = downloads.filter(d => d.status === 'completed').length;
  const failed = downloads.filter(d => d.status === 'failed').length;
  const inProgress = downloads.filter(d => d.status === 'downloading' || d.status === 'queued').length;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Downloads</h3>
              <p className="text-xs text-gray-500">
                {completed} completed • {inProgress} in progress{failed > 0 ? ` • ${failed} failed` : ''}
              </p>
            </div>
          </div>
          {completed > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear completed
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {downloads.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 border-b border-white/[0.03] last:border-b-0"
          >
            {/* Cover */}
            <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden shrink-0">
              <img src={item.cover} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{item.title}</div>
              <div className="text-xs text-gray-500 truncate">{item.artist} • {item.quality} • {item.size}</div>
              
              {/* Progress bar */}
              {(item.status === 'downloading' || item.status === 'queued') && (
                <div className="mt-1.5 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      item.status === 'queued' ? "bg-gray-500 w-0" : "bg-green-500"
                    )}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Status */}
            <div className="shrink-0">
              {item.status === 'queued' && (
                <div className="text-xs text-gray-500">Queued</div>
              )}
              {item.status === 'downloading' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-400">{item.progress}%</span>
                  <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                </div>
              )}
              {item.status === 'completed' && (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
              {item.status === 'failed' && (
                <button onClick={() => onRetry(item.id)} className="flex items-center gap-1 text-red-400 hover:text-red-300">
                  <XCircle className="w-4 h-4" />
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadPanel;
