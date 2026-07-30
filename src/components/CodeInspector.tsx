import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Sparkles, Download, Layers } from 'lucide-react';
import { DriveFile } from '../types';

interface CodeInspectorProps {
  files: DriveFile[];
  selectedFile: DriveFile | null;
  onSelectFile: (file: DriveFile) => void;
  codeContent: string;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({
  files,
  selectedFile,
  onSelectFile,
  codeContent,
}) => {
  const [copied, setCopied] = useState(false);

  const codeFiles = files.filter(
    (f) =>
      f.name.endsWith('.html') ||
      f.name.endsWith('.css') ||
      f.name.endsWith('.js') ||
      f.name.endsWith('.json') ||
      f.mimeType.includes('text') ||
      f.mimeType.includes('json')
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Selector & Actions bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Code Inspector</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                {selectedFile?.name || 'selectează fișier'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Vizualizează codul sursă descărcat din Google Drive</p>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {codeFiles.map((file) => (
            <button
              key={file.id}
              onClick={() => onSelectFile(file)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedFile?.id === file.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-mono">
          Language: <span className="text-cyan-300 font-bold">{selectedFile?.name.split('.').pop()?.toUpperCase() || 'HTML'}</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            id="copy-code-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copiat!' : 'Copiază Codul'}</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs text-slate-200 relative">
        <pre className="p-4 overflow-x-auto max-h-[500px] leading-relaxed select-text">
          <code>{codeContent || '// Nu a fost încărcat cod pentru acest fișier.'}</code>
        </pre>
      </div>
    </div>
  );
};
