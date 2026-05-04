import { useState } from 'react';

const TABS = [
  { id: 'wasser', label: 'Das Wasser', color: '#4a9eff' },
  { id: 'ph', label: 'pH-Wert', color: '#34c090' },
  { id: 'redox', label: 'Redox-Spannung', color: '#a070ff' },
  { id: 'chlor', label: 'Chlor & Desinfektion', color: '#ffd166' },
  { id: 'haerte', label: 'Wasserhärte & Korrosion', color: '#ff7a7a' },
];

const TAB_DATA = {
  wasser: {
    title: 'Das Wasser — Grundlagen',
    color: '#4a9eff',
    sections: [
      { heading: 'Wasser als Lösungsmittel', items: ['Wasser (H₂O) ist ein polares Molekül — löst Ionen, Gase, organische Stoffe', 'Im Beckenwasser: Chlorverbindungen, Salze, Körpersekrete, Pflegemittel', 'Leitfähigkeit: Maß für Ionengehalt (µS/cm) — steigt mit Nutzungsdauer', 'Sättigungsindex (SI): Kalk-Kohlensäure-Gleichgewicht — korrosiv oder kalkablagernd?', 'Süßwasser: weiches Wasser < 8,4 °dH; hartes Wasser > 14 °dH'] },
      { heading: 'Wichtige Parameter im Überblick', items: ['pH-Wert: 6,5–7,8 (DIN 19643-1, Praxis 6,8–7,4)', 'Freies Chlor: 0,3–0,6 mg/L (Hallenbd.) / 0,3–1,0 mg/L (Freibad)', 'Gebundenes Chlor: max. 0,2 mg/L (Richtwert)', 'Redox-Spannung: ≥ 750 mV', 'KS4,3 (Säurekapazität): 0,7–2,0 mol/m³', 'Oxidierbarkeit (KMnO₄): ≤ 30 mg/L nach DIN 19643 Tabelle'] },
    ],
  },
  ph: {
    title: 'pH-Wert — Bedeutung und Steuerung',
    color: '#34c090',
    sections: [
      { heading: 'Was ist der pH-Wert?', items: ['pH = negativer dekadischer Logarithmus der H⁺-Konzentration', 'Skala: 0–14; pH 7 = neutral; < 7 = sauer; > 7 = basisch / alkalisch', 'Beckenwasser-Sollbereich: 6,5–7,8 (DIN 19643-1)', 'Optimaler Bereich für Chlorwirkung: pH 6,8–7,2', 'Zu hoher pH (> 7,8): Chlor verliert Desinfektionswirkung (Hypochloritform dominiert)', 'Zu niedriger pH (< 6,5): Schleimhautreizung, Materialkorrosion'] },
      { heading: 'pH-Steuerung im Bad', items: ['pH-Absenkung: Salzsäure (HCl) oder Kohlensäure (CO₂)', 'pH-Erhöhung: Natronlauge (NaOH) oder Soda (Na₂CO₃)', 'Dosierung: automatisch über pH-Regler und Dosierpumpen', 'Messung: kontinuierlich mit pH-Elektrode (amperometrisch)', 'Kalibrierung Elektrode: täglich mit Pufferlösung prüfen', 'CO₂-Anlage: besonders schonend — nur H₂CO₃ entsteht'] },
      { heading: 'Zusammenhang pH und Chlorwirkung', items: ['Bei pH 7,0: ca. 75 % Hypochlorsäure (HOCl) — bakterizid wirksam', 'Bei pH 8,0: nur ca. 20 % HOCl — drastisch reduzierte Wirkung', 'Hypochlorit-Ion (OCl⁻): kaum desinfizierend', 'Fazit: niedrigerer pH = bessere Chlorwirkung (im erlaubten Bereich!)', 'DIN 19643 Empfehlung: pH 6,8–7,2 für optimales Chlor-pH-Verhältnis'] },
    ],
  },
  redox: {
    title: 'Redox-Spannung',
    color: '#a070ff',
    sections: [
      { heading: 'Grundprinzip', items: ['Redox = Reduktion + Oxidation — Elektronenübertragungsreaktionen', 'Redox-Spannung (mV): Maß für das Oxidationspotenzial im Wasser', 'Gemessen mit Platin-Elektrode + Referenzelektrode (Ag/AgCl)', 'Hohe Redox-Spannung → starkes Oxidationspotenzial → gute Desinfektion', 'DIN 19643: Mindestwert ≥ 750 mV im Beckenwasser', 'Hallenbd. mit UV: ≥ 700 mV ausreichend (UV unterstützt)'] },
      { heading: 'Einflussgrößen', items: ['Freies Chlor: Haupttreiber der Redox-Spannung', 'pH-Wert: niedrigerer pH erhöht Redox bei gleichem Chlorgehalt', 'Organische Stoffe: verbrauchen Oxidationsmittel → Redox sinkt', 'Temperatur: höhere Temp. → schnellerer Reaktionsablauf', 'Ammoniumverbindungen (Harnstoff): binden freies Chlor → Redox sinkt'] },
      { heading: 'Regelung und Alarm', items: ['Regelung: Chlordosierpumpe erhöht Dosis bei sinkender Redox', 'Unteralarm: < 750 mV → automatische Sperrung in modernen Anlagen', 'Übersteuerung vermeiden: zu viel Chlor erzeugt Chloramine', 'Kombination pH + Redox: beide Größen zusammen regeln', 'Prüfung Elektrode: wöchentlich mit Redox-Standardlösung vergleichen'] },
    ],
  },
  chlor: {
    title: 'Chlor & Desinfektion',
    color: '#ffd166',
    sections: [
      { heading: 'Chlor im Wasser — Chemie', items: ['Chlorgas in Wasser: Cl₂ + H₂O → HOCl + HCl', 'Hypochlorsäure (HOCl): Desinfektionswirksame Form', 'Dissoziation: HOCl ⇌ H⁺ + OCl⁻ (abhängig von pH!)', 'Natriumhypochlorit (NaOCl): OCl⁻ + H₂O → HOCl (alkalisch)', 'Calciumhypochlorit Ca(ClO)₂: granuliert, schnell wirksam'] },
      { heading: 'Freies vs. gebundenes Chlor', items: ['Freies Chlor: HOCl + OCl⁻ — direkter Desinfektionskomplex', 'Gebundenes Chlor: Chloramine (Monochloramin NH₂Cl etc.)', 'Entstehung Chloramine: freies Chlor + Harnstoff / Ammonium', 'Chloramine: Geruchsbelästigung, Augenreizung — "Hallenbad-Geruch"!', 'DIN 19643: gebundenes Chlor ≤ 0,2 mg/L (Richtwert)', 'Lösung: Filterrückspülung, Teilwassertausch, UV-Anlage'] },
      { heading: 'Chlorzehrung & Dosierberechnung', items: ['Chlorzehrung: durch Badelast, UV-Strahlung, Temperatur', 'Grundformel: Dosiermenge (g) = Volumen (m³) × Zieldosis (mg/L)', 'Produkt-Wirkgehalt beachten! (z.B. NaOCl 12 % → 120 g/L Cl)', 'Kontinuierliche Messung + Regelung: Zieldosis hält sich automatisch', 'Stoßchlorung: bei Kontamination — kurzzeitig > 1 mg/L', 'Freigabe nach Stoßchlorung erst wieder bei ≤ 1 mg/L Cl (frei)'] },
    ],
  },
  härte: {
    title: 'Wasserhärte & Korrosion',
    color: '#ff7a7a',
    sections: [
      { heading: 'Wasserhärte', items: ['Gesamthärte (GH): Summe aller Erdalkali-Ionen (Ca²⁺, Mg²⁺)', 'Einheit: °dH (deutsche Härtegrade) oder mmol/L', 'Weiches Wasser (< 8,4 °dH): aggressiv, korrosiv', 'Hartes Wasser (> 14 °dH): Kalkablagerungen in Rohren', 'Beckenwasser: GH 5–15 °dH anstreben', 'Säurekapazität (KS4,3): Puffervermögen gegen pH-Absenkung'] },
      { heading: 'Sättigungsindex (Langelier-Index)', items: ['SI = pH(gemessen) − pH(Sättigung)', 'SI > 0: Kalkausfällung (scaling) — Rohre, Elektroden, Filter', 'SI < 0: kalkaggressiv — Korrosion von Beton, Metall', 'SI ≈ 0: Gleichgewicht — ideal für den Betrieb', 'Einfluss: pH, Temperatur, Gesamthärte, Leitfähigkeit', 'Korrektur: durch Kalksteinfilter oder Aufhärtemittel'] },
      { heading: 'Korrosion im Bad', items: ['Elektrochemische Korrosion: unedleres Metall wird abgebaut', 'Chloride beschleunigen Korrosion: Edelstahl, Alu, Chromstahl', 'Lochkorrosion (Pitting): beim Edelstahl durch Chloride > 250 mg/L', 'Schutzmaßnahmen: kathodischer Schutz, beschichtete Werkstoffe', 'Mischinkompatibilität: Aluminium + Chlor → Lochfraß', 'pH unter 6,5: Betonauflösung → Armierungskorrosion'] },
    ],
  },
};

