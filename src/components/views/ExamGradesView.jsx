import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const SUBJECTS = [
  'Bädertechnik',
  'Bäderorganisation',
  'Schwimm- & Rettungslehre',
  'Gesundheitslehre',
  'Wirtschaft & Sozialkunde',
  'Deutsch',
  'Sport',
  'Sonstiges',
];

const gradeColor = (grade) => {
  if (grade <= 2.0) return 'text-green-500';
  if (grade <= 3.0) return 'text-cyan-500';
  if (grade <= 4.0) return 'text-yellow-500';
  if (grade <= 5.0) return 'text-orange-500';
  return 'text-red-500';
};

const gradeBg = (grade, dark) => {
  if (grade <= 2.0) return dark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200';
  if (grade <= 3.0) return dark ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 border-cyan-200';
  if (grade <= 4.0) return dark ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
  if (grade <= 5.0) return dark ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200';
  return dark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200';
};

const gradeLabel = (grade) => {
  if (grade <= 1.5) return 'Sehr gut';
  if (grade <= 2.5) return 'Gut';
  if (grade <= 3.5) return 'Befriedigend';
  if (grade <= 4.5) return 'Ausreichend';
  if (grade <= 5.5) return 'Mangelhaft';
  return 'Ungenügend';
};

const ExamGradesView = ({
  examGrades,
  allAzubisForExamGrades,
  selectedExamGradesUser,
  setSelectedExamGradesUser,
  addExamGrade,
  deleteExamGrade,
  loadExamGrades,
  canViewAllExamGrades,
}) => {
  const { darkMode, showToast } = useApp();
  const { user } = useAuth();

  const [newDate, setNewDate] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const isOwnView = !selectedExamGradesUser || selectedExamGradesUser.id === user?.id;

  const handleAdd = async () => {
    if (!newDate || !newSubject || !newTopic || !newGrade) {
      showToast('Bitte Datum, Fach, Thema und Note ausfüllen.', 'warning');
      return;
    }
    const grade = parseFloat(newGrade.replace(',', '.'));
    if (isNaN(grade) || grade < 1.0 || grade > 6.0) {
      showToast('Note muss zwischen 1,0 und 6,0 liegen.', 'warning');
      return;
    }
    await addExamGrade({
      date: newDate,
      subject: newSubject,
      topic: newTopic,
      grade,
      notes: newNotes.trim() || null,
    });
    setNewDate('');
    setNewSubject('');
    setNewTopic('');
    setNewGrade('');
    setNewNotes('');
  };

  const filteredGrades = useMemo(() => {
    if (filterSubject === 'all') return examGrades;
    return examGrades.filter(g => g.subject === filterSubject);
  }, [examGrades, filterSubject]);

  // Calculate averages per subject
  const subjectAverages = useMemo(() => {
    const map = {};
    examGrades.forEach(g => {
      if (!map[g.subject]) map[g.subject] = { sum: 0, count: 0, grades: [] };
      map[g.subject].sum += g.grade;
      map[g.subject].count += 1;
      map[g.subject].grades.push(g.grade);
    });
    return Object.entries(map)
      .map(([subject, data]) => ({
        subject,
        average: data.sum / data.count,
        count: data.count,
        best: Math.min(...data.grades),
        worst: Math.max(...data.grades),
      }))
      .sort((a, b) => a.average - b.average);
  }, [examGrades]);

  // Overall average
  const overallAverage = examGrades.length > 0
    ? examGrades.reduce((s, g) => s + g.grade, 0) / examGrades.length
    : null;

  const bg = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const card = darkMode ? 'bg-slate-800' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const input = darkMode
    ? 'bg-slate-700 text-white border-slate-600 focus:border-cyan-500'
    : 'bg-gray-100 border-gray-300 focus:border-cyan-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Klasuren & Noten</h2>
        <p className="opacity-90">
          {isOwnView ? 'Deine Schulnoten im Überblick' : `Noten von ${selectedExamGradesUser?.name}`}
        </p>
      </div>

      {/* User selection for trainers/admins */}
      {canViewAllExamGrades() && (
        <div className={`${card} rounded-xl p-4 shadow-lg`}>
          <h3 className={`text-sm font-bold mb-3 ${textMuted}`}>Azubi auswählen</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedExamGradesUser(null);
                loadExamGrades(user.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isOwnView
                  ? 'bg-indigo-500 text-white'
                  : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Meine Noten
            </button>
            {allAzubisForExamGrades.map(azubi => (
              <button
                key={azubi.id}
                onClick={() => {
                  setSelectedExamGradesUser(azubi);
                  loadExamGrades(azubi.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedExamGradesUser?.id === azubi.id
                    ? 'bg-indigo-500 text-white'
                    : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {azubi.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notenübersicht / Erwartete Noten */}
      {subjectAverages.length > 0 && (
        <div className={`${card} rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${text}`}>
            Erwartete Zeugnisnoten
          </h3>
          {overallAverage !== null && (
            <div className={`mb-4 p-4 rounded-xl border ${gradeBg(overallAverage, darkMode)} text-center`}>
              <div className={`text-3xl font-bold ${gradeColor(overallAverage)}`}>
                {overallAverage.toFixed(1).replace('.', ',')}
              </div>
              <div className={`text-sm font-semibold ${gradeColor(overallAverage)}`}>
                Gesamtdurchschnitt · {gradeLabel(overallAverage)}
              </div>
              <div className={`text-xs mt-1 ${textMuted}`}>
                aus {examGrades.length} Klasur{examGrades.length !== 1 ? 'en' : ''}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjectAverages.map(sa => (
              <div
                key={sa.subject}
                className={`p-4 rounded-xl border ${gradeBg(sa.average, darkMode)} flex items-center justify-between`}
              >
                <div>
                  <div className={`font-semibold text-sm ${text}`}>{sa.subject}</div>
                  <div className={`text-xs ${textMuted}`}>
                    {sa.count} Klasur{sa.count !== 1 ? 'en' : ''} · Beste: {sa.best.toFixed(1).replace('.', ',')} · Schlechteste: {sa.worst.toFixed(1).replace('.', ',')}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${gradeColor(sa.average)}`}>
                    {sa.average.toFixed(1).replace('.', ',')}
                  </div>
                  <div className={`text-xs ${gradeColor(sa.average)}`}>{gradeLabel(sa.average)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Neue Klasur eintragen */}
      {isOwnView && (
        <div className={`${card} rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${text}`}>Neue Klasur eintragen</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Datum</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Fach</label>
              <select
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`}
              >
                <option value="">Fach wählen...</option>
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Thema der Klasur</label>
              <input
                type="text"
                placeholder="z.B. Wasseraufbereitung"
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Note</label>
              <input
                type="text"
                placeholder="z.B. 2,3"
                value={newGrade}
                onChange={e => setNewGrade(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAdd()}
                className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Anmerkungen (optional)</label>
              <input
                type="text"
                placeholder="z.B. Nachschrift, mündliche Prüfung..."
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`}
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 w-full sm:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-all"
          >
            Klasur speichern
          </button>
        </div>
      )}

      {/* Filter */}
      {examGrades.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterSubject('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filterSubject === 'all'
                ? 'bg-indigo-500 text-white'
                : darkMode ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-600'
            }`}
          >
            Alle ({examGrades.length})
          </button>
          {[...new Set(examGrades.map(g => g.subject))].map(sub => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterSubject === sub
                  ? 'bg-indigo-500 text-white'
                  : darkMode ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-600'
              }`}
            >
              {sub} ({examGrades.filter(g => g.subject === sub).length})
            </button>
          ))}
        </div>
      )}

      {/* Noten-Liste */}
      <div className={`${card} rounded-xl shadow-lg overflow-hidden`}>
        {filteredGrades.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredGrades.map(grade => (
              <div key={grade.id} className={`p-4 flex items-center gap-4 ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                {/* Note */}
                <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${gradeBg(grade.grade, darkMode)}`}>
                  <span className={`text-xl font-bold ${gradeColor(grade.grade)}`}>
                    {grade.grade.toFixed(1).replace('.', ',')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold ${text} truncate`}>{grade.topic}</div>
                  <div className={`text-sm ${textMuted}`}>
                    {grade.subject} · {new Date(grade.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                  {grade.notes && (
                    <div className={`text-xs mt-0.5 ${textMuted} italic truncate`}>{grade.notes}</div>
                  )}
                </div>

                {/* Delete */}
                {isOwnView && (
                  <button
                    onClick={() => deleteExamGrade(grade.id)}
                    className="text-red-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all flex-shrink-0"
                    title="Löschen"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-12 text-center ${textMuted}`}>
            <div className="text-4xl mb-3">📝</div>
            <p className="font-semibold">Noch keine Klasuren eingetragen</p>
            <p className="text-sm mt-1">Trage deine erste Klasur oben ein.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamGradesView;
