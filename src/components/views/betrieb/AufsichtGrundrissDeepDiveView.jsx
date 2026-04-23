import { useState } from 'react';

const TABS = {
  positionen: 'Aufsichtspositionen',
  gefahren: 'Gefahrenzonen',
  planung: 'Aufsichtsplanung',
  dguv: 'DGUV & Mindestbesetzung',
  doku: 'Dokumentation',
};

const InfoBox = ({ title, items, dark, color = '#9333ea' }) => (
  <div style={{ background: dark ? '#0f172a' : '#faf5ff', border: `1px solid ${color}40`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
    <div style={{ fontWeight: 700, color: color, marginBottom: 8 }}>{title}</div>
    {items.map((it, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, color: dark ? '#e2e8f0' : '#1e293b', fontSize: 14 }}>
        <span style={{ color: color, fontWeight: 700, minWidth: 14 }}>•</span>
        <span>{it}</span>
      </div>
    ))}
  </div>
);

const ZoneCard = ({ name, risiko, maßnahmen, dark, color }) => (
  <div style={{ background: dark ? '#1e293b' : '#f8fafc', border: `1px solid ${color}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <div style={{ fontWeight: 700, color: color, fontSize: 14 }}>{name}</div>
      <div style={{ background: color + '20', color: color, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Risiko: {risiko}</div>
    </div>
    {maßnahmen.map((m, i) => (
      <div key={i} style={{ fontSize: 13, color: dark ? '#cbd5e1' : '#475569', display: 'flex', gap: 6, marginBottom: 3 }}>
        <span style={{ color: color }}>→</span><span>{m}</span>
      </div>
    ))}
  </div>
);

export default function AufsichtGrundrissDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('positionen');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';
  const accent = '#9333ea';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Bäderbetrieb</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 4 }}>Aufsicht im Grundriss</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Aufsichtspositionen, Sichtlinien, Gefahrenzonen und Aufsichtsplanung im Schwimmbad</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? accent : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {tab === 'positionen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Aufsichtspositionen & Sichtlinien</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Die Aufsichtsperson muss jederzeit alle Bereiche des Beckens einsehen können. Tote Winkel sind durch Positionswahl oder zusätzliche Aufsicht zu vermeiden.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Grundprinzipien der Positionswahl</div>
              {[
                ['Erhöhte Position', 'Besser als auf Beckenniveau — Aufsichtsturm, erhöhtes Podest. Bessere Übersicht, weniger Sichteinschränkung durch Wasserspiegel.'],
                ['Rücken zur Wand', 'Kein blinder Rücken — immer so stehen, dass der gesamte Bereich im Blickfeld liegt.'],
                ['Sichtwechsel', 'Regelmäßig die Position wechseln — verhindert Gewöhnung (Vigilanzabfall) und schließt Totwinkelbereiche.'],
                ['Kein Ablenkung', 'Kein Handy, keine Gespräche mit Gästen während aktiver Aufsicht. Augen immer auf das Wasser.'],
                ['Parallelaufsicht', 'Bei mehreren Becken: klare Verantwortungsbereiche festlegen und kommunizieren.'],
              ].map(([k, v], i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', fontSize: 13 }}>{k}</div>
                  <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Typische Aufsichtspositionen im Hallenbad</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: accent }}>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Position</th>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Bereich</th>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Vorteil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Aufsichtsturm', 'Gesamtbecken', 'Vogelblick, große Reichweite'],
                      ['Beckenecke', 'Zwei Seiten gleichzeitig', 'Wenig Toter Winkel'],
                      ['Beckenlängsseite Mitte', 'Beide Beckenhälften', 'Schneller Zugang zur Mitte'],
                      ['Sprungbereich', 'Sprunganlage direkt', 'Sofortige Reaktion möglich'],
                      ['Nichtschwimmerbereich', 'Flachufer, Planschbecken', 'Kinder im Fokus'],
                    ].map(([p, b, v], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#faf5ff') : (dark ? '#0f172a' : '#fff') }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed' }}>{p}</td>
                        <td style={{ padding: '6px 10px', color: text }}>{b}</td>
                        <td style={{ padding: '6px 10px', color: dark ? '#94a3b8' : '#64748b' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <InfoBox title="Vigilanzabfall — das unterschätzte Risiko" dark={dark} color="#dc2626" items={[
              'Nach 20–30 Min. kontinuierlicher Aufsicht sinkt die Aufmerksamkeit messbar',
              'Regelmäßiger Positionswechsel alle 15–20 Min. empfohlen (DGUV)',
              'Ablösung durch Kollegen nach max. 45–60 Min. aktiver Beckenaufsicht',
              'Stille Momente im Bad erhöhen das Risiko — gerade dann aktiv scannen',
            ]} />
          </div>
        )}

        {tab === 'gefahren' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Gefahrenzonen im Schwimmbad</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Nicht alle Bereiche sind gleich riskant. Diese Zonen erfordern erhöhte Aufmerksamkeit:</p>

            <ZoneCard name="Sprunganlage & Sprungtürme" risiko="Sehr hoch" color="#dc2626" dark={dark} maßnahmen={[
              'Nur eine Person auf dem Brett / Turm gleichzeitig',
              'Kein Nachspringen bis Vordermann weg ist',
              'Sprungbereich vor Sprung frei — Aufsicht prüft aktiv',
              'Rückwärtsspringen / Saltos nur mit besonderer Freigabe',
            ]} />
            <ZoneCard name="Nichtschwimmerbereich / Flachwasser" risiko="Hoch" color="#f97316" dark={dark} maßnahmen={[
              'Kinder unter 6 Jahren in Begleitung Erwachsener',
              'Grenze Schwimmer/Nichtschwimmer klar markieren (Leine)',
              'Überfüllung beobachten — Sichttiefe nimmt ab',
              'Kleinkinder können in 20 cm Wasser ertrinken',
            ]} />
            <ZoneCard name="Rutschenauslauf" risiko="Hoch" color="#f97316" dark={dark} maßnahmen={[
              'Auslaufbereich muss frei sein bevor nächster startet',
              'Signal-System mit Rutschen-Eingang abstimmen',
              'Kein Sitzen / Verweilen im Auslauf',
            ]} />
            <ZoneCard name="Beckenboden (Sichttiefe)" risiko="Mittel-Hoch" color="#eab308" dark={dark} maßnahmen={[
              'Trübes Wasser = sofortige Maßnahme (Badebetrieb einstellen)',
              'DIN 19643: Sichttiefe mind. Beckentiefe am tiefsten Punkt',
              'Regelmäßige Sichttiefenmessung und Dokumentation',
            ]} />
            <ZoneCard name="Umkleiden / Nassbereich / Dusche" risiko="Mittel" color="#eab308" dark={dark} maßnahmen={[
              'Rutschgefahr auf nassen Fliesen — Antirutschmatten',
              'Regelmäßige Kontrollgänge auch in diese Bereiche',
              'Keine direkte visuelle Überwachung möglich — Patrouille',
            ]} />

            <InfoBox title="Tote Winkel aktiv schließen" dark={dark} color={accent} items={[
              'Tote Winkel durch Säulen, Einbauten oder Kurven entstehen',
              'Lösung: Spiegel, Kameraüberwachung oder zweite Aufsichtsposition',
              'Laufende Runde (Patrol) ergänzt stationäre Aufsicht',
              'Im Aufsichtsplan dokumentieren welcher Bereich von wo eingesehen wird',
            ]} />
          </div>
        )}

        {tab === 'planung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Aufsichtsplanung</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Faktoren der Aufsichtsplanung</div>
              {[
                ['Besucherzahl', 'Je mehr Gäste, desto mehr Aufsichtspersonen. Stoßzeiten planen.'],
                ['Beckenart', 'Sprungbecken / Wellenbad / Kinderbereich = höherer Bedarf'],
                ['Tageszeit', 'Schulzeiten, Kursbetrieb, Vereinstraining separat planen'],
                ['Qualifikation', 'Nur ausgebildete Fachangestellte / Rettungsschwimmer (mind. DRSA Bronze)'],
                ['Ablösung', 'Klare Übergabezeiten — keine Aufsichtslücke während Ablösung'],
                ['Pausenregelung', 'Pausen nur mit vollständiger Vertretung — nie Becken unbeaufsichtigt'],
              ].map(([k, v], i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', fontSize: 13 }}>{k}</div>
                  <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Ablösung — richtig durchführen</div>
              {[
                { step: '1', text: 'Ablösende Person ist vollständig anwesend und bereit' },
                { step: '2', text: 'Kurze mündliche Übergabe: Besonderheiten, auffällige Gäste, offene Punkte' },
                { step: '3', text: 'Ablösende übernimmt aktiv den Blick aufs Wasser' },
                { step: '4', text: 'Ablösende bestätigt Übernahme — erst dann verlässt der andere seinen Posten' },
              ].map(({ step, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ background: accent, color: '#fff', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 12 }}>{step}</div>
                  <div style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13, paddingTop: 4 }}>{text}</div>
                </div>
              ))}
            </div>

            <InfoBox title="Sonderveranstaltungen & Kursbetrieb" dark={dark} color={accent} items={[
              'Schulklassen: Aufsichtspflicht des Lehrers + Bademeister — keine Übertragung',
              'Vereinstraining: Trainer ist mit verantwortlich, Bademeister behält Hausrecht',
              'Feste / Veranstaltungen: erhöhten Aufsichtsbedarf separat einplanen',
              'Kurse (Schwimmkurs etc.): Kursleiter hat eigene Aufsichtspflicht',
            ]} />
          </div>
        )}

        {tab === 'dguv' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>DGUV 107-004 & Mindestbesetzung</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Die DGUV Information 107-004 (früher BGR/GUV-I 8681) regelt Sicherheit und Aufsicht in Bädern. Sie ist die wichtigste Rechtsgrundlage für den Aufsichtsdienst.</p>

            <div style={{ background: dark ? '#1e1040' : '#faf5ff', border: `2px solid ${accent}40`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: accent, marginBottom: 10 }}>Mindestbesetzung nach DGUV 107-004</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: accent }}>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Beckentyp / Situation</th>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Mindestbesetzung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Hallenbad bis 400 m² Wasserfläche', '1 Aufsichtsperson'],
                      ['Hallenbad über 400 m² Wasserfläche', '2+ Aufsichtspersonen'],
                      ['Freibad bis 800 m² Wasserfläche', '1 Aufsichtsperson'],
                      ['Freibad über 800 m² Wasserfläche', '2+ Aufsichtspersonen'],
                      ['Sprunganlage in Betrieb', 'Separate Aufsicht am Sprungbereich'],
                      ['Wellenbetrieb / Attraktion', 'Erhöhter Bedarf — trägerspezifisch'],
                      ['Kursbetrieb (Nichtschwimmer)', 'Mind. 1 ausgebildete Aufsicht'],
                    ].map(([b, m], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#faf5ff') : (dark ? '#0f172a' : '#fff') }}>
                        <td style={{ padding: '6px 10px', color: text }}>{b}</td>
                        <td style={{ padding: '6px 10px', fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed' }}>{m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 12, color: sub, marginTop: 8 }}>* Mindestbesetzung = Untergrenze. Betreiber kann und soll bei Bedarf mehr einsetzen.</div>
            </div>

            <InfoBox title="Qualifikationsanforderungen" dark={dark} color={accent} items={[
              'Aufsichtsperson: mind. Deutsches Rettungsschwimmabzeichen (DRSA) Bronze',
              'Fachangestellte für Bäderbetriebe: Ausbildung umfasst alle Anforderungen',
              'Auffrischung: DRSA muss regelmäßig erneuert werden (alle 2 Jahre)',
              'Erste Hilfe: aktueller Kurs Pflicht (max. 2 Jahre alt)',
              'Ungeeignete Personen (Alkohol, Krankheit) dürfen keine Aufsicht übernehmen',
            ]} />

            <InfoBox title="Konsequenzen bei Verstoß" dark={dark} color="#dc2626" items={[
              'Zivilrechtlich: Schadensersatz bei Personenschaden durch Aufsichtsmangel',
              'Strafrechtlich: § 229 StGB (fahrlässige Körperverletzung), § 222 (fahrl. Tötung)',
              'Ordnungswidrigkeiten: Bußgeld durch Gewerbeaufsicht / Gesundheitsamt',
              'Betriebsschließung bei wiederholten schweren Verstößen möglich',
            ]} />
          </div>
        )}

        {tab === 'doku' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Dokumentation der Aufsicht</h2>

            <InfoBox title="Was muss dokumentiert werden?" dark={dark} color={accent} items={[
              'Dienstbeginn und -ende jeder Aufsichtsperson (mit Unterschrift)',
              'Positionswechsel und Ablösungen',
              'Besondere Vorkommnisse (auch kleine: Ermahnung, Regelverstöße)',
              'Notfälle / Unfälle: separates Unfallprotokoll',
              'Wasserqualitätsmessungen (pH, Redox, freies Chlor — mehrmals täglich)',
              'Sichttiefenmessungen',
              'Technische Auffälligkeiten und Meldungen',
            ]} />

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Aufbewahrungsfristen</div>
              {[
                ['Aufsichtsbuch / Betriebstagebuch', '3–5 Jahre'],
                ['Unfallprotokolle', '10 Jahre (bei Personenschäden länger)'],
                ['Wasserqualitätsmessungen', 'Mind. 1 Jahr (DIN 19643: 3 Jahre)'],
                ['Wartungsnachweise technischer Anlagen', 'Gesamte Betriebsdauer + 5 J.'],
                ['Erste-Hilfe-Leistungen', '5 Jahre'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: accent, fontWeight: 700, minWidth: 260 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Prüfungstipp" dark={dark} color="#059669" items={[
              'Dokumentation = Beweis im Streitfall. „Was nicht dokumentiert ist, hat nicht stattgefunden."',
              'Eintragungen müssen zeitnah erfolgen — keine nachträglichen Korrekturen ohne Kennzeichnung',
              'Unleserliche oder fehlerhafte Einträge können im Rechtsstreit gegen den Betreiber verwendet werden',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
