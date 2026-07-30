import React, { useState } from 'react';
import { HardDrive, KeyRound, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthStatusResponse } from '../types';

interface DriveConnectBannerProps {
  authStatus: AuthStatusResponse | null;
  onConnectDrive: () => void;
  onManualTokenSubmit: (token: string) => void;
  isLoading: boolean;
}

export const DriveConnectBanner: React.FC<DriveConnectBannerProps> = ({
  authStatus,
  onConnectDrive,
  onManualTokenSubmit,
  isLoading,
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualToken, setManualToken] = useState('');

  if (authStatus?.authenticated) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-300">Google Drive Connected</h3>
            <p className="text-xs text-slate-300">
              Accessing website assets and movie files in folder <span className="font-mono text-cyan-300">IceMovieInSUmmerTime</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>https://www.googleapis.com/auth/drive.readonly</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Google Drive Workspace Integration</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            Inspect & Launch Your <span className="text-cyan-400">IceMovieInSUmmerTime</span> Drive Website
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Connect your Google Drive account to list, preview, analyze, and stream HTML pages, CSS styles, JavaScript files, and movie videos inside your <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono">IceMovieInSUmmerTime</code> Google Drive folder.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <button
            id="connect-drive-banner-btn"
            onClick={onConnectDrive}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Connect Google Drive</span>
          </button>

          <button
            id="toggle-manual-token-btn"
            onClick={() => setShowManualInput(!showManualInput)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{showManualInput ? 'Hide Manual Token' : 'Use Access Token'}</span>
          </button>
        </div>
      </div>

      {showManualInput && (
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              id="manual-access-token-input"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Paste Google Drive OAuth Access Token (ya29...)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            id="submit-manual-token-btn"
            onClick={() => {
              if (manualToken.trim()) {
                onManualTokenSubmit(manualToken.trim());
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors w-full sm:w-auto"
          >
            Verify Token
          </button>
        </div>
      )}
    </div>
  );
};
