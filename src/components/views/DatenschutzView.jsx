import React from 'react';
import { useApp } from '../../context/AppContext';

const DatenschutzView = (props) => {
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

              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🔒 Datenschutzerklärung
              </h2>
              <p className={`text-xs mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Stand: Januar 2025 | Diese Datenschutzerklärung gilt für die Nutzung von Aqua Pilot.
              </p>

              <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>1. Verantwortlicher</h3>
                  <p className="text-sm">Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg<br/>E-Mail: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>2. Zwecke der Datenverarbeitung</h3>
                  <p className="text-sm leading-relaxed mb-2">Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zur:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Bereitstellung der App-Funktionen</li>
                    <li>Unterstützung von Ausbildungsprozessen (Berichtsheft, Lernfortschritt, Kommunikation)</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>3. Verarbeitete Datenarten</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li><strong>Stammdaten:</strong> Name, E-Mail-Adresse, optional Geburtsdatum</li>
                    <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, aktive Module</li>
                    <li><strong>Lern- & Ausbildungsdaten:</strong> Quiz-Ergebnisse, Berichtshefteinträge, Schwimmeinheiten, Schulungsfortschritte</li>
                    <li><strong>Kommunikationsdaten:</strong> Chatnachrichten innerhalb der App</li>
                    <li><strong>Ausbilderdaten:</strong> Kontrollkarten, Kommentare, Freigaben</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>4. Rechtsgrundlagen der Verarbeitung</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung/Ausbildungsverhältnis)</li>
                    <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: z. B. Systembetrieb, Support)</li>
                    <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z. B. für Chatfunktion)</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>5. Empfänger der Daten</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>IT-Dienstleister (z. B. Supabase für Hosting)</li>
                    <li>Keine Weitergabe an Dritte zu Werbezwecken</li>
                    <li>Datenverarbeitung erfolgt ausschließlich innerhalb der EU</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>6. Speicherdauer</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li><strong>Azubis:</strong> Löschung 3 Monate nach Ausbildungsende</li>
                    <li><strong>Ausbilder:innen:</strong> Löschung 6 Monate nach Inaktivität</li>
                    <li><strong>Admins:</strong> regelmäßige Löschprüfung jährlich</li>
                    <li><strong>Chatnachrichten:</strong> max. 12 Monate, dann automatische Löschung</li>
                    <li><strong>Berichtshefte:</strong> Löschung spätestens 1 Jahr nach Ausbildungsende</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>7. Betroffenenrechte</h3>
                  <p className="text-sm leading-relaxed mb-2">Du hast das Recht auf:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Auskunft (Art. 15 DSGVO)</li>
                    <li>Berichtigung (Art. 16 DSGVO)</li>
                    <li>Löschung (Art. 17 DSGVO)</li>
                    <li>Einschränkung (Art. 18 DSGVO)</li>
                    <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                    <li>Widerspruch (Art. 21 DSGVO)</li>
                    <li>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
                  </ul>
                  <p className="text-sm leading-relaxed mt-2">Anfragen bitte per E-Mail an: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>8. Cookies und lokale Speicherung</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Die App nutzt kein Tracking</li>
                    <li>Es wird ausschließlich Local Storage verwendet (z. B. für Einstellungen und Anmeldedaten)</li>
                    <li>Es erfolgt keine Analyse oder Weitergabe dieser Daten</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>9. Sicherheit der Verarbeitung</h3>
                  <p className="text-sm leading-relaxed mb-2">Zum Schutz deiner Daten setzen wir technische und organisatorische Maßnahmen ein:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Verschlüsselte Übertragung (TLS)</li>
                    <li>Zugriffsrechte nach Rolle</li>
                    <li>Datensicherung</li>
                    <li>Regelmäßige Updates</li>
                  </ul>
                </section>

                <section className={`pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <p className="text-xs text-gray-500">
                    Diese Datenschutzerklärung wird regelmäßig aktualisiert. Letzte Aktualisierung: Januar 2025
                  </p>
                </section>
              </div>
            </div>
          </div>
  );
};

export default DatenschutzView;
