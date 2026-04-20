import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import zxcvbn from 'zxcvbn';
import { Lock, Shield, AlertTriangle, Mail, Building2, CheckCircle, ArrowLeft, FileText, ShieldCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  requestPasswordReset as dsRequestPasswordReset,
  confirmPasswordReset as dsConfirmPasswordReset
} from '../../lib/dataService';
import { LegalImprintContent, LegalPrivacyContent } from '../legal/LegalContent';
import TotpInputView from '../views/TotpInputView';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  warning?: string;
  suggestion?: string;
}

interface CodeStatusValid {
  valid: true;
  orgName: string;
  role: string;
}

interface CodeStatusInvalid {
  valid: false;
  reason?: string;
}

interface CodeStatusSecure {
  secureValidation: true;
}

type CodeStatus = 'checking' | CodeStatusValid | CodeStatusInvalid | CodeStatusSecure | null;

const STRENGTH_LABELS = ['Sehr schwach', 'Schwach', 'Mittel', 'Stark', 'Sehr stark'] as const;
const STRENGTH_COLORS = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-500', 'bg-green-500'] as const;

const getPasswordStrength = (pw: string): PasswordStrength => {
  if (!pw) return { score: 0, label: '', color: '' };
  const result = zxcvbn(pw);
  const score = result.score;
  const displayScore = pw.length < 12 ? Math.min(score, 1) : score;
  return {
    score: displayScore + 1,
    label: STRENGTH_LABELS[displayScore],
    color: STRENGTH_COLORS[displayScore],
    warning: result.feedback.warning || undefined,
    suggestion: result.feedback.suggestions[0] || undefined,
  };
};

