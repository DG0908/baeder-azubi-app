import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import LoginScreen from './LoginScreen';
import { expectNoA11yViolations } from '../../test-utils/a11y';

const mockAuthContext = {
  authView: 'login',
  setAuthView: vi.fn(),
  loginEmail: '',
  setLoginEmail: vi.fn(),
  loginPassword: '',
  setLoginPassword: vi.fn(),
  registerData: {
    name: '', email: '', password: '', role: 'azubi', trainingEnd: '', invitationCode: ''
  },
  setRegisterData: vi.fn(),
  handleLogin: vi.fn(),
  handleRegister: vi.fn(),
  totpPendingToken: null
};

vi.mock('../../context/AuthContext', () => ({ useAuth: () => mockAuthContext }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../../lib/dataService', () => ({
  previewInvitationCodeStatus: vi.fn().mockResolvedValue(null),
  requestPasswordReset: vi.fn().mockResolvedValue(undefined),
  confirmPasswordReset: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('../legal/LegalContent', () => ({
  LegalImprintContent: () => <div>Impressum</div>,
  LegalPrivacyContent: () => <div>Datenschutz</div>
}));
vi.mock('../views/TotpInputView', () => ({ default: () => <div>TOTP</div> }));

describe('LoginScreen a11y', () => {
  beforeEach(() => {
    mockAuthContext.authView = 'login';
  });

  it('has no serious axe violations on the login view', async () => {
    const { container } = render(<LoginScreen />);
    await expectNoA11yViolations(container);
  });

  it('has no serious axe violations on the register view', async () => {
    mockAuthContext.authView = 'register';
    const { container } = render(<LoginScreen />);
    await expectNoA11yViolations(container);
  });

  it('has no serious axe violations on the password-reset request view', async () => {
    mockAuthContext.authView = 'forgot';
    const { container } = render(<LoginScreen />);
    await expectNoA11yViolations(container);
  });
});
