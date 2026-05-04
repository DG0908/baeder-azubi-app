import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '🩺' },
  formen:     { label: 'Schockformen', icon: '🔀' },
  symptome:   { label: 'Schockzeichen', icon: '⚠️' },
  lagerung:   { label: 'Lagerung', icon: '🛌' },
  bad:        { label: 'Im Bäderbetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function SchockDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 border border-red-800' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🩺</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Schock — Erkennung & Lagerung</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Kreislaufversagen rechtzeitig erkennen, richtig lagern, Notruf absetzen</p>
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
          <S title="Was ist ein Schock?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Schock = <strong>akutes Kreislaufversagen</strong>. Die Sauerstoffversorgung der Organe ist gestört —
              durch zu wenig Blutvolumen, schwaches Pumpen des Herzens, Gefäßweitstellung oder eine Verteilungsstörung.
              Unbehandelt führt der Schock zum Multiorganversagen.
            </p>
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Folge:</strong> Körper „zentralisiert" — Blut wird auf lebenswichtige Organe (Herz, Hirn) konzentriert,
              Haut und Extremitäten werden schlechter versorgt → Blässe, Kälte, Schwitzen, Pulsanstieg.
            </div>
          </S>

          <S title="Schockindex (Faustregel)" darkMode={darkMode}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Schockindex = Puls / systolischer Blutdruck</strong>. Hilft die Schwere abzuschätzen:
            </div>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Index</th><th className="text-left p-2">Bewertung</th></tr>
                </thead>
                <tbody>
                  {[
                    ['< 0,5', 'Normal — z. B. Puls 70 / RR 140 = 0,5'],
                    ['0,5–1,0', 'Drohender Schock — Aufmerksamkeit'],
                    ['> 1,0', 'Manifester Schock — Notruf 112'],
                    ['> 1,5', 'Schwerer Schock — Lebensgefahr'],
                  ].map(([idx, b], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-mono font-bold">{idx}</td>
                      <td className="p-2">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Im Bad meist ohne Blutdruckmessgerät — als Faustregel: <strong>Puls schneller als Blutdruck-Zahl</strong> = Alarm.
            </div>
          </S>
        </div>
      )}

      {tab === 'formen' && (
        <div>
          <S title="Die 4 Schockformen" darkMode={darkMode}>
            {[
              { name: 'Hypovolämischer Schock', icon: '🩸', color: 'red',
                ursache: 'Blut-/Volumenverlust', detail: 'Starke Blutung, schwere Verbrennung, Erbrechen/Durchfall, Dehydration. Im Bad: tiefe Schnittwunde an Glasscherben, schwere Sturzverletzung.' },
              { name: 'Kardiogener Schock', icon: '❤️', color: 'rose',
                ursache: 'Herzpumpversagen', detail: 'Herzinfarkt, schwere Herzrhythmusstörung, Lungenembolie. Im Bad: meist bei älteren Gästen, Kreislaufkollaps an heißem Tag.' },
              { name: 'Septischer Schock', icon: '🦠', color: 'orange',
                ursache: 'Schwere Infektion', detail: 'Bakterien­toxine erweitern Gefäße. Im Bad selten akut — eher Folgekomplikation einer Wunde Tage später.' },
              { name: 'Anaphylaktischer Schock', icon: '🐝', color: 'amber',
                ursache: 'Allergische Reaktion', detail: 'Gefäßweitstellung + Kapillarleck + Bronchospasmus. Im Bad: Wespenstich, Nahrungsmittel im Bistro. → Modul Anaphylaxie!' },
              { name: 'Neurogener Schock', icon: '🧠', color: 'purple',
                ursache: 'Nervensystem-Versagen', detail: 'Wirbelsäulenverletzung, schwere Schmerzen, psychischer Schock. Im Bad: Kopfsprung-Unfall mit HWS-Verletzung.' },
            ].map(({ name, icon, color, ursache, detail }) => {
              const cols = {
                red:    darkMode ? 'border-red-500 bg-red-900/20'       : 'border-red-400 bg-red-50',
                rose:   darkMode ? 'border-rose-500 bg-rose-900/20'     : 'border-rose-400 bg-rose-50',
                orange: darkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50',
                amber:  darkMode ? 'border-amber-500 bg-amber-900/20'   : 'border-amber-400 bg-amber-50',
                purple: darkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-400 bg-purple-50',
              };
              const tc = {
                red:    darkMode ? 'text-red-300'    : 'text-red-800',
                rose:   darkMode ? 'text-rose-300'   : 'text-rose-800',
                orange: darkMode ? 'text-orange-300' : 'text-orange-800',
                amber:  darkMode ? 'text-amber-300'  : 'text-amber-800',
                purple: darkMode ? 'text-purple-300' : 'text-purple-800',
              };
              return (
                <div key={name} className={`rounded-xl border-l-4 p-3 mb-2 ${cols[color]}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{icon}</span>
                    <span className={`text-sm font-bold ${tc[color]}`}>{name}</span>
                  </div>
                  <div className={`text-xs mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Ursache:</strong> {ursache}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{detail}</div>
                </div>
              );
            })}
          </S>
        </div>
      )}

      {tab === 'symptome' && (
        <div>
          <S title="Klassische Schockzeichen" darkMode={darkMode}>
            {[
              ['Haut', 'Blass, kalt, schweißnass („kalter Schweiß")'],
              ['Lippen / Fingerspitzen', 'Bläulich (Zyanose) — bei längerem Schock'],
              ['Puls', 'Schnell und schwach („fadenförmig"), > 100/min'],
              ['Atmung', 'Beschleunigt, oft flach, ggf. Lufthunger'],
              ['Bewusstsein', 'Unruhe, Angst, später Apathie, Verwirrtheit, Bewusstlosigkeit'],
              ['Durst', 'Starker Durst (besonders bei hypovolämischem Schock)'],
              ['Blutdruck', 'Sinkt — kann früh aber noch normal sein! (Kompensation)'],
              ['Übelkeit', 'Häufig, mit oder ohne Erbrechen'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-amber-900/40 border border-amber-700' : 'bg-amber-50 border border-amber-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>⚠️ Schock-Phasen</div>
            <div className={`text-xs space-y-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              <div><strong>Phase 1 (Kompensation):</strong> Blutdruck noch normal, Puls steigt, Patient wirkt unruhig — schon JETZT handeln!</div>
              <div><strong>Phase 2 (Dekompensation):</strong> Blutdruck fällt, Bewusstsein lässt nach, Hautfarbe blass-grau.</div>
              <div><strong>Phase 3 (Irreversibel):</strong> Multiorganversagen — auch mit Behandlung oft nicht mehr zu retten.</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'lagerung' && (
        <div>
          <S title="Lagerung — je nach Situation" darkMode={darkMode}>
            {[
              { titel: 'Schocklage (Beine hoch)', wann: 'Hypovolämischer Schock, Kreislaufkollaps OHNE Atemnot, OHNE Brust- oder Bauchverletzung',
                wie: 'Patient flach auf den Rücken, Beine ca. 30 cm anheben (Kissen, Stuhl, Helfer halten). Mehr Blut im Stamm → Versorgung Hirn/Herz.',
                farbe: 'red' },
              { titel: 'Halbsitzend mit Stütze', wann: 'Atemnot, Asthma, Herzinfarkt-Verdacht, Lungenödem',
                wie: 'Oberkörper aufrecht, Arme aufgestützt — entlastet Atmung und Herz. NICHT flach legen!',
                farbe: 'amber' },
              { titel: 'Stabile Seitenlage', wann: 'Bewusstlos + atmet noch normal',
                wie: 'Atemwege freihalten, Aspirationsschutz. Bei Schock + Bewusstlosigkeit gilt: Atemweg geht vor Schocklage.',
                farbe: 'orange' },
              { titel: 'Flach (ohne Anhebung)', wann: 'Wirbelsäulenverdacht (Kopfsprungunfall)',
                wie: 'Patient liegen lassen wo er liegt, Kopf neutral fixieren. Schocklage ist hier kontraindiziert.',
                farbe: 'purple' },
              { titel: 'Linke Seitenlage', wann: 'Schwangere ab ca. 16. SSW',
                wie: 'Linke Seite — entlastet Vena cava (drohendes Vena-cava-Kompressionssyndrom).',
                farbe: 'pink' },
            ].map(({ titel, wann, wie, farbe }) => {
              const cols = {
                red:    darkMode ? 'border-red-500 bg-red-900/20'       : 'border-red-400 bg-red-50',
                amber:  darkMode ? 'border-amber-500 bg-amber-900/20'   : 'border-amber-400 bg-amber-50',
                orange: darkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50',
                purple: darkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-400 bg-purple-50',
                pink:   darkMode ? 'border-pink-500 bg-pink-900/20'     : 'border-pink-400 bg-pink-50',
              };
              return (
                <div key={titel} className={`rounded-xl border-l-4 p-3 mb-2 ${cols[farbe]}`}>
                  <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{titel}</div>
                  <div className={`text-xs mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Wann:</strong> {wann}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Wie:</strong> {wie}</div>
                </div>
              );
            })}
          </S>

          <S title="Allgemeine Maßnahmen bei Schock" darkMode={darkMode}>
            {[
              'Notruf 112 — sofort, mit Hinweis „Schockzeichen"',
              'Ursache wenn möglich beheben (Blutung stillen, Allergen entfernen)',
              'Wärme erhalten — Rettungsdecke, Decke, nasse Kleidung entfernen',
              'Beruhigen, ständig ansprechen, nicht alleine lassen',
              'Vital­zeichen kontrollieren (Atmung, Bewusstsein, Puls) bis RD eintrifft',
              'NICHTS zu trinken oder essen geben — Operation könnte folgen',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-red-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Schock-Situationen im Bäderbetrieb" darkMode={darkMode}>
            {[
              { titel: '🩸 Schnittwunde an Glasscherben', text: 'Bei tiefer arterieller Blutung kann hypovolämischer Schock binnen Minuten entstehen — Druckverband, Beine hoch, 112.' },
              { titel: '🌡️ Hitze­kollaps am Sommertag', text: 'Im Freibad bei sehr alten Gästen oder Kreislauflabilen — kühlen Schatten, Beine hoch, Wasser in kleinen Schlucken (wenn bei Bewusstsein).' },
              { titel: '💔 Herzinfarkt­verdacht', text: 'Älterer Gast klagt über Brustenge, Atemnot, Kaltschweiß: NICHT flach legen, sondern halbsitzend mit Rückenstütze. 112!' },
              { titel: '🐝 Wespenstich → Anaphylaxie', text: 'Schwellung, Atemnot, Quaddeln nach Stich: Anaphylaxie-Modul beachten, Notruf 112. Schocklage nur wenn keine Atemnot.' },
              { titel: '🤕 Sturz / HWS-Verdacht', text: 'NIE Schocklage bei Wirbelsäulenverdacht — Patient flach lassen, Kopf fixieren, 112.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
