import { useState } from 'react';

const TABS = {
  kassenbuch: 'Kassenbuch',
  tickets: 'Ticketsysteme',
  abschluss: 'Tagesabschluss',
  buchfuehrung: 'Buchführung Grundlagen',
  kontrolle: 'Fehler & Kontrolle',
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

export default function KasseAbrechnungDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('kassenbuch');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Verwaltung & Recht</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 4 }}>Kasse & Abrechnung</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Kassenbuch, Ticketsysteme, Tagesabschluss, Buchführungsgrundlagen und Kassenkontrolle</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? accent : cardBg, color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {tab === 'kassenbuch' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Kassenbuch</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Das Kassenbuch dokumentiert alle Bargeldbewegungen. Es ist ein Pflichtdokument für die Buchführung und muss lückenlos geführt werden.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Aufbau des Kassenbuchs</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: accent }}>
                      {['Datum', 'Beleg-Nr.', 'Bezeichnung', 'Einnahme (+)', 'Ausgabe (–)', 'Saldo'].map(h => (
                        <th key={h} style={{ padding: '7px 8px', color: '#fff', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['10.04.2026', '001', 'Kassenanfangsbestand', '200,00 €', '—', '200,00 €'],
                      ['10.04.2026', '002', 'Eintrittsgelder', '485,50 €', '—', '685,50 €'],
                      ['10.04.2026', '003', 'Kiosk-Einnahmen', '67,80 €', '—', '753,30 €'],
                      ['10.04.2026', '004', 'Wechselgeld geholt', '—', '50,00 €', '703,30 €'],
                    ].map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#f0fdf4') : (dark ? '#0f172a' : '#fff') }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: '5px 8px', color: j === 3 ? '#059669' : j === 4 ? '#dc2626' : text, fontWeight: j === 5 ? 700 : 400 }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Grundregeln der Kassenführung</div>
              {[
                'Kassenbestand kann nie negativ sein — Saldo immer ≥ 0',
                'Jede Buchung braucht einen Beleg (Quittung, Kassenbon)',
                'Eigenbelege nur in Ausnahmefällen — z.B. Trinkgeld, kleines Porto',
                'Streichungen: sichtbar durchstreichen — nie überkleben oder Tipp-Ex',
                'Tagesabschluss immer vor Kassensturz — Kassenbestand zählen',
                'Differenzen sofort dokumentieren und melden — nie selbst ausgleichen',
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: text }}>
                  <span style={{ color: accent }}>→</span><span>{it}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Belegpflicht" dark={dark} items={[
              'Einnahme: Kassenbon / Quittung (Kassenbon-Pflicht seit 2020)',
              'Ausgabe: Quittung des Lieferanten / Dienstleisters',
              'Eigenbeleg: Datum, Betrag, Zweck, Unterschrift',
              'Aufbewahrung: 10 Jahre (§ 147 AO)',
            ]} />
          </div>
        )}

        {tab === 'tickets' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Ticketsysteme & Tarife</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Typische Tarifarten im Schwimmbad</div>
              {[
                ['Einzelticket Erwachsene', 'Normaler Eintrittspreis für 1 Person'],
                ['Einzelticket Ermäßigt', 'Kinder, Schüler, Studenten, Rentner, Schwerbehinderte'],
                ['Familientageskarte', 'Pauschalpreis für definierte Familiengruppe (z.B. 2 Erw. + 2 Kinder)'],
                ['10er-Karte / Mehrfahrtenkarte', 'Rabatt bei Vorkauf — Verwaltung über Kundenkonto oder Stempel'],
                ['Monatskarte / Jahreskarte', 'Abonnement — personengebunden, nicht übertragbar'],
                ['Gruppenticket', 'Ab bestimmter Personenzahl Rabatt — Schulklassen, Vereine'],
                ['Kurseintritt', 'Kombination Schwimmen + Kurs — höherer Preis'],
                ['Saunaeintritt', 'Oft als Aufpreis auf Badeticket'],
              ].map(([k, v], i) => <Row key={i} k={k} v={v} dark={dark} />)}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Kassensysteme</div>
              <Row k="Manuelle Kasse" v="Einfachste Form — handschriftliches Kassenbuch + Geldzählung" dark={dark} />
              <Row k="Elektronische Kasse" v="Registrierkasse mit Bon-Druck — automatische Erfassung" dark={dark} />
              <Row k="POS-System" v="Point-of-Sale-Software — Ticketverkauf, Kundenverwaltung, Berichte" dark={dark} />
              <Row k="Automat" v="Selbstbedienung — Karten- und Barzahlung — 24h möglich" dark={dark} />
              <Row k="Chipkartenystem" v="Prepaid-Karte für Bad — Buchung über Lesegeräte (modern)" dark={dark} />
              <Row k="Online-Buchung" v="Tickets vorab buchen — Entlastung der Kasse, Kapazitätssteuerung" dark={dark} />
            </div>

            <InfoBox title="Ermäßigungsnachweis" dark={dark} items={[
              'Ermäßigter Tarif: Nachweis vorlegen lassen (Ausweis, Schülerausweis, Behindertenausweis)',
              'Schwerbehinderung: GdB ≥ 50% mit Ausweis — oft freier Eintritt für Begleitperson (Merkzeichen B)',
              'Rentner: nicht automatisch — nur wenn Tarif explizit vorgesehen',
              'Sozialtarif: KreisPass / München-Pass etc. — Nachweis Pflicht',
            ]} />
          </div>
        )}

        {tab === 'abschluss' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Tagesabschluss</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Am Ende jedes Geschäftstages wird der Kassenbestand gezählt und mit dem Soll-Bestand aus dem Kassenbuch abgeglichen.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Ablauf Kassenabschluss</div>
              {[
                { step: '1', text: 'Kassenbuch abschließen — Summe Einnahmen und Ausgaben berechnen' },
                { step: '2', text: 'Soll-Bestand ermitteln: Anfangsbestand + Einnahmen – Ausgaben' },
                { step: '3', text: 'Ist-Bestand zählen — Scheine und Münzen getrennt nach Stückelung' },
                { step: '4', text: 'Soll / Ist vergleichen — Differenz notieren' },
                { step: '5', text: 'Kassenbon aus Registrierkasse mit Kassenbuch abgleichen' },
                { step: '6', text: 'Tageseinnahmen in Tresor einlegen oder zur Bank bringen' },
                { step: '7', text: 'Kassenbestand für nächsten Tag (Wechselgeld) zurücklegen' },
                { step: '8', text: 'Tagesabschluss im System durchführen und ausdrucken' },
                { step: '9', text: 'Unterschrift — Abrechnung an Buchhaltung / Vorgesetzten' },
              ].map(({ step, text: t }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ background: accent, color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 12 }}>{step}</div>
                  <div style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13, paddingTop: 3 }}>{t}</div>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Münzzählung — Stückelungsübersicht</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13 }}>
                {[
                  ['2 € Münze', '× __ = __'],
                  ['1 € Münze', '× __ = __'],
                  ['50 Ct', '× __ = __'],
                  ['20 Ct', '× __ = __'],
                  ['10 Ct', '× __ = __'],
                  ['5 Ct', '× __ = __'],
                  ['2 Ct', '× __ = __'],
                  ['1 Ct', '× __ = __'],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, color: dark ? '#cbd5e1' : '#475569', padding: '3px 0' }}>
                    <span style={{ fontWeight: 700, color: accent }}>{k}</span>
                    <span style={{ color: sub }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'buchfuehrung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Buchführungsgrundlagen</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Als Fachangestellter im Bäderbetrieb solltest du die Grundbegriffe der Buchführung verstehen — auch wenn die Buchhaltung die Fachkraft übernimmt.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Wichtige Begriffe</div>
              {[
                ['Einnahmen', 'Geldzuflüsse — Eintrittsgelder, Kursgebühren, Verpachtung'],
                ['Ausgaben', 'Geldabflüsse — Chemikalien, Energie, Personal, Wartung'],
                ['Gewinn / Verlust', 'Einnahmen – Ausgaben = Ergebnis (kommunale Bäder meist Verlust = Zuschuss)'],
                ['Kostendeckungsgrad (KDG)', 'Einnahmen ÷ Ausgaben × 100 % — wie viel % decken Einnahmen die Kosten?'],
                ['Fixkosten', 'Unabhängig von Besucherzahl: Miete, Personal, Energie Grundlast'],
                ['Variable Kosten', 'Abhängig von Nutzung: Chlor, Wasser, Verbrauchsmaterialien'],
                ['Abschreibung (AfA)', 'Wertverlust von Anlagen über die Nutzungsdauer — jährlicher Aufwand'],
                ['Liquidität', 'Fähigkeit laufende Zahlungen zu begleichen — Kasse darf nie leer'],
              ].map(([k, v], i) => <Row key={i} k={k} v={v} dark={dark} />)}
            </div>

            <div style={{ background: dark ? '#0c2d1a' : '#f0fdf4', border: `2px solid ${accent}40`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, color: accent, marginBottom: 8 }}>Kostendeckungsgrad — Formel</div>
              <div style={{ background: dark ? '#1e293b' : '#fff', borderRadius: 10, padding: '12px 16px', fontFamily: 'monospace', fontSize: 15, color: dark ? '#6ee7b7' : '#065f46', textAlign: 'center', marginBottom: 10 }}>
                KDG = (Einnahmen ÷ Gesamtkosten) × 100 %
              </div>
              <p style={{ color: text, fontSize: 13 }}>Beispiel: Einnahmen 800.000 € / Kosten 2.000.000 € × 100 = <strong>40 % KDG</strong> → Gemeinde trägt 60 % als Zuschuss (Daseinsvorsorge)</p>
            </div>
          </div>
        )}

        {tab === 'kontrolle' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 14 }}>Kassenfehler & Kontrolle</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#6ee7b7' : '#065f46', marginBottom: 10 }}>Häufige Kassendifferenzen — Ursachen</div>
              {[
                ['Herausgabe falsches Wechselgeld', 'Beim Bezahlvorgang unter Druck oder Ablenkung'],
                ['Tipp- / Eingabefehler', 'Falscher Preis eingetippt'],
                ['Vergessene Buchung', 'Transaktion ohne Kassenboneintrag'],
                ['Diebstahl', 'Durch Personal oder Kunden (selten, aber möglich)'],
                ['Falschgeld', 'Unerkannte gefälschte Scheine'],
                ['Technikfehler', 'Kassensystem bucht fehlerhaft'],
              ].map(([k, v], i) => <Row key={i} k={k} v={v} dark={dark} />)}
            </div>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>Was tun bei Kassendifferenz?</div>
              {[
                { step: '1', text: 'Ruhe bewahren — nicht eigenständig ausgleichen!' },
                { step: '2', text: 'Alle Belege des Tages nochmals prüfen — Rechenfehler suchen' },
                { step: '3', text: 'Kassenbestand nochmals zählen — evtl. Zählfehler' },
                { step: '4', text: 'Vorgesetzten informieren — Differenz dokumentieren' },
                { step: '5', text: 'Kassendifferenz im Kassenbuch eintragen mit Erklärungsversuch' },
                { step: '6', text: 'Betrieb entscheidet über Maßnahmen (Haftung, Kontrolle)' },
              ].map(({ step, text: t }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ background: '#dc2626', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 12 }}>{step}</div>
                  <div style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13, paddingTop: 3 }}>{t}</div>
                </div>
              ))}
            </div>

            <InfoBox title="Falschgeld erkennen" dark={dark} items={[
              'Fühlen: Echte Scheine haben Prägung (Reliefstruktur) auf Hauptmotiv',
              'Kippen: Zahl auf Hologramm wechselt zwischen € und Betrag',
              'Leuchten: UV-Licht zeigt Sicherheitsmerkmale (Fasern, Streifen)',
              'Wasserzeichen: gegen Licht halten — Porträt und Fenster sichtbar',
              'Verdächtiger Schein: nicht zurückgeben, Polizei informieren (§ 147 StGB: Inverkehrbringen = strafbar)',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
