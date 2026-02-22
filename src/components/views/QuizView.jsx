import React from 'react';
import { Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/constants';

const DIFFICULTY_SETTINGS = {
  anfaenger: { time: 45, label: 'Anfaenger', icon: '🟢', color: 'bg-green-500' },
  profi: { time: 30, label: 'Profi', icon: '🟡', color: 'bg-yellow-500' },
  experte: { time: 15, label: 'Experte', icon: '🔴', color: 'bg-red-500' },
  extra: { time: 75, label: 'Extra schwer', icon: '🧠', color: 'bg-indigo-700' }
};

const getDifficulty = (difficulty) => DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.profi;

const QuizView = ({
  selectedDifficulty,
  setSelectedDifficulty,
  allUsers,
  activeGames,
  challengePlayer,
  currentGame,
  quizCategory,
  questionInCategory,
  playerTurn,
  adaptiveLearningEnabled,
  setAdaptiveLearningEnabled,
  selectCategory,
  waitingForOpponent,
  startCategoryAsSecondPlayer,
  currentQuestion,
  timeLeft,
  answered,
  selectedAnswers,
  lastSelectedAnswer,
  isKeywordQuestion,
  keywordAnswerText,
  setKeywordAnswerText,
  keywordAnswerEvaluation,
  submitKeywordAnswer,
  quizMCKeywordMode,
  setQuizMCKeywordMode,
  answerQuestion,
  reportQuestionIssue,
  confirmMultiSelectAnswer,
  proceedToNextRound,
}) => {
  const { user } = useAuth();
  const currentDifficulty = getDifficulty(currentGame?.difficulty);
  const questionIsKeyword = Boolean(currentQuestion && isKeywordQuestion?.(currentQuestion));
  const availableKeywordGroups = Array.isArray(currentQuestion?.keywordGroups)
    ? currentQuestion.keywordGroups.length
    : 0;
  const requiredKeywordGroups = Math.max(
    1,
    Math.min(availableKeywordGroups || 1, Number(currentQuestion?.minKeywordGroups) || availableKeywordGroups || 1)
  );
  const formatAnswerLabel = (answerText) => String(answerText ?? '')
    .replace(/\s*\(\s*optional(?:\s*dabei)?\s*\)/gi, '')
    .replace(/\s*-\s*optional(?:\s*dabei)?\s*$/gi, '')
    .replace(/\s+optional(?:\s+dabei)?\s*$/gi, '')
    .trim();

  return (
    <div className="max-w-4xl mx-auto">
      {!currentGame && (
        <>
          <h2 className="text-3xl font-bold mb-6">Quizduell 🏆</h2>
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Spieler herausfordern</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Schwierigkeitsgrad waehlen:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(DIFFICULTY_SETTINGS).map(([key, diff]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedDifficulty === key
                        ? `${diff.color} text-white border-transparent`
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-3xl mb-2">{diff.icon}</div>
                    <div className="font-bold">{diff.label}</div>
                    <div className="text-sm opacity-90">{diff.time} Sekunden</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {allUsers.filter(u => u.name !== user.name).map(u => (
                <div key={u.name} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      u.role === 'trainer' || u.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {u.role === 'trainer' || u.role === 'admin' ? '👨‍🏫' : '🎓'}
                    </div>
                    <div>
                      <p className="font-bold">{u.name}</p>
                      <p className="text-sm text-gray-600">
                        {u.role === 'admin' ? 'Administrator' : u.role === 'trainer' ? 'Ausbilder' : 'Azubi'}
                      </p>
                    </div>
                  </div>
                  {activeGames.some(g =>
                    g.status !== 'finished' &&
                    ((g.player1 === user.name && g.player2 === u.name) ||
                     (g.player1 === u.name && g.player2 === user.name))
                  ) ? (
                    <span className="text-sm text-gray-500 italic px-4">Spiel laeuft bereits</span>
                  ) : (
                    <button
                      onClick={() => challengePlayer(u.name)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2"
                    >
                      <Target size={20} />
                      <span>Herausfordern</span>
                    </button>
                  )}
                </div>
              ))}
              {allUsers.filter(u => u.name !== user.name).length === 0 && (
                <p className="text-gray-500 text-center py-8">Noch keine anderen Spieler online</p>
              )}
            </div>
          </div>
        </>
      )}

      {currentGame && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="text-center mb-4">
            <span className={`${currentDifficulty.color} text-white px-6 py-2 rounded-full font-bold inline-flex items-center gap-2`}>
              {currentDifficulty.icon} {currentDifficulty.label} - {currentDifficulty.time} Sekunden pro Frage
            </span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600 mb-1">{currentGame.player1}</p>
              <p className="text-3xl font-bold text-blue-600">{currentGame.player1Score}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-400">Kategorie {(currentGame.categoryRound || 0) + 1}/4</p>
              {quizCategory && (
                <p className="text-sm text-gray-500 mt-1">
                  Frage {questionInCategory + 1}/5
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                {playerTurn === user.name ? '⚡ Du bist dran!' : `${playerTurn} ist dran...`}
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600 mb-1">{currentGame.player2}</p>
              <p className="text-3xl font-bold text-red-600">{currentGame.player2Score}</p>
            </div>
          </div>

          {currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && !currentQuestion && (
            <div className="mb-4 flex justify-center gap-2 flex-wrap">
              {currentGame.categoryRounds.map((cr, idx) => {
                const cat = CATEGORIES.find(c => c.id === cr.categoryId);
                return (
                  <span key={idx} className={`${cat?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm`}>
                    {cat?.icon} {cat?.name}
                  </span>
                );
              })}
            </div>
          )}

          {!quizCategory && playerTurn === user.name && !waitingForOpponent && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div>
                  <p className="text-sm font-bold text-gray-700">Adaptiver Lernmodus</p>
                  <p className="text-xs text-gray-500">
                    {adaptiveLearningEnabled ? 'Schwerere Fragen kommen oefter.' : 'Reiner Zufall.'}
                  </p>
                </div>
                <button
                  onClick={() => setAdaptiveLearningEnabled((prev) => !prev)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${
                    adaptiveLearningEnabled
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {adaptiveLearningEnabled ? 'Aktiv' : 'Aus'}
                </button>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Waehle eine Kategorie:</h3>
              <p className="text-center text-gray-500 mb-4">Du waehlst 5 Fragen - danach spielt {currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1} die gleichen Fragen!</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.filter(cat => {
                  const played = currentGame.categoryRounds?.map(cr => cr.categoryId) || [];
                  return !played.includes(cat.id);
                }).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.id)}
                    className={`${cat.color} text-white rounded-xl p-4 hover:scale-105 transition-transform`}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="font-bold text-sm">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!currentQuestion && playerTurn === user.name && currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && (() => {
            const currentCatRound = currentGame.categoryRounds[currentGame.categoryRound || 0];
            if (!currentCatRound) return false;
            const isPlayer1 = user.name === currentGame.player1;
            const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;
            return myAnswers.length === 0 && currentCatRound.questions.length > 0;
          })() && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl font-bold mb-2">
                {(() => {
                  const currentCatRound = currentGame.categoryRounds[currentGame.categoryRound || 0];
                  return currentCatRound?.categoryName || 'Kategorie';
                })()}
              </p>
              <p className="text-gray-600 mb-4">
                {currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1} hat diese Kategorie gespielt. Jetzt bist du dran mit den gleichen 5 Fragen!
              </p>
              <button
                onClick={startCategoryAsSecondPlayer}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                Los geht's! 🚀
              </button>
            </div>
          )}

          {!quizCategory && playerTurn !== user.name && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-xl text-gray-600">Warte auf {playerTurn}...</p>
              <p className="text-sm text-gray-400 mt-2">
                {waitingForOpponent ? 'Dein Gegner spielt jetzt die gleichen Fragen' : 'Dein Gegner waehlt eine Kategorie'}
              </p>
            </div>
          )}

          {currentQuestion && playerTurn === user.name && (
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {(() => {
                      const cat = CATEGORIES.find(c => c.id === quizCategory);
                      return cat ? `${cat.icon} ${cat.name}` : 'Frage';
                    })()}
                  </span>
                  <span className={`text-2xl font-bold ${
                    timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'
                  }`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(timeLeft / (currentDifficulty.time || 30)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-6">
                <p className="text-xl font-bold text-center">{currentQuestion.q}</p>
                {currentQuestion.multi && !answered && !questionIsKeyword && !quizMCKeywordMode && (
                  <p className="text-center text-sm text-orange-600 mt-2 font-medium">
                    ⚠️ Mehrere Antworten sind richtig - waehle alle richtigen aus!
                  </p>
                )}
                {questionIsKeyword && (
                  <p className="text-center text-sm text-indigo-700 mt-2 font-medium">
                    🧠 Extra schwer: Freitext antworten und mindestens {requiredKeywordGroups} Schlagwoerter treffen.
                  </p>
                )}
                {quizMCKeywordMode && !questionIsKeyword && (
                  <p className="text-center text-sm text-violet-700 mt-2 font-medium">
                    🧠 Schlagwort-Modus: Antworte frei und triff die Schlüsselbegriffe.
                  </p>
                )}
              </div>

              {!questionIsKeyword && !quizMCKeywordMode && !answered && (
                <button
                  onClick={() => setQuizMCKeywordMode(true)}
                  className="w-full py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-700 transition-all border border-gray-200 hover:border-violet-300"
                >
                  🧠 Schlagwort-Modus aktivieren
                </button>
              )}

              {!questionIsKeyword && Array.isArray(currentQuestion.a) && !quizMCKeywordMode && (
                <>
                  <div className="grid gap-3">
                    {currentQuestion.a.map((answer, idx) => {
                      const isMulti = currentQuestion.multi;
                      const isSelectedMulti = selectedAnswers.includes(idx);
                      const isSelectedSingle = lastSelectedAnswer === idx;
                      const isCorrectAnswer = isMulti
                        ? currentQuestion.correct.includes(idx)
                        : idx === currentQuestion.correct;

                      let buttonClass = '';
                      if (answered) {
                        if (isCorrectAnswer) {
                          buttonClass = 'bg-green-500 text-white';
                        } else if ((isMulti && isSelectedMulti) || (!isMulti && isSelectedSingle)) {
                          buttonClass = 'bg-red-500 text-white';
                        } else {
                          buttonClass = 'bg-gray-200 text-gray-500';
                        }
                      } else if (isMulti && isSelectedMulti) {
                        buttonClass = 'bg-blue-500 text-white border-2 border-blue-600';
                      } else {
                        buttonClass = 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => answerQuestion(idx)}
                          disabled={answered}
                          className={`p-4 rounded-xl font-medium transition-all ${buttonClass}`}
                        >
                          {isMulti && !answered && (
                            <span className="mr-2">{isSelectedMulti ? '☑️' : '⬜'}</span>
                          )}
                          {formatAnswerLabel(answer)}
                        </button>
                      );
                    })}
                  </div>

                  {currentQuestion.multi && !answered && selectedAnswers.length > 0 && (
                    <button
                      onClick={confirmMultiSelectAnswer}
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                    >
                      ✓ Antwort bestaetigen ({selectedAnswers.length} ausgewaehlt)
                    </button>
                  )}
                </>
              )}

              {(questionIsKeyword || quizMCKeywordMode) && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">
                    💡 Singular und Plural werden beide erkannt – schreib, wie es natürlich klingt.
                  </p>
                  <textarea
                    value={keywordAnswerText}
                    onChange={(e) => setKeywordAnswerText(e.target.value)}
                    disabled={answered}
                    rows={5}
                    placeholder="Schreibe deine Antwort frei und nenne die wichtigsten Schlagwoerter..."
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  {!answered && (
                    <button
                      onClick={submitKeywordAnswer}
                      disabled={!keywordAnswerText.trim()}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                        keywordAnswerText.trim()
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                          : 'bg-indigo-300 cursor-not-allowed'
                      }`}
                    >
                      Antwort pruefen
                    </button>
                  )}

                  {keywordAnswerEvaluation && (
                    <div className={`rounded-xl border-2 p-4 ${
                      keywordAnswerEvaluation.isCorrect
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-amber-400 bg-amber-50'
                    }`}>
                      <p className={`font-bold ${keywordAnswerEvaluation.isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {keywordAnswerEvaluation.isCorrect ? '✅ Treffer! Antwort ist korrekt.' : '⚠️ Noch nicht ausreichend.'}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Treffer: {keywordAnswerEvaluation.matchedCount}/{keywordAnswerEvaluation.requiredGroups} erforderlich
                      </p>
                      {keywordAnswerEvaluation.timedOut && (
                        <p className="text-sm text-red-600 mt-1 font-semibold">Zeit abgelaufen - Antwort wurde als falsch gewertet.</p>
                      )}
                      {keywordAnswerEvaluation.matchedLabels?.length > 0 && (
                        <p className="text-sm text-emerald-700 mt-2">
                          Erkannt: {keywordAnswerEvaluation.matchedLabels.join(', ')}
                        </p>
                      )}
                      {keywordAnswerEvaluation.missingLabels?.length > 0 && (
                        <p className="text-sm text-amber-700 mt-1">
                          Fehlt noch: {keywordAnswerEvaluation.missingLabels.join(', ')}
                        </p>
                      )}
                      {currentQuestion.answerGuide && (
                        <p className="text-sm text-gray-700 mt-3 border-t border-gray-300 pt-2">
                          Musterloesung: {currentQuestion.answerGuide}
                        </p>
                      )}
                      {quizMCKeywordMode && !questionIsKeyword && (
                        <p className="text-sm text-gray-700 mt-3 border-t border-gray-300 pt-2">
                          Korrekte Antwort: {
                            currentQuestion.multi && Array.isArray(currentQuestion.correct)
                              ? currentQuestion.correct.map(idx => currentQuestion.a[idx]).join(' | ')
                              : currentQuestion.a[currentQuestion.correct]
                          }
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  void reportQuestionIssue({
                    question: currentQuestion,
                    categoryId: quizCategory,
                    source: 'quiz'
                  });
                }}
                className="w-full mt-2 bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 rounded-lg font-semibold border border-amber-300"
              >
                🚩 Frage melden
              </button>

              {answered && timeLeft === 0 && (
                <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 text-center">
                  <p className="text-red-700 font-bold">⏰ Zeit abgelaufen!</p>
                </div>
              )}

              {answered && (
                <button
                  onClick={proceedToNextRound}
                  className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  Weiter →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizView;
