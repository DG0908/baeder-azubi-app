import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  getTotpStatus as dsGetTotpStatus,
  generateTotpSetup as dsGenerateTotpSetup,
  enableTotp as dsEnableTotp,
  disableTotp as dsDisableTotp,
  regenerateTotpRecoveryCodes as dsRegenerateTotpRecoveryCodes
} from '../../lib/dataService';

const TotpSetupView = ({ initialEnabled = false, onStatusChange }) => {
  const { darkMode, showToast } = useApp();

  const [totpEnabled, setTotpEnabled] = useState(initialEnabled);
  const [recoveryCodesRemaining, setRecoveryCodesRemaining] = useState(0);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [setupStep, setSetupStep] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [setupCode, setSetupCode] = useState('');

  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  const [showRegenerateForm, setShowRegenerateForm] = useState(false);
  const [regeneratePassword, setRegeneratePassword] = useState('');

  useEffect(() => {
    setTotpEnabled(Boolean(initialEnabled));
  }, [initialEnabled]);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const result = await dsGetTotpStatus();
        if (result?.totpEnabled !== undefined) {
          setTotpEnabled(Boolean(result.totpEnabled));
        }
        if (typeof result?.recoveryCodesRemaining === 'number') {
          setRecoveryCodesRemaining(result.recoveryCodesRemaining);
        }
      } catch {
        // ignore status refresh issues in the profile card
      }
    };

    loadStatus();
  }, []);

  const handleCopyRecoveryCodes = async () => {
    if (!recoveryCodes.length) return;
    try {
      await navigator.clipboard.writeText(recoveryCodes.join('\n'));
      showToast('Recovery-Codes in die Zwischenablage kopiert.', 'success');
    } catch {
      showToast('Recovery-Codes konnten nicht kopiert werden.', 'error');
    }
  };

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const result = await dsGenerateTotpSetup();
      setQrCode(result.qrCode);
      setSetupToken(result.setupToken);
      setSetupStep('qr');
    } catch (error) {
      showToast(`Fehler beim Einrichten der 2FA: ${error?.message || 'Unbekannter Fehler'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnable = async (event) => {
    event.preventDefault();
    if (setupCode.length !== 6) {
      showToast('Bitte gib einen 6-stelligen Code ein.', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await dsEnableTotp(setupToken, setupCode);
      const nextRecoveryCodes = Array.isArray(result?.recoveryCodes) ? result.recoveryCodes : [];
      setTotpEnabled(true);
      setRecoveryCodes(nextRecoveryCodes);
      setRecoveryCodesRemaining(nextRecoveryCodes.length);
      setSetupStep(null);
      setQrCode('');
      setSetupToken('');
      setSetupCode('');
      showToast('Zwei-Faktor-Authentifizierung wurde aktiviert.', 'success');
      onStatusChange?.(true);
    } catch (error) {
      if (error?.status === 401) {
        showToast('Ungueltiger Code. Bitte erneut versuchen.', 'error');
      } else {
        showToast(`Fehler beim Aktivieren: ${error?.message || 'Unbekannter Fehler'}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (event) => {
    event.preventDefault();
    if (!disablePassword) {
      showToast('Bitte gib dein Passwort ein.', 'error');
      return;
    }

    setLoading(true);
    try {
      await dsDisableTotp(disablePassword);
      setTotpEnabled(false);
      setRecoveryCodes([]);
      setRecoveryCodesRemaining(0);
      setShowDisableForm(false);
      setShowRegenerateForm(false);
      setDisablePassword('');
      setRegeneratePassword('');
      showToast('Zwei-Faktor-Authentifizierung wurde deaktiviert.', 'success');
      onStatusChange?.(false);
    } catch (error) {
      if (error?.status === 401) {
        showToast('Falsches Passwort.', 'error');
      } else {
        showToast(`Fehler beim Deaktivieren: ${error?.message || 'Unbekannter Fehler'}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateRecoveryCodes = async (event) => {
    event.preventDefault();
    if (!regeneratePassword) {
      showToast('Bitte bestätige die Erzeugung mit deinem Passwort.', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await dsRegenerateTotpRecoveryCodes(regeneratePassword);
      const nextRecoveryCodes = Array.isArray(result?.recoveryCodes) ? result.recoveryCodes : [];
      setRecoveryCodes(nextRecoveryCodes);
      setRecoveryCodesRemaining(
        typeof result?.recoveryCodesRemaining === 'number'
          ? result.recoveryCodesRemaining
          : nextRecoveryCodes.length
      );
      setShowRegenerateForm(false);
      setRegeneratePassword('');
      showToast('Neue Recovery-Codes wurden erstellt.', 'success');
    } catch (error) {
      if (error?.status === 401) {
        showToast('Falsches Passwort.', 'error');
      } else {
        showToast(`Fehler beim Erzeugen neuer Recovery-Codes: ${error?.message || 'Unbekannter Fehler'}`, 'error');
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
        Schuetze dein Admin-Konto zusätzlich mit einem zeitbasierten Einmalpasswort aus einer Authenticator-App.
      </p>

      {totpEnabled && (
        <div className={`${cardClass} mb-5`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Recovery-Codes verfuegbar: {recoveryCodesRemaining}
              </p>
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Recovery-Codes sind Einmalcodes für den Notfall, falls dein Authenticator nicht verfuegbar ist.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRegenerateForm((current) => !current)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                darkMode
                  ? 'bg-slate-600 hover:bg-slate-500 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Neue Recovery-Codes erzeugen
            </button>
          </div>
        </div>
      )}

      {!totpEnabled && setupStep === null && (
        <button
          onClick={handleStartSetup}
          disabled={loading}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm transition-all"
        >
          {loading ? 'Bitte warten...' : '2FA einrichten'}
        </button>
      )}

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
            2. Gib den 6-stelligen Code aus der App zur Bestätigung ein.
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
                onChange={(event) => setSetupCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
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
                onClick={() => {
                  setSetupStep(null);
                  setSetupCode('');
                  setQrCode('');
                  setSetupToken('');
                }}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {recoveryCodes.length > 0 && (
        <div className={`${cardClass} mt-5`}>
          <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Speichere diese Recovery-Codes jetzt sicher ab.
          </p>
          <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Diese Liste wird nur einmal vollständig angezeigt. Jeder Code kann genau einmal verwendet werden.
          </p>
          <div className={`rounded-lg p-4 font-mono text-sm space-y-1 ${darkMode ? 'bg-slate-900 text-cyan-200' : 'bg-slate-900 text-cyan-100'}`}>
            {recoveryCodes.map((code) => (
              <div key={code}>{code}</div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCopyRecoveryCodes}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-all"
            >
              Codes kopieren
            </button>
            <button
              type="button"
              onClick={() => setRecoveryCodes([])}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Verstanden
            </button>
          </div>
        </div>
      )}

      {totpEnabled && !showDisableForm && (
        <button
          onClick={() => setShowDisableForm(true)}
          className={`mt-5 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${darkMode ? 'bg-red-900/50 hover:bg-red-900/80 text-red-300' : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}`}
        >
          2FA deaktivieren
        </button>
      )}

      {totpEnabled && showRegenerateForm && (
        <div className={`${cardClass} mt-5`}>
          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Bestätige mit deinem Passwort, um einen neuen Satz Recovery-Codes zu erzeugen.
          </p>
          <form onSubmit={handleRegenerateRecoveryCodes} className="space-y-3">
            <div>
              <label className={labelClass}>Passwort</label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Dein Passwort"
                value={regeneratePassword}
                onChange={(event) => setRegeneratePassword(event.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !regeneratePassword}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm transition-all"
              >
                {loading ? 'Bitte warten...' : 'Neue Codes erzeugen'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRegenerateForm(false);
                  setRegeneratePassword('');
                }}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {totpEnabled && showDisableForm && (
        <div className={`${cardClass} mt-5`}>
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
                onChange={(event) => setDisablePassword(event.target.value)}
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
                onClick={() => {
                  setShowDisableForm(false);
                  setDisablePassword('');
                }}
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
