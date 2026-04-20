import { Layers, Sparkles, Clock, Tag, PenLine, Brain } from 'lucide-react';
import { CATEGORIES } from '../../../data/constants';
import { glassCard, sectionAccent, selectClass, modePillBtn, subtleBoxClass } from './flashcardUi';

const FlashcardModeSwitcher = ({
  darkMode,
  spacedRepetitionMode,
  setSpacedRepetitionMode,
  keywordFlashcardMode,
  setKeywordFlashcardMode,
  whoAmIFlashcardMode,
  setWhoAmIFlashcardMode,
  flashcardFreeTextMode,
  setFlashcardFreeTextMode,
  dueCards,
  newQuestionCategory,
  setNewQuestionCategory,
  keywordCategoryCount,
  whoAmICategoryCount,
  standardCategoryCount,
  customCategoryCount,
  userFlashcards: _userFlashcards,
  loadFlashcards,
  loadDueCards,
  setFlashcards,
  setFlashcardIndex,
  setCurrentFlashcard,
  setShowFlashcardAnswer,
  resetFlashcardKeywordState,
  getDueCardCount,
  getLevelColor,
  getLevelLabel,
}) => {
  const modeButtons = [
    {
      key: 'all',
      label: 'Alle Karten',
      icon: Layers,
      gradient: 'from-purple-500 to-pink-500',
      active: !spacedRepetitionMode && !keywordFlashcardMode && !whoAmIFlashcardMode && !flashcardFreeTextMode,
      onClick: () => {
        setKeywordFlashcardMode(false);
        setWhoAmIFlashcardMode(false);
        setSpacedRepetitionMode(false);
        setFlashcardFreeTextMode(false);
        resetFlashcardKeywordState();
        loadFlashcards({ useKeyword: false, useWhoAmI: false });
      },
    },
    {
      key: 'whoami',
      label: 'Was bin ich?',
      icon: Sparkles,
      gradient: 'from-slate-700 to-cyan-700',
      active: whoAmIFlashcardMode,
      onClick: () => {
        setKeywordFlashcardMode(false);
        setWhoAmIFlashcardMode(true);
        setSpacedRepetitionMode(false);
        setFlashcardFreeTextMode(false);
        resetFlashcardKeywordState();
        loadFlashcards({ useKeyword: false, useWhoAmI: true });
      },
    },
    {
      key: 'spaced',
      label: 'Spaced Repetition',
      icon: Clock,
      gradient: 'from-purple-500 to-pink-500',
      active: spacedRepetitionMode && !keywordFlashcardMode && !whoAmIFlashcardMode,
      badge: getDueCardCount(newQuestionCategory),
      onClick: () => {
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
      },
    },
    {
      key: 'keyword',
      label: 'Schlagwoerter',
      icon: Tag,
      gradient: 'from-indigo-600 to-purple-700',
      active: keywordFlashcardMode,
      onClick: () => {
        setKeywordFlashcardMode(true);
        setWhoAmIFlashcardMode(false);
        setSpacedRepetitionMode(false);
        setFlashcardFreeTextMode(false);
        loadFlashcards({ useKeyword: true, useWhoAmI: false });
      },
    },
    {
      key: 'freetext',
      label: 'Freitext',
      icon: PenLine,
      gradient: 'from-violet-600 to-pink-600',
      active: flashcardFreeTextMode && !keywordFlashcardMode && !whoAmIFlashcardMode,
      onClick: () => {
        setFlashcardFreeTextMode((prev) => !prev);
        if (keywordFlashcardMode) {
          setKeywordFlashcardMode(false);
          loadFlashcards({ useKeyword: false, useWhoAmI: false });
        }
        if (whoAmIFlashcardMode) {
          setWhoAmIFlashcardMode(false);
          loadFlashcards({ useKeyword: false, useWhoAmI: false });
        }
        resetFlashcardKeywordState();
      },
    },
  ];

  const statsLabel = whoAmIFlashcardMode
    ? `${whoAmICategoryCount} Was-bin-ich-Karten`
    : keywordFlashcardMode
      ? `${keywordCategoryCount} Schlagwort-Karten`
      : `${standardCategoryCount} Standard + ${customCategoryCount} Custom`;

  return (
    <div className={glassCard}>
      <div className={sectionAccent('from-purple-500 via-pink-500 to-rose-500')} />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Brain size={24} className={darkMode ? 'text-pink-300' : 'text-pink-600'} />
          Karteikarten
        </h2>
        <div className="text-xs text-gray-500">{statsLabel}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        {modeButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.key}
              onClick={btn.onClick}
              className={modePillBtn(btn.active, darkMode, btn.gradient)}
            >
              <Icon size={16} />
              <span>{btn.label}</span>
              {btn.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {btn.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {spacedRepetitionMode && (
        <div className={`${subtleBoxClass(darkMode)} mb-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock size={16} className={darkMode ? 'text-purple-300' : 'text-purple-600'} />
              Spaced Repetition Modus
            </h4>
            <span className="text-xs text-gray-500">{dueCards.length} Karten faellig</span>
          </div>
          <p className="text-sm text-gray-600">
            Beantworte mit "Gewusst" oder "Nicht gewusst". Karten, die du nicht wusstest, kommen frueher wieder.
          </p>
          <div className="flex gap-3 mt-3 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div key={level} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${getLevelColor(level)}`} />
                <span className="text-xs text-gray-600">{getLevelLabel(level)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {spacedRepetitionMode && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          {CATEGORIES.map((cat) => {
            const dueCount = getDueCardCount(cat.id);
            const isActive = newQuestionCategory === cat.id;
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
                className={`p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? `${cat.color} text-white shadow-sm`
                    : darkMode
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                      : 'bg-white/70 border border-gray-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{cat.icon}</span>
                  {dueCount > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/30 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {dueCount}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 truncate ${
                    isActive ? 'text-white/90' : 'text-gray-600'
                  }`}
                >
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
              useWhoAmI: whoAmIFlashcardMode,
            });
          }}
          className={selectClass(darkMode)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default FlashcardModeSwitcher;
