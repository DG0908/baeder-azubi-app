import { Hourglass, Sparkles, Inbox, BookOpen } from 'lucide-react';
import { glassCard, sectionAccent } from './flashcardUi';

const FlashcardEmptyState = ({
  darkMode,
  spacedRepetitionMode,
  whoAmIFlashcardMode,
  keywordFlashcardMode,
  setSpacedRepetitionMode,
  setKeywordFlashcardMode,
  setWhoAmIFlashcardMode,
  resetFlashcardKeywordState,
  loadFlashcards,
}) => {
  const Icon = spacedRepetitionMode
    ? Hourglass
    : whoAmIFlashcardMode
      ? Sparkles
      : keywordFlashcardMode
        ? Inbox
        : BookOpen;

  const title = spacedRepetitionMode
    ? 'Alle Karten wiederholt!'
    : whoAmIFlashcardMode
      ? 'Keine Was-bin-ich-Karten'
      : keywordFlashcardMode
        ? 'Keine Schlagwort-Karten'
        : 'Keine Karteikarten';

  const description = spacedRepetitionMode
    ? 'Super! Du hast alle faelligen Karten in dieser Kategorie durchgearbeitet. Komm später wieder!'
    : whoAmIFlashcardMode
      ? 'In dieser Kategorie gibt es noch keine Was-bin-ich-Karten.'
      : keywordFlashcardMode
        ? 'In dieser Kategorie gibt es noch keine Extra-schwer-Schlagwortkarten.'
        : 'Noch keine Karteikarten in dieser Kategorie. Erstelle die erste!';

  return (
    <div className={`${glassCard} text-center py-12`}>
      <div className={sectionAccent('from-purple-500 via-pink-500 to-rose-500')} />
      <Icon
        size={48}
        className={`mx-auto mb-3 ${darkMode ? 'text-pink-300' : 'text-pink-500'}`}
      />
      <p className="text-xl font-bold mb-2 text-gray-800">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
      {spacedRepetitionMode && (
        <button
          onClick={() => {
            setKeywordFlashcardMode(false);
            setSpacedRepetitionMode(false);
            resetFlashcardKeywordState();
            setWhoAmIFlashcardMode(false);
            loadFlashcards({ useKeyword: false, useWhoAmI: false });
          }}
          className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
        >
          Alle Karten anzeigen
        </button>
      )}
    </div>
  );
};

export default FlashcardEmptyState;
