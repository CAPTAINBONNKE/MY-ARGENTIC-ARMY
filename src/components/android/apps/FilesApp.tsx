import React, { useState } from 'react';
import { Folder, FileText, Image as ImageIcon, FileCode, ArrowLeft, Search, Plus, HardDrive, Download, Eye, X } from 'lucide-react';
import { VirtualFileItem } from '../../../types/androidAgent';

interface FilesAppProps {
  files: VirtualFileItem[];
  onReadFile?: (file: VirtualFileItem) => void;
  onCreateFile?: (newFile: VirtualFileItem) => void;
}

export const FilesApp: React.FC<FilesAppProps> = ({ files, onReadFile }) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('Download');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilePreview, setActiveFilePreview] = useState<VirtualFileItem | null>(null);

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="w-5 h-5 text-slate-400" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-400" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-5 h-5 text-purple-400" />;
    if (mimeType.includes('csv') || mimeType.includes('json')) return <FileCode className="w-5 h-5 text-emerald-400" />;
    return <FileText className="w-5 h-5 text-amber-400" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes > 1000000) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes > 1000) return `${(bytes / 1000).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const filteredFiles = files.filter(f => 
    f.path.toLowerCase().includes(selectedFolder.toLowerCase()) &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="app-files" className="flex flex-col h-full bg-slate-950 text-slate-100 select-none relative">
      {/* Top Bar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-100">Files & Storage</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full">
            Internal • 64.2 GB Free
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            id="files-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, downloads..."
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-xs"
          />
        </div>

        {/* Folder Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['Download', 'Documents', 'DCIM'].map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                selectedFolder === folder
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              /{folder}
            </button>
          ))}
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => (
            <div
              key={file.id}
              id={`file-item-${file.id}`}
              onClick={() => {
                setActiveFilePreview(file);
                if (onReadFile) onReadFile(file);
              }}
              className="flex items-center justify-between p-2.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-amber-500/40">
                  {getFileIcon(file.mimeType)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-amber-300">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>{formatSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.lastModified}</span>
                  </div>
                </div>
              </div>

              <button className="p-1 text-slate-500 hover:text-amber-400">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Folder className="w-10 h-10 mx-auto opacity-40 mb-2" />
            <p className="text-xs">No files found in /{selectedFolder}</p>
          </div>
        )}
      </div>

      {/* File Content Preview Modal */}
      {activeFilePreview && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col p-3 border-t border-amber-500/30">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 truncate">
              {getFileIcon(activeFilePreview.mimeType)}
              <h3 className="text-xs font-bold text-slate-100 truncate">{activeFilePreview.name}</h3>
            </div>
            <button
              onClick={() => setActiveFilePreview(null)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 my-2 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
            {activeFilePreview.content || 'Binary data or media asset preview.'}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Path: {activeFilePreview.path}</span>
            <span className="font-mono text-amber-400">{formatSize(activeFilePreview.size)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
