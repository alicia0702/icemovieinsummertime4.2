import React, { useState } from 'react';
import { Folder, FileCode, Film, FileText, Download, ExternalLink, Play, Eye, Search, Filter } from 'lucide-react';
import { DriveFile } from '../types';

interface DriveFolderTreeProps {
  files: DriveFile[];
  onSelectFile: (file: DriveFile) => void;
  onPlayMovie: (file: DriveFile) => void;
  folderName: string;
}

export const DriveFolderTree: React.FC<DriveFolderTreeProps> = ({
  files,
  onSelectFile,
  onPlayMovie,
  folderName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'html' | 'video' | 'data'>('all');

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (typeFilter === 'all') return matchesSearch;
    if (typeFilter === 'html') return matchesSearch && (f.name.endsWith('.html') || f.name.endsWith('.css') || f.name.endsWith('.js'));
    if (typeFilter === 'video') return matchesSearch && (f.mimeType.includes('video') || f.name.endsWith('.mp4') || f.isMovie);
    if (typeFilter === 'data') return matchesSearch && (f.name.endsWith('.json') || f.mimeType.includes('json'));
    return matchesSearch;
  });

  const getFileIcon = (file: DriveFile) => {
    if (file.mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-400" />;
    if (file.mimeType.includes('video') || file.name.endsWith('.mp4') || file.isMovie)
      return <Film className="w-5 h-5 text-cyan-400" />;
    if (file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js'))
      return <FileCode className="w-5 h-5 text-sky-400" />;
    return <FileText className="w-5 h-5 text-slate-400" />;
  };

  const formatSize = (bytesStr?: string) => {
    if (!bytesStr) return '—';
    const bytes = Number(bytesStr);
    if (isNaN(bytes)) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Folder Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{folderName}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                {files.length} elemente
              </span>
            </h2>
            <p className="text-xs text-slate-400">Structura fișierelor din Google Drive pentru site-ul tău</p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              typeFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Toate
          </button>
          <button
            onClick={() => setTypeFilter('html')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              typeFilter === 'html' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Web Code
          </button>
          <button
            onClick={() => setTypeFilter('video')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              typeFilter === 'video' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Filme (MP4)
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Caută fișiere în IceMovieInSUmmerTime..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Files Table / List */}
      <div className="divide-y divide-slate-800/60 border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/50">
        {filteredFiles.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Nu au fost găsite fișiere care să se potrivească cu căutarea ta.
          </div>
        ) : (
          filteredFiles.map((file) => {
            const isMovie = file.mimeType.includes('video') || file.name.endsWith('.mp4') || file.isMovie;
            const isCode = file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js') || file.name.endsWith('.json');

            return (
              <div
                key={file.id}
                className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/50">
                    {getFileIcon(file)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span>{formatSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Drive File'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isMovie && (
                    <button
                      onClick={() => onPlayMovie(file)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Rulează</span>
                    </button>
                  )}

                  {isCode && (
                    <button
                      onClick={() => onSelectFile(file)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cod Sursă</span>
                    </button>
                  )}

                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
                      title="Deschide în Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
