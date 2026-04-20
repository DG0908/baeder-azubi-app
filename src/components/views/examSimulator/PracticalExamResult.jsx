import { Award, FileDown, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatGradeLabel } from '../../../data/practicalExam';
import { glassCard, sectionAccent } from './examUi';
import { getFirstName } from './examHelpers';

const PracticalExamResult = ({
  darkMode,
  practicalExamResult,
  selectedType,
  selectedTargetUser,
  exportPracticalExamToPdf,
  loadPracticalExamHistory,
}) => {
  const passed = practicalExamResult.passed;
  const summaryTiles = [
    { label: 'Gewertete Disziplinen', value: practicalExamResult.gradedCount },
    {
      label: 'Durchschnittsnote',
      value:
        practicalExamResult.averageGrade !== null
          ? practicalExamResult.averageGrade.toFixed(2)
          : '-',
    },
    {
      label: 'Status',
      value:
        passed === null ? 'offen' : passed ? 'bestanden' : 'nicht bestanden',
      tone: passed === null ? 'neutral' : passed ? 'good' : 'bad',
    },
  ];

  return (
    <div className={glassCard}>
      <div className={sectionAccent('from-cyan-500 via-emerald-500 to-teal-500')} />
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Award size={20} className={darkMode ? 'text-emerald-300' : 'text-emerald-600'} />
        Ergebnis {selectedType.label}
      </h3>
      <div className="mb-4 text-sm text-gray-700">
        Teilnehmer:{' '}
        <strong>
          {getFirstName(practicalExamResult.userName || selectedTargetUser?.name)}
        </strong>
      </div>

      <div className="space-y-2">
        {practicalExamResult.rows.map((row) => (
          <div
            key={row.id}
            className={`rounded-xl p-3 flex items-center justify-between gap-3 ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
            }`}
          >
            <div>
              <div className="font-medium text-gray-800">{row.name}</div>
              <div className="text-sm text-gray-600">Wert: {row.displayValue}</div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                {row.grade ? formatGradeLabel(row.grade, row.noteLabel) : 'Keine Note'}
              </div>
              {row.points !== null && row.points !== undefined && (
                <div className="text-xs text-gray-500">{row.points} Punkte</div>
              )}
              {row.gradingMissing && (
                <div className="text-xs text-orange-500 flex items-center gap-1 justify-end">
                  <AlertTriangle size={10} /> Wertungstabelle fehlt
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-black/10 grid md:grid-cols-3 gap-3">
        {summaryTiles.map((tile) => {
          const toneCls =
            tile.tone === 'good'
              ? darkMode
                ? 'text-emerald-300'
                : 'text-emerald-600'
              : tile.tone === 'bad'
                ? darkMode
                  ? 'text-rose-300'
                  : 'text-rose-600'
                : 'text-gray-800';
          return (
            <div
              key={tile.label}
              className={`rounded-xl p-3 ${
                darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
              }`}
            >
              <div className="text-xs text-gray-500">{tile.label}</div>
              <div className={`text-xl font-bold ${toneCls}`}>{tile.value}</div>
            </div>
          );
        })}
      </div>

      {practicalExamResult.missingTables > 0 && (
        <div className="mt-4 text-sm text-orange-500 flex items-center gap-1.5">
          <AlertTriangle size={14} />
          Hinweis: {practicalExamResult.missingTables} Disziplin(en) haben noch keine
          Wertungstabelle.
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => exportPracticalExamToPdf()}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
        >
          <FileDown size={14} />
          Als PDF exportieren
        </button>
        <button
          onClick={() => void loadPracticalExamHistory()}
          className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
            darkMode
              ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
              : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <RefreshCw size={14} />
          Historie aktualisieren
        </button>
      </div>
    </div>
  );
};

export default PracticalExamResult;
