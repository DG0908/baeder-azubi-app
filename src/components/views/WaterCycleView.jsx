import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, Droplets, Gauge,
  ListChecks, Play, ShieldCheck, SlidersHorizontal, Thermometer, Wrench, XCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  WATER_CYCLE_DEFAULT_CONTROLS, WATER_CYCLE_FUTURE_MODULES, WATER_CYCLE_PIPES,
  WATER_CYCLE_PROFI_SPICKZETTEL, WATER_CYCLE_STATION_ORDER, WATER_CYCLE_STATIONS,
  WATER_CYCLE_VIEWBOX
} from '../../data/waterCycle';
import { WATER_CYCLE_MISSIONS } from '../../data/waterCycleMissions';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const fixed = (value, digits = 2) => Number(value.toFixed(digits));

const CONTROL_LABELS = {
  pumpEnabled: 'Pumpe', ventValveOpen: 'Entlueftung V3',
  backwashMode: 'Rueckspuelmodus', backwashValveOpen: 'Rueckspuelventil V4',
  disinfectPumpEnabled: 'Dosierpumpe', rawValveOpen: 'Saugleitung V1',
  returnValveOpen: 'Ruecklaufventil V2'
};
const METRIC_LABELS = {
  flowRate: 'Volumenstrom', freeChlorine: 'Freies Chlor',
  backwashProgress: 'Rueckspuel-Fortschritt', differentialPressure: 'Differenzdruck'
};

const STATION_FOCUS = {
  becken:       { x: 208,  y: 150, r: 130 },
  ueberlauf:    { x: 426,  y: 150, r: 46  },
  schwall:      { x: 522,  y: 150, r: 88  },
  pumpe:        { x: 530,  y: 328, r: 84  },
  flockung:     { x: 686,  y: 330, r: 68  },
  filter:       { x: 854,  y: 318, r: 88  },
  desinfektion: { x: 1040, y: 286, r: 84  },
  heizung:      { x: 1040, y: 156, r: 72  },
  ruecklauf:    { x: 808,  y: 108, r: 62  }
};

const SCHEMATIC_PIPE_PATHS = {
  'becken-ueberlauf':     'M 356 148 L 420 148',
  'ueberlauf-schwall':    'M 434 148 L 470 148',
  'schwall-pumpe':        'M 530 206 L 530 280',
  'pumpe-flockung':       'M 568 330 L 650 330',
  'flockung-filter':      'M 722 330 L 820 330',
  'filter-desinfektion':  'M 888 304 C 950 292 1000 286 1040 286',
  'desinfektion-heizung': 'M 1040 270 L 1040 194',
  'heizung-ruecklauf':    'M 1010 138 C 950 114 902 108 840 108',
  'ruecklauf-becken':     'M 804 108 C 690 110 530 118 356 148',
  'filter-kanal':         'M 840 362 L 840 452 C 860 520 940 548 1020 548'
};

const readCondition = (condition, snapshot) => {
  if (condition.source === 'control') return snapshot.controls?.[condition.key];
  if (condition.source === 'metric') return snapshot.metrics?.[condition.key];
  return undefined;
};
const isConditionOk = (condition, snapshot) => {
  const value = readCondition(condition, snapshot);
  if (Object.prototype.hasOwnProperty.call(condition, 'equals') && value !== condition.equals) return false;
  if (Object.prototype.hasOwnProperty.call(condition, 'min') && !(Number(value) >= condition.min)) return false;
  if (Object.prototype.hasOwnProperty.call(condition, 'max') && !(Number(value) <= condition.max)) return false;
  return true;
};
const isMissionSolved = (mission, snapshot) => {
  const all = mission?.solveWhen?.all || [];
  return all.length > 0 && all.every((c) => isConditionOk(c, snapshot));
};
const formatCondition = (condition) => {
  const lbl = condition.source === 'control'
    ? (CONTROL_LABELS[condition.key] || condition.key)
    : (METRIC_LABELS[condition.key] || condition.key);
  if (Object.prototype.hasOwnProperty.call(condition, 'equals')) return `${lbl} = ${String(condition.equals)}`;
  if (Object.prototype.hasOwnProperty.call(condition, 'min')) return `${lbl} >= ${condition.min}`;
  if (Object.prototype.hasOwnProperty.call(condition, 'max')) return `${lbl} <= ${condition.max}`;
  return lbl;
};
const formatLogTime = (ts) => {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? '--:--' : d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
};

