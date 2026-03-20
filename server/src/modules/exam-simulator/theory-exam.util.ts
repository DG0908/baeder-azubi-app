import { THEORY_QUESTION_BANK } from './theory-question-bank.generated';

type TheoryBankQuestion = {
  q: string;
  a: string[];
  correct: number | number[];
  multi?: boolean;
  explanation?: string | null;
};

export type TheorySessionQuestion = {
  id: string;
  category: string;
  q: string;
  a: string[];
  correct: number | number[];
  multi: boolean;
  explanation: string | null;
};

export type TheoryExamAnswerInput = {
  questionId: string;
  selectedAnswerIndex?: number;
  selectedAnswerIndices?: number[];
  keywordText?: string;
};

const THEORY_QUESTION_COUNT = 30;
const GERMAN_STOPWORDS = new Set([
  'aber', 'alle', 'allem', 'allen', 'aller', 'alles', 'also', 'auch', 'auf', 'auss',
  'aus', 'ausserdem', 'bei', 'beim', 'bereits', 'dann', 'dabei', 'dadurch', 'damit',
  'darf', 'dass', 'dem', 'den', 'denen', 'denn', 'der', 'des', 'deshalb', 'dessen',
  'dies', 'diese', 'diesem', 'diesen', 'dieser', 'dieses', 'doch', 'dort', 'durch',
  'eine', 'einem', 'einen', 'einer', 'eines', 'erst', 'etwas', 'falls', 'fuer',
  'fur', 'gegen', 'gibt', 'haben', 'hatte', 'hatten', 'hier', 'ihnen', 'ihre', 'ihrem',
  'ihren', 'ihrer', 'ihres', 'immer', 'innen', 'jede', 'jedem', 'jeden', 'jeder',
  'jedes', 'jetzt', 'jedoch', 'kann', 'kein', 'keine', 'keinem', 'keinen', 'keiner',
  'keines', 'muss', 'mussen', 'nach', 'nicht', 'noch', 'obwohl', 'ohne', 'oder',
  'oben', 'sein', 'seine', 'seinem', 'seinen', 'seiner', 'seines', 'sehr', 'sich',
  'sind', 'sodass', 'soll', 'sollen', 'sollte', 'sowie', 'sonst', 'uber', 'mehr',
  'viel', 'viele', 'vielen', 'von', 'vor', 'war', 'waren', 'weil', 'wenn', 'werden',
  'wird', 'wobei', 'wodurch', 'wurde', 'wurden', 'wieder', 'zwischen', 'zwar',
  'euro', 'unten', 'aussen', 'schon'
]);

function normalizeTheoryBankQuestion(category: string, rawQuestion: unknown): (TheoryBankQuestion & { category: string }) | null {
  if (!rawQuestion || typeof rawQuestion !== 'object') {
    return null;
  }

  const candidate = rawQuestion as Record<string, unknown>;
  const answers = Array.isArray(candidate.a)
    ? candidate.a.map((answer) => String(answer ?? '').trim()).filter(Boolean)
    : [];
  if (answers.length < 2) {
    return null;
  }

  const prompt = String(candidate.q ?? '').trim();
  if (!prompt) {
    return null;
  }

  const isMulti = Boolean(candidate.multi) || Array.isArray(candidate.correct);
  const explanation = candidate.explanation ? String(candidate.explanation) : null;

  if (isMulti) {
    const correct = Array.isArray(candidate.correct)
      ? [...new Set(candidate.correct.map((index) => Number(index)).filter((index) => Number.isInteger(index) && index >= 0 && index < answers.length))]
      : [];
    if (correct.length === 0) {
      return null;
    }

    return {
      category,
      q: prompt,
      a: answers,
      correct: correct.sort((left, right) => left - right),
      multi: true,
      explanation
    };
  }

  const correct = Number(candidate.correct);
  if (!Number.isInteger(correct) || correct < 0 || correct >= answers.length) {
    return null;
  }

  return {
    category,
    q: prompt,
    a: answers,
    correct,
    multi: false,
    explanation
  };
}

