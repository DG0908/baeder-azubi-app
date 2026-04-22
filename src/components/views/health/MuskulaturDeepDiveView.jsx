import { useState } from 'react';

const TABS = {
  typen:       { label: 'Muskeltypen', icon: '💪' },
  kontraktion: { label: 'Kontraktion', icon: '⚙️' },
  kraempfe:    { label: 'Krämpfe', icon: '⚡' },
  verletzung:  { label: 'Verletzungen', icon: '🩹' },
  bad:         { label: 'Im Badebetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{title}</h3>}
    {children}
  </div>
);

const MuskelCard = ({ name, icon, steuerung, ermüdung, ort, merkmale, darkMode, color }) => {
  const cols = {
    red: darkMode ? 'border-red-600 bg-red-900/20' : 'border-red-400 bg-red-50',
    blue: darkMode ? 'border-blue-600 bg-blue-900/20' : 'border-blue-400 bg-blue-50',
    green: darkMode ? 'border-green-600 bg-green-900/20' : 'border-green-400 bg-green-50',
  };
  const tc = { red: darkMode ? 'text-red-400' : 'text-red-700', blue: darkMode ? 'text-blue-400' : 'text-blue-700', green: darkMode ? 'text-green-400' : 'text-green-700' };
  return (
    <div className={`rounded-xl border-2 p-4 mb-3 ${cols[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-sm font-bold ${tc[color]}`}>{name}</span>
      </div>
      <div className={`text-xs grid grid-cols-2 gap-x-4 gap-y-1 mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
        <span><strong>Steuerung:</strong> {steuerung}</span>
        <span><strong>Ermüdung:</strong> {ermüdung}</span>
        <span className="col-span-2"><strong>Vorkommen:</strong> {ort}</span>
      </div>
      <ul className={`space-y-0.5 text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
        {merkmale.map((m, i) => <li key={i}>→ {m}</li>)}
      </ul>
    </div>
  );
};

export default function MuskulaturDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('typen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 border border-red-800' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">💪</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Muskulatur</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Typen · Kontraktion · Krämpfe · Verletzungen · Badebetrieb</p>
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

      {tab === 'typen' && (
        <div>
          <S title="Die 3 Muskeltypen" darkMode={darkMode}>
            <MuskelCard name="Quergestreifte Skelettmuskulatur" icon="💪" color="red" darkMode={darkMode}
              steuerung="Willkürlich (bewusst)" ermüdung="Ja — schnell"
              ort="An Knochen und Gelenken — Bewegungsapparat"
              merkmale={['Ca. 650 Skelettmuskeln im menschlichen Körper', 'Unter Mikroskop: Querstreifen sichtbar', 'Schnell kontrahierend, ermüdet bei Dauerbelastung', 'Relevanz Bad: Schwimmbewegungen, Rettungsgriffe']} />
            <MuskelCard name="Herzmuskelgewebe" icon="🫀" color="red" darkMode={darkMode}
              steuerung="Unwillkürlich (autonom)" ermüdung="Nein — Dauerarbeit"
              ort="Nur im Herzen"
              merkmale={['Wie Skelettmuskel quergestreift, aber unwillkürlich', 'Schlägt ~100.000×/Tag ohne Pause', 'Eigenes Erregungssystem (Sinusknoten)', 'Relevanz Bad: HLW-Ziel ist der Herzmuskel']} />
            <MuskelCard name="Glatte Muskulatur" icon="🌀" color="blue" darkMode={darkMode}
              steuerung="Unwillkürlich (vegetativ)" ermüdung="Nein — sehr langsam"
              ort="Hohlorgane: Darm, Blutgefäße, Blase, Uterus, Bronchien"
              merkmale={['Keine Querstreifen sichtbar', 'Langsame, ausdauernde Kontraktion', 'Reguliert Blutdruck, Peristaltik, Bronchienweite', 'Relevanz Bad: Bronchospasmus bei Asthma, Schock (Gefäßkonstriktion)']} />
          </S>
          <S title="Muskelfasern — Schnell vs. Langsam" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Merkmal</th><th className="text-left p-2 text-red-400">Typ II (schnell)</th><th className="text-left p-2 text-blue-400">Typ I (langsam)</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Farbe', 'Weiß (wenig Myoglobin)', 'Rot (viel Myoglobin)'],
                    ['Energiesystem', 'Anaerob (schnell)', 'Aerob (ausdauernd)'],
                    ['Ermüdung', 'Schnell', 'Langsam'],
                    ['Kraft', 'Hoch', 'Gering'],
                    ['Beispiel', 'Sprinter, Sprung', 'Marathonläufer, Schwimmer'],
                    ['Verhältnis', 'Genetisch bestimmt', '~50/50 im Durchschnitt'],
                  ].map(([m, t2, t1], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{m}</td>
                      <td className="p-2 text-red-400">{t2}</td>
                      <td className="p-2 text-blue-400">{t1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </div>
      )}

      {tab === 'kontraktion' && (
        <div>
          <S title="Sliding-Filament-Theorie (vereinfacht)" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Muskelfasern bestehen aus Myofibrillen, die aus <strong>Aktin</strong> (dünn) und <strong>Myosin</strong> (dick) aufgebaut sind.
            </div>
            {[
              { nr: '1', name: 'Nervenimpuls', text: 'Motorisches Neuron sendet Signal → Acetylcholin an motorischer Endplatte → Aktionspotential in Muskelfaser' },
              { nr: '2', name: 'Ca²⁺-Freisetzung', text: 'Kalziumionen strömen aus dem sarkoplasmatischen Retikulum → binden an Troponin → Bindungsstellen an Aktin werden frei' },
              { nr: '3', name: 'Querbrückenbildung', text: 'Myosin-Köpfe binden an Aktin-Filamente → ATP wird gespalten → Myosin-Kopf "rudert" → Filamente gleiten aneinander vorbei (Verkürzung)' },
              { nr: '4', name: 'Relaxation', text: 'Ca²⁺ wird zurückgepumpt → Troponin blockiert Bindungsstellen wieder → Muskel entspannt sich' },
            ].map(({ nr, name, text }) => (
              <div key={nr} className={`rounded-lg p-3 mb-2 flex gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className={`w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{nr}</span>
                <div>
                  <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{name}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
                </div>
              </div>
            ))}
          </S>
          <S title="Muskeltonus & Kontraktion" darkMode={darkMode}>
            {[
              ['Muskeltonus', 'Grundspannung im ruhenden Muskel — hält Körperhaltung aufrecht'],
              ['Isotonische Kontraktion', 'Muskel verkürzt sich — Bewegung entsteht (z. B. Arm beugen)'],
              ['Isometrische Kontraktion', 'Muskel entwickelt Kraft, aber keine Bewegung (z. B. Wand drücken)'],
              ['Exzentrische Kontraktion', 'Muskel verlängert sich unter Spannung (z. B. Bergab gehen, Bremsen) — erzeugt Muskelkater!'],
            ].map(([l, v]) => (
              <div key={l} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{l}: </span>
                <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>{v}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'kraempfe' && (
        <div>
          <S title="Muskelkrampf — Ursachen" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Ein Muskelkrampf ist eine unwillkürliche, anhaltende Muskelkontraktion — schmerzhaft, aber meist harmlos.
            </div>
            {[
              { ursache: 'Elektrolytmangel (Na⁺, K⁺, Mg²⁺)', text: 'Schweißverlust führt zu Mineralstoffmangel → Muskelfasern können nicht relaxieren. Häufigste Ursache bei Sportlern.' },
              { ursache: 'Dehydration', text: 'Zu wenig Flüssigkeit → Muskeln können Stoffwechselprodukte nicht entsorgen → Krampf.' },
              { ursache: 'Übersäuerung (Laktat)', text: 'Hohe anaerobe Belastung → pH-Abfall → Störung der Kalzium-Regulation in der Muskelfaser.' },
              { ursache: 'Kälte', text: 'Kaltes Wasser → verminderte Durchblutung → verringerte Elektrolyt- und O₂-Versorgung → Krampfneigung↑. Im Wasser lebensgefährlich!' },
              { ursache: 'Überlastung / Ermüdung', text: 'Erschöpfte Muskulatur → gestörte Nerven-Muskel-Kommunikation → Spontankontraktionen.' },
            ].map(({ ursache, text }) => (
              <div key={ursache} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{ursache}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
          <S title="Behandlung: Krampf im Wasser" darkMode={darkMode}>
            <div className={`rounded-lg p-3 border-l-4 border-red-500 mb-3 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>⚠️ Gefahr: Krampf im Wasser = Ertrinkungsrisiko!</div>
              <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Person kann nicht mehr schwimmen und sinkt. Sofort Hilfsmittel (Stange, Leine) einsetzen!</div>
            </div>
            {[
              ['Wadenkreampf (häufigst)', 'Zehenspitzen zur Schienbein-Seite ziehen (Dorsalflexion) — dehnt den Wadenmuskel.'],
              ['Oberschenkelkrampf vorne', 'Ferse zum Gesäß ziehen (Knie beugen) — dehnt den Quadrizeps.'],
              ['Oberschenkelkrampf hinten', 'Bein strecken und Zehen anziehen — dehnt die Ischiocrurale Gruppe.'],
              ['Nachsorge', 'Wärmen, trinken, Elektrolyte zuführen (Mineralwasser, Banane). 30 Min Sportpause.'],
            ].map(([art, behandlung]) => (
              <div key={art} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{art}</span>
                <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>{behandlung}</span>
              </div>
            ))}
          </S>
          <S title="Krämpfe vs. Epilepsie" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Merkmal</th><th className="text-left p-2">Muskelkrampf</th><th className="text-left p-2">Epilepsie</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Bewusstsein', 'Erhalten', 'Meist eingeschränkt/verloren'],
                    ['Lokalisation', 'Ein Muskel/Bereich', 'Gesamter Körper (generalisiert)'],
                    ['Ursache', 'Lokal (Elektrolyte, Ermüdung)', 'Zentralnervös (Hirnaktivität)'],
                    ['Dauer', 'Sekunden bis Minuten', 'Meist 1–3 Min, dann Erschöpfungsphase'],
                    ['Maßnahme', 'Dehnen, Kühlung, Elektrolyte', '112, Sturzsicherung, nicht festhalten'],
                  ].map(([m, k, e], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{m}</td>
                      <td className="p-2">{k}</td>
                      <td className="p-2">{e}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </div>
      )}

      {tab === 'verletzung' && (
        <div>
          <S title="EIS-Schema bei Muskelverletzungen" darkMode={darkMode}>
            <div className={`rounded-xl p-4 mb-3 text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-black mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>P · R · I · C · E</div>
              {[
                ['P', 'Protection', 'Schutz — Belastung sofort stoppen'],
                ['R', 'Rest', 'Ruhe — verletzten Bereich ruhigstellen'],
                ['I', 'Ice', 'Eis/Kühlung — 15–20 Min, Tuch als Schutz!'],
                ['C', 'Compression', 'Druckverband — Schwellung reduzieren'],
                ['E', 'Elevation', 'Hochlagerung — Schwellung reduzieren'],
              ].map(([kürzel, name, text]) => (
                <div key={kürzel} className={`flex items-start gap-2 text-left mb-1.5`}>
                  <span className={`w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-black text-white bg-blue-600`}>{kürzel}</span>
                  <div>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{name}: </span>
                    <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </S>
          <S title="Verletzungsarten" darkMode={darkMode}>
            {[
              { typ: 'Muskelzerrung', schwere: 'Leicht', zeichen: 'Plötzlicher Schmerz, Verhärtung', therapie: 'PRICE, 1–2 Wochen Pause' },
              { typ: 'Muskelfaserriss', schwere: 'Mittel', zeichen: 'Stechender Schmerz, Delle tastbar', therapie: 'PRICE, Arzt, 3–8 Wochen Pause' },
              { typ: 'Muskelriss (komplett)', schwere: 'Schwer', zeichen: 'Harter Knubbel, kompletter Funktionsverlust', therapie: 'Chirurgie ggf. nötig, mehrere Monate' },
              { typ: 'Prellung (Kontusion)', schwere: 'Leicht–Mittel', zeichen: 'Hämatom, Druckschmerz, keine Delle', therapie: 'PRICE, Physiotherapie' },
            ].map(({ typ, schwere, zeichen, therapie }) => (
              <div key={typ} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{typ}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${schwere === 'Leicht' ? (darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700') : schwere === 'Mittel' ? (darkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700') : (darkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')}`}>{schwere}</span>
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}><strong>Zeichen:</strong> {zeichen}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}><strong>Therapie:</strong> {therapie}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Muskulatur im Badebetrieb" darkMode={darkMode}>
            {[
              { titel: '🏊 Schwimmen = Ganzkörpertraining', text: 'Beim Kraulschwimmen werden >50 Muskeln aktiv. Schulter-Rotatorenmanschette besonders belastet → häufige Schwimmerschulter bei Leistungsschwimmern.' },
              { titel: '🆘 Rettungsgriffe & Kraftanforderung', text: 'Bergung aus dem Wasser: Rücken- und Schultermuskulatur extrem belastet. FAB müssen Körpergewicht aus dem Wasser heben — Rückenschulung wichtig!' },
              { titel: '⚡ Krämpfe bei Badegästen', text: 'Sofort Hilfsmittel (Stange, Ring) einsetzen. Bei Krampf im Wasser: Person kann nicht aktiv helfen. Bergung wie bei Bewusstlosem.' },
              { titel: '🌡️ Kälte und Muskulatur', text: 'Kaltes Wasser (< 20°C): Muskeln verkrampfen → Rettungsschwimmer werden langsamer → eigene Sicherheit! Neoprenanzug oder Zeitlimit.' },
              { titel: '💊 Muskelrelaxanzien-Patienten', text: 'Manche Gäste nehmen Medikamente die Muskeln entspannen (Diazepam etc.) → erhöhtes Ertrinkungsrisiko → Hinweispflicht bei Kursanmeldung.' },
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
