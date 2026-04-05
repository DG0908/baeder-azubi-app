import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  getTotpStatus as dsGetTotpStatus,
  generateTotpSetup as dsGenerateTotpSetup,
  enableTotp as dsEnableTotp,
  disableTotp as dsDisableTotp
} from '../../lib/dataService';

const TotpSetupView = ({ initialEnabled = false, onStatusChange }) => {
  const { darkMode, showToast } = useApp();

  const [totpEnabled, setTotpEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);

  // Setup flow state
  const [setupStep, setSetupStep] = useState(null); // null | 'qr' | 'confirm'
  const [qrCode, setQrCode] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [setupCode, setSetupCode] = useState('');

  // Disable flow state
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const result = await dsGenerateTotpSetup();
      setQrCode(result.qrCode);
      setSetupToken(result.setupToken);
      setSetupStep('qr');
    } catch (err) {
      showToast('Fehler beim Einrichten der 2FA: ' + (err?.message || 'Unbekannter Fehler'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnable = async (e) => {
    e.preventDefault();
    if (setupCode.length !== 6) {
      showToast('Bitte gib einen 6-stelligen Code ein.', 'error');
      return;
    }
    setLoading(true);
    try {
      await dsEnableTotp(setupToken, setupCode);
      setTotpEnabled(true);
      setSetupStep(null);
      setQrCode('');
      setSetupToken('');
      setSetupCode('');
      showToast('Zwei-Faktor-Authentifizierung wurde aktiviert.', 'success');
      onStatusChange?.(true);
    } catch (err) {
      if (err?.status === 401) {
        showToast('Ungültiger Code. Bitte erneut versuchen.', 'error');
      } else {
        showToast('Fehler beim Aktivieren: ' + (err?.message || 'Unbekannter Fehler'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (e) => {
    e.preventDefault();
    if (!disablePassword) {
      showToast('Bitte gib dein Passwort ein.', 'error');
      return;
    }
    setLoading(true);
    try {
      await dsDisableTotp(disablePassword);
      setTotpEnabled(false);
      setShowDisableForm(false);
      setDisablePassword('');
      showToast('Zwei-Faktor-Authentifizierung wurde deaktiviert.', 'success');
      onStatusChange?.(false);
    } catch (err) {
      if (err?.status === 401) {
        showToast('Falsches Passwort.', 'error');
      } else {
        showToast('Fehler beim Deaktivieren: ' + (err?.message || 'Unbekannter Fehler'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const cardClass = `rounded-xl p-5 border-2 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`;
  const labelClass = `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`;
  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'bg-white border-gray-300 text-gray-800'}`;

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Zwei-Faktor-Authentifizierung (2FA)
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          totpEnabled
            ? darkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
            : darkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700'
        }`}>
          {totpEnabled ? '2FA aktiv' : '2FA inaktiv'}
        </span>
      </div>

      <p className={`text-sm mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Schütze deinen Account zusätzlich mit einem zeitbasierten Einmalpasswort (TOTP) aus einer Authenticator-App wie Google Authenticator oder Authy.
      </p>

      {/* ── Not yet enabled ── */}
      {!totpEnabled && setupStep === null && (
        <button
          onClick={handleStartSetup}
          disabled={loading}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm transition-all"
        >
          {loading ? 'Bitte warten...' : '2FA einrichten'}
        </button>
      )}

      {/* ── Step 1: QR code ── */}
      {setupStep === 'qr' && (
        <div className={cardClass}>
          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            1. Scanne diesen QR-Code mit deiner Authenticator-App:
          </p>
          {qrCode && (
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="TOTP QR Code" className="rounded-lg w-48 h-48" />
            </div>
          )}
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            2. Gib den 6-stelligen Code aus der App zur Bestätigung ein:
          </p>
          <form onSubmit={handleConfirmEnable} className="space-y-3">
            <div>
              <label className={labelClass}>Bestätigungscode</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`${inputClass} text-center text-xl tracking-widest font-mono`}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || setupCode.length !== 6}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm transition-all"
              >
                {loading ? 'Wird aktiviert...' : 'Aktivieren'}
              </button>
              <button
                type="button"
                onClick={() => { setSetupStep(null); setSetupCode(''); setQrCode(''); setSetupToken(''); }}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Enabled — show disable option ── */}
      {totpEnabled && !showDisableForm && (
        <button
          onClick={() => setShowDisableForm(true)}
          className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${darkMode ? 'bg-red-900/50 hover:bg-red-900/80 text-red-300' : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}`}
        >
          2FA deaktivieren
        </button>
      )}

      {/* ── Disable form ── */}
      {totpEnabled && showDisableForm && (
        <div className={cardClass}>
          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Bestätige mit deinem Passwort:
          </p>
          <form onSubmit={handleDisable} className="space-y-3">
            <div>
              <label className={labelClass}>Passwort</label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Dein Passwort"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className={inputClass}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !disablePassword}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm transition-all"
              >
                {loading ? 'Wird deaktiviert...' : '2FA deaktivieren'}
              </button>
              <button
                type="button"
                onClick={() => { setShowDisableForm(false); setDisablePassword(''); }}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TotpSetupView;
