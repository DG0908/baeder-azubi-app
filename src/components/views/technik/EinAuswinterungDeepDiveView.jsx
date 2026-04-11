import { useState } from 'react';

const TABS = [
  { id: 'auswinterung', label: 'Auswinterung (Saisonstart)', color: '#34c090' },
  { id: 'betrieb', label: 'Saisonbetrieb', color: '#4a9eff' },
  { id: 'einwinterung', label: 'Einwinterung (Saisonende)', color: '#a070ff' },
  { id: 'freibad', label: 'Freibad-Spezifika', color: '#ffd166' },
  { id: 'protokoll', label: 'Dokumentation', color: '#5ad0ff' },
];

const TAB_DATA = {
  auswinterung: {
    title: 'Auswinterung — Saisonstart (Frühjahr)',
    color: '#34c090',
    sections: [
      { heading: 'Schritt 1 — Vorbereitung Anlage (ca. 4–6 Wochen vor Öffnung)', items: ['Sichtprüfung Becken: Risse, Schäden, Frost-Folgen', 'Rohrleitungen auf Frostschäden prüfen', 'Hydraulikanlage / Hubboden: Funktionstest', 'Elektroanlage: FI-Schutzschalter prüfen', 'Sprunganlagen: Jahreskontrolle nach DIN EN 13451-10'] },
      { heading: 'Schritt 2 — Wasser einlassen & aufbereiten', items: ['Becken füllen (Kaltwasser zuerst)', 'Erstbefüllung: pH einstellen (6,8–7,2)', 'Chlorung: Startdosis nach DIN 19643 (Stoßchlorung)', 'Redox-Spannung: mind. 750 mV abwarten', 'Keimzahlmessung vor Öffnung: Befund erforderlich'] },
      { heading: 'Schritt 3 — Betriebsmittel & Personal', items: ['Wartungsverträge prüfen (Filter, Pumpen, Chloranlage)', 'Sicherheitsmaterial vollständig: Wurfring, Stange, Spineboard, AED', 'Erste-Hilfe-Material überprüfen / auffüllen', 'Personal einweisen: Saisonkräfte, geänderte Badeordnung', 'Öffnung erst nach erfolgreicher Wasseruntersuchung'] },
    ],
  },
  betrieb: {
    title: 'Laufender Saisonbetrieb',
    color: '#4a9eff',
    sections: [
      { heading: 'Tägliche Routinen', items: ['Wasserqualität: pH, freies Chlor, Redox vor Öffnung messen', 'Sichtprüfung: Becken, Sprunganlagen, Einstiege', 'Reinigung: Böden absaugen, Überlauffrinne spülen', 'Chlorzufuhr anpassen: Badebelastung beachten', 'Protokolle führen: Messwerte, Besonderheiten'] },
      { heading: 'Wöchentliche Routinen', items: ['Filterspülung nach Druckanstieg (Δp > 0,5 bar)', 'Filtermedium: Schwebstoffanalyse', 'Dosierpumpen: Schlauch- und Membrankontrolle', 'Strömungsverteilung: Einspeisung prüfen', 'Besucherrekord: Badebelastung für Dosierberechnung'] },
      { heading: 'Gesetzliche Meldepflichten', items: ['Monatliche Meldung Wasserqualität ans Gesundheitsamt', 'Grenzwertüberschreitung → sofortige Meldung + Sperrung', 'DIN 19643: Prüfparameter Tabelle 1 einhalten', 'Cryptosporidien-Ausbruch: 72h-Protokoll, behördliche Meldung', 'Prüfberichte aufbewahren: mind. 10 Jahre'] },
    ],
  },
  einwinterung: {
    title: 'Einwinterung — Saisonende (Herbst)',
    color: '#a070ff',
    sections: [
      { heading: 'Anlage außer Betrieb nehmen', items: ['Wasseraufbereitung stoppen (Chloranlage, Dosierung)', 'Wasser abpumpen — Freifließen durch Bodenabläufe', 'Leitungen entleeren: Druckluft durchblasen', 'Frostschutz: alle wasserführenden Leitungen entleert?', 'Schieber / Armaturen: geöffnet lassen oder Heizband'] },
      { heading: 'Reinigung & Inspektion', items: ['Becken komplett reinigen (Algen, Biofilm, Kalkansatz)', 'Beckenboden und Wände: Sichtprüfung auf Risse', 'Filter: restlos entleeren, Filtermedium inspizieren', 'Dosierpumpen: Schlauch wechseln, Ventile reinigen', 'Sprunganlagen: Bretter einlagern oder abdecken'] },
      { heading: 'Schutzmaßnahmen', items: ['Freibad-Becken: Abdecknetz oder Plane gegen Laub', 'Frostempfindliche Geräte: einlagern (Stange, Rettungsring)', 'Sicherheitstechnik: AED in Winterlagerung (beheizt)', 'Gebäude: Türen/Fenster schließen, Heizung Frostschutz', 'Abschlussprotokoll: Zustand aller Anlagenteile dokumentieren'] },
    ],
  },
  freibad: {
    title: 'Freibad-Spezifika',
    color: '#ffd166',
    sections: [
      { heading: 'Witterungseinflüsse auf Wasserqualität', items: ['UV-Strahlung (Sonne): beschleunigt Chlorabbau → erhöhte Dosierung', 'Regen: verdünnt Wasser, senkt Leitfähigkeit', 'Hohe Temperaturen: fördern Algenwachstum', 'Wind: trägt Pollen, Staub, Insekten ins Becken', 'Starker Andrang nach Hitzeperiode: Belastungsspitze planen'] },
      { heading: 'Saisonbeginn Besonderheiten', items: ['Badeaufsicht erst nach Wasserfreigabe besetzen', 'Außenanlage (Liegewiese, Wege): Winterschäden prüfen', 'Kassensystem / Zählanlage: vor Öffnung testen', 'Gastronomie / Kiosk: Genehmigungen, Lebensmittelüberwachung', 'Spielgeräte (außen): Prüfung nach DIN EN 1176'] },
      { heading: 'Wetterbedingte Betriebsunterbrechungen', items: ['Gewitter: Becken sofort räumen (alle Badegäste raus)', 'Windgeschwindigkeit > 70 km/h: Sprunganlagen sperren', 'Trübung durch Starkregen: Badebetrieb einstellen, Wassertest', 'Kälte < 16 °C: Badeaufsicht beachten — Unterkühlung möglich', 'Betriebsunterbrechung dokumentieren: Uhrzeit, Grund'] },
    ],
  },
  protokoll: {
    title: 'Dokumentation & Protokollpflichten',
    color: '#5ad0ff',
    sections: [
      { heading: 'Pflichtprotokolle Saisonstart', items: ['Abnahmeprotokoll Anlage nach Instandsetzung', 'Wasseruntersuchungsbericht (akkreditiertes Labor)', 'Einweisungsnachweis Personal', 'Prüfprotokoll Sprunganlagen / Spielgeräte', 'Freigabeprotokoll Gesundheitsamt (falls gefordert)'] },
      { heading: 'Pflichtprotokolle Saisonende', items: ['Abschlussprotokoll Beckenzustand (Fotos empfohlen)', 'Protokoll Entleerung und Frostsicherung', 'Wartungsnachweis Pumpen, Dosiertechnik, Chloranlage', 'Lagerbestandsliste Chemikalien (Gefahrgut)', 'Prüfbuch Sprunganlagen: Jahresinspektion eingetragen'] },
      { heading: 'Aufbewahrungsfristen', items: ['Messwertprotokolle (täglich): mind. 3 Jahre', 'Wasseruntersuchungen (Labor): mind. 10 Jahre', 'Unfallberichte: mind. 30 Jahre', 'Prüfbücher Sprunganlagen: Lebensdauer der Anlage + 10 J', 'Einweisungsnachweise: solange Personal beschäftigt + 3 J'] },
    ],
  },
};

