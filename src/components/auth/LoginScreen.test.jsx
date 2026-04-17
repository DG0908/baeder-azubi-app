import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginScreen from './LoginScreen';

// ── Mocks ────────────────────────────────────────────────

const mockAuthContext = {
  authView: 'login',
  setAuthView: vi.fn(),
  loginEmail: '',
  setLoginEmail: vi.fn(),
  loginPassword: '',
  setLoginPassword: vi.fn(),
  registerData: {
    name: '',
    email: '',
    password: '',
    role: 'azubi',
    trainingEnd: '',
    invitationCode: ''
  },
  setRegisterData: vi.fn(),
  handleLogin: vi.fn(),
  handleRegister: vi.fn(),
  totpPendingToken: null
};

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('../../lib/dataService', () => ({
  previewInvitationCodeStatus: vi.fn().mockResolvedValue(null),
  requestPasswordReset: vi.fn().mockResolvedValue(undefined),
  confirmPasswordReset: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('../legal/LegalContent', () => ({
  LegalImprintContent: () => <div data-testid="imprint-content">Impressum Content</div>,
  LegalPrivacyContent: () => <div data-testid="privacy-content">Datenschutz Content</div>
}));

vi.mock('../views/TotpInputView', () => ({
  default: () => <div data-testid="totp-view">TOTP Input</div>
}));

// ── Tests ────────────────────────────────────────────────

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext.authView = 'login';
    mockAuthContext.loginEmail = '';
    mockAuthContext.loginPassword = '';
    mockAuthContext.totpPendingToken = null;
    mockAuthContext.registerData = {
      name: '',
      email: '',
      password: '',
      role: 'azubi',
      trainingEnd: '',
      invitationCode: ''
    };
  });

  describe('Login view', () => {
    it('renders login form with email and password fields', () => {
      render(<LoginScreen />);

      expect(screen.getByPlaceholderText('E-Mail oder Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Passwort')).toBeInTheDocument();
      expect(screen.getByText('Anmelden')).toBeInTheDocument();
    });

    it('renders app title and description', () => {
      render(<LoginScreen />);

      expect(screen.getByText('Bäder Azubi')).toBeInTheDocument();
      expect(screen.getByText('Professionelle Lern-Plattform')).toBeInTheDocument();
    });

    it('renders Login and Registrieren tabs', () => {
      render(<LoginScreen />);

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Registrieren')).toBeInTheDocument();
    });

    it('calls setLoginEmail on email input change', async () => {
      render(<LoginScreen />);
      const input = screen.getByPlaceholderText('E-Mail oder Name');

      fireEvent.change(input, { target: { value: 'test@test.de' } });
      expect(mockAuthContext.setLoginEmail).toHaveBeenCalledWith('test@test.de');
    });

    it('calls setLoginPassword on password input change', async () => {
      render(<LoginScreen />);
      const input = screen.getByPlaceholderText('Passwort');

      fireEvent.change(input, { target: { value: 'geheim123' } });
      expect(mockAuthContext.setLoginPassword).toHaveBeenCalledWith('geheim123');
    });

    it('calls handleLogin on form submit', async () => {
      render(<LoginScreen />);
      const button = screen.getByText('Anmelden');

      fireEvent.click(button);
      expect(mockAuthContext.handleLogin).toHaveBeenCalled();
    });

    it('shows "Passwort vergessen?" link', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Passwort vergessen?')).toBeInTheDocument();
    });

    it('switches to forgot view on "Passwort vergessen?" click', () => {
      render(<LoginScreen />);
      fireEvent.click(screen.getByText('Passwort vergessen?'));
      expect(mockAuthContext.setAuthView).toHaveBeenCalledWith('forgot');
    });
  });

  describe('Register view', () => {
    beforeEach(() => {
      mockAuthContext.authView = 'register';
    });

    it('renders registration form fields', () => {
      render(<LoginScreen />);

      expect(screen.getByPlaceholderText('Einladungscode')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Vollständiger Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('E-Mail')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Passwort/)).toBeInTheDocument();
      expect(screen.getByText('Registrierung beantragen')).toBeInTheDocument();
    });

    it('shows approval notice', () => {
      render(<LoginScreen />);
      expect(screen.getByText(/muss dein Account noch freigeschaltet werden/)).toBeInTheDocument();
    });

    it('shows invitation code hint when no code entered', () => {
      render(<LoginScreen />);
      expect(screen.getByText(/Einladungscode von deinem Ausbilder/)).toBeInTheDocument();
    });

    it('calls handleRegister on form submit', () => {
      render(<LoginScreen />);
      fireEvent.click(screen.getByText('Registrierung beantragen'));
      expect(mockAuthContext.handleRegister).toHaveBeenCalled();
    });

    it('calls setRegisterData when name changes', () => {
      render(<LoginScreen />);
      fireEvent.change(screen.getByPlaceholderText('Vollständiger Name'), {
        target: { value: 'Max Mustermann' }
      });
      expect(mockAuthContext.setRegisterData).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Max Mustermann' })
      );
    });

    it('uppercases invitation code input', () => {
      render(<LoginScreen />);
      fireEvent.change(screen.getByPlaceholderText('Einladungscode'), {
        target: { value: 'abc123' }
      });
      expect(mockAuthContext.setRegisterData).toHaveBeenCalledWith(
        expect.objectContaining({ invitationCode: 'ABC123' })
      );
    });

    it('shows password strength indicator', () => {
      mockAuthContext.registerData = {
        ...mockAuthContext.registerData,
        password: 'SuperSicher123!'
      };
      render(<LoginScreen />);
      expect(screen.getByText(/Sehr stark|Stark/)).toBeInTheDocument();
    });

    it('shows training end date field', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Voraussichtliches Ausbildungsende:')).toBeInTheDocument();
    });
  });

  describe('Forgot password view', () => {
    beforeEach(() => {
      mockAuthContext.authView = 'forgot';
    });

    it('renders password reset form', () => {
      render(<LoginScreen />);

      expect(screen.getByText('Passwort zurücksetzen')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Deine E-Mail-Adresse')).toBeInTheDocument();
      expect(screen.getByText('Reset-Link senden')).toBeInTheDocument();
    });

    it('has back to login button', () => {
      render(<LoginScreen />);
      expect(screen.getByText('← Zurück zum Login')).toBeInTheDocument();
    });

    it('navigates back to login on back button click', () => {
      render(<LoginScreen />);
      fireEvent.click(screen.getByText('← Zurück zum Login'));
      expect(mockAuthContext.setAuthView).toHaveBeenCalledWith('login');
    });
  });

  describe('Impressum view', () => {
    beforeEach(() => {
      mockAuthContext.authView = 'impressum';
    });

    it('renders impressum content', () => {
      render(<LoginScreen />);
      expect(screen.getByTestId('imprint-content')).toBeInTheDocument();
    });

    it('has back to login button', () => {
      render(<LoginScreen />);
      expect(screen.getByText('← Zurück zum Login')).toBeInTheDocument();
    });
  });

  describe('Datenschutz view', () => {
    beforeEach(() => {
      mockAuthContext.authView = 'datenschutz';
    });

    it('renders privacy content', () => {
      render(<LoginScreen />);
      expect(screen.getByTestId('privacy-content')).toBeInTheDocument();
    });
  });

  describe('TOTP view', () => {
    it('shows TOTP input when totpPendingToken is set', () => {
      mockAuthContext.totpPendingToken = 'some-token';
      render(<LoginScreen />);
      expect(screen.getByTestId('totp-view')).toBeInTheDocument();
    });
  });

  describe('Tab switching', () => {
    it('switches to register view when Registrieren tab clicked', () => {
      render(<LoginScreen />);
      fireEvent.click(screen.getByText('Registrieren'));
      expect(mockAuthContext.setAuthView).toHaveBeenCalledWith('register');
    });

    it('switches to login view when Login tab clicked', () => {
      mockAuthContext.authView = 'register';
      render(<LoginScreen />);
      fireEvent.click(screen.getByText('Login'));
      expect(mockAuthContext.setAuthView).toHaveBeenCalledWith('login');
    });
  });

  describe('Legal links', () => {
    it('renders Impressum and Datenschutz links', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Impressum')).toBeInTheDocument();
      expect(screen.getByText('Datenschutz')).toBeInTheDocument();
    });

    it('navigates to impressum on link click', () => {
      render(<LoginScreen />);
      fireEvent.click(screen.getByText('Impressum'));
      expect(mockAuthContext.setAuthView).toHaveBeenCalledWith('impressum');
    });

    it('navigates to datenschutz on link click', () => {
      render(<LoginScreen />);
      fireEvent.click(screen.getByText('Datenschutz'));
      expect(mockAuthContext.setAuthView).toHaveBeenCalledWith('datenschutz');
    });
  });
});
