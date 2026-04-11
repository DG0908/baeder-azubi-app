import { useState } from 'react';

const TABS = [
  { id: 'chlor', label: 'Chlor', color: '#ffd166' },
  { id: 'uv', label: 'UV-Strahlung', color: '#a070ff' },
  { id: 'ozon', label: 'Ozon', color: '#34c090' },
  { id: 'kombination', label: 'Kombination', color: '#4a9eff' },
  { id: 'vergleich', label: 'Vergleich', color: '#ff7a7a' },
];

const TAB_DATA = {
  chlor: {
    title: 'Chlor-Desinfektion',
    color: '#ffd166',
    sections: [
      { heading: 'Wirkprinzip', items: ['Freies Chlor (HOCl) zerstört Zellmembran und Enzyme von Keimen', 'HOCl dringt durch Membran ein → oxidiert Zellinhalte → Abtötung', 'Residualeffekt: Chlor bleibt im Becken aktiv (0,3–0,6 mg/L)', 'Wirksamkeit: gegen Bakterien, Viren, Pilze — bei richtiger Dosierung', 'pH-abhängig: bei pH 7,0 ca. 75 % HOCl (wirksam)', 'Chloramine (gebundenes Chlor): Reaktion mit Harnstoff — wenig wirksam, geruchsintensiv'] },
      { heading: 'Chlorformen im Vergleich', items: ['Chlorgas (Cl₂): hochkonzentriert, wirtschaftlich, gefährlich', 'Natriumhypochlorit (NaOCl 12 %): flüssig, einfach zu handhaben', 'Calciumhypochlorit Ca(ClO)₂: Granulat oder Tabletten, 65–70 %', 'Elektrochlorierung (Elektrolyse): Chlor aus Kochsalzlösung in situ', 'Trichlorisocyanursäure (TCCA): für Freibäder, langsam löslich'] },
      { heading: 'Grenzen und Risiken', items: ['Chloramine: Augenreizung, Hallenbad-Geruch ("Chlor-Geruch")', 'Trihalomethane (THM): Nebenprodukte bei hoher organischer Last', 'Chloratbildung: durch NaOCl-Alterung (Kühlung, Verdünnung notwendig)', 'Lichtempfindlichkeit: UV (Sonne) baut freies Chlor im Freibad schnell ab', 'Grenzwert THM: 0,02 mg/L (DIN 19643 Trichlormethan)'] },
    ],
  },
  uv: {
    title: 'UV-Desinfektion (ultraviolette Strahlung)',
    color: '#a070ff',
    sections: [
      { heading: 'Wirkprinzip UV', items: ['UV-C-Strahlung (254 nm): schädigt DNA/RNA von Mikroorganismen', 'Thymin-Dimere: DNA-Verknüpfung verhindert Zellteilung → Inaktivierung', 'Keine Resistenzbildung möglich (direkter physikalischer Effekt)', 'Kein Residualeffekt: wirkt nur im Durchfluss (kein Schutz im Becken)', 'Kombinationspflicht: immer zusammen mit Chlor (DIN 19643)', 'Wirksamkeit: gegen Cryptosporidien und Giardien (Chlor-resistent!)'] },
      { heading: 'Aufbau einer UV-Anlage', items: ['UV-Reaktor: Durchflussbehälter mit UV-Lampen', 'Lampentyp: Niederdrucklampe (254 nm, effizient) oder Mitteldrucklampe', 'Quarzglasrohr: schützt Lampe vor Wasserkontakt', 'Dosimeter: überwacht UV-Dosis (J/m²)', 'Mindestdosis: 400 J/m² nach DIN 19643 für die meisten Keime', 'Lampenreinigung: wöchentlich (Kalkablagerungen reduzieren UV-Transmittanz)'] },
      { heading: 'Vorteile UV', items: ['Kein gefährlicher Chemikalieneinsatz im Hauptstrom', 'Reduziert gebundenes Chlor durch Photolyse der Chloramine', 'Inaktiviert Cryptosporidien (Chlor unwirksam!)', 'Erlaubt Absenkung des freien Chlors auf 0,3–0,6 mg/L', 'Redox-Mindestanforderung bei UV: 700 mV (statt 750 mV)', 'Geruchsverbesserung im Hallenbad (weniger Chloramine)'] },
    ],
  },
  ozon: {
    title: 'Ozon-Desinfektion',
    color: '#34c090',
    sections: [
      { heading: 'Wirkprinzip Ozon', items: ['Ozon (O₃): starkes Oxidationsmittel, erzeugt aus Luft oder O₂', 'Zerstört Zellstrukturen durch radikalische Oxidation', 'Ozon: schneller und stärker als Chlor, kein Resistenzproblem', 'Kein Residualeffekt: zerfällt rasch zu O₂ — kein Schutz im Becken', 'Kombination mit Chlor zwingend (Rest-Desinfektion)', 'Sehr geringe Chloraminbildung → Luftqualität im Hallenbad besser'] },
      { heading: 'Erzeugung und Einbringung', items: ['Erzeugt durch Korona-Entladung (elektrisch) oder UV-Lampe', 'Konzentration: 0,05–0,1 mg O₃/L im Wasser', 'Einbringung: via Venturi-Injektor oder Blasenmischer', 'Kontaktbehälter: mind. 3 min Kontaktzeit für vollständige Wirkung', 'Restozonabtrennung: Aktivkohlefilter (vor Beckeneinspeisung!)', 'Schutzmaßnahmen: O₃-Detektor, Lüftung, MAK-Wert 0,1 ppm'] },
      { heading: 'Wirtschaftlichkeit und Einsatz', items: ['Höhere Investitionskosten als Chlor allein', 'Betriebskosten: Stromverbrauch für O₃-Erzeugung', 'Typisch: Hallenfreizeitbäder mit hoher Badegastdichte', 'Seltener in reinen Sportbädern (weniger organische Last)', 'Kombinationsanlage: Ozon + Chlor nach DIN 19643', 'Vorteil Wasserqualität: geringere Nebenprodukte (THM, Chloramine)'] },
    ],
  },
  kombination: {
    title: 'Kombinationsverfahren nach DIN 19643',
    color: '#4a9eff',
    sections: [
      { heading: 'Verfahren A — Chlorung allein', items: ['Nur freies Chlor als Desinfektionsmittel', 'Sollwert: 0,3–0,6 mg/L freies Chlor', 'Redox: mind. 750 mV', 'Anwendung: einfache Sportbäder mit geringer Auslastung', 'Nachteil: kein zusätzlicher Schutz gegen Cryptosporidien', 'Teilwassertausch: mind. 30 L/Person/Tag'] },
      { heading: 'Verfahren B — Chlorung + UV', items: ['UV reduziert Chloraminbildung, inaktiviert Cryptosporidien', 'UV-Dosis: mind. 400 J/m²', 'Freies Chlor: 0,3–0,6 mg/L', 'Redox: mind. 700 mV (wegen UV)', 'Anwendung: Hallenbäder, Freizeitbäder, Therapiebäder', 'Standardverfahren für neue Hallenbäder'] },
      { heading: 'Verfahren C — Chlorung + Ozon', items: ['Ozon Vordesinfektion + Chlor Residualdesinfektion', 'O₃-Konzentration: 0,05–0,1 mg/L im Kontaktbehälter', 'Aktivkohle: entfernt Rest-Ozon vor Beckeneinspeisung', 'Freies Chlor im Becken: 0,3–0,6 mg/L', 'Wasserqualität: sehr gut, wenige Nebenprodukte', 'Anwendung: große Freizeitbäder, Kuranlagen'] },
    ],
  },
  vergleich: {
    title: 'Verfahrensvergleich',
    color: '#ff7a7a',
    sections: [
      { heading: 'Wirksamkeit', items: ['Bakterien/Viren: alle Verfahren wirksam bei richtiger Dosierung', 'Cryptosporidien: nur UV und Ozon wirksam (Chlor unwirksam!)', 'Residualwirkung im Becken: nur Chlor (UV und Ozon kein Restschutz)', 'Reaktionsgeschwindigkeit: Ozon > UV ≈ HOCl > OCl⁻', 'Geruch/Nebenprodukte: Ozon > UV > Chlor (je weniger desto besser)'] },
      { heading: 'Wirtschaftlichkeit', items: ['Chlor allein: günstigste Investition, einfachster Betrieb', 'Chlor + UV: mittlere Investition, geringer Mehraufwand', 'Chlor + Ozon: höchste Investition, höchster Energiebedarf', 'Wasserqualität vs. Kosten: UV ist beste Kosten-Nutzen-Relation', 'Wartungsaufwand: Ozon > UV > Chlor'] },
      { heading: 'Rechtsgrundlagen', items: ['DIN 19643-1: Grundnorm für alle Hallenbäder', 'DIN 19643-2: Flächenbecken (Freibäder)', 'DIN 19643-3: Beckenwasser mit Meerwasser', 'DIN 19643-4: Whirlbecken', 'UBA-Empfehlung: UV-Anlage in allen Hallenbädern empfohlen', 'Verfahren muss Gesundheitsamt mitgeteilt werden'] },
    ],
  },
};

export default function DesinfektionsverfahrenDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('chlor');
  const tab = TAB_DATA[activeTab];

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Desinfektionsverfahren</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Chlor, UV, Ozon und Kombinationsverfahren nach DIN 19643 — Wirkprinzipien und Vergleich</p>

        {/* Barrier Grafik */}
        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <svg viewBox="0 0 760 75" style={{ width: '100%', height: 'auto' }}>
            {[
              { label: 'Filterung', color: '#34c090', x: 30 },
              { label: 'Ozon', color: '#34c090', x: 185 },
              { label: 'UV', color: '#a070ff', x: 340 },
              { label: 'Chlor (Residual)', color: '#ffd166', x: 495 },
              { label: 'Becken', color: '#4a9eff', x: 650 },
            ].map((b, i) => (
              <g key={i}>
                <rect x={b.x} y="15" width="110" height="35" rx="5" fill={b.color + '20'} stroke={b.color + '60'} strokeWidth="1.5" />
                <text x={b.x + 55} y="37" textAnchor="middle" fill={b.color} fontSize="10" fontWeight="700">{b.label}</text>
                {i < 4 && <text x={b.x + 125} y="37" textAnchor="middle" fill="#2a5a8a" fontSize="14">→</text>}
              </g>
            ))}
            <text x="380" y="68" textAnchor="middle" fill="#1a4a6a" fontSize="9">Multi-Barrieren-Prinzip: mehrere Desinfektionsstufen sichern Wasserqualität</text>
          </svg>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '5px 14px', borderRadius: 20, border: `1px solid ${t.color}60`, cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: activeTab === t.id ? t.color + '30' : '#0a1a2a', color: activeTab === t.id ? t.color : '#4a7a9a',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ background: '#071828', border: `1px solid ${tab.color}30`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, color: tab.color, marginBottom: 14, fontSize: 15 }}>{tab.title}</div>
          {tab.sections.map((sec, si) => (
            <div key={si} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: tab.color + 'cc', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{sec.heading}</div>
              {sec.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 13, color: '#c8e8ff' }}>
                  <span style={{ color: tab.color, flexShrink: 0 }}>→</span><span>{it}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
