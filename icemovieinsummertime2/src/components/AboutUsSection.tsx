import React, { useState, useEffect } from 'react';
import { Heart, Users, Target, Lightbulb, Sparkles, Compass, Smile, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { getMainLogoUrl, getH4HLogoUrl, setH4HLogoUrl } from '../utils/logoStorage';
import IceMovieLogo from "../assets/images/ice_movie_logo_1785176719378.jpg";
import H4HLogo from "../assets/images/logo.png";

export const AboutUsSection: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState(IceMovieLogo);
const [h4hLogoUrl, setH4HLogoUrl] = useState(H4HLogo);

  useEffect(() => {
  setLogoUrl(getMainLogoUrl(driveFiles));
  setH4hLogoUrl(getH4HLogoUrl(driveFiles));

  const handleLogoUpdate = () => {
    setLogoUrl(getMainLogoUrl(driveFiles));
    setH4hLogoUrl(getH4HLogoUrl(driveFiles));
  };

  window.addEventListener("icemovie_logo_changed", handleLogoUpdate);

  return () => {
    window.removeEventListener("icemovie_logo_changed", handleLogoUpdate);
  };

  const handleH4HUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setH4HLogoUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white border-2 border-[#F08373]/30 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden ice-condensation-border"
      >
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-[#F08373]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -top-12 w-72 h-72 bg-[#1D9999]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F08373]/15 border border-[#F08373]/35 text-[#b84838] text-xs font-bold backdrop-blur-md">
              <Heart className="w-4 h-4 text-[#F08373] fill-[#F08373]" />
              <span>Asociație de Tineret • Suceava</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Despre <span className="bg-gradient-to-r from-[#F08373] via-[#1D9999] to-[#F08373] bg-clip-text text-transparent">H4H – Hope 4 Humanity</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              H4H – Hope 4 Humanity este o asociație de tineret în care tinerii organizează activități pentru alți tineri. Ne dorim să oferim oportunități de învățare, dezvoltare și implicare prin proiecte, ateliere, schimburi de tineri, voluntariat și alte activități interesante. Credem că fiecare tânăr are potențial, iar misiunea noastră este să îl ajutăm să își descopere abilitățile, să își facă prieteni noi și să contribuie la o comunitate mai bună.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-center shadow-sm">
                <span className="text-2xl font-black text-[#F08373] block">Tineri</span>
                <span className="text-[11px] font-bold text-slate-600">Pentru Tineri</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-center shadow-sm">
                <span className="text-2xl font-black text-[#1D9999] block">Proiecte</span>
                <span className="text-[11px] font-bold text-slate-600">& Ateliere</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-center shadow-sm">
                <span className="text-2xl font-black text-[#F08373] block">Schimburi</span>
                <span className="text-[11px] font-bold text-slate-600">De Tineri</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-center shadow-sm">
                <span className="text-2xl font-black text-[#1D9999] block">100%</span>
                <span className="text-[11px] font-bold text-slate-600">Voluntariat</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group max-w-[240px] w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F08373] to-[#1D9999] rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl flex flex-col items-center text-center space-y-3">
                <img
                  src={h4hLogoUrl || logoUrl}
                  alt="H4H Hope 4 Humanity Logo Official"
                  className="w-40 h-40 object-contain rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F08373]">
                  Sigla Oficială H4H
                </span>

                <label
                  htmlFor="aboutus-h4h-logo-upload"
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#F08373] bg-[#F08373]/10 hover:bg-[#F08373] hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Schimbă Sigla H4H</span>
                  <input
                    type="file"
                    id="aboutus-h4h-logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleH4HUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Values & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="bg-white border border-slate-200 hover:border-[#F08373]/50 rounded-2xl p-6 space-y-3 shadow-sm transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F08373]/15 text-[#F08373] flex items-center justify-center font-black">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Dezvoltare & Abilități</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Oferim cadrul ideal pentru ca fiecare tânăr să își descopere talentul, să învețe abilități noi și să câștige încredere în sine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="bg-white border border-slate-200 hover:border-[#1D9999]/50 rounded-2xl p-6 space-y-3 shadow-sm transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#1D9999]/15 text-[#1D9999] flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Prietenie & Voluntariat</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Creează prietenii de lungă durată, lucrează în echipă și implică-te activ în proiecte cu impact real în comunitate.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="bg-white border border-slate-200 hover:border-[#F08373]/50 rounded-2xl p-6 space-y-3 shadow-sm transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F08373]/15 text-[#F08373] flex items-center justify-center font-black">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Oportunități Internaționale</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Organizăm și participăm la schimburi de tineri, ateliere culturale și stagii de voluntariat în țară și în străinătate.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
};