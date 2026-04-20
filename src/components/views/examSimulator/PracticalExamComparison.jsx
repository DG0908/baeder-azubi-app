import { Compass } from 'lucide-react';
import { PRACTICAL_EXAM_TYPES } from '../../../data/practicalExam';
import { glassCard, sectionAccent, selectClass } from './examUi';
import { getFirstName, formatAttemptDate } from './examHelpers';

const PracticalExamComparison = ({
  darkMode,
  practicalExamComparisonType,
  setPracticalExamComparisonType,
  comparisonRows,
}) => (
  <div className={glassCard}>
    <div className={sectionAccent('from-teal-500 via-emerald-500 to-cyan-500')} />
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Compass size={20} className={darkMode ? 'text-emerald-300' : 'text-emerald-600'} />
        Trainer-Vergleich (alle Teilnehmer)
      </h3>
      <select
        value={practicalExamComparisonType}
        onChange={(event) => setPracticalExamComparisonType(event.target.value)}
        className={selectClass(darkMode)}
      >
        <option value="alle">Alle Prüfungen</option>
        {PRACTICAL_EXAM_TYPES.map((type) => (
          <option key={type.id} value={type.id}>
            {type.label}
          </option>
        ))}
      </select>
    </div>

    {comparisonRows.length === 0 ? (
      <div className="text-sm text-gray-500">Noch keine Vergleichsdaten vorhanden.</div>
    ) : (
      <div className="space-y-2">
        {comparisonRows.map((row, index) => (
          <div
            key={row.userId}
            className={`rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
            }`}
          >
            <div>
              <div className="font-semibold text-gray-800">
                {index + 1}. {getFirstName(row.userName)}
              </div>
              <div className="text-xs text-gray-500">{row.attemptsCount} Versuch(e)</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-700">
                Beste Note:{' '}
                {Number.isFinite(Number(row.best?.average_grade))
                  ? Number(row.best.average_grade).toFixed(2)
                  : '-'}
              </div>
              <div className="text-xs text-gray-500">
                Letzter Versuch:{' '}
                {Number.isFinite(Number(row.latest?.average_grade))
                  ? Number(row.latest.average_grade).toFixed(2)
                  : '-'}{' '}
                ({formatAttemptDate(row.latest?.created_at)})
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default PracticalExamComparison;
