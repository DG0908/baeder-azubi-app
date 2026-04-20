import { Trophy, Timer } from 'lucide-react';
import { formatGradeLabel, formatSecondsAsTime } from '../../../data/practicalExam';
import { glassCard, sectionAccent } from './examUi';
import { getFirstName, formatAttemptDate } from './examHelpers';

const PracticalExamLeaders = ({ darkMode, disciplineLeaders, selectedType }) => (
  <div className={glassCard}>
    <div className={sectionAccent('from-amber-500 via-orange-500 to-rose-500')} />
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Trophy size={20} className={darkMode ? 'text-amber-300' : 'text-amber-600'} />
        Schnellste Zeiten je Disziplin
      </h3>
      <div className="text-xs text-gray-500">
        Basis: gespeicherte {selectedType.label}-Versuche
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-3">
      {disciplineLeaders.map((entry) => (
        <div
          key={entry.discipline.id}
          className={`rounded-xl p-3 ${
            darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
          }`}
        >
          <div className="font-semibold text-gray-800">{entry.discipline.name}</div>
          {entry.discipline.inputType !== 'time' &&
          entry.discipline.inputType !== 'time_distance' ? (
            <div className="text-sm mt-1 text-gray-500">Keine Zeit-Bestenliste (Notenfach).</div>
          ) : !entry.best ? (
            <div className="text-sm mt-1 text-gray-500">Noch keine gültige Zeit vorhanden.</div>
          ) : (
            <div className="mt-1 space-y-1">
              <div
                className={`text-lg font-bold flex items-center gap-1.5 ${
                  darkMode ? 'text-cyan-300' : 'text-cyan-700'
                }`}
              >
                <Timer size={16} />
                {formatSecondsAsTime(entry.best.seconds)}
              </div>
              <div className="text-sm text-gray-700">{getFirstName(entry.best.userName)}</div>
              <div className="text-xs text-gray-500">
                {formatAttemptDate(entry.best.createdAt)} •{' '}
                {entry.best.row?.grade
                  ? formatGradeLabel(entry.best.row.grade, entry.best.row.noteLabel)
                  : 'Keine Note'}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default PracticalExamLeaders;
