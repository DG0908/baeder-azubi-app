import React, { useState, useMemo } from 'react';
import { ClipboardList, Calendar, Trash2 } from 'lucide-react';
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

const ExamsView = ({
  // Anstehende Klausuren props
  exams,
  examTitle,
  setExamTitle,
  examDate,
  setExamDate,
  examTopics,
  setExamTopics,
  addExam,
  deleteExam,
  // Notenbuch props
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

  const [activeTab, setActiveTab] = useState('upcoming');

  // Notenbuch state
  const [newDate, setNewDate] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const isOwnView = !selectedExamGradesUser || selectedExamGradesUser.id === user?.id;

  const handleAddGrade = async () => {
    if (!newDate || !newSubject || !newTopic || !newGrade) {
      showToast('Bitte Datum, Fach, Thema und Note ausfüllen.', 'warning');
      return;
    }
    const grade = parseFloat(newGrade.replace(',', '.'));
    if (isNaN(grade) || grade < 1.0 || grade > 6.0) {
      showToast('Note muss zwischen 1,0 und 6,0 liegen.', 'warning');
      return;
    }
    await addExamGrade({ date: newDate, subject: newSubject, topic: newTopic, grade, notes: newNotes.trim() || null });
    setNewDate('');
    setNewSubject('');
    setNewTopic('');
    setNewGrade('');
    setNewNotes('');
  };

  const filteredGrades = useMemo(() => {
    if (!examGrades) return [];
    if (filterSubject === 'all') return examGrades;
    return examGrades.filter(g => g.subject === filterSubject);
  }, [examGrades, filterSubject]);

  const subjectAverages = useMemo(() => {
    if (!examGrades) return [];
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

  const overallAverage = examGrades && examGrades.length > 0
    ? examGrades.reduce((s, g) => s + g.grade, 0) / examGrades.length
    : null;

  const card = darkMode ? 'bg-slate-800' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const input = darkMode
    ? 'bg-slate-700 text-white border-slate-600 focus:border-cyan-500'
    : 'bg-gray-100 border-gray-300 focus:border-cyan-500';

  // Count upcoming exams
  const upcomingCount = exams ? exams.filter(e => {
    if (!e.date) return true;
    return new Date(e.date) >= new Date(new Date().toDateString());
  }).length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Klausuren</h2>
        <p className="opacity-90">Anstehende Arbeiten planen und Noten verwalten</p>
      </div>

      {/* Tabs */}
      <div className={`${card} rounded-xl shadow-lg p-1.5 flex gap-1.5`}>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'upcoming'
              ? 'bg-green-500 text-white shadow-md'
              : darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Anstehend {upcomingCount > 0 && (
            <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'upcoming' ? 'bg-white/20' : 'bg-green-100 text-green-700'
            }`}>{upcomingCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'grades'
              ? 'bg-indigo-500 text-white shadow-md'
              : darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Notenbuch {overallAverage !== null && (
            <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'grades' ? 'bg-white/20' : 'bg-indigo-100 text-indigo-700'
            }`}>{overallAverage.toFixed(1).replace('.', ',')}</span>
          )}
        </button>
      </div>

      {/* ==================== TAB: ANSTEHENDE KLAUSUREN ==================== */}
      {activeTab === 'upcoming' && (
        <>
          {/* Neue Klausur eintragen */}
          <div className={`${card} rounded-xl p-6 shadow-lg`}>
            <h3 className={`text-lg font-bold mb-4 ${text}`}>Klausur ankündigen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Titel / Fach</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="z.B. Bädertechnik Klausur 3"
                  className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Datum</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Themen / Lernstoff</label>
                <textarea
                  value={examTopics}
                  onChange={(e) => setExamTopics(e.target.value)}
                  placeholder="Welche Themen werden abgefragt?"
                  rows="3"
                  className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none resize-none`}
                />
              </div>
            </div>
            <button
              onClick={addExam}
              className="mt-4 w-full sm:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all"
            >
              <Calendar className="inline mr-2" size={18} />
              Eintragen
            </button>
          </div>

          {/* Liste */}
          <div className={`${card} rounded-xl shadow-lg overflow-hidden`}>
            {exams && exams.length > 0 ? (
              <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                {exams.map(exam => {
                  const examDateObj = exam.date ? new Date(exam.date) : null;
                  const today = new Date(new Date().toDateString());
                  const isPast = examDateObj && examDateObj < today;
                  const isToday = examDateObj && examDateObj.getTime() === today.getTime();
                  const daysUntil = examDateObj ? Math.ceil((examDateObj - today) / (1000 * 60 * 60 * 24)) : null;

                  return (
                    <div key={exam.id} className={`p-4 ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors ${isPast ? 'opacity-50' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold ${text}`}>{exam.title}</h3>
                          {(exam.description || exam.topics) && (
                            <p className={`text-sm mt-1 ${textMuted}`}>{exam.description || exam.topics}</p>
                          )}
                          <p className={`text-xs mt-1 ${textMuted}`}>
                            Eingetragen von {exam.createdBy || exam.user}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isToday
                              ? 'bg-red-100 text-red-700 animate-pulse'
                              : isPast
                                ? darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                                : daysUntil !== null && daysUntil <= 3
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-800'
                          }`}>
                            {isToday ? 'Heute!' : isPast ? 'Vorbei' : examDateObj
                              ? `${examDateObj.toLocaleDateString('de-DE')}${daysUntil !== null ? ` (${daysUntil}d)` : ''}`
                              : 'Ohne Termin'}
                          </span>
                          <button
                            onClick={() => deleteExam(exam.id)}
                            className="text-red-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                            title="Löschen"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`p-12 text-center ${textMuted}`}>
                <div className="text-4xl mb-3">📅</div>
                <p className="font-semibold">Keine Klausuren eingetragen</p>
                <p className="text-sm mt-1">Trage anstehende Klausuren oben ein, damit alle Bescheid wissen.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ==================== TAB: NOTENBUCH ==================== */}
      {activeTab === 'grades' && (
        <>
          {/* User selection for trainers/admins */}
          {canViewAllExamGrades && canViewAllExamGrades() && (
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
                {(allAzubisForExamGrades || []).map(azubi => (
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

          {/* Notenübersicht */}
          {subjectAverages.length > 0 && (
            <div className={`${card} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${text}`}>
                {isOwnView ? 'Erwartete Zeugnisnoten' : `Zeugnisnoten von ${selectedExamGradesUser?.name}`}
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
                    aus {examGrades.length} Klausur{examGrades.length !== 1 ? 'en' : ''}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjectAverages.map(sa => (
                  <div key={sa.subject} className={`p-4 rounded-xl border ${gradeBg(sa.average, darkMode)} flex items-center justify-between`}>
                    <div>
                      <div className={`font-semibold text-sm ${text}`}>{sa.subject}</div>
                      <div className={`text-xs ${textMuted}`}>
                        {sa.count} Klausur{sa.count !== 1 ? 'en' : ''} · Beste: {sa.best.toFixed(1).replace('.', ',')} · Schlechteste: {sa.worst.toFixed(1).replace('.', ',')}
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

          {/* Neue Note eintragen */}
          {isOwnView && (
            <div className={`${card} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${text}`}>Note eintragen</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Datum</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Fach</label>
                  <select value={newSubject} onChange={e => setNewSubject(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`}>
                    <option value="">Fach wählen...</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Thema</label>
                  <input type="text" placeholder="z.B. Wasseraufbereitung" value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Note</label>
                  <input type="text" placeholder="z.B. 2,3" value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddGrade()}
                    className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-semibold mb-1 ${textMuted}`}>Anmerkungen (optional)</label>
                  <input type="text" placeholder="z.B. Nachschrift, mündliche Note..." value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-lg border ${input} outline-none`} />
                </div>
              </div>
              <button onClick={handleAddGrade}
                className="mt-4 w-full sm:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-all">
                Note speichern
              </button>
            </div>
          )}

          {/* Filter */}
          {examGrades && examGrades.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button onClick={() => setFilterSubject('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filterSubject === 'all' ? 'bg-indigo-500 text-white' : darkMode ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-600'
                }`}>
                Alle ({examGrades.length})
              </button>
              {[...new Set(examGrades.map(g => g.subject))].map(sub => (
                <button key={sub} onClick={() => setFilterSubject(sub)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filterSubject === sub ? 'bg-indigo-500 text-white' : darkMode ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-600'
                  }`}>
                  {sub} ({examGrades.filter(g => g.subject === sub).length})
                </button>
              ))}
            </div>
          )}

          {/* Noten-Liste */}
          <div className={`${card} rounded-xl shadow-lg overflow-hidden`}>
            {filteredGrades.length > 0 ? (
              <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                {filteredGrades.map(grade => (
                  <div key={grade.id} className={`p-4 flex items-center gap-4 ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                    <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${gradeBg(grade.grade, darkMode)}`}>
                      <span className={`text-xl font-bold ${gradeColor(grade.grade)}`}>
                        {grade.grade.toFixed(1).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${text} truncate`}>{grade.topic}</div>
                      <div className={`text-sm ${textMuted}`}>
                        {grade.subject} · {new Date(grade.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                      {grade.notes && <div className={`text-xs mt-0.5 ${textMuted} italic truncate`}>{grade.notes}</div>}
                    </div>
                    {isOwnView && (
                      <button onClick={() => deleteExamGrade(grade.id)}
                        className="text-red-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all flex-shrink-0"
                        title="Löschen">✕</button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-12 text-center ${textMuted}`}>
                <div className="text-4xl mb-3">📝</div>
                <p className="font-semibold">Noch keine Noten eingetragen</p>
                <p className="text-sm mt-1">Trage deine erste Note oben ein.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamsView;
