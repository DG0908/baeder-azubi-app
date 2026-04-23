import { useState } from 'react';

const TABS = {
  übersicht: 'Übersicht',
  stange: 'Stange & Haken',
  ring: 'Ring & Gurtretter',
  wurfleine: 'Wurfleine',
  spineboard: 'Spineboard & O₂',
};

const InfoBox = ({ title, items, dark, color = '#0891b2' }) => (
  <div style={{ background: dark ? '#0f172a' : '#f0f9ff', border: `1px solid ${color}40`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
    <div style={{ fontWeight: 700, color: color, marginBottom: 8 }}>{title}</div>
    {items.map((it, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, color: dark ? '#e2e8f0' : '#1e293b', fontSize: 14 }}>
        <span style={{ color: color, fontWeight: 700, minWidth: 14 }}>•</span>
        <span>{it}</span>
      </div>
    ))}
  </div>
);

const GerätCard = ({ icon, name, desc, specs, einsatz, dark }) => (
  <div style={{ background: dark ? '#1e293b' : '#f8fafc', border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', fontSize: 15 }}>{name}</div>
    </div>
    <p style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13, marginBottom: 10, margin: '0 0 10px 0' }}>{desc}</p>
    {specs && (
      <div style={{ marginBottom: 8 }}>
        {specs.map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 4, fontSize: 12 }}>
            <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 110 }}>{k}</span>
            <span style={{ color: dark ? '#94a3b8' : '#64748b' }}>{v}</span>
          </div>
        ))}
      </div>
    )}
    <div style={{ background: '#059669' + '20', border: '1px solid #05966940', borderRadius: 6, padding: '5px 10px', fontSize: 12, color: '#059669', fontWeight: 600 }}>
      Einsatz: {einsatz}
    </div>
  </div>
);

