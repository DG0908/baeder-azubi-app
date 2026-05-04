import { useState } from 'react';

const TABS = {
  ausbildung: 'Ausbildungsvertrag',
  rechte: 'Rechte & Pflichten',
  mitbestimmung: 'Mitbestimmung',
  tarifrecht: 'Tarifrecht & TVöD',
  beendigung: 'Beendigung & Übernahme',
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

const Row = ({ k, v, dark }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 13 }}>
    <span style={{ color: accent, fontWeight: 700, minWidth: 200, flexShrink: 0 }}>{k}</span>
    <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
  </div>
);

export default function BerufsrechtBasisDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('ausbildung');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Verwaltung & Recht</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 4 }}>Berufsrecht-Basis</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Ausbildungsvertrag, Rechte & Pflichten, Mitbestimmung, Tarifrecht und Beendigung der Ausbildung</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? accent : cardBg, color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {tab === 'ausbildung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Ausbildungsvertrag (BBiG)</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Der Ausbildungsvertrag ist die rechtliche Grundlage der Berufsausbildung. Er muss vor Ausbildungsbeginn schriftlich abgeschlossen und der zuständigen Stelle (IHK/HWK) gemeldet werden.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Pflichtinhalte nach § 11 BBiG</div>
              {[
                'Art, sachliche und zeitliche Gliederung der Ausbildung',
                'Beginn und Dauer der Ausbildung',
                'Ausbildungsstätte und Ausbildungsmaßnahmen außerhalb',
                'Dauer der regelmäßigen täglichen Ausbildungszeit',
                'Dauer der Probezeit (1–4 Monate)',
                'Vergütung und deren Staffelung (Ausbildungsjahr)',
                'Dauer des Urlaubs',
                'Voraussetzungen zur Kündigung',
                'Hinweis auf Tarifverträge, Betriebs- oder Dienstvereinbarungen',
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: text }}>
                  <span style={{ color: accent }}>§</span><span>{it}</span>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Probezeit</div>
              <Row k="Dauer" v="Mindestens 1 Monat, höchstens 4 Monate" dark={dark} />
              <Row k="Kündigung in Probezeit" v="Jederzeit ohne Grund und ohne Frist möglich" dark={dark} />
              <Row k="Nach Probezeit" v="Strenge Kündigungsregelungen — nur wichtiger Grund" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Mindestausbildungsvergütung (MAV) — gesetzlich</div>
              <p style={{ fontSize: 13, color: dark ? '#cbd5e1' : '#475569', marginBottom: 8 }}>
                § 17 BBiG schreibt eine gesetzliche Mindestvergütung vor. Sie wird jährlich durch das Bundesministerium für Bildung und Forschung (BMBF) angepasst und in der Regel zum 1. Januar veröffentlicht.
              </p>
              {[
                ['1. Ausbildungsjahr', 'Aktuelle Werte: BMBF / BIBB-Datenbank'],
                ['2. Ausbildungsjahr', '+ ca. 18 % gegenüber 1. Jahr'],
                ['3. Ausbildungsjahr', '+ ca. 35 % gegenüber 1. Jahr'],
                ['4. Ausbildungsjahr', '+ ca. 40 % gegenüber 1. Jahr (falls verlängert)'],
              ].map(([k, v], i) => <Row key={i} k={k} v={v} dark={dark} />)}
              <div style={{ fontSize: 12, color: sub, marginTop: 8, fontStyle: 'italic' }}>* Tarifvertrag (TVöD-V / TV-AVH etc.) hat Vorrang und liegt typischerweise deutlich höher. Aktuelle MAV-Werte unter <strong>bmbf.de</strong> oder <strong>bibb.de</strong> nachschlagen.</div>
            </div>

            <InfoBox title="Ausbildungsnachweis (Berichtsheft)" dark={dark} items={[
              'Azubi muss regelmäßig Ausbildungsnachweise führen (täglich oder wöchentlich)',
              'Betrieb muss dies ermöglichen — Arbeitszeit dafür freistellen',
              'Nachweise werden von Ausbilder gegengezeichnet',
              'Zulassung zur Prüfung erfordert ordnungsgemäße Nachweise',
            ]} />
          </div>
        )}

        {tab === 'rechte' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Rechte & Pflichten</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: dark ? '#0c2d1a' : '#f0fdf4', border: `1px solid ${accent}40`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 700, color: accent, marginBottom: 8 }}>Rechte des Azubis</div>
                {[
                  'Angemessene Ausbildungsvergütung',
                  'Urlaub (mind. 24 Werktage)',
                  'Freistellung für Berufsschule',
                  'Freistellung für Prüfungen',
                  'Ausbildungsnachweise führen dürfen',
                  'Zeugnis bei Beendigung',
                  'Kostenfreie Prüfungswiederholung (1×)',
                  'Schutz vor Überforderung / Diskriminierung',
                ].map((it, i) => (
                  <div key={i} style={{ fontSize: 13, color: text, display: 'flex', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: accent }}>✓</span><span>{it}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Pflichten des Azubis</div>
                {[
                  'Lernpflicht — Berufsschule besuchen',
                  'Sorgfältig ausführen was aufgetragen wird',
                  'Weisungen des Ausbilders befolgen',
                  'Betriebsgeheimnisse wahren',
                  'Betriebliche Einrichtungen sorgsam behandeln',
                  'Ausbildungsnachweise führen',
                  'Krankheit unverzüglich melden',
                  'Ärztliches Attest ab 3. Krankheitstag',
                ].map((it, i) => (
                  <div key={i} style={{ fontSize: 13, color: text, display: 'flex', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: '#dc2626' }}>!</span><span>{it}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Pflichten des Ausbildungsbetriebs</div>
              {[
                'Ausbildung planmäßig und zielgerichtet durchführen',
                'Nur ausbildungsrelevante Tätigkeiten anweisen (kein Missbrauch)',
                'Ausbildungsmittel kostenlos bereitstellen',
                'Berufsschulbesuch ermöglichen und freistellen',
                'Zeugnis ausstellen',
                'Vergütung pünktlich zahlen',
                'Azubi vor Gefahren schützen (Jugendarbeitsschutz)',
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: text }}>
                  <span style={{ color: accent }}>→</span><span>{it}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'mitbestimmung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Mitbestimmung</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Betriebsrat (BetrVG)</div>
              <Row k="Wer?" v="Gewähltes Organ der Arbeitnehmer ab 5 Beschäftigten" dark={dark} />
              <Row k="Wahl" v="Alle 4 Jahre — alle Arbeitnehmer ab 18 J. wahlberechtigt" dark={dark} />
              <Row k="Aufgabe" v="Interessen der Belegschaft gegenüber Arbeitgeber vertreten" dark={dark} />
              <Row k="Mitbestimmung bei" v="Arbeitszeiten, Urlaubsplanung, Betriebsordnung, Personalfragen" dark={dark} />
              <Row k="Schutz" v="Betriebsratsmitglieder sind unkündbar während Amtszeit" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>JAV — Jugend- und Auszubildendenvertretung</div>
              <Row k="Wer?" v="Gewählt von Azubis und Jugendlichen unter 18 J." dark={dark} />
              <Row k="Voraussetzung" v="Mind. 5 wahlberechtigte Azubis / Jugendliche im Betrieb" dark={dark} />
              <Row k="Aufgabe" v="Vertritt spezifische Interessen der Azubis gegenüber Betriebsrat und Arbeitgeber" dark={dark} />
              <Row k="Befugnisse" v="Antragsrecht beim Betriebsrat, kein eigenständiges Mitbestimmungsrecht" dark={dark} />
              <Row k="Wichtig" v="JAV-Mitglieder dürfen Betriebsratssitzungen mit beratender Stimme besuchen" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Im öffentlichen Dienst (Schwimmbäder oft kommunal)</div>
              <Row k="Statt Betriebsrat" v="Personalrat (Personalvertretungsgesetz der Länder)" dark={dark} />
              <Row k="Statt JAV" v="Jugend- und Auszubildendenvertretung beim Personalrat" dark={dark} />
              <Row k="Mitbestimmung" v="Ähnliche Rechte wie BetrVG — je nach Landespersonalvertretungsgesetz" dark={dark} />
            </div>

            <InfoBox title="Prüfungstipp" dark={dark} items={[
              'BetrVG gilt für private Betriebe — öffentlicher Dienst hat eigene Gesetze',
              'JAV hat kein eigenständiges Mitbestimmungsrecht — nur Antragsrecht',
              'Betriebsrat muss bei Kündigung angehört werden (§ 102 BetrVG)',
            ]} />
          </div>
        )}

        {tab === 'tarifrecht' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Tarifrecht & TVöD</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Was ist ein Tarifvertrag?</div>
              <p style={{ color: text, fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
                Ein Tarifvertrag ist ein Vertrag zwischen Gewerkschaft und Arbeitgeberverband, der Mindestbedingungen für Arbeitnehmer regelt (Lohn, Arbeitszeit, Urlaub etc.). Er gilt für alle Mitglieder beider Seiten — und oft auch für Nicht-Mitglieder (Allgemeinverbindlichkeit).
              </p>
              {[
                ['Tarifparteien', 'Gewerkschaft (z.B. ver.di) ↔ Arbeitgeberverband'],
                ['Inhalt', 'Vergütung, Arbeitszeit, Urlaub, Zuschläge, Kündigungsfristen'],
                ['Günstigkeitsprinzip', 'Arbeitsvertrag darf nie schlechter sein als Tarifvertrag'],
                ['Nachwirkung', 'Nach Ablauf gilt Tarifvertrag weiter bis neuer gilt'],
              ].map(([k, v], i) => <Row key={i} k={k} v={v} dark={dark} />)}
            </div>

            <div style={{ background: dark ? '#0c2d1a' : '#f0fdf4', border: `2px solid ${accent}40`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: accent, marginBottom: 10, fontSize: 15 }}>TVöD — Tarifvertrag öffentlicher Dienst</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 10 }}>Kommunale Schwimmbäder unterstehen meist dem TVöD (Kommunen). Er regelt Vergütung und Arbeitsbedingungen für kommunale Beschäftigte.</p>
              {[
                ['Entgeltgruppen', 'EG 1–15 — Bäderfachangestellte meist EG 5–7'],
                ['Stufen', 'Innerhalb jeder EG: Stufen 1–6 nach Betriebszugehörigkeit'],
                ['Jahressonderzahlung', 'Weihnachtsgeld: 60–90% eines Monatsgehalts (je nach EG)'],
                ['Leistungsentgelt', 'Leistungsbezogenes Entgelt zusätzlich möglich'],
                ['Urlaub', '30 Arbeitstage bei 5-Tage-Woche'],
                ['Arbeitszeit', '39 h/Woche West, 40 h/Woche Ost (kommunal)'],
                ['Zuschläge', 'Nacht 20 %, Sonntag 25 %, Feiertag 135 % (ohne Freizeitausgleich) bzw. 35 % (mit Freizeitausgleich) nach TVöD-V'],
              ].map(([k, v], i) => <Row key={i} k={k} v={v} dark={dark} />)}
            </div>

            <InfoBox title="Gewerkschaft ver.di" dark={dark} items={[
              'ver.di = Vereinte Dienstleistungsgewerkschaft — zuständig für Bäder',
              'Gewerkschaftsmitglieder erhalten tarifl. Leistungen + Rechtsschutz',
              'Streikrecht: nur organisierte Arbeitnehmer dürfen legal streiken',
              'Arbeitgeberverband Kommunen: VKA (Vereinigung kommunaler Arbeitgeberverbände)',
            ]} />
          </div>
        )}

        {tab === 'beendigung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Beendigung & Übernahme</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Kündigung in der Ausbildung (§ 22 BBiG)</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: accent }}>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Zeitpunkt</th>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Durch Azubi</th>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Durch Betrieb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['In der Probezeit', 'Jederzeit, ohne Grund, ohne Frist', 'Jederzeit, ohne Grund, ohne Frist'],
                      ['Nach der Probezeit', 'Mit 4 Wochen Frist — nur wichtiger Grund oder Berufswechsel', 'Nur bei wichtigem Grund (fristlos)'],
                      ['Wichtiger Grund', 'z.B. Mobbing, Ausbildungsmängel', 'z.B. Diebstahl, Tätlichkeit, Fehlen'],
                    ].map(([z, a, b], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#f0fdf4') : (dark ? '#0f172a' : '#fff') }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46' }}>{z}</td>
                        <td style={{ padding: '6px 10px', color: text }}>{a}</td>
                        <td style={{ padding: '6px 10px', color: text }}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Automatische Beendigung</div>
              <Row k="Bestehen der Prüfung" v="Ausbildung endet mit Bekanntgabe des Ergebnisses" dark={dark} />
              <Row k="Ablauf der Ausbildungszeit" v="Enddatum laut Vertrag — auch ohne bestandene Prüfung" dark={dark} />
              <Row k="Prüfungswiederholung" v="Ausbildung verlängert sich auf Antrag um max. 1 Jahr" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Zeugnis & Übernahme</div>
              <Row k="Einfaches Zeugnis" v="Pflicht — Dauer und Art der Ausbildung" dark={dark} />
              <Row k="Qualifiziertes Zeugnis" v="Auf Verlangen — Leistung und Verhalten" dark={dark} />
              <Row k="Übernahmepflicht" v="Keine gesetzliche Pflicht — aber Tarifvertrag kann sie vorsehen" dark={dark} />
              <Row k="TVöD" v="Befristete Übernahme nach Ausbildung möglich — Entfristung nach Bewährung" dark={dark} />
            </div>

            <InfoBox title="Schlichtung bei Streitigkeiten" dark={dark} items={[
              'Bei Streit um Kündigung oder Vertragspflichten: Zuständige Stelle anrufen (IHK)',
              'Schlichtungsausschuss kann eingeschaltet werden — kostenlos',
              'Erst Schlichtung, dann Arbeitsgericht',
              'Gewerkschaft / ver.di bietet Rechtsberatung für Mitglieder',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
