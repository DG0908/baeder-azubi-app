import React from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Plus,
  Trash2,
} from 'lucide-react';

const BerichtsheftListView = ({
  darkMode,
  berichtsheftEntries,
  openBerichtsheftDraftForCurrentWeek,
  loadBerichtsheftForEdit,
  generateBerichtsheftPDF,
  deleteBerichtsheft,
  totalEntries,
  signedCount,
  openCount,
  totalHoursAll,
}) => {
  if (!berichtsheftEntries || berichtsheftEntries.length === 0) {
    return (
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-12 text-center">
          <div
            className={`inline-flex p-4 rounded-full mb-4 ${
              darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-600'
            }`}
          >
            <BookOpen size={32} />
          </div>
          <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Noch keine Berichtshefte vorhanden
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Erstelle deinen ersten Wochenbericht!
          </p>
          <button
            onClick={openBerichtsheftDraftForCurrentWeek}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-cyan-500/30 inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Neuer Bericht
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {berichtsheftEntries.map((entry) => {
          const isSigned = entry.signatur_azubi && entry.signatur_ausbilder;
          return (
            <div
              key={entry.id}
              className={`glass-card rounded-2xl p-4 border-l-4 ${
                isSigned
                  ? darkMode
                    ? 'border-emerald-500'
                    : 'border-emerald-400'
                  : darkMode
                    ? 'border-amber-500'
                    : 'border-amber-400'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold ${
                        darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                      }`}
                    >
                      <FileText size={14} />
                      Nr. {entry.nachweis_nr}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        isSigned
                          ? darkMode
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-emerald-100 text-emerald-700'
                          : darkMode
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isSigned ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {isSigned ? 'Unterschrieben' : 'Offen'}
                    </span>
                  </div>
                  <div
                    className={`text-sm flex flex-wrap gap-x-3 gap-y-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(entry.week_start).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(entry.week_end).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span>{entry.ausbildungsjahr}. Ausbildungsjahr</span>
                    <span>·</span>
                    <span className="font-medium inline-flex items-center gap-1">
                      <Clock size={12} />
                      {entry.total_hours || 0} Std.
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => generateBerichtsheftPDF(entry)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
                  >
                    <Download size={16} /> PDF
                  </button>
                  <button
                    onClick={() => loadBerichtsheftForEdit(entry)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                        : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => deleteBerichtsheft(entry.id)}
                    className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg font-medium transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {totalEntries}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wochen erfasst</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {signedCount}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unterschrieben</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              {openCount}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offen</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {totalHoursAll}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stunden gesamt</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BerichtsheftListView;
