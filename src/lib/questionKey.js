export const normalizeQuestionText = (value) => String(value ?? '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ');

export const getQuestionPerformanceKey = (question, categoryHint = null) => {
  const categoryId = String(categoryHint || question?.category || 'unknown').trim() || 'unknown';
  const normalizedText = normalizeQuestionText(question?.q || '');
  return `${categoryId}::${normalizedText}`;
};
