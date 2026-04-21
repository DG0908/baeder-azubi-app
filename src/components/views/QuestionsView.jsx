import React from 'react';
import { Brain, Plus, Check, Clock, User as UserIcon, Layers, Circle, Search, Lightbulb } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/constants';

const isCorrectAnswer = (question, index) => {
  if (!question) return false;
  const c = question.correct;
  if (Array.isArray(c)) return c.includes(index);
  return index === c;
};

const QuestionsView = ({
  submittedQuestions,
  newQuestionText,
  setNewQuestionText,
  newQuestionCategory,
  setNewQuestionCategory,
  newQuestionAnswers,
  setNewQuestionAnswers,
  newQuestionCorrect,
  setNewQuestionCorrect,
  newQuestionMulti,
  setNewQuestionMulti,
  newQuestionCorrectIndices,
  setNewQuestionCorrectIndices,
  newQuestionType,
  setNewQuestionType,
  newWhoAmIAnswer,
  setNewWhoAmIAnswer,
  newWhoAmIClues,
  setNewWhoAmIClues,
  submitQuestion,
  approveQuestion
}) => {
  const { user } = useAuth();
  const { darkMode } = useApp();
  const canApprove = !!user?.permissions?.canApproveQuestions;

  const sortedQuestions = [...(submittedQuestions || [])].sort((a, b) => {
    if (!a.approved && b.approved) return -1;
    if (a.approved && !b.approved) return 1;
    return 0;
  });

  const pendingCount = (submittedQuestions || []).filter((q) => !q.approved).length;
  const approvedCount = (submittedQuestions || []).length - pendingCount;

  const toggleCorrectIndex = (i) => {
    const prev = Array.isArray(newQuestionCorrectIndices) ? newQuestionCorrectIndices : [];
    if (prev.includes(i)) {
      setNewQuestionCorrectIndices(prev.filter((x) => x !== i));
    } else {
      setNewQuestionCorrectIndices([...prev, i].sort((a, b) => a - b));
    }
  };

  const isWhoAmI = newQuestionType === 'whoami';
  const multiOn = !isWhoAmI && Boolean(newQuestionMulti);
  const selectedIndices = Array.isArray(newQuestionCorrectIndices) ? newQuestionCorrectIndices : [];
  const whoAmIClues = Array.isArray(newWhoAmIClues) && newWhoAmIClues.length === 5
    ? newWhoAmIClues
    : ['', '', '', '', ''];

  const setType = (nextType) => {
    if (nextType === 'whoami') {
      setNewQuestionType('whoami');
      if (setNewQuestionMulti) setNewQuestionMulti(false);
      return;
    }
    setNewQuestionType('multiple');
    if (setNewQuestionMulti) setNewQuestionMulti(nextType === 'multi');
  };

  const updateClue = (index, value) => {
    const next = [...whoAmIClues];
    next[index] = value;
    setNewWhoAmIClues(next);
  };

  const typeToggleClass = (active) => `px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
    active
      ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-sm'
      : darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-white/40'
  }`;

  const whoAmIToggleClass = (active) => `px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
    active
      ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-sm'
      : darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-white/40'
  }`;

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 via-slate-900 to-fuchsia-900' : 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500'} text-white rounded-2xl p-8 shadow-lg`}>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Brain size={30} />
          Fragen einreichen
        </h2>
        <p className="text-white/80">
          Schlage neue Quizfragen vor — nach Freigabe landen sie im Fragenpool für alle.
        </p>
        {submittedQuestions?.length > 0 && (
          <div className="flex gap-3 mt-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
              <span className="font-bold text-lg">{pendingCount}</span>
              <span className="opacity-80 ml-2">ausstehend</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
              <span className="font-bold text-lg">{approvedCount}</span>
              <span className="opacity-80 ml-2">genehmigt</span>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-purple-300' : 'text-gray-800'}`}>
          <Plus size={18} />
          Neue Quizfrage vorschlagen
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`text-sm font-medium block mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {isWhoAmI ? 'Frage-Einleitung (optional)' : 'Frage'}
            </label>
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder={isWhoAmI
                ? 'Standard: "Was bin ich?" — lass leer oder formuliere eine eigene Einleitung.'
                : 'Formuliere deine Frage klar und eindeutig...'}
              rows="2"
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400 resize-none ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'}`}
            />
          </div>

          <div>
            <label className={`text-sm font-medium block mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Kategorie</label>
            <select
              value={newQuestionCategory}
              onChange={(e) => setNewQuestionCategory(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/70 border-gray-300'}`}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            {isWhoAmI && (
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Die Kategorie bestimmt, wo deine Was-bin-ich-Frage thematisch einsortiert wird.
              </p>
            )}
          </div>

          <div>
            <label className={`text-sm font-medium block mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Antworttyp</label>
            <div className={`inline-flex flex-wrap p-1 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/60 border border-gray-200'}`}>
              <button
                type="button"
                onClick={() => setType('single')}
                className={typeToggleClass(!isWhoAmI && !multiOn)}
              >
                <Circle size={14} />
                Einfachauswahl
              </button>
              <button
                type="button"
                onClick={() => setType('multi')}
                className={typeToggleClass(!isWhoAmI && multiOn)}
              >
                <Layers size={14} />
                Mehrfachauswahl
              </button>
              <button
                type="button"
                onClick={() => setType('whoami')}
                className={whoAmIToggleClass(isWhoAmI)}
              >
                <Search size={14} />
                Was bin ich?
              </button>
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isWhoAmI
                ? 'Gib eine Lösung und 5 Hinweise — Nutzer raten anhand der Hinweise, je nach Schwierigkeit sehen sie weniger Hinweise.'
                : multiOn
                  ? 'Markiere alle richtigen Antworten — Nutzer müssen alle treffen, um den Punkt zu bekommen.'
                  : 'Genau eine richtige Antwort markieren.'}
            </p>
          </div>

          {isWhoAmI ? (
            <>
              <div>
                <label className={`text-sm font-medium block mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Lösung <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>— das gesuchte Gerät, Verfahren oder Objekt</span>
                </label>
                <input
                  type="text"
                  value={newWhoAmIAnswer || ''}
                  onChange={(e) => setNewWhoAmIAnswer(e.target.value)}
                  placeholder="z. B. Umwälzpumpe"
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-violet-400 ${
                    darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className={`text-sm font-medium block mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Hinweise{' '}
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    — 5 Stück, von schwer (Hinweis 1) nach leicht (Hinweis 5)
                  </span>
                </label>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                        darkMode
                          ? 'bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 text-violet-200 border border-violet-400/30'
                          : 'bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-violet-700 border border-violet-200'
                      }`}>
                        <Lightbulb size={14} />
                      </div>
                      <input
                        type="text"
                        value={whoAmIClues[i] || ''}
                        onChange={(e) => updateClue(i, e.target.value)}
                        placeholder={`Hinweis ${i + 1}`}
                        className={`flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-violet-400 ${
                          darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Anfänger sehen alle 5 Hinweise, Profi 4, Experte 3, Extra 2. Der erste Hinweis sollte der kryptischste, der fünfte am hilfreichsten sein.
                </p>
              </div>
            </>
          ) : (
            <div>
              <label className={`text-sm font-medium block mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Antwortmöglichkeiten{' '}
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {multiOn
                    ? '— wähle mit den Kästchen links alle richtigen Antworten'
                    : '— klicke den Kreis links, um die richtige zu markieren'}
                </span>
              </label>
              <div className="space-y-2">
                {[0, 1, 2, 3].map(i => {
                  const isCorrect = multiOn ? selectedIndices.includes(i) : i === newQuestionCorrect;
                  const shape = multiOn ? 'rounded-md' : 'rounded-full';
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (multiOn) toggleCorrectIndex(i);
                          else setNewQuestionCorrect(i);
                        }}
                        className={`w-8 h-8 ${shape} border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isCorrect
                            ? 'bg-green-500 border-green-500 text-white'
                            : darkMode
                              ? 'border-white/20 hover:border-green-400'
                              : 'border-gray-300 hover:border-green-400'
                        }`}
                        title={isCorrect ? 'Richtige Antwort' : 'Als richtige Antwort markieren'}
                      >
                        {isCorrect ? <Check size={16} /> : <span className="text-xs font-semibold opacity-60">{i + 1}</span>}
                      </button>
                      <input
                        type="text"
                        value={newQuestionAnswers[i]}
                        onChange={(e) => {
                          const newAnswers = [...newQuestionAnswers];
                          newAnswers[i] = e.target.value;
                          setNewQuestionAnswers(newAnswers);
                        }}
                        placeholder={`Antwort ${i + 1}`}
                        className={`flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400 ${
                          isCorrect ? 'border-green-500' : darkMode ? 'border-white/10' : 'border-gray-300'
                        } ${darkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white/70'}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={submitQuestion}
            className={`${
              isWhoAmI
                ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-600 shadow-violet-500/30'
                : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600'
            } text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-md`}
          >
            <Plus size={18} />
            {isWhoAmI ? 'Was-bin-ich-Frage einreichen' : 'Frage einreichen'}
          </button>
        </div>
      </div>

      {submittedQuestions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-purple-50'}`}>
            <Brain size={36} className={darkMode ? 'text-purple-300' : 'text-purple-500'} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Noch keine Fragen eingereicht
          </h3>
          <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Nutze das Formular oben, um deinen ersten Fragen-Vorschlag zu erstellen.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className={`font-bold text-lg px-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Eingereichte Fragen
          </h3>
          {sortedQuestions.map(q => {
            const cat = CATEGORIES.find(c => c.id === q.category);
            const isMulti = Boolean(q.multi) || Array.isArray(q.correct);
            const qType = q.type === 'whoami' ? 'whoami' : 'multiple';
            const isWhoAmIEntry = qType === 'whoami';
            const clueList = Array.isArray(q.clues) ? q.clues : [];
            const whoAmISolution = Array.isArray(q.answers) && q.answers.length > 0 ? q.answers[0] : '';
            return (
              <div key={q.id} className={`glass-card rounded-2xl p-5`}>
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {cat && (
                      <span className={`${cat.color} text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1`}>
                        <span>{cat.icon}</span>
                        {cat.name}
                      </span>
                    )}
                    {isWhoAmIEntry ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        darkMode ? 'bg-violet-500/20 text-violet-200' : 'bg-violet-100 text-violet-700'
                      }`}>
                        <Search size={12} />
                        Was bin ich?
                      </span>
                    ) : isMulti && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${darkMode ? 'bg-purple-500/20 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
                        <Layers size={12} />
                        Mehrfach
                      </span>
                    )}
                    {q.approved ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Check size={12} />
                        Genehmigt
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${darkMode ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-800'}`}>
                        <Clock size={12} />
                        Ausstehend
                      </span>
                    )}
                  </div>
                  {canApprove && !q.approved && (
                    <button
                      onClick={() => approveQuestion(q.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-semibold flex-shrink-0 transition-colors"
                      title="Frage genehmigen"
                    >
                      <Check size={16} />
                      Genehmigen
                    </button>
                  )}
                </div>
                <p className={`font-bold mb-3 break-words ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {q.text}
                </p>
                {isWhoAmIEntry ? (
                  <div className="space-y-3 mb-3">
                    <div className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                      darkMode ? 'bg-emerald-500/15 text-emerald-200' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      <Check size={14} />
                      Lösung: <span className="break-words">{whoAmISolution || '—'}</span>
                    </div>
                    {clueList.length > 0 && (
                      <ul className="space-y-1.5">
                        {clueList.map((clue, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2 text-sm px-3 py-1.5 rounded-lg ${
                              darkMode ? 'bg-white/5 text-violet-100' : 'bg-violet-50 text-violet-900'
                            }`}
                          >
                            <span className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                              darkMode ? 'bg-violet-500/30 text-violet-100' : 'bg-violet-200 text-violet-800'
                            }`}>
                              {i + 1}
                            </span>
                            <span className="break-words">{clue}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-1.5 mb-3">
                    {(q.answers || []).map((a, i) => {
                      const isRight = isCorrectAnswer(q, i);
                      return (
                        <li
                          key={i}
                          className={`flex items-start gap-2 text-sm px-3 py-1.5 rounded-lg ${
                            isRight
                              ? darkMode
                                ? 'bg-green-500/15 text-green-200'
                                : 'bg-green-50 text-green-800'
                              : darkMode
                                ? 'text-gray-200'
                                : 'text-gray-700'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-5 h-5 ${isMulti ? 'rounded-md' : 'rounded-full'} flex items-center justify-center text-xs font-bold ${
                            isRight
                              ? 'bg-green-500 text-white'
                              : darkMode
                                ? 'bg-white/10 text-gray-300'
                                : 'bg-gray-200 text-gray-600'
                          }`}>
                            {isRight ? <Check size={12} /> : i + 1}
                          </span>
                          <span className="break-words">{a}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <UserIcon size={12} />
                  Von {q.submittedBy || 'Unbekannt'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionsView;
