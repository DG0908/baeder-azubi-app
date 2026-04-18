import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import QuizView from './QuizView';
import { expectNoA11yViolations } from '../../test-utils/a11y';

const mockUser = { name: 'Max Mustermann', email: 'max@test.de', role: 'azubi', permissions: {} };

vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: mockUser }) }));
vi.mock('../../context/AppContext', () => ({
  useApp: () => ({ darkMode: false, playSound: vi.fn() })
}));
vi.mock('../../data/constants', () => ({
  CATEGORIES: [
    { id: 'wasseraufbereitung', label: 'Wasseraufbereitung', icon: '💧' },
    { id: 'baedertechnik', label: 'Bädertechnik', icon: '🏊' }
  ],
  PERMISSIONS: {
    admin: { label: 'Administrator' },
    trainer: { label: 'Ausbilder' },
    azubi: { label: 'Azubi' }
  },
  getAvatarById: () => null
}));
vi.mock('../../data/whoAmIChallenges', () => ({
  getWhoAmIClueCount: () => 3,
  getWhoAmIVisibleClues: () => [],
  WHO_AM_I_TIME_LIMIT: 60
}));
vi.mock('../../lib/utils', () => ({
  formatAnswerLabel: (index) => String.fromCharCode(65 + index)
}));
vi.mock('../ui/AvatarBadge', () => ({
  default: ({ fallback }) => <div data-testid="avatar-badge">{fallback}</div>
}));

const baseProps = {
  selectedDifficulty: 'profi',
  setSelectedDifficulty: vi.fn(),
  allUsers: [
    { name: 'Max Mustermann', email: 'max@test.de', role: 'azubi' },
    { name: 'Anna Schmidt', email: 'anna@test.de', role: 'azubi', company: 'Stadtbad' }
  ],
  allGames: [], activeGames: [],
  challengePlayer: vi.fn(), acceptChallenge: vi.fn(), continueGame: vi.fn(),
  currentGame: null, quizCategory: null, questionInCategory: null, playerTurn: null,
  adaptiveLearningEnabled: false, setAdaptiveLearningEnabled: vi.fn(),
  selectCategory: vi.fn(), waitingForOpponent: false,
  startCategoryAsSecondPlayer: null, currentQuestion: null,
  timeLeft: 30, answered: false, selectedAnswers: [], lastSelectedAnswer: null,
  isKeywordQuestion: () => false, isWhoAmIQuestion: () => false,
  keywordAnswerText: '', setKeywordAnswerText: vi.fn(),
  keywordAnswerEvaluation: null, submitKeywordAnswer: vi.fn(),
  quizMCKeywordMode: false, setQuizMCKeywordMode: vi.fn(),
  answerQuestion: vi.fn(), reportQuestionIssue: vi.fn(),
  confirmMultiSelectAnswer: vi.fn(), proceedToNextRound: vi.fn(),
  userStats: null, duelResult: null, setDuelResult: vi.fn(),
  showDuelResultForGame: vi.fn(), categoryRoundResult: null,
  proceedAfterCategoryResult: vi.fn(), onForfeit: vi.fn()
};

describe('QuizView a11y', () => {
  beforeEach(() => { localStorage.clear(); });

  it('has no serious axe violations on the lobby', async () => {
    const { container } = render(<QuizView {...baseProps} />);
    await expectNoA11yViolations(container);
  });
});
