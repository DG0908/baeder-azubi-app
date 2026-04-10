import { useState } from 'react';

const TABS = {
  dsgvo: 'DSGVO Grundlagen',
  bad: 'DSGVO im Bad',
  oeffentlichkeit: 'Öffentlichkeitsarbeit',
  socialmedia: 'Social Media',
  panne: 'Datenpanne',
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
    <span style={{ color: accent, fontWeight: 700, minWidth: 180, flexShrink: 0 }}>{k}</span>
    <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
  </div>
);

const PrinzipCard = ({ name, erklaerung, beispiel, dark }) => (
  <div style={{ background: dark ? '#1e293b' : '#f8fafc', border: `1px solid ${accent}40`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
    <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 4 }}>{name}</div>
    <div style={{ fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b', marginBottom: 4 }}>{erklaerung}</div>
    <div style={{ fontSize: 12, color: accent, fontStyle: 'italic' }}>Bsp.: {beispiel}</div>
  </div>
);

export default function DatenschutzOeaDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('dsgvo');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Verwaltung & Recht</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 4 }}>Datenschutz & Öffentlichkeitsarbeit</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>DSGVO-Grundlagen, Datenschutz im Bad, PR-Arbeit, Social Media und Datenpannen</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? accent : cardBg, color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {tab === 'dsgvo' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>DSGVO — Datenschutz-Grundverordnung</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Die DSGVO (EU 2016/679) gilt seit 25.05.2018 in ganz Europa. Sie regelt, wie personenbezogene Daten verarbeitet werden dürfen.</p>

            <div style={{ background: dark ? '#0c2d1a' : '#f0fdf4', border: `2px solid ${accent}40`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: accent, marginBottom: 8 }}>Was sind personenbezogene Daten?</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 8 }}>Alle Informationen, die eine natürliche Person direkt oder indirekt identifizierbar machen:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13 }}>
                {['Name, Adresse, Telefon', 'E-Mail-Adresse', 'Foto / Bild', 'IP-Adresse', 'Geburtsdatum', 'Kundennummer', 'Videoaufnahme', 'Gesundheitsdaten (besonders sensibel)'].map((it, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, color: dark ? '#cbd5e1' : '#475569' }}>
                    <span style={{ color: accent }}>•</span><span>{it}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Die 7 Grundsätze der DSGVO (Art. 5)</div>
            <PrinzipCard name="1. Rechtmäßigkeit" erklaerung="Daten dürfen nur verarbeitet werden wenn eine Rechtsgrundlage vorliegt (Einwilligung, Vertrag, gesetzliche Pflicht)." beispiel="Kundendaten für Jahreskartenvertrag." dark={dark} />
            <PrinzipCard name="2. Zweckbindung" erklaerung="Daten nur für den bei Erhebung festgelegten Zweck verwenden." beispiel="E-Mail für Kursbestätigung — nicht für Werbung ohne Zustimmung." dark={dark} />
            <PrinzipCard name="3. Datenminimierung" erklaerung="Nur die Daten erheben, die wirklich notwendig sind." beispiel="Für Einzel-Badeeintritt: kein Name nötig." dark={dark} />
            <PrinzipCard name="4. Richtigkeit" erklaerung="Falsche Daten müssen korrigiert oder gelöscht werden." beispiel="Adressänderung im Kundensystem." dark={dark} />
            <PrinzipCard name="5. Speicherbegrenzung" erklaerung="Daten nur so lange speichern wie nötig." beispiel="Kursanmeldung nach Kursende löschen (wenn keine Aufbewahrungspflicht)." dark={dark} />
            <PrinzipCard name="6. Integrität & Vertraulichkeit" erklaerung="Daten vor unbefugtem Zugriff schützen (technische + organisatorische Maßnahmen)." beispiel="Kundendaten nur für Mitarbeiter zugänglich — nicht für Aushilfen." dark={dark} />
            <PrinzipCard name="7. Rechenschaftspflicht" erklaerung="Betrieb muss DSGVO-Konformität nachweisen können." beispiel="Verarbeitungsverzeichnis führen, Datenschutzbeauftragter." dark={dark} />

            <InfoBox title="Betroffenenrechte (Art. 12–22 DSGVO)" dark={dark} items={[
              'Auskunftsrecht: Was wird über mich gespeichert? (Art. 15)',
              'Berichtigungsrecht: Falsche Daten korrigieren (Art. 16)',
              'Löschungsrecht / Recht auf Vergessen (Art. 17)',
              'Einschränkungsrecht: Verarbeitung stoppen (Art. 18)',
              'Widerspruchsrecht: Gegen bestimmte Verarbeitungen (Art. 21)',
              'Antwortfrist: Betrieb muss innerhalb 1 Monat antworten',
            ]} />
          </div>
        )}

        {tab === 'bad' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>DSGVO im Badebetrieb</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Videoüberwachung im Schwimmbad</div>
              <Row k="Rechtsgrundlage" v="Berechtigtes Interesse (Art. 6 Abs. 1 f DSGVO) — Sicherheit" dark={dark} />
              <Row k="Pflicht" v="Sichtbares Hinweisschild mit Kamerasymbol + Verantwortlichen" dark={dark} />
              <Row k="Bereiche verboten" v="Umkleiden, WC, Duschen — keine Überwachung erlaubt!" dark={dark} />
              <Row k="Speicherung" v="Nur so lange wie nötig — max. 72 h (ohne Vorfall)" dark={dark} />
              <Row k="Zugriff" v="Nur Befugte — bei Vorfall auch Polizei nach richterl. Anordnung" dark={dark} />
              <Row k="Zweck" v="Nur Sicherheit — kein Mitarbeiter-Monitoring" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Kundendaten (Jahreskarten, Kurse)</div>
              <Row k="Erhebung" v="Nur notwendige Daten: Name, Kontakt, ggf. Geburtsdatum" dark={dark} />
              <Row k="Speicherung" v="In sicherem System — Zugriff nur für berechtigte Mitarbeiter" dark={dark} />
              <Row k="Weitergabe" v="Nicht ohne Einwilligung — auch nicht intern ohne Zweck" dark={dark} />
              <Row k="Löschung" v="Nach Vertragsende + Aufbewahrungsfrist (steuerlich: 10 J.)" dark={dark} />
              <Row k="Datenschutzerklärung" v="Pflicht beim Datenerheben — schriftlich oder digital" dark={dark} />
            </div>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>Fotografieren im Schwimmbad durch Besucher</div>
              {[
                'Personen ohne Einwilligung zu fotografieren ist verboten (§ 22 KUG, DSGVO)',
                'Hausordnung kann Fotografieren generell untersagen — dann durchsetzen',
                'Kinder anderer Familien fotografieren: absolutes Verbot ohne Einwilligung der Eltern',
                'Social-Media-Posts mit erkennbaren Personen: Einwilligung erforderlich',
                'Verstoß melden und bei Weigerung: Hausverbot aussprechen',
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b' }}>
                  <span style={{ color: '#dc2626' }}>!</span><span>{it}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'oeffentlichkeit' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Öffentlichkeitsarbeit (PR)</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Öffentlichkeitsarbeit (Public Relations) ist die gezielte Kommunikation eines Unternehmens mit der Öffentlichkeit — um Vertrauen und Image zu pflegen.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>PR vs. Werbung</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: accent }}>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Kriterium</th>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Öffentlichkeitsarbeit (PR)</th>
                      <th style={{ padding: '7px 10px', color: '#fff', textAlign: 'left' }}>Werbung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Ziel', 'Vertrauen, Image, Beziehungen', 'Verkauf, Umsatz steigern'],
                      ['Zielgruppe', 'Breite Öffentlichkeit, Medien', 'Potenzielle Kunden'],
                      ['Bezahlung', 'Redaktionell — kostenlos (Presseartikel)', 'Bezahlte Anzeigen / Spots'],
                      ['Glaubwürdigkeit', 'Hoch — unabhängige Berichterstattung', 'Geringer — als Werbung erkennbar'],
                      ['Beispiel Bad', 'Presseartikel Neueröffnung, Tag der offenen Tür', 'Flyer, Anzeige, Banner'],
                    ].map(([k, pr, w], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#f0fdf4') : (dark ? '#0f172a' : '#fff') }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46' }}>{k}</td>
                        <td style={{ padding: '6px 10px', color: text }}>{pr}</td>
                        <td style={{ padding: '6px 10px', color: text }}>{w}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>PR-Instrumente im Schwimmbad</div>
              {[
                ['Pressemitteilung', 'Neue Kurse, Renovierung, Jubiläum — an Lokalredaktion schicken'],
                ['Tag der offenen Tür', 'Vertrauen aufbauen, neues Publikum ansprechen'],
                ['Kooperationen', 'Mit Schulen, Vereinen, Reha-Einrichtungen'],
                ['Veranstaltungen', 'Schwimmfest, Charity-Event, Schulschwimmen'],
                ['Website & Newsletter', 'Aktuelle Infos, Kursbuchung, Öffnungszeiten'],
                ['Feedback-Management', 'Beschwerden öffentlich sichtbar bearbeiten'],
              ].map(([k, v], i) => <Row key={i} k={k} v={v} dark={dark} />)}
            </div>
          </div>
        )}

        {tab === 'socialmedia' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Social Media im Bäderbetrieb</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Chancen & Risiken</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: accent, marginBottom: 6, fontSize: 13 }}>Chancen</div>
                  {['Direkte Kommunikation mit Gästen', 'Kurzfristige Infos (Schließung, Angebot)', 'Günstige Werbung', 'Imageaufbau, Community', 'Schnelles Krisenmanagement'].map((it, i) => (
                    <div key={i} style={{ fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b', display: 'flex', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: accent }}>+</span><span>{it}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 6, fontSize: 13 }}>Risiken</div>
                  {['Negative Bewertungen öffentlich', 'Datenschutzverletzungen', 'Falschinformationen', 'Reputationsschäden', 'Zeitaufwand für Pflege'].map((it, i) => (
                    <div key={i} style={{ fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b', display: 'flex', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: '#dc2626' }}>–</span><span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>DSGVO + Social Media — Regeln</div>
              {[
                'Fotos / Videos von Personen nur mit Einwilligung posten',
                'Kinder unter 14 Jahren: Einwilligung der Eltern zwingend',
                'Personenerkennbare Bilder ohne Einwilligung = DSGVO-Verstoß (Bußgeld)',
                'Impressumspflicht: Jeder Social-Media-Account mit Geschäftsbezug braucht Impressum',
                'Verlinkung auf externe Seiten: Haftungsrisiko bei Inhalten Dritter prüfen',
                'Kommentarfunktion: Moderationspflicht — Beleidigungen, Falschinformationen löschen',
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b' }}>
                  <span style={{ color: '#dc2626' }}>!</span><span>{it}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Social-Media-Richtlinie für Mitarbeiter" dark={dark} items={[
              'Keine internen Betriebsinformationen posten',
              'Keine Fotos von Gästen ohne Einwilligung',
              'Keine negativen Aussagen über Arbeitgeber',
              'Klare Trennung: privater Account ≠ Betriebsaccount',
              'Im Zweifel: Vorgesetzten fragen bevor etwas gepostet wird',
            ]} />
          </div>
        )}

        {tab === 'panne' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Datenpanne — Was tun?</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Eine Datenschutzverletzung (Art. 4 Nr. 12 DSGVO) liegt vor, wenn personenbezogene Daten unbeabsichtigt oder unrechtmäßig verloren gehen, vernichtet, verändert, offenbart oder zugänglich gemacht werden.</p>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>Meldefrist: 72 Stunden!</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 10 }}>Bei einer Datenpanne mit Risiko für Betroffene muss die Aufsichtsbehörde (Landesdatenschutzbehörde) innerhalb von <strong>72 Stunden</strong> informiert werden.</p>
              {[
                { step: '1', text: 'Panne erkennen und sofort Vorgesetzten / Datenschutzbeauftragten informieren' },
                { step: '2', text: 'Ausmaß ermitteln: Welche Daten? Wie viele Personen? Wie passiert?' },
                { step: '3', text: 'Schaden begrenzen: Zugang sperren, Passwort ändern, System isolieren' },
                { step: '4', text: 'Risikobewertung: Ist ein Risiko für Betroffene wahrscheinlich?' },
                { step: '5', text: 'Meldung an Datenschutzbehörde (wenn Risiko) — innerhalb 72 Stunden' },
                { step: '6', text: 'Information der Betroffenen (wenn hohes Risiko) — direkt und verständlich' },
                { step: '7', text: 'Dokumentation der Panne im internen Verzeichnis (Pflicht nach Art. 33)' },
              ].map(({ step, text: t }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ background: '#dc2626', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 12 }}>{step}</div>
                  <div style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13, paddingTop: 3 }}>{t}</div>
                </div>
              ))}
            </div>

            <InfoBox title="Typische Datenpannen im Schwimmbad" dark={dark} items={[
              'Kundenliste per E-Mail an falschen Empfänger gesendet',
              'Laptop mit Kundendaten gestohlen / verloren',
              'Unbefugter Zugriff auf Kassensystem / Kundenverwaltung',
              'Papier-Anmeldeformular falsch entsorgt (ohne Schredder)',
              'Social-Media-Post mit erkennbaren Personen ohne Einwilligung',
            ]} />

            <InfoBox title="Bußgelder bei DSGVO-Verstößen" dark={dark} color="#dc2626" items={[
              'Leichte Verstöße: bis 10 Mio. € oder 2% des Jahresumsatzes',
              'Schwere Verstöße (Grundsätze, Rechtsgrundlage): bis 20 Mio. € oder 4% des Jahresumsatzes',
              'Für kommunale Bäder: je nach Bundesland — Länder regeln Bußrahmen selbst',
              'Kein Bußgeld bei nachgewiesener Sorgfalt und schneller Reaktion',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