export default function RettungsgeräteDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('übersicht');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Schwimmen & Rettung</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 4 }}>Rettungsgeräte</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Ausrüstung, Einsatz und Technik der wichtigsten Rettungsmittel im Schwimmbad</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? '#0891b2' : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {/* ÜBERSICHT */}
        {tab === 'übersicht' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Rettungsgeräte — Übersicht</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Grundsatz: Rettungsgeräte bevorzugen — kein unnötiges Einspringen. Rette immer mit Abstand wenn möglich.</p>

            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#0891b2' }}>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Gerät</th>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Reichweite</th>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Vorteil</th>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Pflicht</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Rettungsstange', '3–5 m', 'Sofort einsetzbar, kein Wurf', 'Ja, DIN EN 13138'],
                    ['Rettungsring', '< 20 m', 'Auftriebshilfe auf Distanz', 'Ja'],
                    ['Gurtretter', '< 30 m', 'Mit Seil, zieht Person ran', 'Empfohlen'],
                    ['Wurfleine', '< 30 m', 'Dünn, leicht, schnell', 'Ja, Freibäder'],
                    ['Spineboard', 'k.A.', 'HWS-Immobilisierung', 'Empfohlen'],
                    ['Sauerstoff', 'k.A.', 'Erste Hilfe Atemstörungen', 'Ja (DLRG-Richtwert)'],
                    ['AED', 'k.A.', 'Frühdefibrillation', 'Gesetzl. Empfehlung'],
                  ].map(([g, r, v, p], i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#f0f9ff') : (dark ? '#0f172a' : '#fff') }}>
                      <td style={{ padding: '7px 12px', fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1' }}>{g}</td>
                      <td style={{ padding: '7px 12px', color: text }}>{r}</td>
                      <td style={{ padding: '7px 12px', color: text }}>{v}</td>
                      <td style={{ padding: '7px 12px', color: p.startsWith('Ja') ? '#059669' : sub, fontWeight: p.startsWith('Ja') ? 700 : 400 }}>{p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoBox title="Reihenfolge der Rettungsmittel (Priorität)" dark={dark} color="#7c3aed" items={[
              '1. Verbal: Rufen, anweisen — kein Kontakt nötig',
              '2. Fest: Stange, Leine werfen — Abstand halten',
              '3. Schwimmend mit Gerät: Schwimmen mit Hilfsmittel',
              '4. Körperkontakt: Direkte Rettung — letztes Mittel',
            ]} />
          </div>
        )}

        {/* STANGE & HAKEN */}
        {tab === 'stange' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Rettungsstange & Haken</h2>

            <GerätCard
              icon="🔱"
              name="Rettungsstange"
              desc="Starre oder teleskopierbare Stange mit Haken oder T-Griff am Ende. Wird Person hingehalten oder untergeschoben. Ermöglicht Rettung ohne ins Wasser zu gehen."
              specs={[
                ['Länge', '3–6 m (Teleskop: variabel)'],
                ['Material', 'GFK, Aluminium oder Kunststoff'],
                ['Ende', 'T-Griff, Haken oder Ring'],
                ['Lagerung', 'Gut sichtbar, immer zugänglich'],
              ]}
              einsatz="Bewusstseinsgetrübte Person in Beckennähe"
              dark={dark}
            />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Einsatztechnik Stange</div>
              {[
                ['Schritt 1', 'Person verbal ansprechen: „Greifen Sie die Stange!"'],
                ['Schritt 2', 'Stange auf gleicher Höhe wie Person ins Wasser halten'],
                ['Schritt 3', 'Person hält Stange — langsam und gleichmäßig zum Rand ziehen'],
                ['Schritt 4', 'Bei bewusstloser Person: Haken unter Achsel oder in Kleidung'],
                ['Schritt 5', 'Eigene Position sichern — nicht über Rand beugen ohne Halt'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 70 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Haken-Einsatz bei bewusstloser Person" dark={dark} color="#dc2626" items={[
              'Haken in Kleidung (Achsel, Gürtel) oder unter dem Arm führen',
              'Niemals am Hals, Kopf oder Halsbereich einhaken',
              'Langsam ziehen — Person nicht verletzen',
              'Sobald am Rand: Bergung nach Bergungsprotokoll',
            ]} />
          </div>
        )}

        {/* RING & GURTRETTER */}
        {tab === 'ring' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Rettungsring & Gurtretter</h2>

            <GerätCard
              icon="🛟"
              name="Rettungsring"
              desc="Ringförmiger Auftriebskörper aus Schaumstoff oder Kork. Wird zur Person geworfen — gibt ihr Auftrieb. Meist mit Wurfleine verbunden. Person hält sich fest bis Rettung kommt."
              specs={[
                ['Außendurchmesser', 'ca. 76 cm'],
                ['Tragkraft', 'mind. 14,5 kg nach DIN EN 13138'],
                ['Farbe', 'Orange oder Rot (gut sichtbar)'],
                ['Befestigung', 'Immer mit Wurfleine gesichert'],
              ]}
              einsatz="Bewusstseinsklare Person auf Distanz"
              dark={dark}
            />

            <GerätCard
              icon="🏊"
              name="Gurtretter (Rescue Tube / Can)"
              desc="Weicher Auftriebskörper mit Schulterriemen und angebrachter Leine. Retter trägt ihn beim Einschwimmen um die Schulter. Person greift Griff oder Leine — Retter zieht ans Ufer."
              specs={[
                ['Länge', 'ca. 50–70 cm (Rescue Can)'],
                ['Besonderheit', 'Retter schwimmt aktiv mit'],
                ['Vorteil', 'Direkter Körperkontakt möglich'],
                ['Einsatz', 'Profi-Rettungsschwimmer bevorzugt'],
              ]}
              einsatz="Alle Personen — auch Bewusstlose"
              dark={dark}
            />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Wurftechnik Rettungsring</div>
              {[
                ['Schritt 1', 'Ring in Wurfhand, Leinenende in andere Hand festhalten'],
                ['Schritt 2', 'Auf Person zielen — leicht über sie hinaus werfen'],
                ['Schritt 3', 'Person verbal auffordern: „Ring festhalten!"'],
                ['Schritt 4', 'Person hält Ring — Leine einholen, Person zum Rand ziehen'],
                ['Schritt 5', 'Person auffordern: „Arme über den Ring, nicht drunter!"'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 70 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WURFLEINE */}
        {tab === 'wurfleine' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Wurfleine</h2>

            <GerätCard
              icon="🪢"
              name="Wurfleine (Throw Bag)"
              desc="Sack mit aufgerollter Rettungsleine (meist 20–30 m). Wird zur Person geworfen — Person greift die Leine und wird herangezogen. Leicht, schnell einsatzbereit."
              specs={[
                ['Länge', '20–30 m'],
                ['Durchmesser', 'ca. 8 mm'],
                ['Material', 'Polypropylen (schwimmt)'],
                ['Lagerung', 'Aufgerollt im Säckchen, immer griffbereit'],
              ]}
              einsatz="Person auf Distanz, Fließwasser, Außenbereich"
              dark={dark}
            />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Wurftechnik Leine</div>
              {[
                ['Schritt 1', 'Leinenende in der freien Hand festhalten (sonst fliegt alles raus!)'],
                ['Schritt 2', 'Sack mit Schwung über die Person hinaus werfen'],
                ['Schritt 3', 'Leine liegt auf der Person — sie greift die Leine'],
                ['Schritt 4', 'Person halten, stabil positionieren, Leine einziehen'],
                ['Schritt 5', 'Person am Rand sichern und heraushelfen'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 70 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Grenzen der Wurfleine" dark={dark} color="#dc2626" items={[
              'Nur für ansprechbare Personen — Bewusstlose können nicht festhalten',
              'Wind kann Leine ablenken — Übung notwendig',
              'Leine verfangen sich leicht — Lagerung und Entfaltung üben',
              'Bei Miss: Leine aufwickeln oder zweite Leine einsetzen',
            ]} />
          </div>
        )}

        {/* SPINEBOARD & O2 */}
        {tab === 'spineboard' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Spineboard & Sauerstoffversorgung</h2>

            <GerätCard
              icon="🪵"
              name="Spineboard (Rettungsbrett)"
              desc="Hartes Brett zur Immobilisierung der Wirbelsäule. Unverzichtbar bei Tauchunfällen oder Stürzen ins Wasser mit HWS-Verdacht. Person wird auf dem Brett fixiert und aus dem Wasser gehoben."
              specs={[
                ['Maße', 'ca. 180 cm × 45 cm'],
                ['Material', 'Polyethylen (schwimmt)'],
                ['Fixierung', 'Gurte + Kopfstütze / Spider Strap'],
                ['Rettung', 'Immer mind. 2 Personen nötig'],
              ]}
              einsatz="HWS-Verdacht: Sprung, Tauchgang, Sturz ins Wasser"
              dark={dark}
            />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Spineboard-Einsatz</div>
              {[
                ['Schritt 1', 'Kopf der Person in Neutralstellung fixieren (kein Beugen!)'],
                ['Schritt 2', 'Board seitlich ins Wasser einführen, Person drehen und auflegen'],
                ['Schritt 3', 'Person auf Board fixieren (Gurte), Kopf mit Kopfstütze sichern'],
                ['Schritt 4', 'Board horizontal herausnehmen — mind. 3 Helfer'],
                ['Schritt 5', 'Notruf absetzen, HWS-Verdacht melden'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 70 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <GerätCard
              icon="🫁"
              name="Sauerstoffgerät (O₂-Inhalation)"
              desc="Tragbares Gerät zur Sauerstoffgabe. Erhöht O₂-Konzentration in der Einatemluft von 21% auf bis zu 100%. Bei Badeunfällen, Bewusstlosigkeit, Ertrinken sofort einsetzen."
              specs={[
                ['Konzentration', 'Bis zu 100% O₂'],
                ['Maske', 'Nichtrebreathing-Maske oder Beatmungsmaske'],
                ['Flaschengröße', 'Typisch 2–10 Liter'],
                ['Pflicht', 'Vorgabe je nach Bundesland / Träger'],
              ]}
              einsatz="Atemstörung, Ertrinken, Bewusstlosigkeit, Nach HLW"
              dark={dark}
            />

            <InfoBox title="AED — Automatischer Externer Defibrillator" dark={dark} color="#7c3aed" items={[
              'Im Schwimmbad immer zugänglich aufbewahren (gut sichtbar)',
              'Vor AED-Einsatz: Person abtrocknen — Wasser leitet Strom',
              'AED gibt Sprachanweisungen — einfach folgen',
              'Zeitfaktor: jede Minute ohne Defibrillation senkt Überlebenschance um 10%',
              'AED + HLW gleichzeitig vorbereiten wenn möglich',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
