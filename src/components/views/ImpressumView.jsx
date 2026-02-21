import React from 'react';
import { useApp } from '../../context/AppContext';

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

              <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Angaben gemäß § 5 TMG</h3>
                  <p>Dennie Gulbinski</p>
                  <p>Zeitstraße 108</p>
                  <p>53721 Siegburg</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kontakt</h3>
                  <p>E-Mail: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                  <p>Dennie Gulbinski</p>
                  <p>Zeitstraße 108</p>
                  <p>53721 Siegburg</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Haftungsausschluss</h3>
                  <p className="text-sm leading-relaxed">
                    Die Inhalte dieser App wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
                    Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter sind wir gemäß
                    § 7 Abs.1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich.
                  </p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Urheberrecht</h3>
                  <p className="text-sm leading-relaxed">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht.
                    Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
                    Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </section>
              </div>
            </div>
          </div>
  );
};

export default ImpressumView;
