import React from 'react';
import { BarChart3, CheckCircle2, ChevronDown, ChevronUp, ClipboardList, Info, UserCheck, X } from 'lucide-react';
import { AUSBILDUNGSRAHMENPLAN } from '../../../data/ausbildungsrahmenplan';

const BerichtsheftProgressView = ({
  darkMode,
  calculateBereichProgress,
  expandedBereiche,
  toggleBereich,
  canManageBerichtsheftSignatures,
  progressAzubis,
  progressTargetUserId,
  progressTargetUserName,
  progressLoading,
  selectProgressTarget,
  clearProgressTarget,
}) => {
  const progress = calculateBereichProgress();
  const stundenProWoche = 40;

  const viewerLabel = progressTargetUserId
    ? `Fortschritt von: ${progressTargetUserName || 'Azubi'}`
    : 'Dein persönlicher Fortschritt';

  return (
    <div className="space-y-6">
      {canManageBerichtsheftSignatures && (
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={18} />
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Azubi-Fortschritt ansehen</h3>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={progressTargetUserId || ''}
              onChange={(event) => {
                const value = event.target.value;
                if (!value) {
                  clearProgressTarget();
                  return;
                }
                const azubi = (progressAzubis || []).find((a) => a.id === value);
                selectProgressTarget(value, azubi?.name || '');
              }}
              className={`px-3 py-2 border rounded-lg text-sm min-w-[240px] transition-colors ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-white focus:border-cyan-400'
                  : 'bg-white/70 border-gray-300 text-gray-700 focus:border-cyan-500'
              }`}
            >
              <option value="">-- Eigener Fortschritt --</option>
              {(progressAzubis || []).map((azubi) => (
                <option key={azubi.id} value={azubi.id}>
                  {azubi.name}
                </option>
              ))}
            </select>
            {progressTargetUserId && (
              <button
                onClick={clearProgressTarget}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  darkMode
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                    : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <X size={14} /> Auswahl löschen
              </button>
            )}
            {progressLoading && (
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lade Daten...</span>
            )}
          </div>
          <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Wähle einen Azubi aus deinem Betrieb, um dessen Lernfortschritt zu sehen.
          </p>
        </div>
      )}

      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Info className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
          <div className="flex-1">
            <p className={`text-sm font-semibold mb-0.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {viewerLabel}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Fortschritt in den Ausbildungsbereichen gemäß Ausbildungsrahmenplan (§4). Soll-Wochen basieren auf den
              zeitlichen Richtwerten der Verordnung.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(progress).map(([nr, data]) => {
          const istWochen = data.istStunden / stundenProWoche;
          const prozent =
            data.sollWochen > 0
              ? Math.min(100, (istWochen / data.sollWochen) * 100)
              : data.istStunden > 0
                ? 100
                : 0;
          const isDone = prozent >= 100;

          return (
            <div
              key={nr}
              className={`glass-card rounded-2xl p-4 border-l-4 ${
                isDone
                  ? darkMode
                    ? 'border-emerald-500'
                    : 'border-emerald-400'
                  : darkMode
                    ? 'border-cyan-500'
                    : 'border-cyan-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">{data.icon}</span>
                  <span className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {nr}. {data.name}
                  </span>
                </div>
                <div className={`text-sm flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {istWochen.toFixed(1)} / {data.sollWochen > 0 ? data.sollWochen : '∞'} Wochen
                  <span className="ml-2 font-bold">({data.istStunden.toFixed(0)} Std.)</span>
                </div>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${data.color}`}
                  style={{ width: `${prozent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {prozent.toFixed(0)}% erreicht
                </span>
                {isDone && (
                  <span
                    className={`text-xs font-medium inline-flex items-center gap-1 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`}
                  >
                    <CheckCircle2 size={12} /> Abgeschlossen
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${
          darkMode
            ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900'
            : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600'
        }`}
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} />
            <h3 className="font-bold text-lg">Gesamtfortschritt</h3>
          </div>
          {(() => {
            const totalIstStunden = Object.values(progress).reduce((sum, d) => sum + d.istStunden, 0);
            const totalSollWochen = AUSBILDUNGSRAHMENPLAN.reduce((sum, b) => sum + b.gesamtWochen, 0);
            const totalSollStunden = totalSollWochen * 40;
            const gesamtProzent = totalSollStunden > 0 ? (totalIstStunden / totalSollStunden) * 100 : 0;

            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="px-3 py-3 rounded-xl bg-white/15 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{totalIstStunden.toFixed(0)}</div>
                  <div className="text-sm opacity-80">Stunden erfasst</div>
                </div>
                <div className="px-3 py-3 rounded-xl bg-white/15 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{(totalIstStunden / 40).toFixed(1)}</div>
                  <div className="text-sm opacity-80">Wochen erfasst</div>
                </div>
                <div className="px-3 py-3 rounded-xl bg-white/15 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{totalSollWochen}</div>
                  <div className="text-sm opacity-80">Soll-Wochen</div>
                </div>
                <div className="px-3 py-3 rounded-xl bg-white/15 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{gesamtProzent.toFixed(0)}%</div>
                  <div className="text-sm opacity-80">Gesamt</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Ausbildungsrahmenplan - Übersicht
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={darkMode ? 'bg-white/5' : 'bg-gray-100/70'}>
                <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nr.</th>
                <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bereich</th>
                <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>1. Jahr</th>
                <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>2. Jahr</th>
                <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>3. Jahr</th>
                <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gesamt</th>
              </tr>
            </thead>
            <tbody className={darkMode ? 'divide-y divide-white/10' : 'divide-y divide-gray-200'}>
              {AUSBILDUNGSRAHMENPLAN.map((bereich) => {
                const isOpen = expandedBereiche.has(bereich.nr);
                return (
                  <React.Fragment key={bereich.nr}>
                    <tr
                      onClick={() => toggleBereich(bereich.nr)}
                      className={`cursor-pointer transition-colors ${
                        darkMode ? 'hover:bg-white/5' : 'hover:bg-cyan-50/50'
                      }`}
                    >
                      <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        <span className="mr-1">{bereich.icon}</span> {bereich.nr}
                      </td>
                      <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {bereich.bereich}
                        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {bereich.paragraph}
                        </div>
                      </td>
                      <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {bereich.wochen.jahr1 || '-'}
                      </td>
                      <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {bereich.wochen.jahr2 || '-'}
                      </td>
                      <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {bereich.wochen.jahr3 || '-'}
                      </td>
                      <td className={`px-3 py-2 text-center font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        <div className="flex items-center justify-center gap-1">
                          {bereich.gesamtWochen || 'lfd.'}
                          {isOpen ? (
                            <ChevronUp size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                          ) : (
                            <ChevronDown size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                          )}
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className={darkMode ? 'bg-white/5' : 'bg-cyan-50/50'}>
                        <td />
                        <td colSpan={5} className="px-4 py-3">
                          <p
                            className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                              darkMode ? 'text-cyan-400' : 'text-cyan-700'
                            }`}
                          >
                            Zu vermittelnde Fertigkeiten und Kenntnisse
                          </p>
                          <ul className="space-y-1">
                            {bereich.inhalte.map((inhalt, i) => (
                              <li
                                key={i}
                                className={`flex items-start gap-2 text-sm ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                              >
                                <span
                                  className={`mt-0.5 shrink-0 text-xs font-bold ${
                                    darkMode ? 'text-cyan-400' : 'text-cyan-600'
                                  }`}
                                >
                                  {i + 1}.
                                </span>
                                {inhalt}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={`mt-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          * "lfd." = wird während der gesamten Ausbildung laufend vermittelt
        </p>
      </div>
    </div>
  );
};

export default BerichtsheftProgressView;
