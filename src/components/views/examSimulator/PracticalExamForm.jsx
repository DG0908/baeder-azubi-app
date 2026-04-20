import { Waves, Calculator, RotateCcw, Users } from 'lucide-react';
import { PRACTICAL_EXAM_TYPES } from '../../../data/practicalExam';
import { glassCard, sectionAccent, inputClass, selectClass, pillBtn } from './examUi';
import { formatCandidateLabel, getFirstName } from './examHelpers';

const PracticalExamForm = ({
  darkMode,
  user,
  practicalExamType,
  setPracticalExamType,
  practicalExamInputs,
  practicalExamTargetUserId,
  setPracticalExamTargetUserId,
  resetPracticalExam,
  updatePracticalExamInput,
  evaluatePracticalExam,
  getPracticalParticipantCandidates,
  selectedType,
  disciplines,
}) => {
  const canManageAllPractical = Boolean(user?.permissions?.canViewAllStats);
  const practicalCandidates = getPracticalParticipantCandidates();
  const selectedTargetUser = canManageAllPractical
    ? practicalCandidates.find((a) => a.id === practicalExamTargetUserId) || null
    : user;

  return (
    <div className={glassCard}>
      <div className={sectionAccent('from-cyan-500 via-sky-500 to-emerald-500')} />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Waves size={22} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
            Praktische Prüfung
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Zeiten eintragen, Note direkt aus der Wertungstabelle berechnen.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {PRACTICAL_EXAM_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setPracticalExamType(type.id);
                resetPracticalExam();
              }}
              className={pillBtn(
                practicalExamType === type.id,
                darkMode,
                'from-cyan-500 to-emerald-500',
              )}
            >
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {canManageAllPractical && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1.5">
            <Users size={14} /> Prüfung für Teilnehmer
          </label>
          <select
            value={practicalExamTargetUserId}
            onChange={(event) => setPracticalExamTargetUserId(event.target.value)}
            className={`md:w-[360px] ${selectClass(darkMode)}`}
          >
            {practicalCandidates.length === 0 && <option value="">Keine Teilnehmer verfügbar</option>}
            {practicalCandidates.map((account) => (
              <option key={account.id} value={account.id}>
                {formatCandidateLabel(account)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className={`rounded-xl p-4 mb-4 border-l-4 ${
          darkMode
            ? 'bg-cyan-900/30 border-cyan-500 text-cyan-200'
            : 'bg-cyan-50 border-cyan-500 text-cyan-900'
        }`}
      >
        <div className="text-sm font-semibold">Aktive Prüfung: {selectedType.label}</div>
        <div className="text-xs mt-1 opacity-80">
          Format: Zeit als mm:ss (z. B. 01:42) oder in Sekunden.
        </div>
        <div className="text-xs mt-1 opacity-80">
          Teilnehmer: {getFirstName(selectedTargetUser?.name || user?.name)}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {disciplines.map((discipline) => (
          <div
            key={discipline.id}
            className={`rounded-xl p-4 ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
            }`}
          >
            <div className="font-bold mb-2 text-gray-800">{discipline.name}</div>
            <input
              type="text"
              value={practicalExamInputs[discipline.id] || ''}
              onChange={(event) => updatePracticalExamInput(discipline.id, event.target.value)}
              placeholder={discipline.inputPlaceholder || 'Wert eingeben'}
              className={inputClass(darkMode)}
            />
            {discipline.inputType === 'time_distance' && (
              <input
                type="number"
                min="0"
                step="1"
                value={practicalExamInputs[`${discipline.id}_distance`] || ''}
                onChange={(event) =>
                  updatePracticalExamInput(`${discipline.id}_distance`, event.target.value)
                }
                placeholder={discipline.distancePlaceholder || 'Strecke in m'}
                className={`mt-2 ${inputClass(darkMode)}`}
              />
            )}
            <div className="mt-2 text-xs text-gray-500">
              {discipline.inputType === 'time' && 'Zeit-Eingabe'}
              {discipline.inputType === 'grade' && 'Direkte Note'}
              {discipline.inputType === 'time_distance' && 'Zeit + Strecke'}
              {discipline.required === false ? ' (optional)' : ' (pflicht)'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={evaluatePracticalExam}
          className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
        >
          <Calculator size={18} />
          Note berechnen
        </button>
        <button
          onClick={resetPracticalExam}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            darkMode
              ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
              : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <RotateCcw size={16} />
          Eingaben zurücksetzen
        </button>
      </div>
    </div>
  );
};

export default PracticalExamForm;
