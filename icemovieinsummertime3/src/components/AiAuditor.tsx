import React, { useState } from 'react';
import { Sparkles, Bot, Loader2, RefreshCw, CheckCircle2, Rocket, Code, Star } from 'lucide-react';
import { DriveFile } from '../types';

interface AiAuditorProps {
  files: DriveFile[];
  htmlContent: string;
}

export const AiAuditor: React.FC<AiAuditorProps> = ({ files, htmlContent }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAudit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: 'IceMovieInSUmmerTime',
          files: files.map((f) => ({ name: f.name, size: f.size, mimeType: f.mimeType })),
          htmlContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI analysis failed');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Eroare la conectarea cu Gemini AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Gemini AI Audit & Review</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Gemini 2.5 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Auditează codul și fișierele site-ului <span className="text-cyan-300 font-mono">IceMovieInSUmmerTime</span>
            </p>
          </div>
        </div>

        <button
          id="run-ai-audit-btn"
          onClick={handleRunAudit}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Se analizează cu Gemini...</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>{analysis ? 'Re-Rulează Analiza Gemini' : 'Pornește Analiza Site-ului'}</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Output */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {!analysis && !isLoading && !error && (
        <div className="p-8 bg-slate-950/60 border border-slate-800 rounded-2xl text-center space-y-4">
          <Bot className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-bold text-slate-200">Gata de analizat IceMovieInSUmmerTime!</h3>
            <p className="text-xs text-slate-400">
              Apasă butonul de mai sus pentru ca inteligența artificială Gemini să scaneze structura HTML, fișierele MP4 și stilurile CSS din Google Drive.
            </p>
          </div>
        </div>
      )}

      {analysis && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 leading-relaxed text-sm text-slate-200">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Raportul Generat de Gemini AI</span>
          </div>
          <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
};
