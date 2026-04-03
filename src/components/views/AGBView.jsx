import React from 'react';
import { useApp } from '../../context/AppContext';
import { LegalTermsContent } from '../legal/LegalContent';

const AGBView = ({ setCurrentView }) => {
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

        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📋 Nutzungsbedingungen (AGB)
        </h2>
        <LegalTermsContent
          introClassName={`text-xs mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          containerClassName={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          headingClassName={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}
          textClassName="text-sm leading-relaxed"
          dividerClassName={`pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}
          noteClassName={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        />
      </div>
    </div>
  );
};

export default AGBView;
