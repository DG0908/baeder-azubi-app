import { useState } from 'react';
import {
  loadFlashcards as dsLoadFlashcards,
  approveFlashcardEntry as dsApproveFlashcard,
  deleteFlashcardEntry as dsDeleteFlashcard,
} from '../lib/dataService';
import { KEYWORD_CHALLENGES, buildKeywordFlashcards } from '../data/keywordChallenges';
import {
  WHO_AM_I_CATEGORY,
  WHO_AM_I_CHALLENGES,
  buildWhoAmIFlashcards,
  buildWhoAmIStudyFlashcards,
} from '../data/whoAmIChallenges';
import { CATEGORIES } from '../data/constants';
import {
  XP_REWARDS,
  evaluateKeywordAnswer,
  isKeywordQuestion,
  autoExtractKeywordGroups,
} from '../lib/quizHelpers';

const SPACED_INTERVALS = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
  6: 60,
};

const LEVEL_COLORS = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-lime-500',
  5: 'bg-green-500',
  6: 'bg-emerald-500',
};

const LEVEL_LABELS = {
  1: 'Neu',
  2: 'Lernend',
  3: 'Bekannt',
  4: 'Gefestigt',
  5: 'Sicher',
  6: 'Gemeistert',
};

const WHO_AM_I_STUDY_FLASHCARDS = buildWhoAmIStudyFlashcards(WHO_AM_I_CHALLENGES);
const KEYWORD_FLASHCARD_CONTENT = buildKeywordFlashcards(KEYWORD_CHALLENGES);
const WHO_AM_I_FLASHCARD_CONTENT = buildWhoAmIFlashcards(WHO_AM_I_CHALLENGES);

const FLASHCARD_CONTENT = {
  org: [
    { front: 'Was ist das Hausrecht?', back: 'Das Recht des Badbetreibers, die Hausordnung durchzusetzen und Personen des Platzes zu verweisen.' },
    { front: 'Wer ist für die Aufsicht verantwortlich?', back: 'Die Aufsichtsperson während der kompletten Öffnungszeiten.' },
  ],
  tech: [
    { front: 'Optimaler pH-Wert im Schwimmbad?', back: '7,0 - 7,4 (neutral bis leicht basisch)' },
    { front: 'Was macht eine Umwälzpumpe?', back: 'Sie pumpt das Wasser durch die Filteranlage zur Reinigung.' },
    { front: 'Chlor-Richtwert im Becken?', back: '0,3 - 0,6 mg/L freies Chlor' },
  ],
  swim: [
    { front: 'Was ist der Rautek-Griff?', back: 'Rettungsgriff zum Bergen bewusstloser Personen aus dem Gefahrenbereich.' },
    { front: 'Wie funktioniert die Mund-zu-Mund-Beatmung?', back: 'Kopf überstrecken, Nase zuhalten, 2-mal beatmen, dann Herzdruckmassage.' },
  ],
  first: [
    { front: 'Verhältnis Herzdruckmassage zu Beatmung?', back: '30:2 - 30 Kompressionen, dann 2 Beatmungen.' },
    { front: 'Wo drückt man bei der Herzdruckmassage?', back: 'Unteres Drittel des Brustbeins, 5-6 cm tief.' },
  ],
  hygiene: [
    { front: 'Warum Duschpflicht vor dem Schwimmen?', back: 'Entfernung von Schmutz, Schweiß und Kosmetik für bessere Wasserqualität.' },
    { front: 'Was sind Legionellen?', back: 'Bakterien im Wasser, gefährlich bei Inhalation, vermehren sich bei 25-45 °C.' },
  ],
  pol: [
    { front: 'Was regelt das Arbeitsrecht?', back: 'Beziehung zwischen Arbeitgeber und Arbeitnehmer, Rechte und Pflichten.' },
    { front: 'Was ist die Berufsgenossenschaft?', back: 'Träger der gesetzlichen Unfallversicherung für Arbeitsunfälle.' },
  ],
  [WHO_AM_I_CATEGORY.id]: WHO_AM_I_STUDY_FLASHCARDS[WHO_AM_I_CATEGORY.id] || [],
  aevo: [
    { front: 'Was ist das Ziel der Berufsausbildung nach BBiG?', back: 'Berufliche Handlungsfähigkeit vermitteln.' },
    { front: 'Woraus besteht die Eignung eines Ausbilders?', back: 'Aus persönlicher und fachlicher Eignung.' },
    { front: 'Wie lange darf die Probezeit in der Ausbildung sein?', back: 'Mindestens 1 Monat, höchstens 4 Monate.' },
    { front: 'Welche Methode hat 4 feste Schritte in der Unterweisung?', back: 'Die Vier-Stufen-Methode: vorbereiten, vormachen, nachmachen, üben.' },
    { front: 'Was bedeutet SMART bei Lernzielen?', back: 'Spezifisch, messbar, attraktiv, realistisch und terminiert.' },
    { front: 'Wofür ist der betriebliche Ausbildungsplan da?', back: 'Er konkretisiert den Ausbildungsrahmenplan für den Betrieb.' },
    { front: 'Was ist bei Feedback an Azubis wichtig?', back: 'Zeitnah, konkret, respektvoll und nachvollziehbar.' },
    { front: 'Was muss der Betrieb für Azubis bereitstellen?', back: 'Alle erforderlichen Ausbildungsmittel und Anleitung.' },
    { front: 'Wann endet die Ausbildung regulär?', back: 'Mit dem Bestehen der Abschlussprüfung.' },
    { front: 'Was gilt bei nicht bestandener Abschlussprüfung?', back: 'Auf Verlangen Verlängerung bis zur nächsten Wiederholungsprüfung.' },
    { front: 'Wofür muss ein Azubi freigestellt werden?', back: 'Für Berufsschule, Prüfungen und angeordnete Ausbildungsmaßnahmen.' },
    { front: 'Warum sind Beurteilungsgespräche wichtig?', back: 'Sie machen Lernfortschritt transparent und helfen beim Nachsteuern.' },
  ],
};

