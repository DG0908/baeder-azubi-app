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
