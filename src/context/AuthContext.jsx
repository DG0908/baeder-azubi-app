import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  LEGACY_FRONTEND_WRITE_PROTECTION_ENABLED,
  LEGACY_FRONTEND_WRITE_PROTECTION_MESSAGE
} from '../supabase';
import { PERMISSIONS } from '../data/constants';
import { triggerWebPushNotification } from '../lib/pushNotifications';
import {
  isSecureBackendApiEnabled,
  mapBackendRoleToFrontendRole,
  mapBackendUserToFrontendUser,
  secureAuthApi
} from '../lib/secureApi';
import { getApiAccessToken, refreshApiSession } from '../lib/secureApiClient';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'baeder_user';
const AZUBI_PROFILE_STORAGE_KEY = 'azubi_profile';
const SECURE_BACKEND_AUTH_ENABLED = isSecureBackendApiEnabled();
const LEGACY_MIN_PASSWORD_LENGTH = 6;
const SECURE_MIN_PASSWORD_LENGTH = 12;

const buildUserSession = (userId, profile, orgName) => ({
  id: userId,
  name: profile.name,
  email: profile.email,
  role: profile.role,
  isOwner: profile.is_owner || false,
  avatar: profile.avatar || null,
  company: profile.company || null,
  birthDate: profile.birth_date || null,
  organizationId: profile.organization_id || null,
  organizationName: orgName || null,
  canViewSchoolCards: profile.can_view_school_cards || false,
  canViewExamGrades: profile.can_view_exam_grades || false,
  canSignReports: profile.can_sign_reports || false,
  permissions: PERMISSIONS[profile.role] || PERMISSIONS.azubi
});

const buildSecureUserSession = (backendUser) => {
  const mappedUser = mapBackendUserToFrontendUser(backendUser);
  if (!mappedUser) return null;

  return {
    ...mappedUser,
    permissions: PERMISSIONS[mappedUser.role] || PERMISSIONS.azubi
  };
};

const persistSecureReportBookProfile = (backendUser) => {
  const profile = backendUser?.reportBookProfile ?? backendUser?.report_book_profile ?? null;
  if (!profile || typeof profile !== 'object') return;

  try {
    localStorage.setItem(AZUBI_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage failures in private mode.
  }
};

const clearStoredUserSession = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(AZUBI_PROFILE_STORAGE_KEY);
  } catch {
    // Ignore storage failures in private mode.
  }
};

const persistStoredUserSession = (userSession) => {
  try {
    if (!userSession) {
      clearStoredUserSession();
      return;
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userSession));
  } catch {
    // Ignore storage failures in private mode.
  }
};