// ─── Deep-Dive learning data per station ─────────────────────────────────────
const DEEP_DIVE = {
  pumpe: {
    icon: '⚙️', subtitle: 'Kreiselpumpe · Radialläufer',
    kenndaten: [
      { label: 'Typ', value: 'Kreiselpumpe (Radialläufer)' },
      { label: 'Mindest-Umwälzung', value: '4× täglich (DIN 19643)' },
      { label: 'Saugseite', value: 'Schwallwasserbehälter → Pumpe' },
      { label: 'Druckseite', value: 'Pumpe → Flockung → Filter' },
    ],
    lernpunkte: [
      'Das Laufrad wandelt Drehbewegung in Strömungsenergie um',
      'Kavitation: Unterdruck → Dampfblasen → Materialschäden',
      'Bei Kavitation V3 (Entlüftung) öffnen',
      'Pumpenkurve: Q↑ = H↓ (mehr Durchfluss = weniger Druck)',
    ],
    pruefungsfrage: 'Was ist Kavitation und wie wird sie verhindert?',
    pruefungsantwort: 'Kavitation = Dampfblasenbildung durch Unterdruck auf der Saugseite. Vermeidung: Saugleitung dicht halten, Entlüftungsventil V3 öffnen, Saughöhe minimieren.',
  },
  filter: {
    icon: '🗂️', subtitle: 'Mehrschichtfilter · Druckfilter',
    kenndaten: [
      { label: 'Schichten (von oben)', value: 'Quarzkies → Quarzsand → Aktivkohle' },
      { label: 'Filtrat ab', value: 'Partikel ≥ 0,1 µm' },
      { label: 'Rückspülung bei', value: 'dP > 0,5 bar oder nach 72 h' },
      { label: 'Rückspülwasser', value: 'Nicht zurück ins Becken!' },
    ],
    lernpunkte: [
      'Kies (oben): Stützschicht, hält Sandschicht an Ort',
      'Quarzsand (mitte): Hauptfilterleistung, Feinstpartikel',
      'Aktivkohle (unten): Bindet organische Verbindungen',
      'Rückspülung löst Schmutz → Kanal/Abwurf',
    ],
    pruefungsfrage: 'Ab welchem Differenzdruck muss rückgespült werden?',
    pruefungsantwort: 'Bei ΔP > 0,5 bar oder spätestens nach 72 h Betrieb. Rückspülwasser muss in den Kanal (nicht ins Becken) abgeleitet werden.',
  },
  desinfektion: {
    icon: '⚗️', subtitle: 'Chlorierung · DIN 19643',
    kenndaten: [
      { label: 'Freies Chlor Soll', value: '0,3 – 0,6 mg/L' },
      { label: 'Max. freies Chlor', value: '1,0 mg/L' },
      { label: 'Messmethode', value: 'DPD-Methode (täglich)' },
      { label: 'Optimal-pH', value: '7,0 – 7,4' },
    ],
    lernpunkte: [
      'HOCl (hypochlorige Säure) ist die wirksame Form',
      'pH 7,2 → ~65 % als HOCl; pH 8,0 → nur ~20 %',
      'Gebundenes Chlor (Chloramine) → Geruch + Reizung',
      'Stoßchlorierung: kurzzeitig bis 5 mg/L für Problemfälle',
    ],
    pruefungsfrage: 'Wie beeinflusst der pH-Wert die Chlorwirksamkeit?',
    pruefungsantwort: 'Je niedriger der pH, desto mehr HOCl (wirksam). Bei pH 7,2 ca. 65 % HOCl; bei pH 8,0 nur ~20 %. Deshalb Ziel-pH 7,0–7,4 einhalten.',
  },
  heizung: {
    icon: '🌡️', subtitle: 'Plattenwärmetauscher · Gegenstrom',
    kenndaten: [
      { label: 'Zieltemperatur', value: '26 – 28 °C (DIN 19643)' },
      { label: 'Prinzip', value: 'Gegenstrom-Wärmetauscher' },
      { label: 'Kreise', value: 'Primär (Fernwärme) | Sekundär (Bad)' },
      { label: 'Wartung', value: 'Antikalk-Behandlung nötig' },
    ],
    lernpunkte: [
      'Gegenstrom: heiß/kalt entgegengesetzt → max. Temperaturgefälle',
      'Beide Kreise hydraulisch getrennt (Hygiene)',
      'Kalkablagerungen → schlechterer Wärmeübergang',
      'Kinderbecken bis 32 °C; Schwimmerbecken 26–28 °C',
    ],
    pruefungsfrage: 'Warum ist das Gegenstrom-Prinzip effizienter als Gleichstrom?',
    pruefungsantwort: 'Beim Gegenstrom bleibt das Temperaturgefälle über die gesamte Länge konstant → maximale Wärmeübertragung. Bei Gleichstrom gleicht sich die Temperatur schnell an.',
  },
  schwall: {
    icon: '🏊', subtitle: 'Schwallwasserbehälter · Pufferspeicher',
    kenndaten: [
      { label: 'Mindestvolumen', value: '≥ 10 % Beckenvolumen' },
      { label: 'Zulauf', value: 'Überlaufrinne → Schwall' },
      { label: 'Ablauf', value: 'Schwall → Umwälzpumpe' },
      { label: 'Pegel steigt wenn', value: 'Viele Badegäste einsteigen' },
    ],
    lernpunkte: [
      'Badegäste verdrängen Wasser → Überlaufrinne → Schwall',
      'Puffer verhindert Absenkung des Beckenspiegels',
      'Schwallwasser = konzentrierteste Badewasserbelastung',
      'Pegel-Monitoring gibt Rückschluss auf Badegastzahlen',
    ],
    pruefungsfrage: 'Warum sinkt der Beckenwasserspiegel nicht wenn viele Badegäste einsteigen?',
    pruefungsantwort: 'Das verdrängte Wasser fließt über die Überlaufrinne in den Schwallwasserbehälter und wird gepuffert. Der Beckenpegel bleibt so stabil.',
  },
  flockung: {
    icon: '🧪', subtitle: 'Flockungsmittel-Dosierung · Koagulation',
    kenndaten: [
      { label: 'Mittel', value: 'Aluminiumsulfat / Polyelektrolyt' },
      { label: 'Dosierung', value: '0,1 – 0,3 mg/L Al' },
      { label: 'Zielgröße', value: 'Flocken ≥ 5 µm (filterbar)' },
      { label: 'pH-Optimum', value: '6,8 – 7,2' },
    ],
    lernpunkte: [
      'Mikropartikel < 0,1 µm sind zu klein für Sandfilter',
      'Flockungsmittel destabilisiert Partikelladungen → Zusammenballung',
      'Flocken wachsen zu > 5 µm → vom Filter abscheidbar',
      'Zu viel Flockungsmittel → Aluminium im Wasser (Grenzwert!)',
    ],
    pruefungsfrage: 'Welche Partikelgröße kann der Sandfilter ohne Flockung abscheiden?',
    pruefungsantwort: 'Nur Partikel ≥ 0,1 µm. Kleinere Partikel (Viren, Eiweiße) müssen durch Flockung zu größeren Aggregaten verbunden werden.',
  },
  becken: {
    icon: '🏊‍♂️', subtitle: 'Schwimmbecken · Hydraulik & Betrieb',
    kenndaten: [
      { label: 'Einströmung', value: 'Boden-Einströmdüsen' },
      { label: 'Ausströmung', value: 'Überlaufrinne (Oberfläche)' },
      { label: 'Turnover max.', value: '12 h (Schwimmerbecken)' },
      { label: 'Beckentiefe min.', value: '1,80 m (DIN 18032)' },
    ],
    lernpunkte: [
      'Bodeneinströmung → gleichmäßige Durchströmung von unten nach oben',
      'Überlaufrinne nimmt Oberflächenwasser (höchste Belastung) ab',
      'Turnover = Beckenvolumen ÷ Volumenstrom [h]',
      'Totzonen entstehen bei schlechter Hydraulik → Keimgefahr',
    ],
    pruefungsfrage: 'Wie wird die Turnover-Zeit berechnet und was ist der Grenzwert?',
    pruefungsantwort: 'Turnover [h] = Beckenvolumen [m³] ÷ Volumenstrom [m³/h]. Grenzwert: max. 12 h für Schwimmer-, max. 4 h für Lehr- und Kinderbecken.',
  },
  ueberlauf: {
    icon: '↩️', subtitle: 'Überlaufrinne · Oberflächenabzug',
    kenndaten: [
      { label: 'Funktion', value: 'Oberflächenwasser abführen' },
      { label: 'Ziel', value: 'Schwallwasserbehälter' },
      { label: 'Wasserqualität', value: 'Höchste Verunreinigung' },
      { label: 'Rinne', value: 'Gesamter Beckenumfang' },
    ],
    lernpunkte: [
      'Öle, Schweiß, Sonnencreme akkumulieren an der Oberfläche',
      'Überlaufrinne führt diese belastete Schicht kontinuierlich ab',
      'Rinnenwasser wird im Aufbereitungskreislauf mitbehandelt',
      'Rinnengeometrie muss Überlauf über Gesamtumfang ermöglichen',
    ],
    pruefungsfrage: 'Warum ist das Rinnenwasser besonders stark belastet?',
    pruefungsantwort: 'An der Wasseroberfläche sammeln sich alle hydrophoben Stoffe (Öle, Fette) sowie leichte Partikel. Die Überlaufrinne erfasst genau diese höchstbelastete Schicht.',
  },
  ruecklauf: {
    icon: '🔄', subtitle: 'Rücklauf · Einspeisung ins Becken',
    kenndaten: [
      { label: 'Einströmung', value: 'Boden-Einströmdüsen' },
      { label: 'Druck', value: '0,5 – 1,5 bar am Einlass' },
      { label: 'Chlorgehalt', value: 'Auf Sollwert eingestellt' },
      { label: 'Temperatur', value: 'Auf Zielwert geheizt' },
    ],
    lernpunkte: [
      'Nach Filter, Desinfektion, Heizung → zurück ins Becken',
      'Einströmdüsen am Boden → gleichmäßige Verteilung',
      'Gegenstrom zur Überlaufrichtung → optimale Durchmischung',
      'pH und Chlor müssen vor Einspeisung im Soll sein',
    ],
    pruefungsfrage: 'Was passiert wenn das Rücklaufwasser nicht korrekt aufbereitet ist?',
    pruefungsantwort: 'Unterchloriertes oder pH-falsches Wasser verletzt hygienische Grenzwerte → Badebetrieb muss eingestellt werden. Laut DIN 19643 täglich messen und dokumentieren.',
  },
};

