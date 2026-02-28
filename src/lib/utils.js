const normalizeSpace = (value) => String(value ?? '')
  .replace(/\s+/g, ' ')
  .trim();

const normalizeKey = (value) => normalizeSpace(value).toLowerCase();

const countWords = (value) => {
  const normalized = normalizeSpace(value);
  if (!normalized) return 0;
  return normalized.split(' ').filter(Boolean).length;
};

const stripNoiseTokens = (value) => normalizeSpace(value)
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
  'fuer',
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

const normalizeToken = (value) => normalizeKey(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '');

const trimTrailingStopWords = (value, minWords = 2) => {
  let words = normalizeSpace(value).split(' ').filter(Boolean);
  while (words.length > minWords) {
    const tailToken = normalizeToken(words[words.length - 1]);
    if (!TRAILING_STOP_WORDS.has(tailToken)) break;
    words = words.slice(0, -1);
  }
  return words.join(' ');
};

const truncateWords = (value, maxWords) => {
  const words = normalizeSpace(value).split(' ').filter(Boolean);
  if (words.length <= maxWords) return normalizeSpace(value);
  let shortened = words.slice(0, maxWords).join(' ');
  shortened = trimTrailingStopWords(shortened) || shortened;
  return `${shortened}...`;
};

const buildDisplayAnswers = (question, answers) => {
  if (!Array.isArray(answers) || answers.length === 0) return [];

  const displayAnswers = answers.map((value) => {
    const cleaned = stripNoiseTokens(value) || normalizeSpace(value);
    return countWords(cleaned) > 9 ? truncateWords(cleaned, 9) : cleaned;
  });

  if (question?.multi || !Number.isInteger(question?.correct)) {
    return displayAnswers;
  }

  const correctIndex = question.correct;
  if (correctIndex < 0 || correctIndex >= displayAnswers.length) {
    return displayAnswers;
  }

  const compactLevels = [6, 5, 4, 3];
  for (const level of compactLevels) {
    const correctWords = countWords(displayAnswers[correctIndex]);
    const wrongWords = displayAnswers
      .filter((_, index) => index !== correctIndex)
      .map(countWords);
    const maxWrongWords = wrongWords.length > 0 ? Math.max(...wrongWords) : 0;
    if (correctWords < maxWrongWords + 2) break;
    displayAnswers[correctIndex] = truncateWords(answers[correctIndex], level);
  }

  return displayAnswers;
};

const sanitizeQuestionAnswers = (question) => {
  const originalAnswers = Array.isArray(question?.a)
    ? question.a.map((value) => normalizeSpace(value))
    : [];
  if (originalAnswers.length === 0) return { ...(question || {}), a: [], displayAnswers: [] };

  const cleanedAnswers = originalAnswers.map((value) => {
    const stripped = stripNoiseTokens(value);
    return stripped || value;
  });

  const dedupedAnswers = [];
  const seen = new Set();
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

export const shuffleAnswers = (question) => {
  if (!question || !Array.isArray(question.a) || question.a.length === 0) {
    return { ...(question || {}) };
  }

  const preparedQuestion = sanitizeQuestionAnswers(question);
  const indexedAnswers = preparedQuestion.a.map((text, originalIndex) => ({
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
      preparedQuestion.correct.filter((value) => Number.isInteger(value))
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
    ? preparedQuestion.correct
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

export const formatAnswerLabel = (value) => stripNoiseTokens(value);
