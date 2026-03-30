import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import {
  USE_SECURE_API,
  loadCurrentAuthSession as dsLoadCurrentAuthSession,
  subscribeAuthStateChanges as dsSubscribeAuthStateChanges,
  registerAuthAccount as dsRegisterAuthAccount,
  loginAuthAccount as dsLoginAuthAccount,
  logoutAuthSession as dsLogoutAuthSession
} from '../lib/dataService';

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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('baeder_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authReady, setAuthReady] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState(EMPTY_REGISTER_DATA);

  const resetStoredSession = () => {
    setUser(null);
    localStorage.removeItem('baeder_user');
    localStorage.removeItem('azubi_profile');
  };

  const persistStoredSession = (nextUser, azubiProfile = null) => {
    setUser(nextUser);
    localStorage.setItem('baeder_user', JSON.stringify(nextUser));

    if (azubiProfile) {
      localStorage.setItem('azubi_profile', JSON.stringify(azubiProfile));
    } else {
      localStorage.removeItem('azubi_profile');
    }
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

        const { user: sessionUser, azubiProfile } = await dsLoadCurrentAuthSession(supabase);
        if (!active) return;

        if (sessionUser) {
          persistStoredSession(sessionUser, azubiProfile);
        } else {
          resetStoredSession();
        }
      } finally {
        if (active) setAuthReady(true);
      }
    };

    checkSession();

    const unsubscribe = dsSubscribeAuthStateChanges(supabase, async (event) => {
      if (!active) return;
      if (import.meta.env.DEV) console.log('Auth state changed:', event);

      if (event === 'SIGNED_OUT') {
        resetStoredSession();
      }

      if (event === 'PASSWORD_RECOVERY') {
        setAuthView('reset-password');
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleRegister = async () => {
    const minimumPasswordLength = USE_SECURE_API ? 12 : 6;

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
      const result = await dsRegisterAuthAccount(supabase, registerData);

      setLoginEmail(result?.email || registerData.email.trim().toLowerCase());
      setAuthView('login');
      setRegisterData(EMPTY_REGISTER_DATA);

      if (USE_SECURE_API) {
        alert('Registrierung erfolgreich!\n\nDein Account wurde angelegt und wartet jetzt auf Freischaltung durch einen Administrator.');
        return;
      }

      const assignedRoleLabel = result?.assignedRole === 'azubi' ? 'Azubi' : 'Ausbilder';
      if (result?.emailConfirmRequired) {
        alert(
          `Registrierung erfolgreich!\n\nBetrieb: ${result?.organizationName || 'Unbekannt'}\nRolle: ${assignedRoleLabel}\n\nBitte bestaetige zuerst deine E-Mail-Adresse (pruefe auch den Spam-Ordner).\n\nDanach muss dein Account noch von einem Administrator freigeschaltet werden.`
        );
      } else {
        alert(
          `Registrierung erfolgreich!\n\nBetrieb: ${result?.organizationName || 'Unbekannt'}\nRolle: ${assignedRoleLabel}\n\nDein Account muss von einem Administrator freigeschaltet werden.`
        );
      }
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
      const { user: nextUser, azubiProfile } = await dsLoginAuthAccount(supabase, {
        email: loginEmail,
        password: loginPassword
      });

      persistStoredSession(nextUser, azubiProfile);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      if (error?.code === 'invalid_login') {
        alert('E-Mail oder Passwort falsch!');
      } else if (error?.code === 'email_not_confirmed') {
        alert(
          'Bitte bestaetige zuerst deine E-Mail-Adresse.\n\nPruefe dein E-Mail-Postfach (auch den Spam-Ordner) nach einer Bestaetigungs-Mail von Supabase.\n\nFalls du keine E-Mail erhalten hast, wende dich an den Administrator.'
        );
      } else if (error?.code === 'missing_profile') {
        alert('Profil nicht gefunden. Bitte kontaktiere den Administrator.');
      } else if (error?.code === 'not_approved') {
        alert('Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Administrator.');
      } else {
        alert(`Fehler beim Login: ${error?.message || 'Unbekannter Fehler'}`);
      }

      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await dsLogoutAuthSession(supabase);
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
      handleLogout
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
