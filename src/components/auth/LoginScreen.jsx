import React, { useState, useEffect, useRef } from 'react';
import { Lock, Shield, AlertTriangle, Mail, Building2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import {
  USE_SECURE_API,
  previewInvitationCodeStatus as dsPreviewInvitationCodeStatus,
  requestPasswordReset as dsRequestPasswordReset,
  confirmPasswordReset as dsConfirmPasswordReset
} from '../../lib/dataService';
import { LegalImprintContent, LegalPrivacyContent } from '../legal/LegalContent';

const LoginScreen = () => {
  const {
    authView,
    setAuthView,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    registerData,
    setRegisterData,
    handleLogin,
    handleRegister
  } = useAuth();

  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordLoading, setNewPasswordLoading] = useState(false);
  const minPasswordLength = USE_SECURE_API ? 12 : 6;

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    handleLogin();
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    handleRegister();
  };

  const handlePasswordResetSubmit = (event) => {
    event.preventDefault();
    handlePasswordReset();
  };

  // Live-Validierung des Einladungscodes
  const [codeStatus, setCodeStatus] = useState(null); // null | 'checking' | { valid: true, orgName, role } | { valid: false } | { secureValidation: true }
  const codeTimerRef = useRef(null);

  useEffect(() => {
    const code = registerData.invitationCode?.trim();
    if (!code || code.length < 4) {
      setCodeStatus(null);
      return;
    }

    if (USE_SECURE_API) {
      setCodeStatus({ secureValidation: true });
      return;
    }

    // Debounce: 500ms nach letztem Tippen
    if (codeTimerRef.current) clearTimeout(codeTimerRef.current);
    setCodeStatus('checking');

    codeTimerRef.current = setTimeout(async () => {
      try {
        const nextStatus = await dsPreviewInvitationCodeStatus(supabase, code);
        setCodeStatus(nextStatus || { valid: false });
      } catch {
        setCodeStatus({ valid: false });
      }
    }, 500);

    return () => { if (codeTimerRef.current) clearTimeout(codeTimerRef.current); };
  }, [registerData.invitationCode]);

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      alert('Bitte gib deine E-Mail-Adresse ein.');
      return;
    }
    setResetLoading(true);
    try {
      await dsRequestPasswordReset(supabase, resetEmail, { redirectTo: window.location.origin });
      setResetSent(true);
    } catch (error) {
      alert('Fehler: ' + error.message);
    } finally {
      setResetLoading(false);
    }
  };

  // Impressum
  if (authView === 'impressum') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setAuthView('login')}
            className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            ← Zurück zum Login
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">📜 Impressum</h2>
          <LegalImprintContent />
        </div>
      </div>
    );
  }
  // Datenschutz
  if (authView === 'datenschutz') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setAuthView('login')}
            className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            ← Zurück zum Login
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">🔒 Datenschutzerklärung</h2>
          <LegalPrivacyContent />
        </div>
      </div>
    );
  }
  // Neues Passwort setzen (nach Klick auf Reset-Link)
  if (authView === 'reset-password') {
    const handleSetNewPassword = async () => {
      if (!newPassword || !newPasswordConfirm) {
        alert('Bitte beide Felder ausfüllen.');
        return;
      }
      if (newPassword !== newPasswordConfirm) {
        alert('Die Passwörter stimmen nicht überein!');
        return;
      }
      if (newPassword.length < minPasswordLength) {
        alert(`Das Passwort muss mindestens ${minPasswordLength} Zeichen lang sein.`);
        return;
      }
      setNewPasswordLoading(true);
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('password_reset_token') || params.get('token') || window.location.hash?.match(/access_token=([^&]+)/)?.[1];
        await dsConfirmPasswordReset(supabase, { token, newPassword });
        alert('Passwort erfolgreich geändert! Du kannst dich jetzt anmelden.');
        setNewPassword('');
        setNewPasswordConfirm('');
        setAuthView('login');
      } catch (error) {
        alert('Fehler: ' + error.message);
      } finally {
        setNewPasswordLoading(false);
      }
    };

    const handleSetNewPasswordSubmit = (event) => {
      event.preventDefault();
      handleSetNewPassword();
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-cyan-600" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Neues Passwort setzen</h2>
            <p className="text-gray-500 text-sm">Gib dein neues Passwort ein (mindestens {minPasswordLength} Zeichen).</p>
          </div>
          <form className="space-y-4" onSubmit={handleSetNewPasswordSubmit}>
            <input
              type="password"
              name="new-password"
              autoComplete="new-password"
              placeholder="Neues Passwort"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <input
              type="password"
              name="confirm-new-password"
              autoComplete="new-password"
              placeholder="Passwort wiederholen"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={newPasswordLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {newPasswordLoading ? 'Wird gespeichert...' : 'Passwort ändern'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Passwort vergessen
  if (authView === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <button
            onClick={() => { setAuthView('login'); setResetSent(false); setResetEmail(''); }}
            className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            ← Zurück zum Login
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-cyan-600" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Passwort zurücksetzen</h2>
            <p className="text-gray-500 text-sm">Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.</p>
          </div>

          {resetSent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-green-800 mb-2">E-Mail gesendet!</h3>
              <p className="text-sm text-green-700">
                Prüfe dein Postfach (auch den Spam-Ordner) nach einer E-Mail mit dem Zurücksetzen-Link.
                Klicke auf den Link in der E-Mail, um ein neues Passwort zu setzen.
              </p>
              <button
                onClick={() => { setAuthView('login'); setResetSent(false); setResetEmail(''); }}
                className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors"
              >
                Zurück zum Login
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handlePasswordResetSubmit}>
              <input
                type="email"
                name="reset-email"
                autoComplete="email"
                placeholder="Deine E-Mail-Adresse"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {resetLoading ? 'Wird gesendet...' : 'Reset-Link senden'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Login / Registrierung
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)',
      animation: 'waterFlow 20s ease-in-out infinite'
    }}>
      {/* Water Wave Animation */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 20px,
          rgba(255, 255, 255, 0.1) 20px,
          rgba(255, 255, 255, 0.1) 40px
        )`,
        animation: 'waves 8s linear infinite'
      }}></div>

      {/* Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-50px',
              animation: `bubble ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes waterFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes waves {
          0% { transform: translateY(0); }
          100% { transform: translateY(-40px); }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <img src="/icons/icon-192x192.png" alt="Bäder Azubi Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-cyan-700 mb-2">Bäder Azubi</h1>
          <p className="text-cyan-600">Professionelle Lern-Plattform</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAuthView('login')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              authView === 'login'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthView('register')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              authView === 'register'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Registrieren
          </button>
        </div>

        {authView === 'login' ? (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <input
              type="text"
              name="username"
              autoComplete="username"
              placeholder="E-Mail oder Name"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <input
              type="password"
              name="current-password"
              autoComplete="current-password"
              placeholder="Passwort"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              <Lock className="inline mr-2" size={20} />
              Anmelden
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setAuthView('forgot')}
                className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                Passwort vergessen?
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              name="invitation-code"
              autoComplete="one-time-code"
              placeholder="Einladungscode"
              value={registerData.invitationCode}
              onChange={(e) => setRegisterData({...registerData, invitationCode: e.target.value.toUpperCase()})}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono tracking-wider text-center text-lg ${
                codeStatus?.valid === true ? 'border-green-400 bg-green-50' :
                codeStatus?.valid === false ? 'border-red-400 bg-red-50' :
                'border-cyan-300'
              }`}
              style={{ letterSpacing: '0.15em' }}
            />
            {codeStatus === 'checking' && (
              <div className="text-sm text-gray-500 text-center animate-pulse">Code wird geprüft...</div>
            )}
            {codeStatus?.valid === true && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-800 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                <div>
                  <div className="font-bold flex items-center gap-1">
                    <Building2 size={14} /> {codeStatus.orgName}
                  </div>
                  <div>Registrierung als: {codeStatus.role === 'azubi' ? 'Azubi' : 'Ausbilder'}</div>
                </div>
              </div>
            )}
            {codeStatus?.valid === false && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-800">
                {codeStatus.reason || 'Ungültiger Einladungscode'}
              </div>
            )}
            {codeStatus?.secureValidation && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-sm text-cyan-800">
                <Shield className="inline mr-2" size={16} />
                Der Einladungscode wird beim Absenden serverseitig geprüft.
              </div>
            )}
            {!codeStatus && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-sm text-cyan-800">
                <Shield className="inline mr-2" size={16} />
                Du brauchst einen Einladungscode von deinem Ausbilder oder Betrieb.
              </div>
            )}
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Vollständiger Name"
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="E-Mail"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <input
              type="password"
              name="new-password"
              autoComplete="new-password"
              placeholder={`Passwort (mind. ${minPasswordLength} Zeichen)`}
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voraussichtliches Ausbildungsende:
              </label>
              <input
                type="date"
                value={registerData.trainingEnd}
                onChange={(e) => setRegisterData({...registerData, trainingEnd: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                <AlertTriangle className="inline" size={12} /> Das Datum dient der Zuordnung; konkrete Aufbewahrungs- und Löschfristen werden vom Betreiber festgelegt.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              <Shield className="inline mr-2" size={20} />
              Registrierung beantragen
            </button>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <AlertTriangle className="inline mr-2" size={16} />
              Nach der Registrierung muss dein Account noch freigeschaltet werden.
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <button
              onClick={() => setAuthView('impressum')}
              className="text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              Impressum
            </button>
            <span>|</span>
            <button
              onClick={() => setAuthView('datenschutz')}
              className="text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
