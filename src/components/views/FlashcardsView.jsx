import React from 'react';
import toast from 'react-hot-toast';
import { Plus, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

import { createFlashcardEntry as dsCreateFlashcardEntry } from '../../lib/dataService';
import { CATEGORIES } from '../../data/constants';
import { getWhoAmIClueCount, getWhoAmIVisibleClues, WHO_AM_I_TIME_LIMIT } from '../../data/whoAmIChallenges';

const FlashcardsView = ({
  flashcards,
  setFlashcards,
  flashcardIndex,
  setFlashcardIndex,
  currentFlashcard,
  setCurrentFlashcard,
  showFlashcardAnswer,
  setShowFlashcardAnswer,
  spacedRepetitionMode,
  setSpacedRepetitionMode,
  dueCards,
  newFlashcardCategory,
  setNewFlashcardCategory,
  newFlashcardFront,
  setNewFlashcardFront,
  newFlashcardBack,
  setNewFlashcardBack,
  pendingFlashcards,
  setPendingFlashcards,
  userFlashcards,
  setUserFlashcards,
  newQuestionCategory,
  setNewQuestionCategory,
  deleteFlashcard,
  approveFlashcard,
  getDueCardCount,
  getLevelColor,
  getLevelLabel,
  loadDueCards,
  loadFlashcards,
  moderateContent,
  getCardSpacedData,
  updateCardSpacedData,
  queueXpAward,
  XP_REWARDS,
  FLASHCARD_CONTENT,
  KEYWORD_FLASHCARD_CONTENT,
  WHO_AM_I_FLASHCARD_CONTENT,
  keywordFlashcardMode,
  setKeywordFlashcardMode,
  whoAmIFlashcardMode,
  setWhoAmIFlashcardMode,
  flashcardFreeTextMode,
  setFlashcardFreeTextMode,
  flashcardKeywordInput,
  setFlashcardKeywordInput,
  flashcardKeywordEvaluation,
  evaluateFlashcardKeywordAnswer,
  resetFlashcardKeywordState,
}) => {
  const { user } = useAuth();
  const { darkMode, playSound } = useApp();
  const isKeywordFlashcard = currentFlashcard?.type === 'keyword' && Array.isArray(currentFlashcard?.keywordGroups);
  const isWhoAmIFlashcard = currentFlashcard?.type === 'whoami' && Array.isArray(currentFlashcard?.clues);
  const showFreeTextInput = Boolean(currentFlashcard && (isWhoAmIFlashcard || (!isKeywordFlashcard && flashcardFreeTextMode)));
  const keywordCategoryCount = KEYWORD_FLASHCARD_CONTENT?.[newQuestionCategory]?.length || 0;
  const whoAmICategoryCount = WHO_AM_I_FLASHCARD_CONTENT?.[newQuestionCategory]?.length || 0;
  const requiredKeywordGroups = Math.max(
    1,
    Math.min(
      currentFlashcard?.keywordGroups?.length || 1,
      Number(currentFlashcard?.minKeywordGroups) || currentFlashcard?.keywordGroups?.length || 1
    )
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
  }, [currentFlashcard?.id, currentFlashcard?.q, whoAmIFlashcardMode, whoAmIDifficulty, isWhoAmIFlashcard]);

  React.useEffect(() => {
    if (!whoAmIFlashcardMode || !isWhoAmIFlashcard || whoAmIExpired || flashcardKeywordEvaluation) return undefined;
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

  return (
  <div className="max-w-4xl mx-auto">
    {/* Add Flashcard Form */}
    <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Neue Karteikarte erstellen
      </h3>
      <div className="space-y-3">
        <select
          value={newFlashcardCategory}
          onChange={(e) => setNewFlashcardCategory(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg ${
            darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
          }`}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Vorderseite (Frage):
          </label>
          <textarea
            value={newFlashcardFront}
            onChange={(e) => setNewFlashcardFront(e.target.value)}
            placeholder="z.B. Was ist der optimale pH-Wert?"
            rows="2"
            className={`w-full px-4 py-3 border rounded-lg ${
              darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Rueckseite (Antwort):
          </label>
          <textarea
            value={newFlashcardBack}
            onChange={(e) => setNewFlashcardBack(e.target.value)}
            placeholder="z.B. 7,0 - 7,4 (neutral bis leicht basisch)"
            rows="3"
            className={`w-full px-4 py-3 border rounded-lg ${
              darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
            }`}
          />
        </div>

        <button
          onClick={async () => {
            if (!newFlashcardFront.trim() || !newFlashcardBack.trim()) {
              toast.error('Bitte Vorder- und Rueckseite ausfuellen!');
              return;
            }

            // Content moderation
            if (!moderateContent(newFlashcardFront, 'Vorderseite')) {
              return;
            }
            if (!moderateContent(newFlashcardBack, 'Rueckseite')) {
              return;
            }

            try {
              const flashcard = await dsCreateFlashcardEntry({
                userId: user.id,
                createdBy: user.name,
                category: newFlashcardCategory,
                question: newFlashcardFront.trim(),
                answer: newFlashcardBack.trim(),
                approved: user.permissions.canApproveQuestions
              });

              if (flashcard.approved) {
                setUserFlashcards((current) => [...current, flashcard]);
                toast.success('Karteikarte hinzugefuegt!');
              } else {
                setPendingFlashcards((current) => [...current, flashcard]);
                toast.success('Karteikarte eingereicht! Wird nach Pruefung freigeschaltet.');
              }

              void queueXpAward('flashcardCreation', XP_REWARDS.FLASHCARD_CREATE, {
                eventKey: `flashcard_create_${flashcard.id}`,
                reason: 'Karteikarte erstellt',
                showXpToast: true
              });

              setNewFlashcardFront('');
              setNewFlashcardBack('');
              playSound('splash');
            } catch (error) {
              console.error('Flashcard error:', error);
              toast.error('Fehler beim Erstellen der Karteikarte');
            }
          }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
        >
          <Plus className="inline mr-2" size={20} />
          Karteikarte erstellen
        </button>

        {!user.permissions.canApproveQuestions && (
          <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Deine Karteikarte wird nach Pruefung durch einen Trainer freigeschaltet
          </p>
        )}
      </div>
    </div>

    {/* Flashcard Display */}
    <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Karteikarten
        </h2>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {whoAmIFlashcardMode
            ? `${whoAmICategoryCount} Was-bin-ich-Karten`
            : keywordFlashcardMode
            ? `${keywordCategoryCount} Schlagwort-Karten`
            : `${FLASHCARD_CONTENT[newQuestionCategory]?.length || 0} Standard + ${userFlashcards.filter(fc => fc.category === newQuestionCategory).length} Custom`}
        </div>
      </div>

      {/* Lernmodus Umschalter */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
        <button
          onClick={() => {
            setKeywordFlashcardMode(false);
            setWhoAmIFlashcardMode(false);
            setSpacedRepetitionMode(false);
            resetFlashcardKeywordState();
            loadFlashcards({ useKeyword: false, useWhoAmI: false });
          }}
          className={`py-3 px-4 rounded-lg font-bold transition-all ${
            !spacedRepetitionMode && !keywordFlashcardMode && !whoAmIFlashcardMode
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Alle Karten
        </button>
        <button
          onClick={() => {
            setKeywordFlashcardMode(false);
            setWhoAmIFlashcardMode(true);
            setSpacedRepetitionMode(false);
            setFlashcardFreeTextMode(false);
            resetFlashcardKeywordState();
            loadFlashcards({ useKeyword: false, useWhoAmI: true });
          }}
          className={`py-3 px-4 rounded-lg font-bold transition-all ${
            whoAmIFlashcardMode
              ? 'bg-gradient-to-r from-slate-700 to-cyan-700 text-white shadow-lg'
              : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Was bin ich?
        </button>
        <button
          onClick={() => {
            setKeywordFlashcardMode(false);
            setWhoAmIFlashcardMode(false);
            setSpacedRepetitionMode(true);
            resetFlashcardKeywordState();
            const due = loadDueCards(newQuestionCategory);
            if (due.length > 0) {
              setFlashcards(due);
              setFlashcardIndex(0);
              setCurrentFlashcard(due[0]);
              setShowFlashcardAnswer(false);
            }
          }}
          className={`py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            spacedRepetitionMode && !keywordFlashcardMode && !whoAmIFlashcardMode
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Spaced Repetition
          {getDueCardCount(newQuestionCategory) > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {getDueCardCount(newQuestionCategory)}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setKeywordFlashcardMode(true);
            setWhoAmIFlashcardMode(false);
            setSpacedRepetitionMode(false);
            setFlashcardFreeTextMode(false);
            loadFlashcards({ useKeyword: true, useWhoAmI: false });
          }}
          className={`py-3 px-4 rounded-lg font-bold transition-all ${
            keywordFlashcardMode
              ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg'
              : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Schlagwoerter
        </button>
        <button
          onClick={() => {
            setFlashcardFreeTextMode(prev => !prev);
            if (keywordFlashcardMode) {
              setKeywordFlashcardMode(false);
              loadFlashcards({ useKeyword: false, useWhoAmI: false });
            }
            if (whoAmIFlashcardMode) {
              setWhoAmIFlashcardMode(false);
              loadFlashcards({ useKeyword: false, useWhoAmI: false });
            }
            resetFlashcardKeywordState();
          }}
          className={`py-3 px-4 rounded-lg font-bold transition-all ${
            flashcardFreeTextMode && !keywordFlashcardMode && !whoAmIFlashcardMode
              ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg'
              : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Freitext
        </button>
      </div>

      {/* Spaced Repetition Info */}
      {spacedRepetitionMode && (
        <div className={`${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-lg p-4 mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
              Spaced Repetition Modus
            </h4>
            <span className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {dueCards.length} Karten faellig
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
            Beantworte mit "Gewusst" oder "Nicht gewusst". Karten, die du nicht wusstest, kommen frueher wieder.
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map(level => (
              <div key={level} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${getLevelColor(level)}`}></div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getLevelLabel(level)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kategorien mit faelligen Karten Uebersicht */}
      {spacedRepetitionMode && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {CATEGORIES.map(cat => {
            const dueCount = getDueCardCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setNewQuestionCategory(cat.id);
                  resetFlashcardKeywordState();
                  const due = loadDueCards(cat.id);
                  if (due.length > 0) {
                    setFlashcards(due);
                    setFlashcardIndex(0);
                    setCurrentFlashcard(due[0]);
                    setShowFlashcardAnswer(false);
                  } else {
                    setFlashcards([]);
                    setCurrentFlashcard(null);
                  }
                }}
                className={`p-3 rounded-lg text-left transition-all ${
                  newQuestionCategory === cat.id
                    ? `${cat.color} text-white`
                    : darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{cat.icon}</span>
                  {dueCount > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      newQuestionCategory === cat.id
                        ? 'bg-white/30 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {dueCount}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 truncate ${
                  newQuestionCategory === cat.id
                    ? 'text-white/80'
                    : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {cat.name}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {!spacedRepetitionMode && (
        <select
          value={newQuestionCategory}
          onChange={(e) => {
            setNewQuestionCategory(e.target.value);
            loadFlashcards({
              categoryId: e.target.value,
              useKeyword: keywordFlashcardMode,
              useWhoAmI: whoAmIFlashcardMode
            });
          }}
          className={`w-full px-4 py-3 border rounded-lg mb-6 ${
            darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
          }`}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
      )}
    </div>

    {currentFlashcard && flashcards.length > 0 && (
      <div className="perspective-1000">
        {/* Spaced Repetition Level Badge */}
        {spacedRepetitionMode && currentFlashcard.spacedData && (
          <div className="flex justify-center mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              darkMode ? 'bg-slate-700' : 'bg-gray-100'
            }`}>
              <div className={`w-4 h-4 rounded-full ${getLevelColor(currentFlashcard.spacedData.level)}`}></div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {getLevelLabel(currentFlashcard.spacedData.level)}
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                - {currentFlashcard.spacedData.reviewCount || 0}x wiederholt
              </span>
            </div>
          </div>
        )}

        <div
          onClick={() => {
            if (isKeywordFlashcard || isWhoAmIFlashcard || showFreeTextInput) return;
            setShowFlashcardAnswer(!showFlashcardAnswer);
            playSound('bubble');
          }}
          className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 shadow-2xl min-h-[300px] flex items-center justify-center ${
            isKeywordFlashcard || isWhoAmIFlashcard || showFreeTextInput
              ? 'cursor-default'
              : 'cursor-pointer transform transition-all hover:scale-105'
          } ${
            spacedRepetitionMode && currentFlashcard.spacedData
              ? `border-4 ${getLevelColor(currentFlashcard.spacedData.level).replace('bg-', 'border-')}`
              : ''
          }`}
        >
          <div className="text-center">
            <div className={`text-sm font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
              {isWhoAmIFlashcard ? 'WAS BIN ICH?' : isKeywordFlashcard ? 'SCHLAGWORT-CHALLENGE' : showFreeTextInput ? 'FRAGE' : (showFlashcardAnswer ? 'ANTWORT' : 'FRAGE')}
            </div>
            {isWhoAmIFlashcard ? (
              <div className="space-y-4">
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {currentFlashcard.prompt || 'Was bin ich?'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-slate-700 text-cyan-200' : 'bg-cyan-100 text-cyan-800'}`}>
                    60 Sekunden
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800'}`}>
                    {whoAmIDifficulty} - {whoAmIClueCount}/{currentFlashcard?.clues?.length || 5} Hinweise
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    ['anfaenger', '5 Hinweise'],
                    ['profi', '4 Hinweise'],
                    ['experte', '3 Hinweise'],
                    ['extra', '2 Hinweise']
                  ].map(([difficultyId, label]) => (
                    <button
                      key={difficultyId}
                      type="button"
                      onClick={() => {
                        setWhoAmIDifficulty(difficultyId);
                        resetFlashcardKeywordState();
                        setWhoAmIExpired(false);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                        whoAmIDifficulty === difficultyId
                          ? 'bg-cyan-600 text-white'
                          : darkMode ? 'bg-slate-700 text-gray-300' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className={`mx-auto h-2 w-full max-w-xl overflow-hidden rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${whoAmITimeLeft <= 10 ? 'bg-red-500' : 'bg-cyan-500'}`}
                    style={{ width: `${(whoAmITimeLeft / (Number(currentFlashcard?.timeLimit) || WHO_AM_I_TIME_LIMIT)) * 100}%` }}
                  />
                </div>
                <p className={`text-sm font-semibold ${whoAmITimeLeft <= 10 ? 'text-red-500' : (darkMode ? 'text-cyan-300' : 'text-cyan-700')}`}>
                  {whoAmITimeLeft}s
                </p>
                <div className="space-y-2 text-left">
                  {visibleWhoAmIClues.map((clue, index) => (
                    <div
                      key={`${currentFlashcard?.id || 'whoami'}-${index}`}
                      className={`rounded-lg px-4 py-3 text-sm ${darkMode ? 'bg-slate-700 text-gray-100' : 'bg-slate-100 text-slate-700'}`}
                    >
                      <span className="mr-2 font-bold text-cyan-500">{index + 1}.</span>
                      {clue}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {isKeywordFlashcard
                    ? currentFlashcard.front
                    : (showFlashcardAnswer ? currentFlashcard.back : currentFlashcard.front)}
                </p>
                <p className={`text-sm mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isKeywordFlashcard
                    ? `Treffe mindestens ${requiredKeywordGroups} Schlagwoerter.`
                    : showFreeTextInput
                      ? 'Tippe deine Antwort unten ein.'
                      : (showFlashcardAnswer ? '' : 'Klicken zum Umdrehen')}
                </p>
              </>
            )}
          </div>
        </div>

        {(isKeywordFlashcard || isWhoAmIFlashcard || showFreeTextInput) && (
          <div className={`${darkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-indigo-50 border-indigo-200'} border rounded-xl p-4 mt-4`}>
            <label className={`block text-sm font-bold mb-1 ${darkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>
              Deine Freitext-Antwort
            </label>
            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isWhoAmIFlashcard ? 'Nutze den gesuchten Begriff möglichst direkt.' : 'Singular und Plural werden beide erkannt.'}
            </p>
            <textarea
              value={flashcardKeywordInput}
              onChange={(e) => setFlashcardKeywordInput(e.target.value)}
              rows={4}
              placeholder={isWhoAmIFlashcard ? 'Welcher Begriff ist gesucht?' : 'Antworte in eigenen Worten und triff die Schlagwoerter...'}
              className={`w-full px-4 py-3 border-2 rounded-lg mb-3 ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400'
                  : 'bg-white border-indigo-200 text-gray-800'
              }`}
            />
            <button
              onClick={evaluateFlashcardKeywordAnswer}
              disabled={!flashcardKeywordInput.trim() || (isWhoAmIFlashcard && whoAmIExpired)}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                flashcardKeywordInput.trim() && !(isWhoAmIFlashcard && whoAmIExpired)
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800'
                  : darkMode
                    ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isWhoAmIFlashcard ? 'Begriff prüfen' : 'Antwort prüfen'}
            </button>

            {isWhoAmIFlashcard && whoAmIExpired && !flashcardKeywordEvaluation && (
              <div className={`${darkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-amber-50 border-amber-300'} border rounded-xl p-4 mt-4`}>
                <p className={`font-bold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  Zeit abgelaufen.
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Gesucht war: {currentFlashcard.back}
                </p>
              </div>
            )}
            {flashcardKeywordEvaluation && (
              <div className={`mt-4 rounded-lg border p-3 ${
                flashcardKeywordEvaluation.isCorrect
                  ? darkMode ? 'bg-emerald-900/40 border-emerald-600' : 'bg-emerald-50 border-emerald-300'
                  : darkMode ? 'bg-amber-900/30 border-amber-600' : 'bg-amber-50 border-amber-300'
              }`}>
                <p className={`font-bold ${flashcardKeywordEvaluation.isCorrect ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {flashcardKeywordEvaluation.isCorrect ? (isWhoAmIFlashcard ? 'Richtig erkannt' : 'Korrekt') : (isWhoAmIFlashcard ? 'Noch nicht der gesuchte Begriff' : 'Noch unvollstaendig')}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
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
                  <p className={`text-sm mt-2 pt-2 border-t ${darkMode ? 'text-gray-300 border-slate-600' : 'text-gray-700 border-gray-200'}`}>
                    {isWhoAmIFlashcard ? `Gesucht war: ${currentFlashcard.back}` : `Musterantwort: ${currentFlashcard.back}`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Spaced Repetition Buttons */}
        {spacedRepetitionMode && !isKeywordFlashcard && (showFlashcardAnswer || (showFreeTextInput && flashcardKeywordEvaluation)) && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                const newLevel = updateCardSpacedData(currentFlashcard, newQuestionCategory, false);
                playSound('wrong');

                // Naechste Karte oder fertig
                if (flashcardIndex < flashcards.length - 1) {
                  const nextIdx = flashcardIndex + 1;
                  setFlashcardIndex(nextIdx);
                  setCurrentFlashcard(flashcards[nextIdx]);
                  setShowFlashcardAnswer(false);
                  resetFlashcardKeywordState();
                } else {
                  // Alle Karten durchgearbeitet
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
              }}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
            >
              Nicht gewusst
            </button>
            <button
              onClick={() => {
                const newLevel = updateCardSpacedData(currentFlashcard, newQuestionCategory, true);
                playSound('correct');

                // Naechste Karte oder fertig
                if (flashcardIndex < flashcards.length - 1) {
                  const nextIdx = flashcardIndex + 1;
                  setFlashcardIndex(nextIdx);
                  setCurrentFlashcard(flashcards[nextIdx]);
                  setShowFlashcardAnswer(false);
                  resetFlashcardKeywordState();
                } else {
                  // Alle Karten durchgearbeitet
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
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
            >
              Gewusst
            </button>
          </div>
        )}

        {/* Standard Navigation (nicht im Spaced Repetition Modus oder Antwort noch nicht gezeigt) */}
        {(!spacedRepetitionMode || !showFlashcardAnswer) && !(spacedRepetitionMode && showFreeTextInput) && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                if (flashcardIndex > 0) {
                  const prevIdx = flashcardIndex - 1;
                  setFlashcardIndex(prevIdx);
                  setCurrentFlashcard(flashcards[prevIdx]);
                  setShowFlashcardAnswer(false);
                  resetFlashcardKeywordState();
                  playSound('splash');
                }
              }}
              disabled={flashcardIndex === 0}
              className={`px-6 py-3 rounded-lg font-bold ${
                flashcardIndex === 0
                  ? darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
              }`}
            >
              Zurueck
            </button>
            <div className={darkMode ? 'text-white' : 'text-gray-800'}>
              <span className="font-bold">{flashcardIndex + 1}</span> / {flashcards.length}
            </div>
            <button
              onClick={() => {
                if (flashcardIndex < flashcards.length - 1) {
                  const nextIdx = flashcardIndex + 1;
                  setFlashcardIndex(nextIdx);
                  setCurrentFlashcard(flashcards[nextIdx]);
                  setShowFlashcardAnswer(false);
                  resetFlashcardKeywordState();
                  playSound('splash');
                }
              }}
              disabled={flashcardIndex === flashcards.length - 1}
              className={`px-6 py-3 rounded-lg font-bold ${
                flashcardIndex === flashcards.length - 1
                  ? darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
              }`}
            >
              Weiter
            </button>
          </div>
        )}
      </div>
    )}

    {(!currentFlashcard || flashcards.length === 0) && (
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 text-center`}>
        <div className="text-6xl mb-4">{spacedRepetitionMode ? '⏳' : '🎴'}</div>
        <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {spacedRepetitionMode
            ? 'Alle Karten wiederholt!'
            : whoAmIFlashcardMode
              ? 'Keine Was-bin-ich-Karten'
            : keywordFlashcardMode
              ? 'Keine Schlagwort-Karten'
              : 'Keine Karteikarten'}
        </p>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {spacedRepetitionMode
            ? 'Super! Du hast alle faelligen Karten in dieser Kategorie durchgearbeitet. Komm später wieder!'
            : whoAmIFlashcardMode
              ? 'In dieser Kategorie gibt es noch keine Was-bin-ich-Karten.'
            : keywordFlashcardMode
              ? 'In dieser Kategorie gibt es noch keine Extra-schwer-Schlagwortkarten.'
              : 'Noch keine Karteikarten in dieser Kategorie. Erstelle die erste!'}
        </p>
        {spacedRepetitionMode && (
          <button
            onClick={() => {
              setKeywordFlashcardMode(false);
              setSpacedRepetitionMode(false);
              resetFlashcardKeywordState();
              setWhoAmIFlashcardMode(false);
              loadFlashcards({ useKeyword: false, useWhoAmI: false });
            }}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            Alle Karten anzeigen
          </button>
        )}
      </div>
    )}

    {/* Pending Flashcards for Trainers/Admins */}
    {user.permissions.canApproveQuestions && (
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mt-6`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Wartende Karteikarten genehmigen
        </h3>
        {pendingFlashcards.length > 0 ? (
          <div className="space-y-3">
            {pendingFlashcards.map(fc => {
              const cat = CATEGORIES.find(c => c.id === fc.category);
              return (
                <div key={fc.id} className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-yellow-50 border-yellow-300'} border-2 rounded-lg p-4`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`${cat.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                      {cat.icon} {cat.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveFlashcard(fc.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                      >
                        <Check size={16} className="inline" /> Genehmigen
                      </button>
                      <button
                        onClick={() => deleteFlashcard(fc.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                      >
                        <X size={16} className="inline" /> Ablehnen
                      </button>
                    </div>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-3 mb-2`}>
                    <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Vorderseite:</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-800'}>{fc.front}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-3`}>
                    <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Rueckseite:</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-800'}>{fc.back}</p>
                  </div>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Von {fc.createdBy} - {new Date(fc.time).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Keine wartenden Karteikarten
          </p>
        )}
      </div>
    )}
  </div>
  );
};

export default FlashcardsView;
