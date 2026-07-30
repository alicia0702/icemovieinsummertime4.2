import React from 'react';
import { Film, HardDrive, RefreshCw, LogOut, CheckCircle2, Sparkles, Code2, Play, Eye, FolderTree } from 'lucide-react';
import { AuthStatusResponse, ViewTab } from '../types';

interface NavbarProps {
  authStatus: AuthStatusResponse | null;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onRefresh: () => void;
  onConnectDrive: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  authStatus,
  activeTab,
  setActiveTab,
  onRefresh,
  onConnectDrive,
  onLogout,
  isRefreshing,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                IceMovieInSUmmerTime
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Drive Hub
              </span>
            </div>
            <p className="text-xs text-slate-400">Google Drive Website Inspector & Cinema Portal</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-medium">
          <button
            id="tab-preview-btn"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Site Live</span>
          </button>

          <button
            id="tab-movies-btn"
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'movies'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Movie Player</span>
          </button>

          <button
            id="tab-explorer-btn"
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'explorer'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Drive Files</span>
          </button>

          <button
            id="tab-code-btn"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'code'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Viewer</span>
          </button>

          <button
            id="tab-ai-audit-btn"
            onClick={() => setActiveTab('ai-audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ai-audit'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Review</span>
          </button>
        </div>

        {/* Right side controls: Refresh & Drive Auth Status */}
        <div className="flex items-center gap-2">
          <button
            id="refresh-drive-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Google Drive files"
            className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {authStatus?.authenticated ? (
            <div className="flex items-center gap-2 bg-slate-800/90 pl-3 pr-2 py-1.5 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">
                  {authStatus.user?.name || 'Google Drive Connected'}
                </p>
                <p className="text-[10px] text-slate-400">{authStatus.user?.email || 'Readonly Scope Active'}</p>
              </div>
              <button
                id="logout-btn"
                onClick={onLogout}
                title="Disconnect Google Drive"
                className="ml-2 p-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="connect-drive-header-btn"
              onClick={onConnectDrive}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
            >
              <HardDrive className="w-4 h-4" />
              <span>Connect Drive</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
