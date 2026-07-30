import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, RefreshCw, Trash2, Plus, Users, CheckCircle2, AlertCircle, FileText, Shield, Database } from 'lucide-react';
import { Attendee } from '../types';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface AdminModuleProps {
  attendees: Attendee[];
  onBulkUpload: (list: Array<{ fullName: string; email?: string; phone?: string; category?: Attendee['category'] }>) => Promise<void>;
  onDeletePerson: (id: string) => Promise<void>;
  onExportCsv: () => void;
  onResetDatabase: () => Promise<void>;
  onRefresh: () => void;
}

export const AdminModule: React.FC<AdminModuleProps> = ({
  attendees,
  onBulkUpload,
  onDeletePerson,
  onExportCsv,
  onResetDatabase,
  onRefresh,
}) => {
  const [parsedPreview, setParsedPreview] = useState<Array<{ fullName: string; email?: string; phone?: string; category?: Attendee['category'] }> | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Manual Add Form
  const [manualForm, setManualForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Participant' as Attendee['category'],
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadMessage(null);

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data.map((row: any) => ({
            fullName: row['Nume'] || row['Nume Complet'] || row['Name'] || row['Full Name'] || Object.values(row)[0] || '',
            email: row['Email'] || row['Adresa Email'] || row['E-mail'] || Object.values(row)[1] || '',
            phone: row['Telefon'] || row['Numar Telefon'] || row['Phone'] || Object.values(row)[2] || '',
            category: (row['Categorie'] || row['Category'] || 'Participant') as Attendee['category'],
          })).filter((item: any) => item.fullName && item.fullName.trim() !== '');

          setParsedPreview(parsed);
        },
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];

        if (json.length > 1) {
          const rows = json.slice(1);
          const parsed = rows.map((row: any) => ({
            fullName: String(row[0] || '').trim(),
            email: String(row[1] || '').trim(),
            phone: String(row[2] || '').trim(),
            category: (row[3] || 'Participant') as Attendee['category'],
          })).filter((item: any) => item.fullName !== '');

          setParsedPreview(parsed);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setUploadMessage('Format ne-suportat. Te rugăm să încarci un fișier CSV sau XLSX/XLS.');
    }
  };

  const handleConfirmImport = async () => {
    if (!parsedPreview || parsedPreview.length === 0) return;
    setIsUploading(true);
    try {
      await onBulkUpload(parsedPreview);
      setUploadMessage(`Succes! Au fost procesate ${parsedPreview.length} persoane din fișierul ${fileName}.`);
      setParsedPreview(null);
      setFileName('');
      onRefresh();
    } catch (err: any) {
      setUploadMessage('Eroare la importul fișierului.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim()) return;

    await onBulkUpload([
      {
        fullName: manualForm.fullName,
        email: manualForm.email,
        phone: manualForm.phone,
        category: manualForm.category,
      },
    ]);

    setManualForm({ fullName: '', email: '', phone: '', category: 'Participant' });
    setUploadMessage('Persoană adăugată manual cu succes!');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-2 border-[#1D9999]/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ice-condensation-border">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#1D9999] text-white font-black shadow-md">
            <Database className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Panou Administrare Date</h2>
            <p className="text-xs text-slate-500">
              Gestiune listă participanți & voluntari Hope 4 Humanity
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="export-csv-btn"
            onClick={onExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-[#1D9999]/40 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-[#1D9999]" />
            <span>Exportă CSV Check-In</span>
          </button>

          <button
            id="reset-db-btn"
            onClick={() => {
              if (confirm('Sigur dorești să resetezi baza de date la starea inițială?')) {
                onResetDatabase();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F08373]/15 hover:bg-[#F08373]/25 text-[#b84838] text-xs font-bold border border-[#F08373]/40 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-[#F08373]" />
            <span>Resetează Baza de Date</span>
          </button>
        </div>
      </div>

      {/* Grid: File Upload Box & Manual Add Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload File Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <FileSpreadsheet className="w-5 h-5 text-[#F08373]" />
            <div>
              <h3 className="text-base font-bold text-slate-900">1. Încarcă Fișier Listă (CSV / Excel)</h3>
              <p className="text-xs text-slate-500">Încarcă lista prealabilă cu Nume, Email, Telefon</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-[#1D9999]/40 hover:border-[#1D9999] rounded-2xl p-6 text-center space-y-3 transition-colors bg-[#FAF8F5]">
            <Upload className="w-8 h-8 text-[#1D9999] mx-auto" />
            <div>
              <p className="text-xs font-bold text-slate-800">Alege un fișier de pe calculator sau telefon</p>
              <p className="text-[11px] text-slate-500">Suportă .csv, .xlsx, .xls</p>
            </div>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
              id="admin-file-input"
            />
            <label
              htmlFor="admin-file-input"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#1D9999] hover:bg-[#188080] text-white font-extrabold text-xs cursor-pointer shadow-md transition-colors"
            >
              Selectează Fișier
            </label>
          </div>

          {fileName && (
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-mono text-[#1D9999] font-bold truncate">{fileName}</span>
              <span className="text-emerald-700 font-bold">{parsedPreview?.length || 0} rânduri detectate</span>
            </div>
          )}

          {parsedPreview && (
            <div className="space-y-3">
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl bg-[#FAF8F5] p-2 text-xs font-mono divide-y divide-slate-200">
                {parsedPreview.slice(0, 5).map((p, idx) => (
                  <div key={idx} className="py-1 px-2 flex justify-between text-slate-800">
                    <span>{p.fullName}</span>
                    <span className="text-slate-500">{p.phone || p.email}</span>
                  </div>
                ))}
              </div>

              <button
                id="confirm-import-btn"
                onClick={handleConfirmImport}
                disabled={isUploading}
                className="w-full py-3 rounded-xl bg-[#1D9999] hover:bg-[#188080] text-white font-extrabold text-xs shadow-md"
              >
                {isUploading ? 'Se procesează...' : `Confirmă Importul a ${parsedPreview.length} persoane`}
              </button>
            </div>
          )}

          {uploadMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              {uploadMessage}
            </div>
          )}
        </div>

        {/* Manual Add Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Plus className="w-5 h-5 text-[#1D9999]" />
            <div>
              <h3 className="text-base font-bold text-slate-900">2. Adăugare Manuală în Bază</h3>
              <p className="text-xs text-slate-500">Adaugă o persoană individual în registrul evenimentului</p>
            </div>
          </div>

          <form onSubmit={handleManualAddSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nume Complet *</label>
              <input
                type="text"
                required
                value={manualForm.fullName}
                onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                placeholder="ex: Popescu Ion"
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={manualForm.email}
                  onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                  placeholder="ex: ion@gmail.com"
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Telefon</label>
                <input
                  type="tel"
                  value={manualForm.phone}
                  onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                  placeholder="ex: 0722111222"
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D9999]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Categorie</label>
              <select
                value={manualForm.category}
                onChange={(e) => setManualForm({ ...manualForm, category: e.target.value as Attendee['category'] })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-[#1D9999]"
              >
                <option value="Participant">Participant</option>
                <option value="Voluntar">Voluntar Hope 4 Humanity</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1D9999] hover:bg-[#188080] text-white font-extrabold text-xs shadow-md transition-colors"
            >
              Adaugă în Baza de Date
            </button>
          </form>
        </div>
      </div>

      {/* Database Overview Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#F08373]" />
            <h3 className="text-base font-bold text-slate-900">Registrul Bazei de Date ({attendees.length})</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF8F5] text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Nume Complet</th>
                <th className="p-3">Email</th>
                <th className="p-3">Telefon</th>
                <th className="p-3">Categorie</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendees.map((person) => (
                <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-slate-900">{person.fullName}</td>
                  <td className="p-3 font-mono text-slate-600">{person.email || '—'}</td>
                  <td className="p-3 font-mono text-slate-600">{person.phone || '—'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#1D9999] font-bold text-[10px] border border-slate-200">
                      {person.category || 'Participant'}
                    </span>
                  </td>
                  <td className="p-3">
                    {person.checkedIn ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        Check-in Efectuat
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                        În așteptare
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeletePerson(person.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Șterge din bază"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
