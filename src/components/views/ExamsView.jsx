import React, { useState, useMemo } from 'react';
import { ClipboardList, Calendar, Trash2, GraduationCap, Plus, Filter, TrendingUp, AlertCircle } from 'lucide-react';
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

  const inputClass = darkMode
    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:ring-emerald-400'
    : 'bg-white/70 border-gray-300 focus:ring-emerald-400';

  const upcomingCount = exams ? exams.filter(e => {
    if (!e.date) return true;
    return new Date(e.date) >= new Date(new Date().toDateString());
  }).length : 0;

  const totalExams = exams?.length || 0;
  const pastExams = totalExams - upcomingCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900' : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'} text-white rounded-2xl p-8 shadow-lg`}>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <GraduationCap size={30} />
          Klausuren
        </h2>
        <p className="text-white/80">
          Anstehende Arbeiten planen und Noten verwalten — behalte deine Prüfungen im Blick.
        </p>
        {(totalExams > 0 || (examGrades?.length || 0) > 0) && (
          <div className="flex flex-wrap gap-3 mt-4">
            {upcomingCount > 0 && (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-lg">{upcomingCount}</span>
                <span className="opacity-80 ml-2">anstehend</span>
              </div>
            )}
            {pastExams > 0 && (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-lg">{pastExams}</span>
                <span className="opacity-80 ml-2">vorbei</span>
              </div>
            )}
            {overallAverage !== null && (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-lg">Ø {overallAverage.toFixed(1).replace('.', ',')}</span>
                <span className="opacity-80 ml-2">Noten</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-2xl p-1.5 flex gap-1.5">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'upcoming'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
              : darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-white/40'
          }`}
        >
          <ClipboardList size={16} />
          Anstehend
          {upcomingCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'upcoming' ? 'bg-white/20' : darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
            }`}>{upcomingCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'grades'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
              : darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-white/40'
          }`}
        >
          <TrendingUp size={16} />
          Notenbuch
          {overallAverage !== null && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'grades' ? 'bg-white/20' : darkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
            }`}>Ø {overallAverage.toFixed(1).replace('.', ',')}</span>
          )}
        </button>
      </div>

      {/* ==================== TAB: ANSTEHENDE KLAUSUREN ==================== */}
      {activeTab === 'upcoming' && (
        <>
          {/* Neue Klausur eintragen */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-emerald-300' : 'text-gray-800'}`}>
              <Plus size={18} />
              Klausur ankündigen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Titel / Fach</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="z.B. Bädertechnik Klausur 3"
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Datum</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Themen / Lernstoff</label>
                <textarea
                  value={examTopics}
                  onChange={(e) => setExamTopics(e.target.value)}
                  placeholder="Welche Themen werden abgefragt?"
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 resize-none ${inputClass}`}
                />
              </div>
            </div>
            <button
              onClick={addExam}
              className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Calendar size={18} />
              Eintragen
            </button>
          </div>

          {/* Liste */}
          {exams && exams.length > 0 ? (
            <div className="space-y-3">
              <h3 className={`font-bold text-lg px-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Kommende Klausuren
              </h3>
              {exams.map(exam => {
                const examDateObj = exam.date ? new Date(exam.date) : null;
                const today = new Date(new Date().toDateString());
                const isPast = examDateObj && examDateObj < today;
                const isToday = examDateObj && examDateObj.getTime() === today.getTime();
                const daysUntil = examDateObj ? Math.ceil((examDateObj - today) / (1000 * 60 * 60 * 24)) : null;
                const isSoon = !isPast && !isToday && daysUntil !== null && daysUntil <= 3;

                return (
                  <div key={exam.id} className={`glass-card rounded-2xl p-5 relative overflow-hidden ${isPast ? 'opacity-60' : ''}`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isToday
                        ? 'bg-gradient-to-b from-red-500 to-rose-500'
                        : isSoon
                          ? 'bg-gradient-to-b from-orange-500 to-amber-500'
                          : isPast
                            ? 'bg-gray-400'
                            : 'bg-gradient-to-b from-emerald-500 to-teal-500'
                    }`} />
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            isToday
                              ? 'bg-red-500 text-white animate-pulse'
                              : isSoon
                                ? darkMode ? 'bg-orange-500/20 text-orange-200' : 'bg-orange-100 text-orange-700'
                                : isPast
                                  ? darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
                                  : darkMode ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isToday && <AlertCircle size={12} />}
                            {isToday ? 'Heute!' : isPast ? 'Vorbei' : examDateObj
                              ? `${examDateObj.toLocaleDateString('de-DE')}${daysUntil !== null ? ` (${daysUntil}d)` : ''}`
                              : 'Ohne Termin'}
                          </span>
                        </div>
                        <h3 className={`font-bold break-words ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {exam.title}
                        </h3>
                        {(exam.description || exam.topics) && (
                          <p className={`text-sm mt-1 whitespace-pre-wrap break-words ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {exam.description || exam.topics}
                          </p>
                        )}
                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Eingetragen von {exam.createdBy || exam.user || 'Unbekannt'}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteExam(exam.id)}
                        className={`p-2 rounded-lg flex-shrink-0 transition-colors ${darkMode ? 'text-red-400 hover:bg-white/10' : 'text-red-500 hover:bg-red-50'}`}
                        title="Löschen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-emerald-50'}`}>
                <Calendar size={36} className={darkMode ? 'text-emerald-300' : 'text-emerald-500'} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Keine Klausuren eingetragen
              </h3>
              <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Trage anstehende Klausuren oben ein, damit alle Azubis rechtzeitig Bescheid wissen.
              </p>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB: NOTENBUCH ==================== */}
      {activeTab === 'grades' && (
        <>
          {/* User selection for trainers/admins */}
          {canViewAllExamGrades && canViewAllExamGrades() && (
            <div className="glass-card rounded-2xl p-4">
              <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Azubi auswählen</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedExamGradesUser(null);
                    loadExamGrades(user.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isOwnView
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                      : darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-white/60 text-gray-600 hover:bg-white/80'
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
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                        : darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-white/60 text-gray-600 hover:bg-white/80'
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
            <div className="glass-card rounded-2xl p-6">
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-indigo-300' : 'text-gray-800'}`}>
                <TrendingUp size={18} />
                {isOwnView ? 'Erwartete Zeugnisnoten' : `Zeugnisnoten von ${selectedExamGradesUser?.name}`}
              </h3>
              {overallAverage !== null && (
                <div className={`mb-4 p-4 rounded-xl border ${gradeBg(overallAverage, darkMode)} text-center`}>
                  <div className={`text-4xl font-bold ${gradeColor(overallAverage)}`}>
                    {overallAverage.toFixed(1).replace('.', ',')}
                  </div>
                  <div className={`text-sm font-semibold ${gradeColor(overallAverage)}`}>
                    Gesamtdurchschnitt · {gradeLabel(overallAverage)}
                  </div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    aus {examGrades.length} Klausur{examGrades.length !== 1 ? 'en' : ''}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjectAverages.map(sa => (
                  <div key={sa.subject} className={`p-4 rounded-xl border ${gradeBg(sa.average, darkMode)} flex items-center justify-between gap-3`}>
                    <div className="min-w-0">
                      <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{sa.subject}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {sa.count} Klausur{sa.count !== 1 ? 'en' : ''} · Beste: {sa.best.toFixed(1).replace('.', ',')} · Schlechteste: {sa.worst.toFixed(1).replace('.', ',')}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
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
            <div className="glass-card rounded-2xl p-6">
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-indigo-300' : 'text-gray-800'}`}>
                <Plus size={18} />
                Note eintragen
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Datum</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Fach</label>
                  <select value={newSubject} onChange={e => setNewSubject(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`}>
                    <option value="">Fach wählen...</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Thema</label>
                  <input type="text" placeholder="z.B. Wasseraufbereitung" value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Note</label>
                  <input type="text" placeholder="z.B. 2,3" value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddGrade()}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Anmerkungen (optional)</label>
                  <input type="text" placeholder="z.B. Nachschrift, mündliche Note..." value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${inputClass}`} />
                </div>
              </div>
              <button onClick={handleAddGrade}
                className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
                <Plus size={18} />
                Note speichern
              </button>
            </div>
          )}

          {/* Filter */}
          {examGrades && examGrades.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 items-center">
              <Filter size={16} className={`flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <button onClick={() => setFilterSubject('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filterSubject === 'all'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                    : darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-white/60 text-gray-600 hover:bg-white/80'
                }`}>
                Alle ({examGrades.length})
              </button>
              {[...new Set(examGrades.map(g => g.subject))].map(sub => (
                <button key={sub} onClick={() => setFilterSubject(sub)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filterSubject === sub
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                      : darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-white/60 text-gray-600 hover:bg-white/80'
                  }`}>
                  {sub} ({examGrades.filter(g => g.subject === sub).length})
                </button>
              ))}
            </div>
          )}

          {/* Noten-Liste */}
          {filteredGrades.length > 0 ? (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className={`divide-y ${darkMode ? 'divide-white/10' : 'divide-gray-200/70'}`}>
                {filteredGrades.map(grade => (
                  <div key={grade.id} className={`p-4 flex items-center gap-4 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-white/40'} transition-colors`}>
                    <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${gradeBg(grade.grade, darkMode)}`}>
                      <span className={`text-xl font-bold ${gradeColor(grade.grade)}`}>
                        {grade.grade.toFixed(1).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{grade.topic}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {grade.subject} · {new Date(grade.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                      {grade.notes && <div className={`text-xs mt-0.5 italic truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{grade.notes}</div>}
                    </div>
                    {isOwnView && (
                      <button
                        onClick={() => deleteExamGrade(grade.id)}
                        className={`p-2 rounded-lg flex-shrink-0 transition-colors ${darkMode ? 'text-red-400 hover:bg-white/10' : 'text-red-500 hover:bg-red-50'}`}
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-indigo-50'}`}>
                <GraduationCap size={36} className={darkMode ? 'text-indigo-300' : 'text-indigo-500'} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {isOwnView ? 'Noch keine Noten eingetragen' : 'Keine Noten vorhanden'}
              </h3>
              <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {isOwnView
                  ? 'Trage deine erste Note oben ein und behalte deinen Durchschnitt im Blick.'
                  : 'Für diesen Azubi wurden noch keine Noten eingetragen.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExamsView;
