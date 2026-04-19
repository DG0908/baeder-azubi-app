import React from 'react';
import { Plus, Check, X, Trash2, GraduationCap, Eye, PenTool, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import SignatureCanvas from '../ui/SignatureCanvas';

const SchoolCardView = ({
  schoolAttendance,
  newAttendanceDate,
  setNewAttendanceDate,
  newAttendanceStart,
  setNewAttendanceStart,
  newAttendanceEnd,
  setNewAttendanceEnd,
  addSchoolAttendance,
  deleteSchoolAttendance,
  signatureModal,
  setSignatureModal,
  tempSignature,
  setTempSignature,
  updateAttendanceSignature,
  selectedSchoolCardUser,
  setSelectedSchoolCardUser,
  allAzubisForSchoolCard,
  loadSchoolAttendance,
  canViewAllSchoolCards
}) => {
  const { user } = useAuth();
  const { darkMode } = useApp();

  const inputClass = darkMode
    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:ring-cyan-400'
    : 'bg-white/70 border-gray-300 focus:ring-cyan-400';

  const entries = schoolAttendance || [];
  const teacherSigned = entries.filter(e => e.teacher_signature && e.teacher_signature.trim() !== '').length;
  const trainerSigned = entries.filter(e => e.trainer_signature && e.trainer_signature.trim() !== '').length;
  const openCount = entries.filter(e => !e.teacher_signature?.trim() || !e.trainer_signature?.trim()).length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500'} text-white rounded-2xl p-8 shadow-lg`}>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <GraduationCap size={30} />
          Kontrollkarte Berufsschule
          {selectedSchoolCardUser && (
            <span className="text-lg font-normal text-white/80">
              — {selectedSchoolCardUser.name}
            </span>
          )}
        </h2>
        <p className="text-white/80">
          Alle Berufsschultage in einem Blick — mit Unterschrift von Lehrer und Ausbilder.
        </p>
        {entries.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
              <span className="font-bold text-lg">{entries.length}</span>
              <span className="opacity-80 ml-2">Einträge</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
              <span className="font-bold text-lg">{teacherSigned}</span>
              <span className="opacity-80 ml-2">Lehrer ✓</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
              <span className="font-bold text-lg">{trainerSigned}</span>
              <span className="opacity-80 ml-2">Ausbilder ✓</span>
            </div>
            {openCount > 0 && (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-lg">{openCount}</span>
                <span className="opacity-80 ml-2">offen</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Azubi-Auswahl (nur Ausbilder/Admin) */}
      {canViewAllSchoolCards() && (
        <div className="glass-card rounded-2xl p-4">
          <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Eye size={16} />
            Azubi-Kontrollkarten einsehen
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedSchoolCardUser(null);
                loadSchoolAttendance(user.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                !selectedSchoolCardUser
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
                  : darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              Meine Karte
            </button>
            {allAzubisForSchoolCard.map(azubi => (
              <button
                key={azubi.id}
                onClick={() => {
                  setSelectedSchoolCardUser(azubi);
                  loadSchoolAttendance(azubi.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedSchoolCardUser?.id === azubi.id
                    ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-sm'
                    : darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-white/60 text-gray-700 hover:bg-white/80'
                }`}
              >
                {azubi.name}
              </button>
            ))}
          </div>
          {allAzubisForSchoolCard.length === 0 && (
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Keine Azubis vorhanden.
            </p>
          )}
        </div>
      )}

      {/* Neuen Eintrag hinzufügen */}
      {!selectedSchoolCardUser && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-cyan-300' : 'text-gray-800'}`}>
            <Plus size={18} />
            Neuen Berufsschultag eintragen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Datum</label>
              <input
                type="date"
                value={newAttendanceDate}
                onChange={(e) => setNewAttendanceDate(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Beginn</label>
              <input
                type="time"
                value={newAttendanceStart}
                onChange={(e) => setNewAttendanceStart(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Ende</label>
              <input
                type="time"
                value={newAttendanceEnd}
                onChange={(e) => setNewAttendanceEnd(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`}
              />
            </div>
          </div>
          <button
            onClick={addSchoolAttendance}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Eintrag hinzufügen
          </button>
        </div>
      )}

      {/* Hinweis bei Fremd-Ansicht */}
      {selectedSchoolCardUser && (
        <div className={`glass-card rounded-2xl p-4 border-2 ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
          <p className={`text-sm flex items-center gap-2 ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
            <Eye size={16} />
            Du siehst die Kontrollkarte von <strong>{selectedSchoolCardUser.name}</strong>. Nur der Azubi selbst kann Einträge hinzufügen.
          </p>
        </div>
      )}

      {/* Einträge */}
      {entries.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-cyan-50'}`}>
            <CalendarDays size={36} className={darkMode ? 'text-cyan-300' : 'text-cyan-500'} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Noch keine Einträge
          </h3>
          <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Füge deinen ersten Berufsschultag oben im Formular hinzu.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop-Tabelle */}
          <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={darkMode ? 'bg-white/5' : 'bg-white/40'}>
                    <th className={`px-4 py-3 text-left text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Datum</th>
                    <th className={`px-4 py-3 text-left text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Beginn</th>
                    <th className={`px-4 py-3 text-left text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Ende</th>
                    <th className={`px-4 py-3 text-center text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Lehrer</th>
                    <th className={`px-4 py-3 text-center text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Ausbilder</th>
                    <th className={`px-4 py-3 text-center text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-white/10' : 'divide-gray-200/70'}`}>
                  {entries.map((entry) => (
                    <tr key={entry.id} className={darkMode ? 'hover:bg-white/5' : 'hover:bg-white/40'}>
                      <td className={`px-4 py-3 text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {new Date(entry.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{entry.start_time}</td>
                      <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{entry.end_time}</td>
                      <td className="px-4 py-3">
                        <SignatureSlot
                          value={entry.teacher_signature}
                          darkMode={darkMode}
                          label="Lehrer"
                          accent="green"
                          onClick={() => setSignatureModal({ id: entry.id, field: 'teacher_signature', currentValue: entry.teacher_signature })}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <SignatureSlot
                          value={entry.trainer_signature}
                          darkMode={darkMode}
                          label="Ausbilder"
                          accent="blue"
                          onClick={() => setSignatureModal({ id: entry.id, field: 'trainer_signature', currentValue: entry.trainer_signature })}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteSchoolAttendance(entry.id)}
                          className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-white/10' : 'text-red-500 hover:bg-red-50'}`}
                          title="Löschen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile-Karten */}
          <div className="space-y-3 md:hidden">
            {entries.map((entry) => {
              const tOk = entry.teacher_signature && entry.teacher_signature.trim() !== '';
              const aOk = entry.trainer_signature && entry.trainer_signature.trim() !== '';
              const complete = tOk && aOk;
              return (
                <div key={entry.id} className="glass-card rounded-2xl p-4 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${complete ? 'bg-gradient-to-b from-green-500 to-emerald-500' : 'bg-gradient-to-b from-amber-500 to-orange-500'}`} />
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="min-w-0">
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {new Date(entry.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {entry.start_time} – {entry.end_time}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        complete
                          ? darkMode ? 'bg-green-500/20 text-green-200' : 'bg-green-100 text-green-700'
                          : darkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {complete ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {complete ? 'Vollständig' : 'Offen'}
                      </span>
                      <button
                        onClick={() => deleteSchoolAttendance(entry.id)}
                        className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-white/10' : 'text-red-500 hover:bg-red-50'}`}
                        title="Löschen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lehrer</div>
                      <SignatureSlot
                        value={entry.teacher_signature}
                        darkMode={darkMode}
                        label="Lehrer"
                        accent="green"
                        onClick={() => setSignatureModal({ id: entry.id, field: 'teacher_signature', currentValue: entry.teacher_signature })}
                      />
                    </div>
                    <div>
                      <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ausbilder</div>
                      <SignatureSlot
                        value={entry.trainer_signature}
                        darkMode={darkMode}
                        label="Ausbilder"
                        accent="blue"
                        onClick={() => setSignatureModal({ id: entry.id, field: 'trainer_signature', currentValue: entry.trainer_signature })}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Signature-Modal */}
      {signatureModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`glass-card rounded-2xl p-6 max-w-md w-full ${darkMode ? 'bg-slate-900/90' : 'bg-white/95'}`}>
            <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <PenTool size={20} />
              Unterschrift {signatureModal.field === 'teacher_signature' ? 'Lehrer' : 'Ausbilder'}
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Bitte unterschreibe im Feld unten mit Finger oder Stift.
            </p>
            <div className="mb-4">
              <SignatureCanvas
                value={tempSignature || signatureModal.currentValue}
                onChange={(sig) => setTempSignature(sig)}
                darkMode={darkMode}
                label={signatureModal.field === 'teacher_signature' ? 'Lehrer' : 'Ausbilder'}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (tempSignature) {
                    updateAttendanceSignature(signatureModal.id, signatureModal.field, tempSignature);
                  }
                  setSignatureModal(null);
                  setTempSignature(null);
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Check size={18} />
                Speichern
              </button>
              <button
                onClick={() => {
                  setSignatureModal(null);
                  setTempSignature(null);
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${darkMode ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                <X size={18} />
                Abbrechen
              </button>
            </div>
            {signatureModal.currentValue && signatureModal.currentValue.startsWith('data:image') && (
              <button
                onClick={() => {
                  updateAttendanceSignature(signatureModal.id, signatureModal.field, null);
                  setSignatureModal(null);
                  setTempSignature(null);
                }}
                className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                Unterschrift löschen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SignatureSlot = ({ value, darkMode, label, accent, onClick }) => {
  const hasImage = value && value.startsWith('data:image');
  const accentBorder = accent === 'green'
    ? (darkMode ? 'hover:border-green-400' : 'hover:border-green-500')
    : (darkMode ? 'hover:border-blue-400' : 'hover:border-blue-500');
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg min-h-[50px] flex items-center justify-center transition-all border-2 border-dashed ${
        hasImage
          ? darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200'
          : darkMode ? 'bg-white/5 border-white/15' : 'bg-white/50 border-gray-300'
      } ${accentBorder}`}
    >
      {hasImage ? (
        <img src={value} alt={`Unterschrift ${label}`} className="h-10 max-w-[120px] object-contain" />
      ) : (
        <span className={`italic text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <PenTool size={12} />
          Unterschreiben
        </span>
      )}
    </div>
  );
};

export default SchoolCardView;
