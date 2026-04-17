interface Question {
  a?: string[];
  correct?: number | number[];
  multi?: boolean;
  [key: string]: unknown;
}

interface ShuffledQuestion extends Question {
  displayAnswers: string[];
}

const normalizeSpace = (value: unknown): string => String(value ?? '')
  .replace(/\s+/g, ' ')
  .trim();

const normalizeKey = (value: unknown): string => normalizeSpace(value).toLowerCase();

const countWords = (value: unknown): number => {
  const normalized = normalizeSpace(value);
  if (!normalized) return 0;
  return normalized.split(' ').filter(Boolean).length;
};

const stripNoiseTokens = (value: unknown): string => normalizeSpace(value)
  // Remove old/generated wrappers and markers.
  .replace(/^option\s*:\s*/i, '')
  .replace(/^antwort\s*:\s*/i, '')
  .replace(/\s*-\s*zur\s+auswahl\s*$/i, '')
  .replace(/\(\s*antwortoption\s*\)/gi, '')
  // Remove optional/hint markers that should not appear in final answer options.
  .replace(/\(\s*optional[^)]*\)/gi, '')
  .replace(/\[\s*optional[^\]]*\]/gi, '')
  .replace(/\boptional\b[:\-]?\s*/gi, '')
  .replace(/\s{2,}/g, ' ')
  .trim();

const TRAILING_STOP_WORDS = new Set([
  'und',
  'oder',
  'für',
  'fur',
  'im',
  'in',
  'am',
  'an',
  'bei',
  'mit',
  'von',
  'zu',
  'zum',
  'zur',
  'des',
  'der',
  'die',
  'das',
  'dem',
  'den',
  'einer',
  'einem',
  'einen'
]);

const normalizeToken = (value: unknown): string => normalizeKey(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '');

const trimTrailingStopWords = (value: string, minWords = 2): string => {
  let words = normalizeSpace(value).split(' ').filter(Boolean);
  while (words.length > minWords) {
    const tailToken = normalizeToken(words[words.length - 1]);
    if (!TRAILING_STOP_WORDS.has(tailToken)) break;
    words = words.slice(0, -1);
  }
  return words.join(' ');
};

const truncateWords = (value: string, maxWords: number): string => {
  const words = normalizeSpace(value).split(' ').filter(Boolean);
  if (words.length <= maxWords) return normalizeSpace(value);
  let shortened = words.slice(0, maxWords).join(' ');
  shortened = trimTrailingStopWords(shortened) || shortened;
  return `${shortened}...`;
};

const buildDisplayAnswers = (question: Question | null | undefined, answers: string[]): string[] => {
  if (!Array.isArray(answers) || answers.length === 0) return [];

  const displayAnswers = answers.map((value) => {
    const cleaned = stripNoiseTokens(value) || normalizeSpace(value);
    return countWords(cleaned) > 9 ? truncateWords(cleaned, 9) : cleaned;
  });

  if (question?.multi || !Number.isInteger(question?.correct)) {
    return displayAnswers;
  }

  const correctIndex = question!.correct as number;
  if (correctIndex < 0 || correctIndex >= displayAnswers.length) {
    return displayAnswers;
  }

  // Equalize answer lengths so no single answer stands out.
  // Find the median word count of wrong answers and cap the correct answer
  // to at most median + 1 words.
  const wrongWordCounts = displayAnswers
    .map((text, idx) => ({ idx, words: countWords(text) }))
    .filter((entry) => entry.idx !== correctIndex)
    .map((entry) => entry.words)
    .sort((a, b) => a - b);

  const correctWords = countWords(displayAnswers[correctIndex]);

  if (wrongWordCounts.length > 0) {
    const medianWrong = wrongWordCounts[Math.floor(wrongWordCounts.length / 2)];
    const maxWrong = wrongWordCounts[wrongWordCounts.length - 1];
    // Target: correct answer should be at most maxWrong + 1 words
    const targetMax = Math.max(maxWrong + 1, medianWrong + 2, 3);

    if (correctWords > targetMax) {
      displayAnswers[correctIndex] = truncateWords(answers[correctIndex], targetMax);
    }
  }

  return displayAnswers;
};

const sanitizeQuestionAnswers = (question: Question | null | undefined): Question & { displayAnswers: string[] } => {
  const originalAnswers = Array.isArray(question?.a)
    ? question!.a.map((value) => normalizeSpace(value))
    : [];
  if (originalAnswers.length === 0) return { ...(question || {}), a: [], displayAnswers: [] };

  const cleanedAnswers = originalAnswers.map((value) => {
    const stripped = stripNoiseTokens(value);
    return stripped || value;
  });

  const dedupedAnswers: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < cleanedAnswers.length; i += 1) {
    const preferred = normalizeSpace(cleanedAnswers[i]);
    const preferredKey = normalizeKey(preferred);
    if (preferred && !seen.has(preferredKey)) {
      dedupedAnswers.push(preferred);
      seen.add(preferredKey);
      continue;
    }

    const fallback = normalizeSpace(originalAnswers[i]);
    const fallbackKey = normalizeKey(fallback);
    if (fallback && !seen.has(fallbackKey)) {
      dedupedAnswers.push(fallback);
      seen.add(fallbackKey);
      continue;
    }

    dedupedAnswers.push(preferred || fallback || `Antwort ${i + 1}`);
  }

  return {
    ...question,
    a: dedupedAnswers,
    displayAnswers: buildDisplayAnswers(question, dedupedAnswers)
  };
};

export const shuffleAnswers = (question: Question | null | undefined): ShuffledQuestion => {
  if (!question || !Array.isArray(question.a) || question.a.length === 0) {
    return { ...(question || {}), displayAnswers: [] };
  }

  const preparedQuestion = sanitizeQuestionAnswers(question);
  const indexedAnswers = preparedQuestion.a!.map((text, originalIndex) => ({
    text,
    displayText: preparedQuestion.displayAnswers?.[originalIndex] ?? text,
    originalIndex
  }));

  // Fisher-Yates shuffle.
  for (let i = indexedAnswers.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedAnswers[i], indexedAnswers[j]] = [indexedAnswers[j], indexedAnswers[i]];
  }

  if (preparedQuestion.multi && Array.isArray(preparedQuestion.correct)) {
    const correctSet = new Set(
      (preparedQuestion.correct as number[]).filter((value) => Number.isInteger(value))
    );
    const newCorrectIndices = indexedAnswers
      .map((entry, newIndex) => (correctSet.has(entry.originalIndex) ? newIndex : -1))
      .filter((value) => value >= 0);

    return {
      ...preparedQuestion,
      a: indexedAnswers.map((entry) => entry.text),
      displayAnswers: indexedAnswers.map((entry) => entry.displayText),
      correct: newCorrectIndices,
      multi: true
    };
  }

  const originalCorrect = Number.isInteger(preparedQuestion.correct)
    ? (preparedQuestion.correct as number)
    : 0;
  const newCorrectIndex = Math.max(
    0,
    indexedAnswers.findIndex((entry) => entry.originalIndex === originalCorrect)
  );

  return {
    ...preparedQuestion,
    a: indexedAnswers.map((entry) => entry.text),
    displayAnswers: indexedAnswers.map((entry) => entry.displayText),
    correct: newCorrectIndex
  };
};

export const formatAnswerLabel = (value: unknown): string => stripNoiseTokens(value);