// ─── Station-specific animated SVG illustrations ──────────────────────────────
function DeepDiveSVG({ stationId, metrics, controls, xrayMode }) {
  const running = controls.pumpEnabled;
  const B = {
    bg: '#040d1a', panel: '#0a1a2e', border: '#1a3a5a',
    accent: '#4a9eff', text: '#b0cce0', muted: '#456080',
    success: '#34c090', warning: '#d09030', danger: '#d04040', water: '#1060a0'
  };

  if (stationId === 'pumpe') {
    return (
      <svg viewBox="0 0 300 250" width="100%" height="100%">
        <rect width="300" height="250" fill={B.bg} rx="8"/>
        <circle cx="148" cy="118" r="72" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <path d="M148 118 Q195 80 200 118 Q205 162 165 188 Q120 208 88 178 Q50 144 62 98 Q74 54 122 44 Q172 36 200 78"
          fill="none" stroke={B.muted} strokeWidth="8" strokeLinecap="round" opacity="0.35"/>
        <g style={{ transformOrigin: '148px 118px', animation: running ? 'wcSpin 1.1s linear infinite' : 'none' }}>
          {[0, 60, 120, 180, 240, 300].map(deg => {
            const r = (deg * Math.PI) / 180;
            return <line key={deg} x1="148" y1="118" x2={148 + 46 * Math.cos(r)} y2={118 + 46 * Math.sin(r)}
              stroke={B.accent} strokeWidth="3.5" strokeLinecap="round" opacity="0.85"/>;
          })}
          <circle cx="148" cy="118" r="11" fill={B.panel} stroke={B.accent} strokeWidth="2"/>
        </g>
        <rect x="14" y="108" width="62" height="20" fill={B.panel} stroke={B.border} strokeWidth="1.5" rx="3"/>
        <polygon points="64,118 52,112 52,124" fill={B.accent} opacity="0.7"/>
        <rect x="136" y="12" width="24" height="56" fill={B.panel} stroke={B.border} strokeWidth="1.5" rx="3"/>
        <polygon points="148,20 141,34 155,34" fill={B.accent} opacity="0.7"/>
        <rect x="110" y="192" width="76" height="30" fill={B.panel} stroke={B.border} strokeWidth="1.5" rx="5"/>
        <text x="148" y="212" fill={B.muted} fontSize="8" fontFamily="monospace" textAnchor="middle">MOTOR</text>
        <text x="14" y="104" fill={B.muted} fontSize="7" fontFamily="monospace">SAUGSEITE</text>
        <text x="136" y="9" fill={B.muted} fontSize="7" fontFamily="monospace">DRUCKSEITE</text>
        <rect x="222" y="56" width="70" height="62" fill={B.panel} stroke={B.border} strokeWidth="1" rx="5"/>
        <text x="257" y="74" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="middle">VOLUMENSTROM</text>
        <text x="257" y="98" fill={running ? B.accent : B.muted} fontSize="20" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{metrics.flowRate}</text>
        <text x="257" y="110" fill={B.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">m³/h</text>
        <text x="148" y="242" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">KREISELPUMPE · RADIALLÄUFER</text>
      </svg>
    );
  }

  if (stationId === 'filter') {
    const dp = metrics.differentialPressure;
    const dpColor = dp > 0.5 ? B.danger : dp > 0.35 ? B.warning : B.success;
    const layers = [
      { label: 'QUARZKIES', fill: '#2a4530', y: 52, h: 52 },
      { label: 'QUARZSAND', fill: '#384828', y: 104, h: 60 },
      { label: 'AKTIVKOHLE', fill: '#1a2838', y: 164, h: 52 },
    ];
    return (
      <svg viewBox="0 0 300 290" width="100%" height="100%">
        <rect width="300" height="290" fill={B.bg} rx="8"/>
        <ellipse cx="105" cy="56" rx="55" ry="17" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="50" y="54" width="110" height="162" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        {layers.map(l => (
          <g key={l.label}>
            <rect x="52" y={l.y} width="106" height={l.h} fill={l.fill} fillOpacity={xrayMode ? 0.9 : 0.5}/>
            <text x="106" y={l.y + l.h / 2 + 4} fill={B.text} fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.9">{l.label}</text>
          </g>
        ))}
        <ellipse cx="105" cy="216" rx="55" ry="17" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <polygon points="105,30 99,44 111,44" fill={B.accent} opacity="0.7"/>
        <line x1="105" y1="38" x2="105" y2="54" stroke={B.accent} strokeWidth="2" opacity="0.6"/>
        <polygon points="105,258 99,244 111,244" fill={B.accent} opacity="0.7"/>
        <line x1="105" y1="233" x2="105" y2="244" stroke={B.accent} strokeWidth="2" opacity="0.6"/>
        <circle cx="182" cy="148" r="17" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <circle cx="182" cy="148" r="10" fill={xrayMode ? '#2a5a30' : B.water} opacity={0.6}/>
        <text x="182" y="176" fill={B.muted} fontSize="6" fontFamily="monospace" textAnchor="middle">TRÜBUNG</text>
        <rect x="208" y="90" width="82" height="68" fill={B.panel} stroke={`${dpColor}80`} strokeWidth="1" rx="5"/>
        <text x="249" y="108" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="middle">DIFF.-DRUCK</text>
        <text x="249" y="132" fill={dpColor} fontSize="20" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{dp}</text>
        <text x="249" y="145" fill={B.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">bar</text>
        <text x="249" y="164" fill={dpColor} fontSize="7" fontFamily="monospace" textAnchor="middle">{dp > 0.5 ? '⚠ RÜCKSPÜLEN' : dp > 0.35 ? 'ERHÖHT' : '✓ NORMAL'}</text>
        <text x="105" y="278" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">MEHRSCHICHTFILTER</text>
      </svg>
    );
  }

  if (stationId === 'desinfektion') {
    const cl = metrics.freeChlorine;
    const clOk = cl >= 0.3 && cl <= 0.6;
    const clColor = clOk ? B.success : cl > 0.8 ? B.danger : B.warning;
    return (
      <svg viewBox="0 0 300 250" width="100%" height="100%">
        <rect width="300" height="250" fill={B.bg} rx="8"/>
        <ellipse cx="80" cy="56" rx="30" ry="10" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="50" y="54" width="60" height="110" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <ellipse cx="80" cy="164" rx="30" ry="10" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="55" y="68" width="50" height="88" fill="#001080" fillOpacity="0.25" rx="2"/>
        <text x="80" y="120" fill="#5090d0" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">NaOCl</text>
        <text x="80" y="48" fill={B.muted} fontSize="6" fontFamily="monospace" textAnchor="middle">DESINFEKTIONSMITTEL</text>
        <ellipse cx="172" cy="70" rx="24" ry="8" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="148" y="68" width="48" height="96" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <ellipse cx="172" cy="164" rx="24" ry="8" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="152" y="82" width="40" height="74" fill="#402000" fillOpacity="0.3" rx="2"/>
        <text x="172" y="128" fill="#d09040" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">CO₂</text>
        <text x="172" y="62" fill={B.muted} fontSize="6" fontFamily="monospace" textAnchor="middle">pH-KORREKTUR</text>
        <line x1="80" y1="174" x2="80" y2="200" stroke={B.accent} strokeWidth="2" opacity="0.6"/>
        <line x1="80" y1="200" x2="250" y2="200" stroke={B.accent} strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
        <circle cx="140" cy="200" r="8" fill={B.panel} stroke={clColor} strokeWidth="2">
          <animate attributeName="r" values="8;11;8" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <rect x="220" y="68" width="72" height="72" fill={B.panel} stroke={`${clColor}80`} strokeWidth="1" rx="5"/>
        <text x="256" y="86" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="middle">FREIES CHLOR</text>
        <text x="256" y="110" fill={clColor} fontSize="20" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{cl}</text>
        <text x="256" y="124" fill={B.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">mg/L</text>
        <text x="256" y="140" fill={clColor} fontSize="7" fontFamily="monospace" textAnchor="middle">{clOk ? '✓ SOLL' : cl < 0.3 ? '↑ ZU NIEDRIG' : '↓ ZU HOCH'}</text>
        <text x="150" y="238" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">DESINFEKTIONSANLAGE · CHLORIERUNG</text>
      </svg>
    );
  }

  if (stationId === 'heizung') {
    const temp = metrics.temperature;
    const tempOk = temp >= 26 && temp <= 28;
    return (
      <svg viewBox="0 0 300 240" width="100%" height="100%">
        <rect width="300" height="240" fill={B.bg} rx="8"/>
        <rect x="60" y="40" width="160" height="148" fill={B.panel} stroke={B.border} strokeWidth="1.5" rx="4"/>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <rect key={i} x="68" y={50 + i * 13} width="144" height="10"
            fill={i % 2 === 0 ? '#3a1010' : '#0a2040'} fillOpacity="0.7" rx="1"/>
        ))}
        <polygon points="52,65 62,60 62,70" fill="#d04040" opacity="0.7"/>
        <polygon points="52,91 62,86 62,96" fill="#d04040" opacity="0.7"/>
        <polygon points="62,160 52,155 52,165" fill="#d07070" opacity="0.45"/>
        <text x="38" y="112" fill="#c05050" fontSize="7.5" fontFamily="monospace" textAnchor="middle" transform="rotate(-90,38,112)">PRIMÄR (HEISSWASSER)</text>
        <polygon points="228,78 238,73 238,83" fill="#3080d0" opacity="0.7"/>
        <polygon points="228,104 238,99 238,109" fill="#3080d0" opacity="0.7"/>
        <polygon points="238,130 228,125 228,135" fill="#3080d0" opacity="0.45"/>
        <text x="262" y="112" fill="#3080d0" fontSize="7.5" fontFamily="monospace" textAnchor="middle" transform="rotate(90,262,112)">SEKUNDÄR (BECKENWASSER)</text>
        <rect x="75" y="200" width="150" height="26" fill={B.panel} stroke={`${tempOk ? B.success : B.warning}60`} strokeWidth="1" rx="4"/>
        <text x="150" y="211" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="middle">BECKENWASSERTEMPERATUR</text>
        <text x="150" y="222" fill={tempOk ? B.success : B.warning} fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{temp} °C  {tempOk ? '✓ IM SOLL' : '⚠ PRÜFEN'}</text>
        <text x="150" y="236" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">PLATTENWÄRMETAUSCHER · GEGENSTROM</text>
      </svg>
    );
  }

  if (stationId === 'schwall') {
    const level = metrics.surgeLevel;
    const fillH = Math.round(160 * level / 100);
    return (
      <svg viewBox="0 0 300 260" width="100%" height="100%">
        <rect width="300" height="260" fill={B.bg} rx="8"/>
        <ellipse cx="120" cy="48" rx="58" ry="14" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="62" y="46" width="116" height="162" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <ellipse cx="120" cy="208" rx="58" ry="14" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="64" y={208 - fillH} width="112" height={fillH} fill={B.water} fillOpacity="0.4" rx="2"/>
        <line x1="64" y1={208 - fillH} x2="176" y2={208 - fillH} stroke="#4ab0ff" strokeWidth="1.5" opacity="0.7">
          <animate attributeName="y1" values={`${208 - fillH};${204 - fillH};${208 - fillH}`} dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="y2" values={`${208 - fillH};${210 - fillH};${208 - fillH}`} dur="2.5s" repeatCount="indefinite"/>
        </line>
        <rect x="190" y="46" width="12" height="162" fill={B.muted} fillOpacity="0.15" rx="2"/>
        <rect x="190" y={208 - fillH} width="12" height={fillH} fill={B.accent} fillOpacity="0.6" rx="2"/>
        <text x="196" y={Math.max(70, 205 - fillH)} fill={B.accent} fontSize="7" fontFamily="monospace" textAnchor="middle">{level}%</text>
        <polygon points="62,90 50,84 50,96" fill={B.accent} opacity="0.6"/>
        <text x="46" y="80" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="end">ÜBERLAUF</text>
        <polygon points="178,196 190,190 190,202" fill={B.accent} opacity="0.6"/>
        <text x="194" y="210" fill={B.muted} fontSize="6.5" fontFamily="monospace">ZUR PUMPE</text>
        <rect x="218" y="82" width="72" height="54" fill={B.panel} stroke={B.border} strokeWidth="1" rx="5"/>
        <text x="254" y="100" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="middle">FÜLLSTAND</text>
        <text x="254" y="122" fill={B.accent} fontSize="20" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{level}</text>
        <text x="254" y="131" fill={B.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">%</text>
        <text x="120" y="250" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">SCHWALLWASSERBEHÄLTER</text>
      </svg>
    );
  }

  if (stationId === 'flockung') {
    return (
      <svg viewBox="0 0 300 250" width="100%" height="100%">
        <rect width="300" height="250" fill={B.bg} rx="8"/>
        <ellipse cx="108" cy="52" rx="52" ry="13" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="56" y="50" width="104" height="132" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <path d="M56 182 L108 210 L160 182 Z" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <rect x="58" y="68" width="100" height="108" fill={B.water} fillOpacity="0.12"/>
        {[73, 93, 108, 128, 143, 80, 120, 135].map((x, i) => (
          <circle key={i} cx={x} cy={100 + (i % 4) * 16} r={1.5 + (i % 3) * 0.6} fill="#7ab5d8" opacity="0.5">
            <animate attributeName="cy" values={`${100 + (i % 4) * 16};${96 + (i % 4) * 16};${100 + (i % 4) * 16}`} dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {[83, 107, 127].map((x, i) => (
          <circle key={`fl${i}`} cx={x} cy={152 + i * 12} r={3.5 + i} fill="#507090" opacity="0.6">
            <animate attributeName="cy" values={`${152 + i * 12};${157 + i * 12};${152 + i * 12}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        <g style={{ transformOrigin: '108px 100px', animation: running ? 'wcSpin 3s linear infinite' : 'none' }}>
          <line x1="108" y1="66" x2="108" y2="134" stroke={B.muted} strokeWidth="2" opacity="0.5"/>
          <line x1="80" y1="90" x2="136" y2="90" stroke={B.muted} strokeWidth="3" strokeLinecap="round" opacity="0.65"/>
          <line x1="80" y1="112" x2="136" y2="112" stroke={B.muted} strokeWidth="3" strokeLinecap="round" opacity="0.65"/>
        </g>
        <line x1="108" y1="36" x2="108" y2="50" stroke={B.accent} strokeWidth="2" opacity="0.7"/>
        <polygon points="108,36 102,48 114,48" fill={B.accent} opacity="0.7"/>
        <text x="108" y="28" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="middle">FLOCKUNGSMITTEL</text>
        <polygon points="108,222 102,210 114,210" fill={B.accent} opacity="0.7"/>
        <circle cx="220" cy="82" r="4" fill="#7ab5d8" opacity="0.6"/>
        <text x="228" y="86" fill={B.muted} fontSize="7" fontFamily="monospace">MIKROPARTIKEL</text>
        <circle cx="220" cy="102" r="6" fill="#507090" opacity="0.6"/>
        <text x="230" y="106" fill={B.muted} fontSize="7" fontFamily="monospace">FLOCKEN ≥ 5µm</text>
        <text x="148" y="242" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">FLOCKUNGSBEHÄLTER · KOAGULATION</text>
      </svg>
    );
  }

  if (stationId === 'becken') {
    return (
      <svg viewBox="0 0 300 230" width="100%" height="100%">
        <rect width="300" height="230" fill={B.bg} rx="8"/>
        <rect x="20" y="30" width="220" height="130" fill={B.panel} stroke={B.border} strokeWidth="2" rx="4"/>
        <rect x="26" y="46" width="208" height="108" fill={B.water} fillOpacity="0.28"/>
        <path d="M26 58 Q60 48 96 58 Q132 68 166 56 Q200 44 234 58"
          fill="none" stroke="#4ab0ff" strokeWidth="1.5" opacity="0.7" className="wc-surface"/>
        <rect x="240" y="46" width="14" height="52" fill={B.muted} fillOpacity="0.2" stroke={B.border} strokeWidth="1"/>
        <polygon points="240,60 248,54 248,66" fill={B.accent} opacity="0.5"/>
        <text x="254" y="75" fill={B.muted} fontSize="5.5" fontFamily="monospace" transform="rotate(90,254,75)">ÜBERLAUFRINNE</text>
        {[68, 130, 192].map(x => (
          <g key={x}>
            <rect x={x - 8} y={148} width="16" height="8" fill={B.accent} fillOpacity="0.3" stroke={B.accent} strokeWidth="0.8" rx="1"/>
            <polygon points={`${x},140 ${x - 4},148 ${x + 4},148`} fill={B.accent} opacity="0.65"/>
          </g>
        ))}
        <text x="130" y="170" fill={B.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">▲ BODENEINSTRÖMDÜSEN</text>
        {[78, 132].map(x => (
          <g key={x} opacity="0.4">
            <circle cx={x} cy="80" r="6" fill="none" stroke={B.muted} strokeWidth="1.2"/>
            <line x1={x} y1="86" x2={x} y2="108" stroke={B.muted} strokeWidth="1.5"/>
            <line x1={x - 10} y1="96" x2={x + 10} y2="96" stroke={B.muted} strokeWidth="1.5"/>
          </g>
        ))}
        <rect x="20" y="180" width="260" height="38" fill={B.panel} stroke={B.border} strokeWidth="1" rx="4"/>
        <text x="150" y="194" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="middle">TURNOVER = BECKENVOLUMEN ÷ VOLUMENSTROM</text>
        <text x="150" y="208" fill={B.accent} fontSize="7" fontFamily="monospace" textAnchor="middle">Max. 12 h · Schwimmerbecken | 4 h · Lehr-/Kinderbecken</text>
        <text x="150" y="224" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">SCHWIMMBECKEN · HYDRAULIK</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 220" width="100%" height="100%">
      <rect width="300" height="220" fill={B.bg} rx="8"/>
      <rect x="30" y="60" width="100" height="100" fill={B.panel} stroke={B.border} strokeWidth="1.5" rx="8"/>
      <text x="80" y="118" fill={B.text} fontSize="24" textAnchor="middle">{DEEP_DIVE[stationId]?.icon || '◆'}</text>
      <line x1="130" y1="110" x2="195" y2="110" stroke={B.accent} strokeWidth="3" strokeDasharray="8 5" opacity="0.7"/>
      <polygon points="192,104 202,110 192,116" fill={B.accent} opacity="0.7"/>
      <rect x="200" y="70" width="80" height="80" fill={B.panel} stroke={B.border} strokeWidth="1.5" rx="8"/>
      <text x="240" y="118" fill={B.accent} fontSize="9" fontFamily="monospace" textAnchor="middle">BECKEN</text>
      <text x="150" y="200" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle">{DEEP_DIVE[stationId]?.subtitle || stationId.toUpperCase()}</text>
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const WaterCycleView = () => {
  const { darkMode, playSound, showToast } = useApp();
  const [selectedStationId, setSelectedStationId] = useState(WATER_CYCLE_STATION_ORDER[0]);
  const [controls, setControls] = useState(WATER_CYCLE_DEFAULT_CONTROLS);
  const [xrayMode, setXrayMode] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [autoTour, setAutoTour] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState(WATER_CYCLE_MISSIONS[0].id);
  const [backwashProgress, setBackwashProgress] = useState(0);
  const [missionState, setMissionState] = useState(() =>
    Object.fromEntries(WATER_CYCLE_MISSIONS.map(m => [m.id, { status: 'idle', attempts: 0, solvedAt: null }]))
  );
  const [missionLog, setMissionLog] = useState([]);
  const [deepDiveStationId, setDeepDiveStationId] = useState(null);

  const stationMap = useMemo(() => new Map(WATER_CYCLE_STATIONS.map(s => [s.id, s])), []);
  const selectedStation = stationMap.get(selectedStationId) || WATER_CYCLE_STATIONS[0];
  const deepDiveStation = deepDiveStationId ? stationMap.get(deepDiveStationId) : null;
  const stationIndex = Math.max(0, WATER_CYCLE_STATION_ORDER.indexOf(selectedStation.id));
  const stationFocus = STATION_FOCUS[selectedStationId] || STATION_FOCUS.becken;
  const mission = WATER_CYCLE_MISSIONS.find(m => m.id === activeMissionId) || WATER_CYCLE_MISSIONS[0];
  const missionStatus = missionState[activeMissionId] || { status: 'idle', attempts: 0, solvedAt: null };
  const missionActive = missionStatus.status === 'active' && !missionStatus.solvedAt;
  const symptomFlags = missionActive ? new Set(mission?.symptom?.visualFlags || []) : new Set();

  const metrics = useMemo(() => {
    const valveFactor = (controls.rawValveOpen ? 1 : 0.56) * (controls.returnValveOpen ? 1 : 0.7);
    const pumpFactor = controls.pumpEnabled ? controls.pumpPower / 100 : 0;
    let flowRate = Math.round((85 + controls.pumpPower * 1.9) * valveFactor * pumpFactor);
    if (controls.backwashMode) flowRate = Math.round(flowRate * 0.64);
    if (symptomFlags.has('pumpBubbles') && !controls.ventValveOpen) flowRate = Math.round(flowRate * 0.58);
    const pressureBar = controls.pumpEnabled
      ? clamp(fixed(0.74 + flowRate / 150 + (controls.backwashMode ? 0.28 : 0), 2), 0.12, 2.95)
      : 0.12;
    const differentialPressure = clamp(
      fixed(0.23 + flowRate / 320 + (symptomFlags.has('filterTurbidity') ? 0.46 : 0) - backwashProgress / 220, 2),
      0.12, 1.7
    );
    let freeChlorine = 0.2 + (controls.disinfectPumpEnabled ? controls.disinfectSetpoint * 0.046 : -0.07);
    if (symptomFlags.has('lowChlorine')) freeChlorine -= 0.12;
    freeChlorine = clamp(fixed(freeChlorine, 2), 0.05, 1.15);
    const pH = clamp(fixed(7.2 + controls.phTrim * 0.03, 2), 6.5, 7.8);
    const temperature = clamp(
      fixed(25.5 + controls.heatExchangerPower * 0.08 - (controls.backwashMode ? 0.35 : 0), 1),
      23.8, 34
    );
    const surgeLevel = clamp(Math.round(44 + (controls.rawValveOpen ? 9 : -11) - flowRate / 17), 10, 95);
    return { flowRate, pressureBar, differentialPressure, freeChlorine, pH, temperature, surgeLevel };
  }, [controls, symptomFlags, backwashProgress]);

  const snapshot = useMemo(() => ({ controls, metrics: { ...metrics, backwashProgress } }), [controls, metrics, backwashProgress]);
  const flowDuration = clamp(5 - metrics.flowRate / 55, 0.8, 4.8).toFixed(2);
  const chlorInRange = metrics.freeChlorine >= 0.3 && metrics.freeChlorine <= 0.8;
  const dpInRange = metrics.differentialPressure <= 0.8;
  const temperatureInRange = metrics.temperature >= 26 && metrics.temperature <= 34;

  useEffect(() => {
    if (!autoTour) return undefined;
    const t = window.setInterval(() => {
      setSelectedStationId(prev => {
        const i = WATER_CYCLE_STATION_ORDER.indexOf(prev);
        return WATER_CYCLE_STATION_ORDER[(i + 1) % WATER_CYCLE_STATION_ORDER.length];
      });
    }, 3200);
    return () => window.clearInterval(t);
  }, [autoTour]);

  useEffect(() => {
    if (!(controls.backwashMode && controls.backwashValveOpen && controls.pumpEnabled)) return undefined;
    const t = window.setInterval(() => setBackwashProgress(p => clamp(p + 6, 0, 100)), 430);
    return () => window.clearInterval(t);
  }, [controls.backwashMode, controls.backwashValveOpen, controls.pumpEnabled]);

  useEffect(() => {
    if (controls.backwashMode || backwashProgress <= 0) return undefined;
    const t = window.setInterval(() => setBackwashProgress(p => clamp(p - 4, 0, 100)), 620);
    return () => window.clearInterval(t);
  }, [controls.backwashMode, backwashProgress]);

  useEffect(() => {
    if (!missionActive) return undefined;
    const sound = mission?.symptom?.audio === 'bubble' ? 'bubble' : 'wrong';
    playSound(sound);
    const t = window.setInterval(() => playSound(sound), 5200);
    return () => window.clearInterval(t);
  }, [missionActive, mission?.symptom?.audio, playSound]);

  useEffect(() => {
    if (!missionActive || !isMissionSolved(mission, snapshot)) return;
    const solvedAt = new Date().toISOString();
    setMissionState(prev => ({ ...prev, [activeMissionId]: { ...prev[activeMissionId], status: 'solved', solvedAt } }));
    setMissionLog(prev => [
      { id: `${activeMissionId}-${solvedAt}`, message: `${mission.title}: ${mission.successFeedback}`, createdAt: solvedAt },
      ...prev
    ]);
    showToast(mission.successFeedback, 'success', 3800);
    playSound('correct');
  }, [missionActive, mission, snapshot, activeMissionId, showToast, playSound]);

  const pipeStates = useMemo(() => WATER_CYCLE_PIPES.map(pipe => {
    const activeInMode = controls.backwashMode ? pipe.mode !== 'normal' || pipe.reversibleInBackwash : pipe.mode !== 'backwash';
    const reverse = controls.backwashMode && pipe.reversibleInBackwash;
    return { ...pipe, path: SCHEMATIC_PIPE_PATHS[pipe.id] || pipe.path, hasFlow: activeInMode && metrics.flowRate > 0, reverse, backwash: pipe.mode === 'backwash' || reverse };
  }), [controls.backwashMode, metrics.flowRate]);

  const setControlValue = (key, value) => setControls(prev => ({ ...prev, [key]: value }));
  const toggleControl = (key) => { setControlValue(key, !controls[key]); playSound('splash'); };
  const chooseStation = (id) => { setSelectedStationId(id); playSound('splash'); };

  const startMission = () => {
    setMissionState(prev => ({ ...prev, [activeMissionId]: { ...prev[activeMissionId], status: 'active', attempts: prev[activeMissionId].attempts + 1, solvedAt: null } }));
    setMissionLog(prev => [{ id: `${activeMissionId}-${Date.now()}-start`, message: `${mission.title} gestartet`, createdAt: new Date().toISOString() }, ...prev]);
    playSound('whistle');
  };
  const resetMission = () => {
    setMissionState(prev => ({ ...prev, [activeMissionId]: { ...prev[activeMissionId], status: 'idle', solvedAt: null } }));
    playSound('splash');
  };

  const dm = darkMode;
  const card = dm ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-cyan-100 text-slate-900';
  const inner = dm ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200';
  const innerDeep = dm ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-200';

  return (
    <div className="max-w-[1600px] mx-auto space-y-3">
      <style>{`
        @keyframes wcFlow { to { stroke-dashoffset: -120; } }
        @keyframes wcSpin { to { transform: rotate(360deg); } }
        @keyframes wcBubble { 0%{transform:translateY(0);opacity:.15} 55%{opacity:.95} 100%{transform:translateY(-18px);opacity:0} }
        @keyframes wcPulse { 0%{opacity:.85;transform:scale(.97)} 100%{opacity:0;transform:scale(1.08)} }
        @keyframes wcSurface { to { stroke-dashoffset: -80; } }
        .wc-flow { stroke-dasharray: 16 12; animation: wcFlow linear infinite; }
        .wc-flow-reverse { animation-direction: reverse; }
        .wc-impeller { transform-origin: center; animation: wcSpin 1.05s linear infinite; }
        .wc-bubble { animation: wcBubble 1.2s ease-in infinite; }
        .wc-pulse { transform-origin: center; animation: wcPulse 1.4s ease-out infinite; }
        .wc-surface { stroke-dasharray: 8 10; animation: wcSurface 1.4s linear infinite; }
        .wc-station:hover rect, .wc-station:hover circle, .wc-station:hover ellipse { opacity: 0.9; }
      `}</style>

      {/* ── Header ── */}
      <div className={`rounded-2xl border px-5 py-3 flex flex-wrap items-center justify-between gap-3 ${card}`}>
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-500 font-mono">Lernmodul · Technikraum · DIN 19643</p>
          <h2 className="text-2xl font-black mt-0.5">Wasserkreislauf Simulation</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setAutoTour(p => !p)} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold ${autoTour ? 'bg-cyan-500 text-white' : (dm ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}>
            <Play size={14}/>{autoTour ? 'Tour stop' : 'Auto-Tour'}
          </button>
          <button onClick={() => setXrayMode(p => !p)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${xrayMode ? 'bg-violet-500 text-white' : (dm ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}>
            {xrayMode ? 'Röntgen an' : 'Röntgen aus'}
          </button>
          <button onClick={() => setShowCheatSheet(p => !p)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${showCheatSheet ? 'bg-emerald-500 text-white' : (dm ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}>
            Spickzettel
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1.95fr)_minmax(360px,1fr)] gap-3">
        {/* ── Left column ── */}
        <div className="space-y-3">
          {/* Main blueprint SVG */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid #1a3a5a' }}>
            <div className="overflow-x-auto" style={{ background: '#040d1a' }}>
              <svg className="min-w-[980px] w-full" viewBox={`0 0 ${WATER_CYCLE_VIEWBOX.width} ${WATER_CYCLE_VIEWBOX.height}`} style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="wcBlueBg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#040d1a"/>
                    <stop offset="100%" stopColor="#060f22"/>
                  </linearGradient>
                  <linearGradient id="wcWaterFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a6090" stopOpacity="0.75"/>
                    <stop offset="100%" stopColor="#0a3060" stopOpacity="0.9"/>
                  </linearGradient>
                  <linearGradient id="wcFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38b0ff"/>
                    <stop offset="100%" stopColor="#60c8ff"/>
                  </linearGradient>
                  <linearGradient id="wcBackwash" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09030"/>
                    <stop offset="100%" stopColor="#f0b030"/>
                  </linearGradient>
                  <filter id="wcGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <pattern id="wcGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0e2840" strokeWidth="0.6"/>
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#wcBlueBg)"/>
                <rect width="100%" height="100%" fill="url(#wcGrid)" opacity="0.9"/>
                <text x="40" y="44" fill="#3a6080" fontSize="10" fontFamily="monospace" letterSpacing="2">BECKENWASSERAUFBEREITUNG · HYDRAULIK-SCHAUBILD · DIN 19643</text>

                {/* Focus ring */}
                <g pointerEvents="none">
                  <circle cx={stationFocus.x} cy={stationFocus.y} r={stationFocus.r} fill="none" stroke="#4a9eff" strokeWidth="10" opacity="0.07"/>
                  <circle cx={stationFocus.x} cy={stationFocus.y} r={stationFocus.r} fill="none" stroke="#4a9eff" strokeWidth="2" className="wc-pulse" opacity="0.55"/>
                </g>

                {/* Pipes */}
                {pipeStates.map(pipe => (
                  <g key={pipe.id}>
                    <path d={pipe.path} fill="none" stroke="#0d2540" strokeWidth="22" strokeLinecap="round"/>
                    <path d={pipe.path} fill="none" stroke="#162f50" strokeWidth="16" strokeLinecap="round"/>
                    {pipe.hasFlow && (
                      <path d={pipe.path} fill="none"
                        stroke={pipe.backwash ? 'url(#wcBackwash)' : 'url(#wcFlow)'}
                        strokeWidth="8" strokeLinecap="round"
                        className={`wc-flow${pipe.reverse ? ' wc-flow-reverse' : ''}`}
                        style={{ animationDuration: `${flowDuration}s` }}
                        filter="url(#wcGlow)"/>
                    )}
                  </g>
                ))}

                {/* ── BECKEN ── */}
                <g className="wc-station" onClick={() => chooseStation('becken')} style={{ cursor: 'pointer' }}>
                  <rect x="62" y="78" width="294" height="148" rx="6" fill="#080f1e" stroke={selectedStationId === 'becken' ? '#4a9eff' : '#1a3a5a'} strokeWidth="2"/>
                  <rect x="72" y="118" width="274" height="100" rx="4" fill="url(#wcWaterFill)"/>
                  <path d="M72 126 Q110 114 154 126 Q198 138 238 120 Q266 110 346 122" fill="none" stroke="#4ab0ff" strokeWidth="1.8" className="wc-surface" opacity="0.75"/>
                  {[148, 214, 280].map(x => (
                    <rect key={x} x={x - 10} y="210" width="20" height="8" rx="2" fill="#4a9eff" fillOpacity="0.3" stroke="#4a9eff" strokeWidth="0.8"/>
                  ))}
                  <rect x="356" y="95" width="14" height="84" rx="4" fill="#080f1e" stroke="#1a3a5a" strokeWidth="1.5"/>
                  <rect x="358" y="108" width="10" height="60" rx="2" fill="#1060a0" fillOpacity="0.35"/>
                  <text x="78" y="100" fill="#5a8090" fontSize="9" fontFamily="monospace" letterSpacing="1.5">SCHWIMMBECKEN</text>
                  <text x="78" y="113" fill="#2a4060" fontSize="7" fontFamily="monospace">QUERSCHNITT · BODENEINSTRÖMUNG</text>
                  <text x="372" y="92" fill="#2a4060" fontSize="7" fontFamily="monospace" transform="rotate(90,372,92)">ÜBERLAUFRINNE</text>
                </g>

                {/* ── ÜBERLAUF click zone ── */}
                <g onClick={() => chooseStation('ueberlauf')} style={{ cursor: 'pointer' }}>
                  <rect x="418" y="120" width="18" height="62" rx="4" fill="#080f1e" stroke={selectedStationId === 'ueberlauf' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                </g>

                {/* ── SCHWALL ── */}
                <g className="wc-station" onClick={() => chooseStation('schwall')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="529" cy="98" rx="60" ry="14" fill="#080f1e" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="469" y="96" width="120" height="114" fill="#080f1e" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <ellipse cx="529" cy="210" rx="60" ry="14" fill="#080f1e" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="471" y={98 + (108 - metrics.surgeLevel * 1.08)} width="116" height={metrics.surgeLevel * 1.08} rx="2" fill="#1060a0" fillOpacity="0.4"/>
                  <rect x="582" y="98" width="6" height="108" fill="#0e2540" rx="2"/>
                  <rect x="582" y={98 + (108 - metrics.surgeLevel * 1.08)} width="6" height={metrics.surgeLevel * 1.08} fill="#4a9eff" fillOpacity="0.7" rx="2"/>
                  <text x="529" y="83" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">SCHWALLWASSER</text>
                  <text x="529" y="170" fill="#4a9eff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{metrics.surgeLevel}%</text>
                </g>

                {/* ── PUMPE ── */}
                <g className="wc-station" onClick={() => chooseStation('pumpe')} style={{ cursor: 'pointer' }}>
                  <circle cx="530" cy="330" r="48" fill="#080f1e" stroke={selectedStationId === 'pumpe' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <path d="M530 330 Q564 304 570 330 Q576 360 552 378 Q528 396 504 374 Q476 350 484 318 Q492 288 524 283 Q558 278 572 308"
                    fill="none" stroke="#142840" strokeWidth="8" strokeLinecap="round"/>
                  <g className={controls.pumpEnabled ? 'wc-impeller' : ''} style={{ transformOrigin: '530px 330px' }}>
                    {[0, 60, 120, 180, 240, 300].map(deg => {
                      const r = (deg * Math.PI) / 180;
                      return <line key={deg} x1="530" y1="330" x2={530 + 34 * Math.cos(r)} y2={330 + 34 * Math.sin(r)} stroke="#4a9eff" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>;
                    })}
                    <circle cx="530" cy="330" r="9" fill="#080f1e" stroke="#4a9eff" strokeWidth="1.5"/>
                  </g>
                  <rect x="506" y="378" width="48" height="22" fill="#080f1e" stroke="#1a3a5a" strokeWidth="1.2" rx="4"/>
                  {symptomFlags.has('pumpBubbles') && (<>
                    <circle cx="504" cy="308" r="3.5" fill="#60c0ff" className="wc-bubble"/>
                    <circle cx="516" cy="320" r="2.5" fill="#40b0ff" className="wc-bubble" style={{ animationDelay: '0.3s' }}/>
                  </>)}
                  <text x="530" y="266" fill="#5a8090" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="1">UMWÄLZPUMPE</text>
                  <text x="530" y="278" fill={controls.pumpEnabled ? '#34c090' : '#d04040'} fontSize="7.5" fontFamily="monospace" textAnchor="middle">{controls.pumpEnabled ? '● BETRIEB' : '○ AUS'}</text>
                </g>

                {/* ── FLOCKUNG ── */}
                <g className="wc-station" onClick={() => chooseStation('flockung')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="688" cy="295" rx="36" ry="10" fill="#080f1e" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="652" y="293" width="72" height="76" fill="#080f1e" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <path d="M652 369 L688 392 L724 369 Z" fill="#080f1e" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="726" y="308" width="24" height="58" rx="4" fill="#080f1e" stroke="#1a3a5a" strokeWidth="1.5"/>
                  <rect x="728" y="325" width="20" height="36" fill="#4a9eff" fillOpacity="0.12" rx="2"/>
                  {[668, 682, 696, 710, 676, 704].map((x, i) => (
                    <circle key={i} cx={x} cy={320 + (i % 3) * 12} r={1.5} fill="#6ab0d0" opacity="0.45">
                      <animate attributeName="cy" values={`${320 + (i % 3) * 12};${316 + (i % 3) * 12};${320 + (i % 3) * 12}`} dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite"/>
                    </circle>
                  ))}
                  <text x="688" y="282" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">FLOCKUNG</text>
                  <text x="738" y="305" fill="#2a4060" fontSize="6.5" fontFamily="monospace">FLM</text>
                </g>

                {/* ── FILTER ── */}
                <g className="wc-station" onClick={() => chooseStation('filter')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="854" cy="248" rx="36" ry="13" fill="#080f1e" stroke={selectedStationId === 'filter' ? '#4a9eff' : (symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a')} strokeWidth="1.5"/>
                  <rect x="818" y="246" width="72" height="168" fill="#080f1e" stroke={selectedStationId === 'filter' ? '#4a9eff' : (symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a')} strokeWidth="1.5"/>
                  <rect x="820" y="262" width="68" height="46" fill="#2a4030" fillOpacity={xrayMode ? 0.85 : 0.4}/>
                  <rect x="820" y="308" width="68" height="54" fill="#38481a" fillOpacity={xrayMode ? 0.85 : 0.4}/>
                  <rect x="820" y="362" width="68" height="44" fill="#1a2838" fillOpacity={xrayMode ? 0.85 : 0.4}/>
                  {xrayMode && <>
                    <text x="854" y="288" fill="#60c090" fontSize="6.5" fontFamily="monospace" textAnchor="middle">QUARZKIES</text>
                    <text x="854" y="338" fill="#90c060" fontSize="6.5" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                    <text x="854" y="386" fill="#6080a0" fontSize="6.5" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                  </>}
                  <ellipse cx="854" cy="414" rx="36" ry="13" fill="#080f1e" stroke={selectedStationId === 'filter' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <circle cx="906" cy="312" r="16" fill={metrics.differentialPressure > 0.5 ? '#3a0808' : '#081808'} stroke={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} strokeWidth="1.5"/>
                  <text x="906" y="316" fill={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">dP</text>
                  <text x="854" y="236" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">FILTER</text>
                  {symptomFlags.has('filterTurbidity') && <text x="854" y="434" fill="#d04040" fontSize="7" fontFamily="monospace" textAnchor="middle">⚠ TRÜBUNG</text>}
                </g>

                {/* ── DESINFEKTION ── */}
                <g className="wc-station" onClick={() => chooseStation('desinfektion')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="1020" cy="248" rx="26" ry="8" fill="#080f1e" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="994" y="246" width="52" height="92" fill="#080f1e" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="997" y="260" width="46" height="70" fill="#001080" fillOpacity="0.2" rx="2"/>
                  <text x="1020" y="300" fill="#4a8ad0" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NaOCl</text>
                  <ellipse cx="1070" cy="260" rx="20" ry="7" fill="#080f1e" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="1050" y="258" width="40" height="80" fill="#080f1e" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="1053" y="272" width="34" height="58" fill="#400010" fillOpacity="0.2" rx="2"/>
                  <text x="1070" y="306" fill="#c09040" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CO₂</text>
                  <circle cx="1025" cy="348" r="5" fill={chlorInRange ? '#102a10' : '#3a1010'} stroke={chlorInRange ? '#34c090' : '#d04040'} strokeWidth="1.5">
                    <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  {symptomFlags.has('lowChlorine') && <path d="M1096 228 L1084 208 L1108 208 Z" fill="#d09030"/>}
                  <text x="1044" y="234" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">DESINFEKTION</text>
                  <text x="1025" y="366" fill={chlorInRange ? '#34c090' : '#d04040'} fontSize="8" fontFamily="monospace" textAnchor="middle">{metrics.freeChlorine} mg/L Cl₂</text>
                </g>

                {/* ── HEIZUNG ── */}
                <g className="wc-station" onClick={() => chooseStation('heizung')} style={{ cursor: 'pointer' }}>
                  <rect x="986" y="108" width="108" height="56" rx="6" fill="#080f1e" stroke={selectedStationId === 'heizung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  {[118, 129, 140, 151, 157].map((y, i) => (
                    <line key={y} x1="996" y1={y} x2="1084" y2={y} stroke={i % 2 === 0 ? '#601010' : '#104060'} strokeWidth="3" opacity="0.5"/>
                  ))}
                  <text x="1040" y="98" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">WÄRMETAUSCHER</text>
                  <text x="1040" y="178" fill={temperatureInRange ? '#34c090' : '#d09030'} fontSize="8" fontFamily="monospace" textAnchor="middle">{metrics.temperature} °C</text>
                </g>

                {/* ── RÜCKLAUF ── */}
                <g className="wc-station" onClick={() => chooseStation('ruecklauf')} style={{ cursor: 'pointer' }}>
                  <rect x="756" y="84" width="84" height="48" rx="6" fill="#080f1e" stroke={selectedStationId === 'ruecklauf' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <circle cx="798" cy="108" r="14" fill="#040d1a" stroke="#1a3a5a" strokeWidth="1"/>
                  <line x1="786" y1="108" x2="810" y2="108" stroke="#4a9eff" strokeWidth="1.5" opacity="0.6"/>
                  <polygon points="805,104 811,108 805,112" fill="#4a9eff" opacity="0.7"/>
                  <text x="798" y="72" fill="#5a8090" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">RÜCKLAUF</text>
                </g>

                {/* Kanal/Abwurf */}
                <rect x="1002" y="544" width="130" height="36" rx="5" fill="#080f1e" stroke="#1a3a5a" strokeWidth="1.2"/>
                <text x="1067" y="566" fill="#2a4060" fontSize="8" fontFamily="monospace" textAnchor="middle">KANAL / ABWURF</text>

                {/* Valve toggles */}
                {[
                  { key: 'rawValveOpen',      x: 530, y: 258, label: 'V1' },
                  { key: 'returnValveOpen',    x: 612, y: 148, label: 'V2' },
                  { key: 'ventValveOpen',      x: 558, y: 303, label: 'V3' },
                  { key: 'backwashValveOpen',  x: 840, y: 468, label: 'V4' },
                ].map(v => (
                  <g key={v.key} onClick={e => { e.stopPropagation(); toggleControl(v.key); }} style={{ cursor: 'pointer' }}>
                    <circle cx={v.x} cy={v.y} r="13" fill={controls[v.key] ? '#0c2e0c' : '#2e0c0c'} stroke={controls[v.key] ? '#34c090' : '#d04040'} strokeWidth="2"/>
                    <text x={v.x} y={v.y + 4} fill={controls[v.key] ? '#34c090' : '#d04040'} fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{v.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Metrics dashboard */}
          <div className={`rounded-2xl border p-3 ${card}`}>
            <h3 className="font-black flex items-center gap-2 text-sm mb-2"><Gauge size={15}/>Technik-Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className={`rounded-lg p-2 bg-cyan-500/10`}><span className="font-bold">Q</span> {metrics.flowRate} m³/h</div>
              <div className="rounded-lg p-2 bg-blue-500/10"><span className="font-bold">P</span> {metrics.pressureBar} bar</div>
              <div className={`rounded-lg p-2 ${chlorInRange ? 'bg-emerald-500/10' : 'bg-red-500/20'}`}><span className="font-bold">Cl</span> {metrics.freeChlorine} mg/L</div>
              <div className="rounded-lg p-2 bg-violet-500/10"><span className="font-bold">pH</span> {metrics.pH}</div>
              <div className="rounded-lg p-2 bg-orange-500/10"><span className="font-bold">T</span> {metrics.temperature} °C</div>
              <div className={`rounded-lg p-2 ${dpInRange ? 'bg-amber-500/10' : 'bg-red-500/20'}`}><span className="font-bold">dP</span> {metrics.differentialPressure} bar</div>
              <div className="rounded-lg p-2 bg-slate-500/20"><span className="font-bold">Schwall</span> {metrics.surgeLevel}%</div>
              <div className="rounded-lg p-2 bg-amber-500/10"><span className="font-bold">Rückspül</span> {Math.round(backwashProgress)}%</div>
            </div>
            <div className="grid md:grid-cols-2 gap-2 mt-2 text-xs">
              <label className={`rounded-lg p-2 ${inner}`}>
                Pumpenleistung {controls.pumpPower}%
                <input type="range" min="20" max="100" value={controls.pumpPower} onChange={e => setControlValue('pumpPower', Number(e.target.value))} className="w-full accent-cyan-500 mt-1"/>
              </label>
              <label className={`rounded-lg p-2 ${inner}`}>
                Cl-Sollwert {controls.disinfectSetpoint}
                <input type="range" min="1" max="12" value={controls.disinfectSetpoint} onChange={e => setControlValue('disinfectSetpoint', Number(e.target.value))} className="w-full accent-emerald-500 mt-1"/>
              </label>
              <label className={`rounded-lg p-2 ${inner}`}>
                pH Trim {controls.phTrim}
                <input type="range" min="-10" max="10" value={controls.phTrim} onChange={e => setControlValue('phTrim', Number(e.target.value))} className="w-full accent-violet-500 mt-1"/>
              </label>
              <label className={`rounded-lg p-2 ${inner}`}>
                Heizleistung {controls.heatExchangerPower}%
                <input type="range" min="0" max="100" value={controls.heatExchangerPower} onChange={e => setControlValue('heatExchangerPower', Number(e.target.value))} className="w-full accent-orange-500 mt-1"/>
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => toggleControl('pumpEnabled')} className={`px-2.5 py-1 rounded text-xs font-bold ${controls.pumpEnabled ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {controls.pumpEnabled ? 'Pumpe ein' : 'Pumpe aus'}
              </button>
              <button onClick={() => { setControlValue('backwashMode', !controls.backwashMode); if (!controls.backwashMode) setBackwashProgress(0); playSound('splash'); }}
                className={`px-2.5 py-1 rounded text-xs font-bold ${controls.backwashMode ? 'bg-amber-500 text-white' : (dm ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700')}`}>
                {controls.backwashMode ? 'Rückspülung aktiv' : 'Rückspülung aus'}
              </button>
              <button onClick={() => toggleControl('disinfectPumpEnabled')} className={`px-2.5 py-1 rounded text-xs font-bold ${controls.disinfectPumpEnabled ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {controls.disinfectPumpEnabled ? 'Dosierpumpe ein' : 'Dosierpumpe aus'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <aside className={`rounded-2xl border p-4 shadow-xl space-y-3 ${card}`}>
          {/* Station info */}
          <div className={`rounded-xl border p-3 ${inner}`}>
            <p className={`text-xs uppercase tracking-widest ${dm ? 'text-cyan-300' : 'text-cyan-700'}`}>
              Station {stationIndex + 1}/{WATER_CYCLE_STATION_ORDER.length}
            </p>
            <h3 className="text-xl font-black mt-1">{selectedStation.title}</h3>
            <p className={`text-sm mt-1 ${dm ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStation.summary}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {WATER_CYCLE_STATION_ORDER.map(id => (
                <button key={id} onClick={() => chooseStation(id)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${id === selectedStationId ? 'bg-cyan-500 text-white' : (dm ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')}`}>
                  {stationMap.get(id)?.shortLabel}
                </button>
              ))}
            </div>
            <button onClick={() => setDeepDiveStationId(selectedStation.id)}
              className="mt-2 w-full rounded-xl py-2 text-sm font-bold bg-cyan-500 hover:bg-cyan-600 text-white transition-colors">
              🔬 Deep Dive öffnen
            </button>
            <div className="mt-3 space-y-2">
              {[
                { title: 'Kernfunktion', items: selectedStation.functionPoints },
                { title: 'Sollwerte', items: selectedStation.targetValues?.map(v => `${v.label}: ${v.value}`) },
                { title: 'Warnsignale', items: selectedStation.faultSignals },
              ].map(s => (
                <details key={s.title} className={`rounded-lg border p-2 ${innerDeep}`}>
                  <summary className="text-xs font-semibold cursor-pointer">{s.title}</summary>
                  <ul className="mt-1 space-y-1 text-xs">
                    {(s.items || []).map((item, i) => <li key={i}>- {item}</li>)}
                  </ul>
                </details>
              ))}
            </div>
          </div>

          {/* Mission */}
          <div className={`rounded-xl border p-3 ${inner}`}>
            <h3 className="font-black flex items-center gap-2 text-sm"><ListChecks size={15}/>Missions-Logbuch</h3>
            <select value={activeMissionId} onChange={e => setActiveMissionId(e.target.value)}
              className={`mt-2 w-full rounded-lg border px-2 py-2 text-sm ${dm ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`}>
              {WATER_CYCLE_MISSIONS.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={`rounded-full px-2 py-0.5 font-semibold ${dm ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-700'}`}>{mission.level}</span>
              <span className={dm ? 'text-slate-400' : 'text-slate-500'}>Versuche: {missionStatus.attempts}</span>
            </div>
            <p className={`text-sm mt-2 ${dm ? 'text-slate-200' : 'text-slate-700'}`}>
              <span className="font-semibold">{mission.symptom.title}:</span> {mission.symptom.description}
            </p>
            <p className="text-xs mt-1"><span className="font-semibold">Ziel:</span> {mission.targetAction}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={startMission} className="flex-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold py-2">Mission starten</button>
              <button onClick={resetMission} className={`rounded-lg px-3 text-sm font-bold ${dm ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'}`}>Reset</button>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              {(mission.solveWhen?.all || []).map(condition => {
                const ok = isConditionOk(condition, snapshot);
                return (
                  <p key={`${mission.id}-${condition.key}-${condition.min ?? condition.max ?? String(condition.equals)}`}
                    className={`flex items-center gap-1.5 ${ok ? 'text-emerald-400' : (dm ? 'text-slate-300' : 'text-slate-600')}`}>
                    {ok ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                    {ok ? 'OK' : 'Offen'} — {formatCondition(condition)}
                  </p>
                );
              })}
            </div>
            <div className="mt-2 space-y-1 text-xs max-h-28 overflow-y-auto">
              {missionLog.length === 0 && <p className={dm ? 'text-slate-400' : 'text-slate-500'}>Noch keine Einträge.</p>}
              {missionLog.map(entry => (
                <div key={entry.id} className={`rounded p-2 ${dm ? 'bg-slate-900' : 'bg-white'}`}>
                  {entry.message}
                  <div className={dm ? 'text-slate-500' : 'text-slate-400'}>{formatLogTime(entry.createdAt)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cheat sheet */}
          {showCheatSheet && (
            <div className={`rounded-xl border p-3 ${inner}`}>
              <h3 className="font-black flex items-center gap-2 text-sm"><ShieldCheck size={15}/>Profi-Spickzettel</h3>
              <div className="mt-2 text-sm space-y-2">
                {WATER_CYCLE_PROFI_SPICKZETTEL.map(block => (
                  <div key={block.title}>
                    <p className="font-semibold">{block.title}</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      {block.items.map(item => <li key={item}>- {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plant status */}
          <div className={`rounded-xl border p-3 ${inner}`}>
            <h3 className="font-black text-sm mb-2">Anlagenstatus</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { icon: <Activity size={12}/>, color: missionActive ? 'text-amber-400' : 'text-emerald-400', label: missionActive ? 'Störung aktiv' : 'Anlage stabil' },
                { icon: <Droplets size={12}/>, color: chlorInRange ? 'text-emerald-400' : 'text-red-400', label: `Chlorreserve ${chlorInRange ? 'im Soll' : 'unter Soll'}` },
                { icon: <Thermometer size={12}/>, color: temperatureInRange ? 'text-emerald-400' : 'text-amber-400', label: `Temperatur ${temperatureInRange ? 'stabil' : 'abweichend'}` },
                { icon: <Gauge size={12}/>, color: dpInRange ? 'text-emerald-400' : 'text-red-400', label: `Filterdruck ${dpInRange ? 'normal' : 'kritisch'}` },
                { icon: <Wrench size={12}/>, color: controls.backwashMode ? 'text-amber-400' : 'text-slate-400', label: `Rückspülung ${controls.backwashMode ? 'aktiv' : 'aus'}` },
                { icon: <SlidersHorizontal size={12}/>, color: missionActive ? 'text-amber-400' : 'text-emerald-400', label: `Mission ${missionStatus.status === 'solved' ? 'gelöst' : missionStatus.status === 'active' ? 'läuft' : 'bereit'}` },
              ].map((s, i) => (
                <p key={i} className={`flex items-center gap-2 ${s.color}`}>{s.icon}{s.label}</p>
              ))}
              {!chlorInRange && <p className="flex items-center gap-2 text-red-400"><AlertTriangle size={12}/>Grenzwert alarmiert</p>}
            </div>
          </div>

          {/* Future modules */}
          <div className={`rounded-xl border p-3 ${inner}`}>
            <h3 className="font-black text-sm mb-2">Nächste Module</h3>
            <div className="space-y-1.5 text-sm">
              {WATER_CYCLE_FUTURE_MODULES.map(m => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-dashed border-slate-400/40 px-2 py-1.5">
                  <span>{m.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20">{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Deep Dive Modal ── */}
      {deepDiveStation && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={() => setDeepDiveStationId(null)}>
          <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#040d1a', border: '1px solid #1a3a5a', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #1a3a5a' }}>
              <div>
                <p className="text-xs font-mono tracking-widest" style={{ color: '#4a9eff' }}>DEEP DIVE · KOMPONENTENANALYSE</p>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {DEEP_DIVE[deepDiveStation.id]?.icon} {deepDiveStation.title}
                </h3>
                <p className="text-xs font-mono mt-0.5" style={{ color: '#456080' }}>{DEEP_DIVE[deepDiveStation.id]?.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setXrayMode(p => !p)}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold"
                  style={{ background: xrayMode ? '#3a1080' : '#0a1a2e', color: xrayMode ? '#c090ff' : '#7ab0d0', border: '1px solid #1a3a5a' }}>
                  {xrayMode ? 'Röntgen an' : 'Röntgen aus'}
                </button>
                <button onClick={() => setDeepDiveStationId(null)}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold"
                  style={{ background: '#0a1a2e', color: '#7ab0d0', border: '1px solid #1a3a5a' }}>
                  ✕ Schließen
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="grid lg:grid-cols-[1.1fr_1fr] overflow-auto flex-1" style={{ minHeight: 0 }}>
              {/* SVG illustration */}
              <div className="p-5 flex items-center justify-center" style={{ borderRight: '1px solid #1a3a5a', background: '#030c18' }}>
                <div style={{ width: '100%', maxWidth: 320 }}>
                  <DeepDiveSVG stationId={deepDiveStation.id} metrics={metrics} controls={controls} xrayMode={xrayMode}/>
                </div>
              </div>

              {/* Learning content */}
              <div className="p-5 space-y-3 overflow-y-auto">
                {/* Kenndaten */}
                <div className="rounded-xl p-3" style={{ background: '#0a1a2e', border: '1px solid #1a3a5a' }}>
                  <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>KENNDATEN</p>
                  {DEEP_DIVE[deepDiveStation.id]?.kenndaten.map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm py-1.5" style={{ borderBottom: '1px solid #0e2540' }}>
                      <span style={{ color: '#456080' }}>{label}</span>
                      <span className="font-mono text-right ml-2" style={{ color: '#c0d8f0' }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Lernpunkte */}
                <div className="rounded-xl p-3" style={{ background: '#0a1a2e', border: '1px solid #1a3a5a' }}>
                  <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>LERNPUNKTE</p>
                  <ul className="space-y-2">
                    {DEEP_DIVE[deepDiveStation.id]?.lernpunkte.map((point, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span style={{ color: '#4a9eff', flexShrink: 0 }}>▸</span>
                        <span style={{ color: '#b0c8e0' }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prüfungsfrage */}
                <div className="rounded-xl p-3" style={{ background: '#0a2038', border: '1px solid #1a5060' }}>
                  <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>PRÜFUNGSFRAGE</p>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#c0d8f0' }}>
                    {DEEP_DIVE[deepDiveStation.id]?.pruefungsfrage}
                  </p>
                  <details>
                    <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>▶ Antwort einblenden</summary>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                      {DEEP_DIVE[deepDiveStation.id]?.pruefungsantwort}
                    </p>
                  </details>
                </div>

                {/* Live metrics for this station */}
                <div className="rounded-xl p-3" style={{ background: '#0a1a2e', border: '1px solid #1a3a5a' }}>
                  <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>LIVE-MESSWERTE</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: 'Volumenstrom', value: `${metrics.flowRate} m³/h`, ok: metrics.flowRate > 0 },
                      { label: 'Freies Chlor', value: `${metrics.freeChlorine} mg/L`, ok: chlorInRange },
                      { label: 'Diff.-Druck', value: `${metrics.differentialPressure} bar`, ok: dpInRange },
                      { label: 'Temperatur', value: `${metrics.temperature} °C`, ok: temperatureInRange },
                    ].map(m => (
                      <div key={m.label} className="rounded-lg p-2" style={{ background: '#040d1a', border: `1px solid ${m.ok ? '#1a4030' : '#4a1a1a'}` }}>
                        <div style={{ color: '#456080' }}>{m.label}</div>
                        <div className="font-mono font-bold" style={{ color: m.ok ? '#34c090' : '#d04040' }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterCycleView;
