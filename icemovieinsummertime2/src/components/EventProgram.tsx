import React from 'react';
import { Calendar, Film, Clock, MapPin, Ticket, Sparkles, Heart } from 'lucide-react';
import { FESTIVAL_PROGRAM } from '../data/initialData';
import { SponsorsSection } from './SponsorsSection';

export const EventProgram: React.FC = () => {
  const week1Movies = FESTIVAL_PROGRAM.filter((m) => m.week === 'Week 1');
  const week2Movies = FESTIVAL_PROGRAM.filter((m) => m.week === 'Week 2');

  return (
    <div className="space-y-8">
      {/* Hero Banner for Program */}
      <div className="bg-white border-2 border-[#1D9999]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden ice-condensation-border">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D9999]/15 border border-[#1D9999]/30 text-[#1D9999] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#F08373]" />
            <span>Programul Oficial • Ediția a IV-a</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            IceMovie In SummerTime <span className="text-[#F08373]">2026</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Organizat cu drag de <strong className="text-slate-900">Asociația Hope 4 Humanity</strong>. Te așteptăm în aer liber la cele două weekenduri de cinema sub cerul înstelat! Accesul este gratuit.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#1D9999]/30 font-bold">
              <Calendar className="w-4 h-4 text-[#F08373]" />
              <span>Week 1 (31 Iul - 2 Aug) • Week 2 (28 - 30 Aug)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#1D9999]/30">
              <Ticket className="w-4 h-4 text-[#1D9999]" />
              <span>Intrare Gratuită • Popcorn Cadou</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week 1 Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b-2 border-[#1D9999]/20">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#1D9999] text-white font-extrabold text-xs shadow-sm">
            WEEK 1
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1D9999]" />
            <span>31 Iulie – 2 August 2026</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {week1Movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-[#1D9999]/60 transition-all flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold text-[#b84838] border border-[#F08373]/30">
                  {movie.day}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#1D9999] text-white font-black rounded-full text-xs shadow-md">
                  {movie.rating}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1D9999]" />
                      {movie.time} ({movie.duration})
                    </span>
                    <span className="text-[#1D9999] font-semibold">{movie.genre}</span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 group-hover:text-[#F08373] transition-colors">
                    {movie.title}
                  </h4>

                  {movie.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[#F08373] font-bold bg-[#F08373]/10 px-2.5 py-1 rounded-lg border border-[#F08373]/20">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{movie.location}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#F08373] font-semibold flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-[#F08373]" />
                    Asociația Hope 4 Humanity
                  </span>
                  <span className="text-slate-500">Ediția IV</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Week 2 Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3 pb-2 border-b-2 border-[#F08373]/20">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#F08373] text-white font-extrabold text-xs shadow-sm">
            WEEK 2
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F08373]" />
            <span>28 August – 30 August 2026</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {week2Movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-[#F08373]/60 transition-all flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold text-[#1D9999] border border-[#1D9999]/30">
                  {movie.day}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#F08373] text-white font-black rounded-full text-xs shadow-md">
                  {movie.rating}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F08373]" />
                      {movie.time} ({movie.duration})
                    </span>
                    <span className="text-[#F08373] font-semibold">{movie.genre}</span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 group-hover:text-[#1D9999] transition-colors">
                    {movie.title}
                  </h4>

                  {movie.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[#1D9999] font-bold bg-[#1D9999]/10 px-2.5 py-1 rounded-lg border border-[#1D9999]/20">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{movie.location}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#F08373] font-semibold flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-[#F08373]" />
                    Asociația Hope 4 Humanity
                  </span>
                  <span className="text-slate-500">Ediția IV</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Sponsors & Partners */}
      <div className="pt-6">
        <SponsorsSection />
      </div>
    </div>
  );
};

