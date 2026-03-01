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

const STATION_FOCUS_VERTICAL = {
  becken:       { x: 157,  y: 285, r: 155 },
  ueberlauf:    { x: 320,  y: 118, r: 42  },
  schwall:      { x: 500,  y: 195, r: 100 },
  pumpe:        { x: 500,  y: 375, r: 70  },
  flockung:     { x: 680,  y: 272, r: 55  },
  filter:       { x: 825,  y: 313, r: 105 },
  desinfektion: { x: 890,  y: 572, r: 65  },
  heizung:      { x: 829,  y: 627, r: 62  },
  ruecklauf:    { x: 390,  y: 668, r: 52  },
};

const PIPE_PATHS_VERTICAL = {
  'becken-ueberlauf':     'M 290 118 L 350 118',
  'ueberlauf-schwall':    'M 350 118 L 435 118',
  'schwall-pumpe':        'M 500 296 L 500 320',
  'pumpe-flockung':       'M 555 375 L 635 375 L 635 100',
  'flockung-filter':      'M 635 100 L 760 100',
  'filter-desinfektion':  'M 825 531 L 825 570',
  'desinfektion-heizung': 'M 825 570 L 825 592',
  'heizung-ruecklauf':    'M 755 627 L 400 627 L 400 680',
  'ruecklauf-becken':     'M 340 680 L 155 680 L 155 525',
  'filter-kanal':         'M 888 450 L 980 450 L 980 660',
};

const PIPE_PATHS_MOBILE_VERTICAL = {
  'becken-ueberlauf':     'M 274 54 L 284 54',
  'ueberlauf-schwall':    'M 284 54 L 356 54 L 356 115',
  'schwall-pumpe':        'M 356 222 L 356 258',
  'pumpe-flockung':       'M 356 326 L 356 348',
  'flockung-filter':      'M 356 408 L 356 422',
  'filter-desinfektion':  'M 320 603 L 20 603',
  'desinfektion-heizung': 'M 20 467 L 20 442',
  'heizung-ruecklauf':    'M 20 370 L 20 298',
  'ruecklauf-becken':     'M 20 270 L 20 97',
  'filter-kanal':         'M 392 616 L 415 616 L 415 755',
};

