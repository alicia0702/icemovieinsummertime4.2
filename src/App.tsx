import React, { useState, useEffect } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { CheckInModule } from './components/CheckInModule';
import { AdminModule } from './components/AdminModule';
import { EventProgram } from './components/EventProgram';
import { AboutFestivalSection } from './components/AboutFestivalSection';
import { AboutUsSection } from './components/AboutUsSection';
import { ContactSection } from './components/ContactSection';
import { SponsorsSection } from './components/SponsorsSection';
import { DriveConnectBanner } from './components/DriveConnectBanner';
import { DriveFolderTree } from './components/DriveFolderTree';
import { CodeInspector } from './components/CodeInspector';
import { MoviePlayerModal } from './components/MoviePlayerModal';
import { AiAuditor } from './components/AiAuditor';
import { DEMO_FILES } from './data/demoData';
import { Attendee, ActiveTab, CheckInStats, AuthStatusResponse, DriveFile } from './types';
import { Film, Play, Heart, Sun, Shield, HardDrive, Sparkles, Lock, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('checkin');
  const [driveSubTab, setDriveSubTab] = useState<'preview' | 'movies' | 'explorer' | 'code' | 'ai'>('movies');

  // Secret Mode State (Hides Admin & Google Drive by default until combination is pressed)
  const [showSecretTabs, setShowSecretTabs] = useState(false);
  const [secretToast, setSecretToast] = useState<string | null>(null);

  // Admin Security Lock State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');

  // Attendees Data & Stats State
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [stats, setStats] = useState<CheckInStats>({
    total: 0,
    checkedIn: 0,
    pending: 0,
    registeredOnSite: 0,
  });
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);

  // Drive & Auth State
  const [authStatus, setAuthStatus] = useState<AuthStatusResponse | null>(null);
  const [files, setFiles] = useState<DriveFile[]>(DEMO_FILES);
  const [folderName, setFolderName] = useState<string>('IceMovieInSUmmerTime');
  const [selectedMovie, setSelectedMovie] = useState<DriveFile | null>(null);
  const [selectedCodeFile, setSelectedCodeFile] = useState<DriveFile | null>(DEMO_FILES[0]);
  const [codeContent, setCodeContent] = useState<string>(DEMO_FILES[0].content || '');
  const [htmlContent, setHtmlContent] = useState<string>(DEMO_FILES[0].content || '');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Admin Protection Handlers
  const handleAdminTabClick = () => {
    if (!isAdminUnlocked) {
      setShowAdminPinModal(true);
      setAdminPinError('');
    } else {
      setActiveTab('admin');
    }
  };

  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = adminPinInput.trim();
    if (pin === 'IceMovie2@26' || pin === '1234') {
      setIsAdminUnlocked(true);
      setShowAdminPinModal(false);
      setActiveTab('admin');
      setAdminPinInput('');
      setAdminPinError('');
    } else {
      setAdminPinError('Parolă incorectă. Introduceți parola de administrator validă.');
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    if (activeTab === 'admin') {
      setActiveTab('checkin');
    }
  };

  // Fetch Attendees from backend API
  const fetchAttendees = async () => {
    setIsLoadingAttendees(true);
    try {
      const res = await fetch('/api/attendees');
      if (res.ok) {
        const data = await res.json();
        setAttendees(data.attendees || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
    } finally {
      setIsLoadingAttendees(false);
    }
  };

  // Check Auth status
  const fetchAuthStatus = async () => {
    setIsLoadingAuth(true);
    try {
      const res = await fetch('/api/auth/status');
      const data: AuthStatusResponse = await res.json();
      setAuthStatus(data);
      if (data.authenticated) {
        await fetchDriveFiles();
      }
    } catch (err) {
      console.error('Failed to fetch auth status:', err);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Fetch Drive Files
  const fetchDriveFiles = async () => {
    try {
      const res = await fetch('/api/drive/search?q=IceMovieInSUmmerTime');
      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          const mainFolder = data.files.find((f: any) => f.mimeType === 'application/vnd.google-apps.folder');
          if (mainFolder) {
            setFolderName(mainFolder.name);
            const folderRes = await fetch(`/api/drive/folder/${mainFolder.id}`);
            if (folderRes.ok) {
              const folderData = await folderRes.json();
              if (folderData.files) {
                setFiles(folderData.files);
              }
            }
          } else {
            setFiles(data.files);
          }
        }
      }
    } catch (err) {
      console.error('Failed to search Drive files:', err);
    }
  };

  useEffect(() => {
    fetchAttendees();
    fetchAuthStatus();
  }, []);

  // Secret Key Combination Listener (Ctrl + Shift + A or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Shortcut: Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setShowSecretTabs((prev) => {
          const newState = !prev;
          if (!newState && (activeTab === 'admin' || activeTab === 'drive')) {
            setActiveTab('checkin');
          }
          setSecretToast(
            newState
              ? '🔓 Meniurile Secrete (Admin & Drive) au fost deblocate!'
              : '🔒 Meniurile Secrete au fost ascunse.'
          );
          setTimeout(() => setSecretToast(null), 4000);
          return newState;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Check-In Action
  const handleCheckIn = async (id: string, signatureDataUrl: string) => {
    try {
      const res = await fetch('/api/attendees/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, signatureDataUrl }),
      });
      if (res.ok) {
        await fetchAttendees();
      } else {
        const err = await res.json();
        alert(err.error || 'Eroare la check-in');
      }
    } catch (err) {
      alert('Eroare la procesarea check-in-ului.');
    }
  };

  // On-Site Registration Action
  const handleRegisterOnSite = async (newPerson: {
    fullName: string;
    email: string;
    phone: string;
    category?: Attendee['category'];
    signatureDataUrl: string;
  }) => {
    try {
      const res = await fetch('/api/attendees/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerson),
      });
      if (res.ok) {
        await fetchAttendees();
      } else {
        const err = await res.json();
        alert(err.error || 'Eroare la înregistrare');
      }
    } catch (err) {
      alert('Eroare la conectarea cu serverul.');
    }
  };

  // Bulk Upload Action (Admin)
  const handleBulkUpload = async (
    list: Array<{ fullName: string; email?: string; phone?: string; category?: Attendee['category'] }>
  ) => {
    try {
      const res = await fetch('/api/attendees/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list }),
      });
      if (res.ok) {
        await fetchAttendees();
      } else {
        const err = await res.json();
        alert(err.error || 'Eroare la încărcarea listei');
      }
    } catch (err) {
      alert('Eroare la încărcarea fișierului.');
    }
  };

  // Delete Person Action (Admin)
  const handleDeletePerson = async (id: string) => {
    try {
      const res = await fetch(`/api/attendees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAttendees();
      }
    } catch (err) {
      alert('Eroare la ștergerea persoanei.');
    }
  };

  // Export CSV Action
  const handleExportCsv = () => {
    window.open('/api/attendees/export', '_blank');
  };

  // Reset Database Action
  const handleResetDatabase = async () => {
    try {
      const res = await fetch('/api/attendees/reset', { method: 'POST' });
      if (res.ok) {
        await fetchAttendees();
      }
    } catch (err) {
      alert('Eroare la resetarea bazei de date.');
    }
  };

  // Drive Connect Action
  const handleConnectDrive = async () => {
    try {
      const res = await fetch('/api/auth/url');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Eroare la conectarea OAuth.');
    }
  };

  const handleManualTokenSubmit = async (token: string) => {
    try {
      const res = await fetch('/api/auth/manual-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        fetchAuthStatus();
      }
    } catch (err) {
      alert('Eroare la trimiterea token-ului.');
    }
  };

  const moviesList = files.filter(
    (f) => f.mimeType.includes('video') || f.name.endsWith('.mp4') || f.isMovie
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans selection:bg-[#FCD8D5] selection:text-slate-900 bg-ice-pattern">
      {/* Header & Navbar */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        isDriveConnected={Boolean(authStatus?.authenticated)}
        isAdminUnlocked={isAdminUnlocked}
        onAdminClick={handleAdminTabClick}
        onLockAdmin={handleLockAdmin}
        showSecretTabs={showSecretTabs}
        driveFiles={files}
      />

      {/* Secret Toast Notification */}
      {secretToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <KeyRound className="w-5 h-5 text-[#1D9999]" />
          <span className="text-xs font-bold">{secretToast}</span>
          <button
            onClick={() => setSecretToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'checkin' && (
          <CheckInModule
            attendees={attendees}
            onCheckIn={handleCheckIn}
            onRegisterOnSite={handleRegisterOnSite}
            onRefresh={fetchAttendees}
            isLoading={isLoadingAttendees}
          />
        )}

        {activeTab === 'program' && <EventProgram />}

        {activeTab === 'about-festival' && <AboutFestivalSection driveFiles={files} />}

        {activeTab === 'about-us' && <AboutUsSection driveFiles={files} />}

        {activeTab === 'contact' && <ContactSection />}

        {activeTab === 'admin' && isAdminUnlocked && (
          <AdminModule
            attendees={attendees}
            onBulkUpload={handleBulkUpload}
            onDeletePerson={handleDeletePerson}
            onExportCsv={handleExportCsv}
            onResetDatabase={handleResetDatabase}
            onRefresh={fetchAttendees}
          />
        )}

        {activeTab === 'admin' && !isAdminUnlocked && (
          <div className="bg-white/90 border-2 border-[#F08373]/30 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 shadow-xl backdrop-blur-md">
            <div className="p-4 rounded-full bg-[#F08373]/15 text-[#F08373] w-20 h-20 mx-auto flex items-center justify-center border border-[#F08373]/30 shadow-sm">
              <Lock className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">Acces Restricționat Administrator</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Această secțiune este rezervată exclusiv organizatorilor Asociației Hope 4 Humanity. Pentru acces, introdu codul PIN de securitate.
              </p>
            </div>
            <button
              onClick={() => setShowAdminPinModal(true)}
              className="px-6 py-3 rounded-2xl bg-[#F08373] hover:bg-[#e07363] text-white font-extrabold text-xs shadow-lg shadow-[#F08373]/25 transition-all"
            >
              Introduceți Codul PIN Admin
            </button>
          </div>
        )}

        {activeTab === 'drive' && (
          <div className="space-y-6">
            <DriveConnectBanner
              authStatus={authStatus}
              onConnectDrive={handleConnectDrive}
              onManualTokenSubmit={handleManualTokenSubmit}
              isLoading={isLoadingAuth}
            />

            {/* Drive Sub-Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
              <button
                onClick={() => setDriveSubTab('movies')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  driveSubTab === 'movies'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                Filme Drive ({moviesList.length})
              </button>
              <button
                onClick={() => setDriveSubTab('explorer')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  driveSubTab === 'explorer'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                Explorer Fișiere
              </button>
              <button
                onClick={() => setDriveSubTab('code')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  driveSubTab === 'code'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                Inspector Cod
              </button>
              <button
                onClick={() => setDriveSubTab('ai')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  driveSubTab === 'ai'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                Audit Gemini AI
              </button>
            </div>

            {/* Drive Sub-Content */}
            {driveSubTab === 'movies' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                      <Film className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-white">Google Drive Cinema Streamer</h2>
                      <p className="text-xs text-slate-400">
                        Proiecții video sincronizate direct din folderul Google Drive{' '}
                        <span className="text-amber-300 font-mono font-bold">{folderName}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moviesList.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col justify-between shadow-xl"
                    >
                      <div className="relative aspect-video bg-slate-950 overflow-hidden">
                        <img
                          src={
                            movie.thumbnailLink ||
                            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
                          }
                          alt={movie.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                          <button
                            onClick={() => setSelectedMovie(movie)}
                            className="p-4 rounded-full bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/50 group-hover:scale-110 transition-transform"
                          >
                            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold mb-1">
                            <span>{movie.movieGenre || 'Cinema de Vară'}</span>
                            <span>{movie.movieRating || '4.9 ★'}</span>
                          </div>
                          <h3 className="font-bold text-slate-100 text-base line-clamp-1">
                            {movie.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                          </h3>
                        </div>

                        <button
                          onClick={() => setSelectedMovie(movie)}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Rulează Video Stream</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {driveSubTab === 'explorer' && (
              <DriveFolderTree
                files={files}
                folderName={folderName}
                onSelectFile={(f) => {
                  setSelectedCodeFile(f);
                  setDriveSubTab('code');
                }}
                onPlayMovie={(m) => setSelectedMovie(m)}
              />
            )}

            {driveSubTab === 'code' && (
              <CodeInspector
                files={files}
                selectedFile={selectedCodeFile}
                onSelectFile={(f) => setSelectedCodeFile(f)}
                codeContent={codeContent}
              />
            )}

            {driveSubTab === 'ai' && <AiAuditor files={files} htmlContent={htmlContent} />}
          </div>
        )}
      </main>

      {/* Movie Streaming Modal */}
      {selectedMovie && (
        <MoviePlayerModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* Admin Access PIN Modal */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border-2 border-[#1D9999]/30 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#1D9999]/15 text-[#1D9999] border border-[#1D9999]/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Autentificare Administrator</h3>
                  <p className="text-xs text-slate-500">Panou Protejat • Hope 4 Humanity</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminPinModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifyAdminPin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Introduceți Parola Admin *
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  placeholder="Introduceți parola admin..."
                  className="w-full bg-[#FAF8F5] border-2 border-[#1D9999]/40 rounded-xl px-4 py-3 text-center text-sm tracking-wide font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999] shadow-inner"
                />
              </div>

              {adminPinError && (
                <div className="p-3 bg-[#F08373]/15 border border-[#F08373]/30 rounded-xl text-[#F08373] text-xs font-semibold">
                  {adminPinError}
                </div>
              )}

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>Nivel de securitate:</span>
                <span className="font-sans text-[#1D9999] font-bold bg-[#1D9999]/10 px-2.5 py-0.5 rounded-lg border border-[#1D9999]/20">
                  Protejat prin Parolă
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPinModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1D9999] hover:bg-[#188080] text-white font-extrabold text-xs shadow-lg shadow-[#1D9999]/25 transition-all"
                >
                  Deblochează Panou Admin →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-600 mt-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Heart className="w-4 h-4 text-[#F08373] fill-[#F08373]" />
            <span className="font-bold text-slate-900">Asociația Hope 4 Humanity</span>
            <span>• IceMovie In SummerTime (Ediția a IV-a)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-[#1D9999]">
              <Shield className="w-3.5 h-3.5 text-[#1D9999]" />
              Sistem Securizat Check-In Digital
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
