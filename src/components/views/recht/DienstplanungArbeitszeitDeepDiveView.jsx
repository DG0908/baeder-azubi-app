import { useState } from 'react';

const TABS = {
  arbzg: 'Arbeitszeitgesetz',
  schichten: 'Schichtmodelle',
  dienstplan: 'Dienstplanerstellung',
  zeitkonten: 'Zeitkonten & Überstunden',
  sonder: 'Feiertage & Urlaub',
};

const accent = '#059669';

const InfoBox = ({ title, items, dark, color = accent }) => (
  <div style={{ background: dark ? '#0f172a' : '#f0fdf4', border: `1px solid ${color}40`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
    <div style={{ fontWeight: 700, color: color, marginBottom: 8 }}>{title}</div>
    {items.map((it, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, color: dark ? '#e2e8f0' : '#1e293b', fontSize: 14 }}>
        <span style={{ color: color, fontWeight: 700, minWidth: 14 }}>•</span><span>{it}</span>
      </div>
    ))}
  </div>
);

const Row = ({ k, v, dark, highlight }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 13, background: highlight ? accent + '15' : 'transparent', padding: highlight ? '4px 8px' : '0', borderRadius: 6 }}>
    <span style={{ color: accent, fontWeight: 700, minWidth: 200, flexShrink: 0 }}>{k}</span>
    <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
  </div>
);

export default function DienstplanungArbeitszeitDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('arbzg');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Verwaltung & Recht</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 4 }}>Dienstplanung & Arbeitszeit</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Arbeitszeitgesetz, Schichtmodelle, Dienstplanerstellung, Zeitkonten und Sonderregelungen</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? accent : cardBg, color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {tab === 'arbzg' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Arbeitszeitgesetz (ArbZG)</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Das ArbZG regelt Höchstarbeitszeiten, Pausen und Ruhezeiten für alle Arbeitnehmer in Deutschland — gilt auch im Schichtbetrieb des Schwimmbades.</p>

            <div style={{ background: dark ? '#0c2d1a' : '#f0fdf4', border: `2px solid ${accent}40`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: accent, marginBottom: 10, fontSize: 15 }}>Kernregelungen ArbZG</div>
              <Row k="Werktägliche Arbeitszeit" v="Max. 8 Stunden/Tag (Werktag = Mo–Sa)" dark={dark} highlight />
              <Row k="Verlängerung möglich" v="Auf max. 10 h/Tag — wenn Ausgleich innerhalb 6 Monate" dark={dark} />
              <Row k="Wöchentliche Arbeitszeit" v="Max. 48 h/Woche im Durchschnitt (6-Monats-Schnitt)" dark={dark} />
              <Row k="Ruhezeit" v="Mind. 11 Stunden zwischen zwei Schichten" dark={dark} highlight />
              <Row k="Sonn- und Feiertage" v="Grundsätzlich Beschäftigungsverbot — Ausnahmen für Bäder" dark={dark} />
              <Row k="Nachtarbeit" v="23:00–06:00 Uhr — max. 8 h/Schicht, Ausgleich + Zuschlag" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Pausenregelung (§ 4 ArbZG)</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: accent }}>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Arbeitszeit</th>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Mindestpause</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Mehr als 6 Stunden', '30 Minuten (am Stück oder 2 × 15 Min.)'],
                      ['Mehr als 9 Stunden', '45 Minuten (3 × 15 Min. möglich)'],
                      ['Bis 6 Stunden', 'Keine Pause gesetzlich vorgeschrieben'],
                    ].map(([a, p], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#f0fdf4') : (dark ? '#0f172a' : '#fff') }}>
                        <td style={{ padding: '6px 10px', color: text }}>{a}</td>
                        <td style={{ padding: '6px 10px', fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46' }}>{p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 12, color: sub, marginTop: 6 }}>Pause ≠ Arbeitszeit — wird nicht vergütet (außer Tarifvertrag regelt anders)</div>
            </div>

            <InfoBox title="Ausnahmen für Schwimmbäder" dark={dark} items={[
              'Bäder sind Freizeiteinrichtungen → Sonntagsarbeit erlaubt (§ 10 ArbZG)',
              'Ausgleich: mind. 15 Sonntage/Jahr frei (5-Tage-Woche)',
              'Feiertags-Ausgleich: Ersatzruhetag innerhalb 8 Wochen',
              'TVöD regelt Zuschläge: Nacht +20%, Sonntag +25%, Feiertag +135%',
            ]} />
          </div>
        )}

        {tab === 'schichten' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Schichtmodelle im Bäderbetrieb</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Schwimmbäder sind Ganztagsbetriebe — sie erfordern Schichtarbeit. Die häufigsten Modelle:</p>

            {[
              {
                name: 'Zweischichtbetrieb (Früh/Spät)',
                zeiten: 'z.B. Frühschicht 06:00–14:00, Spätschicht 14:00–22:00',
                vorteile: ['Klar strukturiert, leicht planbar', 'Kein Nachtbetrieb', 'Wechsel in regelmäßigem Turnus'],
                typisch: 'Hallenbäder mit Öffnungszeiten 7–22 Uhr',
              },
              {
                name: 'Dreischichtbetrieb (Früh/Spät/Nacht)',
                zeiten: 'z.B. 06–14, 14–22, 22–06 Uhr',
                vorteile: ['24h-Betrieb möglich', 'Technischer Nachtbetrieb', 'Zuschläge für Nachtschicht'],
                typisch: 'Wellnessbäder, große Freizeitbäder mit Nachtöffnung',
              },
              {
                name: 'Teilschicht / Splitdienst',
                zeiten: 'z.B. 07–11 Uhr und 16–20 Uhr (Stoßzeiten)',
                vorteile: ['Flexibel bei Teilzeit', 'Deckt Stoßzeiten ab'],
                typisch: 'Freibäder, Saisonbetrieb',
              },
              {
                name: 'Vollkontinuierlicher Schichtbetrieb',
                zeiten: 'Rund um die Uhr, 7 Tage — rotierendes System',
                vorteile: ['Maximale Auslastung', 'Hohe Zuschläge für Mitarbeiter'],
                typisch: 'Großbäder, Thermenanlage',
              },
            ].map(({ name, zeiten, vorteile, typisch }, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', fontSize: 14, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 6 }}>Zeiten: {zeiten}</div>
                {vorteile.map((v, j) => (
                  <div key={j} style={{ fontSize: 13, color: dark ? '#cbd5e1' : '#475569', display: 'flex', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: accent }}>+</span><span>{v}</span>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: sub, marginTop: 6 }}>Typisch: {typisch}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'dienstplan' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Dienstplanerstellung</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Was muss der Dienstplan sicherstellen?</div>
              {[
                'Mindestbesetzung zu jeder Öffnungszeit (DGUV 107-004)',
                'Qualifikation: mindestens 1 Fachkraft mit DRSA Bronze pro Schicht',
                'ArbZG einhalten: keine Überschreitung der Max-Arbeitszeiten',
                'Ruhezeiten zwischen Schichten: mind. 11 Stunden',
                'Urlaubsansprüche berücksichtigen',
                'Wünsche der Mitarbeiter soweit möglich einplanen',
                'Mitbestimmung: Betriebsrat / Personalrat muss Dienstplan genehmigen',
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: text }}>
                  <span style={{ color: accent }}>✓</span><span>{it}</span>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Planungszeitraum & Bekanntgabe</div>
              <Row k="Planungszeitraum" v="Meist 4 Wochen im Voraus — je nach Betriebsvereinbarung" dark={dark} />
              <Row k="Bekanntgabe" v="Mind. 2 Wochen vor Beginn aushängen (TVöD / BV)" dark={dark} />
              <Row k="Änderungen" v="Kurzfristige Änderungen nur mit triftigem Grund (Krankheit, Notfall)" dark={dark} />
              <Row k="Mitbestimmung" v="Betriebsrat / Personalrat: Mitbestimmungsrecht bei Dienstplanung" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Abkürzungen im Dienstplan</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  ['F', 'Frühschicht'],
                  ['S', 'Spätschicht'],
                  ['N', 'Nachtschicht'],
                  ['U', 'Urlaub'],
                  ['K', 'Krank (nachtr. eingetragen)'],
                  ['FZ', 'Freizeitausgleich'],
                  ['AZV', 'Arbeitszeitverkürzungstag'],
                  ['BT', 'Betriebsausflug / Schultag'],
                  ['X', 'Frei (regulärer freier Tag)'],
                  ['BD', 'Bereitschaftsdienst'],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                    <span style={{ background: accent, color: '#fff', borderRadius: 4, padding: '1px 7px', fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{k}</span>
                    <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'zeitkonten' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Zeitkonten & Überstunden</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Überstunden</div>
              <Row k="Definition" v="Arbeitszeit über die vertraglich vereinbarte Zeit hinaus" dark={dark} />
              <Row k="Anordnung" v="Nur durch Vorgesetzten — kein Selbst-Überstunden machen" dark={dark} />
              <Row k="Ausgleich" v="Primär Freizeitausgleich — erst dann Vergütung (TVöD: Zuschlag 25–40%)" dark={dark} />
              <Row k="Grenze" v="Max. 10 h/Tag (ArbZG) — auch mit Überstunden nicht überschreiten" dark={dark} />
              <Row k="Betriebsrat" v="Hat Mitbestimmungsrecht bei Überstundenanordnung" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Arbeitszeitkonto (AZK)</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 10 }}>Das Arbeitszeitkonto erfasst Plus- und Minusstunden über einen Ausgleichszeitraum hinweg. Im Schwimmbad besonders wichtig wegen saisonaler Schwankungen.</p>
              <Row k="Plusstunden" v="Mehrstunden werden gesammelt — bis zum Limit (z.B. 40 h)" dark={dark} />
              <Row k="Abbau" v="Durch Freizeit — Zeitpunkt nach Absprache" dark={dark} />
              <Row k="Minusstunden" v="Möglich bei geringer Auslastung — Nacharbeit oder Abzug" dark={dark} />
              <Row k="Kappungsgrenze" v="Max. Saldo festgelegt (z.B. ±80 h) — Überschuss verfällt oder wird vergütet" dark={dark} />
              <Row k="Betriebsvereinbarung" v="Genaue Regelung im Betrieb festgelegt" dark={dark} />
            </div>

            <InfoBox title="Bereitschaftsdienst vs. Rufbereitschaft" dark={dark} items={[
              'Bereitschaftsdienst: Anwesenheit im Betrieb, aber keine volle Arbeit → zählt (reduziert) als Arbeitszeit',
              'Rufbereitschaft: Erreichbar zu Hause, nur bei Ruf kommen → zählt kaum als Arbeitszeit',
              'Im Schwimmbad: oft Rufbereitschaft für Notfälle (Wasserrohrbruch, Chloralarm)',
              'TVöD regelt Zuschläge für beide Dienste separat',
            ]} />
          </div>
        )}

        {tab === 'sonder' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Feiertage, Urlaub & Sonderregelungen</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Urlaubsanspruch</div>
              <Row k="Gesetzlich (BUrlG)" v="Mind. 24 Werktage (4 Wochen) bei 6-Tage-Woche = 20 Tage bei 5-Tage-Woche" dark={dark} />
              <Row k="TVöD Urlaub" v="30 Arbeitstage bei 5-Tage-Woche" dark={dark} highlight />
              <Row k="Anteiliger Urlaub" v="Im Eintrittsjahr: 1/12 pro Monat der Betriebszugehörigkeit" dark={dark} />
              <Row k="Übertragung" v="Urlaub ins nächste Jahr übertragen bis 31.03. — danach verfällt er" dark={dark} />
              <Row k="Kürzung" v="Bei Langzeitkrankheit anteilig kürzbar (EuGH-Rechtsprechung: mind. 4 Wochen bleiben)" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Feiertagsregelung im Schwimmbad</div>
              <Row k="Grundsatz ArbZG" v="An gesetzlichen Feiertagen grundsätzliches Beschäftigungsverbot" dark={dark} />
              <Row k="Ausnahme Bäder" v="Schwimmbäder dürfen an Feiertagen öffnen (§ 10 ArbZG Nr. 1: Freizeiteinrichtungen)" dark={dark} highlight />
              <Row k="Ausgleich" v="Ersatzruhetag innerhalb von 8 Wochen" dark={dark} />
              <Row k="Zuschlag TVöD" v="Feiertagszuschlag 135% des Stundenentgelts" dark={dark} />
              <Row k="Karfreitag / Volkstrauertag" v="Stille Feiertage — Einschränkungen für Musik/Veranstaltungen" dark={dark} />
            </div>

            <InfoBox title="Sonderurlaub & bezahlte Freistellung" dark={dark} items={[
              'Hochzeit: 1–3 Tage (je nach TV/BV)',
              'Geburt eines Kindes: 1–2 Tage',
              'Tod eines nahen Angehörigen: 1–3 Tage',
              'Umzug: 1 Tag (wenn beruflich veranlasst)',
              'Arztbesuch: nur wenn nicht außerhalb Arbeitszeit möglich',
              'Basis: § 616 BGB — wird durch TVöD konkretisiert',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
