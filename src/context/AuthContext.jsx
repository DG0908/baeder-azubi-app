import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { PERMISSIONS } from '../data/constants';
import { triggerWebPushNotification } from '../lib/pushNotifications';

const AuthContext = createContext(null);

const buildUserSession = (userId, profile) => ({
  id: userId,
  name: profile.name,
  email: profile.email,
  role: profile.role,
  isOwner: profile.is_owner || false,
  avatar: profile.avatar || null,
  company: profile.company || null,
  birthDate: profile.birth_date || null,
  canViewSchoolCards: profile.can_view_school_cards || false,
  canSignReports: profile.can_sign_reports || false,
  permissions: PERMISSIONS[profile.role] || PERMISSIONS.azubi
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('baeder_user');
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
    trainingEnd: ''
  });

  // Supabase Session prüfen + Auth-State-Listener
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.approved) {
          const userSession = buildUserSession(session.user.id, profile);
          setUser(userSession);
          localStorage.setItem('baeder_user', JSON.stringify(userSession));

          // Azubi-Profil für Berichtsheft in localStorage speichern (App.jsx liest es reaktiv)
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
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('baeder_user');
      }
    });

    return () => subscription.unsubscribe();
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
    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }
    if (registerData.password.length < 6) {
      alert('Das Passwort muss mindestens 6 Zeichen lang sein!');
      return;
    }

    const trimmedEmail = registerData.email.trim().toLowerCase();
    const trimmedName = registerData.name.trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: registerData.password,
        options: {
          data: {
            name: trimmedName,
            role: registerData.role,
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
            user_role: registerData.role,
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
                role: registerData.role,
                training_end: registerData.trainingEnd || null,
                approved: false
              }, { onConflict: 'id' });

            if (profileError) {
              console.warn('Profil-Fallback Info:', profileError.message);
            }
          } else {
            console.log('Profil erfolgreich via RPC erstellt');
          }
        } catch (e) {
          console.warn('Profil-Erstellung fehlgeschlagen:', e);
        }

        await notifyAdminsAboutPendingRegistration({
          name: trimmedName,
          email: trimmedEmail,
          role: registerData.role
        });
      }

      await supabase.auth.signOut();

      const emailConfirmRequired = data?.user && !data?.session;
      if (emailConfirmRequired) {
        alert('✅ Registrierung erfolgreich!\n\n📧 Bitte bestätige zuerst deine E-Mail-Adresse (prüfe auch den Spam-Ordner).\n\n⏳ Danach muss dein Account noch von einem Administrator freigeschaltet werden.');
      } else {
        alert('✅ Registrierung erfolgreich!\n\n⏳ Dein Account muss von einem Administrator freigeschaltet werden.\n\nDu erhältst eine Benachrichtigung, sobald dein Account aktiviert wurde.');
      }

      setAuthView('login');
      setRegisterData({ name: '', email: '', password: '', role: 'azubi', trainingEnd: '' });
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

      const userSession = buildUserSession(authData.user.id, profile);
      setUser(userSession);
      localStorage.setItem('baeder_user', JSON.stringify(userSession));

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
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('baeder_user');
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
      handleLogin,
      handleRegister,
      handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