const LoginScreen: React.FC = () => {
  const auth = useAuth();
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
    handleRegister,
    totpPendingToken
  } = auth!;

  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordLoading, setNewPasswordLoading] = useState(false);
  const minPasswordLength = 12;

  const [codeStatus, setCodeStatus] = useState<CodeStatus>(null);
  const codeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const code = registerData.invitationCode?.trim();
    if (!code || code.length < 4) {
      setCodeStatus(null);
      return;
    }

    setCodeStatus({ secureValidation: true });
    return () => {};
  }, [registerData.invitationCode]);

  // If a TOTP challenge is pending, show the TOTP input screen
  if (totpPendingToken) {
    return <TotpInputView />;
  }

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleLogin();
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleRegister();
  };

  const handlePasswordResetSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handlePasswordReset();
  };

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      toast.error('Bitte gib deine E-Mail-Adresse ein.');
      return;
    }
    setResetLoading(true);
    try {
      await (dsRequestPasswordReset as (email: string, opts: { redirectTo: string }) => Promise<void>)(resetEmail, { redirectTo: window.location.origin });
      setResetSent(true);
    } catch (error: unknown) {
      toast.error('Fehler: ' + (error as Error).message);
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
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 rounded-t-2xl" />
          <button
            onClick={() => setAuthView('login')}
            className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-white/70 hover:bg-white text-cyan-700 border border-cyan-200 transition-all"
          >
            <ArrowLeft size={16} />
            Zurück zum Login
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <FileText size={22} className="text-cyan-600" />
            Impressum
          </h2>
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
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-2xl" />
          <button
            onClick={() => setAuthView('login')}
            className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-white/70 hover:bg-white text-cyan-700 border border-cyan-200 transition-all"
          >
            <ArrowLeft size={16} />
            Zurück zum Login
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <ShieldCheck size={22} className="text-emerald-600" />
            Datenschutzerklärung
          </h2>
          <LegalPrivacyContent />
        </div>
      </div>
    );
  }
  // Neues Passwort setzen (nach Klick auf Reset-Link)
  if (authView === 'reset-password') {
    const handleSetNewPassword = async () => {
      if (!newPassword || !newPasswordConfirm) {
        toast.error('Bitte beide Felder ausfuellen.');
        return;
      }
      if (newPassword !== newPasswordConfirm) {
        toast.error('Die Passwoerter stimmen nicht ueberein!');
        return;
      }
      if (newPassword.length < minPasswordLength) {
        toast.error(`Das Passwort muss mindestens ${minPasswordLength} Zeichen lang sein.`);
        return;
      }
      setNewPasswordLoading(true);
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('password_reset_token') || params.get('token') || window.location.hash?.match(/access_token=([^&]+)/)?.[1];
        await (dsConfirmPasswordReset as (data: { token: string | null | undefined; newPassword: string }) => Promise<void>)({ token, newPassword });
        toast.success('Passwort erfolgreich geaendert! Du kannst dich jetzt anmelden.');
        setNewPassword('');
        setNewPasswordConfirm('');
        setAuthView('login');
      } catch (error: unknown) {
        toast.error('Fehler: ' + (error as Error).message);
      } finally {
        setNewPasswordLoading(false);
      }
    };

    const handleSetNewPasswordSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      handleSetNewPassword();
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-8 max-w-md w-full relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 rounded-t-2xl" />
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-sky-500 shadow-lg shadow-cyan-500/30">
              <Lock className="text-white" size={28} />
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
              aria-label="Neues Passwort"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
            />
            {newPassword.length > 0 && (() => {
              const strength = getPasswordStrength(newPassword);
              return (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strength.score <= 2 ? 'text-red-500' : strength.score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {strength.label}
                  </p>
                  {(strength.warning || strength.suggestion) && strength.score <= 3 && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {strength.warning || strength.suggestion}
                    </p>
                  )}
                </div>
              );
            })()}
            <input
              type="password"
              name="confirm-new-password"
              autoComplete="new-password"
              placeholder="Passwort wiederholen"
              aria-label="Neues Passwort wiederholen"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
            />
            <button
              type="submit"
              disabled={newPasswordLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-cyan-500/20"
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
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-8 max-w-md w-full relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-t-2xl" />
          <button
            onClick={() => { setAuthView('login'); setResetSent(false); setResetEmail(''); }}
            className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-white/70 hover:bg-white text-cyan-700 border border-cyan-200 transition-all"
          >
            <ArrowLeft size={16} />
            Zurück zum Login
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30">
              <Mail className="text-white" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Passwort zurücksetzen</h2>
            <p className="text-gray-500 text-sm">Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.</p>
          </div>

          {resetSent ? (
            <div className="bg-green-50/80 backdrop-blur border border-green-300 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-green-800 mb-2">E-Mail gesendet!</h3>
              <p className="text-sm text-green-700">
                Prüfe dein Postfach (auch den Spam-Ordner) nach einer E-Mail mit dem Zurücksetzen-Link.
                Klicke auf den Link in der E-Mail, um ein neues Passwort zu setzen.
              </p>
              <button
                onClick={() => { setAuthView('login'); setResetSent(false); setResetEmail(''); }}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20"
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
                aria-label="E-Mail-Adresse für Passwort-Reset"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
              />
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-500/20"
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

      {/* Glow Orbs — pulsierende Farb-Highlights im Hintergrund */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{
          width: '520px', height: '520px',
          top: '-140px', left: '-120px',
          background: 'radial-gradient(circle, rgba(125,211,252,0.55) 0%, rgba(125,211,252,0) 65%)',
          animation: 'orbDriftA 16s ease-in-out infinite',
        }} />
        <div className="absolute rounded-full" style={{
          width: '460px', height: '460px',
          bottom: '-140px', right: '-100px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.45) 0%, rgba(16,185,129,0) 65%)',
          animation: 'orbDriftB 22s ease-in-out infinite',
        }} />
        <div className="absolute rounded-full" style={{
          width: '360px', height: '360px',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(14,165,233,0.35) 0%, rgba(14,165,233,0) 70%)',
          animation: 'orbPulse 9s ease-in-out infinite',
        }} />
      </div>

      {/* Caustics — schwebende Lichtreflexe */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: 'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(255,255,255,0.25) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)',
        animation: 'causticsDrift 12s ease-in-out infinite',
      }} />

      {/* Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 32 + 8}px`,
              height: `${Math.random() * 32 + 8}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-50px',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.1) 70%)',
              boxShadow: 'inset 0 0 4px rgba(255,255,255,0.5)',
              animation: `bubble ${Math.random() * 10 + 6}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
              opacity: 0.4,
            }}
          ></div>
        ))}
      </div>

      {/* Wellen-SVG am unteren Rand */}
      <svg
        className="absolute bottom-0 left-0 right-0 pointer-events-none w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{ height: '140px' }}
        aria-hidden="true"
      >
        <path
          d="M0,96 C240,160 480,32 720,80 C960,128 1200,192 1440,112 L1440,200 L0,200 Z"
          fill="rgba(255,255,255,0.08)"
          style={{ animation: 'waveMorph 10s ease-in-out infinite' }}
        />
        <path
          d="M0,128 C240,80 480,176 720,128 C960,80 1200,144 1440,96 L1440,200 L0,200 Z"
          fill="rgba(255,255,255,0.12)"
          style={{ animation: 'waveMorph 14s ease-in-out infinite reverse' }}
        />
      </svg>

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
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
          50% { opacity: 0.55; transform: translateY(-50vh) translateX(20px) scale(0.85); }
          100% { transform: translateY(-100vh) translateX(-10px) scale(0.5); opacity: 0; }
        }
        @keyframes orbDriftA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
        }
        @keyframes orbDriftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, -30px) scale(1.15); }
        }
        @keyframes orbPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        }
        @keyframes causticsDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes waveMorph {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-40px); }
        }
        @keyframes shimmerSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes borderRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .login-panel-wrapper {
          position: relative;
          border-radius: 1.5rem;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.6), rgba(125,211,252,0.4), rgba(16,185,129,0.3), rgba(255,255,255,0.6));
          background-size: 300% 300%;
          animation: borderRotate 12s linear infinite;
        }
        .login-panel-wrapper::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 1.5rem;
          background: conic-gradient(from 0deg, rgba(125,211,252,0.5), rgba(16,185,129,0.4), rgba(14,165,233,0.5), rgba(125,211,252,0.5));
          filter: blur(20px);
          opacity: 0.5;
          z-index: -1;
          animation: borderRotate 16s linear infinite;
        }
        .login-title-shimmer {
          background: linear-gradient(90deg, #0e7490 0%, #0891b2 30%, #e0f2fe 50%, #0891b2 70%, #0e7490 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmerSweep 4s ease-in-out infinite;
        }
      `}</style>

      <div className="login-panel-wrapper max-w-md w-full relative z-10">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500" />
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4" style={{ animation: 'logoFloat 4s ease-in-out infinite' }}>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400 to-sky-500 blur-xl opacity-50" />
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cyan-300 via-sky-400 to-emerald-400 blur-2xl opacity-30" />
            <img src="/icons/icon-192x192.png" alt="Bäder Azubi Logo" className="relative w-24 h-24 rounded-2xl shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold login-title-shimmer mb-2">Bäder Azubi</h1>
          <p className="text-xs font-mono tracking-wider text-cyan-600 inline-flex items-center gap-1.5">
            <GraduationCap size={14} />
            PROFESSIONELLE LERN-PLATTFORM
          </p>
        </div>

        <div className={`flex gap-1 mb-6 p-1 rounded-2xl border ${
          'bg-white/60 border-cyan-100'
        }`}>
          <button
            onClick={() => setAuthView('login')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              authView === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-cyan-700 hover:bg-white/70'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthView('register')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              authView === 'register'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30'
                : 'text-emerald-700 hover:bg-white/70'
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
              aria-label="E-Mail oder Name"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
            />
            <input
              type="password"
              name="current-password"
              autoComplete="current-password"
              placeholder="Passwort"
              aria-label="Passwort"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Lock size={18} />
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
              aria-label="Einladungscode"
              value={registerData.invitationCode}
              onChange={(e) => setRegisterData({...registerData, invitationCode: e.target.value.toUpperCase()})}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono tracking-wider text-center text-lg transition-all ${
                codeStatus && typeof codeStatus === 'object' && 'valid' in codeStatus && codeStatus.valid === true ? 'border-green-400 bg-green-50/80 text-green-800' :
                codeStatus && typeof codeStatus === 'object' && 'valid' in codeStatus && codeStatus.valid === false ? 'border-red-400 bg-red-50/80 text-red-800' :
                'border-cyan-200 bg-white/70 text-gray-800'
              }`}
              style={{ letterSpacing: '0.15em' }}
            />
            {codeStatus === 'checking' && (
              <div className="text-sm text-gray-500 text-center animate-pulse">Code wird geprüft...</div>
            )}
            {codeStatus && typeof codeStatus === 'object' && 'valid' in codeStatus && codeStatus.valid === true && (
              <div className="bg-green-50/80 backdrop-blur border border-green-300 rounded-xl p-3 text-sm text-green-800 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                <div>
                  <div className="font-bold flex items-center gap-1">
                    <Building2 size={14} /> {(codeStatus as CodeStatusValid).orgName}
                  </div>
                  <div>Registrierung als: {(codeStatus as CodeStatusValid).role === 'azubi' ? 'Azubi' : 'Ausbilder'}</div>
                </div>
              </div>
            )}
            {codeStatus && typeof codeStatus === 'object' && 'valid' in codeStatus && codeStatus.valid === false && (
              <div className="bg-red-50/80 backdrop-blur border border-red-300 rounded-xl p-3 text-sm text-red-800">
                {(codeStatus as CodeStatusInvalid).reason || 'Ungültiger Einladungscode'}
              </div>
            )}
            {codeStatus && typeof codeStatus === 'object' && 'secureValidation' in codeStatus && (
              <div className="bg-cyan-50/80 backdrop-blur border border-cyan-200 rounded-xl p-3 text-sm text-cyan-800 flex items-start gap-2">
                <Shield className="mt-0.5 flex-shrink-0 text-cyan-600" size={16} />
                <span>Der Einladungscode wird beim Absenden serverseitig geprüft.</span>
              </div>
            )}
            {!codeStatus && (
              <div className="bg-cyan-50/80 backdrop-blur border border-cyan-200 rounded-xl p-3 text-sm text-cyan-800 flex items-start gap-2">
                <Shield className="mt-0.5 flex-shrink-0 text-cyan-600" size={16} />
                <span>Du brauchst einen Einladungscode von deinem Ausbilder oder Betrieb.</span>
              </div>
            )}
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Vollständiger Name"
              aria-label="Vollständiger Name"
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="E-Mail"
              aria-label="E-Mail-Adresse"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
            />
            <input
              type="password"
              name="new-password"
              autoComplete="new-password"
              placeholder={`Passwort (mind. ${minPasswordLength} Zeichen)`}
              aria-label="Neues Passwort"
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
            />
            {registerData.password.length > 0 && (() => {
              const strength = getPasswordStrength(registerData.password);
              return (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strength.score <= 2 ? 'text-red-500' : strength.score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {strength.label}
                  </p>
                  {(strength.warning || strength.suggestion) && strength.score <= 3 && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {strength.warning || strength.suggestion}
                    </p>
                  )}
                </div>
              );
            })()}
            <div>
              <label htmlFor="training-end" className="block text-sm font-medium text-gray-700 mb-2">
                Voraussichtliches Ausbildungsende:
              </label>
              <input
                id="training-end"
                type="date"
                value={registerData.trainingEnd}
                onChange={(e) => setRegisterData({...registerData, trainingEnd: e.target.value})}
                className="w-full px-4 py-3 bg-white/70 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Das Datum dient der Zuordnung; konkrete Aufbewahrungs- und Löschfristen werden vom Betreiber festgelegt.</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              Registrierung beantragen
            </button>
            <div className="bg-amber-50/80 backdrop-blur border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-start gap-2">
              <AlertTriangle className="mt-0.5 flex-shrink-0 text-amber-600" size={16} />
              <span>Nach der Registrierung muss dein Account noch freigeschaltet werden.</span>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-cyan-100">
          <div className="flex justify-center gap-4 text-xs">
            <button
              onClick={() => setAuthView('impressum')}
              className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-800 transition-colors font-medium"
            >
              <FileText size={12} />
              Impressum
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setAuthView('datenschutz')}
              className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-800 transition-colors font-medium"
            >
              <ShieldCheck size={12} />
              Datenschutz
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default LoginScreen;