const PIPE_PATHS_HORIZONTAL = {
  'becken-ueberlauf':     'M 290 118 L 350 118',
  'ueberlauf-schwall':    'M 350 118 L 435 118',
  'schwall-pumpe':        'M 500 296 L 500 320',
  'pumpe-flockung':       'M 555 375 L 635 375 L 635 100',
  'flockung-filter':      'M 635 100 L 635 330 L 645 330',
  'filter-desinfektion':  'M 1025 330 L 1080 330 L 1080 572 L 825 572',
  'desinfektion-heizung': 'M 825 572 L 825 592',
  'heizung-ruecklauf':    'M 755 627 L 400 627 L 400 680',
  'ruecklauf-becken':     'M 340 680 L 155 680 L 155 525',
  'filter-kanal':         'M 900 380 L 980 380 L 980 660',
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
    icon: '🏊‍♂️', subtitle: 'Schwimmbecken · 3D-Interaktiv · DIN 19643',
    kenndaten: [
      { label: 'Turnover Schwimmer', value: 'max. 12 h (DIN 19643)' },
      { label: 'Turnover Lehrbecken', value: 'max. 4 h (DIN 19643)' },
      { label: 'Beckentiefe (Norm)', value: '≥ 1,80 m (DIN 18032)' },
      { label: 'Vertikaldurchströmung', value: 'Bodeneinströmung ↑ → Überlauf oben' },
      { label: 'Horizontaldurchströmung', value: 'Wandeinströmung → Querstrom → Ablauf' },
      { label: 'Bahnbreite 50m-Bahn', value: '2,5 m (FINA-Regeln)' },
    ],
    lernpunkte: [
      'Vertikaldurchströmung (Standard): Einströmdüsen im Boden → Wasser steigt gleichmäßig auf → Überlaufrinne oben → wenig Totzonen, hygienisch optimal',
      'Horizontaldurchströmung: Düsen in Seitenwand → Wasser strömt quer durch das Becken → Ablauf an Gegenseite → günstig für schmale/lange Becken',
      'Überlaufrinne nimmt das Oberflächenwasser ab (höchste Verunreinigung!)',
      'Turnover = Beckenvolumen [m³] ÷ Volumenstrom [m³/h] – je kleiner, desto besser',
      'Totzonen entstehen bei schlechter Düsenplatzierung → Keimgefahr, schlechte Chlorverteilung',
      'Restentleerung am tiefsten Punkt (Bodengefälle 1–2 % zum Ablauf), Entsorgung: Kanal',
      'Wendewandfliesen: Rutschhemmung R9, T-Markierung 2 m vor Wand, 1 m lang',
    ],
    pruefungsfrage: 'Wie wird die Turnover-Zeit berechnet und was ist der Grenzwert?',
    pruefungsantwort: 'Turnover [h] = Beckenvolumen [m³] ÷ Volumenstrom [m³/h]. Grenzwert: max. 12 h für Schwimmer-, max. 4 h für Lehr-/Kinderbecken (DIN 19643). Kleiner Turnover = häufigere Aufbereitung = besser.',
  },
  ueberlauf: {
    icon: '↩️', subtitle: 'Überlaufrinne · Rinnensysteme · DIN 19643',
    kenndaten: [
      { label: 'Funktion', value: 'Oberflächenwasser kontinuierlich abführen' },
      { label: 'Belastung', value: 'Höchste Verunreinigung (Öle, Schweiß, Cremes)' },
      { label: 'Lotrechte Beckenbegrenzung', value: 'Wiesbadener Rinne (2 Varianten)' },
      { label: 'Eingetauchte Beckenbegrenzung', value: 'St.-Moritz · Züricher · Finnische Rinne' },
      { label: 'Skimmer nur für', value: 'Kleinstbecken ≤ 60 m³' },
      { label: 'Norm', value: 'DIN 19643 / DIN EN 13451-2' },
    ],
    lernpunkte: [
      '📐 Lotrechte Beckenbegrenzung: Beckenwand endet senkrecht am Wasserspiegel',
      '① Tieflegende offene Wiesbadener Rinne: breite, tief liegende Rinne am Beckenrand – klassischer Hallenbad-Standard',
      '② Wiesbadener Rinne (Beckenumgangshöhe): Rinne auf Höhe des Umgangs, begehbar – typisch für Sportbäder',
      '📐 Eingetauchte Beckenbegrenzung: Beckenrand taucht leicht unter den Wasserspiegel',
      '③ St.-Moritz-Rinne: eingetauchter Rand mit seitlichem Überlaufschlitz – hygienisch, gleichmäßig',
      '④ Züricher Rinne: breiter eingetauchter Rand mit Überlaufkanal – Freizeit- und Hotelbäder',
      '⑤ Finnische Rinne (Spaltrinne): umlaufender Schlitz direkt am eingetauchten Rand – modern, sehr verbreitet',
      'Skimmer: nur für Kleinstbecken < 60 m³, kein vollständiger Umfangsüberlauf!',
      'Alle Rinnensysteme führen das höchstbelastete Oberflächenwasser (Öle, Schweiß) kontinuierlich ab',
    ],
    pruefungsfrage: 'Was ist der Unterschied zwischen lotrechter und eingetauchter Beckenbegrenzung? Welche Rinnensysteme gibt es?',
    pruefungsantwort: 'Lotrechte Beckenbegrenzung: Wand endet senkrecht am Wasserspiegel → Wiesbadener Rinne (tieflegend offen oder auf Beckenumgangshöhe). Eingetauchte Beckenbegrenzung: Rand taucht unter den Wasserspiegel → St.-Moritz-Rinne, Züricher Rinne, Finnische Rinne (Spaltrinne). Skimmer nur für Kleinstbecken < 60 m³.',
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


// ─── Interactive 3D Pool Deep-Dive ─────────────────────────────────────────────
const BECKEN_HOTSPOT_DATA = {
  ueberlauf: {
    color: '#4a9eff', icon: '↩️', title: 'Überlaufrinne',
    items: [
      '📐 Spaltrinne: schmaler Schlitz rundum (häufigste Bauart)',
      '📐 Rostrinne: Rost über tiefer Rinne, begehbar (Sportbäder)',
      '📐 Schlitzrinne: diskrete Schlitze im Beckenrand',
      '📐 Liegende Rinne: vertikal für Hallenbäder',
      '⚡ Funktion: erfasst Oberflächenwasser (höchste Belastung)',
      '📏 Rinne läuft den gesamten Beckenumfang entlang',
      '🔬 Rinnenwasser enthält: Schweiß, Öle, Sonnencreme',
    ]
  },
  einstroemdüsen: {
    color: '#34c090', icon: '▲', title: 'Einströmdüsen',
    items: [
      '↕ Vertikaldurchströmung: Düsen im Boden, Wasser steigt auf',
      '↔ Horizontaldurchströmung: Düsen in Wänden, Querstrom',
      '💡 Gegenstromanlage: starker Strahl für Schwimmer',
      '📏 DIN 19643: Düsenabstand max. 2,5 m × 3,5 m',
      '🌊 Einströmgeschwindigkeit: 0,3 – 0,5 m/s',
      '🔵 Düsentypen: Deckelventil, Dübelventil, Körperdüse',
      '✅ Gleichmäßige Verteilung verhindert Totzonen',
    ]
  },
  wendewand: {
    color: '#ffaa40', icon: '🔲', title: 'Wendewandfliesen',
    items: [
      '🛡 Rutschhemmung: R9 nach DIN 51097 (Barfußbereich)',
      '🎨 Kontrastfarben: Orientierung + Kennzeichnung',
      '📏 T-Markierung: 2 m vor der Wand, 1 m breit',
      '🔢 Tiefenmarkierung: eingebrannte Zahlen in den Fliesen',
      '📐 Wendewandtiefe: ≥ 0,8 m für Wettkampf',
      '🏊 Ablaufblock-Sockel: rutschfeste Trittplatte',
      '📋 DIN 18032-3: Anforderungen an Sportbäder',
    ]
  },
  restentleerung: {
    color: '#d04040', icon: '⬇️', title: 'Restentleerung',
    items: [
      '📍 Lage: tiefster Punkt des Beckens (Bodengefälle 1–2 %)',
      '🔧 Nennweite: DN 100–150 je nach Beckenvolumen',
      '⏱ Entleerungszeit: < 6 h für Übungsbereich',
      '🚫 Entsorgung: Kanal (NICHT in Aufbereitungskreislauf)',
      '🔒 Absperrung: Schieber oder Kugelhahn außen',
      '🧹 Zweck: Reinigung, Inspektion, Reparatur',
      '🌀 Zuläufe werden vor Entleerung gesperrt',
    ]
  },
  bahnmarkierung: {
    color: '#a040d0', icon: '📏', title: 'Bahnmarkierung',
    items: [
      '📐 Sportstätte 50 m: 8 Bahnen × 2,5 m = 20 m breit',
      '📐 Sportstätte 25 m: 6–8 Bahnen × 2,5 m',
      '🔵 Mittellinie: 25 cm breit, dunkle Farbe, Beckenlänge',
      '🏁 T-Markierung: 2 m vor Wand, 1 m lang, quer',
      '🎯 Startblock-Abstand: 50 cm Mindestabstand',
      '🔴 Sportboje: ø 5 cm, alle 5 m entlang Seile',
      '📋 FINA-Regeln: rot = 1./8. Bahn, blau = 4./5. Bahn',
    ]
  },
};

function BeckenDeepDive({ metrics }) {
  const [rx, setRx] = useState(-28);
  const [ry, setRy] = useState(22);
  const [drag, setDrag] = useState(null);
  const [spot, setSpot] = useState(null);

  const pt = (e) => e.touches ? e.touches[0] : e;

  const onDown = (e) => {
    if (e.target.closest('[data-hotspot]')) return;
    setDrag({ x: pt(e).clientX, y: pt(e).clientY });
    e.preventDefault();
  };
  const onMove = (e) => {
    if (!drag) return;
    const dx = pt(e).clientX - drag.x, dy = pt(e).clientY - drag.y;
    setRy(y => y + dx * 0.55);
    setRx(x => Math.max(-70, Math.min(15, x - dy * 0.4)));
    setDrag({ x: pt(e).clientX, y: pt(e).clientY });
    e.preventDefault();
  };
  const onUp = () => setDrag(null);

  const p3 = (x, y, z) => {
    const cY = Math.cos(ry * Math.PI / 180), sY = Math.sin(ry * Math.PI / 180);
    const cX = Math.cos(rx * Math.PI / 180), sX = Math.sin(rx * Math.PI / 180);
    const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
    const y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
    const d = 340 / (340 + z2);
    return [150 + x1 * d, 118 + y1 * d, z2];
  };

  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  // Pool coords: x ±120 (len 25m), y ±65 (w 12.5m), z 0=surface → 55=floor
  const TFL = p3(-120,-65,0), TFR = p3(120,-65,0), TBR = p3(120,65,0),  TBL = p3(-120,65,0);
  const BFL = p3(-120,-65,55),BFR = p3(120,-65,55),BBR = p3(120,65,55), BBL = p3(-120,65,55);
  // Overflow channel strip (z=-10 to 0 at rim)
  const OFL = p3(-120,-65,-10),OFR = p3(120,-65,-10),OBR = p3(120,65,-10),OBL = p3(-120,65,-10);

  const faces = [
    // floor with lane markings
    { id:'floor',  pts:[BFL,BFR,BBR,BBL], fill:'#061828', stroke:'#1a3a5a', strokeW:1, content:'floor' },
    // back wall
    { id:'back',   pts:[TBL,TBR,BBR,BBL], fill:'#081e3c', stroke:'#1a3a5a', strokeW:1 },
    // left end wall
    { id:'leftW',  pts:[TFL,TBL,BBL,BFL], fill:'#071830', stroke:'#1a3a5a', strokeW:1, content:'leftWall' },
    // right end wall
    { id:'rightW', pts:[TFR,TBR,BBR,BFR], fill:'#071830', stroke:'#1a3a5a', strokeW:1, content:'rightWall' },
    // front wall
    { id:'front',  pts:[TFL,TFR,BFR,BFL], fill:'#081e3c', stroke:'#1a3a5a', strokeW:1 },
    // overflow channel top (rim strip)
    { id:'ovTop',  pts:[OFL,OFR,TFR,TFL], fill:'#0c2a50', stroke:'#2a5a90', strokeW:1 },
    { id:'ovBack', pts:[OBL,OBR,TBR,TBL], fill:'#0c2a50', stroke:'#2a5a90', strokeW:1 },
    { id:'ovLeft', pts:[OFL,TFL,TBL,OBL], fill:'#0a2545', stroke:'#2a5a90', strokeW:0.8 },
    { id:'ovRite', pts:[OFR,TFR,TBR,OBR], fill:'#0a2545', stroke:'#2a5a90', strokeW:0.8 },
    // water surface (semi-transparent last = on top)
    { id:'water',  pts:[TFL,TFR,TBR,TBL], fill:'#1a5090', fillOp:0.55, stroke:'#4ab0ff', strokeW:0.8, content:'water' },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a,b) => b.zVal - a.zVal);

  // Lane lines on floor (project 4 lanes)
  const laneLines = [-52,-18,18,52].map(ly => ({
    a: p3(-110, ly, 55), b: p3(110, ly, 55)
  }));
  // T-marks on floor near end walls
  const tMarks = [
    [p3(-110,-12,55), p3(-110,12,55), p3(-98,0,55), p3(-122,0,55)],
    [p3(110,-12,55),  p3(110,12,55),  p3(98,0,55),  p3(122,0,55)],
  ];
  // Nozzle positions on floor
  const nozzles = [[-70,-40],[-70,0],[-70,40],[0,-40],[0,0],[0,40],[70,-40],[70,0],[70,40]]
    .map(([x,y]) => p3(x, y, 55));

  // Hotspot definitions (3D position)
  const hotDefs = [
    { id:'ueberlauf',     x:0,    y:-65,  z:-5,  label:'↩ Überlauf',   color:'#4a9eff' },
    { id:'einstroemdüsen',x:0,    y:0,    z:55,  label:'▲ Düsen',      color:'#34c090' },
    { id:'wendewand',     x:-120, y:0,    z:25,  label:'🔲 Wendewand', color:'#ffaa40' },
    { id:'restentleerung',x:0,    y:35,   z:55,  label:'⬇ Entleer.',   color:'#d04040' },
    { id:'bahnmarkierung',x:50,   y:0,    z:0,   label:'📏 Bahn',      color:'#a040d0' },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const activeData = spot ? BECKEN_HOTSPOT_DATA[spot] : null;

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display: 'block', cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>

        <defs>
          <pattern id="bGrid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#bGrid)"/>

        {/* Pool faces */}
        {faces.map(f => (
          <g key={f.id}>
            <polygon points={poly(f.pts)} fill={f.fill} fillOpacity={f.fillOp || 1}
              stroke={f.stroke} strokeWidth={f.strokeW}/>
            {/* Lane lines on floor */}
            {f.id === 'floor' && laneLines.map((l,i) => (
              <line key={i} x1={l.a[0].toFixed(1)} y1={l.a[1].toFixed(1)} x2={l.b[0].toFixed(1)} y2={l.b[1].toFixed(1)}
                stroke="#1a4070" strokeWidth="1.2" opacity="0.7"/>
            ))}
            {/* Center lane arrow on floor */}
            {f.id === 'floor' && (() => {
              const c1 = p3(-80,0,55), c2 = p3(80,0,55);
              return <line x1={c1[0].toFixed(1)} y1={c1[1].toFixed(1)} x2={c2[0].toFixed(1)} y2={c2[1].toFixed(1)}
                stroke="#2a5090" strokeWidth="2.5" opacity="0.8"/>;
            })()}
            {/* Nozzles on floor */}
            {f.id === 'floor' && nozzles.map((n, i) => (
              <circle key={i} cx={n[0].toFixed(1)} cy={n[1].toFixed(1)} r="2.5"
                fill="#1a4060" stroke="#2a6090" strokeWidth="0.8"/>
            ))}
            {/* T-marks near end walls */}
            {f.id === 'floor' && tMarks.map((m, i) => (
              <g key={i}>
                <line x1={m[0][0].toFixed(1)} y1={m[0][1].toFixed(1)} x2={m[1][0].toFixed(1)} y2={m[1][1].toFixed(1)} stroke="#c04040" strokeWidth="2" opacity="0.7"/>
                <line x1={m[2][0].toFixed(1)} y1={m[2][1].toFixed(1)} x2={m[3][0].toFixed(1)} y2={m[3][1].toFixed(1)} stroke="#c04040" strokeWidth="2" opacity="0.7"/>
              </g>
            ))}
            {/* Tile band on end walls */}
            {(f.id === 'leftW' || f.id === 'rightW') && (() => {
              const [a,b,c,d] = f.pts;
              // lower quarter of wall = tile band
              const tile1 = [
                [a[0]+(d[0]-a[0])*0.55, a[1]+(d[1]-a[1])*0.55],
                [b[0]+(c[0]-b[0])*0.55, b[1]+(c[1]-b[1])*0.55],
                [b[0]+(c[0]-b[0])*0.7,  b[1]+(c[1]-b[1])*0.7],
                [a[0]+(d[0]-a[0])*0.7,  a[1]+(d[1]-a[1])*0.7],
              ];
              return <polygon points={tile1.map(p => p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}
                fill="#0f3560" fillOpacity="0.7" stroke="#1a5090" strokeWidth="0.6"/>;
            })()}
            {/* Water surface animation hint */}
            {f.id === 'water' && (() => {
              const w1 = p3(-80, -40, 0), w2 = p3(60, -40, 0), w3 = p3(-60, 20, 0);
              return <>
                <line x1={w1[0].toFixed(1)} y1={w1[1].toFixed(1)} x2={w2[0].toFixed(1)} y2={w2[1].toFixed(1)}
                  stroke="#4ac8ff" strokeWidth="1.5" opacity="0.4" strokeDasharray="8 5" className="wc-surface"/>
                <line x1={w3[0].toFixed(1)} y1={w3[1].toFixed(1)} x2={p3(80,20,0)[0].toFixed(1)} y2={p3(80,20,0)[1].toFixed(1)}
                  stroke="#4ac8ff" strokeWidth="1" opacity="0.3" strokeDasharray="6 5" className="wc-surface"/>
              </>;
            })()}
            {/* Overflow channel details */}
            {(f.id === 'ovTop' || f.id === 'ovBack') && (() => {
              const [a,b,c,d] = f.pts;
              const mid1 = [(a[0]+d[0])/2,(a[1]+d[1])/2];
              const mid2 = [(b[0]+c[0])/2,(b[1]+c[1])/2];
              return <line x1={mid1[0].toFixed(1)} y1={mid1[1].toFixed(1)} x2={mid2[0].toFixed(1)} y2={mid2[1].toFixed(1)}
                stroke="#2a6090" strokeWidth="1" opacity="0.5" strokeDasharray="4 3"/>;
            })()}
          </g>
        ))}

        {/* Hotspot markers */}
        {hotDefs.map(h => (
          <g key={h.id} data-hotspot="1" style={{ cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); setSpot(spot === h.id ? null : h.id); }}>
            <circle cx={h.proj[0].toFixed(1)} cy={h.proj[1].toFixed(1)} r="14"
              fill={h.color} fillOpacity={spot === h.id ? 0.4 : 0.15}
              stroke={h.color} strokeWidth={spot === h.id ? 2.5 : 1.5}>
              {spot !== h.id && <animate attributeName="r" values="14;17;14" dur="2.5s" repeatCount="indefinite"/>}
            </circle>
            <text x={h.proj[0].toFixed(1)} y={(h.proj[1]+4).toFixed(1)}
              fill="white" fontSize="10" fontWeight="bold" textAnchor="middle"
              style={{ pointerEvents: 'none' }}>+</text>
            {spot === h.id && (
              <text x={h.proj[0].toFixed(1)} y={(h.proj[1]-18).toFixed(1)}
                fill={h.color} fontSize="7" fontFamily="monospace" textAnchor="middle"
                style={{ pointerEvents: 'none' }}>{h.label}</text>
            )}
          </g>
        ))}

        {/* Depth indicator */}
        {(() => {
          const d1 = p3(130,-65,0), d2 = p3(130,-65,55);
          return <>
            <line x1={d1[0].toFixed(1)} y1={d1[1].toFixed(1)} x2={d2[0].toFixed(1)} y2={d2[1].toFixed(1)}
              stroke="#2a5070" strokeWidth="1" strokeDasharray="3 2" opacity="0.7"/>
            <text x={(d2[0]+4).toFixed(1)} y={(d1[1]+(d2[1]-d1[1])/2).toFixed(1)} fill="#2a5070" fontSize="6.5" fontFamily="monospace">2,0m</text>
          </>;
        })()}

        {/* Label */}
        <text x="150" y="214" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? '◉ DREHEN…' : '⟵ ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN ⟶'}
        </text>
      </svg>

      {/* Info overlay panel */}
      {activeData && (
        <div style={{
          background: 'linear-gradient(to bottom, #0a1828, #040d1a)',
          borderTop: '2px solid ' + activeData.color,
          padding: '10px 12px',
          maxHeight: '180px', overflowY: 'auto'
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
            <span style={{ color: activeData.color, fontSize:'12px', fontWeight:'bold', fontFamily:'monospace' }}>
              {activeData.icon} {activeData.title}
            </span>
            <button onClick={() => setSpot(null)} style={{
              background:'transparent', border:'1px solid #1a3a5a', borderRadius:'4px',
              color:'#5a8090', fontSize:'11px', padding:'2px 7px', cursor:'pointer'
            }}>✕</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color:'#8ab0c0', fontSize:'10px', fontFamily:'monospace', margin:'2px 0', lineHeight:'1.5' }}>
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Überlaufrinne 3D Deep-Dive ─────────────────────────────────────────────────
function UeberlaufDeepDive() {
  const [rx, setRx] = useState(-28);
  const [ry, setRy] = useState(38);
  const [drag, setDrag] = useState(null);
  const [spot, setSpot] = useState(null);

  const pt = (e) => e.touches ? e.touches[0] : e;
  const onDown = (e) => { if (e.target.closest('[data-hotspot]')) return; setDrag({ x: pt(e).clientX, y: pt(e).clientY }); e.preventDefault(); };
  const onMove = (e) => {
    if (!drag) return;
    const dx = pt(e).clientX - drag.x, dy = pt(e).clientY - drag.y;
    setRy(y => y + dx * 0.55);
    setRx(x => Math.max(-70, Math.min(15, x - dy * 0.4)));
    setDrag({ x: pt(e).clientX, y: pt(e).clientY });
    e.preventDefault();
  };
  const onUp = () => setDrag(null);

  const p3 = (x, y, z) => {
    const cY = Math.cos(ry * Math.PI / 180), sY = Math.sin(ry * Math.PI / 180);
    const cX = Math.cos(rx * Math.PI / 180), sX = Math.sin(rx * Math.PI / 180);
    const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
    const y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
    const d = 310 / (310 + z2);
    return [150 + x1 * d, 105 + y1 * d, z2];
  };
  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  // Scene: pool wall cross-section (X=perimeter ±80, Y=depth 0=surface, Z=0=poolside 30=outside)
  const faces = [
    { id:'pf', pts:[p3(-80,55,0),p3(80,55,0),p3(80,55,-60),p3(-80,55,-60)], fill:'#061520', stroke:'#1a3a5a', strokeW:1 },
    { id:'pb', pts:[p3(-80,0,-60),p3(80,0,-60),p3(80,55,-60),p3(-80,55,-60)], fill:'#05111d', stroke:'#1a3a5a', strokeW:1 },
    { id:'pl', pts:[p3(-80,0,0),p3(-80,0,-60),p3(-80,55,-60),p3(-80,55,0)], fill:'#071828', stroke:'#1a3a5a', strokeW:0.8 },
    { id:'pr', pts:[p3(80,0,0),p3(80,0,-60),p3(80,55,-60),p3(80,55,0)], fill:'#071828', stroke:'#1a3a5a', strokeW:0.8 },
    { id:'wt', pts:[p3(-80,-18,0),p3(80,-18,0),p3(80,-18,30),p3(-80,-18,30)], fill:'#1e2830', stroke:'#2a3a50', strokeW:1 },
    { id:'wl', pts:[p3(-80,-18,0),p3(-80,55,0),p3(-80,55,30),p3(-80,-18,30)], fill:'#161e2a', stroke:'#2a3a50', strokeW:0.8 },
    { id:'wr', pts:[p3(80,-18,0),p3(80,55,0),p3(80,55,30),p3(80,-18,30)], fill:'#161e2a', stroke:'#2a3a50', strokeW:0.8 },
    { id:'wb', pts:[p3(-80,-18,30),p3(80,-18,30),p3(80,55,30),p3(-80,55,30)], fill:'#0e1820', stroke:'#2a3a50', strokeW:0.8 },
    { id:'cb', pts:[p3(-80,5,0),p3(80,5,0),p3(80,5,22),p3(-80,5,22)], fill:'#0d1a2a', stroke:'#2a4060', strokeW:1 },
    { id:'ck', pts:[p3(-80,-18,22),p3(80,-18,22),p3(80,5,22),p3(-80,5,22)], fill:'#0c1828', stroke:'#2a4060', strokeW:1 },
    { id:'cla', pts:[p3(-80,-18,0),p3(-80,-18,22),p3(-80,5,22),p3(-80,5,0)], fill:'#0e1e30', stroke:'#2a4060', strokeW:0.8 },
    { id:'cra', pts:[p3(80,-18,0),p3(80,-18,22),p3(80,5,22),p3(80,5,0)], fill:'#0e1e30', stroke:'#2a4060', strokeW:0.8 },
    { id:'ws', pts:[p3(-80,0,0),p3(80,0,0),p3(80,0,-60),p3(-80,0,-60)], fill:'#1a5090', fillOp:0.5, stroke:'#4ab0ff', strokeW:0.8 },
    { id:'cw', pts:[p3(-80,3,0),p3(80,3,0),p3(80,3,22),p3(-80,3,22)], fill:'#1a4a80', fillOp:0.65, stroke:'#4ab0ff', strokeW:0.8 },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a,b) => b.zVal - a.zVal);

  const hotDefs = [
    { id:'wasserspiegel', x:0, y:0, z:-30, label:'≈ Wasserspiegel', color:'#4a9eff' },
    { id:'schlitz', x:0, y:2, z:0, label:'↓ Einlaufschlitz', color:'#34c090' },
    { id:'rinne', x:0, y:-8, z:11, label:'⊓ Rinnenkörper', color:'#ffaa40' },
    { id:'ablauf', x:-70, y:3, z:11, label:'→ Ablaufleitung', color:'#d04040' },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const UDATA = {
    wasserspiegel: { color:'#4a9eff', icon:'≈', title:'Wasserspiegel', items:[
      '📏 Beckenwasserstand muss konstant auf Rinnen-Höhe gehalten werden',
      '⬆ Steigt der Spiegel: mehr Überlauf — OK bis zur Rinnenkapazität',
      '⬇ Sinkt er: kein Überlauf → Oberfläche wird nicht gereinigt',
      '🎛 Pegelregelung über Nachspeisung im Schwallwasserbehälter',
      '📐 DIN 19643: Wasserstand stabil auf ±5 mm Sollwert halten',
    ]},
    schlitz: { color:'#34c090', icon:'↓', title:'Einlaufsystem / Rinnensysteme', items:[
      '① Wiesbadener Rinne (tieflegend, offen): klassisch im Hallenbad, breite Rinne am Beckenrand',
      '② Wiesbadener Rinne (Beckenumgangshöhe): auf Höhe des Umgangs, begehbar',
      '③ St.-Moritz-Rinne: eingetauchter Rand mit seitlichem Überlaufschlitz',
      '④ Züricher Rinne: breiter eingetauchter Rand mit Überlaufkanal darunter',
      '⑤ Finnische Rinne (Spaltrinne): umlaufender Schlitz am eingetauchten Rand',
      '⚡ Schlitz erfasst Oberflächenwasser direkt — höchste Keimbelastung',
    ]},
    rinne: { color:'#ffaa40', icon:'⊓', title:'Rinnenkörper', items:[
      '🧱 Material: Keramik, Edelstahl oder Kunststoff (chlorbeständig)',
      '🔄 Sammelkanal führt Überlaufwasser zur Ablaufleitung',
      '🚫 Rückstau verhindern: Querschnitt großzügig dimensionieren',
      '🧹 Biofilm und Ablagerungen: täglich im Öffnungsrundgang prüfen',
      '⚠ Verstopfte Rinne → Wasserspiegel steigt → Überschwemmungsgefahr',
      '📋 Reinigung laut Hygieneplan dokumentieren',
    ]},
    ablauf: { color:'#d04040', icon:'→', title:'Ablaufleitung zum Schwall', items:[
      '📍 Tiefster Punkt der Rinne → Gefälle zur Ablaufleitung zwingend',
      '🔧 Nennweite je nach Rinnenkapazität: DN 80–150',
      '🔀 Abfluss in den Schwallwasserbehälter (nicht direkt in Kanal)',
      '🔒 Hygienetrennung: Rinnenwasser NICHT ins Frischwassernetz',
      '⏱ Hydraulik: max. Überlaufrate 1–2 m³/(m·h)',
      '📐 DIN EN 13451: Rinne muss vollständig abfließen können',
    ]},
  };
  const activeData = spot ? UDATA[spot] : null;
  const pipeA = p3(-80, 3, 11), pipeB = p3(-98, 3, 11);

  return (
    <div style={{ position:'relative', borderRadius:'8px', overflow:'hidden', background:'#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display:'block', cursor: drag ? 'grabbing' : 'grab', touchAction:'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs><pattern id="uGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
        </pattern></defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#uGrid)"/>
        {faces.map(f => (
          <g key={f.id}>
            <polygon points={poly(f.pts)} fill={f.fill} fillOpacity={f.fillOp || 1} stroke={f.stroke} strokeWidth={f.strokeW}/>
            {f.id === 'ws' && (() => {
              const w1 = p3(-60,0,-20), w2 = p3(40,0,-20), w3 = p3(-40,0,-40), w4 = p3(50,0,-40);
              return <>
                <line x1={w1[0].toFixed(1)} y1={w1[1].toFixed(1)} x2={w2[0].toFixed(1)} y2={w2[1].toFixed(1)} stroke="#4ac8ff" strokeWidth="1.2" opacity="0.4" strokeDasharray="8 5" className="wc-surface"/>
                <line x1={w3[0].toFixed(1)} y1={w3[1].toFixed(1)} x2={w4[0].toFixed(1)} y2={w4[1].toFixed(1)} stroke="#4ac8ff" strokeWidth="0.8" opacity="0.3" strokeDasharray="6 4" className="wc-surface"/>
              </>;
            })()}
            {f.id === 'cw' && (() => {
              const c1 = p3(-40,3,11), c2 = p3(-65,3,11);
              return <line x1={c1[0].toFixed(1)} y1={c1[1].toFixed(1)} x2={c2[0].toFixed(1)} y2={c2[1].toFixed(1)}
                stroke="#4ab0ff" strokeWidth="2" opacity="0.6" strokeDasharray="6 4" className="wc-flow" style={{ animationDuration:'1.8s' }}/>;
            })()}
            {f.id === 'pf' && [[-60,55,-20],[0,55,-20],[60,55,-20],[-60,55,-40],[0,55,-40],[60,55,-40]].map(([x,y,z],i) => {
              const c = p3(x,y,z);
              return <circle key={i} cx={c[0].toFixed(1)} cy={c[1].toFixed(1)} r="2" fill="#0d2a40" opacity="0.4"/>;
            })}
          </g>
        ))}
        <line x1={pipeA[0].toFixed(1)} y1={pipeA[1].toFixed(1)} x2={pipeB[0].toFixed(1)} y2={pipeB[1].toFixed(1)} stroke="#1a4060" strokeWidth="9" strokeLinecap="round"/>
        <line x1={pipeA[0].toFixed(1)} y1={pipeA[1].toFixed(1)} x2={pipeB[0].toFixed(1)} y2={pipeB[1].toFixed(1)} stroke="#0c2030" strokeWidth="5" strokeLinecap="round"/>
        <line x1={pipeA[0].toFixed(1)} y1={pipeA[1].toFixed(1)} x2={pipeB[0].toFixed(1)} y2={pipeB[1].toFixed(1)} stroke="#4a9eff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" strokeDasharray="5 4" className="wc-flow" style={{ animationDuration:'1.5s' }}/>
        <text x={(pipeB[0]-4).toFixed(1)} y={(pipeB[1]-7).toFixed(1)} fill="#4a9eff" fontSize="5.5" fontFamily="monospace" textAnchor="middle">→ SCHWALL</text>
        {hotDefs.map(h => (
          <g key={h.id} data-hotspot="1" style={{ cursor:'pointer' }} onClick={e => { e.stopPropagation(); setSpot(spot === h.id ? null : h.id); }}>
            <circle cx={h.proj[0].toFixed(1)} cy={h.proj[1].toFixed(1)} r="13" fill={h.color} fillOpacity={spot===h.id?0.4:0.15} stroke={h.color} strokeWidth={spot===h.id?2.5:1.5}>
              {spot!==h.id && <animate attributeName="r" values="13;16;13" dur="2.5s" repeatCount="indefinite"/>}
            </circle>
            <text x={h.proj[0].toFixed(1)} y={(h.proj[1]+4).toFixed(1)} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ pointerEvents:'none' }}>+</text>
            {spot===h.id && <text x={h.proj[0].toFixed(1)} y={(h.proj[1]-18).toFixed(1)} fill={h.color} fontSize="6.5" fontFamily="monospace" textAnchor="middle" style={{ pointerEvents:'none' }}>{h.label}</text>}
          </g>
        ))}
        <text x="150" y="215" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? '◉ DREHEN…' : '⟵ ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN ⟶'}
        </text>
      </svg>
      {activeData && (
        <div style={{ background:'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop:'2px solid '+activeData.color, padding:'10px 12px', maxHeight:'180px', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
            <span style={{ color:activeData.color, fontSize:'12px', fontWeight:'bold', fontFamily:'monospace' }}>{activeData.icon} {activeData.title}</span>
            <button onClick={() => setSpot(null)} style={{ background:'transparent', border:'1px solid #1a3a5a', borderRadius:'4px', color:'#5a8090', fontSize:'11px', padding:'2px 7px', cursor:'pointer' }}>✕</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color:'#8ab0c0', fontSize:'10px', fontFamily:'monospace', margin:'2px 0', lineHeight:'1.5' }}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Rücklaufleitung 3D Deep-Dive ──────────────────────────────────────────────
function RuecklaufDeepDive({ metrics }) {
  const [rx, setRx] = useState(-32);
  const [ry, setRy] = useState(-18);
  const [drag, setDrag] = useState(null);
  const [spot, setSpot] = useState(null);
  const running = metrics.flowRate > 0;

  const pt = (e) => e.touches ? e.touches[0] : e;
  const onDown = (e) => { if (e.target.closest('[data-hotspot]')) return; setDrag({ x: pt(e).clientX, y: pt(e).clientY }); e.preventDefault(); };
  const onMove = (e) => {
    if (!drag) return;
    const dx = pt(e).clientX - drag.x, dy = pt(e).clientY - drag.y;
    setRy(y => y + dx * 0.55);
    setRx(x => Math.max(-70, Math.min(15, x - dy * 0.4)));
    setDrag({ x: pt(e).clientX, y: pt(e).clientY });
    e.preventDefault();
  };
  const onUp = () => setDrag(null);

  const p3 = (x, y, z) => {
    const cY = Math.cos(ry * Math.PI / 180), sY = Math.sin(ry * Math.PI / 180);
    const cX = Math.cos(rx * Math.PI / 180), sX = Math.sin(rx * Math.PI / 180);
    const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
    const y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
    const d = 310 / (310 + z2);
    return [150 + x1 * d, 108 + y1 * d, z2];
  };
  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  // X=width ±80, Y=0=floor 20=underground -25=water above, Z=pool length ±50
  const nozzlePos = [[-55,-35],[-55,0],[-55,35],[0,-35],[0,0],[0,35],[55,-35],[55,0],[55,35]];
  const faces = [
    { id:'ug', pts:[p3(-80,0,-50),p3(80,0,-50),p3(80,30,-50),p3(-80,30,-50)], fill:'#030a12', stroke:'#0a1a2a', strokeW:1 },
    { id:'lw', pts:[p3(-80,0,-50),p3(-80,0,50),p3(-80,30,50),p3(-80,30,-50)], fill:'#070e1c', stroke:'#1a3050', strokeW:1 },
    { id:'fl', pts:[p3(-80,0,-50),p3(80,0,-50),p3(80,0,50),p3(-80,0,50)], fill:'#071828', stroke:'#1a3a5a', strokeW:1.5 },
    { id:'wa', pts:[p3(-80,-32,-50),p3(80,-32,-50),p3(80,-32,50),p3(-80,-32,50)], fill:'#1a5090', fillOp:0.2, stroke:'#4ab0ff', strokeW:0.5 },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a,b) => b.zVal - a.zVal);

  const pL = p3(-80,18,0), pR = p3(80,18,0);
  const branchX = [-55, 0, 55];

  const hotDefs = [
    { id:'hauptleitung', x:0, y:18, z:0, label:'⊙ Rücklaufleitung', color:'#4a9eff' },
    { id:'einstroemduse', x:0, y:0, z:0, label:'▲ Einströmdüse', color:'#34c090' },
    { id:'stroemung', x:50, y:-18, z:30, label:'∿ Strömung', color:'#ffaa40' },
    { id:'verteiler', x:-50, y:18, z:-35, label:'⊗ Verteiler', color:'#d04040' },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const RDATA = {
    hauptleitung: { color:'#4a9eff', icon:'⊙', title:'Rücklaufleitung', items:[
      '📍 Führt aufbereitetes Reinwasser zurück ins Becken',
      '🔧 Nennweite: DN 100–200 je nach Volumenstrom',
      '🌊 Fließgeschwindigkeit: 0,3–0,7 m/s (Schutz vor Erosion)',
      '⚙ Material: PVC-U, PP oder Edelstahl (chlorbeständig)',
      '🔀 Verteilerleitung verzweigt auf alle Einströmdüsen',
      '📐 DIN 19643: Hydraulik gleichmäßig auf Düsen aufteilen',
    ]},
    einstroemduse: { color:'#34c090', icon:'▲', title:'Einströmdüsen', items:[
      '↕ Vertikaldurchströmung: Düsen im Boden, Wasser steigt auf',
      '↔ Horizontaldurchströmung: Düsen in Wand, Querstrom',
      '📏 DIN 19643: Düsenraster max. 2,5 m × 3,5 m',
      '🌊 Einströmgeschwindigkeit: 0,3–0,5 m/s',
      '🔵 Düsentypen: Deckelventil, Dübelventil, Körperdüse',
      '✅ Gleichmäßige Verteilung verhindert Totzonen',
    ]},
    stroemung: { color:'#ffaa40', icon:'∿', title:'Strömungsbild', items:[
      '🌊 Aufsteigende Strömung: Reinwasser verdrängt Schmutzwasser zur Rinne',
      '🔄 Totzonen sind hygienisch kritisch — Keimbildung möglich',
      '📐 Hydraulische Simulation bei Planung vorgeschrieben',
      '🎯 Ziel: lückenlose Durchflutung des gesamten Beckens',
      '👁 Sichttiefe und Oberflächenbewegung zeigen Strömungsqualität an',
    ]},
    verteiler: { color:'#d04040', icon:'⊗', title:'Verteilerleitung', items:[
      '🔀 Teilt Volumenstrom gleichmäßig auf alle Düsenstränge auf',
      '📐 Ringförmige Anordnung sichert Druckausgleich',
      '🔧 Reinigungsanschlüsse (Spül-T) an strategischen Stellen',
      '⚠ Teilverblockung → ungleiche Strömung → Totzonen',
      '📋 Umbau erfordert hydraulische Neuberechnung',
    ]},
  };
  const activeData = spot ? RDATA[spot] : null;

  return (
    <div style={{ position:'relative', borderRadius:'8px', overflow:'hidden', background:'#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display:'block', cursor: drag ? 'grabbing' : 'grab', touchAction:'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs><pattern id="rGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
        </pattern></defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#rGrid)"/>
        {faces.map(f => (
          <g key={f.id}>
            <polygon points={poly(f.pts)} fill={f.fill} fillOpacity={f.fillOp||1} stroke={f.stroke} strokeWidth={f.strokeW}/>
            {f.id === 'fl' && nozzlePos.map(([x,z],i) => {
              const c = p3(x,0,z);
              return <circle key={i} cx={c[0].toFixed(1)} cy={c[1].toFixed(1)} r="2.5" fill="#0d2a40" opacity="0.6"/>;
            })}
          </g>
        ))}
        <line x1={pL[0].toFixed(1)} y1={pL[1].toFixed(1)} x2={pR[0].toFixed(1)} y2={pR[1].toFixed(1)} stroke="#0d2a40" strokeWidth="16" strokeLinecap="round"/>
        <line x1={pL[0].toFixed(1)} y1={pL[1].toFixed(1)} x2={pR[0].toFixed(1)} y2={pR[1].toFixed(1)} stroke="#1a4060" strokeWidth="11" strokeLinecap="round"/>
        <line x1={pL[0].toFixed(1)} y1={pL[1].toFixed(1)} x2={pR[0].toFixed(1)} y2={pR[1].toFixed(1)} stroke="#0d2030" strokeWidth="6" strokeLinecap="round"/>
        {running && <line x1={pL[0].toFixed(1)} y1={pL[1].toFixed(1)} x2={pR[0].toFixed(1)} y2={pR[1].toFixed(1)} stroke="#4a9eff" strokeWidth="3.5" strokeLinecap="round" opacity="0.75" strokeDasharray="8 6" className="wc-flow" style={{ animationDuration:'2s' }}/>}
        {branchX.map((x, i) => {
          const top = p3(x,0,0), bot = p3(x,18,0);
          return <g key={i}>
            <line x1={top[0].toFixed(1)} y1={top[1].toFixed(1)} x2={bot[0].toFixed(1)} y2={bot[1].toFixed(1)} stroke="#0f2a40" strokeWidth="8" strokeLinecap="round"/>
            <line x1={top[0].toFixed(1)} y1={top[1].toFixed(1)} x2={bot[0].toFixed(1)} y2={bot[1].toFixed(1)} stroke="#1a4060" strokeWidth="5" strokeLinecap="round"/>
            {running && <line x1={top[0].toFixed(1)} y1={top[1].toFixed(1)} x2={bot[0].toFixed(1)} y2={bot[1].toFixed(1)} stroke="#4a9eff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" strokeDasharray="5 4" className="wc-flow" style={{ animationDuration:'1.5s', animationDelay:`${i*0.2}s` }}/>}
          </g>;
        })}
        {nozzlePos.map(([x,z],i) => {
          const pos = p3(x,0,z), tip = p3(x,-22,z);
          return <g key={i}>
            <circle cx={pos[0].toFixed(1)} cy={pos[1].toFixed(1)} r="4.5" fill="#0d2030" stroke="#2a5080" strokeWidth="1.2"/>
            <circle cx={pos[0].toFixed(1)} cy={pos[1].toFixed(1)} r="2.5" fill="#1a4060" stroke="#4a80c0" strokeWidth="0.8"/>
            {running && <line x1={pos[0].toFixed(1)} y1={pos[1].toFixed(1)} x2={tip[0].toFixed(1)} y2={tip[1].toFixed(1)} stroke="#4ac8ff" strokeWidth="2" opacity="0.75" strokeDasharray="4 3" className="wc-flow" style={{ animationDuration:'1.1s', animationDelay:`${i*0.08}s` }} filter="url(#wcGlow)"/>}
          </g>;
        })}
        {hotDefs.map(h => (
          <g key={h.id} data-hotspot="1" style={{ cursor:'pointer' }} onClick={e => { e.stopPropagation(); setSpot(spot===h.id?null:h.id); }}>
            <circle cx={h.proj[0].toFixed(1)} cy={h.proj[1].toFixed(1)} r="13" fill={h.color} fillOpacity={spot===h.id?0.4:0.15} stroke={h.color} strokeWidth={spot===h.id?2.5:1.5}>
              {spot!==h.id && <animate attributeName="r" values="13;16;13" dur="2.5s" repeatCount="indefinite"/>}
            </circle>
            <text x={h.proj[0].toFixed(1)} y={(h.proj[1]+4).toFixed(1)} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ pointerEvents:'none' }}>+</text>
            {spot===h.id && <text x={h.proj[0].toFixed(1)} y={(h.proj[1]-18).toFixed(1)} fill={h.color} fontSize="6.5" fontFamily="monospace" textAnchor="middle" style={{ pointerEvents:'none' }}>{h.label}</text>}
          </g>
        ))}
        <text x="150" y="215" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? '◉ DREHEN…' : '⟵ ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN ⟶'}
        </text>
      </svg>
      {activeData && (
        <div style={{ background:'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop:'2px solid '+activeData.color, padding:'10px 12px', maxHeight:'180px', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
            <span style={{ color:activeData.color, fontSize:'12px', fontWeight:'bold', fontFamily:'monospace' }}>{activeData.icon} {activeData.title}</span>
            <button onClick={() => setSpot(null)} style={{ background:'transparent', border:'1px solid #1a3a5a', borderRadius:'4px', color:'#5a8090', fontSize:'11px', padding:'2px 7px', cursor:'pointer' }}>✕</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color:'#8ab0c0', fontSize:'10px', fontFamily:'monospace', margin:'2px 0', lineHeight:'1.5' }}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

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
      { label: 'QUARZKIES', sub: '4–16mm Stützschicht', fill: '#2a4530', y: 62, h: 46 },
      { label: 'QUARZSAND', sub: '0,4–1,6mm Hauptfilter', fill: '#384828', y: 108, h: 56 },
      { label: 'AKTIVKOHLE', sub: '0,8–1,6mm Geruch/Org.', fill: '#1a2838', y: 164, h: 46 },
    ];
    return (
      <svg viewBox="0 0 300 310" width="100%" height="100%">
        <rect width="300" height="310" fill={B.bg} rx="8"/>
        {/* Verteilerhaube (top dome) */}
        <ellipse cx="105" cy="48" rx="55" ry="16" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <text x="105" y="43" fill={B.muted} fontSize="5.5" fontFamily="monospace" textAnchor="middle">VERTEILERHAUBE</text>
        {/* Distribution spray */}
        {running && [85, 95, 105, 115, 125].map((fx, i) => (
          <line key={i} x1="105" y1="62" x2={fx} y2={76}
            stroke="#4ac8ff" strokeWidth="1" opacity="0.35"
            strokeDasharray="3 3" className="wc-flow"
            style={{ animationDuration: '1.3s', animationDelay: `${i * 0.1}s` }}/>
        ))}
        {/* Filter body */}
        <rect x="50" y="46" width="110" height="170" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        {layers.map(l => (
          <g key={l.label}>
            <rect x="52" y={l.y} width="106" height={l.h} fill={l.fill} fillOpacity={xrayMode ? 0.9 : 0.5}/>
            <text x="106" y={l.y + l.h / 2 + 1} fill={B.text} fontSize="6.5" fontFamily="monospace" textAnchor="middle" opacity="0.9">{l.label}</text>
            <text x="106" y={l.y + l.h / 2 + 10} fill={B.muted} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">{l.sub}</text>
          </g>
        ))}
        {/* Düsenboden strip */}
        <rect x="52" y="210" width="106" height="8" fill="#0e2030" stroke="#2a4870" strokeWidth="0.6" strokeDasharray="3 2"/>
        {[62, 74, 86, 98, 110, 122, 134, 146].map((dx) => (
          <circle key={dx} cx={dx} cy={214} r="2" fill="#1a3a5a" stroke="#2a5880" strokeWidth="0.6"/>
        ))}
        <text x="160" y="216" fill={B.muted} fontSize="5" fontFamily="monospace">DÜSENBODEN</text>
        {/* Bottom outlet ellipse */}
        <ellipse cx="105" cy="218" rx="55" ry="16" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        {/* Inlet arrow */}
        <polygon points="105,22 99,36 111,36" fill={B.accent} opacity="0.7"/>
        <line x1="105" y1="30" x2="105" y2="46" stroke={B.accent} strokeWidth="2" opacity="0.6"/>
        {/* Outlet arrow */}
        <polygon points="105,272 99,258 111,258" fill={B.accent} opacity="0.7"/>
        <line x1="105" y1="234" x2="105" y2="258" stroke={B.accent} strokeWidth="2" opacity="0.6"/>
        {/* Centre flow arrow */}
        <line x1="105" y1="72" x2="105" y2="202" stroke="#4a9eff" strokeWidth="1.2" strokeDasharray="7 5" opacity="0.2"/>
        {/* Turbidity sensor */}
        <circle cx="185" cy="148" r="15" fill={B.panel} stroke={B.border} strokeWidth="1.5"/>
        <circle cx="185" cy="148" r="9" fill={xrayMode ? '#2a5a30' : B.water} opacity={0.6}/>
        <text x="185" y="172" fill={B.muted} fontSize="5.5" fontFamily="monospace" textAnchor="middle">TRÜBUNG</text>
        {/* dP gauge */}
        <rect x="210" y="80" width="80" height="70" fill={B.panel} stroke={`${dpColor}80`} strokeWidth="1" rx="5"/>
        <text x="250" y="98" fill={B.muted} fontSize="6" fontFamily="monospace" textAnchor="middle">DIFF.-DRUCK</text>
        <text x="250" y="122" fill={dpColor} fontSize="20" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{dp}</text>
        <text x="250" y="135" fill={B.muted} fontSize="6.5" fontFamily="monospace" textAnchor="middle">bar</text>
        <text x="250" y="150" fill={dpColor} fontSize="6.5" fontFamily="monospace" textAnchor="middle">{dp > 0.5 ? '⚠ RÜCKSPÜLEN' : dp > 0.35 ? 'ERHÖHT' : '✓ NORMAL'}</text>
        <text x="105" y="295" fill={B.muted} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">MEHRSCHICHTFILTER · DRUCKFILTER</text>
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
    return <BeckenDeepDive metrics={metrics}/>;
  }

  if (stationId === 'ueberlauf') {
    return <UeberlaufDeepDive />;
  }

  if (stationId === 'ruecklauf') {
    return <RuecklaufDeepDive metrics={metrics}/>;
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
  const [filterMode, setFilterMode] = useState('vertikal'); // 'vertikal' | 'horizontal'
  const schemPaths = filterMode === 'horizontal' ? PIPE_PATHS_HORIZONTAL : PIPE_PATHS_VERTICAL;

  const stationMap = useMemo(() => new Map(WATER_CYCLE_STATIONS.map(s => [s.id, s])), []);
  const selectedStation = stationMap.get(selectedStationId) || WATER_CYCLE_STATIONS[0];
  const deepDiveStation = deepDiveStationId ? stationMap.get(deepDiveStationId) : null;
  const stationIndex = Math.max(0, WATER_CYCLE_STATION_ORDER.indexOf(selectedStation.id));
  const stationFocus = (() => {
    if (filterMode === 'horizontal' && selectedStationId === 'filter') return { x: 835, y: 330, r: 130 };
    if (filterMode === 'horizontal' && selectedStationId === 'desinfektion') return { x: 955, y: 548, r: 80 };
    return STATION_FOCUS_VERTICAL[selectedStationId] || STATION_FOCUS_VERTICAL.becken;
  })();
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
    return { ...pipe, path: schemPaths[pipe.id] || pipe.path, hasFlow: activeInMode && metrics.flowRate > 0, reverse, backwash: pipe.mode === 'backwash' || reverse };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [controls.backwashMode, metrics.flowRate, filterMode]);

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
          <button onClick={() => setFilterMode(m => m === 'vertikal' ? 'horizontal' : 'vertikal')}
            title="Filterdurchströmung wechseln"
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${filterMode === 'horizontal' ? 'bg-indigo-500 text-white' : (dm ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}>
            {filterMode === 'vertikal' ? '↕ Vertikal' : '↔ Horizontal'}
          </button>
          <button onClick={() => setShowCheatSheet(p => !p)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${showCheatSheet ? 'bg-emerald-500 text-white' : (dm ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}>
            Spickzettel
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1.95fr)_minmax(360px,1fr)] gap-3">
        {/* ── Left column ── */}
        <div className="space-y-3">
          {/* ── MOBILE Portrait SVG (shown < sm) ── */}
          <div className="rounded-2xl overflow-hidden shadow-2xl block sm:hidden" style={{ border: '1px solid #1a3a5a' }}>
            <div style={{ background: '#040d1a' }}>
              <svg className="w-full" viewBox="0 0 420 780" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="wcBlueBgM" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#040d1a"/>
                    <stop offset="100%" stopColor="#060f22"/>
                  </linearGradient>
                  <linearGradient id="wcWaterM" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a6090" stopOpacity="0.75"/>
                    <stop offset="100%" stopColor="#0a3060" stopOpacity="0.9"/>
                  </linearGradient>
                  <linearGradient id="wcHeatM" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#802010"/>
                    <stop offset="100%" stopColor="#ff6030" stopOpacity="0.6"/>
                  </linearGradient>
                  <filter id="wcGlowM" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="wcGlowSM" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <pattern id="wcGridM" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e2840" strokeWidth="0.5"/>
                  </pattern>
                  <marker id="arrowUpM" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto">
                    <polygon points="3,0 6,6 0,6" fill="#38b0ff" opacity="0.7"/>
                  </marker>
                  <marker id="arrowDnM" markerWidth="6" markerHeight="6" refX="3" refY="1" orient="auto">
                    <polygon points="3,6 6,0 0,0" fill="#38b0ff" opacity="0.7"/>
                  </marker>
                </defs>

                <rect width="100%" height="100%" fill="url(#wcBlueBgM)"/>
                <rect width="100%" height="100%" fill="url(#wcGridM)" opacity="0.8"/>

                {/* ══════════════ PIPES ══════════════ */}
                {WATER_CYCLE_PIPES.map(pipe => {
                  const path = PIPE_PATHS_MOBILE_VERTICAL[pipe.id];
                  if (!path) return null;
                  const bw = controls.backwashMode;
                  const active = bw ? pipe.mode !== 'normal' || pipe.reversibleInBackwash : pipe.mode !== 'backwash';
                  const rev = bw && pipe.reversibleInBackwash;
                  const bwPipe = pipe.mode === 'backwash' || rev;
                  const hasFlow = active && metrics.flowRate > 0;
                  return (
                    <g key={pipe.id}>
                      <path d={path} fill="none" stroke="#071a30" strokeWidth="20" strokeLinecap="round"/>
                      <path d={path} fill="none" stroke="#0d2a48" strokeWidth="14" strokeLinecap="round"/>
                      <path d={path} fill="none" stroke="#122038" strokeWidth="8" strokeLinecap="round"/>
                      {hasFlow && (
                        <path d={path} fill="none"
                          stroke={bwPipe ? '#f09030' : '#4ac8ff'}
                          strokeWidth="7" strokeLinecap="round"
                          className={rev ? 'wc-flow wc-flow-reverse' : 'wc-flow'}
                          style={{ animationDuration: `${flowDuration}s` }}
                          filter="url(#wcGlowM)"/>
                      )}
                    </g>
                  );
                })}

                {/* Flow direction arrows on left return pipe */}
                {metrics.flowRate > 0 && <>
                  <line x1="20" y1="530" x2="20" y2="488" stroke="#4ac8ff" strokeWidth="2" opacity="0.5" markerEnd="url(#arrowUpM)"/>
                  <line x1="20" y1="410" x2="20" y2="335" stroke="#4ac8ff" strokeWidth="2" opacity="0.5" markerEnd="url(#arrowUpM)"/>
                  <line x1="20" y1="235" x2="20" y2="145" stroke="#4ac8ff" strokeWidth="2" opacity="0.5" markerEnd="url(#arrowUpM)"/>
                  <line x1="356" y1="165" x2="356" y2="200" stroke="#4ac8ff" strokeWidth="2" opacity="0.5" markerEnd="url(#arrowDnM)"/>
                  <line x1="356" y1="280" x2="356" y2="310" stroke="#4ac8ff" strokeWidth="2" opacity="0.5" markerEnd="url(#arrowDnM)"/>
                </>}

                {/* ══════════════ BECKEN ══════════════ */}
                <g onClick={() => chooseStation('becken')} style={{ cursor: 'pointer' }}>
                  <rect x="10" y="15" width="268" height="82" rx="5"
                    fill="#050e1c"
                    stroke={selectedStationId === 'becken' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  {/* Water fill */}
                  <rect x="18" y="52" width="252" height="37" rx="2" fill="url(#wcWaterM)"/>
                  {/* Surface wave */}
                  <path d="M18 58 Q64 48 110 58 Q156 68 202 52 Q238 42 270 55"
                    fill="none" stroke="#5ad0ff" strokeWidth="1.8"
                    className="wc-surface" opacity="0.8"/>
                  {/* Nozzles + jets */}
                  {[100, 195].map(nx => (
                    <g key={nx}>
                      <rect x={nx - 10} y="94" width="20" height="5" rx="2"
                        fill="#3a80c0" fillOpacity="0.5" stroke="#4a9eff" strokeWidth="0.8"/>
                      {metrics.flowRate > 0 && <>
                        <line x1={nx - 4} y1="93" x2={nx - 4} y2="82" stroke="#4ac8ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" className="wc-flow"/>
                        <line x1={nx}     y1="93" x2={nx}     y2="80" stroke="#4ac8ff" strokeWidth="2"   strokeDasharray="3 3" opacity="0.9" className="wc-flow" filter="url(#wcGlowSM)"/>
                        <line x1={nx + 4} y1="93" x2={nx + 4} y2="82" stroke="#4ac8ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" className="wc-flow"/>
                      </>}
                    </g>
                  ))}
                  {/* Overflow notch */}
                  <rect x="274" y="18" width="10" height="79" rx="2" fill="#040c1a" stroke="#1a3a5a" strokeWidth="1"/>
                  <rect x="276" y="24" width="6" height="62" rx="1" fill="#1060a0" fillOpacity="0.35"/>
                  {/* Overflow animated drops */}
                  {metrics.flowRate > 0 && <>
                    <circle cx="280" cy="54" r="2.5" fill="#4ac8ff" opacity="0.8" filter="url(#wcGlowSM)">
                      <animate attributeName="cy" values="54;86;86" dur="1.2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.9;0.5;0" dur="1.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="280" cy="54" r="2" fill="#4ac8ff" opacity="0.7">
                      <animate attributeName="cy" values="54;86;86" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.9;0.4;0" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="280" cy="54" r="1.8" fill="#38b0ff" opacity="0.6">
                      <animate attributeName="cy" values="54;86;86" dur="1.2s" begin="0.8s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.8;0.3;0" dur="1.2s" begin="0.8s" repeatCount="indefinite"/>
                    </circle>
                  </>}
                  <text x="14" y="34" fill="#5a8090" fontSize="9" fontFamily="monospace" letterSpacing="1.5">SCHWIMMBECKEN</text>
                  <text x="14" y="45" fill="#2a4060" fontSize="7" fontFamily="monospace">BODENEINSTRÖMUNG · DIN 19643</text>
                  <text x="278" y="26" fill="#1a4060" fontSize="6.5" fontFamily="monospace" transform="rotate(90,278,26)">ÜBERLAUF</text>
                  <text x="147" y="111" fill="#1a4060" fontSize="6.5" fontFamily="monospace" textAnchor="middle">EINSTRÖMDÜSEN</text>
                </g>

                {/* ══════════════ SCHWALL ══════════════ */}
                <g onClick={() => chooseStation('schwall')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="356" cy="115" rx="36" ry="10" fill="#060f22" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="320" y="115" width="72" height="107" fill="#060f22" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  {/* Water level fill */}
                  <rect x="322" y={115 + Math.max(0, 107 - metrics.surgeLevel * 1.07)} width="68"
                    height={Math.max(0, metrics.surgeLevel * 1.07)} rx="2" fill="#1060a0" fillOpacity="0.4"/>
                  {/* Wave on water surface */}
                  {metrics.surgeLevel > 5 && metrics.flowRate > 0 && (
                    <path d={"M 322 " + (115+107-metrics.surgeLevel*1.07+3) + " Q 340 " + (115+107-metrics.surgeLevel*1.07-2) + " 356 " + (115+107-metrics.surgeLevel*1.07+3) + " Q 372 " + (115+107-metrics.surgeLevel*1.07+8) + " 390 " + (115+107-metrics.surgeLevel*1.07+3)}
                      fill="none" stroke="#4ac8ff" strokeWidth="1.5" opacity="0.5" className="wc-surface"/>
                  )}
                  <ellipse cx="356" cy="222" rx="36" ry="10" fill="#060f22" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  {/* Level gauge bar right side */}
                  <rect x="392" y="117" width="5" height="103" rx="2" fill="#0a2030"/>
                  <rect x="392" y={117 + Math.max(0, 103 - metrics.surgeLevel * 1.03)} width="5"
                    height={Math.max(0, metrics.surgeLevel * 1.03)} fill="#4a9eff" fillOpacity="0.7" rx="2"/>
                  <text x="356" y="104" fill="#5a8090" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">SCHWALL</text>
                  <text x="356" y="174" fill="#4ac8ff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{metrics.surgeLevel}%</text>
                  <text x="356" y="187" fill="#2a5070" fontSize="6.5" fontFamily="monospace" textAnchor="middle">FÜLLSTAND</text>
                </g>

                {/* ══════════════ V1 VALVE ══════════════ */}
                <g onClick={e => { e.stopPropagation(); toggleControl('rawValveOpen'); }} style={{ cursor: 'pointer' }}>
                  <circle cx="356" cy="240" r="11" fill={controls.rawValveOpen ? '#0c2e0c' : '#2e0c0c'} stroke={controls.rawValveOpen ? '#34c090' : '#d04040'} strokeWidth="1.8"/>
                  <text x="356" y="244" fill={controls.rawValveOpen ? '#34c090' : '#d04040'} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">V1</text>
                </g>

                {/* ══════════════ PUMPE ══════════════ */}
                <g onClick={() => chooseStation('pumpe')} style={{ cursor: 'pointer' }}>
                  <circle cx="356" cy="292" r="34" fill="#060f22" stroke={selectedStationId === 'pumpe' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <g className={controls.pumpEnabled ? 'wc-impeller' : ''} style={{ transformOrigin: '356px 292px' }}>
                    {[0,60,120,180,240,300].map(deg => {
                      const rd = (deg * Math.PI) / 180;
                      return <line key={deg} x1="356" y1="292" x2={356 + 26 * Math.cos(rd)} y2={292 + 26 * Math.sin(rd)} stroke="#4ac8ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>;
                    })}
                    <circle cx="356" cy="292" r="7" fill="#060f22" stroke="#4ac8ff" strokeWidth="1.5"/>
                  </g>
                  {symptomFlags.has('pumpBubbles') && <>
                    <circle cx="342" cy="278" r="3" fill="#60c0ff" className="wc-bubble"/>
                    <circle cx="352" cy="285" r="2" fill="#40b0ff" className="wc-bubble" style={{ animationDelay: '0.3s' }}/>
                  </>}
                  <text x="356" y="246" fill="#5a8090" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">UMWÄLZPUMPE</text>
                  <text x="356" y="256" fill={controls.pumpEnabled ? '#34c090' : '#d04040'} fontSize="7" fontFamily="monospace" textAnchor="middle">{controls.pumpEnabled ? '● BETRIEB' : '○ AUS'}</text>
                  {/* V3 side valve */}
                  <g onClick={e => { e.stopPropagation(); toggleControl('ventValveOpen'); }} style={{ cursor: 'pointer' }}>
                    <circle cx="386" cy="278" r="10" fill={controls.ventValveOpen ? '#0c2e0c' : '#2e0c0c'} stroke={controls.ventValveOpen ? '#34c090' : '#d04040'} strokeWidth="1.5"/>
                    <text x="386" y="282" fill={controls.ventValveOpen ? '#34c090' : '#d04040'} fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">V3</text>
                  </g>
                </g>

                {/* ══════════════ FLOCKUNG ══════════════ */}
                <g onClick={() => chooseStation('flockung')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="356" cy="348" rx="24" ry="7" fill="#060f22" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="332" y="347" width="48" height="53" fill="#060f22" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <path d="M 332 400 L 356 414 L 380 400 Z" fill="#060f22" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  {/* Flockung particles inside vessel */}
                  {[{cx:340,cy:362},{cx:352,cy:370},{cx:364,cy:358},{cx:345,cy:378},{cx:368,cy:374}].map((p,i) => (
                    <circle key={i} cx={p.cx} cy={p.cy} r="1.5" fill="#6ab0d0" opacity="0.45">
                      <animate attributeName="cy" values={p.cy + ";" + (p.cy - 3) + ";" + p.cy} dur={(1.8 + i * 0.2) + "s"} repeatCount="indefinite"/>
                    </circle>
                  ))}
                  {/* Flockungsmittel dropper (Al₂(SO₄)₃ – yellow-green) */}
                  <rect x="306" y="358" width="26" height="20" rx="3" fill="#0a1e08" stroke="#5a8020" strokeWidth="1.2"/>
                  <text x="319" y="371" fill="#80b020" fontSize="5.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Al₂SO₄</text>
                  <line x1="332" y1="368" x2="320" y2="368" stroke="#5a8020" strokeWidth="1" strokeDasharray="2 2"/>
                  {controls.disinfectPumpEnabled && metrics.flowRate > 0 && <>
                    <circle cx="334" cy="356" r="2.2" fill="#90c030" opacity="0.85" filter="url(#wcGlowSM)">
                      <animate attributeName="cy" values="356;370;370" dur="1.4s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.9;0.5;0" dur="1.4s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="334" cy="356" r="1.8" fill="#80b828" opacity="0.7">
                      <animate attributeName="cy" values="356;370;370" dur="1.4s" begin="0.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.9;0.4;0" dur="1.4s" begin="0.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="334" cy="356" r="1.5" fill="#a0d038" opacity="0.6">
                      <animate attributeName="cy" values="356;370;370" dur="1.4s" begin="0.9s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.8;0.3;0" dur="1.4s" begin="0.9s" repeatCount="indefinite"/>
                    </circle>
                  </>}
                  <text x="356" y="338" fill="#5a8090" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">FLOCKUNG</text>
                </g>

                {/* ══════════════ FILTER ══════════════ */}
                <g onClick={() => chooseStation('filter')} style={{ cursor: 'pointer' }}>
                  <text x="356" y="410" fill="#2a6090" fontSize="6.5" fontFamily="monospace" textAnchor="middle">{filterMode === 'vertikal' ? 'VERTIKAL ↕' : 'HORIZONTAL ↔'}</text>
                  {/* Verteilerhaube / distribution dome at top */}
                  <ellipse cx="356" cy="422" rx="36" ry="10"
                    fill="#060f22"
                    stroke={selectedStationId === 'filter' ? '#4a9eff' : symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a'}
                    strokeWidth="1.5"/>
                  {/* Spray distribution lines from dome */}
                  {metrics.flowRate > 0 && !controls.backwashMode && [
                    [340,444],[348,440],[356,446],[364,440],[372,444]
                  ].map(([fx,fy],i) => (
                    <line key={i} x1="356" y1="430" x2={fx} y2={fy}
                      stroke="#4ac8ff" strokeWidth="1.2" opacity="0.45"
                      strokeDasharray="3 3" className="wc-flow"
                      style={{ animationDuration: '1.2s', animationDelay: `${i * 0.15}s` }}/>
                  ))}
                  <rect x="320" y="422" width="72" height="171"
                    fill="#060f22"
                    stroke={selectedStationId === 'filter' ? '#4a9eff' : symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a'}
                    strokeWidth="1.5"/>
                  {/* Filter layers */}
                  <rect x="322" y="436" width="68" height="44" fill="#2a4030" fillOpacity={xrayMode ? 0.9 : 0.5}/>
                  <rect x="322" y="480" width="68" height="54" fill="#384818" fillOpacity={xrayMode ? 0.9 : 0.5}/>
                  <rect x="322" y="534" width="68" height="52" fill="#1a2838" fillOpacity={xrayMode ? 0.9 : 0.5}/>
                  <line x1="320" y1="480" x2="392" y2="480" stroke="#1a3a5a" strokeWidth="0.8" strokeDasharray="3 2.5"/>
                  <line x1="320" y1="534" x2="392" y2="534" stroke="#1a3a5a" strokeWidth="0.8" strokeDasharray="3 2.5"/>
                  {!xrayMode && <>
                    <text x="356" y="462" fill="#2a5040" fontSize="6.5" fontFamily="monospace" textAnchor="middle">QUARZKIES</text>
                    <text x="356" y="510" fill="#4a6020" fontSize="6.5" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                    <text x="356" y="562" fill="#2a4058" fontSize="6.5" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                  </>}
                  {xrayMode && <>
                    <text x="356" y="462" fill="#60c090" fontSize="6.5" fontFamily="monospace" textAnchor="middle">QUARZKIES</text>
                    <text x="356" y="510" fill="#90c060" fontSize="6.5" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                    <text x="356" y="562" fill="#6080a0" fontSize="6.5" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                  </>}
                  {/* Vertical flow arrow inside filter */}
                  <line x1="356" y1="444" x2="356" y2="576" stroke="#4a9eff" strokeWidth="1" strokeDasharray="5 5" opacity="0.18"/>
                  <polygon points="352,574 356,584 360,574" fill="#4a9eff" opacity="0.22"/>
                  {/* dP differential pressure gauge */}
                  <circle cx="400" cy="508" r="17"
                    fill={metrics.differentialPressure > 0.5 ? '#3a0808' : '#081808'}
                    stroke={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} strokeWidth="1.5"/>
                  <text x="400" y="505" fill={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">dP</text>
                  <text x="400" y="515" fill={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} fontSize="5.5" fontFamily="monospace" textAnchor="middle">{metrics.differentialPressure}</text>
                  <ellipse cx="356" cy="593" rx="36" ry="10" fill="#060f22" stroke={selectedStationId === 'filter' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <text x="356" y="416" fill="#5a8090" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">FILTER</text>
                  {symptomFlags.has('filterTurbidity') && <text x="356" y="612" fill="#d04040" fontSize="6.5" fontFamily="monospace" textAnchor="middle">⚠ TRÜBUNG</text>}
                </g>

                {/* ══════════════ V4 backwash valve ══════════════ */}
                <g onClick={e => { e.stopPropagation(); toggleControl('backwashValveOpen'); }} style={{ cursor: 'pointer' }}>
                  <circle cx="356" cy="616" r="11" fill={controls.backwashValveOpen ? '#0c2e0c' : '#2e0c0c'} stroke={controls.backwashValveOpen ? '#34c090' : '#d04040'} strokeWidth="1.8"/>
                  <text x="356" y="620" fill={controls.backwashValveOpen ? '#34c090' : '#d04040'} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">V4</text>
                </g>

                {/* ══════════════ BOTTOM RETURN PIPE LABEL ══════════════ */}
                <text x="170" y="617" fill="#1a4070" fontSize="6.5" fontFamily="monospace" textAnchor="middle">←── RÜCKLAUF INS BECKEN ──←</text>

                {/* ══════════════ HEIZUNG / WÄRMETAUSCHER ══════════════ */}
                <g onClick={() => chooseStation('heizung')} style={{ cursor: 'pointer' }}>
                  {/* Connection stubs from left pipe into heizung */}
                  <line x1="20" y1="385" x2="35" y2="385" stroke="#2a5070" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="20" y1="430" x2="35" y2="430" stroke="#2a5070" strokeWidth="3" strokeLinecap="round"/>
                  <rect x="35" y="370" width="113" height="72" rx="4"
                    fill="#060f22"
                    stroke={selectedStationId === 'heizung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  {/* Heat plates – alternating hot/cold */}
                  {[381,390,399,408,417,424].map((hy, i) => (
                    <line key={hy} x1="43" y1={hy} x2="140" y2={hy}
                      stroke={i % 2 === 0 ? '#b04020' : '#204070'}
                      strokeWidth="3" opacity={0.55 + (metrics.temperature - 24) * 0.01}>
                      {i % 2 === 0 && metrics.flowRate > 0 && (
                        <animate attributeName="opacity" values="0.5;0.85;0.5" dur="1.8s" repeatCount="indefinite" begin={(i * 0.15) + "s"}/>
                      )}
                    </line>
                  ))}
                  <text x="87" y="360" fill="#5a8090" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8">WÄRMETAUSCHER</text>
                  <text x="87" y="456" fill={temperatureInRange ? '#34c090' : '#d09030'} fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{metrics.temperature} °C</text>
                </g>

                {/* ══════════════ DESINFEKTION ══════════════ */}
                <g onClick={() => chooseStation('desinfektion')} style={{ cursor: 'pointer' }}>
                  {/* NaOCl tank */}
                  <ellipse cx="62" cy="467" rx="24" ry="6" fill="#060f22" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="38" y="465" width="48" height="72" fill="#060f22" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="41" y="477" width="42" height="52" fill="#001080" fillOpacity="0.2" rx="2"/>
                  <text x="62" y="505" fill="#4a8ad0" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NaOCl</text>
                  {/* CO₂ tank */}
                  <ellipse cx="118" cy="467" rx="22" ry="6" fill="#060f22" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="96" y="465" width="44" height="72" fill="#060f22" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="99" y="477" width="38" height="52" fill="#400010" fillOpacity="0.2" rx="2"/>
                  <text x="118" y="505" fill="#c09040" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CO₂</text>
                  {/* NaOCl injection → left pipe (yellow-green pulse) */}
                  {controls.disinfectPumpEnabled && metrics.flowRate > 0 && <>
                    <line x1="38" y1="500" x2="22" y2="500"
                      stroke="#60c0ff" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray="4 4"
                      className="wc-flow wc-flow-reverse"
                      style={{ animationDuration: '0.8s' }} filter="url(#wcGlowSM)"/>
                    {/* CO₂ bubbles going up into pipe */}
                    <circle cx="115" cy="465" r="2.5" fill="#ff9040" opacity="0.7">
                      <animate attributeName="cy" values="465;450;450" dur="1.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.8;0.3;0" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="110" cy="465" r="2" fill="#ffb060" opacity="0.6">
                      <animate attributeName="cy" values="465;450;450" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.7;0.2;0" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
                    </circle>
                  </>}
                  {/* Injection dot on left pipe */}
                  <circle cx="20" cy="500" r="5"
                    fill={chlorInRange ? '#102a10' : '#3a1010'}
                    stroke={chlorInRange ? '#34c090' : '#d04040'} strokeWidth="1.5">
                    <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <text x="87" y="456" fill="#5a8090" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8">DESINFEKTION</text>
                  <text x="87" y="553" fill={chlorInRange ? '#34c090' : '#d04040'} fontSize="7" fontFamily="monospace" textAnchor="middle">{metrics.freeChlorine} mg/L Cl₂</text>
                </g>

                {/* ══════════════ RÜCKLAUF label ══════════════ */}
                <g onClick={() => chooseStation('ruecklauf')} style={{ cursor: 'pointer' }}>
                  <rect x="35" y="270" width="82" height="28" rx="4"
                    fill="#060f22"
                    stroke={selectedStationId === 'ruecklauf' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.2"/>
                  <text x="76" y="288" fill="#5a8090" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8">RÜCKLAUF</text>
                </g>

                {/* V2 return valve */}
                <g onClick={e => { e.stopPropagation(); toggleControl('returnValveOpen'); }} style={{ cursor: 'pointer' }}>
                  <circle cx="20" cy="183" r="11" fill={controls.returnValveOpen ? '#0c2e0c' : '#2e0c0c'} stroke={controls.returnValveOpen ? '#34c090' : '#d04040'} strokeWidth="1.8"/>
                  <text x="20" y="187" fill={controls.returnValveOpen ? '#34c090' : '#d04040'} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">V2</text>
                </g>

                {/* ══════════════ KANAL ══════════════ */}
                <rect x="350" y="752" width="65" height="24" rx="4" fill="#060f22" stroke="#1a3a5a" strokeWidth="1.2"/>
                <text x="382" y="768" fill="#2a4060" fontSize="6.5" fontFamily="monospace" textAnchor="middle">KANAL</text>

              </svg>
            </div>
          </div>

                    {/* Main blueprint SVG */}
          <div className="rounded-2xl overflow-hidden shadow-2xl hidden sm:block" style={{ border: '1px solid #1a3a5a' }}>
            <div className="overflow-x-auto" style={{ background: '#040d1a' }}>
              <svg className="min-w-[820px] w-full" viewBox="0 0 1160 720" style={{ display: 'block' }}>
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
                <text x="30" y="35" fill="#3a6080" fontSize="9" fontFamily="monospace" letterSpacing="2">BECKENWASSERAUFBEREITUNG · HYDRAULIK-SCHAUBILD · DIN 19643</text>

                {/* Focus ring */}
                <g pointerEvents="none">
                  <circle cx={stationFocus.x} cy={stationFocus.y} r={stationFocus.r} fill="none" stroke="#4a9eff" strokeWidth="10" opacity="0.07"/>
                  <circle cx={stationFocus.x} cy={stationFocus.y} r={stationFocus.r} fill="none" stroke="#4a9eff" strokeWidth="2" className="wc-pulse" opacity="0.55"/>
                </g>

                {/* ── PIPES ── */}
                {pipeStates.map(pipe => (
                  <g key={pipe.id}>
                    <path d={pipe.path} fill="none" stroke="#06141f" strokeWidth="28" strokeLinecap="round"/>
                    <path d={pipe.path} fill="none" stroke="#1d4060" strokeWidth="20" strokeLinecap="round"/>
                    <path d={pipe.path} fill="none" stroke="#0c2236" strokeWidth="12" strokeLinecap="round"/>
                    {pipe.hasFlow && (
                      <path d={pipe.path} fill="none"
                        stroke={pipe.backwash ? 'url(#wcBackwash)' : 'url(#wcFlow)'}
                        strokeWidth="7" strokeLinecap="round"
                        className={`wc-flow${pipe.reverse ? ' wc-flow-reverse' : ''}`}
                        style={{ animationDuration: `${flowDuration}s` }}
                        filter="url(#wcGlow)"/>
                    )}
                  </g>
                ))}

                {/* ── BECKEN (pool cross-section, left column) ── */}
                <g className="wc-station" onClick={() => chooseStation('becken')} style={{ cursor: 'pointer' }}>
                  <rect x="25" y="45" width="265" height="480" rx="6" fill="#050e1c" stroke={selectedStationId === 'becken' ? '#4a9eff' : '#1a3a5a'} strokeWidth="2"/>
                  <rect x="35" y="195" width="245" height="320" rx="3" fill="url(#wcWaterFill)"/>
                  <path d="M35 203 Q78 191 120 203 Q162 215 205 197 Q238 185 280 200" fill="none" stroke="#4ab0ff" strokeWidth="1.8" className="wc-surface" opacity="0.75"/>
                  {[90, 145, 200].map((nx, ni) => (
                    <g key={nx}>
                      <rect x={nx-11} y="511" width="22" height="8" rx="2" fill="#1a4a80" fillOpacity="0.6" stroke="#4a9eff" strokeWidth="1"/>
                      {metrics.flowRate > 0 && <>
                        <line x1={nx-5} y1="510" x2={nx-5} y2="492" stroke="#4ac8ff" strokeWidth="2" strokeDasharray="5 4" opacity="0.65" className="wc-flow" style={{ animationDuration: `${flowDuration}s`, animationDelay: `${ni * 0.15}s` }}/>
                        <line x1={nx}   y1="510" x2={nx}   y2="488" stroke="#4ac8ff" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.9" className="wc-flow" style={{ animationDuration: `${flowDuration}s`, animationDelay: `${ni * 0.15 + 0.2}s` }} filter="url(#wcGlow)"/>
                        <line x1={nx+5} y1="510" x2={nx+5} y2="492" stroke="#4ac8ff" strokeWidth="2" strokeDasharray="5 4" opacity="0.65" className="wc-flow" style={{ animationDuration: `${flowDuration}s`, animationDelay: `${ni * 0.15 + 0.4}s` }}/>
                      </>}
                    </g>
                  ))}
                  <rect x="278" y="96" width="12" height="80" rx="3" fill="#050e1c" stroke="#1a3a5a" strokeWidth="1"/>
                  <rect x="280" y="103" width="8" height="62" rx="1" fill="#1060a0" fillOpacity="0.4"/>
                  <text x="40" y="68" fill="#5a8090" fontSize="9" fontFamily="monospace" letterSpacing="1.5">SCHWIMMBECKEN</text>
                  <text x="40" y="81" fill="#2a4060" fontSize="7" fontFamily="monospace">QUERSCHNITT · BODENEINSTRÖMUNG</text>
                  <text x="289" y="97" fill="#2a4060" fontSize="7" fontFamily="monospace" transform="rotate(90,289,97)">ÜBERLAUFRINNE</text>
                  <text x="155" y="533" fill="#2a5070" fontSize="7" fontFamily="monospace" textAnchor="middle">EINSTRÖMDÜSEN</text>
                  <text x="157" y="175" fill="#0a1f38" fontSize="22" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.5">BECKEN</text>
                </g>

                {/* ── ÜBERLAUF click zone ── */}
                <g onClick={() => chooseStation('ueberlauf')} style={{ cursor: 'pointer' }}>
                  <rect x="278" y="93" width="72" height="52" rx="3" fill="transparent" stroke={selectedStationId === 'ueberlauf' ? '#4a9eff' : 'transparent'} strokeWidth="1.5"/>
                  <text x="356" y="108" fill="#2a5070" fontSize="7" fontFamily="monospace">ÜBERLAUF →</text>
                </g>

                {/* ── SCHWALL (cylinder, top-center) ── */}
                <g className="wc-station" onClick={() => chooseStation('schwall')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="500" cy="100" rx="65" ry="16" fill="#060f22" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="435" y="100" width="130" height="178" fill="#060f22" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="437" y={100 + (178 - metrics.surgeLevel * 1.78)} width="126" height={metrics.surgeLevel * 1.78} rx="2" fill="#1060a0" fillOpacity="0.45"/>
                  <ellipse cx="500" cy="278" rx="65" ry="16" fill="#060f22" stroke={selectedStationId === 'schwall' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="572" y="104" width="6" height="170" fill="#0e2540" rx="2"/>
                  <rect x="572" y={104 + (170 - metrics.surgeLevel * 1.70)} width="6" height={metrics.surgeLevel * 1.70} fill="#4a9eff" fillOpacity="0.7" rx="2"/>
                  <text x="500" y="87" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">SCHWALL</text>
                  <text x="500" y="203" fill="#4a9eff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{metrics.surgeLevel}%</text>
                </g>

                {/* ── PUMPE ── */}
                <g className="wc-station" onClick={() => chooseStation('pumpe')} style={{ cursor: 'pointer' }}>
                  <circle cx="500" cy="375" r="55" fill="#060f22" stroke={selectedStationId === 'pumpe' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <path d="M500 375 Q534 349 538 375 Q542 407 518 423 Q494 437 472 415 Q446 391 454 359 Q462 329 494 324 Q528 319 542 349"
                    fill="none" stroke="#142840" strokeWidth="8" strokeLinecap="round"/>
                  <g className={controls.pumpEnabled ? 'wc-impeller' : ''} style={{ transformOrigin: '500px 375px' }}>
                    {[0, 60, 120, 180, 240, 300].map(deg => {
                      const rad = (deg * Math.PI) / 180;
                      return <line key={deg} x1="500" y1="375" x2={500 + 34 * Math.cos(rad)} y2={375 + 34 * Math.sin(rad)} stroke="#4a9eff" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>;
                    })}
                    <circle cx="500" cy="375" r="9" fill="#060f22" stroke="#4a9eff" strokeWidth="1.5"/>
                  </g>
                  <rect x="476" y="430" width="48" height="20" fill="#060f22" stroke="#1a3a5a" strokeWidth="1.2" rx="4"/>
                  {symptomFlags.has('pumpBubbles') && (<>
                    <circle cx="476" cy="355" r="3.5" fill="#60c0ff" className="wc-bubble"/>
                    <circle cx="488" cy="367" r="2.5" fill="#40b0ff" className="wc-bubble" style={{ animationDelay: '0.3s' }}/>
                  </>)}
                  <text x="500" y="323" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">UMWÄLZPUMPE</text>
                  <text x="500" y="335" fill={controls.pumpEnabled ? '#34c090' : '#d04040'} fontSize="7.5" fontFamily="monospace" textAnchor="middle">{controls.pumpEnabled ? '● BETRIEB' : '○ AUS'}</text>
                </g>

                {/* ── FLOCKUNG (dosing vessel on upward pressure pipe at x=635) ── */}
                <g className="wc-station" onClick={() => chooseStation('flockung')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="680" cy="245" rx="28" ry="8" fill="#060f22" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="652" y="243" width="56" height="70" fill="#060f22" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <path d="M652 313 L680 330 L708 313 Z" fill="#060f22" stroke={selectedStationId === 'flockung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  {[664, 678, 692, 670, 686].map((fx, i) => (
                    <circle key={i} cx={fx} cy={254 + (i%3)*10} r={1.5} fill="#6ab0d0" opacity="0.45">
                      <animate attributeName="cy" values={`${254+(i%3)*10};${250+(i%3)*10};${254+(i%3)*10}`} dur={`${1.8+i*0.2}s`} repeatCount="indefinite"/>
                    </circle>
                  ))}
                  <line x1="652" y1="284" x2="638" y2="284" stroke="#4a9eff" strokeWidth="2" strokeDasharray="3 2" opacity="0.6"/>
                  <polygon points="639,280 631,284 639,288" fill="#4a9eff" opacity="0.6"/>
                  <text x="680" y="233" fill="#5a8090" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">FLOCKUNG</text>
                  <text x="715" y="282" fill="#2a4060" fontSize="6.5" fontFamily="monospace">FLM</text>
                </g>

                {/* ── FILTER (vertical or horizontal depending on filterMode) ── */}
                {filterMode === 'vertikal' ? (
                  <g className="wc-station" onClick={() => chooseStation('filter')} style={{ cursor: 'pointer' }}>
                    <text x="825" y="82" fill="#2a6090" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="1">VERTIKALDURCHSTRÖMUNG ↕</text>
                    {/* Top ellipse – Verteilerhaube */}
                    <ellipse cx="825" cy="100" rx="65" ry="16" fill="#060f22" stroke={selectedStationId === 'filter' ? '#4a9eff' : (symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a')} strokeWidth="1.5"/>
                    {/* Verteilerhaube label + pointer */}
                    <line x1="762" y1="107" x2="744" y2="107" stroke="#2a5070" strokeWidth="0.8"/>
                    <text x="741" y="110" fill="#3a7090" fontSize="6" fontFamily="monospace" textAnchor="end">VERTEILERHAUBE</text>
                    {/* Distribution spray from dome when pump running */}
                    {metrics.flowRate > 0 && !controls.backwashMode && [780, 797, 825, 853, 870].map((fx, i) => (
                      <line key={i} x1="825" y1="115" x2={fx} y2={138}
                        stroke="#4ac8ff" strokeWidth="1.3" opacity="0.38"
                        strokeDasharray="4 3" className="wc-flow"
                        style={{ animationDuration: '1.3s', animationDelay: `${i * 0.12}s` }}/>
                    ))}
                    {/* Filter body */}
                    <rect x="760" y="100" width="130" height="415" fill="#060f22" stroke={selectedStationId === 'filter' ? '#4a9eff' : (symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a')} strokeWidth="1.5"/>
                    {/* Filter layers */}
                    <rect x="762" y="118" width="126" height="115" fill="#2a4030" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    <rect x="762" y="233" width="126" height="135" fill="#38481a" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    <rect x="762" y="368" width="126" height="115" fill="#1a2838" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    {/* Düsenboden strip */}
                    <rect x="762" y="483" width="126" height="14" fill="#0e2030" fillOpacity={xrayMode ? 0.9 : 0.65} stroke="#2a4870" strokeWidth="0.8" strokeDasharray="3 2.5"/>
                    {[778, 795, 812, 825, 838, 855, 872].map((dx) => (
                      <circle key={dx} cx={dx} cy={490} r="2.5" fill="#1a3a5a" stroke="#2a5880" strokeWidth="0.8"/>
                    ))}
                    {/* Düsenboden label + pointer */}
                    <line x1="762" y1="490" x2="744" y2="490" stroke="#2a5070" strokeWidth="0.8"/>
                    <text x="741" y="493" fill="#3a7090" fontSize="6" fontFamily="monospace" textAnchor="end">DÜSENBODEN</text>
                    {!xrayMode && (<>
                      <line x1="762" y1="233" x2="888" y2="233" stroke="#1a3a5a" strokeWidth="1" strokeDasharray="4 3"/>
                      <line x1="762" y1="368" x2="888" y2="368" stroke="#1a3a5a" strokeWidth="1" strokeDasharray="4 3"/>
                      <line x1="762" y1="483" x2="888" y2="483" stroke="#1a3a5a" strokeWidth="0.8" strokeDasharray="3 2.5"/>
                      <text x="825" y="170" fill="#2a5040" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZKIES</text>
                      <text x="825" y="181" fill="#1a3a30" fontSize="5.5" fontFamily="monospace" textAnchor="middle">4 – 16 mm · Stützschicht</text>
                      <text x="825" y="294" fill="#4a6020" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                      <text x="825" y="305" fill="#2a4010" fontSize="5.5" fontFamily="monospace" textAnchor="middle">0,4 – 1,6 mm · Hauptfilter</text>
                      <text x="825" y="419" fill="#2a4058" fontSize="7" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                      <text x="825" y="430" fill="#1a3050" fontSize="5.5" fontFamily="monospace" textAnchor="middle">0,8 – 1,6 mm · Geruch/Org.</text>
                    </>)}
                    {xrayMode && (<>
                      <text x="825" y="170" fill="#60c090" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZKIES 4–16mm</text>
                      <text x="825" y="294" fill="#90c060" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZSAND 0,4–1,6mm</text>
                      <text x="825" y="419" fill="#6080a0" fontSize="7" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE 0,8–1,6mm</text>
                    </>)}
                    {/* Center downward flow arrow */}
                    <line x1="825" y1="130" x2="825" y2="476" stroke="#4a9eff" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.22"/>
                    <polygon points="820,474 825,487 830,474" fill="#4a9eff" opacity="0.28"/>
                    {/* Backwash upward arrow */}
                    {controls.backwashMode && (
                      <line x1="825" y1="476" x2="825" y2="130" stroke="#f09030" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.32" className="wc-flow wc-flow-reverse"/>
                    )}
                    {/* Bottom ellipse */}
                    <ellipse cx="825" cy="515" rx="65" ry="16" fill="#060f22" stroke={selectedStationId === 'filter' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                    {/* dP gauge */}
                    <circle cx="912" cy="310" r="18" fill={metrics.differentialPressure > 0.5 ? '#3a0808' : '#081808'} stroke={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} strokeWidth="1.5"/>
                    <text x="912" y="307" fill={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">dP</text>
                    <text x="912" y="318" fill={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} fontSize="6.5" fontFamily="monospace" textAnchor="middle">{metrics.differentialPressure}</text>
                    <text x="825" y="70" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">FILTER</text>
                    {symptomFlags.has('filterTurbidity') && <text x="825" y="540" fill="#d04040" fontSize="7" fontFamily="monospace" textAnchor="middle">⚠ TRÜBUNG</text>}
                  </g>
                ) : (
                  <g className="wc-station" onClick={() => chooseStation('filter')} style={{ cursor: 'pointer' }}>
                    <text x="835" y="248" fill="#2a6090" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="1">HORIZONTALDURCHSTRÖMUNG ↔</text>
                    <ellipse cx="645" cy="330" rx="16" ry="75" fill="#060f22" stroke={selectedStationId === 'filter' ? '#4a9eff' : (symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a')} strokeWidth="1.5"/>
                    <rect x="645" y="255" width="380" height="150" fill="#060f22" stroke={selectedStationId === 'filter' ? '#4a9eff' : (symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a')} strokeWidth="1.5"/>
                    <rect x="660" y="257" width="112" height="146" fill="#2a4030" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    <rect x="772" y="257" width="124" height="146" fill="#38481a" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    <rect x="896" y="257" width="118" height="146" fill="#1a2838" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    {!xrayMode && (<>
                      <line x1="772" y1="257" x2="772" y2="405" stroke="#1a3a5a" strokeWidth="1" strokeDasharray="4 3"/>
                      <line x1="896" y1="257" x2="896" y2="405" stroke="#1a3a5a" strokeWidth="1" strokeDasharray="4 3"/>
                      <text x="716" y="335" fill="#2a5040" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZKIES</text>
                      <text x="834" y="335" fill="#4a6020" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                      <text x="955" y="335" fill="#2a4058" fontSize="7" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                    </>)}
                    {xrayMode && (<>
                      <text x="716" y="335" fill="#60c090" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZKIES</text>
                      <text x="834" y="335" fill="#90c060" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                      <text x="955" y="335" fill="#6080a0" fontSize="7" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                    </>)}
                    <line x1="665" y1="330" x2="1005" y2="330" stroke="#4a9eff" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.22"/>
                    <polygon points="1000,325 1015,330 1000,335" fill="#4a9eff" opacity="0.28"/>
                    <ellipse cx="1025" cy="330" rx="16" ry="75" fill="#060f22" stroke={selectedStationId === 'filter' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                    <circle cx="835" cy="428" r="18" fill={metrics.differentialPressure > 0.5 ? '#3a0808' : '#081808'} stroke={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} strokeWidth="1.5"/>
                    <text x="835" y="425" fill={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">dP</text>
                    <text x="835" y="436" fill={metrics.differentialPressure > 0.5 ? '#d04040' : '#34c090'} fontSize="6.5" fontFamily="monospace" textAnchor="middle">{metrics.differentialPressure}</text>
                    <text x="835" y="240" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">FILTER</text>
                    {symptomFlags.has('filterTurbidity') && <text x="835" y="450" fill="#d04040" fontSize="7" fontFamily="monospace" textAnchor="middle">⚠ TRÜBUNG</text>}
                  </g>
                )}

                {/* ── DESINFEKTION (dosing vessels right of pipe) ── */}
                <g className="wc-station" onClick={() => chooseStation('desinfektion')} style={{ cursor: 'pointer' }}>
                  <ellipse cx="880" cy="548" rx="24" ry="7" fill="#060f22" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="856" y="546" width="48" height="82" fill="#060f22" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="859" y="558" width="42" height="62" fill="#001080" fillOpacity="0.2" rx="2"/>
                  <text x="880" y="596" fill="#4a8ad0" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NaOCl</text>
                  <ellipse cx="940" cy="548" rx="20" ry="7" fill="#060f22" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="920" y="546" width="40" height="82" fill="#060f22" stroke={selectedStationId === 'desinfektion' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  <rect x="923" y="558" width="34" height="62" fill="#400010" fillOpacity="0.2" rx="2"/>
                  <text x="940" y="596" fill="#c09040" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CO₂</text>
                  <line x1="856" y1="572" x2="828" y2="572" stroke="#4a9eff" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6"/>
                  <circle cx="825" cy="572" r="5" fill={chlorInRange ? '#102a10' : '#3a1010'} stroke={chlorInRange ? '#34c090' : '#d04040'} strokeWidth="1.5">
                    <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <text x="912" y="537" fill="#5a8090" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">DESINFEKTION</text>
                  <text x="825" y="592" fill={chlorInRange ? '#34c090' : '#d04040'} fontSize="7.5" fontFamily="monospace" textAnchor="middle">{metrics.freeChlorine} mg/L Cl₂</text>
                  {symptomFlags.has('lowChlorine') && <text x="912" y="526" fill="#d09030" fontSize="7.5" fontFamily="monospace" textAnchor="middle">⚠ NIEDRIG</text>}
                </g>

                {/* ── HEIZUNG / WÄRMETAUSCHER ── */}
                <g className="wc-station" onClick={() => chooseStation('heizung')} style={{ cursor: 'pointer' }}>
                  <rect x="755" y="592" width="148" height="72" rx="6" fill="#060f22" stroke={selectedStationId === 'heizung' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.5"/>
                  {[604, 614, 624, 634, 640].map((hy, i) => (
                    <line key={hy} x1="764" y1={hy} x2="894" y2={hy} stroke={i % 2 === 0 ? '#601010' : '#104060'} strokeWidth="3" opacity="0.5"/>
                  ))}
                  <text x="829" y="581" fill="#5a8090" fontSize="8.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">WÄRMETAUSCHER</text>
                  <text x="829" y="678" fill={temperatureInRange ? '#34c090' : '#d09030'} fontSize="8" fontFamily="monospace" textAnchor="middle">{metrics.temperature} °C</text>
                </g>

                {/* ── RÜCKLAUF (on return pipe, bottom center) ── */}
                <g className="wc-station" onClick={() => chooseStation('ruecklauf')} style={{ cursor: 'pointer' }}>
                  <rect x="345" y="662" width="88" height="35" rx="5" fill="#060f22" stroke={selectedStationId === 'ruecklauf' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.2"/>
                  <circle cx="389" cy="679" r="10" fill="#040d1a" stroke="#1a3a5a" strokeWidth="1"/>
                  <line x1="379" y1="679" x2="399" y2="679" stroke="#4a9eff" strokeWidth="1.5" opacity="0.6"/>
                  <polygon points="395,675 401,679 395,683" fill="#4a9eff" opacity="0.7"/>
                  <text x="389" y="657" fill="#5a8090" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">RÜCKLAUF</text>
                </g>

                {/* Kanal / Abwurf */}
                <rect x="964" y="650" width="130" height="38" rx="5" fill="#060f22" stroke="#1a3a5a" strokeWidth="1.2"/>
                <text x="1029" y="673" fill="#2a4060" fontSize="8" fontFamily="monospace" textAnchor="middle">KANAL / ABWURF</text>

                {/* Return label */}
                <text x="495" y="696" fill="#1a4070" fontSize="7.5" fontFamily="monospace" textAnchor="middle">←── RÜCKLAUF INS BECKEN ──←</text>

                {/* ── VALVE BUTTONS ── */}
                {[
                  { key: 'rawValveOpen',     x: 500, y: 308, label: 'V1' },
                  { key: 'returnValveOpen',  x: 220, y: 680, label: 'V2' },
                  { key: 'ventValveOpen',    x: 560, y: 345, label: 'V3' },
                  { key: 'backwashValveOpen',x: 825, y: 545, label: 'V4' },
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
          <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#040d1a', border: '1px solid #1a3a5a', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
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
            <div className="grid lg:grid-cols-[1.2fr_1fr] overflow-auto flex-1" style={{ minHeight: 0 }}>
              {/* SVG illustration */}
              <div className="p-5 flex items-center justify-center" style={{ borderRight: '1px solid #1a3a5a', background: '#030c18' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
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
