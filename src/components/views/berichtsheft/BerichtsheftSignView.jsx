import React, { useMemo, useState } from 'react';
import { BarChart3, Calendar, CheckCircle2, Clock, Download, Info } from 'lucide-react';

const BerichtsheftSignView = ({
  darkMode,
  berichtsheftPendingLoading,
  berichtsheftPendingSignatures,
  signAssignableUsers,
  loadBerichtsheftForEdit,
  generateBerichtsheftPDF,
  assignBerichtsheftTrainer,
  selectProgressTarget,
  setBerichtsheftViewMode,
}) => {
  const [assignmentSelectionById, setAssignmentSelectionById] = useState({});

  const signerOptions = useMemo(() => {
    if (!Array.isArray(signAssignableUsers)) return [];
    return signAssignableUsers
      .filter((account) => account && account.id)
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'de'));
  }, [signAssignableUsers]);

  const formatWeekRange = (entry) => {
    if (!entry?.week_start || !entry?.week_end) return '-';
    const start = new Date(entry.week_start);
    const end = new Date(entry.week_end);
    return `${start.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  const openProgressForEntry = (entry) => {
    const azubiName = String(entry.user_name || '').trim() || 'Azubi';
    const azubiId = entry.user_id || entry.userId;
    if (!azubiId) return;
    selectProgressTarget(azubiId, azubiName);
    setBerichtsheftViewMode('progress');
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Info className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Hier siehst du alle Wochenberichte, die vom Azubi unterschrieben wurden und noch auf
            Ausbilder-Unterschrift warten.
          </p>
        </div>
      </div>

      {berichtsheftPendingLoading ? (
        <div className={`glass-card rounded-2xl p-6 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Lade offene Berichtshefte...
        </div>
      ) : berichtsheftPendingSignatures.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div
            className={`inline-flex p-4 rounded-full mb-4 ${
              darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <CheckCircle2 size={32} />
          </div>
          <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Aktuell keine offenen Berichtshefte zur Unterschrift.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {berichtsheftPendingSignatures.map((entry) => {
            const selectedTrainerId = assignmentSelectionById[entry.id] ?? entry.assigned_trainer_id ?? '';
            const azubiName = String(entry.user_name || '').trim() || 'Unbekannt';
            const assignedTrainer = String(entry.assigned_trainer_name || '').trim();

            return (
              <div
                key={entry.id}
                className={`glass-card rounded-2xl p-4 border-l-4 ${
                  darkMode ? 'border-amber-500' : 'border-amber-400'
                }`}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      Nr. {entry.nachweis_nr} - {azubiName}
                    </div>
                    <div className={`text-sm flex flex-wrap gap-x-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {formatWeekRange(entry)}
                      </span>
                      <span>·</span>
                      <span>{entry.ausbildungsjahr}. Ausbildungsjahr</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} />
                        {entry.total_hours || 0} Std.
                      </span>
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Zugewiesen an: {assignedTrainer || 'Noch nicht zugewiesen'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:items-end">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => loadBerichtsheftForEdit(entry)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-sm"
                      >
                        Bericht öffnen
                      </button>
                      <button
                        onClick={() => generateBerichtsheftPDF(entry)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
                      >
                        <Download size={16} /> PDF
                      </button>
                      <button
                        onClick={() => openProgressForEntry(entry)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          darkMode
                            ? 'bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/20'
                            : 'bg-white/70 hover:bg-white text-cyan-700 border border-cyan-200'
                        }`}
                      >
                        <BarChart3 size={16} /> Fortschritt
                      </button>
                    </div>

                    <div className="flex gap-2 flex-wrap lg:justify-end">
                      <select
                        value={selectedTrainerId}
                        onChange={(event) =>
                          setAssignmentSelectionById((prev) => ({
                            ...prev,
                            [entry.id]: event.target.value,
                          }))
                        }
                        className={`px-3 py-2 border rounded-lg text-sm min-w-[220px] transition-colors ${
                          darkMode
                            ? 'bg-white/5 border-white/10 text-white focus:border-cyan-400'
                            : 'bg-white/70 border-gray-300 text-gray-700 focus:border-cyan-500'
                        }`}
                      >
                        <option value="">Ausbilder auswählen...</option>
                        {signerOptions.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name || 'Unbenannt'}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => assignBerichtsheftTrainer(entry.id, selectedTrainerId)}
                        disabled={!selectedTrainerId}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedTrainerId
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm'
                            : darkMode
                              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Zuweisen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BerichtsheftSignView;
