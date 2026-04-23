import React from 'react';
import { Clock, ListChecks, Plus, Sparkles, X } from 'lucide-react';
import { AUSBILDUNGSRAHMENPLAN } from '../../../data/ausbildungsrahmenplan';

const BerichtsheftWeekDayEntry = ({
  darkMode,
  day,
  dayDate,
  dayLabel,
  dayHours,
  isWeekend,
  entries,
  expandedEntryHints,
  toggleEntryHint,
  addWeekEntry,
  updateWeekEntry,
  removeWeekEntry,
  getBerichtsheftBereichSuggestions,
  getBerichtsheftYearWeeks,
  berichtsheftYear,
}) => {
  const smallInputClass = `w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-cyan-500'
  }`;

  return (
    <div
      className={`glass-card rounded-2xl p-4 border-l-4 ${
        isWeekend
          ? darkMode
            ? 'border-gray-600'
            : 'border-gray-300'
          : darkMode
            ? 'border-cyan-500'
            : 'border-cyan-400'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{day}</span>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {dayLabel} - {dayDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
          </span>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
            darkMode ? 'bg-white/5 text-gray-300' : 'bg-white/70 text-gray-700'
          }`}
        >
          <Clock size={12} />
          {dayHours} Std.
        </div>
      </div>

      {entries.map((entry, entryIndex) => {
        const selectedBereich = AUSBILDUNGSRAHMENPLAN.find(
          (bereich) => bereich.nr === parseInt(entry.bereich, 10),
        );
        const entryKey = `${day}-${entryIndex}`;
        const bereichSuggestions = getBerichtsheftBereichSuggestions(entry.tätigkeit, berichtsheftYear);
        const showBereichSuggestions = !entry.bereich && bereichSuggestions.length > 0;
        const inhaltePreview = (selectedBereich?.inhalte || []).slice(0, 6);
        const isEntryHintExpanded = expandedEntryHints.has(entryKey);
        const visibleInhaltePreview = isEntryHintExpanded ? inhaltePreview : inhaltePreview.slice(0, 3);
        const suggestedBereichExamples = showBereichSuggestions
          ? bereichSuggestions
              .slice(0, 2)
              .map(({ bereich }) => ({
                bereich,
                inhalte: (bereich?.inhalte || []).slice(0, 3),
              }))
              .filter((item) => item.inhalte.length > 0)
          : [];

        return (
          <div key={entryIndex} className="mb-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-start">
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={entry.tätigkeit}
                  onChange={(e) => updateWeekEntry(day, entryIndex, 'tätigkeit', e.target.value)}
                  placeholder="Ausgeführte Tätigkeit..."
                  className={smallInputClass}
                />
              </div>
              <div className="w-full md:w-20 md:flex-shrink-0">
                <input
                  type="number"
                  value={entry.stunden}
                  onChange={(e) => updateWeekEntry(day, entryIndex, 'stunden', e.target.value)}
                  placeholder="Std."
                  step="0.5"
                  min="0"
                  max="12"
                  className={`w-full px-2 py-2 border rounded-lg text-sm text-center transition-colors ${
                    darkMode
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
                      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-cyan-500'
                  }`}
                />
              </div>
              <div className="w-full min-w-0 md:flex-1">
                <select
                  value={entry.bereich}
                  onChange={(e) => updateWeekEntry(day, entryIndex, 'bereich', e.target.value)}
                  className={smallInputClass}
                >
                  <option value="">-- Bereich --</option>
                  {AUSBILDUNGSRAHMENPLAN.map((b) => {
                    const yearWeeks = getBerichtsheftYearWeeks(b, berichtsheftYear);
                    const yearHint = yearWeeks > 0 ? `${yearWeeks}W/J${berichtsheftYear}` : 'laufend';
                    return (
                      <option key={b.nr} value={b.nr}>
                        {b.icon} {b.nr}. {b.bereich} ({yearHint})
                      </option>
                    );
                  })}
                </select>
              </div>
              <button
                onClick={() => removeWeekEntry(day, entryIndex)}
                disabled={entries.length <= 1}
                className={`self-end px-2 py-2 rounded-lg transition-all md:self-auto ${
                  entries.length <= 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : darkMode
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-red-500 hover:bg-red-100'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {showBereichSuggestions && (
              <div
                className={`mt-2 rounded-lg px-3 py-2 text-xs border ${
                  darkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white/70 border-gray-200 text-gray-700'
                }`}
              >
                <div className="font-semibold mb-1 flex items-center gap-1">
                  <Sparkles size={12} className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                  Vorschläge für passenden Bereich:
                </div>
                <div className="flex flex-wrap gap-2">
                  {bereichSuggestions.map(({ bereich }) => (
                    <button
                      key={`${day}-${entryIndex}-suggest-${bereich.nr}`}
                      onClick={() => updateWeekEntry(day, entryIndex, 'bereich', String(bereich.nr))}
                      className={`px-2 py-1 rounded-md transition-all ${
                        darkMode
                          ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20'
                          : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200'
                      }`}
                    >
                      {bereich.icon} {bereich.nr}. {bereich.bereich}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedBereich && inhaltePreview.length > 0 && (
              <div
                className={`mt-2 rounded-lg px-3 py-3 text-sm border ${
                  darkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white/70 border-gray-200 text-gray-700'
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="font-semibold flex items-center gap-1">
                    <ListChecks size={14} className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                    Zu vermittelnde Tätigkeiten (Hilfe):
                  </div>
                  {inhaltePreview.length > 3 && (
                    <button
                      type="button"
                      onClick={() => toggleEntryHint(entryKey)}
                      className={`text-xs font-medium underline underline-offset-2 ${
                        darkMode ? 'text-cyan-300 hover:text-cyan-200' : 'text-cyan-700 hover:text-cyan-800'
                      }`}
                    >
                      {isEntryHintExpanded ? 'Weniger' : 'Mehr anzeigen'}
                    </button>
                  )}
                </div>
                <div className={`space-y-1.5 ${isEntryHintExpanded ? 'max-h-64 overflow-y-auto pr-1' : ''}`}>
                  {visibleInhaltePreview.map((inhalt, idx) => (
                    <div key={`${day}-${entryIndex}-inhalt-${idx}`} className="flex items-start gap-2">
                      <span className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>-</span>
                      <span className="leading-5">{inhalt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!selectedBereich && suggestedBereichExamples.length > 0 && (
              <div
                className={`mt-2 rounded-lg px-3 py-2 text-xs border ${
                  darkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white/70 border-gray-200 text-gray-700'
                }`}
              >
                <div className="font-semibold mb-2 flex items-center gap-1">
                  <Sparkles size={12} className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                  Beispiele aus passenden Bereichen:
                </div>
                <div className="space-y-2">
                  {suggestedBereichExamples.map(({ bereich, inhalte }) => (
                    <div
                      key={`${day}-${entryIndex}-example-${bereich.nr}`}
                      className={`rounded-md px-2 py-2 ${darkMode ? 'bg-white/5' : 'bg-cyan-50/70'}`}
                    >
                      <div className={`font-medium mb-1 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                        {bereich.icon} {bereich.nr}. {bereich.bereich}
                      </div>
                      <div className="space-y-1">
                        {inhalte.map((inhalt, idx) => (
                          <div
                            key={`${day}-${entryIndex}-example-${bereich.nr}-${idx}`}
                            className="flex items-start gap-2"
                          >
                            <span className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>-</span>
                            <span className="leading-5">{inhalt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={() => addWeekEntry(day)}
        className={`mt-2 text-sm flex items-center gap-1 font-medium ${
          darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
        }`}
      >
        <Plus size={16} /> Weitere Tätigkeit
      </button>
    </div>
  );
};

export default BerichtsheftWeekDayEntry;
