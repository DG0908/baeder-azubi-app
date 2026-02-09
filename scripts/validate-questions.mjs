import { SAMPLE_QUESTIONS } from '../src/data/quizQuestions.js';

const NUMBER_WORDS = {
  ein: 1,
  eine: 1,
  zwei: 2,
  drei: 3,
  vier: 4,
  fuenf: 5,
  funf: 5,
  sechs: 6,
  sieben: 7,
  acht: 8,
  neun: 9,
  zehn: 10,
  elf: 11,
  zwoelf: 12,
  zwolf: 12
};

const normalize = (value) => String(value ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const toWordCount = (value) => normalize(value).split(' ').filter(Boolean).length;

const parseExpectedCount = (questionText) => {
  const normalized = normalize(questionText);
  const match = normalized.match(
    /(welche|welcher|welches|nenne|nennen|zahle|zaehle|liste)[^?]{0,90}\b(\d{1,2}|ein|eine|zwei|drei|vier|fuenf|funf|sechs|sieben|acht|neun|zehn|elf|zwoelf|zwolf)\b[^?]{0,90}(aspekte|punkte|massnahmen|kriterien|kategorien|ursachen|organe|arten|fehler|aufgaben|bestandteile|faktoren)/
  );
  if (!match) return null;

  const token = match[2];
  if (/^\d+$/.test(token)) return Number(token);
  return NUMBER_WORDS[token] || null;
};

const categories = Object.entries(SAMPLE_QUESTIONS || {});
const errors = [];
const warnings = [];
const duplicateQuestionMap = new Map();

for (const [categoryId, questions] of categories) {
  if (!Array.isArray(questions)) {
    errors.push(`[${categoryId}] ist kein gueltiges Fragen-Array.`);
    continue;
  }

  questions.forEach((question, index) => {
    const label = `[${categoryId} #${index + 1}]`;

    if (!question || typeof question !== 'object') {
      errors.push(`${label} Frage ist kein Objekt.`);
      return;
    }

    const questionText = String(question.q ?? '').trim();
    const answers = Array.isArray(question.a) ? question.a : [];
    const isMulti = Boolean(question.multi);
    const expectedCount = parseExpectedCount(questionText);

    if (!questionText) {
      errors.push(`${label} Fragetext fehlt.`);
    }
    if (answers.length < 2) {
      errors.push(`${label} hat zu wenige Antwortoptionen (${answers.length}).`);
    }

    const duplicateAnswerCheck = new Set();
    answers.forEach((answer, answerIndex) => {
      const normalizedAnswer = normalize(answer);
      if (!normalizedAnswer) {
        errors.push(`${label} Antwort ${answerIndex + 1} ist leer.`);
      }
      if (duplicateAnswerCheck.has(normalizedAnswer)) {
        warnings.push(`${label} doppelte Antwortoptionen gefunden.`);
      }
      duplicateAnswerCheck.add(normalizedAnswer);
    });

    const questionKey = normalize(questionText);
    if (questionKey) {
      const duplicateBucket = duplicateQuestionMap.get(questionKey) || [];
      duplicateBucket.push(label);
      duplicateQuestionMap.set(questionKey, duplicateBucket);
    }

    if (isMulti) {
      if (!Array.isArray(question.correct) || question.correct.length === 0) {
        errors.push(`${label} ist Multi-Select, aber correct-Array fehlt oder ist leer.`);
      } else {
        const uniqueCorrect = new Set(question.correct);
        if (uniqueCorrect.size !== question.correct.length) {
          errors.push(`${label} enthält doppelte Indizes in correct.`);
        }
        question.correct.forEach((value) => {
          if (!Number.isInteger(value) || value < 0 || value >= answers.length) {
            errors.push(`${label} enthält ungueltigen correct-Index (${value}).`);
          }
        });
      }

      if (!/\(mehrere richtig\)/i.test(questionText)) {
        warnings.push(`${label} ist Multi-Select ohne Hinweis "(Mehrere richtig)".`);
      }

      if (expectedCount && Array.isArray(question.correct) && question.correct.length !== expectedCount) {
        warnings.push(`${label} nennt ${expectedCount}, markiert aber ${question.correct.length} richtige Antworten.`);
      }
    } else {
      if (!Number.isInteger(question.correct)) {
        errors.push(`${label} ist Single-Choice, aber correct ist kein Index.`);
      } else if (question.correct < 0 || question.correct >= answers.length) {
        errors.push(`${label} hat ungueltigen correct-Index (${question.correct}).`);
      }

      if (/\(mehrere richtig\)/i.test(questionText)) {
        warnings.push(`${label} enthaelt "(Mehrere richtig)", ist aber nicht als Multi-Select markiert.`);
      }

      if (expectedCount && expectedCount > 1) {
        warnings.push(`${label} fragt nach ${expectedCount} Punkten, ist aber Single-Choice.`);
      }
    }

    if (answers.length >= 2) {
      if (isMulti && Array.isArray(question.correct) && question.correct.length > 0) {
        const correctSet = new Set(question.correct);
        const correctWords = answers.filter((_, idx) => correctSet.has(idx)).map(toWordCount);
        const wrongWords = answers.filter((_, idx) => !correctSet.has(idx)).map(toWordCount);
        if (correctWords.length > 0 && wrongWords.length > 0) {
          const avgCorrect = correctWords.reduce((sum, value) => sum + value, 0) / correctWords.length;
          const avgWrong = wrongWords.reduce((sum, value) => sum + value, 0) / wrongWords.length;
          if (avgCorrect >= avgWrong + 2) {
            warnings.push(`${label} moeglicher Laengen-Bias bei Multi-Select-Antworten.`);
          }
        }
      } else if (Number.isInteger(question.correct)) {
        const correctWords = toWordCount(answers[question.correct] || '');
        const wrongWords = answers
          .filter((_, idx) => idx !== question.correct)
          .map(toWordCount);
        const maxWrong = wrongWords.length > 0 ? Math.max(...wrongWords) : 0;
        if (correctWords >= maxWrong + 2) {
          warnings.push(`${label} moeglicher Laengen-Bias bei Single-Choice-Antworten.`);
        }
      }
    }
  });
}

for (const [, labels] of duplicateQuestionMap.entries()) {
  if (labels.length > 1) {
    warnings.push(`Doppelter Fragetext gefunden: ${labels.join(', ')}`);
  }
}

const totalQuestions = categories.reduce((sum, [, questions]) => {
  return sum + (Array.isArray(questions) ? questions.length : 0);
}, 0);

console.log(`Fragen geprueft: ${totalQuestions}`);
console.log(`Fehler: ${errors.length}`);
console.log(`Warnungen: ${warnings.length}`);

if (errors.length > 0) {
  console.log('\nStrukturelle Fehler:');
  errors.forEach((entry) => console.log(`- ${entry}`));
}

if (warnings.length > 0) {
  console.log('\nHinweise:');
  const maxPreview = 120;
  warnings.slice(0, maxPreview).forEach((entry) => console.log(`- ${entry}`));
  if (warnings.length > maxPreview) {
    console.log(`- ... und ${warnings.length - maxPreview} weitere Hinweise`);
  }
}

if (errors.length > 0) {
  process.exitCode = 1;
}
