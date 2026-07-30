import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, RotateCcw, ExternalLink, Code, Layers, Sparkles } from 'lucide-react';
import { DriveFile } from '../types';

interface WebsitePreviewIframeProps {
  htmlFile: DriveFile | null;
  htmlContent: string;
  onRefreshContent: () => void;
  onViewCode: () => void;
}

export const WebsitePreviewIframe: React.FC<WebsitePreviewIframeProps> = ({
  htmlFile,
  htmlContent,
  onRefreshContent,
  onViewCode,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{htmlFile?.name || 'index.html'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Live Drive Sandbox
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Rendering HTML page from Google Drive <span className="text-cyan-400 font-mono">IceMovieInSUmmerTime</span>
            </p>
          </div>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="viewport-desktop-btn"
            onClick={() => setDevice('desktop')}
            title="Desktop View"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              device === 'desktop' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            id="viewport-tablet-btn"
            onClick={() => setDevice('tablet')}
            title="Tablet View"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              device === 'tablet' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            id="viewport-mobile-btn"
            onClick={() => setDevice('mobile')}
            title="Mobile View"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              device === 'mobile' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            id="refresh-iframe-btn"
            onClick={onRefreshContent}
            className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            title="Reload Preview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            id="inspect-code-btn"
            onClick={onViewCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Source</span>
          </button>
          {htmlFile?.webViewLink && (
            <a
              href={htmlFile.webViewLink}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
              title="Open in Google Drive"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-center items-center min-h-[600px] shadow-2xl relative">
        <div className={`transition-all duration-300 ${getWidth()} h-[650px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl flex flex-col`}>
          {/* Mock Browser Header */}
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="flex-1 bg-slate-950 text-slate-400 text-xs px-3 py-1 rounded-md font-mono border border-slate-800/80 truncate">
              https://drive.google.com/icemovieinsummertime/{htmlFile?.name || 'index.html'}
            </div>
          </div>

          {/* Render Iframe Sandbox */}
          {htmlContent ? (
            <iframe
              title="IceMovieInSUmmerTime Preview"
              srcDoc={htmlContent}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full bg-white border-0"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
              <p className="text-sm font-semibold">Loading website preview from Google Drive...</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Fetching HTML content for IceMovieInSUmmerTime. If your Drive folder contains custom files, connect Drive above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
