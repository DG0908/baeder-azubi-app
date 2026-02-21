import React from 'react';
import { Plus, Check, X, Trash2 } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <h2 className={`text-2xl font-bold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🎓 Kontrollkarte Berufsschule
          {selectedSchoolCardUser && (
            <span className="ml-3 text-lg font-normal text-cyan-500">
              - {selectedSchoolCardUser.name}
            </span>
          )}
        </h2>

        {canViewAllSchoolCards() && (
          <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-purple-50 to-pink-50'} rounded-xl p-4 mb-6`}>
            <h3 className={`font-bold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
              👀 Azubi-Kontrollkarten einsehen
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedSchoolCardUser(null);
                  loadSchoolAttendance(user.id);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !selectedSchoolCardUser
                    ? 'bg-cyan-500 text-white'
                    : (darkMode ? 'bg-slate-600 text-gray-300 hover:bg-slate-500' : 'bg-white text-gray-700 hover:bg-gray-100')
                }`}
              >
                📝 Meine Karte
              </button>
              {allAzubisForSchoolCard.map(azubi => (
                <button
                  key={azubi.id}
                  onClick={() => {
                    setSelectedSchoolCardUser(azubi);
                    loadSchoolAttendance(azubi.id);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedSchoolCardUser?.id === azubi.id
                      ? 'bg-purple-500 text-white'
                      : (darkMode ? 'bg-slate-600 text-gray-300 hover:bg-slate-500' : 'bg-white text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  👨‍🎓 {azubi.name}
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

        {!selectedSchoolCardUser && (
          <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6 mb-6`}>
            <h3 className={`font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Neuen Eintrag hinzufügen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</label>
                <input
                  type="date"
                  value={newAttendanceDate}
                  onChange={(e) => setNewAttendanceDate(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Beginn</label>
                <input
                  type="time"
                  value={newAttendanceStart}
                  onChange={(e) => setNewAttendanceStart(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ende</label>
                <input
                  type="time"
                  value={newAttendanceEnd}
                  onChange={(e) => setNewAttendanceEnd(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
            <button
              onClick={addSchoolAttendance}
              className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              <Plus className="inline mr-2" size={18} />
              Eintrag hinzufügen
            </button>
          </div>
        )}

        {selectedSchoolCardUser && (
          <div className={`${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-xl p-4 mb-6 border-2 ${darkMode ? 'border-purple-700' : 'border-purple-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              👀 Du siehst die Kontrollkarte von <strong>{selectedSchoolCardUser.name}</strong>. Nur der Azubi selbst kann Einträge hinzufügen.
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</th>
                <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Beginn</th>
                <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ende</th>
                <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lehrer ✍️</th>
                <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbilder ✍️</th>
                <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {schoolAttendance.map((entry, idx) => (
                <tr key={entry.id} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'} ${idx % 2 === 0 ? (darkMode ? 'bg-slate-800' : 'bg-white') : (darkMode ? 'bg-slate-750' : 'bg-gray-50')}`}>
                  <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {new Date(entry.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entry.start_time}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entry.end_time}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <div
                      onClick={() => setSignatureModal({ id: entry.id, field: 'teacher_signature', currentValue: entry.teacher_signature })}
                      className={`cursor-pointer rounded min-h-[50px] flex items-center justify-center ${entry.teacher_signature && entry.teacher_signature.startsWith('data:image') ? '' : (darkMode ? 'bg-slate-700' : 'bg-gray-100')} hover:opacity-80 transition-all border-2 border-dashed ${darkMode ? 'border-slate-600 hover:border-green-500' : 'border-gray-300 hover:border-green-500'}`}
                    >
                      {entry.teacher_signature && entry.teacher_signature.startsWith('data:image') ? (
                        <img src={entry.teacher_signature} alt="Unterschrift Lehrer" className="h-12 max-w-[120px] object-contain" />
                      ) : (
                        <span className={`italic text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>✍️ Unterschreiben</span>
                      )}
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <div
                      onClick={() => setSignatureModal({ id: entry.id, field: 'trainer_signature', currentValue: entry.trainer_signature })}
                      className={`cursor-pointer rounded min-h-[50px] flex items-center justify-center ${entry.trainer_signature && entry.trainer_signature.startsWith('data:image') ? '' : (darkMode ? 'bg-slate-700' : 'bg-gray-100')} hover:opacity-80 transition-all border-2 border-dashed ${darkMode ? 'border-slate-600 hover:border-blue-500' : 'border-gray-300 hover:border-blue-500'}`}
                    >
                      {entry.trainer_signature && entry.trainer_signature.startsWith('data:image') ? (
                        <img src={entry.trainer_signature} alt="Unterschrift Ausbilder" className="h-12 max-w-[120px] object-contain" />
                      ) : (
                        <span className={`italic text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>✍️ Unterschreiben</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteSchoolAttendance(entry.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {schoolAttendance.length === 0 && (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-6xl mb-4">📋</div>
              <p className="text-lg">Noch keine Einträge vorhanden</p>
              <p className="text-sm mt-2">Füge deinen ersten Berufsschultag hinzu!</p>
            </div>
          )}
        </div>

        {schoolAttendance.length > 0 && (
          <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{schoolAttendance.length}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Einträge gesamt</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {schoolAttendance.filter(e => e.teacher_signature && e.teacher_signature.trim() !== '').length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lehrer unterschrieben</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {schoolAttendance.filter(e => e.trainer_signature && e.trainer_signature.trim() !== '').length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ausbilder unterschrieben</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {schoolAttendance.filter(e => !e.teacher_signature?.trim() || !e.trainer_signature?.trim()).length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offen</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {signatureModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full shadow-2xl`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ✍️ {signatureModal.field === 'teacher_signature' ? 'Unterschrift Lehrer' : 'Unterschrift Ausbilder'}
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Bitte unterschreiben Sie im Feld unten mit dem Finger oder Stift.
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
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
              >
                <Check className="inline mr-2" size={18} />
                Speichern
              </button>
              <button
                onClick={() => {
                  setSignatureModal(null);
                  setTempSignature(null);
                }}
                className={`flex-1 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-3 rounded-lg font-bold transition-all ${darkMode ? 'text-white' : 'text-gray-700'}`}
              >
                <X className="inline mr-2" size={18} />
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
                className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                🗑️ Unterschrift löschen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolCardView;
