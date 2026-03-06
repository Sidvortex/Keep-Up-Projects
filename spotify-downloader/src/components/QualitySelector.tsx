import React, { useState } from 'react';
import { ChevronDown, Sparkles, Check, HardDrive, FileAudio } from 'lucide-react';
import { AudioQuality, QualityOption } from '../types';
import { qualityOptions } from '../data';
import { cn } from '../utils/cn';

interface QualitySelectorProps {
  selected: AudioQuality;
  onChange: (quality: AudioQuality) => void;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = qualityOptions.find(q => q.id === selected)!;

  const lossy = qualityOptions.filter(q => !q.lossless);
  const lossless = qualityOptions.filter(q => q.lossless);

  const renderOption = (option: QualityOption) => (
    <button
      key={option.id}
      onClick={() => { onChange(option.id); setIsOpen(false); }}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left",
        selected === option.id
          ? "bg-green-500/15 border border-green-500/30"
          : "hover:bg-white/5 border border-transparent"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
          option.lossless
            ? "bg-amber-500/20 text-amber-400"
            : "bg-blue-500/20 text-blue-400"
        )}>
          {option.format}
        </div>
        <div>
          <div className="text-sm font-medium text-white flex items-center gap-2">
            {option.label}
            {option.lossless && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-semibold">
                <Sparkles className="w-2.5 h-2.5" />
                LOSSLESS
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">{option.bitrate}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <HardDrive className="w-3 h-3" />
          {option.size}
        </div>
        {selected === option.id && <Check className="w-4 h-4 text-green-400" />}
      </div>
    </button>
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
        <FileAudio className="w-4 h-4 text-green-400" />
        Audio Quality
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white hover:border-green-500/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
            selectedOption.lossless
              ? "bg-amber-500/20 text-amber-400"
              : "bg-blue-500/20 text-blue-400"
          )}>
            {selectedOption.format}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium flex items-center gap-2">
              {selectedOption.label}
              {selectedOption.lossless && (
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-semibold">
                  LOSSLESS
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{selectedOption.size}</div>
          </div>
        </div>
        <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-2xl p-3 shadow-2xl shadow-black/50 z-50 max-h-[70vh] overflow-auto">
            <div className="mb-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                Lossy Compression
              </div>
              <div className="space-y-1">
                {lossy.map(renderOption)}
              </div>
            </div>
            <div className="border-t border-white/5 pt-2 mt-2">
              <div className="text-xs font-semibold text-amber-500/80 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Lossless / Hi-Fi
              </div>
              <div className="space-y-1">
                {lossless.map(renderOption)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QualitySelector;