export default function EinAuswinterungDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('auswinterung');
  const tab = TAB_DATA[activeTab];

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Ein- & Auswinterung</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Saisonvorbereitung, laufender Betrieb, Stilllegung und Dokumentationspflichten</p>

        {/* Jahreskreis Grafik */}
        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <svg viewBox="0 0 760 90" style={{ width: '100%', height: 'auto' }}>
            <defs>
              <marker id="earr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4a7090" />
              </marker>
            </defs>
            {/* Timeline Bar */}
            <rect x="20" y="30" width="720" height="30" rx="4" fill="#0a1a2a" />
            {/* Phasen */}
            <rect x="20" y="30" width="160" height="30" rx="4" fill="#a07020" opacity="0.4" />
            <text x="100" y="50" textAnchor="middle" fill="#ffd166" fontSize="10" fontWeight="700">Auswinterung</text>
            <text x="100" y="75" textAnchor="middle" fill="#a07040" fontSize="9">Feb – Apr</text>
            <rect x="180" y="30" width="380" height="30" fill="#1a4a2a" opacity="0.5" />
            <text x="370" y="50" textAnchor="middle" fill="#34c090" fontSize="10" fontWeight="700">Saisonbetrieb</text>
            <text x="370" y="75" textAnchor="middle" fill="#1a7050" fontSize="9">Apr / Mai – Sep / Okt</text>
            <rect x="560" y="30" width="180" height="30" rx="4" fill="#2a1a4a" opacity="0.5" />
            <text x="650" y="50" textAnchor="middle" fill="#a070ff" fontSize="10" fontWeight="700">Einwinterung</text>
            <text x="650" y="75" textAnchor="middle" fill="#6040a0" fontSize="9">Okt – Dez</text>
            {/* Grenzen */}
            <line x1="180" y1="25" x2="180" y2="65" stroke="#4a7090" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="560" y1="25" x2="560" y2="65" stroke="#4a7090" strokeWidth="1.5" strokeDasharray="3,3" />
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

        {/* Tab Content */}
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
