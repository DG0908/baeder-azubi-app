import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '🧬' },
  symptome:   { label: 'Symptome', icon: '⚠️' },
  massnahmen: { label: 'Erstmaßnahmen', icon: '🚑' },
  bad:        { label: 'Im Bäderbetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{title}</h3>}
    {children}
  </div>
);

const Stage = ({ grade, name, signs, color, darkMode }) => {
  const cols = {
    yellow: darkMode ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50',
    orange: darkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50',
    red:    darkMode ? 'border-red-500 bg-red-900/20'       : 'border-red-400 bg-red-50',
    rose:   darkMode ? 'border-rose-600 bg-rose-900/30'     : 'border-rose-500 bg-rose-50',
  };
  const tc = {
    yellow: darkMode ? 'text-yellow-300' : 'text-yellow-800',
    orange: darkMode ? 'text-orange-300' : 'text-orange-800',
    red:    darkMode ? 'text-red-300'    : 'text-red-800',
    rose:   darkMode ? 'text-rose-300'   : 'text-rose-800',
  };
  return (
    <div className={`rounded-xl border-l-4 p-3 mb-2 ${cols[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-white text-gray-700'}`}>Grad {grade}</span>
        <span className={`text-sm font-bold ${tc[color]}`}>{name}</span>
      </div>
      <ul className={`text-xs space-y-0.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
        {signs.map((s, i) => <li key={i}>→ {s}</li>)}
      </ul>
    </div>
  );
};

export default function AnaphylaxieDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 border border-red-800' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐝</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Anaphylaxie</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Allergischer Schock — schnell erkennen, sofort handeln</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-red-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'grundlagen' && (
        <div>
          <S title="Was ist eine Anaphylaxie?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die Anaphylaxie ist eine <strong>akute, lebensbedrohliche allergische Reaktion vom Soforttyp</strong> (Typ I).
              Das Immunsystem reagiert auf einen eigentlich harmlosen Stoff (Allergen) so massiv, dass das Herz-Kreislauf-System
              und die Atmung versagen können. Ohne Behandlung Lebensgefahr in wenigen Minuten.
            </p>
            <div className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Mechanismus:</strong> Allergen → IgE-Antikörper auf Mastzellen → Histamin und Botenstoffe werden freigesetzt → Gefäße erweitern sich, Kapillaren werden durchlässig (Ödeme), Bronchien verengen sich.</div>
            </div>
          </S>

          <S title="Häufige Auslöser im Bad" darkMode={darkMode}>
            {[
              { gruppe: 'Insektenstiche', detail: 'Wespen, Bienen, Hornissen — häufigster Auslöser im Freibad', icon: '🐝' },
              { gruppe: 'Nahrungsmittel', detail: 'Nüsse, Erdnüsse, Meeresfrüchte, Sellerie, Soja — am Bistro/Imbiss', icon: '🥜' },
              { gruppe: 'Latex', detail: 'Selten, aber möglich — z. B. Latexhandschuhe in der Erste-Hilfe-Versorgung', icon: '🧤' },
              { gruppe: 'Medikamente', detail: 'Antibiotika, Schmerzmittel — meist außerhalb des Bads relevant', icon: '💊' },
              { gruppe: 'Chlorallergie?', detail: 'Echte Chlor­allergie ist sehr selten. Häufiger: irritative Reizung der Haut/Atemwege durch Chloramine. Differenzieren!', icon: '🧪' },
            ].map(({ gruppe, detail, icon }) => (
              <div key={gruppe} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{icon} {gruppe}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{detail}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'symptome' && (
        <div>
          <S title="Schweregrade nach Ring & Messmer" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Anaphylaxie wird in 4 Schweregrade eingeteilt — der Verlauf kann aber rasch eskalieren.
              <strong> Schon ab Grad II ist Notruf 112 zwingend.</strong>
            </p>
            <Stage grade="I" name="Hautreaktion" color="yellow" darkMode={darkMode}
              signs={['Juckreiz, Quaddeln (Urtikaria)', 'Hautrötung („Flush")', 'Kribbeln an Lippen, Zunge, Handflächen']} />
            <Stage grade="II" name="Allgemeinreaktion" color="orange" darkMode={darkMode}
              signs={['Übelkeit, Bauchkrämpfe, Erbrechen', 'Atemnot, Heiserkeit, Schwellung im Mund-Rachen-Raum', 'Pulsanstieg, Blutdruckabfall', 'Unruhe, Angst', 'Notruf 112!']} />
            <Stage grade="III" name="Schwere Reaktion (Schock)" color="red" darkMode={darkMode}
              signs={['Bronchospasmus → Pfeifen, Erstickungsgefühl', 'Larynxödem → Heiserkeit, „Kloßgefühl"', 'Massiver Blutdruckabfall, Kreislaufschock', 'Bewusstseinstrübung']} />
            <Stage grade="IV" name="Atem-/Kreislaufstillstand" color="rose" darkMode={darkMode}
              signs={['Kein Puls, keine Atmung', 'Sofort HLW 30:2 + AED', 'Notarzt eingetroffen?']} />
          </S>

          <S title="Schnellerkennung — die 5 Warnzeichen" darkMode={darkMode}>
            {[
              ['Haut', 'Großflächige Rötung, Quaddeln, Juckreiz'],
              ['Atmung', 'Pfeifen, Atemnot, Heiserkeit, Husten'],
              ['Kreislauf', 'Schwindel, Kollaps, schneller schwacher Puls'],
              ['Magen-Darm', 'Übelkeit, Erbrechen, krampfartige Bauchschmerzen'],
              ['Allgemein', 'Unruhe, Vernichtungsgefühl, „mir ist plötzlich anders"'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'massnahmen' && (
        <div>
          <S title="Erstmaßnahmen — Reihenfolge" darkMode={darkMode}>
            {[
              { nr: '1', name: 'Auslöser entfernen', text: 'Insektenstachel mit Pinzette/Karte herausschieben (nicht quetschen). Allergen­kontakt sofort beenden. Bei Nahrungsmittel: Mund ausspülen.' },
              { nr: '2', name: 'Notruf 112', text: 'Sofort und mit Hinweis „anaphylaktischer Schock". Notarzt anfordern. Auf Atemwegssicherung hinweisen.' },
              { nr: '3', name: 'Lagerung anpassen', text: 'Kreislaufprobleme/Schock → Schocklage (Beine hoch). Atemnot → halbsitzend mit aufgestützten Armen. Bewusstlos + Atmung → stabile Seitenlage.' },
              { nr: '4', name: 'Notfall-Set des Patienten?', text: 'Allergiker tragen oft ein Notfall-Set: Adrenalin-Autoinjektor (z. B. EpiPen, Jext, Emerade) + Cortison + Antihistaminikum. Beim Auspacken helfen — nur der Patient selbst injiziert (Laienhilfe).' },
              { nr: '5', name: 'Adrenalin-Autoinjektor anwenden lassen', text: 'Patient setzt sich oder liegt — fester Druck seitlich an den Oberschenkel (durch die Kleidung möglich), 10 Sek. halten, danach Stelle massieren. Bei fehlender Wirkung nach 5–10 Min: zweite Dosis.' },
              { nr: '6', name: 'Vital­zeichen kontrollieren', text: 'Atmung, Bewusstsein, Puls regelmäßig prüfen. Bei Atem-Kreislaufstillstand → HLW 30:2 + AED.' },
              { nr: '7', name: 'Beruhigen, warm halten', text: 'Patient nicht alleine lassen. Decke/Rettungsdecke. Ruhig zureden — Stress verschlimmert die Reaktion.' },
            ].map(({ nr, name, text }) => (
              <div key={nr} className={`rounded-lg p-3 mb-2 flex gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <div>
                  <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{name}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
                </div>
              </div>
            ))}
          </S>

          <S title="Adrenalin-Autoinjektor — Anwendung" darkMode={darkMode}>
            <div className={`text-xs space-y-2 mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Wirkstoff:</strong> Adrenalin (Epinephrin) 0,3 mg (Erwachsene) / 0,15 mg (Kinder)</div>
              <div><strong>Wirkung:</strong> Verengt Gefäße (Blutdruck steigt), entspannt Bronchien, dämpft Allergiereaktion</div>
            </div>
            <div className={`rounded p-2 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <strong>Wichtig:</strong> Adrenalin ist ein verschreibungspflichtiges Medikament. Als Ersthelfer im Bad
              setzt du es <strong>nicht selbst</strong>. Du hilfst dem Patienten dabei, sein eigenes Notfall-Set anzuwenden,
              oder gibst es ihm griffbereit.
            </div>
          </S>

          <S title="Fehler vermeiden" darkMode={darkMode}>
            {[
              'NICHT auf „abklingen" warten — Verlauf kann sich plötzlich verschlechtern',
              'NICHT trinken lassen bei Atemnot oder Bewusstseinsstörung (Aspirationsgefahr)',
              'NICHT aufstehen lassen bei Kreislaufschwäche',
              'NICHT den Stachel mit den Fingern entfernen — Giftblase wird ausgedrückt',
              'NICHT ohne ärztliche Nachkontrolle entlassen — biphasische Reaktion möglich (2. Schub nach 4–8 Stunden)',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-red-500 font-bold">✗</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Anaphylaxie im Bäderbetrieb" darkMode={darkMode}>
            {[
              { titel: '🐝 Wespe & Co.', text: 'Im Freibad häufigste Ursache. Beim ersten Stich oft nur lokale Reaktion, beim zweiten kann sich eine Sensibilisierung zur Anaphylaxie entwickeln. Nach Stich Aufmerksamkeit erhöhen!' },
              { titel: '🍦 Imbiss / Bistro', text: 'Allergene auf Speisekarten kennzeichnen (LMIV, Verordnung 1169/2011). Personal schulen: Was tun, wenn Gast „ich vertrage keine Erdnüsse" sagt? — Ernst nehmen.' },
              { titel: '📋 Notfall-Set abfragen', text: 'Bei bekannten Allergikern (Schwimmkurse, Saisonkarten): Eltern/Schwimmer fragen, ob ein Notfall-Set mitgeführt wird, wo es liegt. Bei Schwimmkursen für Kinder: vorherige Abfrage Pflicht.' },
              { titel: '🧒 Kinder', text: 'Reagieren oft schneller und schwerer. Kinder-Autoinjektor (0,15 mg) ist anders — auf Eltern/Aufsicht hinweisen. Im Schwimmkurs: Allergie-Karte des Kindes kennen.' },
              { titel: '🚑 RD-Übergabe', text: 'Bei Übergabe genau angeben: Auslöser (vermutet), Zeitpunkt, Symptome, gegebene Medikamente, Verlauf. Notfall-Set + Reste mitgeben.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-red-900/40 border border-red-700' : 'bg-red-50 border border-red-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-red-200' : 'text-red-800'}`}>⏱ Zeit ist Leben</div>
            <div className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
              Eine schwere Anaphylaxie kann innerhalb von 5–30 Minuten zum Atem-Kreislaufstillstand führen.
              Lieber zu schnell den Notruf absetzen als zu spät.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
