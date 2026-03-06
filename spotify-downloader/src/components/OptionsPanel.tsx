import React from 'react';
import { Image, Tag, FolderOpen, Settings2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface OptionsPanelProps {
  downloadCovers: boolean;
  onToggleCovers: () => void;
  embedMetadata: boolean;
  onToggleMetadata: () => void;
  createFolder: boolean;
  onToggleFolder: () => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  downloadCovers,
  onToggleCovers,
  embedMetadata,
  onToggleMetadata,
  createFolder,
  onToggleFolder,
}) => {
  const toggles = [
    {
      label: 'Download Album Covers',
      description: 'Save album artwork as separate image files',
      icon: Image,
      value: downloadCovers,
      onChange: onToggleCovers,
      color: 'purple',
    },
    {
      label: 'Embed Metadata',
      description: 'Include title, artist, album info in files',
      icon: Tag,
      value: embedMetadata,
      onChange: onToggleMetadata,
      color: 'blue',
    },
    {
      label: 'Organize in Folders',
      description: 'Create Artist/Album folder structure',
      icon: FolderOpen,
      value: createFolder,
      onChange: onToggleFolder,
      color: 'emerald',
    },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-green-400" />
        Download Options
      </label>
      <div className="space-y-2">
        {toggles.map((toggle) => (
          <button
            key={toggle.label}
            onClick={toggle.onChange}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
              toggle.value
                ? "bg-white/[0.05] border-green-500/20"
                : "bg-white/[0.02] border-white/5 hover:border-white/10"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              toggle.color === 'purple' && "bg-purple-500/20 text-purple-400",
              toggle.color === 'blue' && "bg-blue-500/20 text-blue-400",
              toggle.color === 'emerald' && "bg-emerald-500/20 text-emerald-400",
            )}>
              <toggle.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{toggle.label}</div>
              <div className="text-xs text-gray-500">{toggle.description}</div>
            </div>
            <div className={cn(
              "w-10 h-6 rounded-full relative transition-all shrink-0",
              toggle.value ? "bg-green-500" : "bg-gray-700"
            )}>
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                toggle.value ? "left-5" : "left-1"
              )} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionsPanel;
