import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  loadCurrentAuthSession as dsLoadCurrentAuthSession,
  subscribeAuthStateChanges as dsSubscribeAuthStateChanges,
  registerAuthAccount as dsRegisterAuthAccount,
  loginAuthAccount as dsLoginAuthAccount,
  logoutAuthSession as dsLogoutAuthSession,
  authenticateWithTotp as dsAuthenticateWithTotp
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';

const AuthContext = createContext(null);

const EMPTY_REGISTER_DATA = {
  name: '',
  email: '',
  password: '',
  role: 'azubi',
  trainingEnd: '',
  invitationCode: ''
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState(EMPTY_REGISTER_DATA);
  const [totpPendingToken, setTotpPendingToken] = useState(null);
  const [totpCode, setTotpCode] = useState('');

  // Clean up legacy PII from localStorage (older app versions stored user profile there)
  try {
    localStorage.removeItem('baeder_user');
    localStorage.removeItem('azubi_profile');
  } catch { /* ignore */ }

  const resetStoredSession = () => {
    setUser(null);
  };

  const persistStoredSession = (nextUser) => {
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

        const { user: sessionUser, azubiProfile } = await dsLoadCurrentAuthSession();
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

    const unsubscribe = dsSubscribeAuthStateChanges();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleRegister = async () => {
    const minimumPasswordLength = 12;

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password) {
      alert('Bitte alle Felder ausfuellen!');
      return;
    }

    if (!registerData.invitationCode.trim()) {
      alert('Bitte gib deinen Einladungscode ein!');
      return;
    }

    if (registerData.password.length < minimumPasswordLength) {
      alert(`Das Passwort muss mindestens ${minimumPasswordLength} Zeichen lang sein!`);
      return;
    }

    try {
      const result = await dsRegisterAuthAccount(registerData);

      setLoginEmail(result?.email || registerData.email.trim().toLowerCase());
      setAuthView('login');
      setRegisterData(EMPTY_REGISTER_DATA);

      alert('Registrierung erfolgreich!\n\nDein Account wurde angelegt und wartet jetzt auf Freischaltung durch einen Administrator.');
    } catch (error) {
      let message = error?.message || 'Unbekannter Fehler';

      if (error?.code === 'already_registered') {
        message = 'Diese E-Mail ist bereits registriert!';
      } else if (error?.code === 'invalid_invitation') {
        message = 'Ungueltiger oder abgelaufener Einladungscode!';
      } else if (/password/i.test(message)) {
        message = `Das Passwort muss mindestens ${minimumPasswordLength} Zeichen lang sein.`;
      }

      alert(`Fehler bei der Registrierung: ${message}`);
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Bitte E-Mail und Passwort eingeben!');
      return;
    }

    try {
      const { user: nextUser } = await dsLoginAuthAccount({
        email: loginEmail,
        password: loginPassword
      });

      persistStoredSession(nextUser);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      if (error?.code === 'totp_required') {
        setTotpPendingToken(error.message); // message holds the totpToken
      } else if (error?.code === 'invalid_login') {
        alert('E-Mail oder Passwort falsch!');
      } else if (error?.code === 'missing_profile') {
        alert('Profil nicht gefunden. Bitte kontaktiere den Administrator.');
      } else if (error?.code === 'not_approved') {
        alert('Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Administrator.');
      } else if (error?.status === 401) {
        alert('E-Mail oder Passwort falsch.');
      } else {
        alert(friendlyError(error));
      }

      console.error('Login error:', error);
    }
  };

  const handleTotpAuthenticate = async () => {
    if (!totpCode || totpCode.length !== 6) {
      alert('Bitte 6-stelligen Code eingeben.');
      return;
    }
    try {
      const { user: nextUser } = await dsAuthenticateWithTotp(totpPendingToken, totpCode);
      persistStoredSession(nextUser);
      setTotpPendingToken(null);
      setTotpCode('');
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      if (error?.status === 401) {
        alert('Falscher oder abgelaufener Code. Bitte erneut versuchen.');
      } else {
        alert(friendlyError(error));
      }
    }
  };

  const handleTotpCancel = () => {
    setTotpPendingToken(null);
    setTotpCode('');
  };

  const handleLogout = async () => {
    await dsLogoutAuthSession();
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
