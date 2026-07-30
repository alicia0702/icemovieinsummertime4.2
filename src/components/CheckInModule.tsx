import React, { useState } from 'react';
import { Search, UserCheck, UserPlus, CheckCircle2, Clock, Phone, Mail, Shield, Sparkles, Filter, AlertCircle, Heart, Users, FileCheck, Snowflake } from 'lucide-react';
import { Attendee } from '../types';
import { SignatureCanvasModal } from './SignatureCanvasModal';
import confetti from 'canvas-confetti';

interface CheckInModuleProps {
  attendees: Attendee[];
  onCheckIn: (id: string, signatureDataUrl: string) => Promise<void>;
  onRegisterOnSite: (newPerson: { fullName: string; email: string; phone: string; category?: Attendee['category']; signatureDataUrl: string }) => Promise<void>;
  onRefresh: () => void;
  isLoading: boolean;
}

export const CheckInModule: React.FC<CheckInModuleProps> = ({
  attendees,
  onCheckIn,
  onRegisterOnSite,
  onRefresh,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'checkedIn' | 'volunteers'>('all');

  // Signature Modal state
  const [selectedPersonForCheckIn, setSelectedPersonForCheckIn] = useState<Attendee | null>(null);

  // New Registration state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Participant' as Attendee['category'],
    gdprAccepted: false,
  });
  const [showRegisterSignature, setShowRegisterSignature] = useState(false);

  // Success Celebration Modal
  const [successPerson, setSuccessPerson] = useState<Attendee | null>(null);

  // Metric counts
  const totalCount = attendees.length;
  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const pendingCount = attendees.filter((a) => !a.checkedIn).length;
  const volunteersCount = attendees.filter((a) => a.category === 'Voluntar').length;

  // Filter attendees
  const filteredAttendees = attendees.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.phone.includes(q);

    if (filterTab === 'pending') return matchesQuery && !a.checkedIn;
    if (filterTab === 'checkedIn') return matchesQuery && a.checkedIn;
    if (filterTab === 'volunteers') return matchesQuery && a.category === 'Voluntar';
    return matchesQuery;
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#f59e0b', '#10b981', '#fb923c'],
    });
  };

  const handleCompleteCheckIn = async (signatureDataUrl: string) => {
    if (!selectedPersonForCheckIn) return;
    await onCheckIn(selectedPersonForCheckIn.id, signatureDataUrl);

    setSuccessPerson({
      ...selectedPersonForCheckIn,
      checkedIn: true,
      checkInTime: new Date().toISOString(),
    });

    setSelectedPersonForCheckIn(null);
    triggerConfetti();
  };

  const handleCompleteRegistrationWithSignature = async (signatureDataUrl: string) => {
    if (!registerForm.fullName.trim() || !registerForm.gdprAccepted) return;

    await onRegisterOnSite({
      fullName: registerForm.fullName,
      email: registerForm.email,
      phone: registerForm.phone,
      category: registerForm.category,
      signatureDataUrl,
    });

    setSuccessPerson({
      id: 'registered_new',
      fullName: registerForm.fullName,
      email: registerForm.email,
      phone: registerForm.phone,
      checkedIn: true,
      checkInTime: new Date().toISOString(),
      category: registerForm.category,
      registeredOnSite: true,
    });

    setShowRegisterSignature(false);
    setShowRegisterModal(false);
    setRegisterForm({ fullName: '', email: '', phone: '', category: 'Participant', gdprAccepted: false });
    triggerConfetti();
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner with Brand Palette & Condensation Theme */}
      <div className="bg-white border-2 border-[#1D9999]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden ice-condensation-border">
        {/* Frost particles & brand glows */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#1D9999]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-[#F08373]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D9999]/15 border border-[#1D9999]/35 text-[#1D9999] text-xs font-bold backdrop-blur-md">
            <Snowflake className="w-3.5 h-3.5 text-[#1D9999] animate-spin" style={{ animationDuration: '12s' }} />
            <span>Asociația Hope 4 Humanity • Ediția IV IceMovie</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Check-In Digital <span className="bg-gradient-to-r from-[#1D9999] via-[#F08373] to-[#1D9999] bg-clip-text text-transparent">IceMovie In SummerTime</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Introdu numele complet, numărul de telefon sau adresa de email pentru a efectua check-in-ul digital sau înregistrează-te rapid pe loc.
          </p>

          {/* Live Search Input */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#1D9999] absolute left-4 top-3.5" />
              <input
                type="text"
                id="checkin-live-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută numele tău în registrul festivalului..."
                className="w-full bg-[#FAF8F5] border-2 border-[#1D9999]/30 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999] shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  Golește
                </button>
              )}
            </div>

            <button
              id="open-onsite-register-btn"
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#F08373] hover:bg-[#e07363] text-white font-extrabold text-sm transition-all shadow-lg shadow-[#F08373]/20 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Înregistrează-te pe loc</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC COUNTER BOXES - Live Statistics Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span className="flex items-center gap-2 text-slate-700">
            <Filter className="w-4 h-4 text-[#1D9999]" />
            Statistici Festival în Timp Real:
          </span>
          <button
            onClick={onRefresh}
            className="text-slate-500 hover:text-[#1D9999] transition-colors flex items-center gap-1 font-semibold"
          >
            <span>Reîmprospătează datele</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Caseta 1: Voluntari */}
          <div className="p-4 rounded-2xl border bg-white border-[#F08373]/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#F08373]">Voluntari</span>
              <Heart className="w-4 h-4 text-[#F08373] fill-[#F08373]/30" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{volunteersCount}</span>
              <span className="text-[10px] text-[#F08373] font-bold uppercase">Echipă</span>
            </div>
          </div>

          {/* Caseta 2: Persoane Total */}
          <div className="p-4 rounded-2xl border bg-white border-[#1D9999]/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#1D9999]">Total Persoane</span>
              <Users className="w-4 h-4 text-[#1D9999]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</span>
              <span className="text-[10px] text-[#1D9999] font-bold uppercase">Înscrise</span>
            </div>
          </div>

          {/* Caseta 3: Check-In Efectuat */}
          <div className="p-4 rounded-2xl border bg-white border-emerald-500/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700">Check-In Efectuat</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{checkedInCount}</span>
              <span className="text-[10px] text-emerald-700 font-bold font-mono">
                {totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Caseta 4: În Așteptare */}
          <div className="p-4 rounded-2xl border bg-white border-[#FCD8D5] shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800">În Așteptare</span>
              <Clock className="w-4 h-4 text-[#F08373]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{pendingCount}</span>
              <span className="text-[10px] text-slate-600 font-bold uppercase">Neconfirmat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendees Search Results - ONLY displayed when actively searching for a name */}
      {searchQuery.trim() !== '' && (
        <div className="space-y-3">
          {filteredAttendees.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="p-4 rounded-full bg-[#F08373]/15 text-[#F08373] w-16 h-16 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Nu am găsit nicio persoană după filtrul curent</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Dacă ești pentru prima dată la festivalul IceMovie In SummerTime, te poți înregistra direct pe loc!
                </p>
              </div>
              <button
                onClick={() => {
                  setRegisterForm((prev) => ({ ...prev, fullName: searchQuery }));
                  setShowRegisterModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#F08373] hover:bg-[#e07363] text-white font-extrabold text-xs shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Înregistrează-te acum</span>
              </button>
            </div>
          ) : (
            filteredAttendees.map((person) => (
              <div
                key={person.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                  person.checkedIn
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-[#1D9999]/50'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-3 rounded-2xl ${
                      person.checkedIn
                        ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {person.checkedIn ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 truncate">{person.fullName}</h3>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          person.category === 'Voluntar'
                            ? 'bg-[#F08373]/20 text-[#d85e4d] border border-[#F08373]/40'
                            : 'bg-[#1D9999]/15 text-[#1D9999] border border-[#1D9999]/40'
                        }`}
                      >
                        {person.category || 'Participant'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      {person.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {person.email}
                        </span>
                      )}
                      {person.phone && (
                        <span className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {person.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status or Action Button */}
                <div className="self-end sm:self-center">
                  {person.checkedIn ? (
                    <div className="flex items-center gap-2 bg-emerald-100/80 px-4 py-2 rounded-xl border border-emerald-300 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Check-In Efectuat</span>
                      {person.checkInTime && (
                        <span className="text-[10px] font-mono text-emerald-700">
                          ({new Date(person.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPersonForCheckIn(person)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D9999] hover:bg-[#188080] text-white font-extrabold text-xs transition-all shadow-md shadow-[#1D9999]/20"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Semnează & Check-In</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Signature Modal for Existing Person */}
      {selectedPersonForCheckIn && (
        <SignatureCanvasModal
          personName={selectedPersonForCheckIn.fullName}
          personDetails={`${selectedPersonForCheckIn.email || 'Fără email'} • ${selectedPersonForCheckIn.phone || 'Fără telefon'}`}
          onSaveSignature={handleCompleteCheckIn}
          onClose={() => setSelectedPersonForCheckIn(null)}
        />
      )}

      {/* On-Site Registration Modal with Mandatory GDPR Checkbox */}
      {showRegisterModal && !showRegisterSignature && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white border-2 border-[#1D9999]/30 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#F08373]/15 text-[#F08373]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Înregistrare Nouă pe Loc</h3>
                  <p className="text-xs text-slate-500">Hope 4 Humanity • IceMovie In SummerTime</p>
                </div>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (registerForm.fullName.trim() && registerForm.gdprAccepted) {
                  setShowRegisterSignature(true);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nume Complet *</label>
                <input
                  type="text"
                  required
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  placeholder="ex: Popescu Maria"
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Adresă de Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="ex: maria@example.com"
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Număr de Telefon</label>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  placeholder="ex: 0722123456"
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Categorie Participant</label>
                <select
                  value={registerForm.category}
                  onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value as Attendee['category'] })}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-[#1D9999]"
                >
                  <option value="Participant">Participant Festival</option>
                  <option value="Voluntar">Voluntar Hope 4 Humanity</option>
                </select>
              </div>

              {/* MANDATORY GDPR CHECKBOX */}
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#1D9999]/30 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={registerForm.gdprAccepted}
                    onChange={(e) => setRegisterForm({ ...registerForm, gdprAccepted: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#1D9999] focus:ring-[#1D9999] accent-[#1D9999] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700 leading-relaxed">
                    <span className="font-bold text-[#1D9999]">Acord Obligatoriu GDPR:</span> Declar că sunt de acord cu prelucrarea datelor mele cu caracter personal conform Regulamentului (UE) 2016/679 și Legii nr. 190/2018 în scopul participării la evenimentul organizat de Asociația Hope 4 Humanity.
                  </span>
                </label>
                {!registerForm.gdprAccepted && (
                  <p className="text-[10px] text-[#F08373] font-semibold flex items-center gap-1 pl-6">
                    <Shield className="w-3 h-3" /> Selectează bifa obligatorie pentru a putea trece la pasul următor.
                  </p>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={!registerForm.gdprAccepted}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                    registerForm.gdprAccepted
                      ? 'bg-[#F08373] hover:bg-[#e07363] text-white shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  Pasul Următor: Semnătură →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signature Modal for New Registration */}
      {showRegisterSignature && (
        <SignatureCanvasModal
          personName={registerForm.fullName}
          personDetails={`Înregistrare Nouă pe Loc (${registerForm.category})`}
          onSaveSignature={handleCompleteRegistrationWithSignature}
          onClose={() => setShowRegisterSignature(false)}
        />
      )}

      {/* Check-In Success Modal */}
      {successPerson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border-2 border-emerald-300 rounded-3xl w-full max-w-md p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl"></div>

            <div className="p-4 rounded-full bg-emerald-100 text-emerald-600 w-20 h-20 mx-auto flex items-center justify-center border border-emerald-300">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                Check-In Confirmat!
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">{successPerson.fullName}</h3>
              <p className="text-xs text-slate-600">
                A fost înregistrat cu succes la <span className="text-[#1D9999] font-bold">IceMovie In SummerTime - Ediția a IV-a</span>.
              </p>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 font-mono">
              <p>Ora Check-in: {new Date().toLocaleTimeString('ro-RO')}</p>
              <p>Organizator: Asociația Hope 4 Humanity</p>
            </div>

            <button
              onClick={() => setSuccessPerson(null)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-colors"
            >
              Închide & Continuă
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

