import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const TotpInputView = () => {
  const { totpCode, setTotpCode, handleTotpAuthenticate, handleTotpCancel } = useAuth();
  const { darkMode } = useApp();
  const inputRef = useRef(null);
  const [authMode, setAuthMode] = useState('app');
  const [recoveryCode, setRecoveryCode] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, [authMode]);

  const handleCodeChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 6);
    setTotpCode(value);
    if (authMode === 'app' && value.length === 6) {
      setTimeout(() => {
        handleTotpAuthenticate({ code: value });
      }, 80);
    }
  };

  const handleRecoveryCodeChange = (event) => {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 32);
    setRecoveryCode(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (authMode === 'recovery') {
      handleTotpAuthenticate({ recoveryCode });
      return;
    }
    handleTotpAuthenticate({ code: totpCode });
  };

  const handleSwitchMode = (mode) => {
    setAuthMode(mode);
    setTotpCode('');
    setRecoveryCode('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-sm rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Zwei-Faktor-Authentifizierung
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Nutze deinen Authenticator-Code oder einen Recovery-Code fuer den Admin-Login.
          </p>
        </div>

        <div className={`mb-5 grid grid-cols-2 gap-2 rounded-xl p-1 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <button
            type="button"
            onClick={() => handleSwitchMode('app')}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              authMode === 'app'
                ? 'bg-cyan-600 text-white shadow'
                : darkMode
                  ? 'text-gray-300 hover:bg-slate-600'
                  : 'text-gray-600 hover:bg-white'
            }`}
          >
            Authenticator-App
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('recovery')}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              authMode === 'recovery'
                ? 'bg-cyan-600 text-white shadow'
                : darkMode
                  ? 'text-gray-300 hover:bg-slate-600'
                  : 'text-gray-600 hover:bg-white'
            }`}
          >
            Recovery-Code
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {authMode === 'app' ? (
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={6}
                value={totpCode}
                onChange={handleCodeChange}
                placeholder="000000"
                className={`w-full text-center text-3xl font-mono tracking-widest px-4 py-4 rounded-xl border-2 outline-none transition-all ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-cyan-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-cyan-500'
                } focus:ring-2 focus:ring-cyan-500/20`}
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                autoComplete="off"
                value={recoveryCode}
                onChange={handleRecoveryCodeChange}
                placeholder="ABCD-EFGH"
                className={`w-full text-center text-xl font-mono tracking-[0.2em] px-4 py-4 rounded-xl border-2 outline-none transition-all ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-cyan-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-cyan-500'
                } focus:ring-2 focus:ring-cyan-500/20`}
              />
            )}
          </div>

          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {authMode === 'app'
              ? 'Gib den aktuellen 6-stelligen Code aus deiner Authenticator-App ein.'
              : 'Recovery-Codes sind Einmalcodes fuer den Notfall. Nach der Nutzung musst du einen neuen Satz erzeugen.'}
          </p>

          <button
            type="submit"
            disabled={authMode === 'app' ? totpCode.length !== 6 : recoveryCode.trim().length < 6}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            Bestaetigen
          </button>

          <button
            type="button"
            onClick={handleTotpCancel}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Zurueck zur Anmeldung
          </button>
        </form>
      </div>
    </div>
  );
};

export default TotpInputView;
