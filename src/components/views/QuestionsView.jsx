import React from 'react';
import { Brain, Plus, Check, Clock, User as UserIcon, Layers, Circle } from 'lucide-react';
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

  const multiOn = Boolean(newQuestionMulti);
  const selectedIndices = Array.isArray(newQuestionCorrectIndices) ? newQuestionCorrectIndices : [];

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
            <label className={`text-sm font-medium block mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Frage</label>
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Formuliere deine Frage klar und eindeutig..."
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
          </div>

          <div>
            <label className={`text-sm font-medium block mb-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Antworttyp</label>
            <div className={`inline-flex p-1 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/60 border border-gray-200'}`}>
              <button
                type="button"
                onClick={() => setNewQuestionMulti && setNewQuestionMulti(false)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  !multiOn
                    ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-sm'
                    : darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-white/40'
                }`}
              >
                <Circle size={14} />
                Einfachauswahl
              </button>
              <button
                type="button"
                onClick={() => setNewQuestionMulti && setNewQuestionMulti(true)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  multiOn
                    ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-sm'
                    : darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-white/40'
                }`}
              >
                <Layers size={14} />
                Mehrfachauswahl
              </button>
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {multiOn
                ? 'Markiere alle richtigen Antworten — Nutzer müssen alle treffen, um den Punkt zu bekommen.'
                : 'Genau eine richtige Antwort markieren.'}
            </p>
          </div>

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

          <button
            onClick={submitQuestion}
            className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Frage einreichen
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
            return (
              <div key={q.id} className={`glass-card rounded-2xl p-5 ${q.approved ? '' : ''}`}>
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {cat && (
                      <span className={`${cat.color} text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1`}>
                        <span>{cat.icon}</span>
                        {cat.name}
                      </span>
                    )}
                    {isMulti && (
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
                <ul className="space-y-1.5 mb-3">
                  {q.answers.map((a, i) => {
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
