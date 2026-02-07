export const shuffleAnswers = (question) => {
  const answers = [...question.a];

  // Multi-Select: correct ist ein Array von Indizes
  if (question.multi && Array.isArray(question.correct)) {
    const correctAnswers = question.correct.map(idx => answers[idx]);

    // Fisher-Yates shuffle
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    // Finde die neuen Indizes der korrekten Antworten
    const newCorrectIndices = correctAnswers.map(ans => answers.indexOf(ans));

    return { ...question, a: answers, correct: newCorrectIndices, multi: true };
  }

  // Single-Choice: correct ist ein einzelner Index
  const correctAnswer = answers[question.correct];

  // Fisher-Yates shuffle
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  // Finde den neuen Index der korrekten Antwort
  const newCorrectIndex = answers.indexOf(correctAnswer);

  return { ...question, a: answers, correct: newCorrectIndex };
};
