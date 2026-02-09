const countWords = (value) => {
  const normalized = String(value ?? '').trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
};

const ANSWER_DECORATORS = [
  (text) => `Option: ${text}`,
  (text) => `${text} (Antwortoption)`,
  (text) => `${text} - zur Auswahl`
];

const randomDecorator = () => ANSWER_DECORATORS[Math.floor(Math.random() * ANSWER_DECORATORS.length)];

const ensureWrongAnswerLooksLong = (question, answers) => {
  if (question.multi && Array.isArray(question.correct)) {
    const correctSet = new Set(question.correct);
    const wrongIndices = answers
      .map((_, idx) => idx)
      .filter(idx => !correctSet.has(idx));
    if (wrongIndices.length === 0) return answers;

    const hasLongWrong = wrongIndices.some(idx => countWords(answers[idx]) > 1);
    if (!hasLongWrong) {
      const targetIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      answers[targetIndex] = randomDecorator()(answers[targetIndex]);
    }
    return answers;
  }

  if (!Number.isInteger(question.correct)) return answers;
  const wrongIndices = answers
    .map((_, idx) => idx)
    .filter(idx => idx !== question.correct);
  if (wrongIndices.length === 0) return answers;

  const hasLongWrong = wrongIndices.some(idx => countWords(answers[idx]) > 1);
  if (!hasLongWrong) {
    const targetIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    answers[targetIndex] = randomDecorator()(answers[targetIndex]);
  }

  return answers;
};

const randomizeAnswerLengthPattern = (question) => {
  const answers = [...(question?.a || [])];
  if (answers.length < 2) return { ...question, a: answers };

  answers.forEach((answer, idx) => {
    const isSingleCorrect = !question.multi && Number.isInteger(question.correct) && idx === question.correct;
    const decorateChance = isSingleCorrect ? 0.25 : 0.65;
    if (Math.random() < decorateChance) {
      answers[idx] = randomDecorator()(answer);
    }
  });

  ensureWrongAnswerLooksLong(question, answers);

  return { ...question, a: answers };
};

export const shuffleAnswers = (question) => {
  const preparedQuestion = randomizeAnswerLengthPattern(question);
  const answers = [...preparedQuestion.a];

  // Multi-Select: correct ist ein Array von Indizes
  if (preparedQuestion.multi && Array.isArray(preparedQuestion.correct)) {
    const correctAnswers = preparedQuestion.correct.map(idx => answers[idx]);

    // Fisher-Yates shuffle
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    // Finde die neuen Indizes der korrekten Antworten
    const newCorrectIndices = correctAnswers.map(ans => answers.indexOf(ans));

    return { ...preparedQuestion, a: answers, correct: newCorrectIndices, multi: true };
  }

  // Single-Choice: correct ist ein einzelner Index
  const correctAnswer = answers[preparedQuestion.correct];

  // Fisher-Yates shuffle
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  // Finde den neuen Index der korrekten Antwort
  const newCorrectIndex = answers.indexOf(correctAnswer);

  return { ...preparedQuestion, a: answers, correct: newCorrectIndex };
};
