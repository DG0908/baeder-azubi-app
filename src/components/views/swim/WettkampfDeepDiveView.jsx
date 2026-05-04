import { useState } from 'react';

const TABS = {
  lagen: 'Schwimmlagen',
  organisation: 'Organisation',
  offizielle: 'Offizielle & Kampfrichter',
  starts: 'Starts & Rückenstartleine',
  regeln: 'Regeln & Disqualifikation',
};

const InfoBox = ({ title, items, dark, color = '#0369a1' }) => (
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

const LagenCard = ({ name, icon, color, regeln, dq, disziplinen, dark }) => (
  <div style={{ background: dark ? '#1e293b' : '#f8fafc', border: `2px solid ${color}40`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ fontWeight: 700, color: color, fontSize: 16 }}>{name}</div>
    </div>
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontWeight: 600, color: dark ? '#94a3b8' : '#64748b', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Wettkampfregeln</div>
      {regeln.map((r, i) => (
        <div key={i} style={{ fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b', display: 'flex', gap: 6, marginBottom: 3 }}>
          <span style={{ color: color }}>✓</span><span>{r}</span>
        </div>
      ))}
    </div>
    {disziplinen && (
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 600, color: dark ? '#94a3b8' : '#64748b', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Wettkampfdistanzen</div>
        <div style={{ fontSize: 13, color: dark ? '#94a3b8' : '#64748b' }}>{disziplinen.join(' · ')}</div>
      </div>
    )}
    <div style={{ background: '#dc262615', border: '1px solid #dc262630', borderRadius: 6, padding: '5px 10px', fontSize: 12, color: '#dc2626', marginTop: 6 }}>
      DQ: {dq}
    </div>
  </div>
);

const OfficialCard = ({ titel, aufgaben, dark }) => (
  <div style={{ background: dark ? '#1e293b' : '#f8fafc', border: '1px solid #0369a140', borderRadius: 10, padding: 14, marginBottom: 10 }}>
    <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 8 }}>{titel}</div>
    {aufgaben.map((a, i) => (
      <div key={i} style={{ fontSize: 13, color: dark ? '#cbd5e1' : '#475569', display: 'flex', gap: 6, marginBottom: 3 }}>
        <span style={{ color: '#0369a1' }}>•</span><span>{a}</span>
      </div>
    ))}
  </div>
);

export default function WettkampfDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('lagen');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Schwimmen & Rettung</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 4 }}>Wettkampfschwimmen</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Schwimmlagen, Wettkampforganisation, Offizielle, Rückenstartleine und Regelwerk (World Aquatics / DSV)</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? '#0369a1' : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {/* LAGEN */}
        {tab === 'lagen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 6 }}>Die 4 Schwimmlagen im Wettkampf</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Jede Lage hat exakte Regelvorschriften (World Aquatics SW-Regeln). Abweichungen führen zur Disqualifikation (DQ).</p>

            <LagenCard
              name="Freistil (Kraul)"
              icon="🏊"
              color="#0891b2"
              regeln={[
                'Beliebige Schwimmtechnik erlaubt — Kraul ist am schnellsten',
                'Schulter muss Wasseroberfläche kreuzen (keine komplette Rückenlage)',
                'Anschlag: einhändig oder beidhändig, beliebig',
                'Wende: Rollwende erlaubt, kein Anschlag nötig',
                'Unterwasserphase nach Start/Wende: max. 15 m',
              ]}
              disziplinen={['50 m', '100 m', '200 m', '400 m', '800 m', '1500 m']}
              dq="Auf dem Rücken finishen, mehr als 15 m Unterwasser"
              dark={dark}
            />

            <LagenCard
              name="Rücken"
              icon="🔄"
              color="#7c3aed"
              regeln={[
                'Start im Wasser — Hände am Rückenstartbügel',
                'Rückenlage muss gehalten werden (max. 90° Neigung erlaubt bei Rollwende)',
                'Anschlag: einhändig, auf dem Rücken',
                'Wende: Rollwende mit Körperdrehung erlaubt (seit 1991)',
                'Bei Wende: darf kurz in Bauchlage schwimmen während Drehung',
              ]}
              disziplinen={['50 m', '100 m', '200 m']}
              dq="Auf Bauch finishen ohne Drehung, Füße über Wasserabweiser"
              dark={dark}
            />

            <LagenCard
              name="Brustschwimmen"
              icon="🏊‍♂️"
              color="#059669"
              regeln={[
                'Bauchlage muss gehalten werden — Rücken verbietet',
                'Armbewegung: symmetrisch, gleichzeitig, nie rückwärts',
                'Beinbewegung: Froschbeine — nie auf und ab (Delphin = DQ)',
                'Anschlag: beidhändig, gleichzeitig, auf gleicher Höhe',
                'Unterwasserphase: 1 voller Armzug bis zu den Beinen + 1 Delphinkick + 1 Brust-Beinschlag (seit 2005)',
              ]}
              disziplinen={['50 m', '100 m', '200 m']}
              dq="Delphinbeinschlag, asymmetrischer Anschlag, Drehung auf Rücken"
              dark={dark}
            />

            <LagenCard
              name="Schmetterling (Delphin)"
              icon="🦋"
              color="#d97706"
              regeln={[
                'Bauchlage muss gehalten werden',
                'Armbewegung: beide Arme gleichzeitig über Wasser vorwärts',
                'Beinbewegung: Delphinschlag — beide Beine gleichzeitig, auf und ab',
                'Anschlag: beidhändig, gleichzeitig, auf gleicher Höhe',
                'Unterwasserphase: max. 15 m Delphinschläge',
              ]}
              disziplinen={['50 m', '100 m', '200 m']}
              dq="Arme nacheinander, Brustschwimmerbeine, asymmetrischer Anschlag"
              dark={dark}
            />

            <div style={{ background: dark ? '#1e1040' : '#faf5ff', border: '2px solid #7c3aed40', borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, color: '#7c3aed', fontSize: 15, marginBottom: 10 }}>Lagen — Staffel & Einzel</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, color: dark ? '#c4b5fd' : '#5b21b6', fontSize: 13, marginBottom: 6 }}>Reihenfolge Einzellagen (200 m / 400 m)</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['1. Schmetterling', '2. Rücken', '3. Brust', '4. Freistil'].map((l, i) => (
                    <div key={i} style={{ background: '#7c3aed', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>{l}</div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: dark ? '#c4b5fd' : '#5b21b6', fontSize: 13, marginBottom: 6 }}>Lagenstaffel (4 × 100 m)</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['1. Rücken', '2. Brust', '3. Schmetterling', '4. Freistil'].map((l, i) => (
                    <div key={i} style={{ background: '#5b21b6', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>{l}</div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: sub, marginTop: 6 }}>Merkhilfe Einzellagen: <strong>S–R–B–K</strong> (Schmetterling, Rücken, Brust, Kraul) | Staffel: <strong>R–B–S–K</strong> (Rücken zuerst, weil Wasserstart)</div>
              </div>
            </div>
          </div>
        )}

        {/* ORGANISATION */}
        {tab === 'organisation' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Wettkampforganisation</h2>

            <div style={{ background: cardBg, border: '1px solid #0369a140', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Ablauf von der Meldung bis zum Wettkampf</div>
              {[
                ['Meldung', 'Schwimmer melden Disziplin und Nennzeit beim Veranstalter'],
                ['Bahneinteilung', 'Schnellste in Mitte (Bahn 4/5), langsamer zu den Seiten'],
                ['Vorlauf / Finale', 'Vorlauf → Halbfinale → Finale (je nach Niveau)'],
                ['Erwärmung', 'Einschwimmen im vorgesehenen Zeitfenster vor Start'],
                ['Einlauf', 'Schwimmer kommen vom Einlaufraum ans Startnummernschild'],
                ['Start', 'Auf Starterkommando — Frühstart = DQ oder Neustart'],
                ['Siegerehrung', 'Nach Finalläufen — Pokale, Urkunden, Zeitlisten'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 13 }}>
                  <span style={{ color: '#0369a1', fontWeight: 700, minWidth: 120 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: '1px solid #0369a140', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Bahneinteilung (Lane Seeding)</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 10 }}>In einem 8-Bahnen-Becken werden Schwimmer nach Meldezeit eingeteilt:</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#0369a1' }}>
                      {['Bahn 1', 'Bahn 2', 'Bahn 3', 'Bahn 4', 'Bahn 5', 'Bahn 6', 'Bahn 7', 'Bahn 8'].map(b => (
                        <th key={b} style={{ padding: '6px 8px', color: '#fff', textAlign: 'center' }}>{b}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: dark ? '#1e293b' : '#f0f9ff' }}>
                      {['8.', '6.', '4.', '2.', '1.', '3.', '5.', '7.'].map((rank, i) => (
                        <td key={i} style={{ padding: '6px 8px', textAlign: 'center', color: i === 3 || i === 4 ? '#0369a1' : dark ? '#cbd5e1' : '#64748b', fontWeight: i === 3 || i === 4 ? 700 : 400, fontSize: 13 }}>{rank}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 12, color: sub, marginTop: 6 }}>Schnellste Meldezeit in Bahn 4 (8-Bahnen) oder 5, Langsamste außen.</div>
            </div>

            <InfoBox title="Zeitmessung" dark={dark} color="#059669" items={[
              'Manuell: 3 Zeitnehmer pro Bahn — Median wird gewertet',
              'Halbautomatisch: Kampfrichter drücken Taste, automatische Kontrolle',
              'Vollautomatisch: Touchpad am Beckenrand + Lichtschrankensystem (offiziell)',
              'Genauigkeit vollautom.: 1/1000 Sekunde, gewertet auf 1/100',
              'Bei Systemausfall: manuelle Zeit gilt',
            ]} />
          </div>
        )}

        {/* OFFIZIELLE */}
        {tab === 'offizielle' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Offizielle & Kampfrichter</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Ein offizieller Wettkampf erfordert ausgebildete Kampfrichter. Die Regeln stammen von World Aquatics (ehem. FINA) bzw. dem Deutschen Schwimm-Verband (DSV).</p>

            <OfficialCard
              titel="Wettkampfleiter / Schiedsrichter (Referee)"
              aufgaben={[
                'Höchste Autorität beim Wettkampf',
                'Entscheidet über DQ-Einsprüche',
                'Überwacht alle anderen Offiziellen',
                'Gibt Startfreigabe für jeden Lauf',
              ]}
              dark={dark}
            />
            <OfficialCard
              titel="Starter"
              aufgaben={[
                'Ruft Schwimmer auf den Startblock: „Bitte aufsteigen" / „Take your marks"',
                'Gibt Startsignal: Pfeif + Lichtsignal oder Startsignal-Ton',
                'Bei Frühstart: Neustartpfiff oder DQ-Entscheidung (je nach Regelwerk)',
                'Beim Rückenstart: Schwimmer können ins Wasser — Fertigmachen-Kommando',
              ]}
              dark={dark}
            />
            <OfficialCard
              titel="Kampfrichter / Wendenrichter"
              aufgaben={[
                'Überwachen Anschläge und Wenden — jeweils 1 pro Bahn',
                'Kontrollieren Lagentechnik (Brust: beidhändiger Anschlag, Rücken: Rückenlage)',
                'Disqualifizieren bei Regelverstößen — Anzeige beim Schiedsrichter',
                'Am Ziel: Anschlagsrichter kontrolliert jeden Finish',
              ]}
              dark={dark}
            />
            <OfficialCard
              titel="Zeitnehmer"
              aufgaben={[
                'Stoppen die Zeit manuell — 3 Zeitnehmer pro Bahn',
                'Starten bei Startschuss, stoppen bei Anschlag',
                'Bei 3 Zeiten: Mittelwert oder Median',
                'Bei Abweichung >0,3 s: Einzelwert verworfen',
              ]}
              dark={dark}
            />
            <OfficialCard
              titel="Startblock-Richter (Startkontrolle)"
              aufgaben={[
                'Überprüft korrekte Startposition',
                'Achtet auf frühzeitiges Bewegen vor Startsignal',
                'Meldet Frühstarts sofort an Starter/Schiedsrichter',
              ]}
              dark={dark}
            />
            <OfficialCard
              titel="Rundenrichter / Zähler"
              aufgaben={[
                'Bei langen Strecken (400 m+): zählen Bahnen für Schwimmer',
                'Zeigen Rundenanzeige / Klappanzeige am Beckenrand',
                'Elektronisch: Countdown-Anzeige im Wasser (Touchpad)',
              ]}
              dark={dark}
            />
          </div>
        )}

        {/* STARTS */}
        {tab === 'starts' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Starts & Rückenstartleine im Wettkampf</h2>

            <div style={{ background: cardBg, border: '1px solid #0369a140', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Startablauf Freistil/Brust/Schmetterling</div>
              {[
                ['Lange Pfeife', 'Schwimmer steigen auf Startblock (beim Kehrtwenden: ins Wasser)'],
                ['„Take your marks"', 'Wettkampffertig-Position einnehmen — Stille, Körper gespannt'],
                ['Startsignal', 'Ton oder Lichtsignal — bei Frühstart: erneuter Pfeif'],
                ['Frühstart', 'Früher: 1 Frühstart = DQ. Heute: Starter-Entscheidung je nach Regelwerk'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 13 }}>
                  <span style={{ color: '#0369a1', fontWeight: 700, minWidth: 140 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: dark ? '#0c1a2e' : '#eff6ff', border: '2px solid #3b82f640', borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 10, fontSize: 15 }}>Rückenstart-Vorrichtungen — Details</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 12 }}>Beim Rückenstart hängt sich der Schwimmer an Griffe direkt am Startblock. Seit 2014 ist zusätzlich die <em>Backstroke Ledge</em> zugelassen — ein einklappbares Brett am Block, auf das die Füße gestellt werden.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  ['Rückenstartgriffe', 'Horizontale/vertikale Griffe direkt am Startblock — kein Element im Wasser'],
                  ['Backstroke Ledge', 'Ausklappbares Brett am Block, max. 4 cm über Wasseroberfläche'],
                  ['Griffweite', 'Mind. Schulterbreite, Hände nebeneinander'],
                  ['Daumen', 'Von unten — fester Halt'],
                  ['Füße mit Ledge', 'Beide Füße auf dem Brett — auch über Wasser erlaubt'],
                  ['Füße ohne Ledge', 'Flach an die Wand, dürfen bis kurz unter Wasser stehen — nicht auf Wasserabweiser/Rinnenrand'],
                  ['Eingeführt', 'Backstroke Ledge: World Aquatics-Zulassung 2014, ab Olympia 2016 sichtbar'],
                  ['Pflicht', 'Bei allen offiziellen Rückenstart-Wettkämpfen Griffe vorhanden'],
                ].map(([k, v], i) => (
                  <div key={i} style={{ fontSize: 13 }}>
                    <span style={{ color: '#3b82f6', fontWeight: 700 }}>{k}: </span>
                    <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: 10, background: dark ? '#1a2438' : '#dbeafe', borderRadius: 8, fontSize: 12, color: dark ? '#cbd5e1' : '#1e40af' }}>
                <strong>Nicht verwechseln:</strong> Rücken-Wendefahnen (engl. <em>backstroke flags</em>) sind 5 m vor jeder Wand quer übers Becken gespannt, ca. 1,8 m über Wasser. Sie dienen nur der Orientierung beim Anschwimmen, sind keine Startvorrichtung.
              </div>
            </div>

            <div style={{ background: cardBg, border: '1px solid #0369a140', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Startkommandos im Wettkampf (Deutsch)</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#0369a1' }}>
                      <th style={{ padding: '6px 10px', color: '#fff', textAlign: 'left' }}>Kommando</th>
                      <th style={{ padding: '6px 10px', color: '#fff', textAlign: 'left' }}>Englisch</th>
                      <th style={{ padding: '6px 10px', color: '#fff', textAlign: 'left' }}>Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Lange Pfeife', 'Long whistle', 'Auf den Block / ins Wasser'],
                      ['Kurze Pfiffe', 'Short whistles', 'Vorbereitung, Ruhe'],
                      ['„Fertig"', '„Take your marks"', 'Startposition einnehmen'],
                      ['Startsignal', 'Start signal', 'Los! Schwimmen beginnt'],
                      ['Doppelpfeif', '—', 'Neustart / Frühstart abgebrochen'],
                    ].map(([k, e, a], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#f0f9ff') : (dark ? '#0f172a' : '#fff') }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1' }}>{k}</td>
                        <td style={{ padding: '6px 10px', color: sub, fontStyle: 'italic' }}>{e}</td>
                        <td style={{ padding: '6px 10px', color: text }}>{a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REGELN & DQ */}
        {tab === 'regeln' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Wettkampfregeln & Disqualifikation</h2>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>Häufigste Disqualifikationsgründe</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#dc2626' }}>
                      <th style={{ padding: '6px 10px', color: '#fff', textAlign: 'left' }}>Lage</th>
                      <th style={{ padding: '6px 10px', color: '#fff', textAlign: 'left' }}>Verstoß</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Alle Lagen', 'Frühstart (beim Startsignal bereits in Bewegung)'],
                      ['Alle Lagen', 'Unterwasserphase > 15 m nach Start oder Wende'],
                      ['Alle Lagen', 'Nicht fertig geschwommene Strecke'],
                      ['Kraul', 'Auf dem Rücken den Anschlag machen'],
                      ['Rücken', 'Bauchlage beim Anschlag (ohne Drehung bei Wende)'],
                      ['Brust', 'Asymmetrischer Anschlag (eine Hand früher)'],
                      ['Brust', 'Delphinbeinschlag statt Froschbeine'],
                      ['Brust', 'Beine alternierend bewegt (Kraul-Beinschlag)'],
                      ['Schmetterling', 'Arme nacheinander statt gleichzeitig'],
                      ['Schmetterling', 'Beine nicht gleichzeitig (Kraul- oder Brustschwimmerbeine)'],
                      ['Lagen', 'Falsche Lagenreihenfolge'],
                      ['Lagen', 'Übergang Rücken→Brust ohne korrekte Körperdrehung'],
                    ].map(([l, v], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#2d1515' : '#fef2f2') : (dark ? '#1e293b' : '#fff') }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700, color: '#dc2626', whiteSpace: 'nowrap' }}>{l}</td>
                        <td style={{ padding: '6px 10px', color: dark ? '#e2e8f0' : '#1e293b' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <InfoBox title="Regelwerk — Quellen" dark={dark} color="#7c3aed" items={[
              'World Aquatics (ehem. FINA): international gültiges Regelwerk (SW 1–13)',
              'DSV (Deutscher Schwimm-Verband): nationale Wettkampfordnung',
              'Wettkampfnormen: A-Norm (WM/EM), B-Norm, Vereins-/Kreisebene',
              'DIN 18032: Beckenlängen (25 m Kurzbahn, 50 m Langbahn)',
            ]} />

            <InfoBox title="Wichtige Zahlenwerte für die Prüfung" dark={dark} color="#059669" items={[
              'Unterwasserphase max. 15 m (alle Lagen außer Brust)',
              'Brust nach Start/Wende: 1 voller Armzug + 1 Delphinkick + 1 Brust-Beinschlag erlaubt',
              'Startblock-Höhe: 50–75 cm über Wasseroberfläche',
              'Backstroke Ledge: max. 4 cm über Wasseroberfläche',
              'Rücken-Wendefahnen: 5 m vor der Wand, ca. 1,8 m über Wasser',
              'Bahnbreite Wettkampf: mind. 2,5 m (Olympische Norm), 2,0 m als Mindestmaß',
              'HLW-Rhythmus im Bäderbetrieb: 30:2',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
