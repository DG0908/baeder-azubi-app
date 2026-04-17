import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuizView from './QuizView';

// ── Mocks ────────────────────────────────────────────────

const mockUser = {
  name: 'Max Mustermann',
  email: 'max@test.de',
  role: 'azubi',
  permissions: {}
};

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser })
}));

vi.mock('../../context/AppContext', () => ({
  useApp: () => ({
    darkMode: false,
    playSound: vi.fn()
  })
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

// ── Default Props ────────────────────────────────────────

const defaultProps = {
  selectedDifficulty: 'profi',
  setSelectedDifficulty: vi.fn(),
  allUsers: [
    { name: 'Max Mustermann', email: 'max@test.de', role: 'azubi' },
    { name: 'Anna Schmidt', email: 'anna@test.de', role: 'azubi', company: 'Stadtbad' }
  ],
  allGames: [],
  activeGames: [],
  challengePlayer: vi.fn(),
  acceptChallenge: vi.fn(),
  continueGame: vi.fn(),
  currentGame: null,
  quizCategory: null,
  questionInCategory: null,
  playerTurn: null,
  adaptiveLearningEnabled: false,
  setAdaptiveLearningEnabled: vi.fn(),
  selectCategory: vi.fn(),
  waitingForOpponent: false,
  startCategoryAsSecondPlayer: null,
  currentQuestion: null,
  timeLeft: 30,
  answered: false,
  selectedAnswers: [],
  lastSelectedAnswer: null,
  isKeywordQuestion: () => false,
  isWhoAmIQuestion: () => false,
  keywordAnswerText: '',
  setKeywordAnswerText: vi.fn(),
  keywordAnswerEvaluation: null,
  submitKeywordAnswer: vi.fn(),
  quizMCKeywordMode: false,
  setQuizMCKeywordMode: vi.fn(),
  answerQuestion: vi.fn(),
  reportQuestionIssue: vi.fn(),
  confirmMultiSelectAnswer: vi.fn(),
  proceedToNextRound: vi.fn(),
  userStats: null,
  duelResult: null,
  setDuelResult: vi.fn(),
  showDuelResultForGame: vi.fn(),
  categoryRoundResult: null,
  proceedAfterCategoryResult: vi.fn(),
  onForfeit: vi.fn()
};

// ── Tests ────────────────────────────────────────────────

describe('QuizView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Lobby (no currentGame)', () => {
    it('renders lobby title', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText('Quizduell')).toBeInTheDocument();
    });

    it('renders difficulty selection buttons', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText('Anfaenger')).toBeInTheDocument();
      expect(screen.getByText('Profi')).toBeInTheDocument();
      expect(screen.getByText('Experte')).toBeInTheDocument();
      expect(screen.getByText('Extra schwer')).toBeInTheDocument();
    });

    it('renders game rules section', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText(/Spielregeln/)).toBeInTheDocument();
    });

    it('renders opponent players (not self)', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText('Anna')).toBeInTheDocument();
    });

    it('renders player role and company', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText(/Azubi.*Stadtbad/)).toBeInTheDocument();
    });

    it('renders Herausfordern button for opponent', () => {
      render(<QuizView {...defaultProps} />);
      const buttons = screen.getAllByText('Herausfordern');
      expect(buttons.length).toBe(1);
    });

    it('calls setSelectedDifficulty when difficulty clicked', () => {
      render(<QuizView {...defaultProps} />);
      fireEvent.click(screen.getByText('Anfaenger'));
      expect(defaultProps.setSelectedDifficulty).toHaveBeenCalledWith('anfaenger');
    });

    it('renders challenge timeout selector', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText(/Timer für Herausforderung/)).toBeInTheDocument();
    });

    it('shows "Noch nicht gespielt" when no vs-stats exist', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText(/Noch nicht gespielt/)).toBeInTheDocument();
    });

    it('shows winrate when vs-stats exist', () => {
      const propsWithStats = {
        ...defaultProps,
        userStats: {
          opponents: {
            'Anna Schmidt': { wins: 3, losses: 1, draws: 0 }
          }
        }
      };
      render(<QuizView {...propsWithStats} />);
      expect(screen.getByText(/75% W\/R/)).toBeInTheDocument();
    });

    it('shows Annehmen for incoming challenges', () => {
      const propsWithChallenge = {
        ...defaultProps,
        activeGames: [{
          id: 'game-1',
          status: 'waiting',
          player1: 'Anna Schmidt',
          player2: 'Max Mustermann',
          createdAt: new Date().toISOString(),
          challengeTimeoutMinutes: 1440
        }]
      };
      render(<QuizView {...propsWithChallenge} />);
      expect(screen.getByText('Annehmen')).toBeInTheDocument();
    });

    it('renders Spieler herausfordern section', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText('Spieler herausfordern')).toBeInTheDocument();
    });

    it('renders difficulty time descriptions', () => {
      render(<QuizView {...defaultProps} />);
      expect(screen.getByText('45 Sekunden')).toBeInTheDocument();
      expect(screen.getByText('30 Sekunden')).toBeInTheDocument();
      expect(screen.getByText('15 Sekunden')).toBeInTheDocument();
      expect(screen.getByText('75 Sekunden')).toBeInTheDocument();
    });
  });

  describe('Duel result screen', () => {
    const winResult = {
      gameId: 'game-1',
      myName: 'Max Mustermann',
      opponentName: 'Anna Schmidt',
      player1: 'Max Mustermann',
      player1Score: 8,
      player2Score: 5,
      winner: 'Max Mustermann',
      h2h: { wins: 3, losses: 1, draws: 0 }
    };

    it('renders win screen', () => {
      render(<QuizView {...defaultProps} duelResult={winResult} />);
      expect(screen.getByText('Sieg!')).toBeInTheDocument();
      expect(screen.getByText('Du hast das Becken gerockt!')).toBeInTheDocument();
    });

    it('shows scores correctly', () => {
      render(<QuizView {...defaultProps} duelResult={winResult} />);
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders draw screen', () => {
      const drawResult = {
        ...winResult,
        player1Score: 6,
        player2Score: 6,
        winner: null
      };
      render(<QuizView {...defaultProps} duelResult={drawResult} />);
      expect(screen.getByText('Unentschieden!')).toBeInTheDocument();
    });

    it('renders loss screen', () => {
      const lossResult = {
        ...winResult,
        player1Score: 3,
        player2Score: 7,
        winner: 'Anna Schmidt'
      };
      render(<QuizView {...defaultProps} duelResult={lossResult} />);
      expect(screen.getByText('Knapp daneben!')).toBeInTheDocument();
    });

    it('shows head-to-head section with Bilanz', () => {
      render(<QuizView {...defaultProps} duelResult={winResult} />);
      expect(screen.getByText(/Bilanz gegen/)).toBeInTheDocument();
      expect(screen.getByText('Siege')).toBeInTheDocument();
    });

    it('shows Zurück zum Quizduell button', () => {
      render(<QuizView {...defaultProps} duelResult={winResult} />);
      expect(screen.getByText(/Zurück zum Quizduell/)).toBeInTheDocument();
    });

    it('calls setDuelResult(null) on back button click', () => {
      render(<QuizView {...defaultProps} duelResult={winResult} />);
      fireEvent.click(screen.getByText(/Zurück zum Quizduell/));
      expect(defaultProps.setDuelResult).toHaveBeenCalledWith(null);
    });

    it('shows Revanche button', () => {
      render(<QuizView {...defaultProps} duelResult={winResult} />);
      expect(screen.getByText(/Revanche/)).toBeInTheDocument();
    });
  });

  describe('Category round result', () => {
    const currentGame = {
      id: 'game-1',
      player1: 'Max Mustermann',
      player2: 'Anna Schmidt',
      status: 'active',
      difficulty: 'profi',
      categoryRounds: [],
      categoryRound: 0
    };

    const roundResult = {
      myName: 'Max Mustermann',
      opponentName: 'Anna Schmidt',
      player1Name: 'Max Mustermann',
      player1Score: 4,
      player2Score: 2,
      categoryId: 'wasseraufbereitung',
      categoryName: 'Wasseraufbereitung',
      round: 0,
      isLastRound: false,
      questions: [
        { q: 'Frage 1' },
        { q: 'Frage 2' }
      ],
      myAnswers: [
        { correct: true },
        { correct: false }
      ],
      opponentAnswers: [
        { correct: false },
        { correct: true }
      ]
    };

    it('renders round number', () => {
      render(<QuizView {...defaultProps} currentGame={currentGame} categoryRoundResult={roundResult} />);
      expect(screen.getByText(/Runde 1 von 4/)).toBeInTheDocument();
    });

    it('renders category name', () => {
      render(<QuizView {...defaultProps} currentGame={currentGame} categoryRoundResult={roundResult} />);
      expect(screen.getByText('Wasseraufbereitung')).toBeInTheDocument();
    });

    it('renders next round button when not last round', () => {
      render(<QuizView {...defaultProps} currentGame={currentGame} categoryRoundResult={roundResult} />);
      expect(screen.getByText(/Runde 2/)).toBeInTheDocument();
    });

    it('renders Ergebnis ansehen on last round', () => {
      const lastRound = { ...roundResult, isLastRound: true };
      render(<QuizView {...defaultProps} currentGame={currentGame} categoryRoundResult={lastRound} />);
      expect(screen.getByText(/Ergebnis ansehen/)).toBeInTheDocument();
    });

    it('calls proceedAfterCategoryResult on button click', () => {
      render(<QuizView {...defaultProps} currentGame={currentGame} categoryRoundResult={roundResult} />);
      fireEvent.click(screen.getByText(/Runde 2/));
      expect(defaultProps.proceedAfterCategoryResult).toHaveBeenCalled();
    });

    it('shows question comparison rows', () => {
      render(<QuizView {...defaultProps} currentGame={currentGame} categoryRoundResult={roundResult} />);
      expect(screen.getByText('Frage 1')).toBeInTheDocument();
      expect(screen.getByText('Frage 2')).toBeInTheDocument();
    });

    it('shows Gesamtstand label', () => {
      render(<QuizView {...defaultProps} currentGame={currentGame} categoryRoundResult={roundResult} />);
      expect(screen.getByText('Gesamtstand')).toBeInTheDocument();
    });
  });
});
