import { useState } from 'react';

const TABS = {
  kippstart: 'Kippstart',
  rueckenstart: 'Rückenstart',
  wenden: 'Wenden',
  anschlaege: 'Anschläge',
  taktik: 'Taktik & Unterwasser',
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

const Phase = ({ nr, name, desc, dark }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
    <div style={{ background: '#0891b2', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>{nr}</div>
    <div>
      <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', fontSize: 14 }}>{name}</div>
      <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{desc}</div>
    </div>
  </div>
);

export default function StartsWendenDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('kippstart');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Schwimmen & Rettung</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 4 }}>Starts & Wenden</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Startsprungtechnik, Rückenstart, Wendentechnik und Anschlagsregeln</p>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? '#0891b2' : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {/* KIPPSTART */}
        {tab === 'kippstart' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Kippstart — Startsprung vorwärts</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Der Kippstart (auch: Startsprung) wird bei Brust-, Kraul- und Schmetterling-Strecken eingesetzt. Ziel: flacher Eintauchwinkel, maximale Gleitphase.</p>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 12 }}>Phasen des Kippstarts</div>
              <Phase nr={1} name="Startposition" desc='Füße schulterbreit, Zehen über Startklotz-Kante. Beim Griff-Start: Hände greifen Startklotz-Vorderkante. Körper leicht nach vorne geneigt.' dark={dark} />
              <Phase nr={2} name="Startsignal & Abdruckphase" desc='Beim akustischen Startsignal (Pfiff/Ton): Kraftvoller Abzug mit Armen, gleichzeitiger Beinabdruck. Körper streckt sich diagonal nach vorne-unten.' dark={dark} />
              <Phase nr={3} name="Flugphase" desc='Körper gestreckt, Arme vorne, Kopf zwischen den Armen. Flacher Winkel anstreben (ca. 15°–25°).' dark={dark} />
              <Phase nr={4} name="Eintauchen" desc='Hände zuerst, Körper wie ein Pfeil. Beine in Verlängerung. Tiefe: ca. 40–60 cm unterhalb Wasseroberfläche.' dark={dark} />
              <Phase nr={5} name="Unterwasserphase" desc='Delphinschläge bis ca. 15 m (Wettkampf-Limit). Dann auftauchen und ersten Armzug einleiten.' dark={dark} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <InfoBox title="Greifstart (Grab-Start)" dark={dark} color="#0891b2" items={[
                'Hände greifen Startklotz-Vorderkante',
                'Stabilerer Start, weniger Reaktionszeit',
                'Empfohlen für Anfänger & Training',
              ]} />
              <InfoBox title="Trackstart (Rennstart)" dark={dark} color="#0e7490" items={[
                'Ein Fuß vorne, einer hinten auf Startblock-Stufe',
                'Schnellerer Startblock-Abgang',
                'Bevorzugt im Wettkampf',
              ]} />
            </div>

            <InfoBox title="Häufige Fehler" dark={dark} color="#dc2626" items={[
              'Zu steiler Eintauchwinkel → taucht zu tief, verliert Geschwindigkeit',
              'Kopf zu früh heben → Körper klappt durch',
              'Beine nicht gestreckt beim Eintauchen',
              'Unterwasserphase zu kurz oder zu lang (> 15 m = DQ im Wettkampf)',
            ]} />
          </div>
        )}

        {/* RÜCKENSTART */}
        {tab === 'rueckenstart' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Rückenstart</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Der Rückenstart ist die einzige Starttechnik im Wasser. Schwimmer hängen sich am Startgriff (Rückenstartbügel) auf, Füße an der Beckenwand.</p>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 12 }}>Startablauf</div>
              <Phase nr={1} name="Ausgangsposition" desc='Hände am Rückenstartbügel (Griff), Füße schulterbreit an der Beckenwand, Knie leicht gebeugt. Körper dicht an der Wand.' dark={dark} />
              <Phase nr={2} name={'„Fertig"-Kommando'} desc='Hüfte hebt sich aus dem Wasser, Knie angewinkelt, Gesicht nach oben, Körper gespannt.' dark={dark} />
              <Phase nr={3} name="Abwurf" desc='Arme schwingen nach hinten-oben, Beine stoßen kraftvoll von der Wand ab. Kopf bleibt zwischen den Armen.' dark={dark} />
              <Phase nr={4} name="Bogen" desc='Flacher Rückwärtsbogen, Hände voran ins Wasser. Körper gestreckt wie ein Pfeil.' dark={dark} />
              <Phase nr={5} name="Eintauchen & Gleit" desc='Auf dem Rücken ins Wasser, Delphinschläge auf dem Rücken (max. 15 m), dann Umrollen und erster Armzug.' dark={dark} />
            </div>

            <div style={{ background: dark ? '#0c1a2e' : '#eff6ff', border: '1px solid #3b82f640', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 10 }}>Rückenstart-Vorrichtungen am Startblock</div>
              <div style={{ color: text, fontSize: 14, lineHeight: 1.6 }}>
                Es gibt zwei Bauteile: <strong>Rückenstartgriffe</strong> direkt am Startblock (in mehreren Höhen) und seit 2014 zusätzlich die <strong>Backstroke Ledge</strong> — ein einklappbares Brett am Startblock, max. 4&nbsp;cm über/unter Wasseroberfläche.
              </div>
              <div style={{ marginTop: 10 }}>
                {[
                  ['Rückenstartgriffe', 'Horizontale/vertikale Griffe am Startblock — fester Halt für die Hände'],
                  ['Backstroke Ledge', 'Ausklappbare Standfläche am Block, max. 4 cm über WO (seit 2014/15)'],
                  ['Handposition', 'Schulterbreit, Daumen von unten — Hände an den Griffen'],
                  ['Fußposition', 'Mit Ledge: beide Füße auf dem Brett. Ohne Ledge: Füße flach an die Wand, dürfen bis kurz unter Wasser stehen — Zehen nicht auf dem Wasserabweiser/Rinnenrand'],
                  ['Pflicht', 'Bei allen offiziellen Wettkämpfen vorgeschrieben'],
                  ['Nicht verwechseln', 'Die Rücken-Wendefahnen (5 m vor der Wand, ca. 1,8 m über Wasser) sind etwas anderes — sie dienen nur der Orientierung beim Anschwimmen.'],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: '#3b82f6', fontWeight: 700, minWidth: 130 }}>{k}</span>
                    <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <InfoBox title="Häufige Fehler" dark={dark} color="#dc2626" items={[
              'Füße rutschen von der Wand → zu wenig Druck, nasse Wand',
              'Kopf zu früh senken → zu steiler Eintauchwinkel',
              'Arme nicht parallel → seitliches Einsinken',
              'Rücken-Delphinschlag fehlt → wertvolle Meter verschenkt',
            ]} />
          </div>
        )}

        {/* WENDEN */}
        {tab === 'wenden' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Wendentechnik</h2>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Rollwende (Kraul & Rücken)</div>
              <Phase nr={1} name="Einrollen" desc='Letzte Armbewegung leitet die Rolle (Salto vorwärts) ein — Kinn zur Brust, Beine angezogen.' dark={dark} />
              <Phase nr={2} name="Fußaufsatz" desc='Beide Füße gleichzeitig an der Wand, Knie ca. 90° gebeugt.' dark={dark} />
              <Phase nr={3} name="Abstoß" desc='Kraftvoller Beinabdruck, Arme vorne gestreckt, Körper in Rückenlage (Rücken) bzw. Bauchlage (Kraul) drehen.' dark={dark} />
              <Phase nr={4} name="Gleit & Delphin" desc='Gestreckt gleiten, Delphinschläge bis ca. 15 m, dann erster Armzug.' dark={dark} />
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Brustwende</div>
              <Phase nr={1} name="Anschlag" desc='Beide Hände gleichzeitig, in Schulterhöhe, an der Wand (Pflicht! sonst DQ).' dark={dark} />
              <Phase nr={2} name="Drehen" desc='Eine Hand loslassen, Körper zur Seite drehen, Knie anziehen.' dark={dark} />
              <Phase nr={3} name="Fußaufsatz" desc='Beide Füße flach an der Wand.' dark={dark} />
              <Phase nr={4} name="Abstoß" desc='Kräftiger Beinabdruck, in Bauchlage drehen, Gleit. Erlaubt: 1 voller Armzug bis zu den Beinen + 1 Delphinkick + 1 Brust-Beinschlag (seit 2005 World Aquatics).' dark={dark} />
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Schmetterlings-Wende</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 8 }}>Wie Brustwende — beidhändiger Anschlag Pflicht. Abstoß in Bauchlage, Delphinschläge.</p>
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Rücken → Brust (Lagen-Staffel)</div>
              <p style={{ color: text, fontSize: 13 }}>Beim Übergang Rücken→Brust in der Lagenstaffel: letzter Armzug darf in Bauchlage eingeleitet werden (sog. „Kipp-Wende"). Einhandige Berührung ist nicht erlaubt.</p>
            </div>

            <InfoBox title="Prüfungstipp" dark={dark} color="#059669" items={[
              'Rollwende: kein Anschlag nötig — Füße müssen die Wand berühren',
              'Brustwende: beidhändiger Anschlag auf gleicher Höhe obligatorisch',
              'Rückenwende: wie Rollwende, aber mit 90°-Körperdrehung beim Abstoß',
              'Nach jeder Wende: Unterwasserphase max. 15 m',
            ]} />
          </div>
        )}

        {/* ANSCHLÄGE */}
        {tab === 'anschlaege' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Anschlagsregeln</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Am Ziel und bei Wenden gelten je nach Lage verschiedene Regeln. Fehler führen zur Disqualifikation (DQ).</p>

            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#0891b2' }}>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Lage</th>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Anschlag</th>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Körperlage</th>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>DQ-Gefahr</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Kraul', 'Einhändig', 'Bauchlage (beliebig)', 'Auf Rücken finishen'],
                    ['Rücken', 'Einhändig', 'Rückenlage', 'Zur Seite drehen bei Anschlag'],
                    ['Brust', 'Beidhändig, gleich hoch', 'Bauchlage', 'Ein Arm, unterschiedliche Höhe'],
                    ['Schmetterling', 'Beidhändig, gleich hoch', 'Bauchlage', 'Ein Arm, Körper seitlich'],
                    ['Lagen (Einzel)', 'Je nach Lage', 'Wechsel lt. Reihenfolge', 'Falsche Reihenfolge Schm→Rü→Br→Kr'],
                  ].map(([l, a, k, d], i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#f0f9ff') : (dark ? '#0f172a' : '#fff') }}>
                      <td style={{ padding: '7px 12px', fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1' }}>{l}</td>
                      <td style={{ padding: '7px 12px', color: text }}>{a}</td>
                      <td style={{ padding: '7px 12px', color: text }}>{k}</td>
                      <td style={{ padding: '7px 12px', color: '#dc2626', fontSize: 12 }}>{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoBox title="Reihenfolge der Lagen" dark={dark} color="#7c3aed" items={[
              'Einzellagen (200 m / 400 m Lagen): 1. Schmetterling → 2. Rücken → 3. Brust → 4. Freistil',
              'Lagenstaffel (4 × 100 m): 1. Rücken → 2. Brust → 3. Schmetterling → 4. Freistil (Rücken zuerst, weil Wasserstart)',
              'Merkhilfe Einzellagen: S–R–B–K (Schmetterling, Rücken, Brust, Kraul)',
            ]} />
          </div>
        )}

        {/* TAKTIK */}
        {tab === 'taktik' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Taktik & Unterwasserphase</h2>

            <InfoBox title="Unterwasserphase — warum so wichtig?" dark={dark} color="#0891b2" items={[
              'Unter Wasser entsteht weniger Wellenreibung → höhere Geschwindigkeit als an der Oberfläche',
              'Delphinschläge sind nach Start und Wende oft schneller als Armzüge',
              'Limit: 15 Meter nach Start und nach jeder Wende (World Aquatics Regel)',
              'Ausnahme Brust: 1 voller Armzug bis zu den Beinen + 1 Delphinkick + 1 Brust-Beinschlag erlaubt',
            ]} />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Delphinschlag-Technik (Unterwasser)</div>
              {[
                ['Amplitude', 'Klein halten — große Amplitude kostet Vorwärtskraft'],
                ['Frequenz', 'Schnell schlagen — Kraft aus der Hüfte, nicht den Knien'],
                ['Körperposition', 'Leicht gestreckt, Arme vorne zusammen'],
                ['Auftauchen', 'Letzter Schlag nach oben → natürlich an die Oberfläche'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 110 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Wendenoptimierung — Zeitmessung</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 8 }}>Bei einer 100m-Strecke macht eine sauber optimierte Wende 0,3–0,8 Sekunden Unterschied. Tipps:</p>
              {[
                'Früh genug zählen — letzten Armzug anpassen, nicht antasten',
                'Rollgeschwindigkeit beibehalten — nicht abstoppen',
                'Fußaufsatz flach, nicht auf Zehen',
                'Abstoßwinkel: leicht nach oben-vorn (10°–15°)',
                'Sauber in die Gleitposition rotieren, bevor Delphinschläge starten',
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b' }}>
                  <span style={{ color: '#0891b2', fontWeight: 700 }}>→</span><span>{it}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Prüfungsfragen" dark={dark} color="#059669" items={[
              'Warum ist die Unterwasserphase schneller? → Weniger Wellenreibung',
              'Wie lang darf die Unterwasserphase maximal sein? → 15 Meter',
              'Welche Ausnahme gilt beim Brustschwimmen? → 1 voller Armzug + 1 Delphinkick + 1 Brust-Beinschlag',
              'Was ist der Unterschied Rollwende/Brustwende? → Brust braucht beidhändigen Anschlag',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
