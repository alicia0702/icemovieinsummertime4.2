import React, { useState } from 'react';
import { Camera, HardDrive, Image as ImageIcon, Sparkles, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DriveFile } from '../types';

interface PhotoGallerySectionProps {
  driveFiles?: DriveFile[];
}

interface CustomPhoto {
  id: string;
  name: string;
  url: string;
  source: 'drive' | 'upload';
  date?: string;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ driveFiles = [] }) => {
  const [uploadedPhotos] = useState<CustomPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('icemovie_uploaded_gallery_photos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedPhoto, setSelectedPhoto] = useState<CustomPhoto | null>(null);

  // Extract drive image files
  const drivePhotos: CustomPhoto[] = driveFiles
    .filter((f) => {
      const isImage = f.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name);
      return isImage;
    })
    .map((f) => ({
      id: f.id,
      name: f.name,
      url: `/api/drive/file/${f.id}/media`,
      source: 'drive' as const,
      date: f.createdTime ? new Date(f.createdTime).toLocaleDateString('ro-RO') : undefined,
    }));

  const allPhotos = [...drivePhotos, ...uploadedPhotos];

  return (
    <div className="bg-white border-2 border-[#1D9999]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#1D9999]/10 rounded-2xl text-[#1D9999] shadow-inner">
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
                Galerie Foto – Edițiile Anterioare Ice Movie
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1D9999]/15 text-[#1D9999] text-[10px] font-extrabold border border-[#1D9999]/30">
                Arhivă Oficială ({allPhotos.length} poze)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fotografii din edițiile anterioare ale festivalului IceMovie In SummerTime
            </p>
          </div>
        </div>

        {allPhotos.length > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            <span>Galerie Sincronizată</span>
          </motion.div>
        )}
      </div>

      {/* Gallery Photos Grid */}
      {allPhotos.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-700 font-heading">Galeria Foto este în curs de încărcare</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Sincronizează fișierele Google Drive pentru a afișa imaginile din folderul <strong className="text-slate-700">IceMovie</strong>.
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20px' }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {allPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              variants={{
                hidden: { opacity: 0, y: 15, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Source Tag Badge */}
              <div className="absolute top-2 left-2 z-10">
                {photo.source === 'drive' ? (
                  <span className="bg-slate-900/80 backdrop-blur-md text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-cyan-500/30 flex items-center gap-1 shadow">
                    <HardDrive className="w-3 h-3" /> Drive
                  </span>
                ) : (
                  <span className="bg-slate-900/80 backdrop-blur-md text-[#F08373] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#F08373]/30 flex items-center gap-1 shadow">
                    <Camera className="w-3 h-3" /> Amintire
                  </span>
                )}
              </div>

              {/* Hover Details Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
                <span className="text-white text-xs font-bold line-clamp-1">{photo.name}</span>
                {photo.date && <span className="text-[10px] text-slate-300">{photo.date}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Lightbox Photo Preview Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl p-3 border border-slate-800 shadow-2xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image display */}
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="max-h-[75vh] w-auto object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />

              {/* Footer details */}
              <div className="w-full pt-3 px-2 flex items-center justify-between text-white">
                <div>
                  <h4 className="text-sm font-bold font-heading">{selectedPhoto.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Sursă: {selectedPhoto.source === 'drive' ? 'Google Drive (Folder IceMovie)' : 'Imagine Arhivată'}</span>
                    {selectedPhoto.date && <span>• {selectedPhoto.date}</span>}
                  </p>
                </div>

                <a
                  href={selectedPhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-[#1D9999] hover:bg-[#137373] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg"
                >
                  <span>Mărește</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
