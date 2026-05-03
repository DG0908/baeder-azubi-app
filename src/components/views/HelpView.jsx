import { useApp } from '../../context/AppContext';

const HELP_PDF_URL = '/hilfe/spielanleitung.pdf';

export default function HelpView({ setCurrentView, user }) {
  const { darkMode } = useApp();
  const isTrainer = user?.permissions?.canViewAllStats;
  const isAdmin = user?.permissions?.canManageUsers;

  const cardCls = `${darkMode ? 'bg-slate-800 text-gray-200' : 'bg-white text-gray-700'} rounded-xl p-6 md:p-8 shadow-lg`;
  const h2Cls = `text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`;
  const h3Cls = `text-lg font-bold mt-6 mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`;
  const h4Cls = `font-semibold mt-4 mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`;
  const pCls = 'text-sm leading-relaxed mb-2';
  const liCls = 'text-sm leading-relaxed';
  const ulCls = 'list-disc pl-5 space-y-1 mb-3';
  const subtleCls = `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className={cardCls}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-2 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors text-sm`}
          >
            ← Zurück zum Start
          </button>
          <a
            href={HELP_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 hover:bg-cyan-500/25' : 'bg-cyan-50 border border-cyan-200 text-cyan-700 hover:bg-cyan-100'}`}
          >
            📄 Als PDF herunterladen
          </a>
        </div>

        <h2 className={h2Cls}>❓ Hilfe & Spielanleitung</h2>
        <p className={subtleCls}>Version 1 · Mai 2026 · Lesezeit ca. 10 Minuten</p>

        <h3 className={h3Cls}>1. Was ist die App?</h3>
        <p className={pCls}>
          Die Bäder-Azubi App ist dein digitaler Lernbegleiter für die Ausbildung zum
          {' '}<strong>Fachangestellten für Bäderbetriebe (FAB)</strong>. Sie kombiniert:
        </p>
        <ul className={ulCls}>
          <li className={liCls}><strong>Lernen</strong> — Quiz, Karteikarten, Lexikon, Prüfungssimulator, Notfalltrainer</li>
          <li className={liCls}><strong>Wettkampf</strong> — Quizduelle, Schwimm-Challenges, Leaderboards</li>
          <li className={liCls}><strong>Dokumentation</strong> — Berichtsheft, Schulkarte, Prüfungsnoten</li>
          <li className={liCls}><strong>Werkzeuge</strong> — Chemie-Rechner für den Bad-Alltag (pH, Chlor, Flockung …)</li>
        </ul>
        <p className={pCls}>
          Die App läuft im Browser und kann als App auf dein Handy installiert werden (siehe Kapitel 8).
        </p>

        <h3 className={h3Cls}>2. Erste Schritte</h3>
        <h4 className={h4Cls}>Login & Registrierung</h4>
        <ul className={ulCls}>
          <li className={liCls}>Melde dich mit <strong>E-Mail und Passwort</strong> an.</li>
          <li className={liCls}>Bei der ersten Anmeldung gibst du einen <strong>Einladungscode</strong> deines Betriebs ein.</li>
          <li className={liCls}>Optional: <strong>2-Faktor-Authentisierung (2FA)</strong> im Profil aktivieren — empfohlen für Trainer und Admins.</li>
        </ul>

        <h4 className={h4Cls}>Profil einrichten</h4>
        <ol className="list-decimal pl-5 space-y-1 mb-3">
          <li className={liCls}>Tippe oben links auf deinen Avatar → du landest im Profil.</li>
          <li className={liCls}>Trage <strong>Name</strong> und <strong>Geburtsdatum</strong> ein (für Alters-Handicaps in der Schwimm-Challenge).</li>
          <li className={liCls}>Wähle einen <strong>Avatar</strong>. Weitere schaltest du durch Level, Siege oder Achievements frei.</li>
          <li className={liCls}>Erlaube <strong>Push-Benachrichtigungen</strong>, um über neue Quizduelle und News informiert zu werden.</li>
        </ol>

        <h4 className={h4Cls}>Navigation</h4>
        <ul className={ulCls}>
          <li className={liCls}><strong>Desktop:</strong> Seitenleiste links (ein-/ausklappbar).</li>
          <li className={liCls}><strong>Mobil:</strong> Untere Tab-Leiste (Start, Prüfung, Quiz, Bericht, Mehr) — Rest unter „Mehr".</li>
          <li className={liCls}><strong>Oben rechts:</strong> Tag/Nacht-Modus, Sound, Hilfe (?), Benachrichtigungen, Abmelden.</li>
        </ul>

        <h3 className={h3Cls}>3. Lernen</h3>

        <h4 className={h4Cls}>Quiz (Solo)</h4>
        <p className={pCls}>
          Solo-Modus zum Üben. Wähle <strong>Kategorie</strong> (Technik, Schwimmen, Hygiene, Erste Hilfe, Recht …)
          und <strong>Schwierigkeit</strong> (Anfänger 45 s, Profi 30 s, Experte 15 s, Extra-Schwer 75 s).
          Pro richtige Antwort gibt es XP. Sofortiges Feedback nach jeder Frage.
        </p>

        <h4 className={h4Cls}>Quizduell (1 vs. 1)</h4>
        <p className={pCls}>
          Multiplayer gegen andere Azubis. Fordere einen Spieler heraus oder nimm offene Challenges an.
          Beide beantworten dieselben Fragen, Punkte werden live verglichen. Sieg bringt <strong>+40 XP</strong>.
          Es gibt eine Bestenliste pro Gegner (Head-to-Head).
        </p>

        <h4 className={h4Cls}>Karteikarten (Flashcards)</h4>
        <ul className={ulCls}>
          <li className={liCls}><strong>Klassisch:</strong> Vorderseite Frage → Rückseite Antwort.</li>
          <li className={liCls}><strong>Schlagwort-Modus:</strong> Du tippst die Antwort frei ein, das System prüft die wichtigsten Stichwörter.</li>
          <li className={liCls}><strong>Wer bin ich?-Modus:</strong> Rätselformat mit Hinweisen.</li>
          <li className={liCls}><strong>Spaced Repetition:</strong> Schwierige Karten kommen häufiger, leichte seltener.</li>
          <li className={liCls}><strong>Eigene Karten erstellen:</strong> +15 XP — Admin gibt sie für alle frei.</li>
        </ul>

        <h4 className={h4Cls}>Notfalltrainer</h4>
        <p className={pCls}>
          Interaktive Erste-Hilfe-Szenarien („Person ertrinkt", „Bewusstlose am Beckenrand", „Gasgeruch im Chlorgasraum" …).
          Du entscheidest Schritt für Schritt — nach jedem Schritt gibt's Feedback. Perfekt zur Prüfungsvorbereitung.
        </p>

        <h4 className={h4Cls}>Prüfungssimulator</h4>
        <ul className={ulCls}>
          <li className={liCls}><strong>Theorie:</strong> Echte Prüfungsfragen, adaptive Schwierigkeit, Auswertung in % + Fehleranalyse.</li>
          <li className={liCls}><strong>Praxis:</strong> Eintragen praktischer Leistungen (100-m-Zeiten, Rettungssprung) mit Vergleich zu anderen.</li>
        </ul>

        <h4 className={h4Cls}>Lexikon (Interaktives Lernen)</h4>
        <p className={pCls}>
          Wissensdatenbank mit Texten, Bildern und kleinen Übungen — z. B. „Chlor-Desinfektion", „Hubboden",
          „Notwehr & Nothilfe", „Beckenarten". Zum Nachschlagen oder ganzen Themenblöcken.
        </p>

        <h4 className={h4Cls}>Englisch-Lektionen</h4>
        <p className={pCls}>
          Mini-Sprachkurs mit Schwimm-Fachvokabular (Englisch ↔ Deutsch), Aussprache und kleinen Übungen.
        </p>

        <h3 className={h3Cls}>4. Dokumentation</h3>

        <h4 className={h4Cls}>Berichtsheft</h4>
        <p className={pCls}>Dein digitales Ausbildungsnachweisheft. Sieben Tabs:</p>
        <ul className={ulCls}>
          <li className={liCls}><strong>Liste:</strong> alle Einträge im Überblick.</li>
          <li className={liCls}><strong>Bearbeiten:</strong> neuen Wocheneintrag schreiben (Tätigkeiten + Stunden pro Tag).</li>
          <li className={liCls}><strong>Unterschreiben:</strong> du und Ausbilder signieren digital.</li>
          <li className={liCls}><strong>Kalender:</strong> Wochenansicht.</li>
          <li className={liCls}><strong>Profil:</strong> Stammdaten (Betrieb, Klasse).</li>
          <li className={liCls}><strong>Fortschritt:</strong> wie viele Stunden in welchem Bereich?</li>
          <li className={liCls}><strong>Monat:</strong> Monatsreport für die IHK.</li>
        </ul>
        <p className={pCls}><em>Tipp:</em> Schreib den Eintrag am Freitag, nicht erst am Quartalsende.</p>

        <h4 className={h4Cls}>Schulkarte</h4>
        <p className={pCls}>
          Nachweis deiner Berufsschultage (Datum, Uhrzeit, Lehrer-Unterschrift). Wichtig fürs Ausbildungsende.
        </p>

        <h4 className={h4Cls}>Prüfungs-Übersicht</h4>
        <p className={pCls}>
          Kalender für anstehende Klausuren mit Themen und Material. Lehrer/Trainer können Noten eintragen,
          du siehst deinen Notenverlauf farbig.
        </p>

        <h3 className={h3Cls}>5. Spezial-Module</h3>

        <h4 className={h4Cls}>Schwimm-Challenge</h4>
        <ul className={ulCls}>
          <li className={liCls}><strong>Sessions</strong> eintragen (Datum, Distanz, Stilart) — Trainer bestätigt.</li>
          <li className={liCls}><strong>Trainingspläne</strong> abarbeiten (vorgefertigt oder selbst erstellt).</li>
          <li className={liCls}><strong>Battle Arena</strong> — direkter Vergleich (Brust, Kraul, Rücken, Tauchen …).</li>
          <li className={liCls}><strong>Leaderboard</strong> mit Alters-Handicap.</li>
        </ul>

        <h4 className={h4Cls}>Rechner</h4>
        <p className={pCls}>Werkzeugkasten für den Bad-Alltag, mit echten Produktdaten:</p>
        <ul className={ulCls}>
          <li className={liCls}><strong>pH-Rechner</strong> — Korrekturmenge bei zu hohem/niedrigem pH.</li>
          <li className={liCls}><strong>Chlor-Rechner</strong> — Dosierung verschiedener Chlor-Präparate.</li>
          <li className={liCls}><strong>Volumen-Rechner</strong> — Beckenvolumen aus Maßen.</li>
          <li className={liCls}><strong>Verdünnungs-Rechner</strong> — Konzentrat ↔ Wasser.</li>
          <li className={liCls}><strong>Flockungs-Rechner</strong> — Flockungsmittel-Dosierung.</li>
          <li className={liCls}><strong>Periodensystem</strong> — Elemente nachschlagen.</li>
          <li className={liCls}><strong>Schicht-Rechner</strong> — Industriezeit.</li>
        </ul>

        <h3 className={h3Cls}>6. Fortschritt & Belohnungen</h3>

        <h4 className={h4Cls}>XP & Level</h4>
        <p className={pCls}>Du sammelst XP für fast jede Aktivität:</p>
        <div className="overflow-x-auto mb-3">
          <table className={`w-full text-sm border-collapse ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <thead>
              <tr className={darkMode ? 'border-b border-slate-600' : 'border-b border-gray-300'}>
                <th className="text-left py-1 pr-3 font-semibold">Aktion</th>
                <th className="text-right py-1 font-semibold">XP</th>
              </tr>
            </thead>
            <tbody>
              <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-gray-100'}><td className="py-1 pr-3">Quizduell gewonnen</td><td className="text-right">+40</td></tr>
              <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-gray-100'}><td className="py-1 pr-3">Prüfung bestanden</td><td className="text-right">+20 (+15 Bonus)</td></tr>
              <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-gray-100'}><td className="py-1 pr-3">Korrekte Prüfungsfrage</td><td className="text-right">+1</td></tr>
              <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-gray-100'}><td className="py-1 pr-3">Karteikarte gelernt</td><td className="text-right">+1</td></tr>
              <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-gray-100'}><td className="py-1 pr-3">Karteikarte erstellt</td><td className="text-right">+15</td></tr>
              <tr><td className="py-1 pr-3">Schwimm-Trainingsplan absolviert</td><td className="text-right">variabel</td></tr>
            </tbody>
          </table>
        </div>
        <p className={pCls}>Mit jedem Level steigt dein Rang im Header. Höhere Level schalten exklusive Avatare frei.</p>

        <h4 className={h4Cls}>Statistik</h4>
        <p className={pCls}>
          Eigenes Dashboard: XP-Total, Level, Win-Rate, Streaks, Kategorie-Stärken.
          <strong> Leaderboard</strong> für Vergleich mit anderen.
          Identifiziert deine Schwachstellen — wenn du in „Recht" bei 40 % stehst, weißt du, wo du nachlegen musst.
        </p>

        <h4 className={h4Cls}>Sammlung</h4>
        <ul className={ulCls}>
          <li className={liCls}><strong>Avatare</strong> in fünf Stufen (Standard, Bronze, Silber, Gold, Legendär).</li>
          <li className={liCls}><strong>Badges</strong> für besondere Leistungen (z. B. „100 Quiz-Siege", „1000 m geschwommen").</li>
        </ul>

        {(isTrainer || isAdmin) && (
          <>
            <h3 className={h3Cls}>7. Trainer- und Admin-Funktionen</h3>
            {isTrainer && (
              <>
                <h4 className={h4Cls}>Trainer / Ausbilder</h4>
                <ul className={ulCls}>
                  <li className={liCls}><strong>Trainer-Dashboard</strong> — Übersicht aller deiner Azubis (Level, Win-Rate, Prüfungsnoten).</li>
                  <li className={liCls}><strong>Berichtsheft signieren</strong> — Einträge deiner Azubis bestätigen.</li>
                  <li className={liCls}><strong>Schwimm-Sessions bestätigen</strong> — bevor sie ins Leaderboard zählen.</li>
                  <li className={liCls}><strong>News & Materialien posten</strong> — Ankündigungen und Arbeitsblätter bereitstellen.</li>
                </ul>
              </>
            )}
            {isAdmin && (
              <>
                <h4 className={h4Cls}>Admin / Inhaber</h4>
                <ul className={ulCls}>
                  <li className={liCls}><strong>Organisationen</strong> anlegen (Betriebe).</li>
                  <li className={liCls}><strong>Einladungscodes</strong> erstellen mit Limit (z. B. 30 Anmeldungen).</li>
                  <li className={liCls}><strong>Benutzer verwalten</strong> — Passwörter zurücksetzen, Avatare freischalten, Accounts löschen.</li>
                  <li className={liCls}><strong>Inhalte moderieren</strong> — eingereichte Fragen und Karteikarten freigeben.</li>
                  <li className={liCls}><strong>Feature-Rollout</strong> — neue Features für einzelne Betriebe testen.</li>
                </ul>
              </>
            )}
          </>
        )}

        <h3 className={h3Cls}>8. Tipps, FAQ & Hilfe</h3>

        <h4 className={h4Cls}>Was geht — und was nicht?</h4>
        <ul className={ulCls}>
          <li className={liCls}><strong>Geht:</strong> Lernen ohne Internet (kurzzeitig) — Daten werden synchronisiert, sobald du wieder online bist.</li>
          <li className={liCls}><strong>Geht nicht:</strong> Quizduell ohne Internet — beide Spieler brauchen aktive Verbindung.</li>
          <li className={liCls}><strong>Geht:</strong> Eigene Karteikarten erstellen — werden aber erst nach Admin-Freigabe für alle sichtbar.</li>
          <li className={liCls}><strong>Geht nicht:</strong> Selbst Avatare hochladen — Avatare werden zentral vom Admin gepflegt.</li>
          <li className={liCls}><strong>Geht:</strong> Berichtsheft als PDF exportieren.</li>
          <li className={liCls}><strong>Geht nicht:</strong> Punkte/XP von Hand setzen (außer Admin) — manipulationssicher.</li>
        </ul>

        <h4 className={h4Cls}>Als App installieren (PWA)</h4>
        <ul className={ulCls}>
          <li className={liCls}><strong>Android (Chrome):</strong> Browser-Menü → „Zum Startbildschirm hinzufügen".</li>
          <li className={liCls}><strong>iOS (Safari):</strong> Teilen-Symbol → „Zum Home-Bildschirm".</li>
          <li className={liCls}><strong>Desktop (Chrome/Edge):</strong> Symbol in der Adressleiste „App installieren".</li>
        </ul>

        <h4 className={h4Cls}>Häufige Fragen</h4>
        <p className={pCls}><strong>Ich habe mein Passwort vergessen.</strong> → „Passwort vergessen" auf der Login-Seite oder Trainer/Admin bitten, es zurückzusetzen.</p>
        <p className={pCls}><strong>Ich sehe ein Modul aus dieser Anleitung nicht.</strong> → Möglicherweise ist es für deinen Betrieb noch nicht freigeschaltet. Frag deinen Ausbilder oder Admin.</p>
        <p className={pCls}><strong>Mein Quizduell hängt.</strong> → Tab/App neu laden. Das System erkennt unterbrochene Spiele und setzt sie fort. Wenn nicht: dem Admin Bescheid geben.</p>
        <p className={pCls}><strong>Wie aktualisiere ich die App?</strong> → Wenn ein Update bereitsteht, erscheint oben rechts ein grüner ⬆️-Button. Einmal antippen — fertig.</p>

        <h4 className={h4Cls}>Datenschutz</h4>
        <ul className={ulCls}>
          <li className={liCls}>Alle Daten liegen DSGVO-konform auf deutschen Servern.</li>
          <li className={liCls}>Impressum, AGB und Datenschutzerklärung findest du im Profil und Footer der App.</li>
          <li className={liCls}>Account-Löschung jederzeit über das Profil möglich.</li>
        </ul>

        <h4 className={h4Cls}>Support</h4>
        <p className={pCls}>
          Bei Fragen oder Problemen wende dich an deinen Ausbilder oder den Admin deines Betriebs.
          Bei technischen Problemen: über das Kontaktformular im Impressum.
        </p>

        <p className={`mt-8 text-center font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
          Viel Erfolg in deiner Ausbildung! 🏊
        </p>
      </div>
    </div>
  );
}
