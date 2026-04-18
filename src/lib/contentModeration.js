export const BANNED_WORDS = [
  'porn', 'sex', 'xxx', 'nackt', 'nude',
  'arschloch', 'idiot', 'scheiße', 'fuck', 'shit', 'bastard', 'bitch',
  'nazi', 'hitler', 'rassist', 'hure', 'schwuchtel', 'neger',
  'hurensohn', 'wichser', 'fotze', 'schlampe',
];

export const containsBannedContent = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.some((word) => lowerText.includes(word));
};

export const createContentModerator = ({ toast, playSound }) => (text, context = 'Text') => {
  if (containsBannedContent(text)) {
    toast.error(`${context} enthaelt unangemessene Inhalte und wurde blockiert. Bitte achte auf einen respektvollen Umgang.`);
    playSound('wrong');
    return false;
  }
  return true;
};