function shuffle<T>(values: T[]): T[] {
  const clone = [...values];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function shuffleQuestionAnswers(
  question: TheoryBankQuestion & { category: string },
  index: number
): TheorySessionQuestion {
  const indexedAnswers = shuffle(
    question.a.map((answer, answerIndex) => ({
      answer,
      answerIndex
    }))
  );

  if (question.multi) {
    const correctSource = new Set(Array.isArray(question.correct) ? question.correct : []);
    const correct = indexedAnswers
      .map((entry, shuffledIndex) => (correctSource.has(entry.answerIndex) ? shuffledIndex : -1))
      .filter((value) => value >= 0);

    return {
      id: `theory_${index + 1}`,
      category: question.category,
      q: question.q,
      a: indexedAnswers.map((entry) => entry.answer),
      correct,
      multi: true,
      explanation: question.explanation ?? null
    };
  }

  const correct = indexedAnswers.findIndex((entry) => entry.answerIndex === question.correct);
  return {
    id: `theory_${index + 1}`,
    category: question.category,
    q: question.q,
    a: indexedAnswers.map((entry) => entry.answer),
    correct: Math.max(0, correct),
    multi: false,
    explanation: question.explanation ?? null
  };
}

export function buildTheoryExamQuestions(count = THEORY_QUESTION_COUNT): TheorySessionQuestion[] {
  const bank = Object.entries(THEORY_QUESTION_BANK).flatMap(([categoryId, questions]) => {
    const safeQuestions = Array.isArray(questions)
      ? Array.from(questions as readonly unknown[])
      : [];
    return safeQuestions
      .map((question) => normalizeTheoryBankQuestion(categoryId, question))
      .filter((question): question is TheoryBankQuestion & { category: string } => Boolean(question));
  });

  const maxCount = Math.min(Math.max(1, count), bank.length);
  return shuffle(bank)
    .slice(0, maxCount)
    .map((question, index) => shuffleQuestionAnswers(question, index));
}

export function parseTheorySessionQuestions(rawValue: unknown): TheorySessionQuestion[] {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  const parsed = rawValue
    .map((question) => {
      if (!question || typeof question !== 'object') {
        return null;
      }

      const candidate = question as Record<string, unknown>;
      const answers = Array.isArray(candidate.a)
        ? candidate.a.map((answer) => String(answer ?? '').trim()).filter(Boolean)
        : [];
      if (answers.length < 2) {
        return null;
      }

      const prompt = String(candidate.q ?? '').trim();
      const id = String(candidate.id ?? '').trim();
      const category = String(candidate.category ?? '').trim();
      if (!id || !prompt || !category) {
        return null;
      }

      const multi = Boolean(candidate.multi) || Array.isArray(candidate.correct);
      const explanation = candidate.explanation ? String(candidate.explanation) : null;

      if (multi) {
        const correct = Array.isArray(candidate.correct)
          ? [...new Set(candidate.correct.map((index) => Number(index)).filter((index) => Number.isInteger(index) && index >= 0 && index < answers.length))]
          : [];
        if (correct.length === 0) {
          return null;
        }

        return {
          id,
          category,
          q: prompt,
          a: answers,
          correct: correct.sort((left, right) => left - right),
          multi: true,
          explanation
        };
      }

      const correct = Number(candidate.correct);
      if (!Number.isInteger(correct) || correct < 0 || correct >= answers.length) {
        return null;
      }

      return {
        id,
        category,
        q: prompt,
        a: answers,
        correct,
        multi: false,
        explanation
      };
    });

  return parsed.filter(Boolean) as TheorySessionQuestion[];
}

function normalizeKeywordText(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getWordVariants(normalizedWord: string): string[] {
  const variants = [normalizedWord];
  const addVariant = (candidate: string) => {
    if (candidate && !variants.includes(candidate)) {
      variants.push(candidate);
    }
  };

  addVariant(
    normalizedWord
      .replace(/ae/g, 'a')
      .replace(/oe/g, 'o')
      .replace(/ue/g, 'u')
  );

  if (normalizedWord.endsWith('en') && normalizedWord.length - 2 >= 4) {
    const stem = normalizedWord.slice(0, -2);
    addVariant(stem);
    if (stem.endsWith('e') && stem.length - 1 >= 4) {
      addVariant(stem.slice(0, -1));
    }
  } else if (normalizedWord.endsWith('e') && normalizedWord.length - 1 >= 4) {
    addVariant(normalizedWord.slice(0, -1));
  } else if (normalizedWord.endsWith('s') && normalizedWord.length - 1 >= 4) {
    addVariant(normalizedWord.slice(0, -1));
  }

  return variants;
}

function tokenizeKeywordText(value: unknown): string[] {
  return normalizeKeywordText(value)
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildKeywordTokenVariants(value: unknown): Set<string> {
  const variants = new Set<string>();
  tokenizeKeywordText(value).forEach((token) => {
    getWordVariants(token).forEach((variant) => {
      if (variant) {
        variants.add(variant);
      }
    });
  });
  return variants;
}

function matchesKeywordTerm(normalizedAnswer: string, answerVariantTokens: Set<string>, term: string): boolean {
  const normalizedTerm = normalizeKeywordText(term);
  if (!normalizedTerm) {
    return false;
  }
  if (normalizedAnswer.includes(normalizedTerm)) {
    return true;
  }

  const termTokens = tokenizeKeywordText(normalizedTerm);
  if (termTokens.length === 0) {
    return false;
  }

  return termTokens.every((token) => {
    const tokenVariants = getWordVariants(token);
    return tokenVariants.some((variant) => {
      if (!variant) {
        return false;
      }
      if (answerVariantTokens.has(variant)) {
        return true;
      }
      return Array.from(answerVariantTokens).some((answerToken) => (
        answerToken.startsWith(variant) || variant.startsWith(answerToken)
      ));
    });
  });
}

function autoExtractKeywordGroups(answerText: string) {
  const normalized = normalizeKeywordText(answerText);
  const words = normalized.split(/\s+/).filter(Boolean);
  const seen = new Set<string>();
  const groups: Array<{ label: string; terms: string[] }> = [];

  for (const word of words) {
    if (word.length < 4 || GERMAN_STOPWORDS.has(word) || seen.has(word)) {
      continue;
    }

    seen.add(word);
    const variants = getWordVariants(word);
    const stem = variants[variants.length - 1];
    groups.push({
      label: stem.charAt(0).toUpperCase() + stem.slice(1),
      terms: variants
    });
  }

  return groups;
}

function evaluateKeywordAnswer(expectedAnswerText: string, submittedText: string): boolean {
  const groups = autoExtractKeywordGroups(expectedAnswerText);
  const normalizedAnswer = normalizeKeywordText(submittedText);
  if (!normalizedAnswer) {
    return false;
  }

  const requiredGroups = Math.max(1, Math.ceil(groups.length * 0.5));
  const answerVariantTokens = buildKeywordTokenVariants(submittedText);
  const matchedCount = groups.filter((group) =>
    group.terms.some((term) => matchesKeywordTerm(normalizedAnswer, answerVariantTokens, term))
  ).length;

  return matchedCount >= requiredGroups;
}

function isMultiQuestion(question: TheorySessionQuestion): question is TheorySessionQuestion & { correct: number[] } {
  return question.multi && Array.isArray(question.correct);
}

export function evaluateTheoryExamSubmission(
  questions: TheorySessionQuestion[],
  answers: TheoryExamAnswerInput[],
  keywordMode: boolean
) {
  const answerMap = new Map<string, TheoryExamAnswerInput>();
  answers.forEach((answer) => {
    if (answer?.questionId) {
      answerMap.set(answer.questionId, answer);
    }
  });

  let correctCount = 0;

  questions.forEach((question) => {
    const answer = answerMap.get(question.id);
    let isCorrect = false;

    if (keywordMode) {
      const expectedText = isMultiQuestion(question)
        ? question.correct.map((index) => String(question.a[index] ?? '')).join('. ')
        : String(question.a[Number(question.correct)] ?? '');
      isCorrect = evaluateKeywordAnswer(expectedText, String(answer?.keywordText ?? ''));
    } else if (isMultiQuestion(question)) {
      const expected = new Set(question.correct);
      const selected = new Set(
        Array.isArray(answer?.selectedAnswerIndices)
          ? answer!.selectedAnswerIndices.filter((value) => Number.isInteger(value) && value >= 0)
          : []
      );
      isCorrect = selected.size === expected.size
        && Array.from(selected).every((value) => expected.has(value));
    } else {
      isCorrect = Number(answer?.selectedAnswerIndex) === Number(question.correct);
    }

    if (isCorrect) {
      correctCount += 1;
    }
  });

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return {
    correctCount,
    total,
    percentage,
    passed: percentage >= 50
  };
}
