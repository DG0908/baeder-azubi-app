import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountStatus, AppRole, DuelStatus } from '@prisma/client';
import { DuelsService } from './duels.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/services/audit-log.service';
import { NotificationsService } from '../notifications/notifications.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockActor = (overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser => ({
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Alice',
  role: AppRole.AZUBI,
  status: AccountStatus.APPROVED,
  organizationId: 'org-1',
  canSignReports: false,
  ...overrides
});

const mockRequest = () => ({ headers: {}, ip: '127.0.0.1' }) as any;

const makeDuel = (overrides: Record<string, unknown> = {}) => ({
  id: 'duel-1',
  organizationId: 'org-1',
  challengerId: 'user-1',
  opponentId: 'user-2',
  status: DuelStatus.ACTIVE,
  questionCount: 20,
  gameState: null,
  expiresAt: new Date(Date.now() + 86400000),
  startedAt: new Date(),
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  reminderSentAt: null,
  winnerUserId: null,
  winnerUser: null,
  challenger: { id: 'user-1', displayName: 'Alice', role: AppRole.AZUBI },
  opponent: { id: 'user-2', displayName: 'Bob', role: AppRole.AZUBI },
  duelQuestions: [],
  answers: [],
  ...overrides
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const createMockPrisma = () => ({
  duel: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    createMany: jest.fn()
  },
  duelQuestion: {
    createMany: jest.fn()
  },
  duelAnswer: {
    findUnique: jest.fn(),
    create: jest.fn()
  },
  user: {
    findFirst: jest.fn()
  },
  question: {
    findMany: jest.fn()
  },
  $transaction: jest.fn((callback: (tx: any) => any) => callback({
    duel: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    },
    duelQuestion: {
      createMany: jest.fn()
    },
    duelAnswer: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }))
});

const createMockConfig = () => ({
  get: jest.fn().mockReturnValue(2880)
});

const createMockAuditLog = () => ({
  writeForUser: jest.fn().mockResolvedValue(undefined)
});

