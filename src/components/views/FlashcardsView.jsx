import React from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';
import { CATEGORIES } from '../../data/constants';

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
}) => {
  const { user } = useAuth();
  const { darkMode, playSound } = useApp();

  return (
  <div className="max-w-4xl mx-auto">
    {/* Add Flashcard Form */}
    <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        ➕ Neue Karteikarte erstellen
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
            Rückseite (Antwort):
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
              alert('Bitte Vorder- und Rückseite ausfüllen!');
              return;
            }

            // Content moderation
            if (!moderateContent(newFlashcardFront, 'Vorderseite')) {
              return;
            }
            if (!moderateContent(newFlashcardBack, 'Rückseite')) {
              return;
            }

            try {
              const isApproved = user.permissions.canApproveQuestions;
              const { data, error } = await supabase
                .from('flashcards')
                .insert([{
                  user_id: user.id,
                  category: newFlashcardCategory,
                  question: newFlashcardFront.trim(),
                  answer: newFlashcardBack.trim(),
                  approved: isApproved
                }])
                .select()
                .single();

              if (error) throw error;

              const flashcard = {
                id: data.id,
                front: data.question,
                back: data.answer,
                category: data.category,
                approved: data.approved,
                userId: data.user_id
              };

              if (flashcard.approved) {
                setUserFlashcards([...userFlashcards, flashcard]);
                alert('Karteikarte hinzugefügt! 🎴');
              } else {
                setPendingFlashcards([...pendingFlashcards, flashcard]);
                alert('Karteikarte eingereicht! Sie wird nach Prüfung freigeschaltet. ⏳');
              }

              void queueXpAward('flashcardCreation', XP_REWARDS.FLASHCARD_CREATE, {
                eventKey: `flashcard_create_${data.id}`,
                reason: 'Karteikarte erstellt',
                showXpToast: true
              });

              setNewFlashcardFront('');
              setNewFlashcardBack('');
              playSound('splash');
            } catch (error) {
              console.error('Flashcard error:', error);
              alert('Fehler beim Erstellen der Karteikarte');
            }
          }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
        >
          <Plus className="inline mr-2" size={20} />
          Karteikarte erstellen
        </button>

        {!user.permissions.canApproveQuestions && (
          <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ℹ️ Deine Karteikarte wird nach Prüfung durch einen Trainer freigeschaltet
          </p>
        )}
      </div>
    </div>

    {/* Flashcard Display */}
    <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🎴 Karteikarten
        </h2>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {FLASHCARD_CONTENT[newQuestionCategory]?.length || 0} Standard + {userFlashcards.filter(fc => fc.category === newQuestionCategory).length} Custom
        </div>
      </div>

      {/* Lernmodus Umschalter */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setSpacedRepetitionMode(false);
            loadFlashcards();
          }}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
            !spacedRepetitionMode
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📚 Alle Karten
        </button>
        <button
          onClick={() => {
            setSpacedRepetitionMode(true);
            const due = loadDueCards(newQuestionCategory);
            if (due.length > 0) {
              setFlashcards(due);
              setFlashcardIndex(0);
              setCurrentFlashcard(due[0]);
              setShowFlashcardAnswer(false);
            }
          }}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            spacedRepetitionMode
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🧠 Spaced Repetition
          {getDueCardCount(newQuestionCategory) > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {getDueCardCount(newQuestionCategory)}
            </span>
          )}
        </button>
      </div>

      {/* Spaced Repetition Info */}
      {spacedRepetitionMode && (
        <div className={`${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-lg p-4 mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
              🧠 Spaced Repetition Modus
            </h4>
            <span className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {dueCards.length} Karten fällig
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
            Beantworte mit "Gewusst" oder "Nicht gewusst". Karten die du nicht wusstest kommen früher wieder.
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

      {/* Kategorien mit fälligen Karten Übersicht */}
      {spacedRepetitionMode && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {CATEGORIES.map(cat => {
            const dueCount = getDueCardCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setNewQuestionCategory(cat.id);
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
            const hardcodedCards = FLASHCARD_CONTENT[e.target.value] || [];
            const userCards = userFlashcards.filter(fc => fc.category === e.target.value);
            const allCards = [...hardcodedCards, ...userCards];
            setFlashcards(allCards);
            setFlashcardIndex(0);
            setCurrentFlashcard(allCards[0]);
            setShowFlashcardAnswer(false);
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
                • {currentFlashcard.spacedData.reviewCount || 0}x wiederholt
              </span>
            </div>
          </div>
        )}

        <div
          onClick={() => {
            setShowFlashcardAnswer(!showFlashcardAnswer);
            playSound('bubble');
          }}
          className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 shadow-2xl cursor-pointer transform transition-all hover:scale-105 min-h-[300px] flex items-center justify-center ${
            spacedRepetitionMode && currentFlashcard.spacedData
              ? `border-4 ${getLevelColor(currentFlashcard.spacedData.level).replace('bg-', 'border-')}`
              : ''
          }`}
        >
          <div className="text-center">
            <div className={`text-sm font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
              {showFlashcardAnswer ? 'ANTWORT' : 'FRAGE'}
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {showFlashcardAnswer ? currentFlashcard.back : currentFlashcard.front}
            </p>
            <p className={`text-sm mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {showFlashcardAnswer ? '' : 'Klicken zum Umdrehen'}
            </p>
          </div>
        </div>

        {/* Spaced Repetition Buttons */}
        {spacedRepetitionMode && showFlashcardAnswer && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                const newLevel = updateCardSpacedData(currentFlashcard, newQuestionCategory, false);
                playSound('wrong');

                // Nächste Karte oder fertig
                if (flashcardIndex < flashcards.length - 1) {
                  const nextIdx = flashcardIndex + 1;
                  setFlashcardIndex(nextIdx);
                  setCurrentFlashcard(flashcards[nextIdx]);
                  setShowFlashcardAnswer(false);
                } else {
                  // Alle Karten durchgearbeitet
                  const remaining = loadDueCards(newQuestionCategory);
                  if (remaining.length > 0) {
                    setFlashcards(remaining);
                    setFlashcardIndex(0);
                    setCurrentFlashcard(remaining[0]);
                    setShowFlashcardAnswer(false);
                  } else {
                    setCurrentFlashcard(null);
                    setFlashcards([]);
                  }
                }
              }}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
            >
              ❌ Nicht gewusst
            </button>
            <button
              onClick={() => {
                const newLevel = updateCardSpacedData(currentFlashcard, newQuestionCategory, true);
                playSound('correct');

                // Nächste Karte oder fertig
                if (flashcardIndex < flashcards.length - 1) {
                  const nextIdx = flashcardIndex + 1;
                  setFlashcardIndex(nextIdx);
                  setCurrentFlashcard(flashcards[nextIdx]);
                  setShowFlashcardAnswer(false);
                } else {
                  // Alle Karten durchgearbeitet
                  const remaining = loadDueCards(newQuestionCategory);
                  if (remaining.length > 0) {
                    setFlashcards(remaining);
                    setFlashcardIndex(0);
                    setCurrentFlashcard(remaining[0]);
                    setShowFlashcardAnswer(false);
                  } else {
                    setCurrentFlashcard(null);
                    setFlashcards([]);
                  }
                }
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
            >
              ✅ Gewusst
            </button>
          </div>
        )}

        {/* Standard Navigation (nicht im Spaced Repetition Modus oder Antwort noch nicht gezeigt) */}
        {(!spacedRepetitionMode || !showFlashcardAnswer) && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                if (flashcardIndex > 0) {
                  const prevIdx = flashcardIndex - 1;
                  setFlashcardIndex(prevIdx);
                  setCurrentFlashcard(flashcards[prevIdx]);
                  setShowFlashcardAnswer(false);
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
              ← Zurück
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
              Weiter →
            </button>
          </div>
        )}
      </div>
    )}

    {(!currentFlashcard || flashcards.length === 0) && (
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 text-center`}>
        <div className="text-6xl mb-4">{spacedRepetitionMode ? '🎉' : '🎴'}</div>
        <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {spacedRepetitionMode ? 'Alle Karten wiederholt!' : 'Keine Karteikarten'}
        </p>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {spacedRepetitionMode
            ? 'Super! Du hast alle fälligen Karten in dieser Kategorie durchgearbeitet. Komm später wieder!'
            : 'Noch keine Karteikarten in dieser Kategorie. Erstelle die erste!'}
        </p>
        {spacedRepetitionMode && (
          <button
            onClick={() => {
              setSpacedRepetitionMode(false);
              loadFlashcards();
            }}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            📚 Alle Karten anzeigen
          </button>
        )}
      </div>
    )}

    {/* Pending Flashcards for Trainers/Admins */}
    {user.permissions.canApproveQuestions && (
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mt-6`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          ⏳ Wartende Karteikarten genehmigen
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
                    <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Rückseite:</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-800'}>{fc.back}</p>
                  </div>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Von {fc.createdBy} • {new Date(fc.time).toLocaleString()}
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