const mapSecureAuthErrorMessage = (error, fallbackMessage) => {
  const message = String(error?.message || '').trim();
  const normalized = message.toLowerCase();

  if (!message) {
    return fallbackMessage;
  }

  if (normalized.includes('invalid credentials')) {
    return 'E-Mail oder Passwort falsch!';
  }

  if (normalized.includes('approved')) {
    return 'Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Administrator.';
  }

  if (normalized.includes('already registered')) {
    return 'Diese E-Mail ist bereits registriert!';
  }

  if (normalized.includes('invitation code')) {
    return 'Der Einladungscode ist ungueltig, abgelaufen oder bereits aufgebraucht.';
  }

  if (normalized.includes('email must be an email')) {
    return 'Bitte gib eine gueltige E-Mail-Adresse ein.';
  }

  if (normalized.includes('password must be longer than or equal to 12 characters')) {
    return 'Das Passwort muss mindestens 12 Zeichen lang sein.';
  }

  return `${fallbackMessage}: ${message}`;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authView, setAuthView] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'azubi',
    trainingEnd: '',
    invitationCode: ''
  });
  const secureBackendAuthEnabled = SECURE_BACKEND_AUTH_ENABLED;
  const passwordResetAvailable = true;
  const minimumPasswordLength = secureBackendAuthEnabled
    ? SECURE_MIN_PASSWORD_LENGTH
    : LEGACY_MIN_PASSWORD_LENGTH;

  useEffect(() => {
    persistStoredUserSession(user);
  }, [user]);

  // Supabase Session prüfen + Auth-State-Listener
  useEffect(() => {
    const checkSession = async () => {
      if (secureBackendAuthEnabled) {
        try {
          let backendUser = null;

          if (getApiAccessToken()) {
            try {
              backendUser = await secureAuthApi.me();
            } catch {
              const refreshedSession = await refreshApiSession();
              backendUser = refreshedSession?.user || null;
            }
          } else {
            const refreshedSession = await refreshApiSession();
            backendUser = refreshedSession?.user || null;
          }

          const secureUserSession = buildSecureUserSession(backendUser);
          if (!secureUserSession) {
            throw new Error('Secure backend session is invalid.');
          }

          persistSecureReportBookProfile(backendUser);
          setUser(secureUserSession);
        } catch {
          setUser(null);
          clearStoredUserSession();
        }
        return;
      }
      // Prüfe ob es ein Password-Recovery-Link ist (type=recovery in URL)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const urlParams = new URLSearchParams(window.location.search);
      if (hashParams.get('type') === 'recovery' || urlParams.get('type') === 'recovery') {
        setAuthView('reset-password');
        return; // Nicht einloggen, Reset-Formular zeigen
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.approved) {
          let orgName = null;
          if (profile.organization_id) {
            const { data: org } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', profile.organization_id)
              .single();
            orgName = org?.name || null;
          }
          const userSession = buildUserSession(session.user.id, profile, orgName);
          setUser(userSession);

          // Azubi-Profil für Berichtsheft in localStorage speichern (App.jsx liest es reaktiv)
          if (profile.berichtsheft_profile) {
            localStorage.setItem(AZUBI_PROFILE_STORAGE_KEY, JSON.stringify(profile.berichtsheft_profile));
          }
        } else if (profile && !profile.approved) {
          await supabase.auth.signOut();
          setUser(null);
          clearStoredUserSession();
        }
      } else {
        if (localStorage.getItem(USER_STORAGE_KEY)) {
          setUser(null);
          clearStoredUserSession();
        }
      }
    };

    checkSession();

    if (secureBackendAuthEnabled) {
      return undefined;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        setUser(null);
        clearStoredUserSession();
      }
      if (event === 'PASSWORD_RECOVERY') {
        setAuthView('reset-password');
      }
    });

    return () => subscription.unsubscribe();
  }, [secureBackendAuthEnabled]);

  const notifyAdminsAboutPendingRegistration = async ({ name, email, role }) => {
    try {
      const { data: admins, error: adminsError } = await supabase
        .from('profiles')
        .select('name')
        .eq('role', 'admin')
        .eq('approved', true);

      if (adminsError) throw adminsError;

      const adminNames = [...new Set(
        (admins || [])
          .map((admin) => String(admin.name || '').trim())
          .filter(Boolean)
      )];

      if (!adminNames.length) return;

      const title = '🆕 Neue Registrierung';
      const message = `${name} (${email}) hat sich als ${role} registriert und wartet auf Freischaltung.`;

      const rows = adminNames.map((adminName) => ({
        user_name: adminName,
        title,
        message,
        type: 'user_approval',
        read: false
      }));

      const { data: inserted, error: insertError } = await supabase
        .from('notifications')
        .insert(rows)
        .select('id,user_name');

      if (insertError) throw insertError;

      for (const notif of inserted || []) {
        try {
          await triggerWebPushNotification({
            supabase,
            userName: notif.user_name,
            title,
            message,
            type: 'user_approval',
            notificationId: notif.id
          });
        } catch (pushError) {
          console.warn('Registration push dispatch failed:', pushError);
        }
      }
    } catch (error) {
      console.warn('Admin notification for registration failed:', error);
    }
  };

  const handleRegister = async () => {
    if (secureBackendAuthEnabled) {
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

      const trimmedEmail = registerData.email.trim().toLowerCase();
      const trimmedName = registerData.name.trim();
      const trimmedCode = registerData.invitationCode.trim().toUpperCase();

      try {
        const result = await secureAuthApi.register({
          email: trimmedEmail,
          displayName: trimmedName,
          password: registerData.password,
          invitationCode: trimmedCode,
          trainingEnd: registerData.trainingEnd || undefined
        });

        const frontendRole = mapBackendRoleToFrontendRole(result?.user?.role);
        const roleLabel = (PERMISSIONS[frontendRole] || PERMISSIONS.azubi).label;
        const organizationName = result?.user?.organization?.name || 'Dein Betrieb';

        alert(`Registrierung erfolgreich!\n\nBetrieb: ${organizationName}\nRolle: ${roleLabel}\n\nDein Account muss von einem Administrator freigeschaltet werden.`);
        setAuthView('login');
        setRegisterData({ name: '', email: '', password: '', role: 'azubi', trainingEnd: '', invitationCode: '' });
      } catch (error) {
        alert(mapSecureAuthErrorMessage(error, 'Fehler bei der Registrierung'));
        console.error('Secure registration error:', error);
      }
      return;
    }

    if (LEGACY_FRONTEND_WRITE_PROTECTION_ENABLED) {
      alert(`Registrierung ist im Sicherheitsmodus voruebergehend deaktiviert.\n\n${LEGACY_FRONTEND_WRITE_PROTECTION_MESSAGE}`);
      return;
    }

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password) {
      alert('Bitte alle Felder ausfüllen!');
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

    const trimmedEmail = registerData.email.trim().toLowerCase();
    const trimmedName = registerData.name.trim();
    const trimmedCode = registerData.invitationCode.trim().toUpperCase();

    try {
      // 1. Einladungscode validieren
      const { data: codeResult, error: codeError } = await supabase
        .rpc('use_invitation_code', { p_code: trimmedCode });

      if (codeError) {
        alert('Ungültiger oder abgelaufener Einladungscode!');
        return;
      }

      const invitation = codeResult?.[0];
      if (!invitation) {
        alert('Ungültiger oder abgelaufener Einladungscode!');
        return;
      }

      const assignedRole = invitation.assigned_role || 'azubi';
      const orgId = invitation.org_id;

      // 2. Auth-User erstellen
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: registerData.password,
        options: {
          data: {
            name: trimmedName,
            role: assignedRole,
            training_end: registerData.trainingEnd || null
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          alert('Diese E-Mail ist bereits registriert!');
        } else {
          throw error;
        }
        return;
      }

      console.log('User created via Supabase Auth:', data);

      if (data?.user) {
        try {
          const { error: rpcError } = await supabase.rpc('create_user_profile', {
            user_id: data.user.id,
            user_name: trimmedName,
            user_email: trimmedEmail,
            user_role: assignedRole,
            user_training_end: registerData.trainingEnd || null
          });

          if (rpcError) {
            console.warn('RPC Profil-Erstellung Info:', rpcError.message);
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                name: trimmedName,
                email: trimmedEmail,
                role: assignedRole,
                training_end: registerData.trainingEnd || null,
                approved: false,
                organization_id: orgId
              }, { onConflict: 'id' });

            if (profileError) {
              console.warn('Profil-Fallback Info:', profileError.message);
            }
          } else {
            console.log('Profil erfolgreich via RPC erstellt');
          }

          // Organization zuweisen (falls RPC das nicht macht)
          await supabase
            .from('profiles')
            .update({ organization_id: orgId })
            .eq('id', data.user.id);

        } catch (e) {
          console.warn('Profil-Erstellung fehlgeschlagen:', e);
        }

        await notifyAdminsAboutPendingRegistration({
          name: trimmedName,
          email: trimmedEmail,
          role: assignedRole
        });
      }

      await supabase.auth.signOut();

      const emailConfirmRequired = data?.user && !data?.session;
      if (emailConfirmRequired) {
        alert(`✅ Registrierung erfolgreich!\n\n🏢 Betrieb: ${invitation.org_name}\n👤 Rolle: ${assignedRole === 'azubi' ? 'Azubi' : 'Ausbilder'}\n\n📧 Bitte bestätige zuerst deine E-Mail-Adresse (prüfe auch den Spam-Ordner).\n\n⏳ Danach muss dein Account noch von einem Administrator freigeschaltet werden.`);
      } else {
        alert(`✅ Registrierung erfolgreich!\n\n🏢 Betrieb: ${invitation.org_name}\n👤 Rolle: ${assignedRole === 'azubi' ? 'Azubi' : 'Ausbilder'}\n\n⏳ Dein Account muss von einem Administrator freigeschaltet werden.`);
      }

      setAuthView('login');
      setRegisterData({ name: '', email: '', password: '', role: 'azubi', trainingEnd: '', invitationCode: '' });
    } catch (error) {
      alert('Fehler bei der Registrierung: ' + error.message);
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Bitte E-Mail und Passwort eingeben!');
      return;
    }

    if (secureBackendAuthEnabled) {
      try {
        const result = await secureAuthApi.login({
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword
        });

        const secureUserSession = buildSecureUserSession(result?.user);
        if (!secureUserSession) {
          throw new Error('Secure backend session is invalid.');
        }

        persistSecureReportBookProfile(result?.user);
        setUser(secureUserSession);
        setLoginEmail('');
        setLoginPassword('');
      } catch (error) {
        alert(mapSecureAuthErrorMessage(error, 'Fehler beim Login'));
        console.error('Secure login error:', error);
      }
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword
      });

      if (authError) {
        if (authError.message.includes('Invalid login')) {
          alert('E-Mail oder Passwort falsch!');
        } else if (authError.message.includes('Email not confirmed')) {
          alert('Bitte bestätige zuerst deine E-Mail-Adresse.\n\nPrüfe dein E-Mail-Postfach (auch den Spam-Ordner) nach einer Bestätigungs-Mail von Supabase.\n\nFalls du keine E-Mail erhalten hast, wende dich an den Administrator.');
        } else {
          alert('Fehler beim Login: ' + authError.message);
        }
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profil nicht gefunden:', profileError);
        await supabase.auth.signOut();
        alert('Profil nicht gefunden. Bitte kontaktiere den Administrator.');
        return;
      }

      if (!profile.approved) {
        await supabase.auth.signOut();
        alert('Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Administrator.');
        return;
      }

      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id);

      let orgName = null;
      if (profile.organization_id) {
        const { data: org } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', profile.organization_id)
          .single();
        orgName = org?.name || null;
      }
      const userSession = buildUserSession(authData.user.id, profile, orgName);
      setUser(userSession);

      // Initialize stats if not exists
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (!existingStats) {
        await supabase
          .from('user_stats')
          .insert([{
            user_id: authData.user.id,
            wins: 0,
            losses: 0,
            draws: 0,
            category_stats: {},
            opponents: {}
          }]);
      }

      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      alert('Fehler beim Login: ' + error.message);
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    if (secureBackendAuthEnabled) {
      try {
        await secureAuthApi.logout();
      } catch {
        try {
          await refreshApiSession();
          await secureAuthApi.logout();
        } catch {
          // Local session cleanup still runs below.
        }
      } finally {
        setUser(null);
        clearStoredUserSession();
      }
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    clearStoredUserSession();
  };

  return (
    <AuthContext.Provider value={{
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
      secureBackendAuthEnabled,
      passwordResetAvailable,
      minimumPasswordLength,
      handleLogin,
      handleRegister,
      handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
