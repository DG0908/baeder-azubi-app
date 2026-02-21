import React from 'react';
import { Lock, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

          <div className="space-y-4 text-gray-700 text-sm">
            <section>
              <h3 className="font-bold text-gray-800">Angaben gemäß § 5 TMG</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">Kontakt</h3>
              <p>E-Mail: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">Verantwortlich für den Inhalt</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg</p>
            </section>
          </div>
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
          <p className="text-xs text-gray-500 mb-4">Stand: Januar 2025 | Diese Datenschutzerklärung gilt für die Nutzung der Bäder-Azubi App.</p>

          <div className="space-y-4 text-gray-700 text-sm">
            <section>
              <h3 className="font-bold text-gray-800">1. Verantwortlicher</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg<br/>E-Mail: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">2. Zwecke der Datenverarbeitung</h3>
              <p>Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zur:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Bereitstellung der App-Funktionen</li>
                <li>Unterstützung von Ausbildungsprozessen (Berichtsheft, Lernfortschritt, Kommunikation)</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">3. Verarbeitete Datenarten</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li><strong>Stammdaten:</strong> Name, E-Mail-Adresse, optional Geburtsdatum</li>
                <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, aktive Module</li>
                <li><strong>Lern- & Ausbildungsdaten:</strong> Quiz-Ergebnisse, Berichtshefteinträge, Schwimmeinheiten, Schulungsfortschritte</li>
                <li><strong>Kommunikationsdaten:</strong> Chatnachrichten innerhalb der App</li>
                <li><strong>Ausbilderdaten:</strong> Kontrollkarten, Kommentare, Freigaben</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">4. Rechtsgrundlagen der Verarbeitung</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung/Ausbildungsverhältnis)</li>
                <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: z. B. Systembetrieb, Support)</li>
                <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z. B. für Chatfunktion)</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">5. Empfänger der Daten</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>IT-Dienstleister (z. B. Hosting, Wartung)</li>
                <li>Keine Weitergabe an Dritte zu Werbezwecken</li>
                <li>Datenverarbeitung erfolgt ausschließlich innerhalb der EU</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">6. Speicherdauer</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li><strong>Azubis:</strong> Löschung 3 Monate nach Ausbildungsende</li>
                <li><strong>Ausbilder:innen:</strong> Löschung 6 Monate nach Inaktivität</li>
                <li><strong>Admins:</strong> regelmäßige Löschprüfung jährlich</li>
                <li><strong>Chatnachrichten:</strong> max. 12 Monate, dann automatische Löschung</li>
                <li><strong>Berichtshefte:</strong> Löschung spätestens 1 Jahr nach Ausbildungsende</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">7. Betroffenenrechte</h3>
              <p>Du hast das Recht auf:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Auskunft (Art. 15 DSGVO)</li>
                <li>Berichtigung (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch (Art. 21 DSGVO)</li>
                <li>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
              </ul>
              <p className="mt-2">Anfragen bitte per E-Mail an: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">8. Cookies und lokale Speicherung</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Die App nutzt kein Tracking</li>
                <li>Es wird ausschließlich Local Storage verwendet (z. B. für Einstellungen und Anmeldedaten)</li>
                <li>Es erfolgt keine Analyse oder Weitergabe dieser Daten</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">9. Sicherheit der Verarbeitung</h3>
              <p>Zum Schutz deiner Daten setzen wir technische und organisatorische Maßnahmen ein:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Verschlüsselte Übertragung (TLS)</li>
                <li>Zugriffsrechte nach Rolle</li>
                <li>Datensicherung</li>
                <li>Regelmäßige Updates</li>
              </ul>
            </section>
            <section className="pt-2 border-t border-gray-200 text-xs text-gray-500">
              <p>Diese Datenschutzerklärung wird regelmäßig aktualisiert. Letzte Aktualisierung: Januar 2025</p>
            </section>
          </div>
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
          <img src="/icons/icon-192x192.png" alt="FAB Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-cyan-700 mb-2">Bäder-Azubi App</h1>
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
          <div className="space-y-4">
            <input
              type="text"
              placeholder="E-Mail oder Name"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              <Lock className="inline mr-2" size={20} />
              Anmelden
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Vollständiger Name"
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="E-Mail"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <select
              value={registerData.role}
              onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="azubi">Azubi</option>
              <option value="trainer">Ausbilder</option>
              <option value="admin">Administrator</option>
            </select>
            {registerData.role === 'azubi' && (
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
                  <AlertTriangle className="inline" size={12} /> Deine Daten werden nach Ausbildungsende automatisch gelöscht.
                </p>
              </div>
            )}

            <button
              onClick={handleRegister}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              <Shield className="inline mr-2" size={20} />
              Registrierung beantragen
            </button>
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-sm text-cyan-800">
              <Shield className="inline mr-2" size={16} />
              Nach der Registrierung muss dein Account von einem Administrator freigeschaltet werden.
            </div>
          </div>
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
