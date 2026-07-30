import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Download, ExternalLink, Film, Star, Clock, Tag } from 'lucide-react';
import { DriveFile } from '../types';

interface MoviePlayerModalProps {
  movie: DriveFile | null;
  onClose: () => void;
}

export const MoviePlayerModal: React.FC<MoviePlayerModalProps> = ({ movie, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!movie) return null;

  const streamUrl = `/api/drive/file/${movie.id}/media`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8 animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{movie.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}</span>
                <span className="px-2 py-0.5 text-[10px] bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                  Drive Cinema
                </span>
              </h2>
              <p className="text-xs text-slate-400">Streaming from IceMovieInSUmmerTime Google Drive</p>
            </div>
          </div>

          <button
            id="close-movie-player-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Screen */}
        <div className="bg-black relative aspect-video w-full flex items-center justify-center group overflow-hidden">
          {movie.id.startsWith('file_movie_') ? (
            // Simulated / Demo HTML5 Video player with custom poster
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
              <img
                src={movie.thumbnailLink || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'}
                alt={movie.name}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-3 text-xs text-cyan-300 font-semibold">
                    <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {movie.movieRating || '4.9 ★'}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {movie.movieDuration || '1h 45m'}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      {movie.movieGenre || 'Cinema de Vară'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{movie.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}</h3>
                  <p className="text-xs text-slate-300">
                    Sursa directă din Google Drive folderul <span className="text-cyan-400 font-mono">IceMovieInSUmmerTime</span>. Calitate HD cu sunet stereo surround.
                  </p>
                </div>
              </div>

              {/* Play Overlay Button */}
              <button
                id="toggle-play-pause-overlay-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute p-5 rounded-full bg-cyan-500 text-slate-950 shadow-2xl shadow-cyan-500/50 hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-slate-950" /> : <Play className="w-8 h-8 fill-slate-950 ml-1" />}
              </button>
            </div>
          ) : (
            // Native HTML5 Video element streaming from Google Drive proxy endpoint
            <video
              src={streamUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Footer Details */}
        <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 space-y-1">
            <p>
              MIME Type: <span className="font-mono text-slate-200">{movie.mimeType}</span>
            </p>
            <p>
              Size: <span className="font-mono text-slate-200">{(Number(movie.size || 0) / (1024 * 1024)).toFixed(1)} MB</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {movie.webContentLink && (
              <a
                href={movie.webContentLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Descarcă din Drive</span>
              </a>
            )}

            {movie.webViewLink && (
              <a
                href={movie.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow-md shadow-cyan-500/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Deschide în Drive</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
