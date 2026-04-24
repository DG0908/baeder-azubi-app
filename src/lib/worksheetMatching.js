const UMLAUTS = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss', Ä: 'ae', Ö: 'oe', Ü: 'ue' };

export const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[äöüÄÖÜß]/g, (ch) => UMLAUTS[ch] || ch)
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const matchesAny = (input, accept = []) => {
  if (!input) return false;
  const n = normalize(input);
  if (!n) return false;
  return accept.some((candidate) => {
    const c = normalize(candidate);
    if (!c) return false;
    return n === c || n.includes(c) || c.includes(n);
  });
};

export const scoreOpenList = (inputs = [], pool = []) => {
  const used = new Set();
  let correct = 0;
  const perInput = inputs.map((input) => {
    const idx = pool.findIndex((entry, i) => !used.has(i) && matchesAny(input, entry.accept));
    if (idx >= 0) {
      used.add(idx);
      correct += 1;
      return { ok: true, matchedIndex: idx };
    }
    return { ok: false, matchedIndex: -1 };
  });
  return { correct, total: pool.length, perInput };
};

export const scoreKeywordAnswer = (input = '', keywords = [], minMatches = 1) => {
  const n = normalize(input);
  if (!n) return { ok: false, matched: [] };
  const matched = keywords.filter((kw) => n.includes(normalize(kw)));
  return { ok: matched.length >= minMatches, matched };
};
