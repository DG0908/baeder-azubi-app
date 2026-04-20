import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import FlashcardCreateForm from './flashcards/FlashcardCreateForm';
import FlashcardModeSwitcher from './flashcards/FlashcardModeSwitcher';
import FlashcardPlayer from './flashcards/FlashcardPlayer';
import FlashcardEmptyState from './flashcards/FlashcardEmptyState';
import FlashcardPendingApprovals from './flashcards/FlashcardPendingApprovals';

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

  const keywordCategoryCount = KEYWORD_FLASHCARD_CONTENT?.[newQuestionCategory]?.length || 0;
  const whoAmICategoryCount = WHO_AM_I_FLASHCARD_CONTENT?.[newQuestionCategory]?.length || 0;
  const standardCategoryCount = FLASHCARD_CONTENT[newQuestionCategory]?.length || 0;
  const customCategoryCount = userFlashcards.filter((fc) => fc.category === newQuestionCategory).length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <FlashcardCreateForm
        darkMode={darkMode}
        user={user}
        playSound={playSound}
        newFlashcardCategory={newFlashcardCategory}
        setNewFlashcardCategory={setNewFlashcardCategory}
        newFlashcardFront={newFlashcardFront}
        setNewFlashcardFront={setNewFlashcardFront}
        newFlashcardBack={newFlashcardBack}
        setNewFlashcardBack={setNewFlashcardBack}
        setUserFlashcards={setUserFlashcards}
        setPendingFlashcards={setPendingFlashcards}
        moderateContent={moderateContent}
        queueXpAward={queueXpAward}
        XP_REWARDS={XP_REWARDS}
      />

      <FlashcardModeSwitcher
        darkMode={darkMode}
        spacedRepetitionMode={spacedRepetitionMode}
        setSpacedRepetitionMode={setSpacedRepetitionMode}
        keywordFlashcardMode={keywordFlashcardMode}
        setKeywordFlashcardMode={setKeywordFlashcardMode}
        whoAmIFlashcardMode={whoAmIFlashcardMode}
        setWhoAmIFlashcardMode={setWhoAmIFlashcardMode}
        flashcardFreeTextMode={flashcardFreeTextMode}
        setFlashcardFreeTextMode={setFlashcardFreeTextMode}
        dueCards={dueCards}
        newQuestionCategory={newQuestionCategory}
        setNewQuestionCategory={setNewQuestionCategory}
        keywordCategoryCount={keywordCategoryCount}
        whoAmICategoryCount={whoAmICategoryCount}
        standardCategoryCount={standardCategoryCount}
        customCategoryCount={customCategoryCount}
        userFlashcards={userFlashcards}
        loadFlashcards={loadFlashcards}
        loadDueCards={loadDueCards}
        setFlashcards={setFlashcards}
        setFlashcardIndex={setFlashcardIndex}
        setCurrentFlashcard={setCurrentFlashcard}
        setShowFlashcardAnswer={setShowFlashcardAnswer}
        resetFlashcardKeywordState={resetFlashcardKeywordState}
        getDueCardCount={getDueCardCount}
        getLevelColor={getLevelColor}
        getLevelLabel={getLevelLabel}
      />

      {currentFlashcard && flashcards.length > 0 && (
        <FlashcardPlayer
          darkMode={darkMode}
          playSound={playSound}
          flashcards={flashcards}
          setFlashcards={setFlashcards}
          flashcardIndex={flashcardIndex}
          setFlashcardIndex={setFlashcardIndex}
          currentFlashcard={currentFlashcard}
          setCurrentFlashcard={setCurrentFlashcard}
          showFlashcardAnswer={showFlashcardAnswer}
          setShowFlashcardAnswer={setShowFlashcardAnswer}
          spacedRepetitionMode={spacedRepetitionMode}
          keywordFlashcardMode={keywordFlashcardMode}
          whoAmIFlashcardMode={whoAmIFlashcardMode}
          flashcardFreeTextMode={flashcardFreeTextMode}
          flashcardKeywordInput={flashcardKeywordInput}
          setFlashcardKeywordInput={setFlashcardKeywordInput}
          flashcardKeywordEvaluation={flashcardKeywordEvaluation}
          evaluateFlashcardKeywordAnswer={evaluateFlashcardKeywordAnswer}
          resetFlashcardKeywordState={resetFlashcardKeywordState}
          newQuestionCategory={newQuestionCategory}
          loadDueCards={loadDueCards}
          updateCardSpacedData={updateCardSpacedData}
          getLevelColor={getLevelColor}
          getLevelLabel={getLevelLabel}
        />
      )}

      {(!currentFlashcard || flashcards.length === 0) && (
        <FlashcardEmptyState
          darkMode={darkMode}
          spacedRepetitionMode={spacedRepetitionMode}
          whoAmIFlashcardMode={whoAmIFlashcardMode}
          keywordFlashcardMode={keywordFlashcardMode}
          setSpacedRepetitionMode={setSpacedRepetitionMode}
          setKeywordFlashcardMode={setKeywordFlashcardMode}
          setWhoAmIFlashcardMode={setWhoAmIFlashcardMode}
          resetFlashcardKeywordState={resetFlashcardKeywordState}
          loadFlashcards={loadFlashcards}
        />
      )}

      {user.permissions.canApproveQuestions && (
        <FlashcardPendingApprovals
          darkMode={darkMode}
          pendingFlashcards={pendingFlashcards}
          approveFlashcard={approveFlashcard}
          deleteFlashcard={deleteFlashcard}
        />
      )}
    </div>
  );
};

export default FlashcardsView;
