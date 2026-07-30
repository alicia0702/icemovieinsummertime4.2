import React, { useState, useEffect } from 'react';
import { Film, Snowflake, Sparkles, MapPin, Calendar, Heart, Volume2, Users, PartyPopper, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { SponsorsSection } from './SponsorsSection';
import { PhotoGallerySection } from './PhotoGallerySection';
import { getMainLogoUrl, setMainLogoUrl } from '../utils/logoStorage';
import { DriveFile } from '../types';

interface AboutFestivalSectionProps {
  driveFiles?: DriveFile[];
}

export const AboutFestivalSection: React.FC<AboutFestivalSectionProps> = ({ driveFiles = [] }) => {
  const [logoUrl, setLogoUrl] = useState<string>(() => getMainLogoUrl(driveFiles));

  useEffect(() => {
    setLogoUrl(getMainLogoUrl(driveFiles));

    const handleLogoUpdate = () => {
      setLogoUrl(getMainLogoUrl(driveFiles));
    };

    window.addEventListener('icemovie_logo_changed', handleLogoUpdate);
    return () => window.removeEventListener('icemovie_logo_changed', handleLogoUpdate);
  }, [driveFiles]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setMainLogoUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner with Official Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white border-2 border-[#1D9999]/30 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden ice-condensation-border"
      >
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-[#1D9999]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -top-12 w-72 h-72 bg-[#F08373]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D9999]/15 border border-[#1D9999]/35 text-[#1D9999] text-xs font-bold backdrop-blur-md">
              <Snowflake className="w-4 h-4 text-[#1D9999] animate-spin" style={{ animationDuration: '15s' }} />
              <span>Proiect Comunitar H4H • Ediția IV 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Despre <span className="bg-gradient-to-r from-[#1D9999] via-[#F08373] to-[#1D9999] bg-clip-text text-transparent">Ice Movie in Summertime</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              Ice Movie in Summertime este un proiect comunitar organizat de H4H – Hope 4 Humanity, care aduce oamenii împreună prin seri de film în aer liber și activități interactive pentru toate vârstele. Evenimentul îmbină distracția cu implicarea în comunitate, oferind participanților ocazia să descopere organizații locale, să participe la jocuri și ateliere, să socializeze și să se bucure de seri de vară într-o atmosferă prietenoasă și relaxată. Prin acest proiect, ne dorim să transformăm spațiile publice în locuri de întâlnire, conectare și experiențe memorabile pentru întreaga comunitate.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                <Calendar className="w-4 h-4 text-[#F08373]" />
                <span>Iulie - August 2026</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                <MapPin className="w-4 h-4 text-[#1D9999]" />
                <span>Suceava & Câmpulung Moldovenesc</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#1D9999]" />
                <span>Ateliere & Cinema Aer Liber</span>
              </div>
            </div>
          </div>

          {/* Official Logo Display */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group max-w-[260px] w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1D9999] to-[#F08373] rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl flex flex-col items-center text-center space-y-3">
                <img
                  src={logoUrl}
                  alt="Ice Movie in Summertime Logo Official"
                  className="w-44 h-44 object-contain"
                  referrerPolicy="no-referrer"
                />

                <label
                  htmlFor="festival-logo-upload"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1D9999] bg-[#1D9999]/10 hover:bg-[#1D9999] hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Schimbă Sigla Originală</span>
                  <input
                    type="file"
                    id="festival-logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="bg-white border border-slate-200 hover:border-[#1D9999]/50 rounded-2xl p-6 space-y-3 shadow-sm transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#1D9999]/15 text-[#1D9999] flex items-center justify-center font-black">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Seri de Film în Aer Liber</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Proiecții cinematografice în aer liber sub cerul înstelat al verii, într-o atmosferă primitoare, ideală pentru familie și prieteni.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="bg-white border border-slate-200 hover:border-[#F08373]/50 rounded-2xl p-6 space-y-3 shadow-sm transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F08373]/15 text-[#F08373] flex items-center justify-center font-black">
            <PartyPopper className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Jocuri & Ateliere Interactive</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Activități pline de energie, jocuri de societate, ateliere creative și momente speciale pregătite de echipa noastră de voluntari.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="bg-white border border-slate-200 hover:border-[#1D9999]/50 rounded-2xl p-6 space-y-3 shadow-sm transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#1D9999]/15 text-[#1D9999] flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Conectare Comunitară</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ocazia ideală de a descoperi organizații locale, de a cunoaște oameni noi și de a transforma spațiile publice în locuri pline de viață.
          </p>
        </motion.div>
      </div>

      {/* Galerie Foto Edițiile Anterioare */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <PhotoGallerySection driveFiles={driveFiles} />
      </motion.div>

      {/* Parteneri & Sponsori */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <SponsorsSection driveFiles={driveFiles} />
      </motion.div>
    </div>
  );
};