export default function ChemieBadewasserDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('wasser');
  const tab = TAB_DATA[activeTab];

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Chemie der Badewasseraufbereitung</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>pH-Wert, Redox-Spannung, Chlorchemie, Wasserhärte und Korrosion nach DIN 19643</p>

        {/* pH-Skala Grafik */}
        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <svg viewBox="0 0 760 70" style={{ width: '100%', height: 'auto' }}>
            {[...Array(14)].map((_, i) => {
              const colors = ['#ff3030','#ff6020','#ff9010','#ffc000','#e8e000','#80d020','#30c050','#00b070','#0090c0','#0060e0','#1030d0','#3020b0','#500090','#600060'];
              return <rect key={i} x={20 + i * 52} y="10" width="50" height="28" rx="2" fill={colors[i]} opacity="0.7" />;
            })}
            {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => (
              <text key={i} x={45 + i * 52} y="29" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">{i}</text>
            ))}
            <text x="390" y="55" textAnchor="middle" fill="#4a7a9a" fontSize="9">sauer ← · → alkalisch / basisch</text>
            <rect x="358" y="8" width="104" height="32" rx="3" fill="none" stroke="#34c090" strokeWidth="2" />
            <text x="410" y="56" textAnchor="middle" fill="#34c090" fontSize="9" fontWeight="700">Sollbereich 6,5–7,8</text>
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

        {/* Content */}
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