const createMockNotifications = () => ({
  createForUser: jest.fn().mockResolvedValue(undefined),
  createForUsers: jest.fn().mockResolvedValue(undefined)
});

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('DuelsService', () => {
  let service: DuelsService;
  let prisma: ReturnType<typeof createMockPrisma>;
  let config: ReturnType<typeof createMockConfig>;
  let auditLog: ReturnType<typeof createMockAuditLog>;
  let notifications: ReturnType<typeof createMockNotifications>;

  /** Shortcut to call private methods without TS complaining */
  const priv = () => service as any;

  beforeEach(() => {
    prisma = createMockPrisma();
    config = createMockConfig();
    auditLog = createMockAuditLog();
    notifications = createMockNotifications();

    service = new DuelsService(
      prisma as unknown as PrismaService,
      config as unknown as ConfigService,
      auditLog as unknown as AuditLogService,
      notifications as unknown as NotificationsService
    );
  });

  // =========================================================================
  // Pure helper methods (accessed via `as any`)
  // =========================================================================

  describe('asRecord', () => {
    it('returns the input if it is a plain object', () => {
      expect(priv().asRecord({ a: 1 })).toEqual({ a: 1 });
    });
    it('returns {} for non-objects', () => {
      expect(priv().asRecord(null)).toEqual({});
      expect(priv().asRecord(42)).toEqual({});
      expect(priv().asRecord([1, 2])).toEqual({});
      expect(priv().asRecord(undefined)).toEqual({});
    });
  });

  describe('readString', () => {
    it('returns trimmed non-empty strings', () => {
      expect(priv().readString(' hello ')).toBe('hello');
    });
    it('returns null for empty or non-string', () => {
      expect(priv().readString('')).toBeNull();
      expect(priv().readString(null)).toBeNull();
      expect(priv().readString(undefined)).toBeNull();
    });
  });

  describe('readInteger', () => {
    it('returns truncated integer for finite numbers', () => {
      expect(priv().readInteger(3.7)).toBe(3);
      expect(priv().readInteger(-2.1)).toBe(-2);
    });
    it('parses numeric strings', () => {
      expect(priv().readInteger('42')).toBe(42);
    });
    it('returns null for non-numeric input', () => {
      expect(priv().readInteger('abc')).toBeNull();
      expect(priv().readInteger(null)).toBeNull();
      expect(priv().readInteger(NaN)).toBeNull();
      expect(priv().readInteger(Infinity)).toBeNull();
    });
  });

  describe('sanitizeText', () => {
    it('trims and truncates', () => {
      expect(priv().sanitizeText('  hello  ', 3)).toBe('hel');
    });
    it('handles null/undefined gracefully', () => {
      expect(priv().sanitizeText(null, 10)).toBe('');
      expect(priv().sanitizeText(undefined, 10)).toBe('');
    });
  });

  describe('normalizeBoundedInteger', () => {
    it('clamps within bounds', () => {
      expect(priv().normalizeBoundedInteger(100, 0, 10, 0)).toBe(10);
      expect(priv().normalizeBoundedInteger(-5, 0, 10, 0)).toBe(0);
    });
    it('uses fallback when input is not parseable', () => {
      expect(priv().normalizeBoundedInteger('abc', 0, 10, 5)).toBe(5);
    });
  });

  // =========================================================================
  // normalizeKeywordText — German umlaut handling
  // =========================================================================

  describe('normalizeKeywordText', () => {
    it('lowercases and normalizes umlauts', () => {
      expect(priv().normalizeKeywordText('Überprüfung')).toBe('ueberpruefung');
    });
    it('replaces ß with ss', () => {
      expect(priv().normalizeKeywordText('Straße')).toBe('strasse');
    });
    it('strips non-alphanumeric characters', () => {
      expect(priv().normalizeKeywordText('Hallo, Welt!')).toBe('hallo welt');
    });
    it('trims and collapses whitespace', () => {
      expect(priv().normalizeKeywordText('  a   b  ')).toBe('a b');
    });
    it('returns empty string for falsy input', () => {
      expect(priv().normalizeKeywordText(null)).toBe('');
      expect(priv().normalizeKeywordText(undefined)).toBe('');
    });
  });

  // =========================================================================
  // getKeywordWordVariants — stemming variants
  // =========================================================================

  describe('getKeywordWordVariants', () => {
    it('generates stem variants for -en suffix', () => {
      const variants = priv().getKeywordWordVariants('schwimmen');
      expect(variants).toContain('schwimmen');
      expect(variants).toContain('schwimm');
    });
    it('generates variant for -e suffix', () => {
      const variants = priv().getKeywordWordVariants('pumpe');
      expect(variants).toContain('pump');
    });
    it('generates variant for -s suffix', () => {
      const variants = priv().getKeywordWordVariants('pools');
      expect(variants).toContain('pool');
    });
    it('generates umlaut-collapsed variant', () => {
      const variants = priv().getKeywordWordVariants('baeder');
      expect(variants).toContain('bader');
    });
    it('does not stem words shorter than 4 chars', () => {
      const variants = priv().getKeywordWordVariants('bade');
      // 'bade' is 4 chars but stem 'bad' would be 3 chars — below threshold
      expect(variants).not.toContain('bad');
    });
  });

  // =========================================================================
  // evaluateKeywordAnswer
  // =========================================================================

  describe('evaluateKeywordAnswer', () => {
    const questionWith = (groups: any[], minGroups?: number, minWords?: number) => ({
      keywordGroups: groups,
      minKeywordGroups: minGroups,
      minWords: minWords ?? 0
    });

    it('returns isCorrect=false on timeout', () => {
      const result = priv().evaluateKeywordAnswer(
        questionWith([{ label: 'Chlor', terms: ['Chlor'] }]),
        'Chlor',
        true
      );
      expect(result.isCorrect).toBe(false);
      expect(result.awardedPoints).toBe(0);
    });

    it('returns isCorrect=false for empty answer', () => {
      const result = priv().evaluateKeywordAnswer(
        questionWith([{ label: 'Chlor', terms: ['Chlor'] }]),
        '',
        false
      );
      expect(result.isCorrect).toBe(false);
    });

    it('returns isCorrect=false when no keyword groups', () => {
      const result = priv().evaluateKeywordAnswer(
        questionWith([]),
        'some answer',
        false
      );
      expect(result.isCorrect).toBe(false);
    });

    it('awards points for matched groups', () => {
      const question = questionWith([
        { label: 'Chlor', terms: ['Chlor'] },
        { label: 'pH-Wert', terms: ['pH-Wert', 'pH Wert'] }
      ]);
      const result = priv().evaluateKeywordAnswer(question, 'Chlor und pH-Wert sind wichtig', false);
      expect(result.isCorrect).toBe(true);
      expect(result.awardedPoints).toBeGreaterThan(0);
    });

    it('partial match gives points but isCorrect=false when not enough groups matched', () => {
      const question = questionWith([
        { label: 'Chlor', terms: ['Chlor'] },
        { label: 'pH-Wert', terms: ['pH-Wert'] },
        { label: 'Temperatur', terms: ['Temperatur'] }
      ], 3);
      const result = priv().evaluateKeywordAnswer(question, 'Chlor ist wichtig', false);
      expect(result.isCorrect).toBe(false);
      expect(result.awardedPoints).toBeGreaterThanOrEqual(1);
    });

    it('respects minWords requirement', () => {
      const question = questionWith(
        [{ label: 'Chlor', terms: ['Chlor'] }],
        1,
        5
      );
      const result = priv().evaluateKeywordAnswer(question, 'Chlor', false);
      expect(result.isCorrect).toBe(false);
    });

    it('awards bonus points when all groups matched and enough words', () => {
      const question = questionWith(
        [{ label: 'Chlor', terms: ['Chlor'] }],
        1,
        0
      );
      const result = priv().evaluateKeywordAnswer(question, 'Chlor ist ein Desinfektionsmittel', false);
      expect(result.isCorrect).toBe(true);
      // matchedCount (1) + bonus (2) = 3
      expect(result.awardedPoints).toBe(3);
    });
  });

  // =========================================================================
  // revalidateAnswerEntry — server-side answer recomputation
  // =========================================================================

  describe('revalidateAnswerEntry', () => {
    it('validates single-choice correctly', () => {
      const entry = { answerType: 'single', selectedAnswer: 2, timeout: false } as any;
      const question = { correct: 2 };
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(true);
      expect(result.points).toBe(1);
    });

    it('rejects wrong single-choice answer', () => {
      const entry = { answerType: 'single', selectedAnswer: 1, timeout: false } as any;
      const question = { correct: 2 };
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(false);
      expect(result.points).toBe(0);
    });

    it('marks timeout answers as incorrect', () => {
      const entry = { answerType: 'single', selectedAnswer: 2, timeout: true } as any;
      const question = { correct: 2 };
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(false);
    });

    it('validates multi-select correctly', () => {
      const entry = { answerType: 'multi', selectedAnswers: [0, 2], timeout: false } as any;
      const question = { correct: [0, 2] };
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(true);
      expect(result.points).toBe(1);
    });

    it('rejects multi-select with wrong selection', () => {
      const entry = { answerType: 'multi', selectedAnswers: [0, 1], timeout: false } as any;
      const question = { correct: [0, 2] };
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(false);
    });

    it('rejects multi-select with extra selections', () => {
      const entry = { answerType: 'multi', selectedAnswers: [0, 1, 2], timeout: false } as any;
      const question = { correct: [0, 2] };
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(false);
    });

    it('returns false when question has no correct field', () => {
      const entry = { answerType: 'single', selectedAnswer: 0, timeout: false } as any;
      const question = {};
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(false);
      expect(result.points).toBe(0);
    });

    it('delegates to evaluateKeywordAnswer for keyword type', () => {
      const entry = { answerType: 'keyword', keywordText: 'Chlor', timeout: false } as any;
      const question = {
        keywordGroups: [{ label: 'Chlor', terms: ['Chlor'] }],
        minKeywordGroups: 1,
        minWords: 0
      };
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(true);
      expect(result.points).toBeGreaterThan(0);
    });

    it('delegates to evaluateKeywordAnswer for whoami type', () => {
      const entry = { answerType: 'whoami', keywordText: 'Chlor', timeout: false } as any;
      const question = {
        keywordGroups: [{ label: 'Chlor', terms: ['Chlor'] }],
        minKeywordGroups: 1,
        minWords: 0
      };
      const result = priv().revalidateAnswerEntry(entry, question);
      expect(result.correct).toBe(true);
      // whoami awards 1 point for correct, not keyword scoring
      expect(result.points).toBe(1);
    });
  });

  // =========================================================================
  // sumAnswerPoints
  // =========================================================================

  describe('sumAnswerPoints', () => {
    it('sums points from answer objects', () => {
      const answers = [
        { points: 1, correct: true },
        { points: 3, correct: true },
        { points: 0, correct: false }
      ];
      expect(priv().sumAnswerPoints(answers)).toBe(4);
    });

    it('falls back to correct flag when points is absent', () => {
      const answers = [
        { correct: true },
        { correct: false },
        { correct: true }
      ];
      expect(priv().sumAnswerPoints(answers)).toBe(2);
    });

    it('returns 0 for non-array', () => {
      expect(priv().sumAnswerPoints(null)).toBe(0);
      expect(priv().sumAnswerPoints(undefined)).toBe(0);
    });

    it('clamps individual answer points to MAX_DUEL_ANSWER_POINTS', () => {
      const answers = [{ points: 999 }];
      expect(priv().sumAnswerPoints(answers)).toBe(10);
    });

    it('clamps negative points to 0', () => {
      const answers = [{ points: -5 }];
      expect(priv().sumAnswerPoints(answers)).toBe(0);
    });
  });

  // =========================================================================
  // computeCategoryRoundScores
  // =========================================================================

  describe('computeCategoryRoundScores', () => {
    it('sums scores across rounds', () => {
      const rounds = [
        {
          player1Answers: [{ points: 1 }, { points: 1 }],
          player2Answers: [{ points: 0 }, { points: 1 }]
        },
        {
          player1Answers: [{ points: 1 }],
          player2Answers: [{ points: 1 }]
        }
      ];
      const result = priv().computeCategoryRoundScores(rounds);
      expect(result.player1Score).toBe(3);
      expect(result.player2Score).toBe(2);
    });

    it('returns 0/0 for empty rounds', () => {
      const result = priv().computeCategoryRoundScores([]);
      expect(result).toEqual({ player1Score: 0, player2Score: 0 });
    });
  });

  // =========================================================================
  // normalizeAnswerEntry — anti-cheat normalization
  // =========================================================================

  describe('normalizeAnswerEntry', () => {
    it('normalizes a valid answer', () => {
      const result = priv().normalizeAnswerEntry({
        questionIndex: 2,
        correct: true,
        timeout: false,
        points: 1,
        answerType: 'single',
        selectedAnswer: 3,
        selectedAnswers: [1, 2],
        keywordText: 'test'
      });
      expect(result.questionIndex).toBe(2);
      expect(result.answerType).toBe('single');
      expect(result.selectedAnswer).toBe(3);
    });

    it('clamps points for non-keyword answers to max 1', () => {
      const result = priv().normalizeAnswerEntry({
        answerType: 'single',
        points: 5
      });
      expect(result.points).toBe(1);
    });

    it('allows higher points for keyword answers', () => {
      const result = priv().normalizeAnswerEntry({
        answerType: 'keyword',
        points: 5
      });
      expect(result.points).toBe(5);
    });

    it('clamps questionIndex to valid range', () => {
      const result = priv().normalizeAnswerEntry({
        questionIndex: 99
      });
      expect(result.questionIndex).toBe(4); // MAX_DUEL_QUESTIONS_PER_ROUND - 1
    });
  });

  // =========================================================================
  // normalizeClientGameStatus
  // =========================================================================

  describe('normalizeClientGameStatus', () => {
    it('accepts finished', () => {
      expect(priv().normalizeClientGameStatus('finished')).toBe('finished');
    });
    it('accepts waiting', () => {
      expect(priv().normalizeClientGameStatus('waiting')).toBe('waiting');
    });
    it('defaults to active for unknown', () => {
      expect(priv().normalizeClientGameStatus('invalid')).toBe('active');
      expect(priv().normalizeClientGameStatus(null)).toBe('active');
    });
  });

  // =========================================================================
  // normalizeDifficulty
  // =========================================================================

  describe('normalizeDifficulty', () => {
    it('returns valid difficulty', () => {
      expect(priv().normalizeDifficulty('experte')).toBe('experte');
      expect(priv().normalizeDifficulty('anfaenger')).toBe('anfaenger');
    });
    it('defaults to profi for unknown', () => {
      expect(priv().normalizeDifficulty('unknown')).toBe('profi');
      expect(priv().normalizeDifficulty(null)).toBe('profi');
    });
  });

  // =========================================================================
  // isCategoryRoundSetComplete / isRoundComplete
  // =========================================================================

  describe('isCategoryRoundSetComplete', () => {
    const makeRound = (qCount: number, p1Count: number, p2Count: number) => ({
      questions: Array(qCount).fill({ id: 'q' }),
      player1Answers: Array(p1Count).fill({ correct: true }),
      player2Answers: Array(p2Count).fill({ correct: true })
    });

    it('returns true when all 4 rounds are complete', () => {
      const rounds = Array(4).fill(null).map(() => makeRound(5, 5, 5));
      expect(priv().isCategoryRoundSetComplete(rounds)).toBe(true);
    });

    it('returns false with fewer than 4 rounds', () => {
      const rounds = Array(3).fill(null).map(() => makeRound(5, 5, 5));
      expect(priv().isCategoryRoundSetComplete(rounds)).toBe(false);
    });

    it('returns false when a round has incomplete answers', () => {
      const rounds = Array(4).fill(null).map(() => makeRound(5, 5, 5));
      rounds[2] = makeRound(5, 3, 5);
      expect(priv().isCategoryRoundSetComplete(rounds)).toBe(false);
    });
  });

  describe('isRoundComplete', () => {
    it('returns true when both players answered all questions', () => {
      expect(priv().isRoundComplete({
        questions: [1, 2, 3],
        player1Answers: [1, 2, 3],
        player2Answers: [1, 2, 3]
      })).toBe(true);
    });

    it('returns false with empty questions', () => {
      expect(priv().isRoundComplete({
        questions: [],
        player1Answers: [],
        player2Answers: []
      })).toBe(false);
    });
  });

  // =========================================================================
  // getExpectedNextChooserName
  // =========================================================================

  describe('getExpectedNextChooserName', () => {
    const duel = makeDuel();

    it('returns challenger for first round', () => {
      expect(priv().getExpectedNextChooserName(duel, [])).toBe('Alice');
    });

    it('alternates chooser', () => {
      const rounds = [{ chooser: 'Alice' }];
      expect(priv().getExpectedNextChooserName(duel, rounds)).toBe('Bob');
    });

    it('alternates back to challenger', () => {
      const rounds = [{ chooser: 'Alice' }, { chooser: 'Bob' }];
      expect(priv().getExpectedNextChooserName(duel, rounds)).toBe('Alice');
    });

    it('defaults to challenger for unknown chooser', () => {
      const rounds = [{ chooser: 'Unknown' }];
      expect(priv().getExpectedNextChooserName(duel, rounds)).toBe('Alice');
    });
  });

  // =========================================================================
  // resolveWinnerDisplayName
  // =========================================================================

  describe('resolveWinnerDisplayName', () => {
    const duel = makeDuel();

    it('returns challenger name when p1 wins', () => {
      expect(priv().resolveWinnerDisplayName(duel, 10, 5)).toBe('Alice');
    });
    it('returns opponent name when p2 wins', () => {
      expect(priv().resolveWinnerDisplayName(duel, 5, 10)).toBe('Bob');
    });
    it('returns null on draw', () => {
      expect(priv().resolveWinnerDisplayName(duel, 5, 5)).toBeNull();
    });
  });

  // =========================================================================
  // assertValidGameStateTransition
  // =========================================================================

  describe('assertValidGameStateTransition', () => {
    const actor = mockActor();
    const duel = makeDuel() as any;

    it('throws when rounds are removed', () => {
      const prev = { categoryRounds: [{}, {}] };
      const next = { categoryRounds: [{}] };
      expect(() => priv().assertValidGameStateTransition(duel, prev, next, actor))
        .toThrow(BadRequestException);
    });

    it('throws when more than one round added at once', () => {
      const prev = { categoryRounds: [] };
      const next = { categoryRounds: [{}, {}] };
      expect(() => priv().assertValidGameStateTransition(duel, prev, next, actor))
        .toThrow(BadRequestException);
    });

    it('throws when duplicate categoryIds are used', () => {
      const prev = { categoryRounds: [{ categoryId: 'org', questions: [1, 2], player1Answers: [1, 2], player2Answers: [1, 2], categoryName: 'Org', chooser: 'Alice' }] };
      const next = {
        categoryRounds: [
          { categoryId: 'org', questions: [1, 2], player1Answers: [1, 2], player2Answers: [1, 2], categoryName: 'Org', chooser: 'Alice' },
          { categoryId: 'org', player1Answers: [], player2Answers: [], categoryName: 'Org', chooser: 'Bob' }
        ]
      };
      expect(() => priv().assertValidGameStateTransition(duel, prev, next, actor))
        .toThrow('Each duel category may only be used once.');
    });

    it('throws when active duel transitions to waiting', () => {
      const prev = { categoryRounds: [] };
      const next = { categoryRounds: [], status: 'waiting' };
      expect(() => priv().assertValidGameStateTransition(duel, prev, next, actor))
        .toThrow('An active duel cannot transition back to waiting.');
    });

    it('throws when finishing without all rounds complete', () => {
      const prev = { categoryRounds: [] };
      const next = { categoryRounds: [], status: 'finished' };
      expect(() => priv().assertValidGameStateTransition(duel, prev, next, actor))
        .toThrow('Duel can only be finished after all rounds are complete.');
    });

    it('accepts valid no-change transition', () => {
      const state = { categoryRounds: [] };
      expect(() => priv().assertValidGameStateTransition(duel, state, state, actor))
        .not.toThrow();
    });
  });

  // =========================================================================
  // assertAnswersAppendOnly
  // =========================================================================

  describe('assertAnswersAppendOnly', () => {
    it('allows appending new answers', () => {
      const prev = { player1Answers: [{ selectedAnswer: 0 }] };
      const next = { player1Answers: [{ selectedAnswer: 0 }, { selectedAnswer: 1 }] };
      expect(() => priv().assertAnswersAppendOnly(prev, next, 'player1Answers'))
        .not.toThrow();
    });

    it('throws when answers are removed', () => {
      const prev = { player1Answers: [{ selectedAnswer: 0 }, { selectedAnswer: 1 }] };
      const next = { player1Answers: [{ selectedAnswer: 0 }] };
      expect(() => priv().assertAnswersAppendOnly(prev, next, 'player1Answers'))
        .toThrow('Stored duel answers cannot be removed.');
    });

    it('throws when existing answer is changed', () => {
      const prev = { player1Answers: [{ selectedAnswer: 0 }] };
      const next = { player1Answers: [{ selectedAnswer: 3 }] };
      expect(() => priv().assertAnswersAppendOnly(prev, next, 'player1Answers'))
        .toThrow('Stored duel answers cannot be changed retroactively.');
    });
  });

  // =========================================================================
  // assertRoundMetadataUnchanged
  // =========================================================================

  describe('assertRoundMetadataUnchanged', () => {
    it('allows identical metadata', () => {
      const round = { categoryId: 'org', categoryName: 'Org', chooser: 'Alice' };
      expect(() => priv().assertRoundMetadataUnchanged(round, round)).not.toThrow();
    });

    it('throws on categoryId change', () => {
      const prev = { categoryId: 'org', categoryName: 'Org', chooser: 'Alice' };
      const next = { categoryId: 'tech', categoryName: 'Org', chooser: 'Alice' };
      expect(() => priv().assertRoundMetadataUnchanged(prev, next))
        .toThrow('Stored duel round categoryId cannot be changed.');
    });

    it('throws on chooser change', () => {
      const prev = { categoryId: 'org', categoryName: 'Org', chooser: 'Alice' };
      const next = { categoryId: 'org', categoryName: 'Org', chooser: 'Bob' };
      expect(() => priv().assertRoundMetadataUnchanged(prev, next))
        .toThrow('Stored duel round chooser cannot be changed.');
    });
  });

  // =========================================================================
  // normalizeGameState
  // =========================================================================

  describe('normalizeGameState', () => {
    it('produces normalized output with computed scores', () => {
      const duel = makeDuel() as any;
      const input = {
        categoryRounds: [],
        status: 'active',
        difficulty: 'profi',
        currentTurn: 'Alice'
      };
      const result = priv().normalizeGameState(duel, input);
      expect(result.player1Score).toBe(0);
      expect(result.player2Score).toBe(0);
      expect(result.status).toBe('active');
      expect(result.difficulty).toBe('profi');
      expect(result.currentTurn).toBe('Alice');
    });

    it('rejects invalid currentTurn names', () => {
      const duel = makeDuel() as any;
      const result = priv().normalizeGameState(duel, {
        currentTurn: 'Hacker',
        status: 'active'
      });
      // Falls back to challenger name
      expect(result.currentTurn).toBe('Alice');
    });

    it('handles null/undefined input', () => {
      const duel = makeDuel() as any;
      const result = priv().normalizeGameState(duel, null);
      expect(result.player1Score).toBe(0);
      expect(result.status).toBe('active');
    });
  });

  // =========================================================================
  // normalizeCategoryRounds / normalizeCategoryRoundEntry
  // =========================================================================

  describe('normalizeCategoryRounds', () => {
    it('returns empty array for non-array', () => {
      expect(priv().normalizeCategoryRounds(null)).toEqual([]);
      expect(priv().normalizeCategoryRounds(undefined)).toEqual([]);
    });

    it('limits to MAX_DUEL_CATEGORY_ROUNDS', () => {
      const rounds = Array(10).fill({});
      const result = priv().normalizeCategoryRounds(rounds);
      expect(result.length).toBe(4);
    });

    it('normalizes round entries', () => {
      const result = priv().normalizeCategoryRounds([{
        categoryId: 'tech',
        categoryName: 'Bädertechnik',
        chooser: 'Alice',
        questions: [],
        player1Answers: [],
        player2Answers: []
      }]);
      expect(result[0].categoryId).toBe('tech');
      expect(result[0].categoryName).toBe('Bädertechnik');
    });
  });

  // =========================================================================
  // normalizeQuestionEntry
  // =========================================================================

  describe('normalizeQuestionEntry', () => {
    it('normalizes a question with all fields', () => {
      const result = priv().normalizeQuestionEntry({
        id: 'q-1',
        category: 'tech',
        type: 'single',
        prompt: 'Was ist Chlor?',
        q: 'Was ist Chlor?',
        a: ['A', 'B', 'C', 'D'],
        correct: 2,
        keywordGroups: [],
        multi: false,
        clues: [],
        timeLimit: 30,
        minKeywordGroups: 1,
        minWords: 0
      });
      expect(result.id).toBe('q-1');
      expect(result.correct).toBe(2);
      expect(result.timeLimit).toBe(30);
    });

    it('clamps timeLimit to bounds', () => {
      const result = priv().normalizeQuestionEntry({ timeLimit: 1 });
      expect(result.timeLimit).toBe(5);
      const result2 = priv().normalizeQuestionEntry({ timeLimit: 9999 });
      expect(result2.timeLimit).toBe(300);
    });
  });

  // =========================================================================
  // normalizeKeywordGroups / normalizeKeywordGroupRecord
  // =========================================================================

  describe('normalizeKeywordGroups', () => {
    it('handles array-style groups', () => {
      const result = priv().normalizeKeywordGroups([
        ['Chlor', 'Cl2']
      ]);
      expect(result[0].label).toBe('Chlor');
      expect(result[0].terms).toEqual(['Chlor', 'Cl2']);
    });

    it('handles object-style groups', () => {
      const result = priv().normalizeKeywordGroups([
        { label: 'pH', terms: ['pH-Wert', 'pH'] }
      ]);
      expect(result[0].label).toBe('pH');
      expect(result[0].terms).toEqual(['pH-Wert', 'pH']);
    });

    it('returns empty for non-array', () => {
      expect(priv().normalizeKeywordGroups(null)).toEqual([]);
    });
  });

  // =========================================================================
  // matchesKeywordTerm
  // =========================================================================

  describe('matchesKeywordTerm', () => {
    it('matches exact substring', () => {
      const answer = 'chlor ist wichtig';
      const tokens = priv().buildKeywordTokenVariants('chlor ist wichtig');
      expect(priv().matchesKeywordTerm(answer, tokens, 'chlor')).toBe(true);
    });

    it('matches via stem variants', () => {
      const answer = 'die schwimmen im pool';
      const tokens = priv().buildKeywordTokenVariants(answer);
      expect(priv().matchesKeywordTerm(
        priv().normalizeKeywordText(answer),
        tokens,
        'schwimmen'
      )).toBe(true);
    });

    it('returns false for non-matching term', () => {
      const answer = 'das wasser ist kalt';
      const tokens = priv().buildKeywordTokenVariants(answer);
      expect(priv().matchesKeywordTerm(
        priv().normalizeKeywordText(answer),
        tokens,
        'chlor'
      )).toBe(false);
    });
  });

  // =========================================================================
  // mergeAuthoritativeAnswers
  // =========================================================================

  describe('mergeAuthoritativeAnswers', () => {
    it('replaces client answers with authoritative ones up to authoritative length', () => {
      const prev = {
        categoryRounds: [{
          player1Answers: [{ selectedAnswer: 1, questionIndex: 0 }],
          player2Answers: []
        }]
      };
      const next = {
        categoryRounds: [{
          player1Answers: [{ selectedAnswer: 99, questionIndex: 0 }, { selectedAnswer: 2, questionIndex: 1 }],
          player2Answers: []
        }]
      };
      const result = priv().mergeAuthoritativeAnswers(prev, next);
      const round = result.categoryRounds[0] as any;
      // First answer should be authoritative (selectedAnswer: 1), not client (99)
      expect(round.player1Answers[0].selectedAnswer).toBe(1);
      // Second answer is new from client
      expect(round.player1Answers[1].selectedAnswer).toBe(2);
    });

    it('preserves server rounds that client omitted', () => {
      const prev = {
        categoryRounds: [{}, {}, {}]
      };
      const next = {
        categoryRounds: [{}, {}]
      };
      const result = priv().mergeAuthoritativeAnswers(prev, next);
      expect(result.categoryRounds.length).toBe(3);
    });
  });

  // =========================================================================
  // reuseStoredRoundDefinitions
  // =========================================================================

  describe('reuseStoredRoundDefinitions', () => {
    it('preserves server round definitions but uses client answers', () => {
      const prev = {
        categoryRounds: [{
          categoryId: 'org',
          questions: [{ id: 'q1' }],
          player1Answers: [],
          player2Answers: []
        }]
      };
      const next = {
        categoryRounds: [{
          categoryId: 'org',
          questions: [{ id: 'q1-hacked' }],
          player1Answers: [{ selectedAnswer: 0 }],
          player2Answers: []
        }]
      };
      const result = priv().reuseStoredRoundDefinitions(prev, next);
      const round = result.categoryRounds[0] as any;
      // Questions come from server (previous)
      expect(round.questions[0].id).toBe('q1');
      // Answers come from client (next)
      expect(round.player1Answers).toEqual([{ selectedAnswer: 0 }]);
    });

    it('passes through new rounds beyond server count', () => {
      const prev = { categoryRounds: [{}] };
      const next = {
        categoryRounds: [{}, { categoryId: 'new', questions: [{ id: 'new-q' }] }]
      };
      const result = priv().reuseStoredRoundDefinitions(prev, next);
      expect(result.categoryRounds.length).toBe(2);
      expect((result.categoryRounds[1] as any).categoryId).toBe('new');
    });

    it('returns next unchanged when previous has no rounds', () => {
      const prev = { categoryRounds: [] };
      const next = { categoryRounds: [{ categoryId: 'org' }] };
      const result = priv().reuseStoredRoundDefinitions(prev, next);
      expect(result).toBe(next);
    });
  });

  // =========================================================================
  // buildFinalizationUpdate
  // =========================================================================

  describe('buildFinalizationUpdate', () => {
    it('returns challenger as winner when they have more correct answers', () => {
      const duel = makeDuel({
        answers: [
          { userId: 'user-1', isCorrect: true },
          { userId: 'user-1', isCorrect: true },
          { userId: 'user-2', isCorrect: true },
          { userId: 'user-2', isCorrect: false }
        ]
      });
      const result = priv().buildFinalizationUpdate(duel);
      expect(result.winnerUserId).toBe('user-1');
      expect(result.status).toBe(DuelStatus.COMPLETED);
    });

    it('returns opponent as winner when they have more correct answers', () => {
      const duel = makeDuel({
        answers: [
          { userId: 'user-1', isCorrect: false },
          { userId: 'user-2', isCorrect: true }
        ]
      });
      const result = priv().buildFinalizationUpdate(duel);
      expect(result.winnerUserId).toBe('user-2');
    });

    it('returns null winner for draw', () => {
      const duel = makeDuel({
        answers: [
          { userId: 'user-1', isCorrect: true },
          { userId: 'user-2', isCorrect: true }
        ]
      });
      const result = priv().buildFinalizationUpdate(duel);
      expect(result.winnerUserId).toBeNull();
    });
  });

  // =========================================================================
  // shouldSendReminder
  // =========================================================================

  describe('shouldSendReminder', () => {
    it('returns false when no expiresAt', () => {
      const duel = makeDuel({ expiresAt: null }) as any;
      expect(priv().shouldSendReminder(duel, new Date())).toBe(false);
    });

    it('returns true when within reminder window', () => {
      const now = new Date();
      const duel = makeDuel({
        status: DuelStatus.ACTIVE,
        expiresAt: new Date(now.getTime() + 10 * 60 * 1000), // 10 min from now
        createdAt: new Date(now.getTime() - 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 60 * 60 * 1000)
      }) as any;
      expect(priv().shouldSendReminder(duel, now)).toBe(true);
    });
  });

  // =========================================================================
  // getReminderRecipientIds
  // =========================================================================

  describe('getReminderRecipientIds', () => {
    it('returns opponent for pending duels', () => {
      const duel = makeDuel({ status: DuelStatus.PENDING }) as any;
      expect(priv().getReminderRecipientIds(duel)).toEqual(['user-2']);
    });

    it('returns both players if neither finished for active duels', () => {
      const duel = makeDuel({
        status: DuelStatus.ACTIVE,
        answers: []
      }) as any;
      expect(priv().getReminderRecipientIds(duel)).toEqual(['user-1', 'user-2']);
    });

    it('returns empty for completed duels', () => {
      const duel = makeDuel({ status: DuelStatus.COMPLETED }) as any;
      expect(priv().getReminderRecipientIds(duel)).toEqual([]);
    });
  });

  // =========================================================================
  // assertGameStatePayloadSize
  // =========================================================================

  describe('assertGameStatePayloadSize', () => {
    it('accepts small payloads', () => {
      expect(() => priv().assertGameStatePayloadSize({ key: 'val' }))
        .not.toThrow();
    });

    it('throws for oversized payloads', () => {
      const huge = { data: 'x'.repeat(250_000) };
      expect(() => priv().assertGameStatePayloadSize(huge))
        .toThrow('Duel game state payload is too large.');
    });
  });

  // =========================================================================
  // normalizeRequestTimeoutMinutes
  // =========================================================================

  describe('normalizeRequestTimeoutMinutes', () => {
    it('clamps to minimum 15 minutes', () => {
      expect(priv().normalizeRequestTimeoutMinutes(1)).toBe(15);
    });
    it('clamps to maximum 10080 minutes', () => {
      expect(priv().normalizeRequestTimeoutMinutes(99999)).toBe(10080);
    });
    it('uses config default for undefined', () => {
      expect(priv().normalizeRequestTimeoutMinutes(undefined)).toBe(2880);
    });
  });

  // =========================================================================
  // assertDuelParticipant
  // =========================================================================

  describe('assertDuelParticipant', () => {
    it('does not throw for challenger', () => {
      const actor = mockActor({ id: 'user-1' });
      const duel = { challengerId: 'user-1', opponentId: 'user-2' };
      expect(() => priv().assertDuelParticipant(actor, duel)).not.toThrow();
    });

    it('does not throw for opponent', () => {
      const actor = mockActor({ id: 'user-2' });
      const duel = { challengerId: 'user-1', opponentId: 'user-2' };
      expect(() => priv().assertDuelParticipant(actor, duel)).not.toThrow();
    });

    it('throws for non-participant', () => {
      const actor = mockActor({ id: 'user-3' });
      const duel = { challengerId: 'user-1', opponentId: 'user-2' };
      expect(() => priv().assertDuelParticipant(actor, duel)).toThrow(ForbiddenException);
    });
  });

  // =========================================================================
  // redactUnansweredQuestionsForActor
  // =========================================================================

  describe('redactUnansweredQuestionsForActor', () => {
    const duel = makeDuel() as any;

    it('strips correct from unanswered questions', () => {
      const gameState = {
        categoryRounds: [{
          questions: [
            { id: 'q1', correct: 2, type: 'single' },
            { id: 'q2', correct: 1, type: 'single' }
          ],
          player1Answers: [{ questionIndex: 0 }],
          player2Answers: []
        }]
      } as any;
      const result = priv().redactUnansweredQuestionsForActor(gameState, 'user-1', duel);
      const round = result.categoryRounds[0] as any;
      // First question answered by player1 -> not redacted
      expect(round.questions[0].correct).toBe(2);
      // Second question not answered -> redacted
      expect(round.questions[1].correct).toBeUndefined();
    });

    it('preserves keywordGroups for whoami/keyword questions even when unanswered', () => {
      const gameState = {
        categoryRounds: [{
          questions: [
            { id: 'q1', correct: 2, type: 'whoami', keywordGroups: [{ terms: ['Chlor'] }], minKeywordGroups: 1 }
          ],
          player1Answers: [],
          player2Answers: []
        }]
      } as any;
      const result = priv().redactUnansweredQuestionsForActor(gameState, 'user-1', duel);
      const q = (result.categoryRounds[0] as any).questions[0];
      expect(q.correct).toBeUndefined();
      expect(q.keywordGroups).toBeDefined();
      expect(q.minKeywordGroups).toBeDefined();
    });
  });

  // =========================================================================
  // Public API: create
  // =========================================================================

  describe('create', () => {
    it('throws when actor has no organizationId', async () => {
      const actor = mockActor({ organizationId: null });
      await expect(service.create(actor, { opponentId: 'user-2' } as any, mockRequest()))
        .rejects.toThrow(BadRequestException);
    });

    it('throws when challenging yourself', async () => {
      const actor = mockActor();
      await expect(service.create(actor, { opponentId: actor.id } as any, mockRequest()))
        .rejects.toThrow('You cannot duel yourself.');
    });
  });

  // =========================================================================
  // Public API: accept
  // =========================================================================

  describe('accept', () => {
    it('throws NotFoundException when duel does not exist', async () => {
      prisma.duel.findUnique.mockResolvedValue(null);
      const actor = mockActor({ id: 'user-2' });
      await expect(service.accept(actor, 'nonexistent', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when non-opponent tries to accept', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel({ status: DuelStatus.PENDING }));
      const actor = mockActor({ id: 'user-3' });
      await expect(service.accept(actor, 'duel-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws ConflictException when duel is not pending', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel({ status: DuelStatus.ACTIVE }));
      const actor = mockActor({ id: 'user-2' });
      await expect(service.accept(actor, 'duel-1', mockRequest()))
        .rejects.toThrow(ConflictException);
    });
  });

  // =========================================================================
  // Public API: forfeit
  // =========================================================================

  describe('forfeit', () => {
    it('throws NotFoundException when duel not found', async () => {
      prisma.duel.findUnique.mockResolvedValue(null);
      await expect(service.forfeit(mockActor(), 'nonexistent', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for non-participant', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel());
      const actor = mockActor({ id: 'user-3' });
      await expect(service.forfeit(actor, 'duel-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws ConflictException when duel is already completed', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel({ status: DuelStatus.COMPLETED }));
      await expect(service.forfeit(mockActor(), 'duel-1', mockRequest()))
        .rejects.toThrow(ConflictException);
    });

    it('sets winner to opponent when challenger forfeits', async () => {
      const duel = makeDuel({ status: DuelStatus.ACTIVE });
      prisma.duel.findUnique.mockResolvedValue(duel);
      prisma.duel.update.mockResolvedValue({
        ...duel,
        status: DuelStatus.COMPLETED,
        winnerUserId: 'user-2'
      });
      const actor = mockActor({ id: 'user-1' });
      await service.forfeit(actor, 'duel-1', mockRequest());
      expect(prisma.duel.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          winnerUserId: 'user-2',
          status: DuelStatus.COMPLETED
        })
      }));
    });
  });

  // =========================================================================
  // Public API: getOne
  // =========================================================================

  describe('getOne', () => {
    it('throws NotFoundException when duel not found', async () => {
      prisma.duel.findUnique.mockResolvedValue(null);
      prisma.duel.findMany.mockResolvedValue([]);
      await expect(service.getOne(mockActor(), 'nonexistent'))
        .rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for non-participant', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel());
      prisma.duel.findMany.mockResolvedValue([]);
      const actor = mockActor({ id: 'user-3' });
      await expect(service.getOne(actor, 'duel-1'))
        .rejects.toThrow(ForbiddenException);
    });
  });

  // =========================================================================
  // Public API: leaderboard
  // =========================================================================

  describe('leaderboard', () => {
    it('returns empty array when actor has no organizationId', async () => {
      const actor = mockActor({ organizationId: null });
      const result = await service.leaderboard(actor);
      expect(result).toEqual([]);
    });

    it('computes wins/losses/draws correctly', async () => {
      prisma.duel.findMany.mockResolvedValue([
        {
          challengerId: 'user-1',
          opponentId: 'user-2',
          winnerUserId: 'user-1',
          challenger: { id: 'user-1', displayName: 'Alice', role: 'AZUBI' },
          opponent: { id: 'user-2', displayName: 'Bob', role: 'AZUBI' }
        },
        {
          challengerId: 'user-1',
          opponentId: 'user-2',
          winnerUserId: null,
          challenger: { id: 'user-1', displayName: 'Alice', role: 'AZUBI' },
          opponent: { id: 'user-2', displayName: 'Bob', role: 'AZUBI' }
        }
      ]);

      const result = await service.leaderboard(mockActor());
      const alice = result.find((e: any) => e.userId === 'user-1')!;
      const bob = result.find((e: any) => e.userId === 'user-2')!;
      expect(alice.wins).toBe(1);
      expect(alice.draws).toBe(1);
      expect(alice.losses).toBe(0);
      expect(bob.wins).toBe(0);
      expect(bob.losses).toBe(1);
      expect(bob.draws).toBe(1);
    });

    it('sorts by wins desc, draws desc, losses asc', async () => {
      prisma.duel.findMany.mockResolvedValue([
        {
          challengerId: 'user-1', opponentId: 'user-2', winnerUserId: 'user-1',
          challenger: { id: 'user-1', displayName: 'Alice', role: 'AZUBI' },
          opponent: { id: 'user-2', displayName: 'Bob', role: 'AZUBI' }
        },
        {
          challengerId: 'user-1', opponentId: 'user-2', winnerUserId: 'user-1',
          challenger: { id: 'user-1', displayName: 'Alice', role: 'AZUBI' },
          opponent: { id: 'user-2', displayName: 'Bob', role: 'AZUBI' }
        }
      ]);
      const result = await service.leaderboard(mockActor());
      expect(result[0].userId).toBe('user-1');
      expect(result[1].userId).toBe('user-2');
    });
  });

  // =========================================================================
  // Public API: updateGameState
  // =========================================================================

  describe('updateGameState', () => {
    it('throws NotFoundException when duel not found', async () => {
      prisma.duel.findUnique.mockResolvedValue(null);
      await expect(service.updateGameState(mockActor(), 'nonexistent', {} as any))
        .rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for non-participant', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel());
      const actor = mockActor({ id: 'user-3' });
      await expect(service.updateGameState(actor, 'duel-1', {} as any))
        .rejects.toThrow(ForbiddenException);
    });

    it('returns summary without updating when duel is already completed', async () => {
      const duel = makeDuel({ status: DuelStatus.COMPLETED });
      prisma.duel.findUnique.mockResolvedValue(duel);
      const result = await service.updateGameState(mockActor(), 'duel-1', {} as any);
      expect(result.status).toBe(DuelStatus.COMPLETED);
      expect(prisma.duel.update).not.toHaveBeenCalled();
    });

    it('throws when payload is too large', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel());
      const hugeState = { categoryRounds: [], data: 'x'.repeat(250_000) } as any;
      await expect(service.updateGameState(mockActor(), 'duel-1', hugeState))
        .rejects.toThrow('Duel game state payload is too large.');
    });

    it('rejects payloads that add new rounds — they must use POST /duels/:id/rounds', async () => {
      const existing = {
        categoryRound: 0,
        currentTurn: 'Alice',
        status: 'active',
        difficulty: 'profi',
        categoryRounds: [
          { categoryId: 'cat-a', chooser: 'Alice', questions: [], player1Answers: [], player2Answers: [] }
        ]
      };
      prisma.duel.findUnique.mockResolvedValue(makeDuel({ gameState: existing }));
      const payloadWithNewRound = {
        categoryRound: 1,
        currentTurn: 'Bob',
        status: 'active',
        difficulty: 'profi',
        categoryRounds: [
          { categoryId: 'cat-a', chooser: 'Alice' },
          { categoryId: 'cat-b', chooser: 'Bob' }
        ]
      } as any;
      await expect(service.updateGameState(mockActor(), 'duel-1', payloadWithNewRound))
        .rejects.toThrow(BadRequestException);
      expect(prisma.duel.update).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // shuffle (determinism not tested, just shape)
  // =========================================================================

  describe('shuffle', () => {
    it('returns array with same length', () => {
      const result = priv().shuffle([1, 2, 3, 4, 5]);
      expect(result).toHaveLength(5);
    });
    it('contains same elements', () => {
      const result = priv().shuffle([1, 2, 3]);
      expect(result.sort()).toEqual([1, 2, 3]);
    });
    it('does not mutate original', () => {
      const original = [1, 2, 3];
      priv().shuffle(original);
      expect(original).toEqual([1, 2, 3]);
    });
  });

  // =========================================================================
  // mapClientStatusFromDuelStatus
  // =========================================================================

  describe('mapClientStatusFromDuelStatus', () => {
    it('maps PENDING to waiting', () => {
      expect(priv().mapClientStatusFromDuelStatus(DuelStatus.PENDING)).toBe('waiting');
    });
    it('maps COMPLETED to finished', () => {
      expect(priv().mapClientStatusFromDuelStatus(DuelStatus.COMPLETED)).toBe('finished');
    });
    it('maps EXPIRED to finished', () => {
      expect(priv().mapClientStatusFromDuelStatus(DuelStatus.EXPIRED)).toBe('finished');
    });
    it('maps ACTIVE to active', () => {
      expect(priv().mapClientStatusFromDuelStatus(DuelStatus.ACTIVE)).toBe('active');
    });
  });

  // =========================================================================
  // resolveWinnerUserId
  // =========================================================================

  describe('resolveWinnerUserId', () => {
    const duel = makeDuel() as any;

    it('returns challenger id when name matches', () => {
      expect(priv().resolveWinnerUserId(duel, 'Alice')).toBe('user-1');
    });
    it('returns opponent id when name matches', () => {
      expect(priv().resolveWinnerUserId(duel, 'Bob')).toBe('user-2');
    });
    it('returns null for falsy name', () => {
      expect(priv().resolveWinnerUserId(duel, null)).toBeNull();
    });
    it('returns undefined for unknown name', () => {
      expect(priv().resolveWinnerUserId(duel, 'Unknown')).toBeUndefined();
    });
  });

  // =========================================================================
  // normalizeStringArray / normalizeIntegerArray
  // =========================================================================

  describe('normalizeStringArray', () => {
    it('returns empty for non-array', () => {
      expect(priv().normalizeStringArray(null, 5, 100)).toEqual([]);
    });
    it('truncates and filters empty strings', () => {
      const result = priv().normalizeStringArray(['hello', '', '  ', 'world'], 5, 100);
      expect(result).toEqual(['hello', 'world']);
    });
    it('respects maxItems', () => {
      expect(priv().normalizeStringArray(['a', 'b', 'c'], 2, 100)).toHaveLength(2);
    });
    it('truncates text to maxTextLength', () => {
      expect(priv().normalizeStringArray(['abcdef'], 5, 3)).toEqual(['abc']);
    });
  });

  describe('normalizeIntegerArray', () => {
    it('returns empty for non-array', () => {
      expect(priv().normalizeIntegerArray(null, 5, 0, 10)).toEqual([]);
    });
    it('clamps values', () => {
      expect(priv().normalizeIntegerArray([1, 20, -5], 5, 0, 10)).toEqual([1, 10, 0]);
    });
    it('respects maxItems', () => {
      expect(priv().normalizeIntegerArray([1, 2, 3], 2, 0, 10)).toHaveLength(2);
    });
  });

  // =========================================================================
  // normalizeCorrectAnswer
  // =========================================================================

  describe('normalizeCorrectAnswer', () => {
    it('handles single integer', () => {
      expect(priv().normalizeCorrectAnswer(2)).toBe(2);
    });
    it('handles array for multi-select', () => {
      expect(priv().normalizeCorrectAnswer([0, 3])).toEqual([0, 3]);
    });
    it('clamps single value', () => {
      expect(priv().normalizeCorrectAnswer(99)).toBe(7); // MAX_DUEL_OPTIONS_PER_QUESTION - 1
    });
  });

  // =========================================================================
  // normalizeQuestionArray
  // =========================================================================

  describe('normalizeQuestionArray', () => {
    it('returns empty for non-array', () => {
      expect(priv().normalizeQuestionArray(null)).toEqual([]);
    });
    it('limits to MAX_DUEL_QUESTIONS_PER_ROUND', () => {
      const questions = Array(10).fill({ id: 'q' });
      expect(priv().normalizeQuestionArray(questions)).toHaveLength(5);
    });
  });

  // =========================================================================
  // normalizeAnswerArray
  // =========================================================================

  describe('normalizeAnswerArray', () => {
    it('returns empty for non-array', () => {
      expect(priv().normalizeAnswerArray(null)).toEqual([]);
    });
    it('limits to MAX_DUEL_ANSWERS_PER_ROUND', () => {
      const answers = Array(10).fill({});
      expect(priv().normalizeAnswerArray(answers)).toHaveLength(5);
    });
  });

  // =========================================================================
  // isDuelExpired
  // =========================================================================

  describe('isDuelExpired', () => {
    it('returns true when expiresAt is in the past', () => {
      expect(priv().isDuelExpired({ expiresAt: new Date(Date.now() - 1000) })).toBe(true);
    });
    it('returns false when expiresAt is in the future', () => {
      expect(priv().isDuelExpired({ expiresAt: new Date(Date.now() + 60000) })).toBe(false);
    });
    it('returns false when expiresAt is null', () => {
      expect(priv().isDuelExpired({ expiresAt: null })).toBe(false);
    });
  });

  // =========================================================================
  // extractOptions
  // =========================================================================

  describe('extractOptions', () => {
    it('converts array to strings', () => {
      expect(priv().extractOptions([1, 'two', true])).toEqual(['1', 'two', 'true']);
    });
    it('returns empty array for non-array', () => {
      expect(priv().extractOptions(null)).toEqual([]);
    });
  });

  // =========================================================================
  // buildPendingExpiryDate / buildTurnExpiryDate
  // =========================================================================

  describe('buildPendingExpiryDate', () => {
    it('creates a future date', () => {
      const result = priv().buildPendingExpiryDate(60);
      expect(result.getTime()).toBeGreaterThan(Date.now());
    });
  });

  // =========================================================================
  // normalizeCategoryRound
  // =========================================================================

  describe('normalizeCategoryRound', () => {
    it('returns last round index when finished', () => {
      expect(priv().normalizeCategoryRound(0, 4, 'finished')).toBe(3);
    });
    it('uses bounded integer when active', () => {
      expect(priv().normalizeCategoryRound(2, 4, 'active')).toBe(2);
    });
    it('clamps to 0 for out-of-range', () => {
      expect(priv().normalizeCategoryRound(-1, 4, 'active')).toBe(0);
    });
  });

  // =========================================================================
  // normalizeParticipantName
  // =========================================================================

  describe('normalizeParticipantName', () => {
    const duel = makeDuel() as any;

    it('returns name if matches challenger', () => {
      expect(priv().normalizeParticipantName('Alice', duel)).toBe('Alice');
    });
    it('returns name if matches opponent', () => {
      expect(priv().normalizeParticipantName('Bob', duel)).toBe('Bob');
    });
    it('returns null for unknown name', () => {
      expect(priv().normalizeParticipantName('Hacker', duel)).toBeNull();
    });
    it('returns null for falsy input', () => {
      expect(priv().normalizeParticipantName(null, duel)).toBeNull();
    });
  });

  // =========================================================================
  // getFallbackCurrentTurn
  // =========================================================================

  describe('getFallbackCurrentTurn', () => {
    it('returns challenger for PENDING', () => {
      expect(priv().getFallbackCurrentTurn(makeDuel({ status: DuelStatus.PENDING }))).toBe('Alice');
    });
    it('returns challenger for ACTIVE', () => {
      expect(priv().getFallbackCurrentTurn(makeDuel({ status: DuelStatus.ACTIVE }))).toBe('Alice');
    });
    it('returns empty for COMPLETED', () => {
      expect(priv().getFallbackCurrentTurn(makeDuel({ status: DuelStatus.COMPLETED }))).toBe('');
    });
  });

  // =========================================================================
  // isSameJsonValue / isJsonPrefix
  // =========================================================================

  describe('isSameJsonValue', () => {
    it('returns true for equal values', () => {
      expect(priv().isSameJsonValue({ a: 1 }, { a: 1 })).toBe(true);
    });
    it('returns false for different values', () => {
      expect(priv().isSameJsonValue({ a: 1 }, { a: 2 })).toBe(false);
    });
  });

  describe('isJsonPrefix', () => {
    it('returns true when previous is prefix of next', () => {
      expect(priv().isJsonPrefix([1, 2], [1, 2, 3])).toBe(true);
    });
    it('returns false when values differ', () => {
      expect(priv().isJsonPrefix([1, 2], [1, 3])).toBe(false);
    });
    it('returns true for empty previous', () => {
      expect(priv().isJsonPrefix([], [1, 2])).toBe(true);
    });
  });

  // =========================================================================
  // tokenizeKeywordText / buildKeywordTokenVariants
  // =========================================================================

  describe('tokenizeKeywordText', () => {
    it('splits normalized text into tokens', () => {
      expect(priv().tokenizeKeywordText('Chlor und pH-Wert')).toEqual(['chlor', 'und', 'ph', 'wert']);
    });
    it('returns empty for empty input', () => {
      expect(priv().tokenizeKeywordText('')).toEqual([]);
    });
  });

  describe('buildKeywordTokenVariants', () => {
    it('returns a set with variants for each token', () => {
      const variants = priv().buildKeywordTokenVariants('Schwimmen');
      expect(variants).toBeInstanceOf(Set);
      expect(variants.has('schwimmen')).toBe(true);
      expect(variants.has('schwimm')).toBe(true);
    });
  });

  // =========================================================================
  // getKeywordGroupsFromQuestion
  // =========================================================================

  describe('getKeywordGroupsFromQuestion', () => {
    it('normalizes groups and adds normalizedTerms', () => {
      const question = {
        keywordGroups: [
          { label: 'Chlor', terms: ['Chlor', 'Cl2'] }
        ]
      };
      const groups = priv().getKeywordGroupsFromQuestion(question);
      expect(groups).toHaveLength(1);
      expect(groups[0].normalizedTerms).toContain('chlor');
      expect(groups[0].normalizedTerms).toContain('cl2');
    });

    it('filters out groups with no valid terms', () => {
      const question = {
        keywordGroups: [
          { label: 'Empty', terms: ['', '  '] }
        ]
      };
      const groups = priv().getKeywordGroupsFromQuestion(question);
      expect(groups).toHaveLength(0);
    });
  });

  // =========================================================================
  // normalizeKeywordGroupRecord
  // =========================================================================

  describe('normalizeKeywordGroupRecord', () => {
    it('handles string input', () => {
      const result = priv().normalizeKeywordGroupRecord('Chlor');
      expect(result.label).toBe('Chlor');
      expect(result.terms).toEqual(['Chlor']);
    });

    it('handles array input', () => {
      const result = priv().normalizeKeywordGroupRecord(['Chlor', 'Cl2']);
      expect(result.label).toBe('Chlor');
      expect(result.terms).toEqual(['Chlor', 'Cl2']);
    });

    it('handles object input', () => {
      const result = priv().normalizeKeywordGroupRecord({ label: 'pH', terms: ['pH-Wert'] });
      expect(result.label).toBe('pH');
    });

    it('uses name fallback for label', () => {
      const result = priv().normalizeKeywordGroupRecord({ name: 'Temp', terms: ['Temperatur'] });
      expect(result.label).toBe('Temp');
    });
  });

  // =========================================================================
  // computeGameStateScore
  // =========================================================================

  describe('computeGameStateScore', () => {
    it('returns null for empty rounds', () => {
      expect(priv().computeGameStateScore({})).toBeNull();
      expect(priv().computeGameStateScore(null)).toBeNull();
    });

    it('returns scores when rounds exist', () => {
      // computeGameStateScore → normalizeCategoryRounds → normalizeAndValidateAnswerArray
      // which revalidates answers server-side. Use single-choice with correct=0, selectedAnswer=0
      const q = { id: 'q1', category: 'org', type: 'single', prompt: 'T', q: 'T', a: ['A', 'B'], correct: 0, multi: false, keywordGroups: [], clues: [], timeLimit: 30, minKeywordGroups: 1, minWords: 0 };
      const correctAnswer = { questionIndex: 0, correct: true, timeout: false, points: 1, answerType: 'single', selectedAnswer: 0, selectedAnswers: [], keywordText: '' };
      const wrongAnswer = { questionIndex: 0, correct: false, timeout: false, points: 0, answerType: 'single', selectedAnswer: 1, selectedAnswers: [], keywordText: '' };
      const result = priv().computeGameStateScore({
        categoryRounds: [{
          categoryId: 'org', categoryName: 'Org', chooser: 'Alice',
          questions: [q],
          player1Answers: [correctAnswer],
          player2Answers: [wrongAnswer]
        }]
      });
      expect(result!.player1Score).toBe(1);
      expect(result!.player2Score).toBe(0);
    });
  });

  // =========================================================================
  // upsertPersistedAnswer
  // =========================================================================

  describe('upsertPersistedAnswer', () => {
    it('appends new answer', () => {
      const result = priv().upsertPersistedAnswer(
        [],
        { questionIndex: 0, correct: true }
      );
      expect(result).toHaveLength(1);
    });

    it('replaces existing answer at same questionIndex', () => {
      const existing = [{ questionIndex: 0, correct: false }];
      const result = priv().upsertPersistedAnswer(
        existing,
        { questionIndex: 0, correct: true }
      );
      expect(result).toHaveLength(1);
      expect(result[0].correct).toBe(true);
    });

    it('sorts by questionIndex', () => {
      const result = priv().upsertPersistedAnswer(
        [{ questionIndex: 2, correct: true }],
        { questionIndex: 0, correct: true }
      );
      expect(priv().readInteger(priv().asRecord(result[0]).questionIndex)).toBe(0);
      expect(priv().readInteger(priv().asRecord(result[1]).questionIndex)).toBe(2);
    });
  });

  // =========================================================================
  // normalizeAndValidateAnswerArray
  // =========================================================================

  describe('normalizeAndValidateAnswerArray', () => {
    it('returns empty for non-array', () => {
      expect(priv().normalizeAndValidateAnswerArray(null, [])).toEqual([]);
    });

    it('revalidates single-choice answers using question data', () => {
      const answers = [
        { questionIndex: 0, answerType: 'single', selectedAnswer: 1, correct: true, timeout: false }
      ];
      const questions = [
        { correct: 2 }
      ];
      const result = priv().normalizeAndValidateAnswerArray(answers, questions);
      // Client said correct=true but selectedAnswer=1 != correct=2
      expect(result[0].correct).toBe(false);
      expect(result[0].points).toBe(0);
    });

    it('validates keyword answers using evaluateKeywordAnswer', () => {
      const answers = [
        { questionIndex: 0, answerType: 'keyword', keywordText: 'Chlor', correct: false, timeout: false }
      ];
      const questions = [
        { keywordGroups: [{ label: 'Chlor', terms: ['Chlor'] }], minKeywordGroups: 1, minWords: 0 }
      ];
      const result = priv().normalizeAndValidateAnswerArray(answers, questions);
      expect(result[0].correct).toBe(true);
    });
  });

  // =========================================================================
  // assertQuestionsUnchanged
  // =========================================================================

  describe('assertQuestionsUnchanged', () => {
    it('accepts identical questions', () => {
      const round = { questions: [{ id: 'q1', q: 'Test?' }] };
      expect(() => priv().assertQuestionsUnchanged(round, round)).not.toThrow();
    });

    it('throws on question count change', () => {
      const prev = { questions: [{ id: 'q1' }] };
      const next = { questions: [{ id: 'q1' }, { id: 'q2' }] };
      expect(() => priv().assertQuestionsUnchanged(prev, next))
        .toThrow('Stored duel questions cannot be changed after creation.');
    });

    it('throws on question content change (non-redactable field)', () => {
      const prev = { questions: [{ id: 'q1', q: 'Original?' }] };
      const next = { questions: [{ id: 'q1', q: 'Changed!' }] };
      expect(() => priv().assertQuestionsUnchanged(prev, next))
        .toThrow('Stored duel questions cannot be changed after creation.');
    });

    it('ignores redactable fields (correct, keywordGroups, minKeywordGroups)', () => {
      const prev = { questions: [{ id: 'q1', q: 'Test?', correct: 2, keywordGroups: [], minKeywordGroups: 1 }] };
      const next = { questions: [{ id: 'q1', q: 'Test?' }] };
      expect(() => priv().assertQuestionsUnchanged(prev, next)).not.toThrow();
    });
  });

  // =========================================================================
  // assertAnswersUnchangedForOtherParticipant
  // =========================================================================

  describe('assertAnswersUnchangedForOtherParticipant', () => {
    it('accepts identical opponent answers', () => {
      const round = { player2Answers: [{ selectedAnswer: 1 }] };
      expect(() => priv().assertAnswersUnchangedForOtherParticipant(round, round, 'player2Answers'))
        .not.toThrow();
    });

    it('throws when opponent answer count changes', () => {
      const prev = { player2Answers: [{ selectedAnswer: 1 }] };
      const next = { player2Answers: [] };
      expect(() => priv().assertAnswersUnchangedForOtherParticipant(prev, next, 'player2Answers'))
        .toThrow("You cannot modify your opponent's stored duel answers.");
    });

    it('throws when opponent selectedAnswer changes', () => {
      const prev = { player2Answers: [{ selectedAnswer: 1 }] };
      const next = { player2Answers: [{ selectedAnswer: 3 }] };
      expect(() => priv().assertAnswersUnchangedForOtherParticipant(prev, next, 'player2Answers'))
        .toThrow("You cannot modify your opponent's stored duel answers.");
    });
  });

  // =========================================================================
  // readRoundCategoryId
  // =========================================================================

  describe('readRoundCategoryId', () => {
    it('prefers categoryId over category', () => {
      expect(priv().readRoundCategoryId({ categoryId: 'org', category: 'tech' })).toBe('org');
    });
    it('falls back to category', () => {
      expect(priv().readRoundCategoryId({ category: 'tech' })).toBe('tech');
    });
    it('returns null for empty', () => {
      expect(priv().readRoundCategoryId({})).toBeNull();
    });
  });

  // =========================================================================
  // Public API: accept (happy path)
  // =========================================================================

  describe('accept (happy path)', () => {
    it('transitions duel from PENDING to ACTIVE', async () => {
      const duel = makeDuel({ status: DuelStatus.PENDING });
      prisma.duel.findUnique.mockResolvedValue(duel);
      const updatedDuel = { ...duel, status: DuelStatus.ACTIVE, startedAt: new Date() };
      prisma.duel.update.mockResolvedValue(updatedDuel);
      prisma.duel.findMany.mockResolvedValue([]);

      const actor = mockActor({ id: 'user-2', displayName: 'Bob' });
      const result = await service.accept(actor, 'duel-1', mockRequest());

      expect(prisma.duel.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          status: DuelStatus.ACTIVE
        })
      }));
      expect(result.status).toBe(DuelStatus.ACTIVE);
      expect(notifications.createForUser).toHaveBeenCalledWith('user-1', expect.objectContaining({
        title: 'Quizduell angenommen'
      }));
    });
  });

  // =========================================================================
  // Public API: startRound
  // =========================================================================

  describe('startRound', () => {
    const completedRound = {
      categoryId: 'tech',
      categoryName: 'Bädertechnik',
      chooser: 'Alice',
      questions: Array.from({ length: 5 }, (_, i) => ({ id: `q${i}`, q: `Q${i}`, a: ['a', 'b'], correct: 0 })),
      player1Answers: Array.from({ length: 5 }, (_, i) => ({ questionIndex: i, selected: 0, correct: true, durationMs: 1000 })),
      player2Answers: Array.from({ length: 5 }, (_, i) => ({ questionIndex: i, selected: 1, correct: false, durationMs: 1200 }))
    };

    it('wirft NotFoundException für unbekanntes Duell', async () => {
      prisma.duel.findUnique.mockResolvedValue(null);
      await expect(service.startRound(mockActor(), 'nope', { categoryId: 'tech' }))
        .rejects.toThrow(NotFoundException);
    });

    it('wirft ForbiddenException für Nicht-Teilnehmer', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel());
      await expect(service.startRound(mockActor({ id: 'outsider' }), 'duel-1', { categoryId: 'tech' }))
        .rejects.toThrow(ForbiddenException);
    });

    it('wirft ConflictException für nicht-aktive Duelle', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel({ status: DuelStatus.COMPLETED }));
      await expect(service.startRound(mockActor(), 'duel-1', { categoryId: 'tech' }))
        .rejects.toThrow(ConflictException);
    });

    it('wirft BadRequestException bei unbekannter Kategorie', async () => {
      prisma.duel.findUnique.mockResolvedValue(makeDuel({ gameState: { categoryRounds: [] } }));
      await expect(service.startRound(mockActor(), 'duel-1', { categoryId: 'hack' }))
        .rejects.toThrow(/Unbekannte Kategorie/);
    });

    it('wirft BadRequestException wenn falscher Chooser startet', async () => {
      const duel = makeDuel({
        gameState: { categoryRounds: [completedRound] }
      });
      prisma.duel.findUnique.mockResolvedValue(duel);
      await expect(service.startRound(mockActor({ id: 'user-1', displayName: 'Alice' }), 'duel-1', { categoryId: 'swim' }))
        .rejects.toThrow(/Chooser/);
    });

    it('wirft BadRequestException wenn letzte Runde nicht abgeschlossen', async () => {
      const incompleteRound = { ...completedRound, player2Answers: [] };
      const duel = makeDuel({
        gameState: { categoryRounds: [incompleteRound] }
      });
      prisma.duel.findUnique.mockResolvedValue(duel);
      await expect(service.startRound(mockActor({ id: 'user-2', displayName: 'Bob' }), 'duel-1', { categoryId: 'swim' }))
        .rejects.toThrow(/abgeschlossen/);
    });

    it('wirft BadRequestException bei Maximum erreichten Runden', async () => {
      const rounds = ['tech', 'swim', 'first', 'hygiene'].map((cat) => ({
        ...completedRound,
        categoryId: cat
      }));
      const duel = makeDuel({ gameState: { categoryRounds: rounds } });
      prisma.duel.findUnique.mockResolvedValue(duel);
      await expect(service.startRound(mockActor({ id: 'user-1', displayName: 'Alice' }), 'duel-1', { categoryId: 'health' }))
        .rejects.toThrow(/maximale Anzahl/);
    });

    it('wirft BadRequestException bei bereits gespielter Kategorie', async () => {
      const duel = makeDuel({ gameState: { categoryRounds: [completedRound] } });
      prisma.duel.findUnique.mockResolvedValue(duel);
      await expect(service.startRound(mockActor({ id: 'user-2', displayName: 'Bob' }), 'duel-1', { categoryId: 'tech' }))
        .rejects.toThrow(/bereits gespielt/);
    });
  });

  // =========================================================================
  // Public API: listMine
  // =========================================================================

  describe('listMine', () => {
    it('returns mapped duel summaries', async () => {
      const duel = makeDuel();
      // First findMany: reconcile expired duels (none), second: reminder candidates (none), third: actual list
      prisma.duel.findMany
        .mockResolvedValueOnce([])   // expired duels
        .mockResolvedValueOnce([])   // reminder candidates
        .mockResolvedValueOnce([duel]); // actual list

      const result = await service.listMine(mockActor());
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('duel-1');
    });

    it('returns empty array when no duels', async () => {
      prisma.duel.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      const result = await service.listMine(mockActor());
      expect(result).toEqual([]);
    });
  });

  // =========================================================================
  // buildLifecycleScopeWhere
  // =========================================================================

  describe('buildLifecycleScopeWhere', () => {
    it('returns empty object when no participantUserId', () => {
      expect(priv().buildLifecycleScopeWhere()).toEqual({});
    });

    it('returns OR clause with participant', () => {
      const result = priv().buildLifecycleScopeWhere('user-1');
      expect(result.OR).toHaveLength(2);
      expect(result.OR[0]).toEqual({ challengerId: 'user-1' });
      expect(result.OR[1]).toEqual({ opponentId: 'user-1' });
    });
  });

  // =========================================================================
  // getDisplayOpponentNameForReminder
  // =========================================================================

  describe('getDisplayOpponentNameForReminder', () => {
    const duel = makeDuel() as any;
    it('returns opponent name for challenger', () => {
      expect(priv().getDisplayOpponentNameForReminder(duel, 'user-1')).toBe('Bob');
    });
    it('returns challenger name for opponent', () => {
      expect(priv().getDisplayOpponentNameForReminder(duel, 'user-2')).toBe('Alice');
    });
  });
});
