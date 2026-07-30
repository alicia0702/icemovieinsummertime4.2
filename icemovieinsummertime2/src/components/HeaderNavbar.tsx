import React, { useState, useEffect } from 'react';
import { Film, UserCheck, Calendar, Database, HardDrive, Heart, Sparkles, CheckCircle2, Lock, Unlock, ShieldCheck, Info, Users, Mail, Upload } from 'lucide-react';
import { ActiveTab, CheckInStats, DriveFile } from '../types';
import { getMainLogoUrl, setMainLogoUrl, getH4HLogoUrl, setH4HLogoUrl } from '../utils/logoStorage';

interface HeaderNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: CheckInStats;
  isDriveConnected: boolean;
  isAdminUnlocked: boolean;
  onAdminClick: () => void;
  onLockAdmin: () => void;
  showSecretTabs: boolean;
  driveFiles?: DriveFile[];
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  isDriveConnected,
  isAdminUnlocked,
  onAdminClick,
  onLockAdmin,
  showSecretTabs,
  driveFiles = [],
}) => {
  const percentage = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>(() => getMainLogoUrl(driveFiles));
  const [h4hLogoUrl, setH4hLogoUrl] = useState<string | null>(() => getH4HLogoUrl(driveFiles));

  useEffect(() => {
    setCurrentLogoUrl(getMainLogoUrl(driveFiles));
    setH4hLogoUrl(getH4HLogoUrl(driveFiles));

    const handleLogoUpdate = () => {
      setCurrentLogoUrl(getMainLogoUrl(driveFiles));
      setH4hLogoUrl(getH4HLogoUrl(driveFiles));
    };

    window.addEventListener('icemovie_logo_changed', handleLogoUpdate);
    return () => window.removeEventListener('icemovie_logo_changed', handleLogoUpdate);
  }, [driveFiles]);

  const handleMainLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleH4HLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm ice-condensation-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          {/* NGO Brand & Event Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('about-festival')}>
              <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md border-2 border-[#1D9999]/30 flex items-center justify-center overflow-hidden">
                <img
                  src={currentLogoUrl}
                  alt="Ice Movie Logo Official"
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Upload Overlay Icon */}
              <label
                htmlFor="header-logo-upload"
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 bg-slate-950/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Încarcă sigla originală din calculator"
              >
                <Upload className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="header-logo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainLogoUpload}
                />
              </label>

              <div className="absolute -bottom-1 -right-1 bg-[#F08373] text-white p-0.5 rounded-full border-2 border-white pointer-events-none">
                <Heart className="w-3 h-3 fill-white text-white" />
              </div>
            </div>

            <div className="cursor-pointer" onClick={() => setActiveTab('about-festival')}>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {h4hLogoUrl && (
                    <img
                      src={h4hLogoUrl}
                      alt="Sigla H4H Hope 4 Humanity"
                      className="h-5 w-auto object-contain max-w-[70px] rounded"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F08373]">
                    H4H – Hope 4 Humanity
                  </span>

                  <label
                    htmlFor="header-h4h-logo-upload"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded bg-slate-100 hover:bg-[#F08373] hover:text-white text-slate-500 cursor-pointer transition-colors"
                    title="Încarcă/Schimbă sigla H4H din calculator"
                  >
                    <Upload className="w-3 h-3" />
                    <input
                      type="file"
                      id="header-h4h-logo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleH4HLogoUpload}
                    />
                  </label>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#1D9999]/15 text-[#1D9999] text-[10px] font-bold border border-[#1D9999]/30">
                  Ediția IV
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Ice Movie In SummerTime
              </h1>
            </div>
          </div>

          {/* Progress Bar & Stats Counter */}
          <div className="flex items-center gap-4 bg-[#FAF8F5] px-4 py-2.5 rounded-2xl border border-[#1D9999]/30 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#1D9999]" />
              <span>
                Check-In: <span className="text-[#1D9999] font-extrabold">{stats.checkedIn}</span>/{stats.total}
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-[#1D9999] to-[#F08373] rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <span className="text-xs font-mono text-[#1D9999] font-bold">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 text-xs font-bold">
          <button
            id="nav-tab-checkin"
            onClick={() => setActiveTab('checkin')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'checkin'
                ? 'bg-[#1D9999] text-white font-extrabold shadow-md shadow-[#1D9999]/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Check-In Participant</span>
          </button>

          <button
            id="nav-tab-program"
            onClick={() => setActiveTab('program')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'program'
                ? 'bg-[#F08373] text-white font-extrabold shadow-md shadow-[#F08373]/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Program Festival</span>
          </button>

          <button
            id="nav-tab-about-festival"
            onClick={() => setActiveTab('about-festival')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'about-festival'
                ? 'bg-[#1D9999] text-white font-extrabold shadow-md shadow-[#1D9999]/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Despre Festival</span>
          </button>

          <button
            id="nav-tab-about-us"
            onClick={() => setActiveTab('about-us')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'about-us'
                ? 'bg-[#F08373] text-white font-extrabold shadow-md shadow-[#F08373]/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Despre Noi</span>
          </button>

          <button
            id="nav-tab-contact"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-slate-900 text-white font-extrabold shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </button>

          {/* Admin Tab and Google Drive Tab - Only visible when secret key combination is activated */}
          {showSecretTabs && (
            <>
              {/* Admin Tab with Protected Lock Status */}
              <div className="flex items-center gap-1">
                <button
                  id="nav-tab-admin"
                  onClick={onAdminClick}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'admin'
                      ? 'bg-slate-900 text-white font-extrabold shadow-md ring-2 ring-[#F08373]/50'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Panou Admin</span>
                  {isAdminUnlocked ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1D9999]/20 text-[#1D9999] text-[10px] font-bold border border-[#1D9999]/40">
                      <ShieldCheck className="w-3 h-3 text-[#1D9999]" /> Acces Admin
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FCD8D5] text-[#F08373] text-[10px] font-bold border border-[#F08373]/30">
                      <Lock className="w-3 h-3 text-[#F08373]" /> Protejat
                    </span>
                  )}
                </button>

                {isAdminUnlocked && (
                  <button
                    onClick={onLockAdmin}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-600 transition-colors border border-slate-300"
                    title="Blochează sesiunea Admin"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                id="nav-tab-drive"
                onClick={() => setActiveTab('drive')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'drive'
                    ? 'bg-[#A1BDBC] text-slate-900 font-extrabold border border-[#1D9999]/40'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>Google Drive</span>
                {isDriveConnected && (
                  <span className="w-2 h-2 rounded-full bg-[#1D9999] animate-pulse"></span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

