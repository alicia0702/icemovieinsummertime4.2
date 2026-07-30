import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Upload, Image as ImageIcon, CheckCircle2, RotateCcw, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';
import { DriveFile } from '../types';

interface SponsorItem {
  id: string;
  name: string;
  website: string;
  websiteLabel: string;
  category: string;
  defaultLogoUrl?: string;
  driveKeywords: string[];
}

const INITIAL_SPONSORS: SponsorItem[] = [
  {
    id: 'sp_suceava',
    name: 'Consiliul Județean Suceava',
    website: 'https://www.cjsuceava.ro',
    websiteLabel: 'cjsuceava.ro',
    category: 'Partener Principal',
    driveKeywords: ['suceava', 'consiliul', 'cj'],
  },
  {
    id: 'sp_expertmusic',
    name: 'ExpertMusic.ro',
    website: 'https://www.expertmusic.ro',
    websiteLabel: 'expertmusic.ro',
    category: 'Partener Sonorizare',
    driveKeywords: ['expertmusic', 'expert', 'music'],
  },
  {
    id: 'sp_provideo',
    name: 'ProVideo Home Entertainment',
    website: 'https://provideo.ro',
    websiteLabel: 'provideo.ro',
    category: 'Partener Proiecție',
    driveKeywords: ['provideo', 'video'],
  },
  {
    id: 'sp_cff',
    name: 'Câmpulung Film Fest',
    website: 'https://www.instagram.com/campulungff/?utm_source=ig_web_button_share_sheet',
    websiteLabel: '@campulungff',
    category: 'Partener Cultural',
    driveKeywords: ['campulung', 'cff', 'film fest'],
  },
];

interface SponsorsSectionProps {
  driveFiles?: DriveFile[];
}

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({ driveFiles = [] }) => {
  // Custom uploaded sponsor logos stored in localStorage or memory
  const [customLogos, setCustomLogos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('icemovie_sponsor_logos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);

  // Save to localStorage whenever customLogos changes
  useEffect(() => {
    try {
      localStorage.setItem('icemovie_sponsor_logos', JSON.stringify(customLogos));
    } catch (e) {
      console.error('Failed to save sponsor logos:', e);
    }
  }, [customLogos]);

  // Handle uploading an original image file from computer
  const handleFileUpload = (sponsorId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomLogos((prev) => ({
            ...prev,
            [sponsorId]: e.target!.result as string,
          }));
          setEditingSponsorId(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Find matching image from Google Drive if available
  const getDriveImageUrl = (sponsor: SponsorItem): string | null => {
    if (!driveFiles || driveFiles.length === 0) return null;
    
    // Look for drive files that are images and match sponsor keywords
    const imageFiles = driveFiles.filter((f) => 
      f.mimeType?.startsWith('image/') || 
      /\.(jpg|jpeg|png|svg|webp)$/i.test(f.name)
    );

    for (const kw of sponsor.driveKeywords) {
      const match = imageFiles.find((f) => f.name.toLowerCase().includes(kw));
      if (match) {
        return `/api/drive/file/${match.id}/media`;
      }
    }

    return null;
  };

  const getSponsorLogoUrl = (sponsor: SponsorItem): string | null => {
    // 1. Check custom uploaded original image
    if (customLogos[sponsor.id]) {
      return customLogos[sponsor.id];
    }
    // 2. Check matched Google Drive image
    const driveUrl = getDriveImageUrl(sponsor);
    if (driveUrl) {
      return driveUrl;
    }
    // 3. Default logo if available
    return sponsor.defaultLogoUrl || null;
  };

  const handleResetLogo = (sponsorId: string) => {
    setCustomLogos((prev) => {
      const next = { ...prev };
      delete next[sponsorId];
      return next;
    });
  };

  return (
    <div className="bg-white border-2 border-[#1D9999]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#1D9999] text-white font-black shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Sponsorii & Partenerii Noștri</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F08373]/15 text-[#b84838] text-[10px] font-extrabold border border-[#F08373]/30">
                Ediția IV 2026
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Mulțumim partenerilor noștri speciali pentru susținerea festivalului IceMovie In SummerTime!
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#1D9999]" />
          <span>Poze originale (Google Drive / Upload)</span>
        </div>
      </div>

      {/* Sponsors Grid - Clean layout rendering exact original images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {INITIAL_SPONSORS.map((sponsor) => {
          const logoUrl = getSponsorLogoUrl(sponsor);
          const isDriveImage = !customLogos[sponsor.id] && getDriveImageUrl(sponsor);

          return (
            <div
              key={sponsor.id}
              className="bg-slate-900 border border-slate-800 hover:border-[#1D9999] rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 shadow-lg group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1D9999]/10 rounded-full blur-2xl group-hover:bg-[#1D9999]/20 transition-all"></div>

              {/* Top Controls Bar */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F08373] bg-[#F08373]/10 px-2 py-0.5 rounded">
                  {sponsor.category}
                </span>

                <div className="flex items-center gap-1">
                  {/* Upload button for original photo */}
                  <label
                    htmlFor={`upload-${sponsor.id}`}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                    title="Încarcă poza originală (JPG / PNG)"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <input
                      type="file"
                      id={`upload-${sponsor.id}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(sponsor.id, e)}
                    />
                  </label>

                  {customLogos[sponsor.id] && (
                    <button
                      onClick={() => handleResetLogo(sponsor.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                      title="Resetează sigla"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title={`Vizitează ${sponsor.name}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  </a>
                </div>
              </div>

              {/* Logo Display Area */}
              <div className="w-full h-32 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex flex-col items-center justify-center relative z-10 group-hover:border-slate-700 transition-colors">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`Sigla Oficială ${sponsor.name}`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-2 space-y-1">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                    <span className="text-xs font-bold text-slate-300 block">{sponsor.name}</span>
                    <span className="text-[10px] text-slate-500 block">
                      Apasă <Upload className="w-3 h-3 inline text-cyan-400" /> pentru a încărca poza originală
                    </span>
                  </div>
                )}
              </div>

              {/* Footer Info */}
              <div className="pt-2 border-t border-slate-800/80 w-full flex items-center justify-between z-10">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-200 block truncate">{sponsor.name}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    {isDriveImage && <HardDrive className="w-3 h-3 text-cyan-400 inline" />}
                    {sponsor.websiteLabel}
                  </span>
                </div>

                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-[#1D9999] bg-[#1D9999]/10 px-2.5 py-1 rounded-lg group-hover:bg-[#1D9999] group-hover:text-white transition-all shrink-0"
                >
                  Deschide
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

