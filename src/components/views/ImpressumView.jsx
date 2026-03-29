import React from 'react';
import { useApp } from '../../context/AppContext';
import { LegalImprintContent } from '../legal/LegalContent';

const ImpressumView = (props) => {
const {
  setCurrentView,
} = props;
  const { darkMode } = useApp();

  return (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-8 shadow-lg`}>
              <button
                onClick={() => setCurrentView('profile')}
                className={`mb-6 flex items-center gap-2 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors`}
              >
                ← Zurück zum Profil
              </button>

              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📜 Impressum
              </h2>

              <LegalImprintContent
                containerClassName={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                headingClassName={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                textClassName="text-sm leading-relaxed"
                noteClassName={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              />
            </div>
          </div>
  );
};

export default ImpressumView;
