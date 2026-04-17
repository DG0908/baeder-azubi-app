import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import {
  loadCurrentAuthSession as dsLoadCurrentAuthSession,
  subscribeAuthStateChanges as dsSubscribeAuthStateChanges,
  registerAuthAccount as dsRegisterAuthAccount,
  loginAuthAccount as dsLoginAuthAccount,
  logoutAuthSession as dsLogoutAuthSession,
  authenticateWithTotp as dsAuthenticateWithTotp
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  trainingEnd: string;
  invitationCode: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  status: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  authReady: boolean;
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  authView: string;
  setAuthView: React.Dispatch<React.SetStateAction<string>>;
  loginEmail: string;
  setLoginEmail: React.Dispatch<React.SetStateAction<string>>;
  loginPassword: string;
  setLoginPassword: React.Dispatch<React.SetStateAction<string>>;
  registerData: RegisterData;
  setRegisterData: React.Dispatch<React.SetStateAction<RegisterData>>;
  handleLogin: () => Promise<void>;
  handleRegister: () => Promise<void>;
  handleLogout: () => Promise<void>;
  totpPendingToken: string | null;
  totpCode: string;
  setTotpCode: React.Dispatch<React.SetStateAction<string>>;
  handleTotpAuthenticate: (opts?: { code?: string; recoveryCode?: string }) => Promise<void>;
  handleTotpCancel: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const EMPTY_REGISTER_DATA: RegisterData = {
  name: '',
  email: '',
  password: '',
  role: 'azubi',
  trainingEnd: '',
  invitationCode: ''
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState<RegisterData>(EMPTY_REGISTER_DATA);
  const [totpPendingToken, setTotpPendingToken] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');

  // Clean up legacy PII from localStorage (older app versions stored user profile there)
  useEffect(() => {
    try {
      localStorage.removeItem('baeder_user');
      localStorage.removeItem('azubi_profile');
    } catch { /* ignore */ }
  }, []);

  const resetStoredSession = () => {
    setUser(null);
  };

  const persistStoredSession = (nextUser: AuthUser) => {
    setUser(nextUser);
  };

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);
        if (
          hashParams.get('type') === 'recovery'
          || urlParams.get('type') === 'recovery'
          || urlParams.get('password_reset_token')
        ) {
          if (active) setAuthView('reset-password');
          return;
        }

        const { user: sessionUser } = await (dsLoadCurrentAuthSession as () => Promise<{ user: AuthUser | null; azubiProfile: unknown }>)();
        if (!active) return;

        if (sessionUser) {
          persistStoredSession(sessionUser);
        } else {
          resetStoredSession();
        }
      } finally {
        if (active) setAuthReady(true);
      }
    };

    checkSession();

    const unsubscribe = (dsSubscribeAuthStateChanges as () => () => void)();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleRegister = async () => {
    const minimumPasswordLength = 12;

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password) {
      toast.error('Bitte alle Felder ausfuellen!');
      return;
    }

    if (!registerData.invitationCode.trim()) {
      toast.error('Bitte gib deinen Einladungscode ein!');
      return;
    }

    if (registerData.password.length < minimumPasswordLength) {
      toast.error(`Das Passwort muss mindestens ${minimumPasswordLength} Zeichen lang sein!`);
      return;
    }

    try {
      const result = await (dsRegisterAuthAccount as (data: RegisterData) => Promise<Record<string, unknown>>)(registerData);

      setLoginEmail((result?.email as string) || registerData.email.trim().toLowerCase());
      setAuthView('login');
      setRegisterData(EMPTY_REGISTER_DATA);

      toast.success('Registrierung erfolgreich! Dein Account wartet auf Freischaltung durch einen Administrator.', { duration: 6000 });
    } catch (error: unknown) {
      const err = error as { message?: string; code?: string };
      let message = err?.message || 'Unbekannter Fehler';

      if (err?.code === 'already_registered') {
        message = 'Diese E-Mail ist bereits registriert!';
      } else if (err?.code === 'invalid_invitation') {
        message = 'Ungueltiger oder abgelaufener Einladungscode!';
      } else if (/password/i.test(message)) {
        message = `Das Passwort muss mindestens ${minimumPasswordLength} Zeichen lang sein.`;
      }

      toast.error(`Registrierung fehlgeschlagen: ${message}`);
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast.error('Bitte E-Mail und Passwort eingeben!');
      return;
    }

    try {
      const { user: nextUser } = await (dsLoginAuthAccount as (data: { email: string; password: string }) => Promise<{ user: AuthUser }>)({
        email: loginEmail,
        password: loginPassword
      });

      persistStoredSession(nextUser);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string; status?: number };
      if (err?.code === 'totp_required') {
        setTotpPendingToken(err.message || null);
      } else if (err?.code === 'invalid_login') {
        toast.error('E-Mail oder Passwort falsch!');
      } else if (err?.code === 'missing_profile') {
        toast.error('Profil nicht gefunden. Bitte kontaktiere den Administrator.');
      } else if (err?.code === 'not_approved') {
        toast.error('Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe.', { duration: 6000 });
      } else if (err?.status === 401) {
        toast.error('E-Mail oder Passwort falsch.');
      } else {
        toast.error(friendlyError(error));
      }

      if (err?.code !== 'totp_required') {
        console.error('Login error:', error);
      }
    }
  };

  const handleTotpAuthenticate = async ({ code = totpCode, recoveryCode = '' } = {}) => {
    const trimmedCode = String(code || '').trim();
    const normalizedRecoveryCode = String(recoveryCode || '').trim().toUpperCase();

    if (!trimmedCode && !normalizedRecoveryCode) {
      toast.error('Bitte gib einen Authenticator- oder Recovery-Code ein.');
      return;
    }

    if (trimmedCode && trimmedCode.length !== 6) {
      toast.error('Bitte 6-stelligen Code eingeben.');
      return;
    }

    try {
      const { user: nextUser } = await (dsAuthenticateWithTotp as (token: string | null, payload: { code?: string; recoveryCode?: string }) => Promise<{ user: AuthUser }>)(totpPendingToken, {
        code: trimmedCode || undefined,
        recoveryCode: normalizedRecoveryCode || undefined
      });
      persistStoredSession(nextUser);
      setTotpPendingToken(null);
      setTotpCode('');
      setLoginEmail('');
      setLoginPassword('');
    } catch (error: unknown) {
      const err = error as { status?: number };
      if (err?.status === 401) {
        toast.error('Falscher oder abgelaufener Code. Bitte erneut versuchen.');
      } else {
        toast.error(friendlyError(error));
      }
    }
  };

  const handleTotpCancel = () => {
    setTotpPendingToken(null);
    setTotpCode('');
  };

  const handleLogout = async () => {
    await (dsLogoutAuthSession as () => Promise<void>)();
    resetStoredSession();
  };

  return (
    <AuthContext.Provider value={{
      authReady,
      user,
      setUser,
      authView,
      setAuthView,
      loginEmail,
      setLoginEmail,
      loginPassword,
      setLoginPassword,
      registerData,
      setRegisterData,
      handleLogin,
      handleRegister,
      handleLogout,
      totpPendingToken,
      totpCode,
      setTotpCode,
      handleTotpAuthenticate,
      handleTotpCancel
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
