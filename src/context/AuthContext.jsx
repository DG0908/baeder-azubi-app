import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { PERMISSIONS } from '../data/constants';
import { triggerWebPushNotification } from '../lib/pushNotifications';
import { isSecureBackendApiEnabled, getApiAccessToken } from '../lib/secureApiClient';
import { secureAuthApi, secureUsersApi, mapBackendUserToFrontendUser } from '../lib/secureApi';

const USE_SECURE_API = isSecureBackendApiEnabled();

const AuthContext = createContext(null);

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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('baeder_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authReady, setAuthReady] = useState(false);
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

  // Session prüfen + Auth-State-Listener
  useEffect(() => {
    const checkSession = async () => {
      try {
      // Prüfe Passwort-Reset-Links für Secure-Backend oder Legacy-Supabase.
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const urlParams = new URLSearchParams(window.location.search);
      if (
        hashParams.get('type') === 'recovery'
        || urlParams.get('type') === 'recovery'
        || urlParams.get('password_reset_token')
      ) {
        setAuthView('reset-password');
        return;
      }

      if (USE_SECURE_API) {
        // NestJS-Backend: Session über Refresh-Cookie oder Access-Token prüfen
        try {
          let backendUser;

          if (getApiAccessToken()) {
            // Access-Token vorhanden → direkt /auth/me aufrufen
            backendUser = await secureAuthApi.me();
          } else {
            // Kein Access-Token (z.B. nach Seiten-Refresh) → direkt Refresh versuchen
            // Das spart einen 401-Roundtrip: statt me()→401→refresh→retry me()
            // machen wir nur refresh() (gibt { accessToken, user } zurück)
            try {
              const refreshResult = await secureAuthApi.refreshSession();
              backendUser = refreshResult?.user;
            } catch {
              // Kein gültiger Refresh-Cookie → nicht eingeloggt
              backendUser = null;
            }
          }

          if (backendUser) {
            const frontendUser = mapBackendUserToFrontendUser(backendUser);
            frontendUser.permissions = PERMISSIONS[frontendUser.role] || PERMISSIONS.azubi;
            setUser(frontendUser);
            localStorage.setItem('baeder_user', JSON.stringify(frontendUser));
          } else if (localStorage.getItem('baeder_user')) {
            setUser(null);
            localStorage.removeItem('baeder_user');
          }
        } catch {
          // Nicht eingeloggt oder Token abgelaufen
          if (localStorage.getItem('baeder_user')) {
            setUser(null);
            localStorage.removeItem('baeder_user');
          }
        }
        return;
      }

      // Supabase-Pfad (Legacy)
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
          localStorage.setItem('baeder_user', JSON.stringify(userSession));

          if (profile.berichtsheft_profile) {
            localStorage.setItem('azubi_profile', JSON.stringify(profile.berichtsheft_profile));
          }
        } else if (profile && !profile.approved) {
          await supabase.auth.signOut();
          setUser(null);
          localStorage.removeItem('baeder_user');
        }
      } else {
        if (localStorage.getItem('baeder_user')) {
          setUser(null);
          localStorage.removeItem('baeder_user');
        }
      }
      } finally {
        setAuthReady(true);
      }
    };

    checkSession();

    // Supabase Auth-Listener nur wenn Supabase aktiv
    if (!USE_SECURE_API && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (import.meta.env.DEV) console.log('Auth state changed:', event);
        if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('baeder_user');
        }
        if (event === 'PASSWORD_RECOVERY') {
          setAuthView('reset-password');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

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
    const minimumPasswordLength = USE_SECURE_API ? 12 : 6;
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
      if (USE_SECURE_API) {
        await secureAuthApi.register({
          email: trimmedEmail,
          displayName: trimmedName,
          password: registerData.password,
          invitationCode: trimmedCode,
          ...(registerData.trainingEnd ? { trainingEnd: registerData.trainingEnd } : {})
        });

        alert('✅ Registrierung erfolgreich!\n\nDein Account wurde angelegt und wartet jetzt auf Freischaltung durch einen Administrator.');
        setLoginEmail(trimmedEmail);
        setAuthView('login');
        setRegisterData({ name: '', email: '', password: '', role: 'azubi', trainingEnd: '', invitationCode: '' });
        return;
      }

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

      if (import.meta.env.DEV) console.log('User created via Supabase Auth');

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
      let message = error.message;
      if (USE_SECURE_API) {
        if (/already registered/i.test(message)) {
          message = 'Diese E-Mail ist bereits registriert!';
        } else if (/invitation code/i.test(message)) {
          message = 'Ungültiger oder abgelaufener Einladungscode!';
        } else if (/password/i.test(message)) {
          message = `Das Passwort muss mindestens ${minimumPasswordLength} Zeichen lang sein.`;
        }
      }
      alert('Fehler bei der Registrierung: ' + message);
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Bitte E-Mail und Passwort eingeben!');
      return;
    }

    try {
      if (USE_SECURE_API) {
        // NestJS-Backend Login
        const result = await secureAuthApi.login({
          email: loginEmail.trim(),
          password: loginPassword
        });

        const backendUser = result?.user || (await secureAuthApi.me());
        const frontendUser = mapBackendUserToFrontendUser(backendUser);
        frontendUser.permissions = PERMISSIONS[frontendUser.role] || PERMISSIONS.azubi;

        if (!frontendUser.approved) {
          await secureAuthApi.logout();
          alert('Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Administrator.');
          return;
        }

        setUser(frontendUser);
        localStorage.setItem('baeder_user', JSON.stringify(frontendUser));
        setLoginEmail('');
        setLoginPassword('');
        return;
      }

      // Supabase-Pfad (Legacy)
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
      localStorage.setItem('baeder_user', JSON.stringify(userSession));

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
    if (USE_SECURE_API) {
      try { await secureAuthApi.logout(); } catch { /* ignore */ }
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('baeder_user');
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
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
