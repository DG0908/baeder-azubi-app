import React from 'react';
import { Check, Sparkles, User as UserIcon } from 'lucide-react';

const inputClassFor = (darkMode) =>
  `w-full px-4 py-2 border rounded-lg transition-colors ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-cyan-500'
  }`;

const BerichtsheftProfileView = ({
  darkMode,
  azubiProfile,
  saveAzubiProfile,
  openBerichtsheftDraftForCurrentWeek,
}) => {
  const inputClass = inputClassFor(darkMode);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
            }`}
          >
            <UserIcon size={20} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Azubi-Profil für Berichtsheft
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Diese Daten werden automatisch in deine Berichtshefte übernommen.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Vorname *
            </label>
            <input
              type="text"
              value={azubiProfile.vorname}
              onChange={(e) => saveAzubiProfile({ ...azubiProfile, vorname: e.target.value })}
              placeholder="Max"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nachname *
            </label>
            <input
              type="text"
              value={azubiProfile.nachname}
              onChange={(e) => saveAzubiProfile({ ...azubiProfile, nachname: e.target.value })}
              placeholder="Mustermann"
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ausbildungsbetrieb *
            </label>
            <input
              type="text"
              value={azubiProfile.ausbildungsbetrieb}
              onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbetrieb: e.target.value })}
              placeholder="Stadtwerke Musterstadt GmbH"
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ausbildungsberuf
            </label>
            <input
              type="text"
              value={azubiProfile.ausbildungsberuf}
              onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsberuf: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Name Ausbilder/in
            </label>
            <input
              type="text"
              value={azubiProfile.ausbilder}
              onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbilder: e.target.value })}
              placeholder="Frau/Herr Ausbilder"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ausbildungsbeginn
            </label>
            <input
              type="date"
              value={azubiProfile.ausbildungsbeginn}
              onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbeginn: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {azubiProfile.vorname && azubiProfile.nachname && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={18} />
            <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Vorschau Kopfzeile</h4>
          </div>
          <div
            className={`p-4 rounded-xl border ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Name: </span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {azubiProfile.vorname} {azubiProfile.nachname}
                </span>
              </div>
              <div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb: </span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {azubiProfile.ausbildungsbetrieb || '-'}
                </span>
              </div>
              <div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Beruf: </span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {azubiProfile.ausbildungsberuf}
                </span>
              </div>
              <div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder: </span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {azubiProfile.ausbilder || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={openBerichtsheftDraftForCurrentWeek}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
      >
        <Check size={20} />
        Profil gespeichert - Zum Berichtsheft
      </button>
    </div>
  );
};

export default BerichtsheftProfileView;
