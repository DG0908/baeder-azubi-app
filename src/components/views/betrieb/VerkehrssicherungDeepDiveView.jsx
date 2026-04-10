import { useState } from 'react';

const TABS = {
  grundlagen: 'Grundlagen',
  kontrollen: 'Kontrollen & Prüfpflichten',
  haftung: 'Haftung & Recht',
  praxis: 'Praxis im Bad',
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

export default function VerkehrssicherungDeepDiveView({ darkMode }) {
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
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 4 }}>Verkehrssicherungspflicht</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Wer ist verantwortlich, was muss kontrolliert werden und welche Konsequenzen drohen bei Versäumnissen</p>

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
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Was ist die Verkehrssicherungspflicht?</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Die Verkehrssicherungspflicht (VSP) ist die rechtliche Pflicht, eine von dir geschaffene oder beherrschte Gefahrenquelle so zu sichern, dass Dritte nicht zu Schaden kommen.</p>

            <div style={{ background: dark ? '#1e1040' : '#faf5ff', border: `2px solid ${accent}40`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: accent, marginBottom: 10 }}>Grundsatz</div>
              <p style={{ color: text, fontSize: 13, lineHeight: 1.7 }}>
                Wer ein Schwimmbad betreibt und der Öffentlichkeit zugänglich macht, ist verpflichtet, alle zumutbaren Maßnahmen zu ergreifen, um Besucher vor vorhersehbaren Gefahren zu schützen. Die VSP gilt gegenüber <strong>allen Personen</strong>, die das Bad betreten — auch Unbefugten unter Umständen.
              </p>
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Wer trägt die VSP?</div>
              {[
                ['Betreiber / Träger', 'Grundsätzlich — kann auf Mitarbeiter übertragen werden'],
                ['Bäderfachpersonal', 'Durch Arbeitsvertrag delegiert — eigene Verantwortung'],
                ['Hausmeister / Techniker', 'Für technische Einrichtungen und Gebäude'],
                ['Kursleiter / Trainer', 'Für ihren Aufsichtsbereich während des Kurses'],
                ['Lehrer bei Schulklassen', 'Behält Aufsichtspflicht — parallel zum Bademeister'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 13 }}>
                  <span style={{ color: accent, fontWeight: 700, minWidth: 160 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Abgrenzung: Aufsichtspflicht vs. Verkehrssicherungspflicht" dark={dark} color={accent} items={[
              'Aufsichtspflicht: Personen beobachten und bei Gefahr eingreifen (aktiv)',
              'Verkehrssicherungspflicht: Anlage sicher halten, Gefahren beseitigen (strukturell)',
              'Beides greift gleichzeitig — der Bademeister trägt beide Pflichten',
              'Beispiel VSP: rutschiger Boden → absperren oder Matte legen',
              'Beispiel Aufsicht: Person ertrinkt → sofort eingreifen',
            ]} />
          </div>
        )}

        {tab === 'kontrollen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Kontrollen & Prüfpflichten</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Die VSP verpflichtet zu regelmäßigen Kontrollen — je nach Gefahrenpotenzial täglich, wöchentlich oder jährlich.</p>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Tägliche Kontrollen (vor Öffnung)</div>
              {[
                'Beckenboden und Wasseroberfläche: Fremdkörper, Hindernisse',
                'Wasserqualität: pH-Wert, Chlorgehalt, Redoxpotenzial messen und dokumentieren',
                'Sichttiefe: Beckenbodenmarkierung muss erkennbar sein',
                'Rutschflächen: Beckenrand, Duschen, Umkleiden — trocken/nass',
                'Notfallausrüstung: Stange, Ring, AED, Sauerstoff — vollständig und funktionsfähig',
                'Rettungsgeräte: auf korrekter Position, zugänglich',
                'Beleuchtung: alle Bereiche ausreichend beleuchtet',
                'Lautsprecheranlage: Funktionstest',
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b' }}>
                  <span style={{ color: accent }}>✓</span><span>{it}</span>
                </div>
              ))}
            </div>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Regelmäßige & periodische Prüfungen</div>
              {[
                ['Wöchentlich', 'Duschköpfe (Legionellen-Prävention), Filteranlage, Pumpen'],
                ['Monatlich', 'Sicherheitszeichen und Beschilderung, Erste-Hilfe-Kasten, Feuerlöscher'],
                ['Jährlich', 'Technische Anlagen (durch Sachkundige), Elektroinstallation, Startblöcke'],
                ['Nach Bedarf', 'Nach Sturm, Vandalismusmeldung, Unfall — Sonderprüfung'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 13 }}>
                  <span style={{ color: accent, fontWeight: 700, minWidth: 100 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Sofortmaßnahmen bei Mängeln" dark={dark} color="#dc2626" items={[
              'Gefährlichen Bereich sofort absperren / sperren',
              'Vorgesetzten / Betreiber umgehend informieren',
              'Mangel schriftlich dokumentieren (Datum, Beschreibung, Maßnahme)',
              'Freigabe erst nach Beseitigung des Mangels',
              'Keine Eigenreparatur ohne Qualifikation — Fachpersonal beauftragen',
            ]} />
          </div>
        )}

        {tab === 'haftung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Haftung & Rechtliche Konsequenzen</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Zivilrechtliche Haftung (§ 823 BGB)</div>
              <p style={{ color: text, fontSize: 13, marginBottom: 10 }}>Wer schuldhaft die VSP verletzt und dadurch einen Schaden verursacht, muss diesen ersetzen.</p>
              {[
                ['Voraussetzungen', 'Pflichtverletzung + Schaden + Kausalität + Verschulden'],
                ['Schadensersatz', 'Heilungskosten, Verdienstausfall, Schmerzensgeld'],
                ['Beweislast', 'Geschädigter muss VSP-Verletzung beweisen — Doku hilft Betreiber'],
                ['Mitverschulden', 'Wenn Gast selbst zur Gefahr beigetragen hat → Haftungsquote'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: accent, fontWeight: 700, minWidth: 130 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>Strafrechtliche Haftung</div>
              {[
                ['§ 229 StGB', 'Fahrlässige Körperverletzung — Geldstrafe oder Freiheitsstrafe bis 3 Jahre'],
                ['§ 222 StGB', 'Fahrlässige Tötung — Freiheitsstrafe bis 5 Jahre'],
                ['§ 323c StGB', 'Unterlassene Hilfeleistung — bis 1 Jahr Freiheitsstrafe'],
                ['Garantenstellung', 'Bademeister hat erhöhte Pflicht durch Berufsausübung — strengere Maßstäbe'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 13 }}>
                  <span style={{ color: '#dc2626', fontWeight: 700, minWidth: 130 }}>{k}</span>
                  <span style={{ color: dark ? '#e2e8f0' : '#1e293b' }}>{v}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Haftungsausschluss — was schützt den Bademeister?" dark={dark} color="#059669" items={[
              'Lückenlose Dokumentation aller Kontrollen und Maßnahmen',
              'Sofortige Meldung von Mängeln an Vorgesetzten',
              'Einhaltung aller gesetzlichen Vorschriften und DGUV-Regeln',
              'Korrekte Qualifikation (DRSA, Erste Hilfe aktuell)',
              'Handeln nach Stand der Technik (DIN-Normen, DGUV)',
            ]} />
          </div>
        )}

        {tab === 'praxis' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>VSP in der täglichen Praxis</h2>

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Typische VSP-Situationen im Bad</div>
              {[
                {
                  situation: 'Nassbereich rutschig nach Reinigung',
                  massnahme: 'Absperren bis trocken, Warnschild aufstellen, Reinigung dokumentieren',
                },
                {
                  situation: 'Gebrochene Fliese am Beckenrand',
                  massnahme: 'Bereich sofort absperren, Meldung an Technik, Eintrag ins Betriebsbuch',
                },
                {
                  situation: 'Chlorgeruch auffällig stark',
                  massnahme: 'Wasserqualität sofort messen, bei Grenzwertüberschreitung Badebetrieb einstellen',
                },
                {
                  situation: 'Defektes Geländer an der Treppe',
                  massnahme: 'Treppe sperren, Reparatur beauftragen, erst nach Abnahme wieder freigeben',
                },
                {
                  situation: 'AED zeigt Batteriefehler',
                  massnahme: 'Sofort Ersatzbatterie einsetzen oder Ersatzgerät bereitstellen — nie ohne AED öffnen',
                },
                {
                  situation: 'Glasscherbe im Becken entdeckt',
                  massnahme: 'Becken sofort räumen und sperren, Scherbe entfernen, Protokoll',
                },
              ].map(({ situation, massnahme }, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < 5 ? `1px solid ${accent}20` : 'none' }}>
                  <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', fontSize: 13, marginBottom: 3 }}>{situation}</div>
                  <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>→ {massnahme}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'doku' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 14 }}>Dokumentation der VSP</h2>

            <InfoBox title="Das Betriebstagebuch / Kontrollbuch" dark={dark} color={accent} items={[
              'Tägliche Eintragungen: Öffnung, Kontrollen, Messungen, Vorkommnisse',
              'Unterschrift der verantwortlichen Aufsichtsperson',
              'Auffälligkeiten auch wenn zunächst unkritisch — lieber zu viel als zu wenig',
              'Mängelprotokoll mit Datum der Meldung und Behebung',
              'Keine nachträglichen Veränderungen ohne Kennzeichnung',
            ]} />

            <div style={{ background: cardBg, border: `1px solid ${accent}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#c4b5fd' : '#7c3aed', marginBottom: 10 }}>Im Streitfall zählt die Dokumentation</div>
              <p style={{ color: text, fontSize: 13, lineHeight: 1.7 }}>
                Vor Gericht gilt: Was nicht dokumentiert wurde, hat rechtlich oft nicht stattgefunden. Ein lückenloses Betriebstagebuch zeigt, dass die VSP ernst genommen wurde. Es schützt sowohl den Mitarbeiter als auch den Betreiber.
              </p>
            </div>

            <InfoBox title="Prüfungsfragen zur VSP" dark={dark} color="#059669" items={[
              'Was ist die Verkehrssicherungspflicht? → Pflicht zur Gefahrenabwehr für Dritte',
              'Wer trägt die VSP im Bad? → Betreiber, delegiert an Fachpersonal',
              'Was tun bei rutschigem Boden? → Absperren, kennzeichnen, dokumentieren, melden',
              'Was droht bei Verletzung der VSP? → Zivilrecht (§ 823 BGB) + Strafrecht (§ 229/222)',
              'Was schützt den Bademeister? → Dokumentation + Einhaltung der Vorschriften',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
