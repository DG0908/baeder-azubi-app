import React from 'react';
import { ArrowLeft, ArrowRight, Check, X, Timer, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import {
  getWhoAmIClueCount,
  getWhoAmIVisibleClues,
  WHO_AM_I_TIME_LIMIT,
} from '../../../data/whoAmIChallenges';
import { glassCard, sectionAccent, inputClass } from './flashcardUi';

const FlashcardPlayer = ({
  darkMode,
  playSound,
  flashcards,
  setFlashcards,
  flashcardIndex,
  setFlashcardIndex,
  currentFlashcard,
  setCurrentFlashcard,
  showFlashcardAnswer,
  setShowFlashcardAnswer,
  spacedRepetitionMode,
  keywordFlashcardMode: _keywordFlashcardMode,
  whoAmIFlashcardMode,
  flashcardFreeTextMode,
  flashcardKeywordInput,
  setFlashcardKeywordInput,
  flashcardKeywordEvaluation,
  evaluateFlashcardKeywordAnswer,
  resetFlashcardKeywordState,
  newQuestionCategory,
  loadDueCards,
  updateCardSpacedData,
  getLevelColor,
  getLevelLabel,
}) => {
  const isKeywordFlashcard =
    currentFlashcard?.type === 'keyword' && Array.isArray(currentFlashcard?.keywordGroups);
  const isWhoAmIFlashcard =
    currentFlashcard?.type === 'whoami' && Array.isArray(currentFlashcard?.clues);
  const showFreeTextInput = Boolean(
    currentFlashcard && (isWhoAmIFlashcard || (!isKeywordFlashcard && flashcardFreeTextMode)),
  );
  const requiredKeywordGroups = Math.max(
    1,
    Math.min(
      currentFlashcard?.keywordGroups?.length || 1,
      Number(currentFlashcard?.minKeywordGroups) || currentFlashcard?.keywordGroups?.length || 1,
    ),
  );

  const [whoAmIDifficulty, setWhoAmIDifficulty] = React.useState('profi');
  const [whoAmITimeLeft, setWhoAmITimeLeft] = React.useState(WHO_AM_I_TIME_LIMIT);
  const [whoAmIExpired, setWhoAmIExpired] = React.useState(false);
  const visibleWhoAmIClues = isWhoAmIFlashcard
    ? getWhoAmIVisibleClues(currentFlashcard, whoAmIDifficulty)
    : [];
  const whoAmIClueCount = isWhoAmIFlashcard
    ? getWhoAmIClueCount(whoAmIDifficulty, currentFlashcard?.clues?.length || 0)
    : 0;

  React.useEffect(() => {
    if (!whoAmIFlashcardMode || !isWhoAmIFlashcard) return;
    setWhoAmITimeLeft(Number(currentFlashcard?.timeLimit) || WHO_AM_I_TIME_LIMIT);
    setWhoAmIExpired(false);
  }, [currentFlashcard?.id, currentFlashcard?.q, whoAmIFlashcardMode, whoAmIDifficulty, isWhoAmIFlashcard, currentFlashcard?.timeLimit]);

  React.useEffect(() => {
    if (!whoAmIFlashcardMode || !isWhoAmIFlashcard || whoAmIExpired || flashcardKeywordEvaluation) {
      return undefined;
    }
    if (whoAmITimeLeft <= 0) {
      setWhoAmIExpired(true);
      return undefined;
    }
    const timerId = window.setTimeout(() => {
      setWhoAmITimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [whoAmIFlashcardMode, isWhoAmIFlashcard, whoAmITimeLeft, whoAmIExpired, flashcardKeywordEvaluation]);

  const advanceOrFinish = () => {
    if (flashcardIndex < flashcards.length - 1) {
      const nextIdx = flashcardIndex + 1;
      setFlashcardIndex(nextIdx);
      setCurrentFlashcard(flashcards[nextIdx]);
      setShowFlashcardAnswer(false);
      resetFlashcardKeywordState();
    } else {
      const remaining = loadDueCards(newQuestionCategory);
      if (remaining.length > 0) {
        setFlashcards(remaining);
        setFlashcardIndex(0);
        setCurrentFlashcard(remaining[0]);
        setShowFlashcardAnswer(false);
        resetFlashcardKeywordState();
      } else {
        setCurrentFlashcard(null);
        setFlashcards([]);
        resetFlashcardKeywordState();
      }
    }
  };

  const handleKnown = () => {
    updateCardSpacedData(currentFlashcard, newQuestionCategory, true);
    playSound('correct');
    advanceOrFinish();
  };

  const handleUnknown = () => {
    updateCardSpacedData(currentFlashcard, newQuestionCategory, false);
    playSound('wrong');
    advanceOrFinish();
  };

  const handleFlip = () => {
    if (isKeywordFlashcard || isWhoAmIFlashcard || showFreeTextInput) return;
    setShowFlashcardAnswer(!showFlashcardAnswer);
    playSound('bubble');
  };

  const goPrev = () => {
    if (flashcardIndex > 0) {
      const prevIdx = flashcardIndex - 1;
      setFlashcardIndex(prevIdx);
      setCurrentFlashcard(flashcards[prevIdx]);
      setShowFlashcardAnswer(false);
      resetFlashcardKeywordState();
      playSound('splash');
    }
  };

  const goNext = () => {
    if (flashcardIndex < flashcards.length - 1) {
      const nextIdx = flashcardIndex + 1;
      setFlashcardIndex(nextIdx);
      setCurrentFlashcard(flashcards[nextIdx]);
      setShowFlashcardAnswer(false);
      resetFlashcardKeywordState();
      playSound('splash');
    }
  };

  const cardLabel = isWhoAmIFlashcard
    ? 'WAS BIN ICH?'
    : isKeywordFlashcard
      ? 'SCHLAGWORT-CHALLENGE'
      : showFreeTextInput
        ? 'FRAGE'
        : showFlashcardAnswer
          ? 'ANTWORT'
          : 'FRAGE';

  const difficultyOptions = [
    ['anfaenger', '5 Hinweise'],
    ['profi', '4 Hinweise'],
    ['experte', '3 Hinweise'],
    ['extra', '2 Hinweise'],
  ];

  return (
    <div className="space-y-4">
      {spacedRepetitionMode && currentFlashcard.spacedData && (
        <div className="flex justify-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${getLevelColor(currentFlashcard.spacedData.level)}`} />
            <span className="font-semibold text-gray-800 text-sm">
              {getLevelLabel(currentFlashcard.spacedData.level)}
            </span>
            <span className="text-xs text-gray-500">
              {currentFlashcard.spacedData.reviewCount || 0}x wiederholt
            </span>
          </div>
        </div>
      )}

      <div
        onClick={handleFlip}
        className={`${glassCard} min-h-[300px] flex items-center justify-center ${
          isKeywordFlashcard || isWhoAmIFlashcard || showFreeTextInput
            ? 'cursor-default'
            : 'cursor-pointer transform transition-all hover:scale-[1.01]'
        }`}
      >
        <div className={sectionAccent('from-cyan-500 via-blue-500 to-indigo-500')} />
        <div className="text-center w-full">
          <div className={`text-xs font-bold mb-4 tracking-wider ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
            {cardLabel}
          </div>
          {isWhoAmIFlashcard ? (
            <div className="space-y-4">
              <p className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Sparkles size={22} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
                {currentFlashcard.prompt || 'Was bin ich?'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    darkMode ? 'bg-white/5 text-cyan-200 border border-white/10' : 'bg-cyan-100 text-cyan-800'
                  }`}
                >
                  60 Sekunden
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    darkMode ? 'bg-white/5 text-slate-200 border border-white/10' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {whoAmIDifficulty} - {whoAmIClueCount}/{currentFlashcard?.clues?.length || 5} Hinweise
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {difficultyOptions.map(([difficultyId, label]) => (
                  <button
                    key={difficultyId}
                    type="button"
                    onClick={() => {
                      setWhoAmIDifficulty(difficultyId);
                      resetFlashcardKeywordState();
                      setWhoAmIExpired(false);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      whoAmIDifficulty === difficultyId
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
                        : darkMode
                          ? 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10'
                          : 'bg-white/70 text-slate-700 border border-gray-200 hover:bg-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div
                className={`mx-auto h-2 w-full max-w-xl overflow-hidden rounded-full ${
                  darkMode ? 'bg-white/10' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    whoAmITimeLeft <= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{
                    width: `${(whoAmITimeLeft / (Number(currentFlashcard?.timeLimit) || WHO_AM_I_TIME_LIMIT)) * 100}%`,
                  }}
                />
              </div>
              <p
                className={`text-sm font-semibold flex items-center justify-center gap-1 ${
                  whoAmITimeLeft <= 10 ? 'text-red-500' : darkMode ? 'text-cyan-300' : 'text-cyan-700'
                }`}
              >
                <Timer size={14} />
                {whoAmITimeLeft}s
              </p>
              <div className="space-y-2 text-left">
                {visibleWhoAmIClues.map((clue, index) => (
                  <div
                    key={`${currentFlashcard?.id || 'whoami'}-${index}`}
                    className={`rounded-xl px-4 py-3 text-sm ${
                      darkMode
                        ? 'bg-white/5 border border-white/10 text-gray-100'
                        : 'bg-white/70 border border-gray-200 text-slate-700'
                    }`}
                  >
                    <span className="mr-2 font-bold text-cyan-500">{index + 1}.</span>
                    {clue}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-800">
                {isKeywordFlashcard
                  ? currentFlashcard.front
                  : showFlashcardAnswer
                    ? currentFlashcard.back
                    : currentFlashcard.front}
              </p>
              <p className="text-xs mt-6 text-gray-500">
                {isKeywordFlashcard
                  ? `Treffe mindestens ${requiredKeywordGroups} Schlagwoerter.`
                  : showFreeTextInput
                    ? 'Tippe deine Antwort unten ein.'
                    : showFlashcardAnswer
                      ? ''
                      : 'Klicken zum Umdrehen'}
              </p>
            </>
          )}
        </div>
      </div>

      {(isKeywordFlashcard || isWhoAmIFlashcard || showFreeTextInput) && (
        <div className={glassCard}>
          <div className={sectionAccent('from-indigo-500 via-purple-500 to-pink-500')} />
          <label
            className={`block text-sm font-semibold mb-1 ${
              darkMode ? 'text-indigo-200' : 'text-indigo-800'
            }`}
          >
            Deine Freitext-Antwort
          </label>
          <p className="text-xs mb-2 text-gray-500">
            {isWhoAmIFlashcard
              ? 'Nutze den gesuchten Begriff möglichst direkt.'
              : 'Singular und Plural werden beide erkannt.'}
          </p>
          <textarea
            value={flashcardKeywordInput}
            onChange={(e) => setFlashcardKeywordInput(e.target.value)}
            rows={4}
            placeholder={
              isWhoAmIFlashcard
                ? 'Welcher Begriff ist gesucht?'
                : 'Antworte in eigenen Worten und triff die Schlagwoerter...'
            }
            className={`${inputClass(darkMode)} mb-3`}
          />
          <button
            onClick={evaluateFlashcardKeywordAnswer}
            disabled={!flashcardKeywordInput.trim() || (isWhoAmIFlashcard && whoAmIExpired)}
            className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              flashcardKeywordInput.trim() && !(isWhoAmIFlashcard && whoAmIExpired)
                ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800'
                : darkMode
                  ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                  : 'bg-white/70 border border-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={16} />
            {isWhoAmIFlashcard ? 'Begriff prüfen' : 'Antwort prüfen'}
          </button>

          {isWhoAmIFlashcard && whoAmIExpired && !flashcardKeywordEvaluation && (
            <div
              className={`mt-4 rounded-xl border p-3 ${
                darkMode ? 'bg-white/5 border-amber-500/40' : 'bg-amber-50 border-amber-300'
              }`}
            >
              <p className={`font-semibold flex items-center gap-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                <AlertTriangle size={14} /> Zeit abgelaufen.
              </p>
              <p className="text-sm mt-1 text-gray-700">Gesucht war: {currentFlashcard.back}</p>
            </div>
          )}

          {flashcardKeywordEvaluation && (
            <div
              className={`mt-4 rounded-xl border p-3 ${
                flashcardKeywordEvaluation.isCorrect
                  ? darkMode
                    ? 'bg-emerald-900/30 border-emerald-500/50'
                    : 'bg-emerald-50 border-emerald-300'
                  : darkMode
                    ? 'bg-amber-900/20 border-amber-500/40'
                    : 'bg-amber-50 border-amber-300'
              }`}
            >
              <p
                className={`font-semibold ${
                  flashcardKeywordEvaluation.isCorrect ? 'text-emerald-500' : 'text-amber-500'
                }`}
              >
                {flashcardKeywordEvaluation.isCorrect
                  ? isWhoAmIFlashcard
                    ? 'Richtig erkannt'
                    : 'Korrekt'
                  : isWhoAmIFlashcard
                    ? 'Noch nicht der gesuchte Begriff'
                    : 'Noch unvollständig'}
              </p>
              <p className="text-sm mt-1 text-gray-700">
                Treffer: {flashcardKeywordEvaluation.matchedCount}/{flashcardKeywordEvaluation.requiredGroups}
              </p>
              {flashcardKeywordEvaluation.matchedLabels?.length > 0 && (
                <p className={`text-sm mt-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Erkannt: {flashcardKeywordEvaluation.matchedLabels.join(', ')}
                </p>
              )}
              {flashcardKeywordEvaluation.missingLabels?.length > 0 && (
                <p className={`text-sm mt-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  Fehlt: {flashcardKeywordEvaluation.missingLabels.join(', ')}
                </p>
              )}
              {currentFlashcard.back && (
                <p
                  className={`text-sm mt-2 pt-2 border-t ${
                    darkMode ? 'text-gray-300 border-white/10' : 'text-gray-700 border-gray-200'
                  }`}
                >
                  {isWhoAmIFlashcard
                    ? `Gesucht war: ${currentFlashcard.back}`
                    : `Musterantwort: ${currentFlashcard.back}`}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {spacedRepetitionMode &&
        !isKeywordFlashcard &&
        (showFlashcardAnswer || (showFreeTextInput && flashcardKeywordEvaluation)) && (
          <div className="flex gap-3">
            <button
              onClick={handleUnknown}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <X size={18} />
              Nicht gewusst
            </button>
            <button
              onClick={handleKnown}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Check size={18} />
              Gewusst
            </button>
          </div>
        )}

      {(!spacedRepetitionMode || !showFlashcardAnswer) &&
        !(spacedRepetitionMode && showFreeTextInput) && (
          <div className="flex justify-between items-center">
            <button
              onClick={goPrev}
              disabled={flashcardIndex === 0}
              className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                flashcardIndex === 0
                  ? darkMode
                    ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                    : 'bg-white/60 border border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
              }`}
            >
              <ArrowLeft size={16} />
              Zurück
            </button>
            <div className="text-sm text-gray-700">
              <span className="font-bold">{flashcardIndex + 1}</span> / {flashcards.length}
            </div>
            <button
              onClick={goNext}
              disabled={flashcardIndex === flashcards.length - 1}
              className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                flashcardIndex === flashcards.length - 1
                  ? darkMode
                    ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                    : 'bg-white/60 border border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
              }`}
            >
              Weiter
              <ArrowRight size={16} />
            </button>
          </div>
        )}
    </div>
  );
};

export default FlashcardPlayer;