export function useFlashcards(deps) {
  const {
    showToast,
    playSound,
    newQuestionCategory,
    lateDepsRef,
  } = deps;

  const getLateDeps = () => lateDepsRef.current || {};

  // ===================== State =====================
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [flashcardProgress, setFlashcardProgress] = useState(null);
  const [userFlashcards, setUserFlashcards] = useState([]);
  const [pendingFlashcards, setPendingFlashcards] = useState([]);
  const [newFlashcardFront, setNewFlashcardFront] = useState('');
  const [newFlashcardBack, setNewFlashcardBack] = useState('');
  const [newFlashcardCategory, setNewFlashcardCategory] = useState('org');
  const [keywordFlashcardMode, setKeywordFlashcardMode] = useState(false);
  const [whoAmIFlashcardMode, setWhoAmIFlashcardMode] = useState(false);
  const [flashcardKeywordInput, setFlashcardKeywordInput] = useState('');
  const [flashcardKeywordEvaluation, setFlashcardKeywordEvaluation] = useState(null);
  const [flashcardFreeTextMode, setFlashcardFreeTextMode] = useState(false);

  // Spaced Repetition State
  const [spacedRepetitionData, setSpacedRepetitionData] = useState(() => {
    const saved = localStorage.getItem('spaced_repetition_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [spacedRepetitionMode, setSpacedRepetitionMode] = useState(false);
  const [dueCards, setDueCards] = useState([]);

  // ===================== Helpers =====================
  const resetFlashcardKeywordState = () => {
    setFlashcardKeywordInput('');
    setFlashcardKeywordEvaluation(null);
  };

  const loadFlashcardsFromBackend = async () => {
    const flashcardsResult = await dsLoadFlashcards();
    setUserFlashcards(flashcardsResult.approved);
    setPendingFlashcards(flashcardsResult.pending);
  };

  // ===================== Actions =====================
  const loadFlashcards = (options = {}) => {
    const categoryId = options.categoryId || newQuestionCategory;
    const useKeywordMode = typeof options.useKeyword === 'boolean'
      ? options.useKeyword
      : keywordFlashcardMode;
    const useWhoAmIMode = typeof options.useWhoAmI === 'boolean'
      ? options.useWhoAmI
      : whoAmIFlashcardMode;

    const hardcodedCards = useWhoAmIMode
      ? (WHO_AM_I_FLASHCARD_CONTENT[categoryId] || [])
      : useKeywordMode
        ? (KEYWORD_FLASHCARD_CONTENT[categoryId] || [])
        : (FLASHCARD_CONTENT[categoryId] || []);
    const userCards = (useKeywordMode || useWhoAmIMode)
      ? []
      : userFlashcards.filter(fc => fc.category === categoryId);
    const allCards = [...hardcodedCards, ...userCards];

    setFlashcards(allCards);
    setFlashcardIndex(0);
    setCurrentFlashcard(allCards[0] || null);
    setShowFlashcardAnswer(false);
    resetFlashcardKeywordState();
  };

  const evaluateFlashcardKeywordAnswer = () => {
    if (!currentFlashcard) return null;
    const trimmedInput = flashcardKeywordInput.trim();
    if (!trimmedInput) {
      showToast('Bitte gib zuerst deine Antwort ein.', 'error', 1800);
      return null;
    }
    let evaluation;
    if (isKeywordQuestion(currentFlashcard) || currentFlashcard?.type === 'whoami') {
      evaluation = evaluateKeywordAnswer(currentFlashcard, trimmedInput);
    } else {
      const backText = String(currentFlashcard.back || '');
      const groups = autoExtractKeywordGroups(backText);
      const fakeQ = {
        keywordGroups: groups,
        minKeywordGroups: Math.max(1, Math.ceil(groups.length * 0.5)),
      };
      evaluation = evaluateKeywordAnswer(fakeQ, trimmedInput);
    }
    setFlashcardKeywordEvaluation(evaluation);
    return evaluation;
  };

  // ===================== Spaced Repetition =====================
  const getCardKey = (card, category) => {
    return `${category}_${card.front.substring(0, 30)}`;
  };

  const getCardSpacedData = (card, category) => {
    const key = getCardKey(card, category);
    return spacedRepetitionData[key] || { level: 1, nextReview: Date.now(), reviewCount: 0 };
  };

  const updateCardSpacedData = (card, category, correct) => {
    const key = getCardKey(card, category);
    const current = getCardSpacedData(card, category);

    let newLevel;
    if (correct) {
      newLevel = Math.min(current.level + 1, 6);
    } else {
      newLevel = Math.max(current.level - 1, 1);
    }

    const intervalDays = SPACED_INTERVALS[newLevel];
    const nextReview = Date.now() + (intervalDays * 24 * 60 * 60 * 1000);

    const newData = {
      ...spacedRepetitionData,
      [key]: {
        level: newLevel,
        nextReview,
        reviewCount: current.reviewCount + 1,
        lastReview: Date.now(),
      },
    };

    setSpacedRepetitionData(newData);
    localStorage.setItem('spaced_repetition_data', JSON.stringify(newData));

    // Update daily challenge progress
    getLateDeps().updateChallengeProgress?.('flashcards_reviewed', 1);
    if (correct) {
      getLateDeps().updateChallengeProgress?.('correct_answers', 1);
    }
    getLateDeps().updateWeeklyProgress?.('flashcards', 1);
    void getLateDeps().queueXpAward?.('flashcardLearning', XP_REWARDS.FLASHCARD_REVIEW, { showXpToast: false });

    return newLevel;
  };

  const loadDueCards = (category) => {
    const hardcodedCards = FLASHCARD_CONTENT[category] || [];
    const userCards = userFlashcards.filter(fc => fc.category === category);
    const allCards = [...hardcodedCards, ...userCards];

    const now = Date.now();
    const due = allCards
      .map(card => ({
        ...card,
        spacedData: getCardSpacedData(card, category),
      }))
      .filter(card => card.spacedData.nextReview <= now)
      .sort((a, b) => a.spacedData.level - b.spacedData.level);

    setDueCards(due);
    return due;
  };

  const getDueCardCount = (category) => {
    const hardcodedCards = FLASHCARD_CONTENT[category] || [];
    const userCards = userFlashcards.filter(fc => fc.category === category);
    const allCards = [...hardcodedCards, ...userCards];

    const now = Date.now();
    return allCards.filter(card => getCardSpacedData(card, category).nextReview <= now).length;
  };

  const getTotalDueCards = () => {
    return CATEGORIES.reduce((sum, cat) => sum + getDueCardCount(cat.id), 0);
  };

  const getLevelColor = (level) => LEVEL_COLORS[level] || 'bg-gray-500';
  const getLevelLabel = (level) => LEVEL_LABELS[level] || 'Unbekannt';

  // ===================== Moderation =====================
  const approveFlashcard = async (fcId) => {
    try {
      await dsApproveFlashcard(fcId);
      const fc = pendingFlashcards.find(f => f.id === fcId);
      if (fc) {
        fc.approved = true;
        setPendingFlashcards(pendingFlashcards.filter(f => f.id !== fcId));
        setUserFlashcards([...userFlashcards, fc]);
      }
      playSound('correct');
    } catch (error) {
      console.error('Approve flashcard error:', error);
    }
  };

  const deleteFlashcard = async (fcId) => {
    try {
      await dsDeleteFlashcard(fcId);
      setPendingFlashcards(pendingFlashcards.filter(f => f.id !== fcId));
      setUserFlashcards(userFlashcards.filter(f => f.id !== fcId));
    } catch (error) {
      console.error('Delete flashcard error:', error);
    }
  };

  return {
    // State
    flashcards, setFlashcards,
    currentFlashcard, setCurrentFlashcard,
    flashcardIndex, setFlashcardIndex,
    showFlashcardAnswer, setShowFlashcardAnswer,
    flashcardProgress, setFlashcardProgress,
    userFlashcards, setUserFlashcards,
    pendingFlashcards, setPendingFlashcards,
    newFlashcardFront, setNewFlashcardFront,
    newFlashcardBack, setNewFlashcardBack,
    newFlashcardCategory, setNewFlashcardCategory,
    keywordFlashcardMode, setKeywordFlashcardMode,
    whoAmIFlashcardMode, setWhoAmIFlashcardMode,
    flashcardKeywordInput, setFlashcardKeywordInput,
    flashcardKeywordEvaluation, setFlashcardKeywordEvaluation,
    flashcardFreeTextMode, setFlashcardFreeTextMode,
    spacedRepetitionData, setSpacedRepetitionData,
    spacedRepetitionMode, setSpacedRepetitionMode,
    dueCards, setDueCards,

    // Content (for views that need it)
    FLASHCARD_CONTENT,
    KEYWORD_FLASHCARD_CONTENT,
    WHO_AM_I_FLASHCARD_CONTENT,

    // Actions
    loadFlashcards,
    loadFlashcardsFromBackend,
    evaluateFlashcardKeywordAnswer,
    resetFlashcardKeywordState,
    approveFlashcard,
    deleteFlashcard,

    // Spaced Repetition
    getCardKey,
    getCardSpacedData,
    updateCardSpacedData,
    loadDueCards,
    getDueCardCount,
    getTotalDueCards,
    getLevelColor,
    getLevelLabel,
  };
}
