import { FolderOpen, FileDown } from 'lucide-react';
import { PRACTICAL_EXAM_TYPES, formatGradeLabel } from '../../../data/practicalExam';
import { glassCard, sectionAccent, selectClass } from './examUi';
import { formatCandidateLabel, formatAttemptDate } from './examHelpers';

const attemptTypeLabel = (typeId) =>
  PRACTICAL_EXAM_TYPES.find((type) => type.id === typeId)?.label || typeId;

const PracticalExamHistory = ({
  darkMode,
  user,
  practicalExamHistory,
  practicalExamHistoryLoading,
  practicalExamHistoryTypeFilter,
  setPracticalExamHistoryTypeFilter,
  practicalExamHistoryUserFilter,
  setPracticalExamHistoryUserFilter,
  practicalCandidates,
  exportPracticalExamToPdf,
}) => {
  const canManageAllPractical = Boolean(user?.permissions?.canViewAllStats);
  const historyFiltered = practicalExamHistory
    .filter(
      (attempt) =>
        practicalExamHistoryTypeFilter === 'alle' ||
        attempt.exam_type === practicalExamHistoryTypeFilter,
    )
    .filter(
      (attempt) =>
        !canManageAllPractical ||
        practicalExamHistoryUserFilter === 'all' ||
        attempt.user_id === practicalExamHistoryUserFilter,
    );

  return (
    <div className={glassCard}>
      <div className={sectionAccent('from-indigo-500 via-purple-500 to-blue-500')} />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FolderOpen size={20} className={darkMode ? 'text-indigo-300' : 'text-indigo-600'} />
          Versuchshistorie
        </h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={practicalExamHistoryTypeFilter}
            onChange={(event) => setPracticalExamHistoryTypeFilter(event.target.value)}
            className={selectClass(darkMode)}
          >
            <option value="alle">Alle Prüfungen</option>
            {PRACTICAL_EXAM_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          {canManageAllPractical && (
            <select
              value={practicalExamHistoryUserFilter}
              onChange={(event) => setPracticalExamHistoryUserFilter(event.target.value)}
              className={selectClass(darkMode)}
            >
              <option value="all">Alle Teilnehmer</option>
              {practicalCandidates.map((account) => (
                <option key={account.id} value={account.id}>
                  {formatCandidateLabel(account)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {practicalExamHistoryLoading ? (
        <div className="text-sm text-gray-500">Historie wird geladen...</div>
      ) : historyFiltered.length === 0 ? (
        <div className="text-sm text-gray-500">Noch keine gespeicherten Versuche vorhanden.</div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {historyFiltered.map((attempt) => (
            <div
              key={attempt.id}
              className={`rounded-xl p-3 ${
                darkMode
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-white/70 border border-gray-200'
              }`}
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-800">
                    {attempt.user_name} • {attemptTypeLabel(attempt.exam_type)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatAttemptDate(attempt.created_at)}{' '}
                    {attempt.source === 'local' ? '• lokal gespeichert' : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    {Number.isFinite(Number(attempt.average_grade))
                      ? `Ø ${Number(attempt.average_grade).toFixed(2)}`
                      : 'Ø -'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {attempt.passed === null
                      ? 'offen'
                      : attempt.passed
                        ? 'bestanden'
                        : 'nicht bestanden'}
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                {(attempt.rows || []).map((row) => (
                  <div key={`${attempt.id}-${row.id}`} className="text-xs text-gray-600">
                    {row.name}: {row.displayValue} •{' '}
                    {row.grade ? formatGradeLabel(row.grade, row.noteLabel) : 'Keine Note'}
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <button
                  onClick={() => exportPracticalExamToPdf(attempt)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
                      : 'bg-white/70 hover:bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <FileDown size={12} />
                  PDF exportieren
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticalExamHistory;
