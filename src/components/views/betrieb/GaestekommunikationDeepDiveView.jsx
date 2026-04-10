import { useState } from 'react';

const TABS = {
  grundlagen: 'Kommunikation',
  deeskalation: 'Deeskalation',
  badeordnung: 'Badeordnung durchsetzen',
  beschwerden: 'Beschwerdemanagement',
  sonderfaelle: 'Sondersituationen',
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

const StufenCard = ({ nr, stufe, wann, wie, dark }) => (
  <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
    <div style={{ background: nr <= 2 ? '#059669' : nr === 3 ? '#f97316' : '#dc2626', color: '#fff', borderRadius: 12, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{nr}</div>
    <div style={{ flex: 1, background: dark ? '#1e293b' : '#f8fafc', border: '1px solid #9333ea30', borderRadius: 10, padding: 12 }}>
      <div style={{ fontWeight: 700, color: nr <= 2 ? '#059669' : nr === 3 ? '#f97316' : '#dc2626', fontSize: 14, marginBottom: 4 }}>{stufe}</div>
      <div style={{ fontSize: 12, color: dark ? '#94a3b8' : '#64748b', marginBottom: 4 }}><strong>Wann:</strong> {wann}</div>
      <div style={{ fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b' }}>{wie}</div>
    </div>
  </div>
);

export default function GaestekommunikationDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');
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
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 4 }}>Gästekommunikation</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Konfliktmanagement, Deeskalation, Badeordnung durchsetzen und schwierige Situationen meistern</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? accent : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {tab === 'grundlagen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Grundlagen der Kommunikation</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Die 4 Seiten einer Nachricht (Schulz von Thun)</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 12 }}>Jede Aussage hat vier Ebenen — als Sender und Empfänger können wir unterschiedliche Seiten betonen oder wahrnehmen. Das ist die häufigste Quelle von Missverständnissen.</p>
              {[
                ['Sachinhalt', 'Was ist die reine Information? (z.B. „Das Becken schließt in 10 Min.")'],
                ['Selbstoffenbarung', 'Was sagt der Sprecher über sich? (z.B. Stress, Autorität)'],
                ['Beziehungshinweis', 'Wie stehe ich zum Empfänger? (Gleichwertig, von oben herab?)'],
                ['Appell', 'Was soll der Empfänger tun? (Bitte herausgehen)'],
              ].map(([k, v], i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', fontSize: 13 }}>{k}</div>
                  <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Verbale vs. nonverbale Kommunikation</div>
              {[
                ['Worte (7%)', 'Was wir sagen — aber am wenigsten Wirkung im Konflikt'],
                ['Tonfall / Stimme (38%)', 'Laut, ruhig, freundlich, bestimmt — entscheidend für Wirkung'],
                ['Körpersprache (55%)', 'Haltung, Mimik, Gesten — wird immer wahrgenommen'],
              ].map(([k, v], i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', fontSize: 13 }}>{k}</div>
                  <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{v}</div>
                </div>
              ))}
              <div style={{ background: accent + '15', border: `1px solid ${accent}30`, borderRadius: 8, padding: 10, marginTop: 8, fontSize: 13, color: text }}>
                Im Schwimmbad gilt: Ruhiger Ton + aufrechte Haltung + Augenkontakt = souverän und respektvoll. Nie schreien — außer im echten Notfall.
              </div>
            </div>

            <InfoBox title="Dos & Don'ts in der Gästekommunikation" dark={dark} color={accent} items={[
              '✓ Ruhig und klar sprechen — auch wenn Gast laut ist',
              '✓ Augenkontakt halten — zeigt Ernsthaftigkeit',
              '✓ Ich-Botschaften statt Vorwürfe: „Ich bitte Sie, das zu unterlassen" statt „Sie dürfen nicht"',
              '✓ Erklären warum eine Regel gilt — Verständnis statt Widerstand',
              '✗ Nicht brüllen oder drohen — eskaliert sofort',
              '✗ Nicht auf Augenhöhe streiten — professionell bleiben',
              '✗ Nie persönlich werden — sachlich und dienstlich bleiben',
            ]} />
          </div>
        )}

        {tab === 'deeskalation' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Deeskalation — Stufenmodell</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Konflikte im Schwimmbad entwickeln sich meist in Eskalationsstufen. Je früher eingegriffen wird, desto einfacher die Lösung.</p>

            <StufenCard nr={1} stufe="Ansprechen / Hinweisen" dark={dark}
              wann="Erster Regelverstoß, harmloser Konflikt"
              wie="Freundlich, direkt und persönlich ansprechen. 'Entschuldigung, bitte beachten Sie, dass hier kein Rennen erlaubt ist.' Lächeln, normale Lautstärke." />
            <StufenCard nr={2} stufe="Erklären & Begründen" dark={dark}
              wann="Gast zeigt Unverständnis oder fragt warum"
              wie="Regel erklären: 'Wegen Verletzungsgefahr und unserer Hausordnung.' Verständnis zeigen, aber klar bleiben. Keine langen Diskussionen." />
            <StufenCard nr={3} stufe="Verwarnen" dark={dark}
              wann="Wiederholung des Verstoßes nach Ansprechen"
              wie="Deutlich und bestimmt: 'Ich weise Sie jetzt formal darauf hin — bei Wiederholung muss ich Sie des Bades verweisen.' Kein Lächeln mehr. Dokumentation beginnen." />
            <StufenCard nr={4} stufe="Hausverweis" dark={dark}
              wann="Regel wird trotz Verwarnung erneut verletzt"
              wie="'Ich erteile Ihnen jetzt Hausverbot für heute. Bitte verlassen Sie sofort das Gelände.' Ton: ruhig aber absolut klar. Eintrittsgeld zurückgeben (je nach Hausordnung). Dokumentieren." />

            <InfoBox title="Grundprinzipien der Deeskalation" dark={dark} color={accent} items={[
              'Immer ruhig bleiben — Hektik überträgt sich',
              'Blickkontakt halten — zeigt Präsenz ohne Aggression',
              'Abstand halten — ca. 1,5–2 m (kein invasiver Nahbereich)',
              'Nie allein in sehr eskalierte Situationen — Kollegen dazu rufen',
              'Fluchtweg im Blick behalten — nie in eine Ecke stellen lassen',
              'Polizei rufen wenn Situation außer Kontrolle gerät — 110',
            ]} />
          </div>
        )}

        {tab === 'badeordnung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Badeordnung durchsetzen</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Rechtliche Grundlage</div>
              <p style={{ color: text, fontSize: 13, lineHeight: 1.7 }}>
                Die Bade- und Hausordnung ist Bestandteil des <strong>konkludenten Vertrages</strong> — Gäste akzeptieren sie durch Betreten des Bades. Als Fachangestellter hast du das Recht und die Pflicht, sie durchzusetzen. Das Hausrecht liegt beim Betreiber, der es auf dich überträgt.
              </p>
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Häufige Regelverstöße & richtiger Umgang</div>
              {[
                {
                  verstos: 'Rennen / Rauferei am Beckenrand',
                  umgang: 'Sofort ansprechen — direktes Sicherheitsrisiko. Keine Diskussion. Bei Wiederholung: Verwarnung.',
                },
                {
                  verstos: 'Glasflaschen im Nassbereich',
                  umgang: 'Freundlich bitten, Flasche zu entfernen oder in mitgebrachten Behälter umzufüllen. Begründung: Verletzungsgefahr.',
                },
                {
                  verstos: 'Nichtschwimmer im Schwimmerbereich',
                  umgang: 'Sicherheitsgespräch: Können Sie schwimmen? Wenn nein: bitte in den richtigen Bereich wechseln.',
                },
                {
                  verstos: 'Fotografieren / Filmen',
                  umgang: 'Ansprechen und auf DSGVO / Hausordnung hinweisen. Fotos anderer Badegäste ohne Zustimmung nicht erlaubt.',
                },
                {
                  verstos: 'Alkohol im Bad',
                  umgang: 'Hausordnung zeigen. Bei sichtbarer Beeinträchtigung: Hausverbot aus Sicherheitsgründen.',
                },
              ].map(({ verstos, umgang }, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < 4 ? `1px solid ${accent}20` : 'none' }}>
                  <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', fontSize: 13, marginBottom: 3 }}>⚠ {verstos}</div>
                  <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>→ {umgang}</div>
                </div>
              ))}
            </div>

            <InfoBox title="Hausverbot — was ist zu beachten?" dark={dark} color="#dc2626" items={[
              'Sofortiger Hausverbot ist möglich bei Gefährdung der Sicherheit',
              'Immer dokumentieren: Datum, Uhrzeit, Grund, Name wenn bekannt',
              'Dauerhaftes Hausverbot: nur durch Betreiber / Vorgesetzten',
              'Bei Weigerung das Bad zu verlassen: Polizei rufen (§ 123 StGB Hausfriedensbruch)',
              'Niemals körperliche Gewalt — nur verbale Anweisung + Polizei',
            ]} />
          </div>
        )}

        {tab === 'beschwerden' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Beschwerdemanagement</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Eine gut behandelte Beschwerde kann einen unzufriedenen Gast in einen treuen Stammkunden verwandeln. Beschwerden sind Feedback — kein Angriff.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Der SAGA-Ablauf bei Beschwerden</div>
              {[
                { s: 'S', label: 'Sachlich zuhören', desc: 'Gast ausreden lassen, nicht unterbrechen. Aktiv zuhören: nicken, Augenkontakt.' },
                { s: 'A', label: 'Anerkennen', desc: '"Ich verstehe, dass Sie das ärgert." — Verständnis zeigen, ohne sofort Recht zu geben.' },
                { s: 'G', label: 'Gegenfragen / Klären', desc: 'Was genau ist passiert? Wann? Details ermitteln.' },
                { s: 'A', label: 'Abhilfe schaffen', desc: 'Konkrete Lösung anbieten: Rückerstattung, Weiterleitung, Maßnahme ankündigen.' },
              ].map(({ s, label, desc }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ background: accent, color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: 13 }}>{s}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', fontSize: 13 }}>{label}</div>
                    <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <InfoBox title="Was NIE bei Beschwerden sagen" dark={dark} color="#dc2626" items={[
              '"Das ist nicht mein Problem." → Sofortiger Vertrauensverlust',
              '"Dafür bin ich nicht zuständig." → Gast fühlt sich abgewimmelt',
              '"Das stimmt nicht." → Gast wird defensiv und eskaliert',
              '"Da kann ich nichts machen." → Hilflosigkeit signalisieren löst nichts',
            ]} />

            <InfoBox title="Weiterleitung an Vorgesetzten" dark={dark} color="#059669" items={[
              'Beschwerde nicht lösbar? → Vorgesetzten holen, nicht eigenmächtig entscheiden',
              'Gast will schriftlich Beschwerde einreichen → Kontaktdaten des Betreibers geben',
              'Alle Beschwerden im Betriebstagebuch dokumentieren',
              'Muster erkennen: Wenn gleiche Beschwerde öfter kommt → Betrieb anpassen',
            ]} />
          </div>
        )}

        {tab === 'sonderfaelle' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Sondersituationen</h2>

            {[
              {
                titel: 'Betrunkene / berauschte Gäste',
                farbe: '#dc2626',
                punkte: [
                  'Zugang verweigern — Hausrecht gilt, Sicherheitsrisiko',
                  'Bereits im Bad: freundlich aber bestimmt ansprechen',
                  'Keinen Streit provozieren — Sicherheitsabstand halten',
                  'Bei Aggression sofort Kollegen und ggf. Polizei rufen',
                  'Dokumentieren: Zeitpunkt, Beschreibung, Maßnahme',
                ],
              },
              {
                titel: 'Kinder ohne Aufsicht',
                farbe: '#f97316',
                punkte: [
                  'Alter und Schwimmfähigkeit einschätzen',
                  'Kind ansprechen: „Wer ist dein Begleiter/deine Eltern?"',
                  'Eltern ausrufen lassen (Lautsprecher)',
                  'Kleinkinder (<6 J.) allein: Badebetrieb verpflichtet zur Begleitung',
                  'Jugendliche ohne Aufsicht: je nach Hausordnung und Alter',
                ],
              },
              {
                titel: 'Großgruppen / Schülergruppen',
                farbe: '#0891b2',
                punkte: [
                  'Absprache mit Begleitperson (Lehrer/Trainer) vor Beginn',
                  'Zuständigkeiten klären: wer übernimmt welchen Bereich?',
                  'Gruppenregeln kommunizieren bevor Gruppe ins Wasser geht',
                  'Aufsicht durch Gruppe entlastet nicht — Bademeister bleibt verantwortlich',
                ],
              },
              {
                titel: 'Hilfsbedürftige Gäste / Menschen mit Behinderung',
                farbe: '#059669',
                punkte: [
                  'Ansprechen ob und welche Hilfe gewünscht wird — nicht aufdrängen',
                  'Barrierefreiheit kennen: Hebebühne, Rampe, barrierefreie Umkleiden',
                  'Bei Begleitung: Begleiter hat eigene Aufsichtspflicht',
                  'Im Notfall: HLW-Besonderheiten bei Prothesen (Druckpunkt ggf. anpassen)',
                ],
              },
              {
                titel: 'Sprachbarriere / internationale Gäste',
                farbe: accent,
                punkte: [
                  'Einfache Sprache + klare Gesten — Körpersprache universell',
                  'Badeordnung idealerweise mehrsprachig aushängen',
                  'Piktogramme helfen mehr als langer Text',
                  'Übersetzer-App am Telefon als Hilfsmittel',
                ],
              },
            ].map(({ titel, farbe, punkte }, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${farbe}40`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: farbe, marginBottom: 8 }}>{titel}</div>
                {punkte.map((p, j) => (
                  <div key={j} style={{ fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b', display: 'flex', gap: 7, marginBottom: 4 }}>
                    <span style={{ color: farbe }}>→</span><span>{p}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
