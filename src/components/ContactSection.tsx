import React, { useState } from 'react';
import { Mail, MapPin, Send, Instagram, Facebook, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General',
    message: '',
    gdpr: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.gdpr) {
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border-2 border-[#1D9999]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden ice-condensation-border">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#1D9999]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D9999]/15 border border-[#1D9999]/35 text-[#1D9999] text-xs font-bold">
            <Mail className="w-3.5 h-3.5 text-[#1D9999]" />
            <span>Suntem Aici Pentru Tine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Contactează Echipa <span className="text-[#1D9999]">IceMovie</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ai vreo întrebare despre festival, dorești să devii partener sau sponsor? Trimite-ne un mesaj!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#1D9999]/15 text-[#1D9999]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Contact</span>
                <a href="mailto:contact@hope4humanity.ro" className="text-xs font-extrabold text-slate-900 hover:text-[#1D9999]">
                  contact@hope4humanity.ro
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-[#1D9999]/15 text-[#1D9999]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Locație Festival</span>
                <span className="text-xs font-bold text-slate-800">
                  Suceava
                </span>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Urmărește-ne Pe Rețele</h3>
            <div className="space-y-2">
              <a
                href="https://www.instagram.com/hope4humanityassociation/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-[#F08373] text-xs font-bold transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#F08373] group-hover:text-white" />
                  <span>Instagram Hope 4 Humanity</span>
                </div>
                <span className="text-[10px] opacity-70">@hope4humanityassociation</span>
              </a>

              <a
                href="https://www.instagram.com/campulungff/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-[#F08373] text-xs font-bold transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#F08373] group-hover:text-white" />
                  <span>Instagram Câmpulung Film Fest</span>
                </div>
                <span className="text-[10px] opacity-70">@campulungff</span>
              </a>
            </div>
          </div>
        </div>

        {/* Formular Contact */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:col-span-2 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Mesaj Trimis cu Succes!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Îți mulțumim pentru că ne-ai contactat! Echipa Asociației Hope 4 Humanity îți va răspunde în cel mai scurt timp posibil.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormState({ name: '', email: '', phone: '', subject: 'General', message: '', gdpr: false });
                }}
                className="px-6 py-2.5 rounded-xl bg-[#1D9999] hover:bg-[#188080] text-white font-extrabold text-xs shadow-md"
              >
                Trimite un alt mesaj
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-100">
                Trimite-ne un mesaj direct
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nume Complet *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Popescu Andrei"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Adresă de Email *</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="andrei@example.com"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Număr de Telefon</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="0722123456"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subiect</label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#1D9999]"
                  >
                    <option value="General">Informații Generale Festival</option>
                    <option value="Parteneriat">Parteneriate & Sponsorizări</option>
                    <option value="Presa">Presă & Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mesajul tău *</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Scrie-ne mai multe detalii..."
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  required
                  checked={formState.gdpr}
                  onChange={(e) => setFormState({ ...formState, gdpr: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#1D9999] accent-[#1D9999]"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed">
                  Sunt de acord cu prelucrarea datelor mele cu caracter personal de către Asociația Hope 4 Humanity în scopul de a primi răspuns la mesaj.
                </span>
              </label>

              <button
                type="submit"
                disabled={!formState.gdpr}
                className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                  formState.gdpr
                    ? 'bg-[#1D9999] hover:bg-[#188080] text-white shadow-[#1D9999]/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Trimite Mesajul</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
