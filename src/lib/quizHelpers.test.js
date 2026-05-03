import { describe, it, expect } from 'vitest';
import {
  buildKeywordTokenVariants,
  evaluateKeywordAnswer,
  matchesKeywordTerm,
  normalizeKeywordText
} from './quizHelpers';

const matchesAnswer = (answer, term) =>
  matchesKeywordTerm(
    normalizeKeywordText(answer),
    buildKeywordTokenVariants(answer),
    term
  );

describe('matchesKeywordTerm', () => {
  it('akzeptiert exakte Treffer', () => {
    expect(matchesAnswer('Umwälzpumpe', 'umwaelzpumpe')).toBe(true);
    expect(matchesAnswer('AED', 'aed')).toBe(true);
  });

  it('akzeptiert Trefer in einem Satz (Substring)', () => {
    expect(matchesAnswer('Das ist eine Umwälzpumpe', 'umwaelzpumpe')).toBe(true);
  });

  it('akzeptiert Stem-Toleranz für lange Antworten', () => {
    expect(matchesAnswer('umwaelzpump', 'umwaelzpumpe')).toBe(true);
    expect(matchesAnswer('umwaelzpumpen', 'umwaelzpumpe')).toBe(true);
  });

  it('lehnt einzelne Buchstaben als Antwort ab (Regression)', () => {
    expect(matchesAnswer('a', 'aed')).toBe(false);
    expect(matchesAnswer('u', 'umwaelzpumpe')).toBe(false);
    expect(matchesAnswer('s', 'stabile seitenlage')).toBe(false);
    expect(matchesAnswer('r', 'rautekgriff')).toBe(false);
  });

  it('lehnt zu kurze Präfixe ab', () => {
    expect(matchesAnswer('umw', 'umwaelzpumpe')).toBe(false);
    expect(matchesAnswer('umwae', 'umwaelzpumpe')).toBe(false);
  });
});

describe('evaluateKeywordAnswer (Was bin ich?)', () => {
  const buildWhoAmI = (answer, terms) => ({
    type: 'whoami',
    minWords: 1,
    minKeywordGroups: 1,
    keywordGroups: [{ label: answer, terms: [answer, ...terms] }]
  });

  it('wertet einzelne Buchstaben nicht als korrekt (Regression)', () => {
    const q = buildWhoAmI('AED', ['aed', 'defibrillator']);
    expect(evaluateKeywordAnswer(q, 'a').isCorrect).toBe(false);
    expect(evaluateKeywordAnswer(q, 'd').isCorrect).toBe(false);
  });

  it('wertet richtige Antworten weiterhin als korrekt', () => {
    const q = buildWhoAmI('AED', ['aed', 'defibrillator']);
    expect(evaluateKeywordAnswer(q, 'AED').isCorrect).toBe(true);
    expect(evaluateKeywordAnswer(q, 'Defibrillator').isCorrect).toBe(true);
  });

  it('akzeptiert deutsche Stems / Endungen bei langen Antworten', () => {
    const q = buildWhoAmI('Umwälzpumpe', ['umwaelzpumpe', 'kreiselpumpe']);
    expect(evaluateKeywordAnswer(q, 'Umwälzpumpen').isCorrect).toBe(true);
    expect(evaluateKeywordAnswer(q, 'Kreiselpumpe').isCorrect).toBe(true);
  });
});
