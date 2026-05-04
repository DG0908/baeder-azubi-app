import { useState } from 'react';

const TABS = {
  öffnung: 'Öffnungsroutine',
  schicht: 'Schichtroutine',
  schließung: 'Schließroutine',
  wasser: 'Wasserqualität',
  aufbewahrung: 'Aufbewahrung & Fristen',
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

const CheckItem = ({ text, dark, done = false }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7, padding: '6px 10px', background: dark ? '#0f172a' : '#f8fafc', borderRadius: 8 }}>
    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${done ? '#059669' : '#9333ea'}`, background: done ? '#059669' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
      {done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
    </div>
    <span style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13 }}>{text}</span>
  </div>
);

export default function BetriebChecklistenDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('öffnung');
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
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 4 }}>Betriebs-Checklisten</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Öffnungs-, Schicht- und Schließroutinen sowie Wasserqualitätskontrolle und Aufbewahrungsfristen</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? accent : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {tab === 'öffnung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 6 }}>Öffnungsroutine</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 14 }}>Vor der Öffnung muss das Bad vollständig kontrolliert und betriebsbereit sein. Erst wenn alle Punkte abgearbeitet sind, dürfen Besucher eingelassen werden.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Technische Kontrolle</div>
              {[
                'Filteranlage läuft, Betriebsparameter prüfen (Druck, Durchfluss)',
                'Umwälzpumpen in Betrieb',
                'Dosierpumpen aktiv — Chlor- und Flockungsmittelbehälter gefüllt',
                'pH-Wert messen und dokumentieren (Sollwert 6,5–7,8 nach DIN 19643-1; Praxis oft 6,8–7,4)',
                'Redoxpotenzial / freies Chlor messen (Sollwert ≥ 200 mV / 0,3–0,6 mg/L)',
                'Wassertemperatur prüfen und notieren',
                'Sichttiefe kontrollieren — Beckenboden muss vollständig sichtbar sein',
                'Heizung und Lüftung (Hallenbad): Temperaturen prüfen',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Sicherheits- & Ausstattungskontrolle</div>
              {[
                'Rettungsgeräte vollständig und auf Position (Stange, Ring, Wurfleine)',
                'AED vorhanden, geladen und betriebsbereit',
                'Sauerstoffgerät vollständig und gefüllt',
                'Erste-Hilfe-Kasten vollständig und aktuell',
                'Notruftelefon / Festnetz funktionsfähig',
                'Lautsprecheranlage testen',
                'Beleuchtung in allen Bereichen — keine defekten Leuchten',
                'Beckenrand, Treppen, Leitern auf Beschädigungen prüfen',
                'Rutschflächen: nasse Bereiche auf Rutschgefahr kontrollieren',
                'Umkleiden und Duschen sauber und gefahrenfrei',
                'Außenbereich (Freibad): Zäune, Tore, Rettungsturm',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Organisatorisches</div>
              {[
                'Dienstplan vorhanden und besetzt',
                'Aufsichtsperson ist namentlich für jede Schicht festgelegt',
                'Übergabe vom Vordienst (schriftlich oder mündlich)',
                'Eintragebuch / Betriebstagebuch bereit',
                'Kasse / Eintrittssystem funktionsfähig',
                'Beschilderung vollständig (Badeordnung, Verbotsschilder, Tiefenmarken)',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>
          </div>
        )}

        {tab === 'schicht' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 6 }}>Schichtroutine — laufende Kontrollen</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 14 }}>Während des Betriebs müssen Aufsicht und Kontrollen kontinuierlich stattfinden. Feste Intervalle verhindern Vergessen und sichern die Dokumentation.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Stündliche Wasserqualitätsmessung</div>
              {[
                'pH-Wert messen und dokumentieren',
                'Freies Chlor / Redoxpotenzial messen',
                'Bei Abweichung: Dosierpumpe nachjustieren, Vorgesetzten informieren',
                'Bei Grenzwertüberschreitung: Badebetrieb einstellen (§ DIN 19643)',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Laufende Aufsichtsroutine</div>
              {[
                'Aktive Beckenaufsicht — kein Vigilanzabfall (Position wechseln alle 15–20 Min.)',
                'Ablösungen nach Plan — keine Aufsichtslücken',
                'Baderegeln durchsetzen: gefährliches Verhalten sofort ansprechen',
                'Überfüllung beobachten — max. Besucherzahl nicht überschreiten',
                'Auffällige Gäste beobachten: Kinder allein, gebrechliche Personen, unerfahrene Schwimmer',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Kontrollgänge (alle 1–2 Std.)</div>
              {[
                'Umkleiden und WC-Bereiche kontrollieren',
                'Duschen auf Funktion und Sauberkeit',
                'Außenbereich (Freibad): Zäune, Schatten- und Sonnenbereiche',
                'Technischer Bereich: Pumpen, Anlage auf Auffälligkeiten',
                'Erste-Hilfe-Kasten: nach jedem Einsatz nachfüllen',
                'Auffälligkeiten im Betriebstagebuch eintragen',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>
          </div>
        )}

        {tab === 'schließung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 6 }}>Schließroutine</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 14 }}>Nach Betriebsende müssen alle Bereiche gesichert, gereinigt und technische Anlagen korrekt zurückgefahren werden.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Besucher & Bereiche</div>
              {[
                'Alle Besucher haben das Haus verlassen — alle Bereiche abgehen',
                'Umkleiden, WC, Duschräume: letzte Kontrolle',
                'Spinde kontrollieren (vergessene Sachen, noch offen)',
                'Keine Person mehr im Gebäude / auf Gelände',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Wasserqualität & Technik</div>
              {[
                'Abschlussmessung Wasserqualität dokumentieren',
                'Dosierpumpen prüfen — Behälter ausreichend gefüllt für Nacht',
                'Filteranlage: Nachtbetrieb einstellen (reduzierte Umwälzung ggf.)',
                'Heizung / Lüftung auf Nachtabsenkung',
                'Beckenabdeckung (falls vorhanden) schließen',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Sicherung & Reinigung</div>
              {[
                'Alle Außentüren und Tore verschlossen',
                'Fenster kontrollieren',
                'Reinigung der Nasszone, Duschen, Umkleiden',
                'Beckenrand und Beckenumgang reinigen',
                'Rettungsgeräte zurück auf Position',
                'Kasse abschließen / Abrechnung',
                'Betriebstagebuch: Tagesabschluss-Eintrag mit Unterschrift',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Übergabe an Nachtschicht / Technik</div>
              {[
                'Mündliche oder schriftliche Übergabe aller Besonderheiten',
                'Offene Mängel kommunizieren',
                'Schlüssel übergeben',
              ].map((it, i) => <CheckItem key={i} text={it} dark={dark} />)}
            </div>
          </div>
        )}

        {tab === 'wasser' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Wasserqualitätskontrolle</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Die DIN 19643 regelt die Aufbereitung und Messung. Die Werte müssen mehrmals täglich gemessen und dokumentiert werden.</p>

            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: accent }}>
                    <th style={{ padding: '8px 10px', color: '#fff', textAlign: 'left' }}>Parameter</th>
                    <th style={{ padding: '8px 10px', color: '#fff', textAlign: 'left' }}>Sollwert</th>
                    <th style={{ padding: '8px 10px', color: '#fff', textAlign: 'left' }}>Häufigkeit</th>
                    <th style={{ padding: '8px 10px', color: '#fff', textAlign: 'left' }}>Maßnahme bei Abw.</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['pH-Wert', '6,5 – 7,8 (DIN 19643-1)', 'mind. 2× täglich', 'pH-Minus / pH-Plus dosieren'],
                    ['Freies Chlor', '0,3 – 0,6 mg/L', 'mind. 2× täglich', 'Chlordosierung anpassen'],
                    ['Redoxpotenzial', '≥ 750 mV', 'Kontinuierlich (Mess.)', 'Chlorung erhöhen'],
                    ['Gebundenes Chlor', '< 0,2 mg/L', '1× täglich', 'Stoßchlorung / Superchlorung'],
                    ['Wassertemperatur', 'je Beckentyp', 'mind. 1× täglich', 'Heizung nachjustieren'],
                    ['Sichttiefe', '= Beckentiefe', 'Vor Öffnung', 'Betrieb einstellen!'],
                    ['Keimzahl (Bakterien)', '< 100 KBE/ml', 'Wöchentlich (Labor)', 'Stoßchlorung, Labor'],
                  ].map(([p, s, h, m], i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#faf5ff') : (dark ? '#0f172a' : '#fff') }}>
                      <td style={{ padding: '6px 10px', fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed' }}>{p}</td>
                      <td style={{ padding: '6px 10px', color: text, fontWeight: 600 }}>{s}</td>
                      <td style={{ padding: '6px 10px', color: sub }}>{h}</td>
                      <td style={{ padding: '6px 10px', color: dark ? '#fca5a5' : '#dc2626', fontSize: 12 }}>{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoBox title="Messpflicht nach DIN 19643" dark={dark} color={accent} items={[
              'Messung durch geschultes Personal mit kalibrierten Messgeräten',
              'Photometer / Kolorimeter für Chlor-Messung bevorzugt',
              'Selbsttest-Streifen nur als Orientierung — nicht als alleinige Dokumentation',
              'Labormessungen (Keimzahl, Legionellen) durch akkreditiertes Labor',
              'Alle Werte müssen zeitnah eingetragen werden — nicht nachträglich ergänzen',
            ]} />
          </div>
        )}

        {tab === 'aufbewahrung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Aufbewahrung & Fristen</h2>

            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: accent }}>
                    <th style={{ padding: '8px 10px', color: '#fff', textAlign: 'left' }}>Dokument</th>
                    <th style={{ padding: '8px 10px', color: '#fff', textAlign: 'left' }}>Aufbewahrungsfrist</th>
                    <th style={{ padding: '8px 10px', color: '#fff', textAlign: 'left' }}>Rechtsgrundlage</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Betriebstagebuch / Aufsichtsbuch', '5 Jahre', 'VSP / DGUV'],
                    ['Wasserqualitätsmessungen', '3 Jahre', 'DIN 19643'],
                    ['Unfallprotokoll', '10 Jahre (bei Personenschaden)', 'BGB / StGB'],
                    ['Erste-Hilfe-Leistungen', '5 Jahre', 'DGUV'],
                    ['Wartungsnachweise Anlagen', 'Betriebsdauer + 5 Jahre', 'BetrSichV'],
                    ['Prüfberichte (TÜV, Sachv.)', '5–10 Jahre', 'BetrSichV'],
                    ['Dienstpläne / Arbeitszeitdoku', '2 Jahre', 'ArbZG'],
                    ['Kassenbücher / Abrechnung', '10 Jahre', 'HGB / AO'],
                  ].map(([d, f, r], i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#faf5ff') : (dark ? '#0f172a' : '#fff') }}>
                      <td style={{ padding: '6px 10px', color: text }}>{d}</td>
                      <td style={{ padding: '6px 10px', fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed' }}>{f}</td>
                      <td style={{ padding: '6px 10px', color: sub, fontSize: 12 }}>{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoBox title="Praxistipp Aufbewahrung" dark={dark} color="#059669" items={[
              'Physische Akten: trocken, feuersicher, zugänglich für Behörden',
              'Digitale Kopien: Backup empfohlen, aber Originale aufbewahren',
              'Bei Betriebsaufgabe: Aufbewahrungspflicht gilt weiterhin',
              'Behörden (Gesundheitsamt, Gewerbeaufsicht) können Einsicht verlangen',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
