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
  becken:       { x: 112,  y: 285, r: 110 },
  ueberlauf:    { x: 315,  y: 125, r: 80  },
  schwall:      { x: 500,  y: 195, r: 100 },
  pumpe:        { x: 500,  y: 375, r: 70  },
  flockung:     { x: 680,  y: 272, r: 55  },
  filter:       { x: 825,  y: 313, r: 105 },
  desinfektion: { x: 890,  y: 572, r: 65  },
  heizung:      { x: 829,  y: 627, r: 62  },
  ruecklauf:    { x: 390,  y: 668, r: 52  },
};

const PIPE_PATHS_VERTICAL = {
  'becken-ueberlauf':     'M 195 125 L 315 125',
  'ueberlauf-schwall':    'M 315 125 L 435 125',
  'schwall-pumpe':        'M 500 296 L 500 320',
  'pumpe-flockung':       'M 555 375 L 635 375 L 635 100',
  'flockung-filter':      'M 635 100 L 760 100',
  'filter-desinfektion':  'M 825 531 L 825 570',
  'desinfektion-heizung': 'M 825 570 L 825 592',
  'heizung-ruecklauf':    'M 755 627 L 400 627 L 400 680',
  'ruecklauf-becken':     'M 340 680 L 112 680 L 112 525',
  'filter-kanal':         'M 888 450 L 980 450 L 980 660',
};

const PIPE_PATHS_MOBILE_VERTICAL = {
  'becken-ueberlauf':     'M 274 54 L 284 54',
  'ueberlauf-schwall':    'M 284 54 L 356 54 L 356 115',
  'schwall-pumpe':        'M 356 222 L 356 258',
  'pumpe-flockung':       'M 356 326 L 356 348',
  'flockung-filter':      'M 356 408 L 356 422',
  'filter-desinfektion':  'M 320 603 L 20 603 L 20 500',
  'desinfektion-heizung': 'M 20 500 L 20 406',
  'heizung-ruecklauf':    'M 20 406 L 20 284',
  'ruecklauf-becken':     'M 20 284 L 20 97',
  'filter-kanal':         'M 392 616 L 415 616 L 415 755',
};

const PIPE_PATHS_HORIZONTAL = {
  'becken-ueberlauf':     'M 195 125 L 315 125',
  'ueberlauf-schwall':    'M 315 125 L 435 125',
  'schwall-pumpe':        'M 500 296 L 500 320',
  'pumpe-flockung':       'M 555 375 L 635 375 L 635 100',
  'flockung-filter':      'M 635 100 L 635 330 L 645 330',
  'filter-desinfektion':  'M 1025 330 L 1080 330 L 1080 572 L 825 572',
  'desinfektion-heizung': 'M 825 572 L 825 592',
  'heizung-ruecklauf':    'M 755 627 L 400 627 L 400 680',
  'ruecklauf-becken':     'M 340 680 L 112 680 L 112 525',
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
      { label: 'Schichten (von oben)', value: 'Aktivkohle -> Quarzsand -> Stuetzkies' },
      { label: 'Filtrat ab', value: 'Partikel ≥ 0,1 µm' },
      { label: 'Rückspülung bei', value: 'dP > 0,5 bar oder nach 72 h' },
      { label: 'Rückspülwasser', value: 'Nicht zurück ins Becken!' },
    ],
    lernpunkte: [
      'Aktivkohle (oben): bindet organische Verbindungen und Chloramine',
      'Quarzsand (Mitte): Hauptfilterleistung fuer Feinstpartikel',
      'Stuetzkies (unten): Tragschicht und Lastverteilung ueber dem Duesenboden',
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
const FILTER_REFERENCE_TABS = {
  materialien: [
    'Aktivkohle: Adsorption von organischen Spurenstoffen und Chloraminen',
    'Quarzsand: Hauptfilterstufe fuer Flocken und Schwebstoffe',
    'Stuetzkies: Tragschicht, Lastverteilung, Schutz des Duesenbodens',
    'Hydroanthrazit: in manchen Filtern als obere Leichtschicht statt Aktivkohle',
    'AFM/Glasgranulat: alternative Mehrschichtmedien mit geringer Biofilmbildung',
  ],
  filterarten: [
    'Mehrschicht-Druckfilter (am haeufigsten im Schwimmbadkreislauf)',
    'Einschicht-Sandfilter (kleinere Anlagen/Bestandsanlagen)',
    'Aktivkohlefilter als Zusatzstufe bei Geruchs-/THM-Themen',
    'Kerzen-/Patronenfilter eher in Nebenstrom oder kleinen Technikstrecken',
    'Ultrafiltration/Membranfiltration in Sonderanlagen oder hoher Hygienestufe',
  ],
};

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

const applyDeepDiveXray = (faces, xrayMode, cx = 150, cy = 110) => {
  if (!xrayMode) return faces;
  return faces.map((face) => {
    const center = face.pts.reduce((acc, p) => ({ x: acc.x + p[0], y: acc.y + p[1] }), { x: 0, y: 0 });
    const fx = center.x / face.pts.length;
    const fy = center.y / face.pts.length;
    const vx = fx - cx;
    const vy = fy - cy;
    const len = Math.hypot(vx, vy);
    const nx = len > 0.001 ? vx / len : 0;
    const ny = len > 0.001 ? vy / len : -1;
    const depth = clamp(((face.zVal ?? 0) + 160) / 320, 0.15, 1);
    const shift = 3 + depth * 10;
    const ox = nx * shift;
    const oy = ny * shift;
    return {
      ...face,
      pts: face.pts.map((p) => [p[0] + ox, p[1] + oy, p[2]]),
      fillOp: clamp((face.fillOp ?? 1) * 0.62, 0.08, 0.86),
      strokeW: (face.strokeW ?? 1) + 0.2,
    };
  });
};

const renderDeepDiveFace = (face, poly, xrayMode) => (
  <>
    <polygon points={poly(face.pts)} fill={face.fill} fillOpacity={face.fillOp || 1}
      stroke={face.stroke} strokeWidth={face.strokeW}/>
    {xrayMode && (
      <polygon points={poly(face.pts)} fill="none" stroke="#73c9ff"
        strokeWidth={Math.max(0.6, (face.strokeW || 1) * 0.8)}
        strokeDasharray="4 2" opacity="0.72"/>
    )}
  </>
);

const renderDeepDiveHotspot = (hotspot, activeId, setActive, radius = 13, labelSize = 6.5) => (
  <g key={hotspot.id} data-hotspot="1" style={{ cursor: 'pointer' }}
    onClick={(e) => { e.stopPropagation(); setActive(activeId === hotspot.id ? null : hotspot.id); }}>
    <circle cx={hotspot.proj[0].toFixed(1)} cy={hotspot.proj[1].toFixed(1)} r={radius}
      fill={hotspot.color} fillOpacity={activeId === hotspot.id ? 0.4 : 0.15}
      stroke={hotspot.color} strokeWidth={activeId === hotspot.id ? 2.5 : 1.5}>
      {activeId !== hotspot.id && <animate attributeName="r" values={`${radius};${radius + 3};${radius}`} dur="2.5s" repeatCount="indefinite"/>}
    </circle>
    <circle cx={hotspot.proj[0].toFixed(1)} cy={hotspot.proj[1].toFixed(1)} r={Math.max(2.5, radius * 0.22)}
      fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" style={{ pointerEvents: 'none' }}/>
    <text x={hotspot.proj[0].toFixed(1)} y={(hotspot.proj[1] + 4).toFixed(1)}
      fill="white" fontSize="10" fontWeight="bold" textAnchor="middle"
      style={{ pointerEvents: 'none' }}>+</text>
    {activeId === hotspot.id && (
      <text x={hotspot.proj[0].toFixed(1)} y={(hotspot.proj[1] - 18).toFixed(1)}
        fill={hotspot.color} fontSize={labelSize} fontFamily="monospace" textAnchor="middle"
        style={{ pointerEvents: 'none' }}>{hotspot.label}</text>
    )}
  </g>
);

function BeckenDeepDive({ metrics, xrayMode = false }) {
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
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 118);

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
        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
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
        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot, 14, 7))}

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
function UeberlaufDeepDive({ xrayMode = false }) {
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
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 105);

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
        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
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
        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot))}
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
function RuecklaufDeepDive({ metrics, xrayMode = false }) {
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
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 108);

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
        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
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
        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot))}
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

// ─── Schwallwasserbehälter 3D Deep-Dive ─────────────────────────────────────
function SchwallDeepDive({ metrics, xrayMode = false }) {
  const [rx, setRx] = useState(-25);
  const [ry, setRy] = useState(30);
  const [drag, setDrag] = useState(null);
  const [spot, setSpot] = useState(null);
  const level = metrics.surgeLevel;
  const fillFrac = level / 100;

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
    const d = 320 / (320 + z2);
    return [150 + x1 * d, 112 + y1 * d, z2];
  };
  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  // Octagonal cylinder: radius 50, top y=-60, bottom y=60
  const R = 50, TOP = -60, BOT = 60;
  const waterY = BOT - (BOT - TOP) * fillFrac;
  const N = 8;
  const ang = i => (i / N) * Math.PI * 2;
  const topPts = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), TOP, R * Math.sin(ang(i))));
  const botPts = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), BOT, R * Math.sin(ang(i))));
  const watPts = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), waterY, R * Math.sin(ang(i))));

  // Build side faces
  const sideFaces = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    sideFaces.push({
      id: `s${i}`, pts: [topPts[i], topPts[j], botPts[j], botPts[i]],
      fill: '#081e3c', stroke: '#1a3a5a', strokeW: 1
    });
    // Water-filled portion of side
    if (fillFrac > 0.02) {
      sideFaces.push({
        id: `sw${i}`, pts: [watPts[i], watPts[j], botPts[j], botPts[i]],
        fill: '#1060a0', fillOp: 0.35, stroke: '#2a6090', strokeW: 0.5
      });
    }
  }

  const faces = [
    // Bottom
    { id: 'bot', pts: botPts, fill: '#061828', stroke: '#1a3a5a', strokeW: 1 },
    ...sideFaces,
    // Water surface
    ...(fillFrac > 0.02 ? [{ id: 'water', pts: watPts, fill: '#1a5090', fillOp: 0.55, stroke: '#4ab0ff', strokeW: 0.8 }] : []),
    // Top rim (transparent)
    { id: 'top', pts: topPts, fill: '#0c2a50', fillOp: 0.3, stroke: '#2a5a90', strokeW: 1.2 },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a, b) => b.zVal - a.zVal);
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 112);

  // Level gauge strip
  const gaugeX = R + 8;
  const gTop = p3(gaugeX, TOP, 0), gBot = p3(gaugeX, BOT, 0), gWat = p3(gaugeX, waterY, 0);

  // Inlet/outlet pipes
  const inA = p3(-R - 5, -20, 0), inB = p3(-R - 30, -20, 0);
  const outA = p3(R + 5, 40, 0), outB = p3(R + 30, 40, 0);

  const hotDefs = [
    { id: 'zulauf', x: -R - 15, y: -20, z: 0, label: '← Zulauf', color: '#4a9eff' },
    { id: 'ablauf', x: R + 15, y: 40, z: 0, label: '→ Ablauf', color: '#34c090' },
    { id: 'schwimmer', x: gaugeX, y: waterY, z: 0, label: '⊡ Pegel', color: '#ffaa40' },
    { id: 'frischwasser', x: 0, y: TOP - 5, z: 0, label: '↓ Nachspeis.', color: '#d04040' },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const SDATA = {
    zulauf: { color: '#4a9eff', icon: '←', title: 'Zulauf (Überlaufrinne)', items: [
      '🌊 Wasser aus der Überlaufrinne fließt hier ein',
      '📍 Freier Einlauf oberhalb des max. Wasserspiegels',
      '⚡ Höchste Keimbelastung im gesamten Kreislauf',
      '🔀 Schwallwasser = Oberflächenwasser + Verdrängungswasser',
      '📐 DIN 19643: Schwallbehälter ≥ 10 % Beckenvolumen',
    ]},
    ablauf: { color: '#34c090', icon: '→', title: 'Ablauf (zur Pumpe)', items: [
      '📍 Am tiefsten Punkt des Behälters',
      '🔧 Nennweite: DN 100–200 je nach Volumenstrom',
      '⚙ Saugseitige Verrohrung der Umwälzpumpe',
      '🚫 Siebkorb/Grobfilter vor Pumpe schützt Laufrad',
      '📐 NPSH: Saughöhe beachten → Kavitationsgefahr',
    ]},
    schwimmer: { color: '#ffaa40', icon: '⊡', title: 'Pegelmessung / Schwimmer', items: [
      '📏 Schwimmerschalter: min/max Pegelsteuerung',
      '⬆ Hoher Pegel: viele Badegäste → viel Verdrängung',
      '⬇ Niedriger Pegel: Nachspeisung aktivieren',
      '🎛 Automatische Nachspeisung über Magnetventil',
      '📊 Pegelverlauf zeigt Besucherzahlen an',
      '⚠ Trockenlaufschutz: Pumpe aus bei Pegel < Minimum',
    ]},
    frischwasser: { color: '#d04040', icon: '↓', title: 'Frischwassernachspeisung', items: [
      '💧 Gleicht Verdunstung und Rückspülverluste aus',
      '📐 DIN 19643: max. 30 L/Badegast·Tag Frischwasser',
      '🔧 Magnetventil gesteuert durch Schwimmerschalter',
      '🚰 Trinkwasserqualität vorgeschrieben',
      '🔒 Systemtrenner (BA/CA) gegen Rücksaugen',
      '📋 Verbrauch dokumentieren (Wasserzähler)',
    ]},
  };
  const activeData = spot ? SDATA[spot] : null;

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display: 'block', cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs><pattern id="sGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
        </pattern></defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#sGrid)"/>

        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
            {f.id === 'water' && (() => {
              const w1 = p3(-30, waterY, -20), w2 = p3(30, waterY, -20);
              return <line x1={w1[0].toFixed(1)} y1={w1[1].toFixed(1)} x2={w2[0].toFixed(1)} y2={w2[1].toFixed(1)}
                stroke="#4ac8ff" strokeWidth="1.2" opacity="0.4" strokeDasharray="6 4" className="wc-surface"/>;
            })()}
          </g>
        ))}

        {/* Level gauge */}
        <line x1={gTop[0].toFixed(1)} y1={gTop[1].toFixed(1)} x2={gBot[0].toFixed(1)} y2={gBot[1].toFixed(1)}
          stroke="#1a3a5a" strokeWidth="3" opacity="0.5"/>
        <line x1={gWat[0].toFixed(1)} y1={gWat[1].toFixed(1)} x2={gBot[0].toFixed(1)} y2={gBot[1].toFixed(1)}
          stroke="#4a9eff" strokeWidth="3" opacity="0.7"/>
        <text x={(gWat[0] + 8).toFixed(1)} y={gWat[1].toFixed(1)} fill="#4a9eff" fontSize="6" fontFamily="monospace">{level}%</text>

        {/* Inlet pipe */}
        <line x1={inA[0].toFixed(1)} y1={inA[1].toFixed(1)} x2={inB[0].toFixed(1)} y2={inB[1].toFixed(1)}
          stroke="#1a4060" strokeWidth="9" strokeLinecap="round"/>
        <line x1={inA[0].toFixed(1)} y1={inA[1].toFixed(1)} x2={inB[0].toFixed(1)} y2={inB[1].toFixed(1)}
          stroke="#0c2030" strokeWidth="5" strokeLinecap="round"/>
        <line x1={inA[0].toFixed(1)} y1={inA[1].toFixed(1)} x2={inB[0].toFixed(1)} y2={inB[1].toFixed(1)}
          stroke="#4a9eff" strokeWidth="2.5" opacity="0.6" strokeDasharray="5 4" className="wc-flow" style={{ animationDuration: '1.5s' }}/>
        <text x={(inB[0] - 2).toFixed(1)} y={(inB[1] - 7).toFixed(1)} fill="#4a9eff" fontSize="5" fontFamily="monospace" textAnchor="end">ÜBERLAUF →</text>

        {/* Outlet pipe */}
        <line x1={outA[0].toFixed(1)} y1={outA[1].toFixed(1)} x2={outB[0].toFixed(1)} y2={outB[1].toFixed(1)}
          stroke="#1a4060" strokeWidth="9" strokeLinecap="round"/>
        <line x1={outA[0].toFixed(1)} y1={outA[1].toFixed(1)} x2={outB[0].toFixed(1)} y2={outB[1].toFixed(1)}
          stroke="#0c2030" strokeWidth="5" strokeLinecap="round"/>
        <line x1={outA[0].toFixed(1)} y1={outA[1].toFixed(1)} x2={outB[0].toFixed(1)} y2={outB[1].toFixed(1)}
          stroke="#34c090" strokeWidth="2.5" opacity="0.6" strokeDasharray="5 4" className="wc-flow" style={{ animationDuration: '1.5s' }}/>
        <text x={(outB[0] + 2).toFixed(1)} y={(outB[1] - 7).toFixed(1)} fill="#34c090" fontSize="5" fontFamily="monospace">→ PUMPE</text>

        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot))}

        <text x="150" y="215" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? '◉ DREHEN…' : '⟵ ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN ⟶'}
        </text>
      </svg>
      {activeData && (
        <div style={{ background: 'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop: '2px solid ' + activeData.color, padding: '10px 12px', maxHeight: '180px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ color: activeData.color, fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>{activeData.icon} {activeData.title}</span>
            <button onClick={() => setSpot(null)} style={{ background: 'transparent', border: '1px solid #1a3a5a', borderRadius: '4px', color: '#5a8090', fontSize: '11px', padding: '2px 7px', cursor: 'pointer' }}>✕</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color: '#8ab0c0', fontSize: '10px', fontFamily: 'monospace', margin: '2px 0', lineHeight: '1.5' }}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Kreiselpumpe 3D Deep-Dive ───────────────────────────────────────────────
function PumpeDeepDive({ metrics, xrayMode = false }) {
  const [rx, setRx] = useState(-20);
  const [ry, setRy] = useState(25);
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
    const d = 320 / (320 + z2);
    return [150 + x1 * d, 110 + y1 * d, z2];
  };
  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  // Pump housing: flattened cylinder, R=55 x-z plane, height ±20 in y
  const R = 55, HT = -20, HB = 20;
  const N = 10;
  const ang = i => (i / N) * Math.PI * 2;
  const topPts = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), HT, R * Math.sin(ang(i))));
  const botPts = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), HB, R * Math.sin(ang(i))));

  const sideFaces = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    sideFaces.push({
      id: `ps${i}`, pts: [topPts[i], topPts[j], botPts[j], botPts[i]],
      fill: '#0e2535', stroke: '#1a3a5a', strokeW: 1
    });
  }

  // Motor box below pump
  const mTL = p3(-25, HB, -20), mTR = p3(25, HB, -20), mBL = p3(-25, HB + 45, -20), mBR = p3(25, HB + 45, -20);
  const mTLf = p3(-25, HB, 20), mTRf = p3(25, HB, 20), mBLf = p3(-25, HB + 45, 20), mBRf = p3(25, HB + 45, 20);

  const faces = [
    { id: 'mbot', pts: [mBL, mBR, mBRf, mBLf], fill: '#060e18', stroke: '#1a2a40', strokeW: 1 },
    { id: 'mback', pts: [mTL, mTR, mBR, mBL], fill: '#081520', stroke: '#1a2a40', strokeW: 1 },
    { id: 'mfrt', pts: [mTLf, mTRf, mBRf, mBLf], fill: '#081520', stroke: '#1a2a40', strokeW: 1 },
    { id: 'mlft', pts: [mTL, mTLf, mBLf, mBL], fill: '#0a1828', stroke: '#1a2a40', strokeW: 0.8 },
    { id: 'mrgt', pts: [mTR, mTRf, mBRf, mBR], fill: '#0a1828', stroke: '#1a2a40', strokeW: 0.8 },
    { id: 'pbot', pts: botPts, fill: '#081828', stroke: '#1a3a5a', strokeW: 1 },
    ...sideFaces,
    { id: 'ptop', pts: topPts, fill: '#0c2a50', fillOp: 0.5, stroke: '#2a5a90', strokeW: 1.2 },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a, b) => b.zVal - a.zVal);
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 110);

  // Impeller vanes (6 blades on top face, animated rotation via CSS)
  const bladeAngle = running ? 'wcSpin 1.1s linear infinite' : 'none';
  const center = p3(0, HT - 2, 0);
  const bladeLen = 40;

  // Suction/discharge pipes
  const suckA = p3(-R - 5, 0, 0), suckB = p3(-R - 35, 0, 0);
  const discA = p3(0, HT - 5, -R - 5), discB = p3(0, HT - 5, -R - 35);

  const hotDefs = [
    { id: 'laufrad', x: 0, y: HT - 2, z: 0, label: '⚙ Laufrad', color: '#4a9eff' },
    { id: 'saugseite', x: -R - 20, y: 0, z: 0, label: '← Saugseite', color: '#34c090' },
    { id: 'druckseite', x: 0, y: HT - 5, z: -R - 20, label: '↑ Druckseite', color: '#ffaa40' },
    { id: 'motor', x: 0, y: HB + 25, z: 0, label: '⊞ Motor', color: '#d04040' },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const PDATA = {
    laufrad: { color: '#4a9eff', icon: '⚙', title: 'Laufrad (Impeller)', items: [
      '🔄 Radialläufer: 6 Schaufeln, wandelt Drehung → Strömungsenergie',
      '📐 Pumpenkurve: Q↑ → H↓ (mehr Durchfluss = weniger Förderhöhe)',
      '⚡ Drehzahl: 1450 oder 2900 U/min (2- oder 4-polig)',
      '🔧 Material: Edelstahl oder Bronze (chlorbeständig)',
      '⚠ Kavitation: Dampfblasen bei Unterdruck → Materialschäden',
      '📋 Verschleiß am Spalt zwischen Laufrad und Gehäuse prüfen',
    ]},
    saugseite: { color: '#34c090', icon: '←', title: 'Saugseite (Einlass)', items: [
      '📍 Anschluss: Schwallwasserbehälter → Pumpe',
      '🔧 Nennweite: DN 100–200 je nach Volumenstrom',
      '⚠ NPSH: Saughöhe beachten → Kavitationsgefahr',
      '🛡 Siebkorb vor Pumpe schützt Laufrad vor Fremdkörpern',
      '🔒 Absperrarmatur + Rückschlagventil erforderlich',
      '📐 Saugleitung: kurz, dicht, steigend verlegen',
    ]},
    druckseite: { color: '#ffaa40', icon: '↑', title: 'Druckseite (Auslass)', items: [
      '📍 Anschluss: Pumpe → Flockung → Filter → Desinfektion',
      '📏 Druck am Auslass: 1,5–3,0 bar (je nach Anlage)',
      '🔧 Rückschlagklappe verhindert Rückfluss bei Pumpen-Aus',
      '📊 Manometer zur Drucküberwachung',
      '🌊 Volumenstrom: typisch 30–120 m³/h je nach Beckengröße',
      '⚠ Druckstoß bei schnellem Schließen → Rohrbruchgefahr',
    ]},
    motor: { color: '#d04040', icon: '⊞', title: 'Antriebsmotor', items: [
      '⚡ Drehstrom-Asynchronmotor, IE3 Effizienzklasse',
      '🔌 Leistung: 2,2–15 kW je nach Förderstrom',
      '🌡 Thermischer Motorschutz gegen Überhitzung',
      '🔧 Gleitringdichtung: Übergang Welle→Gehäuse abdichten',
      '📋 Schmierung: halbjährlich Lagerfett nachfüllen',
      '⚙ Frequenzumrichter (FU) für stufenlose Drehzahlregelung',
    ]},
  };
  const activeData = spot ? PDATA[spot] : null;

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display: 'block', cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs><pattern id="pGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
        </pattern></defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#pGrid)"/>

        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
            {f.id === 'mrgt' && <text x={((mBR[0] + mBRf[0]) / 2).toFixed(1)} y={((mBR[1] + mBRf[1]) / 2 + 5).toFixed(1)} fill="#1a3a5a" fontSize="6" fontFamily="monospace" textAnchor="middle">MOTOR</text>}
          </g>
        ))}

        {/* Impeller on top face */}
        <g style={{ transformOrigin: `${center[0].toFixed(1)}px ${center[1].toFixed(1)}px`, animation: bladeAngle }}>
          {[0, 60, 120, 180, 240, 300].map(deg => {
            const r = (deg * Math.PI) / 180;
            const tip = p3(bladeLen * Math.cos(r), HT - 2, bladeLen * Math.sin(r));
            return <line key={deg} x1={center[0].toFixed(1)} y1={center[1].toFixed(1)} x2={tip[0].toFixed(1)} y2={tip[1].toFixed(1)}
              stroke="#4a9eff" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>;
          })}
          <circle cx={center[0].toFixed(1)} cy={center[1].toFixed(1)} r="8" fill="#0a1828" stroke="#4a9eff" strokeWidth="2"/>
        </g>

        {/* Suction pipe */}
        <line x1={suckA[0].toFixed(1)} y1={suckA[1].toFixed(1)} x2={suckB[0].toFixed(1)} y2={suckB[1].toFixed(1)}
          stroke="#1a4060" strokeWidth="10" strokeLinecap="round"/>
        <line x1={suckA[0].toFixed(1)} y1={suckA[1].toFixed(1)} x2={suckB[0].toFixed(1)} y2={suckB[1].toFixed(1)}
          stroke="#0c2030" strokeWidth="6" strokeLinecap="round"/>
        {running && <line x1={suckA[0].toFixed(1)} y1={suckA[1].toFixed(1)} x2={suckB[0].toFixed(1)} y2={suckB[1].toFixed(1)}
          stroke="#4a9eff" strokeWidth="3" opacity="0.7" strokeDasharray="6 5" className="wc-flow" style={{ animationDuration: '1.3s' }}/>}
        <text x={(suckB[0] - 2).toFixed(1)} y={(suckB[1] - 7).toFixed(1)} fill="#4a9eff" fontSize="5" fontFamily="monospace" textAnchor="end">SAUG</text>

        {/* Discharge pipe */}
        <line x1={discA[0].toFixed(1)} y1={discA[1].toFixed(1)} x2={discB[0].toFixed(1)} y2={discB[1].toFixed(1)}
          stroke="#1a4060" strokeWidth="10" strokeLinecap="round"/>
        <line x1={discA[0].toFixed(1)} y1={discA[1].toFixed(1)} x2={discB[0].toFixed(1)} y2={discB[1].toFixed(1)}
          stroke="#0c2030" strokeWidth="6" strokeLinecap="round"/>
        {running && <line x1={discA[0].toFixed(1)} y1={discA[1].toFixed(1)} x2={discB[0].toFixed(1)} y2={discB[1].toFixed(1)}
          stroke="#ffaa40" strokeWidth="3" opacity="0.7" strokeDasharray="6 5" className="wc-flow" style={{ animationDuration: '1.3s' }}/>}
        <text x={(discB[0]).toFixed(1)} y={(discB[1] - 7).toFixed(1)} fill="#ffaa40" fontSize="5" fontFamily="monospace" textAnchor="middle">DRUCK</text>

        {/* Flow rate display */}
        <rect x="230" y="12" width="60" height="36" fill="#0a1a2e" stroke="#1a3a5a" strokeWidth="1" rx="4"/>
        <text x="260" y="26" fill="#456080" fontSize="5.5" fontFamily="monospace" textAnchor="middle">VOLUMENSTROM</text>
        <text x="260" y="40" fill={running ? '#4a9eff' : '#456080'} fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{metrics.flowRate}</text>
        <text x="260" y="46" fill="#456080" fontSize="5" fontFamily="monospace" textAnchor="middle">m³/h</text>

        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot))}

        <text x="150" y="215" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? '◉ DREHEN…' : '⟵ ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN ⟶'}
        </text>
      </svg>
      {activeData && (
        <div style={{ background: 'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop: '2px solid ' + activeData.color, padding: '10px 12px', maxHeight: '180px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ color: activeData.color, fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>{activeData.icon} {activeData.title}</span>
            <button onClick={() => setSpot(null)} style={{ background: 'transparent', border: '1px solid #1a3a5a', borderRadius: '4px', color: '#5a8090', fontSize: '11px', padding: '2px 7px', cursor: 'pointer' }}>✕</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color: '#8ab0c0', fontSize: '10px', fontFamily: 'monospace', margin: '2px 0', lineHeight: '1.5' }}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Flockung 3D Deep-Dive ──────────────────────────────────────────────────
function FlockungDeepDive({ metrics, xrayMode = false }) {
  const [rx, setRx] = useState(-22);
  const [ry, setRy] = useState(28);
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
    const d = 320 / (320 + z2);
    return [150 + x1 * d, 110 + y1 * d, z2];
  };
  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  // Rectangular tank: x ±45, y -55 (top) to 50 (bottom), z ±35
  // Conical bottom from y=50 to y=75 converging to center
  const XW = 45, ZW = 35, YT = -55, YB = 50, YC = 75;
  const TFL = p3(-XW, YT, -ZW), TFR = p3(XW, YT, -ZW), TBR = p3(XW, YT, ZW), TBL = p3(-XW, YT, ZW);
  const BFL = p3(-XW, YB, -ZW), BFR = p3(XW, YB, -ZW), BBR = p3(XW, YB, ZW), BBL = p3(-XW, YB, ZW);
  const CONE = p3(0, YC, 0);
  // Water surface at y=-20
  const WY = -20;
  const WFL = p3(-XW, WY, -ZW), WFR = p3(XW, WY, -ZW), WBR = p3(XW, WY, ZW), WBL = p3(-XW, WY, ZW);

  const faces = [
    { id: 'cfl', pts: [BFL, BFR, CONE], fill: '#071828', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'cbk', pts: [BBL, BBR, CONE], fill: '#061520', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'clt', pts: [BFL, BBL, CONE], fill: '#081e30', stroke: '#1a3a5a', strokeW: 0.8 },
    { id: 'crt', pts: [BFR, BBR, CONE], fill: '#081e30', stroke: '#1a3a5a', strokeW: 0.8 },
    { id: 'back', pts: [TBL, TBR, BBR, BBL], fill: '#061520', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'left', pts: [TFL, TBL, BBL, BFL], fill: '#071830', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'right', pts: [TFR, TBR, BBR, BFR], fill: '#071830', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'front', pts: [TFL, TFR, BFR, BFL], fill: '#081e3c', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'water', pts: [WFL, WFR, WBR, WBL], fill: '#1a5090', fillOp: 0.45, stroke: '#4ab0ff', strokeW: 0.8 },
    { id: 'top', pts: [TFL, TFR, TBR, TBL], fill: '#0c2a50', fillOp: 0.25, stroke: '#2a5a90', strokeW: 1 },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a, b) => b.zVal - a.zVal);
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 110);

  // Stirrer shaft + paddles
  const shaftTop = p3(0, YT - 10, 0), shaftBot = p3(0, YB - 10, 0);
  const pad1L = p3(-30, -5, 0), pad1R = p3(30, -5, 0);
  const pad2L = p3(-30, 25, 0), pad2R = p3(30, 25, 0);

  // Dosing pipe
  const doseTop = p3(-XW - 15, YT - 15, 0), doseMid = p3(-XW - 15, YT, 0), doseIn = p3(-XW, YT, 0);

  // Particles (micro → flocs)
  const microPos = [[-20, -10, -15], [15, -5, 10], [-10, 5, -20], [25, 0, 15], [-25, 10, 5]];
  const flocPos = [[-15, 30, -10], [10, 35, 8], [0, 40, -5]];

  const hotDefs = [
    { id: 'ruehrer', x: 0, y: 10, z: 0, label: '⟳ Rührer', color: '#4a9eff' },
    { id: 'dosierung', x: -XW - 15, y: YT - 5, z: 0, label: '↓ Dosierung', color: '#34c090' },
    { id: 'mischzone', x: 0, y: -10, z: 0, label: '∿ Mischzone', color: '#ffaa40' },
    { id: 'flocken', x: 0, y: 38, z: 0, label: '● Flocken', color: '#d04040' },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const FDATA = {
    ruehrer: { color: '#4a9eff', icon: '⟳', title: 'Rührwerk', items: [
      '🔄 Langsam drehend: 20–80 U/min (Flocken nicht zerstören!)',
      '⚙ Typ: Gitterrührer oder Paddelrührer',
      '📐 Rührzeit: 15–30 min Verweilzeit im Behälter',
      '⚠ Zu schnell → Flocken brechen auf → schlechte Filtration',
      '⚠ Zu langsam → keine Durchmischung → Kurzschlussströmung',
      '🔧 Material: Edelstahl, chlorbeständig',
    ]},
    dosierung: { color: '#34c090', icon: '↓', title: 'Flockungsmittel-Dosierung', items: [
      '💧 Mittel: Aluminiumsulfat (Al₂(SO₄)₃) oder Polyelektrolyt',
      '📏 Dosierung: 0,1–0,3 mg/L Aluminium',
      '⚙ Dosierpumpe: Membran- oder Schlauchpumpe',
      '📐 pH-Optimum: 6,8–7,2 für Aluminiumsulfat',
      '⚠ Überdosierung → Aluminium im Beckenwasser (Grenzwert 0,05 mg/L)',
      '📋 Dosierung proportional zum Volumenstrom regeln',
    ]},
    mischzone: { color: '#ffaa40', icon: '∿', title: 'Mischzone (Koagulation)', items: [
      '⚡ Schnellmischung: Flockungsmittel + Wasser sofort verteilen',
      '🔬 Destabilisierung: Partikel-Ladung wird neutralisiert',
      '📐 G-Wert (Geschwindigkeitsgradient): 30–70 s⁻¹',
      '🌊 Orthokinetische Flockung: Teilchen treffen durch Strömung aufeinander',
      '📏 Mikropartikel < 0,1 µm verbinden sich zu Mikroflocken',
    ]},
    flocken: { color: '#d04040', icon: '●', title: 'Flockenbildung', items: [
      '📏 Mikroflocken → Makroflocken: von < 0,1 µm auf ≥ 5 µm',
      '🎯 Ziel: Flocken groß genug für Sandfilter-Abscheidung',
      '⬇ Flocken sinken im Konusteil ab → Abzug zum Filter',
      '📊 Trübungsmessung nach Flockung zeigt Wirksamkeit',
      '⚠ Flockenbruch: zu hohe Strömung oder pH-Schwankung',
      '📋 Jar-Test: Labormethode zur optimalen Dosisfindung',
    ]},
  };
  const activeData = spot ? FDATA[spot] : null;

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display: 'block', cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs><pattern id="fGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
        </pattern></defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#fGrid)"/>

        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
            {f.id === 'water' && (() => {
              const w1 = p3(-25, WY, -15), w2 = p3(20, WY, 15);
              return <line x1={w1[0].toFixed(1)} y1={w1[1].toFixed(1)} x2={w2[0].toFixed(1)} y2={w2[1].toFixed(1)}
                stroke="#4ac8ff" strokeWidth="1" opacity="0.35" strokeDasharray="5 4" className="wc-surface"/>;
            })()}
          </g>
        ))}

        {/* Stirrer shaft */}
        <line x1={shaftTop[0].toFixed(1)} y1={shaftTop[1].toFixed(1)} x2={shaftBot[0].toFixed(1)} y2={shaftBot[1].toFixed(1)}
          stroke="#2a4060" strokeWidth="2.5"/>
        {/* Paddles */}
        <g style={{ transformOrigin: `${p3(0, -5, 0)[0].toFixed(1)}px ${p3(0, -5, 0)[1].toFixed(1)}px`, animation: running ? 'wcSpin 3s linear infinite' : 'none' }}>
          <line x1={pad1L[0].toFixed(1)} y1={pad1L[1].toFixed(1)} x2={pad1R[0].toFixed(1)} y2={pad1R[1].toFixed(1)}
            stroke="#456080" strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
          <line x1={pad2L[0].toFixed(1)} y1={pad2L[1].toFixed(1)} x2={pad2R[0].toFixed(1)} y2={pad2R[1].toFixed(1)}
            stroke="#456080" strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
        </g>

        {/* Dosing pipe */}
        <line x1={doseTop[0].toFixed(1)} y1={doseTop[1].toFixed(1)} x2={doseMid[0].toFixed(1)} y2={doseMid[1].toFixed(1)}
          stroke="#1a4060" strokeWidth="4" strokeLinecap="round"/>
        <line x1={doseMid[0].toFixed(1)} y1={doseMid[1].toFixed(1)} x2={doseIn[0].toFixed(1)} y2={doseIn[1].toFixed(1)}
          stroke="#1a4060" strokeWidth="4" strokeLinecap="round"/>
        {running && <line x1={doseTop[0].toFixed(1)} y1={doseTop[1].toFixed(1)} x2={doseMid[0].toFixed(1)} y2={doseMid[1].toFixed(1)}
          stroke="#34c090" strokeWidth="2" opacity="0.7" strokeDasharray="4 3" className="wc-flow" style={{ animationDuration: '1.5s' }}/>}
        <text x={(doseTop[0]).toFixed(1)} y={(doseTop[1] - 5).toFixed(1)} fill="#34c090" fontSize="5" fontFamily="monospace" textAnchor="middle">FLOCKUNGS-</text>
        <text x={(doseTop[0]).toFixed(1)} y={(doseTop[1] + 1).toFixed(1)} fill="#34c090" fontSize="5" fontFamily="monospace" textAnchor="middle">MITTEL</text>

        {/* Micro-particles */}
        {microPos.map(([x, y, z], i) => {
          const c = p3(x, y, z);
          return <circle key={`m${i}`} cx={c[0].toFixed(1)} cy={c[1].toFixed(1)} r="1.8" fill="#7ab5d8" opacity="0.6">
            <animate attributeName="cy" values={`${c[1].toFixed(1)};${(c[1] - 3).toFixed(1)};${c[1].toFixed(1)}`} dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite"/>
          </circle>;
        })}
        {/* Larger flocs */}
        {flocPos.map(([x, y, z], i) => {
          const c = p3(x, y, z);
          return <circle key={`f${i}`} cx={c[0].toFixed(1)} cy={c[1].toFixed(1)} r={3 + i * 0.8} fill="#507090" opacity="0.55">
            <animate attributeName="cy" values={`${c[1].toFixed(1)};${(c[1] + 3).toFixed(1)};${c[1].toFixed(1)}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
          </circle>;
        })}

        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot))}

        <text x="150" y="215" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? '◉ DREHEN…' : '⟵ ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN ⟶'}
        </text>
      </svg>
      {activeData && (
        <div style={{ background: 'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop: '2px solid ' + activeData.color, padding: '10px 12px', maxHeight: '180px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ color: activeData.color, fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>{activeData.icon} {activeData.title}</span>
            <button onClick={() => setSpot(null)} style={{ background: 'transparent', border: '1px solid #1a3a5a', borderRadius: '4px', color: '#5a8090', fontSize: '11px', padding: '2px 7px', cursor: 'pointer' }}>✕</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color: '#8ab0c0', fontSize: '10px', fontFamily: 'monospace', margin: '2px 0', lineHeight: '1.5' }}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mehrschichtfilter 3D Deep-Dive ─────────────────────────────────────────
function FilterDeepDive({ metrics, xrayMode = false }) {
  const [rx, setRx] = useState(-24);
  const [ry, setRy] = useState(32);
  const [drag, setDrag] = useState(null);
  const [spot, setSpot] = useState(null);
  const [showKerze, setShowKerze] = useState(false);
  const dp = metrics.differentialPressure;
  const dpColor = dp > 0.5 ? '#d04040' : dp > 0.35 ? '#d09030' : '#34c090';

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
    const d = 320 / (320 + z2);
    return [150 + x1 * d, 108 + y1 * d, z2];
  };
  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  const R = 42, YT = -72, YB = 66;
  const N = 10;
  const nozzleY = 53;
  const ang = i => (i / N) * Math.PI * 2;
  const topPts = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), YT, R * Math.sin(ang(i))));
  const botPts = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), YB, R * Math.sin(ang(i))));

  // Corrected layer order: Aktivkohle top, Quarzsand middle, Stuetzkies bottom.
  const layers = [
    { id: 'aktivkohle', y1: -54, y2: -26, fill: '#223646', label: 'AKTIVKOHLE (OBEN)' },
    { id: 'quarzsand', y1: -26, y2: 18, fill: '#5b4b2c', label: 'QUARZSAND' },
    { id: 'stuetzkies', y1: 18, y2: 48, fill: '#374a2e', label: 'STUETZKIES' },
  ];

  const layerFaces = [];
  layers.forEach((l) => {
    const lTop = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), l.y1, R * Math.sin(ang(i))));
    const lBot = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), l.y2, R * Math.sin(ang(i))));
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      layerFaces.push({
        id: `${l.id}${i}`,
        pts: [lTop[i], lTop[j], lBot[j], lBot[i]],
        fill: l.fill,
        fillOp: 0.72,
        stroke: '#1a3a5a',
        strokeW: 0.45,
      });
    }
    layerFaces.push({
      id: `${l.id}t`,
      pts: lTop,
      fill: l.fill,
      fillOp: 0.45,
      stroke: '#2a5a90',
      strokeW: 0.5,
    });
  });

  const npPts = Array.from({ length: N }, (_, i) => p3(R * Math.cos(ang(i)), nozzleY, R * Math.sin(ang(i))));

  const sideFaces = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    sideFaces.push({
      id: `vTop${i}`,
      pts: [
        topPts[i],
        topPts[j],
        p3(R * Math.cos(ang(j)), layers[0].y1, R * Math.sin(ang(j))),
        p3(R * Math.cos(ang(i)), layers[0].y1, R * Math.sin(ang(i))),
      ],
      fill: '#08203f',
      fillOp: 0.42,
      stroke: '#1a3a5a',
      strokeW: 0.6,
    });
    sideFaces.push({
      id: `vBot${i}`,
      pts: [
        p3(R * Math.cos(ang(i)), nozzleY, R * Math.sin(ang(i))),
        p3(R * Math.cos(ang(j)), nozzleY, R * Math.sin(ang(j))),
        botPts[j],
        botPts[i],
      ],
      fill: '#0d2030',
      stroke: '#1a3a5a',
      strokeW: 0.6,
    });
  }

  const faces = [
    { id: 'bot', pts: botPts, fill: '#061828', stroke: '#1a3a5a', strokeW: 1 },
    ...sideFaces,
    ...layerFaces,
    { id: 'np', pts: npPts, fill: '#10283c', fillOp: 0.8, stroke: '#2a4870', strokeW: 1.1 },
    { id: 'top', pts: topPts, fill: '#0c2a50', fillOp: 0.34, stroke: '#2a5a90', strokeW: 1.2 },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a, b) => b.zVal - a.zVal);
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 108);

  const bellTop = p3(0, YT - 10, -2);
  const bellBot = p3(0, -6, -2);

  const pipeDefs = [
    { id: 'rohwasser', from: [-12, YT - 8, -R - 8], to: [-12, YT - 8, -R - 34], color: '#4a9eff', label: 'ROH' },
    { id: 'reinwasser', from: [R + 5, -6, 0], to: [R + 32, -6, 0], color: '#34c090', label: 'REIN' },
    { id: 'spuelwasser', from: [14, YT - 8, -R - 8], to: [14, YT - 8, -R - 32], color: '#66c0ff', label: 'SPUEL' },
    { id: 'schlammwasser', from: [R + 5, YB - 8, 10], to: [R + 30, YB - 8, 10], color: '#d09030', label: 'SCHLAMM' },
    { id: 'spuelluft', from: [-R - 5, -20, 10], to: [-R - 30, -20, 10], color: '#b0d8ff', label: 'LUFT' },
    { id: 'absenken', from: [-R - 5, 24, -10], to: [-R - 30, 24, -10], color: '#c090ff', label: 'ABSENK' },
    { id: 'entleerung', from: [0, YB + 5, R - 2], to: [0, YB + 30, R - 2], color: '#ffaa40', label: 'ENTL' },
    { id: 'entlueftung', from: [0, YT - 10, R - 2], to: [0, YT - 30, R - 2], color: '#7ad0ff', label: 'VENT' },
  ].map((p) => {
    const [fx, fy, fz] = p.from;
    const [tx, ty, tz] = p.to;
    return {
      ...p,
      pa: p3(fx, fy, fz),
      pb: p3(tx, ty, tz),
      valve: p3((fx + tx) / 2, (fy + ty) / 2, (fz + tz) / 2),
    };
  });

  const hotDefs = [
    { id: 'filterglocke', x: 0, y: YT - 7, z: -2, label: 'FG Filterglocke', color: '#4a9eff' },
    { id: 'schichten', x: 0, y: -2, z: 0, label: 'LS Schichten', color: '#34c090' },
    { id: 'dusenboden', x: 0, y: nozzleY, z: 0, label: 'DB Duesenboden', color: '#ffaa40' },
    { id: 'filterkerze', x: 20, y: 24, z: 14, label: 'FK Filterkerze', color: '#c090ff' },
    { id: 'rohwasser', x: -12, y: YT - 8, z: -R - 20, label: 'RW Rohwasser', color: '#4a9eff' },
    { id: 'reinwasser', x: R + 19, y: -6, z: 0, label: 'RE Reinwasser', color: '#34c090' },
    { id: 'spuelwasser', x: 14, y: YT - 8, z: -R - 20, label: 'SW Spuelwasser', color: '#66c0ff' },
    { id: 'schlammwasser', x: R + 18, y: YB - 8, z: 10, label: 'SL Schlammw.', color: '#d09030' },
    { id: 'spuelluft', x: -R - 18, y: -20, z: 10, label: 'LU Spuelluft', color: '#b0d8ff' },
    { id: 'absenken', x: -R - 18, y: 24, z: -10, label: 'AB Absenken', color: '#c090ff' },
    { id: 'entleerung', x: 0, y: YB + 18, z: R - 2, label: 'EN Entleerung', color: '#ffaa40' },
    { id: 'entlueftung', x: 0, y: YT - 22, z: R - 2, label: 'VL Entlueftung', color: '#7ad0ff' },
    { id: 'druck', x: R + 20, y: -12, z: 0, label: 'DP dP', color: dpColor },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const FIDATA = {
    filterglocke: { color: '#4a9eff', icon: 'FG', title: 'Filterglocke / Verteiler', items: [
      'Rohwasser tritt oben ein und wird gleichmaessig verteilt',
      'Verhindert Kanalbildung und lokale Ueberstroemung',
      'Austritt in den Filterraum erfolgt radial in den Kopfbereich',
      'Bei defekter Glocke: ungleichmaessige Filtration und Trubdurchbruch',
    ]},
    schichten: { color: '#34c090', icon: 'LS', title: 'Filterschichten (korrigiert)', items: [
      'Oben: Aktivkohle (Adsorption von Organik, Geruch, Chloraminen)',
      'Mitte: Quarzsand (Hauptabscheidung von Flocken und Partikeln)',
      'Unten: Stuetzkies (Tragschicht zur Lastverteilung)',
      'Diese Reihenfolge ist im Modell jetzt entsprechend umgesetzt',
      'Rueckspuelen bei dP > 0,5 bar oder spaetestens nach 72 h',
    ]},
    dusenboden: { color: '#ffaa40', icon: 'DB', title: 'Duesenboden', items: [
      'Duesenboden stuetzt den Filteraufbau mechanisch',
      'Verteilt Rueckspuelwasser gleichmaessig auf die Flaeche',
      'Schlitzweite typ. 0,2-0,4 mm',
      'Verstopfte Duesen fuehren zu Totzonen und unvollstaendiger Spuelung',
    ]},
    filterkerze: { color: '#c090ff', icon: 'FK', title: 'Filterkerze (Taste im Modell)', items: [
      'Mit Taste "KERZE AN/AUS" wird eine Beispiel-Filterkerze eingeblendet',
      'Darstellung zeigt Schlitze und Anschluss am Duesenboden',
      'Hilft beim Verstaendnis von Stroemung und Rueckspuelverteilung',
      'Kerzenbruch oder Verkalkung verursacht lokale Kurzschlussstroemung',
    ]},
    rohwasser: { color: '#4a9eff', icon: 'RW', title: 'Rohwasserklappe', items: [
      'Eintritt des belasteten Wassers in den Filterkopf',
      'Armatur fuer Normalbetrieb offen, bei Wartung absperrbar',
      'Hydraulik muss ohne Luftsack und mit konstantem Durchsatz laufen',
    ]},
    reinwasser: { color: '#34c090', icon: 'RE', title: 'Reinwasserklappe', items: [
      'Austritt des filtrierten Wassers zur Folgebehandlung',
      'Bei Trubdurchbruch sofort pruefen: Schichten, dP, Rueckspuelzustand',
      'Im Regelbetrieb stetiger Abfluss ohne Pulsation',
    ]},
    spuelwasser: { color: '#66c0ff', icon: 'SW', title: 'Spuelwasserklappe', items: [
      'Rueckspuelbetrieb: Stroemung von unten nach oben',
      'Loest Ablagerungen aus den Schichten',
      'Spuelwasser nie ins Becken zurueckfuehren',
    ]},
    schlammwasser: { color: '#d09030', icon: 'SL', title: 'Schlammwasserklappe', items: [
      'Fuehrt verschmutztes Rueckspuelwasser zum Kanal/Abwurf',
      'Im Normalbetrieb geschlossen',
      'Falsche Schaltstellung kann zu hygienischem Risiko fuehren',
    ]},
    spuelluft: { color: '#b0d8ff', icon: 'LU', title: 'Spuelluftklappe', items: [
      'Luft-Wasser-Spuelung lockert das Filterbett vor Rueckspuelung',
      'Verbessert Austrag von Biofilm und Partikeln',
      'Nur in dafuer freigegebenen Fahrweisen zuschalten',
    ]},
    absenken: { color: '#c090ff', icon: 'AB', title: 'Klappe zum Absenken', items: [
      'Absenkfunktion fuer Schichtberuhigung oder Wartungsfahrweise',
      'Hydraulik wird kontrolliert reduziert',
      'Nur nach Betriebsanweisung schalten',
    ]},
    entleerung: { color: '#ffaa40', icon: 'EN', title: 'Entleerung', items: [
      'Vollstaendige Entleerung fuer Revision und Reparatur',
      'Entleerung nur bei gesicherter Absperrung der Zu-/Ablaufe',
      'Entleerungsweg muss in den Kanal gefuehrt sein',
    ]},
    entlueftung: { color: '#7ad0ff', icon: 'VL', title: 'Entlueftung', items: [
      'Entfernt Luftpolster im Kopfbereich',
      'Luft im Filter reduziert wirksame Filterflaeche',
      'Bei Inbetriebnahme und nach Wartung gezielt entlueften',
    ]},
    druck: { color: dpColor, icon: '?', title: 'Differenzdruck (dP)', items: [
      `Aktuell: ${dp} bar ${dp > 0.5 ? '-> Rueckspuelen' : dp > 0.35 ? '(erhoeht)' : '(normal)'}`,
      'Richtwert sauber: 0,1-0,2 bar',
      'Rueckspuelgrenze: > 0,5 bar oder zeitgesteuert',
      'dP-Anstieg zeigt Beladung und hydraulische Belastung',
    ]},
  };
  const activeData = spot ? FIDATA[spot] : null;

  const kerzeTop = p3(20, 8, 14);
  const kerzeBot = p3(20, 52, 14);

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display: 'block', cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs><pattern id="fiGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
        </pattern></defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#fiGrid)"/>

        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
          </g>
        ))}

        <ellipse cx={bellTop[0].toFixed(1)} cy={bellTop[1].toFixed(1)} rx="17" ry="7"
          fill="#0e3158" fillOpacity="0.55" stroke="#5aa0e8" strokeWidth="1"/>
        <line x1={bellTop[0].toFixed(1)} y1={(bellTop[1] + 1).toFixed(1)} x2={bellBot[0].toFixed(1)} y2={bellBot[1].toFixed(1)}
          stroke="#4a9eff" strokeWidth="2" opacity="0.65" strokeDasharray="4 3" className="wc-flow" style={{ animationDuration: '1.8s' }}/>

        {layers.map((l) => {
          const mid = p3(0, (l.y1 + l.y2) / 2, 0);
          return <text key={l.id} x={mid[0].toFixed(1)} y={mid[1].toFixed(1)} fill="#b0cce0" fontSize="5.3"
            fontFamily="monospace" textAnchor="middle" opacity="0.82">{l.label}</text>;
        })}
        <g>
          <rect x="196" y="16" width="94" height="48" rx="4" fill="#081a2d" stroke="#1a3a5a" strokeWidth="0.9"/>
          <text x="243" y="26" fill="#6fb2e0" fontSize="5" fontFamily="monospace" textAnchor="middle">SCHICHTEN (OBEN -&gt; UNTEN)</text>
          <text x="201" y="38" fill="#9fbfe0" fontSize="5" fontFamily="monospace">1) AKTIVKOHLE</text>
          <text x="201" y="48" fill="#9fbfe0" fontSize="5" fontFamily="monospace">2) QUARZSAND</text>
          <text x="201" y="58" fill="#9fbfe0" fontSize="5" fontFamily="monospace">3) STUETZKIES</text>
        </g>

        {[[-22, nozzleY, -16], [-8, nozzleY, -20], [8, nozzleY, -18], [22, nozzleY, -12], [-16, nozzleY, 12], [0, nozzleY, 15], [16, nozzleY, 14]].map(([x, y, z], i) => {
          const c = p3(x, y, z);
          return <circle key={i} cx={c[0].toFixed(1)} cy={c[1].toFixed(1)} r="2" fill="#15344f" stroke="#60a9f0" strokeWidth="0.7"/>;
        })}

        {pipeDefs.map((pipe) => (
          <g key={pipe.id}>
            <line x1={pipe.pa[0].toFixed(1)} y1={pipe.pa[1].toFixed(1)} x2={pipe.pb[0].toFixed(1)} y2={pipe.pb[1].toFixed(1)}
              stroke="#122a40" strokeWidth="8" strokeLinecap="round"/>
            <line x1={pipe.pa[0].toFixed(1)} y1={pipe.pa[1].toFixed(1)} x2={pipe.pb[0].toFixed(1)} y2={pipe.pb[1].toFixed(1)}
              stroke={pipe.color} strokeWidth="2.3" strokeLinecap="round" opacity="0.68" strokeDasharray="5 4" className="wc-flow"
              style={{ animationDuration: pipe.id === 'reinwasser' ? '1.3s' : '1.9s' }}/>
            <circle cx={pipe.valve[0].toFixed(1)} cy={pipe.valve[1].toFixed(1)} r="5.3" fill="#081626" stroke={pipe.color} strokeWidth="1.2"/>
            <line x1={(pipe.valve[0] - 2.6).toFixed(1)} y1={(pipe.valve[1] - 2.6).toFixed(1)} x2={(pipe.valve[0] + 2.6).toFixed(1)} y2={(pipe.valve[1] + 2.6).toFixed(1)}
              stroke={pipe.color} strokeWidth="1"/>
            <line x1={(pipe.valve[0] - 2.6).toFixed(1)} y1={(pipe.valve[1] + 2.6).toFixed(1)} x2={(pipe.valve[0] + 2.6).toFixed(1)} y2={(pipe.valve[1] - 2.6).toFixed(1)}
              stroke={pipe.color} strokeWidth="1"/>
            <text x={pipe.pb[0].toFixed(1)} y={(pipe.pb[1] - 6).toFixed(1)} fill={pipe.color} fontSize="4.8" fontFamily="monospace" textAnchor="middle">
              {pipe.label}
            </text>
          </g>
        ))}

        {showKerze && (
          <g>
            <line x1={kerzeTop[0].toFixed(1)} y1={kerzeTop[1].toFixed(1)} x2={kerzeBot[0].toFixed(1)} y2={kerzeBot[1].toFixed(1)}
              stroke="#d0a8ff" strokeWidth="7" strokeLinecap="round" opacity="0.45"/>
            <line x1={kerzeTop[0].toFixed(1)} y1={kerzeTop[1].toFixed(1)} x2={kerzeBot[0].toFixed(1)} y2={kerzeBot[1].toFixed(1)}
              stroke="#f0d8ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
            {Array.from({ length: 7 }, (_, i) => 12 + i * 5.5).map((y, i) => {
              const l = p3(17.4, y, 14);
              const r = p3(22.6, y, 14);
              return <line key={i} x1={l[0].toFixed(1)} y1={l[1].toFixed(1)} x2={r[0].toFixed(1)} y2={r[1].toFixed(1)}
                stroke="#c090ff" strokeWidth="1.2" opacity="0.95"/>;
            })}
            <circle cx={kerzeBot[0].toFixed(1)} cy={kerzeBot[1].toFixed(1)} r="3.3" fill="#2b3f5a" stroke="#c090ff" strokeWidth="1"/>
          </g>
        )}

        <g data-hotspot="1" style={{ cursor: 'pointer' }} onClick={(e) => {
          e.stopPropagation();
          setShowKerze(v => !v);
          setSpot('filterkerze');
        }}>
          <rect x="8" y="8" width="88" height="18" rx="4" fill="#0a1a2e" stroke="#355f8a" strokeWidth="1"/>
          <text x="52" y="20" fill={showKerze ? '#d0a8ff' : '#7aa7d3'} fontSize="6.2" fontFamily="monospace" textAnchor="middle">
            {showKerze ? 'KERZE AUSBLENDEN' : 'KERZE EINBLENDEN'}
          </text>
        </g>

        <rect x="232" y="58" width="58" height="44" fill="#0a1a2e" stroke={`${dpColor}80`} strokeWidth="1" rx="4"/>
        <text x="261" y="72" fill="#456080" fontSize="5" fontFamily="monospace" textAnchor="middle">DIFF.-DRUCK</text>
        <text x="261" y="89" fill={dpColor} fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{dp}</text>
        <text x="261" y="97" fill="#456080" fontSize="5" fontFamily="monospace" textAnchor="middle">bar</text>

        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot, 12.5, 6))}

        <text x="150" y="215" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? 'DREHEN...' : '<- ZIEHEN ZUM DREHEN | HOTSPOT ANTIPPEN ->'}
        </text>
      </svg>
      {activeData && (
        <div style={{ background: 'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop: '2px solid ' + activeData.color, padding: '10px 12px', maxHeight: '220px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ color: activeData.color, fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>{activeData.icon} {activeData.title}</span>
            <button onClick={() => setSpot(null)} style={{ background: 'transparent', border: '1px solid #1a3a5a', borderRadius: '4px', color: '#5a8090', fontSize: '11px', padding: '2px 7px', cursor: 'pointer' }}>X</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color: '#8ab0c0', fontSize: '10px', fontFamily: 'monospace', margin: '2px 0', lineHeight: '1.5' }}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function DesinfektionDeepDive({ metrics, xrayMode = false }) {
  const [rx, setRx] = useState(-18);
  const [ry, setRy] = useState(22);
  const [drag, setDrag] = useState(null);
  const [spot, setSpot] = useState(null);
  const cl = metrics.freeChlorine;
  const clOk = cl >= 0.3 && cl <= 0.6;
  const clColor = clOk ? '#34c090' : cl > 0.8 ? '#d04040' : '#d09030';

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
    const d = 320 / (320 + z2);
    return [150 + x1 * d, 108 + y1 * d, z2];
  };
  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  // NaOCl tank: octagonal cylinder at left, R=28, x-offset -55
  const TR = 28, TN = 8, TX = -55, TTY = -55, TBY = 30;
  const tAng = i => (i / TN) * Math.PI * 2;
  const tankTop = Array.from({ length: TN }, (_, i) => p3(TX + TR * Math.cos(tAng(i)), TTY, TR * Math.sin(tAng(i))));
  const tankBot = Array.from({ length: TN }, (_, i) => p3(TX + TR * Math.cos(tAng(i)), TBY, TR * Math.sin(tAng(i))));
  // Liquid inside
  const liqY = TBY - (TBY - TTY) * 0.6;
  const tankLiq = Array.from({ length: TN }, (_, i) => p3(TX + TR * Math.cos(tAng(i)), liqY, TR * Math.sin(tAng(i))));

  const tankSides = [];
  for (let i = 0; i < TN; i++) {
    const j = (i + 1) % TN;
    tankSides.push({ id: `ts${i}`, pts: [tankTop[i], tankTop[j], tankBot[j], tankBot[i]], fill: '#081e3c', stroke: '#1a3a5a', strokeW: 1 });
    tankSides.push({ id: `tl${i}`, pts: [tankLiq[i], tankLiq[j], tankBot[j], tankBot[i]], fill: '#001080', fillOp: 0.3, stroke: '#2050a0', strokeW: 0.4 });
  }

  // CO₂ tank: smaller octagonal cylinder at right-back, R=20, x-offset 30
  const CR = 20, CX = 30, CTY = -45, CBY = 15;
  const co2Top = Array.from({ length: TN }, (_, i) => p3(CX + CR * Math.cos(tAng(i)), CTY, CR * Math.sin(tAng(i))));
  const co2Bot = Array.from({ length: TN }, (_, i) => p3(CX + CR * Math.cos(tAng(i)), CBY, CR * Math.sin(tAng(i))));
  const co2Sides = [];
  for (let i = 0; i < TN; i++) {
    const j = (i + 1) % TN;
    co2Sides.push({ id: `cs${i}`, pts: [co2Top[i], co2Top[j], co2Bot[j], co2Bot[i]], fill: '#1a1808', stroke: '#3a3020', strokeW: 0.8 });
  }

  // Main water pipe: horizontal box at y=55, z=0
  const PY = 55, PH = 12;
  const pipeFaces = [
    { id: 'pf', pts: [p3(-90, PY, -PH), p3(90, PY, -PH), p3(90, PY + PH, -PH), p3(-90, PY + PH, -PH)], fill: '#0e1e30', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'pt', pts: [p3(-90, PY, -PH), p3(90, PY, -PH), p3(90, PY, PH), p3(-90, PY, PH)], fill: '#0c2a50', stroke: '#2a5a90', strokeW: 1 },
    { id: 'pb', pts: [p3(-90, PY, PH), p3(90, PY, PH), p3(90, PY + PH, PH), p3(-90, PY + PH, PH)], fill: '#081828', stroke: '#1a3a5a', strokeW: 0.8 },
  ];

  const faces = [
    ...pipeFaces,
    { id: 'tbot', pts: tankBot, fill: '#061828', stroke: '#1a3a5a', strokeW: 1 },
    ...tankSides,
    { id: 'tliq', pts: tankLiq, fill: '#1a40a0', fillOp: 0.45, stroke: '#4070d0', strokeW: 0.6 },
    { id: 'ttop', pts: tankTop, fill: '#0c2a50', fillOp: 0.35, stroke: '#2a5a90', strokeW: 1 },
    { id: 'cbot', pts: co2Bot, fill: '#0a0a04', stroke: '#2a2818', strokeW: 0.8 },
    ...co2Sides,
    { id: 'ctop', pts: co2Top, fill: '#1a1808', fillOp: 0.5, stroke: '#3a3020', strokeW: 1 },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a, b) => b.zVal - a.zVal);
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 108);

  // Dosing line from NaOCl to pipe
  const doseA = p3(TX, TBY, 0), doseB = p3(TX, PY, 0);
  // Injection point on pipe
  const injPt = p3(-20, PY, 0);
  // Measurement cell downstream
  const measPt = p3(50, PY, 0);
  // CO₂ dosing line
  const co2A = p3(CX, CBY, 0), co2B = p3(CX, PY, 0);

  const hotDefs = [
    { id: 'naocl', x: TX, y: (TTY + TBY) / 2, z: 0, label: '⬡ NaOCl', color: '#4a9eff' },
    { id: 'co2', x: CX, y: (CTY + CBY) / 2, z: 0, label: '⬡ CO₂', color: '#d09030' },
    { id: 'injektion', x: -20, y: PY, z: 0, label: '↓ Injektion', color: '#34c090' },
    { id: 'messzelle', x: 50, y: PY, z: 0, label: '◎ Messzelle', color: clColor },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const DDATA = {
    naocl: { color: '#4a9eff', icon: '⬡', title: 'NaOCl-Vorratstank', items: [
      '💧 Natriumhypochlorit (NaOCl): 12–15 % Aktivchlor',
      '📏 Dosiermenge: 0,5–2 g/m³ je nach Belastung',
      '🔧 Membrandosierpumpe: proportional zum Volumenstrom',
      '⚠ Lagerung: kühl, dunkel, max. 3 Monate (Zerfall!)',
      '🛡 Auffangwanne + Leckage-Alarm vorgeschrieben',
      '📋 GHS-Kennzeichnung: ätzend, umweltgefährdend',
    ]},
    co2: { color: '#d09030', icon: '⬡', title: 'CO₂ pH-Korrektur', items: [
      '📐 Ziel-pH: 7,0–7,4 (optimal für Chlorwirkung)',
      '💨 CO₂ löst sich → Kohlensäure → senkt pH',
      '⚖ Alternative: Salzsäure (HCl) – aggressiver',
      '📊 pH-Sonde steuert CO₂-Ventil automatisch',
      '⚠ pH > 7,5 → Chlor nur noch 50 % wirksam!',
      '📋 pH-Wert 3× täglich messen und dokumentieren',
    ]},
    injektion: { color: '#34c090', icon: '↓', title: 'Injektionspunkt', items: [
      '📍 Nach Filter, vor Heizung (DIN 19643-Reihenfolge)',
      '🔧 Impfstelle: T-Stück mit Rückschlagventil',
      '🌊 Turbulente Strömung für schnelle Durchmischung',
      '📏 Kontaktzeit: min. 30 s bis zur Messstelle',
      '⚠ Dosierung VOR der Heizung (Chlor verdampft bei Hitze)',
      '🔒 Rückschlagventil verhindert Wasserrücktritt in Tank',
    ]},
    messzelle: { color: clColor, icon: '◎', title: 'Chlor-Messzelle', items: [
      `📊 Aktuell: ${cl} mg/L freies Chlor ${clOk ? '✓ IM SOLL' : cl < 0.3 ? '↑ ZU NIEDRIG' : '↓ ZU HOCH'}`,
      '📏 Sollbereich: 0,3–0,6 mg/L (DIN 19643)',
      '🔬 DPD-Methode: Farbreaktion → photometrische Messung',
      '⚙ Online-Sensor: amperometrisch, alle 30 s Messwert',
      '📋 Manuelle Gegenmessung: 3× täglich mit DPD-Test',
      '⚠ Gebundenes Chlor (Chloramine) separat prüfen!',
    ]},
  };
  const activeData = spot ? DDATA[spot] : null;

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display: 'block', cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs><pattern id="dGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
        </pattern></defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#dGrid)"/>

        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
          </g>
        ))}

        {/* Tank labels */}
        {(() => { const c = p3(TX, (TTY + TBY) / 2, 0); return <text x={c[0].toFixed(1)} y={c[1].toFixed(1)} fill="#5090d0" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">NaOCl</text>; })()}
        {(() => { const c = p3(CX, (CTY + CBY) / 2, 0); return <text x={c[0].toFixed(1)} y={c[1].toFixed(1)} fill="#d09040" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">CO₂</text>; })()}

        {/* Dosing lines */}
        <line x1={doseA[0].toFixed(1)} y1={doseA[1].toFixed(1)} x2={doseB[0].toFixed(1)} y2={doseB[1].toFixed(1)}
          stroke="#2a5090" strokeWidth="3" strokeLinecap="round"/>
        <line x1={doseA[0].toFixed(1)} y1={doseA[1].toFixed(1)} x2={doseB[0].toFixed(1)} y2={doseB[1].toFixed(1)}
          stroke="#4a9eff" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 3" className="wc-flow" style={{ animationDuration: '1.5s' }}/>

        <line x1={co2A[0].toFixed(1)} y1={co2A[1].toFixed(1)} x2={co2B[0].toFixed(1)} y2={co2B[1].toFixed(1)}
          stroke="#3a3020" strokeWidth="3" strokeLinecap="round"/>
        <line x1={co2A[0].toFixed(1)} y1={co2A[1].toFixed(1)} x2={co2B[0].toFixed(1)} y2={co2B[1].toFixed(1)}
          stroke="#d09040" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 3" className="wc-flow" style={{ animationDuration: '2s' }}/>

        {/* Injection point marker */}
        <circle cx={injPt[0].toFixed(1)} cy={injPt[1].toFixed(1)} r="5" fill="#0a1828" stroke={clColor} strokeWidth="1.5">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/>
        </circle>

        {/* Measurement cell */}
        <circle cx={measPt[0].toFixed(1)} cy={measPt[1].toFixed(1)} r="6" fill="#0a1828" stroke={clColor} strokeWidth="2"/>
        <circle cx={measPt[0].toFixed(1)} cy={measPt[1].toFixed(1)} r="3" fill={clColor} opacity="0.5"/>

        {/* Flow direction on pipe */}
        {(() => {
          const a = p3(-70, PY + PH / 2, 0), b = p3(70, PY + PH / 2, 0);
          return <line x1={a[0].toFixed(1)} y1={a[1].toFixed(1)} x2={b[0].toFixed(1)} y2={b[1].toFixed(1)}
            stroke="#4a9eff" strokeWidth="2" opacity="0.5" strokeDasharray="8 5" className="wc-flow" style={{ animationDuration: '2s' }}/>;
        })()}

        {/* Chlorine display */}
        <rect x="232" y="8" width="60" height="44" fill="#0a1a2e" stroke={`${clColor}80`} strokeWidth="1" rx="4"/>
        <text x="262" y="20" fill="#456080" fontSize="5" fontFamily="monospace" textAnchor="middle">FREIES CHLOR</text>
        <text x="262" y="36" fill={clColor} fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{cl}</text>
        <text x="262" y="44" fill="#456080" fontSize="5" fontFamily="monospace" textAnchor="middle">mg/L</text>
        <text x="262" y="50" fill={clColor} fontSize="4.5" fontFamily="monospace" textAnchor="middle">{clOk ? '✓ SOLL' : cl < 0.3 ? '↑ NIEDRIG' : '↓ HOCH'}</text>

        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot))}

        <text x="150" y="215" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? '◉ DREHEN…' : '⟵ ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN ⟶'}
        </text>
      </svg>
      {activeData && (
        <div style={{ background: 'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop: '2px solid ' + activeData.color, padding: '10px 12px', maxHeight: '180px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ color: activeData.color, fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>{activeData.icon} {activeData.title}</span>
            <button onClick={() => setSpot(null)} style={{ background: 'transparent', border: '1px solid #1a3a5a', borderRadius: '4px', color: '#5a8090', fontSize: '11px', padding: '2px 7px', cursor: 'pointer' }}>✕</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color: '#8ab0c0', fontSize: '10px', fontFamily: 'monospace', margin: '2px 0', lineHeight: '1.5' }}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Plattenwärmetauscher 3D Deep-Dive ───────────────────────────────────────
function HeizungDeepDive({ metrics, xrayMode = false }) {
  const [rx, setRx] = useState(-20);
  const [ry, setRy] = useState(28);
  const [drag, setDrag] = useState(null);
  const [spot, setSpot] = useState(null);
  const temp = metrics.temperature;
  const tempOk = temp >= 26 && temp <= 28;
  const tempColor = tempOk ? '#34c090' : '#d09030';

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
    const d = 320 / (320 + z2);
    return [150 + x1 * d, 108 + y1 * d, z2];
  };
  const avgZ = pts => pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  // Rectangular block: x ±60, y ±50, z ±30 (plate stack)
  const XW = 60, YH = 50, ZD = 30;
  const TFL = p3(-XW, -YH, -ZD), TFR = p3(XW, -YH, -ZD), TBR = p3(XW, -YH, ZD), TBL = p3(-XW, -YH, ZD);
  const BFL = p3(-XW, YH, -ZD), BFR = p3(XW, YH, -ZD), BBR = p3(XW, YH, ZD), BBL = p3(-XW, YH, ZD);

  // Internal plates (visible through semi-transparent front)
  const plateCount = 8;
  const plateGap = (2 * ZD) / (plateCount + 1);

  const faces = [
    { id: 'bot', pts: [BFL, BFR, BBR, BBL], fill: '#061520', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'back', pts: [TBL, TBR, BBR, BBL], fill: '#081828', stroke: '#1a3a5a', strokeW: 1 },
    { id: 'left', pts: [TFL, TBL, BBL, BFL], fill: '#0a1e30', stroke: '#1a3a5a', strokeW: 1, content: 'left' },
    { id: 'right', pts: [TFR, TBR, BBR, BFR], fill: '#0a1e30', stroke: '#1a3a5a', strokeW: 1, content: 'right' },
    { id: 'front', pts: [TFL, TFR, BFR, BFL], fill: '#081e3c', fillOp: 0.45, stroke: '#1a3a5a', strokeW: 1 },
    { id: 'top', pts: [TFL, TFR, TBR, TBL], fill: '#0c2a50', fillOp: 0.35, stroke: '#2a5a90', strokeW: 1 },
  ].map(f => ({ ...f, zVal: avgZ(f.pts) })).sort((a, b) => b.zVal - a.zVal);
  const sceneFaces = applyDeepDiveXray(faces, xrayMode, 150, 108);

  // Plate cross-sections (alternating red/blue channels)
  const plates = [];
  for (let i = 1; i <= plateCount; i++) {
    const z = -ZD + i * plateGap;
    plates.push({
      z, color: i % 2 === 0 ? '#3a1010' : '#0a2040',
      top: p3(-XW + 4, -YH + 4, z), bot: p3(-XW + 4, YH - 4, z),
      topR: p3(XW - 4, -YH + 4, z), botR: p3(XW - 4, YH - 4, z)
    });
  }

  // Connection pipes: primary (hot) left side, secondary (cold) right side
  const primIn = p3(-XW - 5, -YH + 15, 0), primInB = p3(-XW - 30, -YH + 15, 0);
  const primOut = p3(-XW - 5, YH - 15, 0), primOutB = p3(-XW - 30, YH - 15, 0);
  const secIn = p3(XW + 5, YH - 15, 0), secInB = p3(XW + 30, YH - 15, 0);
  const secOut = p3(XW + 5, -YH + 15, 0), secOutB = p3(XW + 30, -YH + 15, 0);

  const hotDefs = [
    { id: 'platten', x: 0, y: 0, z: 0, label: '▥ Platten', color: '#4a9eff' },
    { id: 'primaer', x: -XW - 18, y: 0, z: 0, label: '← Primär', color: '#d04040' },
    { id: 'sekundaer', x: XW + 18, y: 0, z: 0, label: '→ Sekundär', color: '#3080d0' },
    { id: 'dichtung', x: 0, y: -YH - 5, z: 0, label: '⊙ Dichtung', color: '#ffaa40' },
  ].map(h => ({ ...h, proj: p3(h.x, h.y, h.z) }));

  const HDATA = {
    platten: { color: '#4a9eff', icon: '▥', title: 'Wärmetauscherplatten', items: [
      '🔧 Material: Edelstahl 1.4404 (AISI 316L), 0,5–0,8 mm',
      '📐 Wellenprofil: Fischgrätmuster für turbulente Strömung',
      '🔄 Gegenstrom: Primär ↓ / Sekundär ↑ → max. Wärmeübertragung',
      '📏 Typisch 20–60 Platten je nach Leistung',
      '⚠ Kalkablagerungen reduzieren Wärmeübergang drastisch',
      '📋 CIP-Reinigung (Zitronensäure) mind. 1× jährlich',
    ]},
    primaer: { color: '#d04040', icon: '←', title: 'Primärkreis (Heizwasser)', items: [
      '🌡 Vorlauf: 60–90 °C (Fernwärme oder Kessel)',
      '🌡 Rücklauf: 40–55 °C (nach Wärmeabgabe)',
      '⚙ Regelventil: steuert Vorlauf-Temperatur',
      '🔒 Hydraulisch getrennt vom Beckenwasser!',
      '📊 Wärmemengenzähler für Energiemonitoring',
      '📐 Leistung: 50–500 kW je nach Beckengröße',
    ]},
    sekundaer: { color: '#3080d0', icon: '→', title: 'Sekundärkreis (Beckenwasser)', items: [
      `🌡 Aktuell: ${temp} °C ${tempOk ? '✓ IM SOLL' : '⚠ PRÜFEN'}`,
      '📐 Ziel: 26–28 °C (Schwimmer), bis 32 °C (Kinder)',
      '🌊 Beckenwasser durchströmt Plattenzwischenräume',
      '📍 Position im Kreislauf: NACH Desinfektion',
      '⚠ Chlor bei > 35 °C → verstärkter Abbau → nachdosieren',
      '📋 Temperatur 3× täglich messen und dokumentieren',
    ]},
    dichtung: { color: '#ffaa40', icon: '⊙', title: 'Plattendichtungen', items: [
      '🔧 Material: EPDM oder NBR (chlorbeständig)',
      '📐 Dichtringe zwischen jeder Platte eingeklebt',
      '🔀 Lenken Primär- und Sekundärmedium alternierend',
      '⚠ Defekte Dichtung → Vermischung der Kreisläufe!',
      '📏 Lebensdauer: 5–10 Jahre je nach Chlorgehalt',
      '📋 Visuelle Kontrolle bei jeder Revision auf Verformung',
    ]},
  };
  const activeData = spot ? HDATA[spot] : null;

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#040d1a' }}>
      <svg viewBox="0 0 300 220" width="100%" height="280px"
        style={{ display: 'block', cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs><pattern id="hGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0a1e32" strokeWidth="0.4"/>
        </pattern></defs>
        <rect width="300" height="220" fill="#040d1a"/>
        <rect width="300" height="220" fill="url(#hGrid)"/>

        {sceneFaces.map(f => (
          <g key={f.id}>
            {renderDeepDiveFace(f, poly, xrayMode)}
          </g>
        ))}

        {/* Internal plates */}
        {plates.map((pl, i) => (
          <line key={i} x1={pl.top[0].toFixed(1)} y1={pl.top[1].toFixed(1)} x2={pl.bot[0].toFixed(1)} y2={pl.bot[1].toFixed(1)}
            stroke={pl.color} strokeWidth="2.5" opacity="0.65"/>
        ))}

        {/* Primary pipes (red/hot) */}
        <line x1={primIn[0].toFixed(1)} y1={primIn[1].toFixed(1)} x2={primInB[0].toFixed(1)} y2={primInB[1].toFixed(1)}
          stroke="#3a1010" strokeWidth="8" strokeLinecap="round"/>
        <line x1={primIn[0].toFixed(1)} y1={primIn[1].toFixed(1)} x2={primInB[0].toFixed(1)} y2={primInB[1].toFixed(1)}
          stroke="#d04040" strokeWidth="3" opacity="0.7" strokeDasharray="5 4" className="wc-flow" style={{ animationDuration: '1.5s' }}/>
        <text x={(primInB[0] - 2).toFixed(1)} y={(primInB[1] - 6).toFixed(1)} fill="#d04040" fontSize="5" fontFamily="monospace" textAnchor="end">VORLAUF</text>

        <line x1={primOut[0].toFixed(1)} y1={primOut[1].toFixed(1)} x2={primOutB[0].toFixed(1)} y2={primOutB[1].toFixed(1)}
          stroke="#3a1010" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
        <line x1={primOut[0].toFixed(1)} y1={primOut[1].toFixed(1)} x2={primOutB[0].toFixed(1)} y2={primOutB[1].toFixed(1)}
          stroke="#d07070" strokeWidth="2" opacity="0.5" strokeDasharray="5 4" className="wc-flow" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}/>
        <text x={(primOutB[0] - 2).toFixed(1)} y={(primOutB[1] - 6).toFixed(1)} fill="#d07070" fontSize="5" fontFamily="monospace" textAnchor="end">RÜCKLAUF</text>

        {/* Secondary pipes (blue/cold) */}
        <line x1={secIn[0].toFixed(1)} y1={secIn[1].toFixed(1)} x2={secInB[0].toFixed(1)} y2={secInB[1].toFixed(1)}
          stroke="#0a2040" strokeWidth="8" strokeLinecap="round"/>
        <line x1={secIn[0].toFixed(1)} y1={secIn[1].toFixed(1)} x2={secInB[0].toFixed(1)} y2={secInB[1].toFixed(1)}
          stroke="#3080d0" strokeWidth="3" opacity="0.7" strokeDasharray="5 4" className="wc-flow" style={{ animationDuration: '1.5s' }}/>
        <text x={(secInB[0] + 2).toFixed(1)} y={(secInB[1] - 6).toFixed(1)} fill="#3080d0" fontSize="5" fontFamily="monospace">KALT EIN</text>

        <line x1={secOut[0].toFixed(1)} y1={secOut[1].toFixed(1)} x2={secOutB[0].toFixed(1)} y2={secOutB[1].toFixed(1)}
          stroke="#0a2040" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
        <line x1={secOut[0].toFixed(1)} y1={secOut[1].toFixed(1)} x2={secOutB[0].toFixed(1)} y2={secOutB[1].toFixed(1)}
          stroke="#3080d0" strokeWidth="2" opacity="0.5" strokeDasharray="5 4" className="wc-flow" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}/>
        <text x={(secOutB[0] + 2).toFixed(1)} y={(secOutB[1] - 6).toFixed(1)} fill="#3080d0" fontSize="5" fontFamily="monospace">WARM AUS</text>

        {/* Temperature display */}
        <rect x="232" y="8" width="60" height="40" fill="#0a1a2e" stroke={`${tempColor}80`} strokeWidth="1" rx="4"/>
        <text x="262" y="20" fill="#456080" fontSize="5" fontFamily="monospace" textAnchor="middle">BECKENWASSER</text>
        <text x="262" y="34" fill={tempColor} fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{temp}°C</text>
        <text x="262" y="44" fill={tempColor} fontSize="4.5" fontFamily="monospace" textAnchor="middle">{tempOk ? '✓ IM SOLL' : '⚠ PRÜFEN'}</text>

        {hotDefs.map(h => renderDeepDiveHotspot(h, spot, setSpot))}

        <text x="150" y="215" fill="#1a3a5a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {drag ? '◉ DREHEN…' : '⟵ ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN ⟶'}
        </text>
      </svg>
      {activeData && (
        <div style={{ background: 'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop: '2px solid ' + activeData.color, padding: '10px 12px', maxHeight: '180px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ color: activeData.color, fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>{activeData.icon} {activeData.title}</span>
            <button onClick={() => setSpot(null)} style={{ background: 'transparent', border: '1px solid #1a3a5a', borderRadius: '4px', color: '#5a8090', fontSize: '11px', padding: '2px 7px', cursor: 'pointer' }}>✕</button>
          </div>
          {activeData.items.map((item, i) => (
            <p key={i} style={{ color: '#8ab0c0', fontSize: '10px', fontFamily: 'monospace', margin: '2px 0', lineHeight: '1.5' }}>{item}</p>
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
    return <PumpeDeepDive metrics={metrics} xrayMode={xrayMode}/>;
  }

  if (stationId === 'filter') {
    return <FilterDeepDive metrics={metrics} xrayMode={xrayMode}/>;
  }

  if (stationId === 'desinfektion') {
    return <DesinfektionDeepDive metrics={metrics} xrayMode={xrayMode}/>;
  }

  if (stationId === 'heizung') {
    return <HeizungDeepDive metrics={metrics} xrayMode={xrayMode}/>;
  }

  if (stationId === 'schwall') {
    return <SchwallDeepDive metrics={metrics} xrayMode={xrayMode}/>;
  }

  if (stationId === 'flockung') {
    return <FlockungDeepDive metrics={metrics} xrayMode={xrayMode}/>;
  }

  if (stationId === 'becken') {
    return <BeckenDeepDive metrics={metrics} xrayMode={xrayMode}/>;
  }

  if (stationId === 'ueberlauf') {
    return <UeberlaufDeepDive xrayMode={xrayMode}/>;
  }

  if (stationId === 'ruecklauf') {
    return <RuecklaufDeepDive metrics={metrics} xrayMode={xrayMode}/>;
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
  const [filterInfoTab, setFilterInfoTab] = useState('materialien');
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
    if (!deepDiveStationId) return;
    if (deepDiveStationId === 'filter') setFilterInfoTab('materialien');
  }, [deepDiveStationId]);

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
        .wc-jet { stroke-dasharray: 4 7; animation: wcFlow linear infinite; }
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
                      <path d={path} fill="none" stroke="#061525" strokeWidth="20" strokeLinecap="round"/>
                      <path d={path} fill="none" stroke="#1d4060" strokeWidth="14" strokeLinecap="round"/>
                      <path d={path} fill="none" stroke="#0c2236" strokeWidth="8" strokeLinecap="round"/>
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
                        <line x1={nx - 4} y1="93" x2={nx - 4} y2="55" stroke="#4ac8ff" strokeWidth="1.5" opacity="0.7" className="wc-jet" style={{ animationDuration: `${flowDuration}s` }}/>
                        <line x1={nx}     y1="93" x2={nx}     y2="50" stroke="#4ac8ff" strokeWidth="2.5" opacity="0.95" className="wc-jet" style={{ animationDuration: `${flowDuration}s` }} filter="url(#wcGlowSM)"/>
                        <line x1={nx + 4} y1="93" x2={nx + 4} y2="55" stroke="#4ac8ff" strokeWidth="1.5" opacity="0.7" className="wc-jet" style={{ animationDuration: `${flowDuration}s`, animationDelay: '0.2s' }}/>
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
                  <rect x="322" y="436" width="68" height="44" fill="#1a2838" fillOpacity={xrayMode ? 0.9 : 0.5}/>
                  <rect x="322" y="480" width="68" height="54" fill="#384818" fillOpacity={xrayMode ? 0.9 : 0.5}/>
                  <rect x="322" y="534" width="68" height="52" fill="#2a4030" fillOpacity={xrayMode ? 0.9 : 0.5}/>
                  <line x1="320" y1="480" x2="392" y2="480" stroke="#1a3a5a" strokeWidth="0.8" strokeDasharray="3 2.5"/>
                  <line x1="320" y1="534" x2="392" y2="534" stroke="#1a3a5a" strokeWidth="0.8" strokeDasharray="3 2.5"/>
                  {!xrayMode && <>
                    <text x="356" y="462" fill="#2a4058" fontSize="6.5" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                    <text x="356" y="510" fill="#4a6020" fontSize="6.5" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                    <text x="356" y="562" fill="#2a5040" fontSize="6.5" fontFamily="monospace" textAnchor="middle">STUETZKIES</text>
                  </>}
                  {xrayMode && <>
                    <text x="356" y="462" fill="#6080a0" fontSize="6.5" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                    <text x="356" y="510" fill="#90c060" fontSize="6.5" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                    <text x="356" y="562" fill="#60c090" fontSize="6.5" fontFamily="monospace" textAnchor="middle">STUETZKIES</text>
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

                {/* ══════════════ FULL CIRCUIT FLOW (continuous path through ALL stations) ══════════════ */}
                {metrics.flowRate > 0 && !controls.backwashMode && (() => {
                  // Complete water circuit: Becken → Überlauf → Schwall (through) → Pumpe (through) → Flockung (through) → Filter (through) → Desinf → Heizung → Rücklauf → Becken
                  const circuitPath = 'M 274 54 L 284 54 L 356 54 L 356 115 L 356 222 L 356 258 L 356 326 L 356 348 L 356 408 L 356 422 L 356 603 L 320 603 L 20 603 L 20 500 L 20 406 L 20 284 L 20 97';
                  const circuitRel = 'M 0 0 L 10 0 L 82 0 L 82 61 L 82 168 L 82 204 L 82 272 L 82 294 L 82 354 L 82 368 L 82 549 L 46 549 L -254 549 L -254 446 L -254 352 L -254 230 L -254 43';
                  const dur = (parseFloat(flowDuration) * 3.5 + 2).toFixed(1);
                  return (
                    <g pointerEvents="none">
                      {/* Continuous flow line through everything */}
                      <path d={circuitPath} fill="none" stroke="#0a3a6a"
                        strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.45"/>
                      <path d={circuitPath} fill="none" stroke="#60d8ff"
                        strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"
                        className="wc-flow" style={{ animationDuration: `${flowDuration}s` }}
                        filter="url(#wcGlowM)"/>
                      {/* Water particles traveling the full circuit */}
                      {[0, 0.15, 0.3, 0.45, 0.6, 0.75].map((frac, i) => (
                        <circle key={`mc-${i}`} r="4" fill="#48cae4" opacity="0.9" cx="274" cy="54" filter="url(#wcGlowM)">
                          <animateMotion
                            dur={`${dur}s`}
                            begin={`${(frac * parseFloat(dur)).toFixed(1)}s`}
                            repeatCount="indefinite"
                            path={circuitRel}
                            keyPoints="0;1"
                            keyTimes="0;1"
                            calcMode="linear"/>
                        </circle>
                      ))}
                    </g>
                  );
                })()}

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
                    <stop offset="0%" stopColor="#1e7ab8" stopOpacity="0.92"/>
                    <stop offset="100%" stopColor="#0c3a6a" stopOpacity="0.97"/>
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
                  <filter id="wcGlowStrong" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="6" result="blur"/>
                    <feColorMatrix in="blur" type="matrix" values="1.5 0 0 0 0  0 1.5 0 0 0.1  0 0 2 0 0.2  0 0 0 1.2 0" result="colorBlur"/>
                    <feMerge><feMergeNode in="colorBlur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
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

                {/* ── FLOW DIRECTION ARROWS (midpoints on key pipe segments) ── */}
                {metrics.flowRate > 0 && (
                  <g pointerEvents="none">
                    {/* becken→überlauf→schwall: rightward at y=125, midpoint ~x=310 */}
                    {!controls.backwashMode && <polygon points="310,120 325,125 310,130" fill="#4a9eff" opacity="0.6"/>}
                    {/* pumpe→flockung: upward at x=635, midpoint ~y=237 */}
                    {!controls.backwashMode && <polygon points="630,237 635,222 640,237" fill="#4a9eff" opacity="0.6"/>}
                    {/* heizung→rücklauf: leftward at y=627, midpoint ~x=577 */}
                    {!controls.backwashMode && <polygon points="582,622 567,627 582,632" fill="#4a9eff" opacity="0.6"/>}
                    {/* rücklauf→becken: leftward at y=680, midpoint ~x=248 */}
                    <polygon points="253,675 238,680 253,685" fill="#4a9eff" opacity="0.6"/>
                    {/* rücklauf→becken: upward at x=112, midpoint ~y=602 */}
                    <polygon points="107,607 112,592 117,607" fill="#4a9eff" opacity="0.6"/>
                    {/* backwash: filter→kanal downward at x=980, midpoint ~y=555 */}
                    {controls.backwashMode && <polygon points="975,557 980,572 985,557" fill="#f09030" opacity="0.6"/>}
                  </g>
                )}

                {/* ── BECKEN (pool cross-section, left column) ── */}
                <g className="wc-station" onClick={() => chooseStation('becken')} style={{ cursor: 'pointer' }}>
                  <rect x="25" y="45" width="170" height="480" rx="6" fill="#050e1c" stroke={selectedStationId === 'becken' ? '#4a9eff' : '#1a3a5a'} strokeWidth="2"/>
                  {/* Water fill — level at y=105, above weir crest at y=108 so water overflows */}
                  <rect x="35" y="105" width="148" height="410" rx="3" fill="url(#wcWaterFill)"/>
                  <path d="M35 107 Q70 101 105 107 Q140 113 165 106 Q175 103 183 107" fill="none" stroke="#4ab0ff" strokeWidth="1.8" className="wc-surface" opacity="0.75"/>
                  {/* Bodeneinströmdüsen (2 nozzles for narrower pool) */}
                  {[80, 135].map((nx, ni) => (
                    <g key={nx}>
                      <rect x={nx-11} y="511" width="22" height="8" rx="2" fill="#1a4a80" fillOpacity="0.6" stroke="#4a9eff" strokeWidth="1"/>
                      {metrics.flowRate > 0 && <>
                        <line x1={nx-5} y1="510" x2={nx-5} y2="470" stroke="#4ac8ff" strokeWidth="2" opacity="0.7" className="wc-jet" style={{ animationDuration: `${flowDuration}s`, animationDelay: `${ni * 0.2}s` }}/>
                        <line x1={nx}   y1="510" x2={nx}   y2="460" stroke="#4ac8ff" strokeWidth="3" opacity="0.95" className="wc-jet" style={{ animationDuration: `${flowDuration}s`, animationDelay: `${ni * 0.2 + 0.15}s` }} filter="url(#wcGlow)"/>
                        <line x1={nx+5} y1="510" x2={nx+5} y2="470" stroke="#4ac8ff" strokeWidth="2" opacity="0.7" className="wc-jet" style={{ animationDuration: `${flowDuration}s`, animationDelay: `${ni * 0.2 + 0.3}s` }}/>
                      </>}
                    </g>
                  ))}
                  {/* Return pipe entry glow at pool floor (ruecklauf-becken arrives at 112,525) */}
                  <circle cx="112" cy="522" r="8" fill="#4ac8ff"
                    fillOpacity={metrics.flowRate > 0 ? 0.18 : 0.05}
                    filter={metrics.flowRate > 0 ? 'url(#wcGlow)' : undefined}/>
                  <circle cx="112" cy="522" r="3.5" fill="#4ac8ff"
                    fillOpacity={metrics.flowRate > 0 ? 0.55 : 0.12}/>
                  {/* Horizontal distribution manifold at pool floor */}
                  <line x1="65" y1="519" x2="165" y2="519" stroke="#152a45" strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
                  {metrics.flowRate > 0 && (
                    <line x1="65" y1="519" x2="165" y2="519" stroke="#4ac8ff" strokeWidth="2.5" opacity="0.35"
                      style={{ strokeDasharray: '6 5', animation: `wcFlow ${flowDuration}s linear infinite` }}/>
                  )}
                  {/* ── OVERFLOW WEIR (right pool wall) ── */}
                  {/* Wall above weir crest (y=45 to y=108) */}
                  <rect x="183" y="45" width="12" height="63" fill="#050e1c" stroke="#1a3a5a" strokeWidth="1"/>
                  {/* Weir crest line — the visible overflow edge */}
                  <line x1="183" y1="108" x2="195" y2="108" stroke="#4a9eff" strokeWidth="2" opacity="0.7"/>
                  {/* Open overflow slot (y=108 to y=142) — water cascades through here */}
                  <rect x="183" y="108" width="12" height="34" fill="#102850" fillOpacity="0.6"/>
                  <rect x="184" y="109" width="10" height="32" fill="#1060c0" fillOpacity="0.45" rx="1"/>
                  {/* Wall below weir (y=142 to pool bottom y=525) */}
                  <rect x="183" y="142" width="12" height="383" fill="#050e1c" stroke="#1a3a5a" strokeWidth="1"/>
                  {/* Animated waterfall cascade through the weir opening */}
                  {metrics.flowRate > 0 && <>
                    {/* Bright water sheet falling over weir */}
                    <rect x="184" y="108" width="10" height="34" fill="#2090d0" fillOpacity="0.6" rx="1"/>
                    {[
                      { x: 185, delay: 0,    w: 3.5 },
                      { x: 187, delay: 0.08, w: 3   },
                      { x: 189, delay: 0.16, w: 4   },
                      { x: 191, delay: 0.24, w: 3.5 },
                      { x: 193, delay: 0.12, w: 3   },
                    ].map(({ x, delay, w }) => (
                      <line key={x}
                        x1={x} y1="108" x2={x} y2="142"
                        stroke="#60d8ff" strokeWidth={w} opacity="0.85"
                        style={{ strokeDasharray: '5 4', animation: `wcFlow 0.45s linear ${delay}s infinite` }}
                        filter="url(#wcGlow)"/>
                    ))}
                    {/* Splash at bottom of cascade */}
                    <ellipse cx="189" cy="145" rx="8" ry="3" fill="#60d8ff" fillOpacity="0.2" filter="url(#wcGlow)"/>
                  </>}
                  {/* Weir glow when flowing */}
                  {metrics.flowRate > 0 && (
                    <rect x="182" y="105" width="16" height="42" fill="#4ac8ff" fillOpacity="0.15" filter="url(#wcGlowStrong)"/>
                  )}
                  <text x="35" y="68" fill="#5a8090" fontSize="8.5" fontFamily="monospace" letterSpacing="1">SCHWIMMBECKEN</text>
                  <text x="35" y="80" fill="#2a4060" fontSize="6.5" fontFamily="monospace">QUERSCHNITT</text>
                  <text x="112" y="533" fill="#2a5070" fontSize="7" fontFamily="monospace" textAnchor="middle">EINSTRÖMDÜSEN</text>
                  <text x="112" y="280" fill="#0a1f38" fontSize="20" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.35">BECKEN</text>
                </g>

                {/* ── ÜBERLAUFRINNE (wide channel: x=195→435, directly connected to Schwall) ── */}
                <g className="wc-station" onClick={() => chooseStation('ueberlauf')} style={{ cursor: 'pointer' }}>
                  {/* Channel U-shape: left wall, bottom, right wall (right wall = Schwall left wall) */}
                  <path d="M 195 96 L 195 155 L 435 155 L 435 96" fill="none"
                    stroke={selectedStationId === 'ueberlauf' ? '#4a9eff' : '#1a4060'} strokeWidth="1.5"/>
                  {/* Channel water fill — bright, clearly visible */}
                  <rect x="197" y="110" width="236" height="43" fill="url(#wcWaterFill)"
                    fillOpacity={metrics.flowRate > 0 ? 0.75 : 0.25} rx="2"/>
                  {/* Channel surface wave across full width */}
                  <path d="M197 112 Q240 105 280 112 Q320 119 360 112 Q400 105 433 112"
                    fill="none" stroke="#5ac0ff" strokeWidth="2" className="wc-surface"
                    opacity={metrics.flowRate > 0 ? 0.85 : 0.3}/>
                  {/* Animated flow arrows moving rightward through channel — 3 rows */}
                  {metrics.flowRate > 0 && <>
                    <line x1="197" y1="120" x2="433" y2="120"
                      stroke="#60d8ff" strokeWidth="4" opacity="0.65"
                      style={{ strokeDasharray: '12 8', animation: `wcFlow ${(flowDuration * 0.3).toFixed(1)}s linear infinite` }}
                      filter="url(#wcGlow)"/>
                    <line x1="197" y1="130" x2="433" y2="130"
                      stroke="#60d8ff" strokeWidth="3.5" opacity="0.55"
                      style={{ strokeDasharray: '10 10', animation: `wcFlow ${(flowDuration * 0.35).toFixed(1)}s linear 0.15s infinite` }}/>
                    <line x1="197" y1="140" x2="433" y2="140"
                      stroke="#60d8ff" strokeWidth="3" opacity="0.45"
                      style={{ strokeDasharray: '8 12', animation: `wcFlow ${(flowDuration * 0.4).toFixed(1)}s linear 0.3s infinite` }}/>
                    {/* Direction arrows in channel */}
                    {[240, 320, 400].map(ax => (
                      <polygon key={ax} points={`${ax},117 ${ax+12},125 ${ax},133`} fill="#60d8ff" opacity="0.5"/>
                    ))}
                  </>}
                  {/* Labels */}
                  <text x="315" y="88" fill="#5a8090" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">ÜBERLAUFRINNE</text>
                  <text x="315" y="168" fill="#2a5070" fontSize="6.5" fontFamily="monospace" textAnchor="middle">→ ZUM SCHWALLWASSERBEHÄLTER →</text>
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

                {/* Q metric callout on pump outlet pipe */}
                {metrics.flowRate > 0 && !controls.backwashMode && (
                  <g pointerEvents="none">
                    <rect x="557" y="351" width="58" height="15" rx="3" fill="#040d1a" stroke="#1a4060" strokeWidth="0.8" opacity="0.9"/>
                    <text x="586" y="362" fill="#4a9eff" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Q {metrics.flowRate} m³/h</text>
                  </g>
                )}

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
                      <line key={i} x1="825" y1="115" x2={fx} y2={146}
                        stroke="#4ac8ff" strokeWidth="1.6" opacity="0.6"
                        style={{ strokeDasharray: '4 3', animation: `wcFlow 1.2s linear ${i * 0.12}s infinite` }}/>
                    ))}
                    {/* Filter body */}
                    <rect x="760" y="100" width="130" height="415" fill="#060f22" stroke={selectedStationId === 'filter' ? '#4a9eff' : (symptomFlags.has('filterTurbidity') ? '#d04040' : '#1a3a5a')} strokeWidth="1.5"/>
                    {/* Filter layers */}
                    <rect x="762" y="118" width="126" height="115" fill="#1a2838" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    <rect x="762" y="233" width="126" height="135" fill="#38481a" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    <rect x="762" y="368" width="126" height="115" fill="#2a4030" fillOpacity={xrayMode ? 0.9 : 0.45}/>
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
                      <text x="825" y="170" fill="#2a4058" fontSize="7" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                      <text x="825" y="181" fill="#1a3050" fontSize="5.5" fontFamily="monospace" textAnchor="middle">0,8-1,6 mm - Adsorption</text>
                      <text x="825" y="294" fill="#4a6020" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                      <text x="825" y="305" fill="#2a4010" fontSize="5.5" fontFamily="monospace" textAnchor="middle">0,4-1,6 mm - Hauptfilter</text>
                      <text x="825" y="419" fill="#2a5040" fontSize="7" fontFamily="monospace" textAnchor="middle">STUETZKIES</text>
                      <text x="825" y="430" fill="#1a3a30" fontSize="5.5" fontFamily="monospace" textAnchor="middle">4-16 mm - Tragschicht</text>
                    </>)}
                    {xrayMode && (<>
                      <text x="825" y="170" fill="#6080a0" fontSize="7" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE 0,8-1,6mm</text>
                      <text x="825" y="294" fill="#90c060" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZSAND 0,4-1,6mm</text>
                      <text x="825" y="419" fill="#60c090" fontSize="7" fontFamily="monospace" textAnchor="middle">STUETZKIES 4-16mm</text>
                    </>)}
                    {/* Center downward flow — animated in normal mode */}
                    {!controls.backwashMode && metrics.flowRate > 0 && (
                      <line x1="825" y1="138" x2="825" y2="476"
                        stroke="#4a9eff" strokeWidth="2.5" opacity="0.55"
                        style={{ strokeDasharray: '9 7', animation: `wcFlow ${flowDuration}s linear infinite` }}/>
                    )}
                    {!controls.backwashMode && <polygon points="820,474 825,488 830,474" fill="#4a9eff" opacity={metrics.flowRate > 0 ? 0.55 : 0.2}/>}
                    {/* Backwash upward flow — animated orange */}
                    {controls.backwashMode && (
                      <line x1="825" y1="476" x2="825" y2="138" stroke="#f09030" strokeWidth="2.5"
                        opacity="0.6" style={{ strokeDasharray: '9 7', animation: `wcFlow ${flowDuration}s linear infinite reverse` }}/>
                    )}
                    {controls.backwashMode && <polygon points="820,140 825,126 830,140" fill="#f09030" opacity="0.65"/>}
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
                    <rect x="660" y="257" width="112" height="146" fill="#1a2838" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    <rect x="772" y="257" width="124" height="146" fill="#38481a" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    <rect x="896" y="257" width="118" height="146" fill="#2a4030" fillOpacity={xrayMode ? 0.9 : 0.45}/>
                    {!xrayMode && (<>
                      <line x1="772" y1="257" x2="772" y2="405" stroke="#1a3a5a" strokeWidth="1" strokeDasharray="4 3"/>
                      <line x1="896" y1="257" x2="896" y2="405" stroke="#1a3a5a" strokeWidth="1" strokeDasharray="4 3"/>
                      <text x="716" y="335" fill="#2a4058" fontSize="7" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                      <text x="834" y="335" fill="#4a6020" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                      <text x="955" y="335" fill="#2a5040" fontSize="7" fontFamily="monospace" textAnchor="middle">STUETZKIES</text>
                    </>)}
                    {xrayMode && (<>
                      <text x="716" y="335" fill="#6080a0" fontSize="7" fontFamily="monospace" textAnchor="middle">AKTIVKOHLE</text>
                      <text x="834" y="335" fill="#90c060" fontSize="7" fontFamily="monospace" textAnchor="middle">QUARZSAND</text>
                      <text x="955" y="335" fill="#60c090" fontSize="7" fontFamily="monospace" textAnchor="middle">STUETZKIES</text>
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

                {/* ── HEIZUNG: animated warm-side plate lines ── */}
                {metrics.flowRate > 0 && !controls.backwashMode && filterMode === 'vertikal' && (
                  <g pointerEvents="none">
                    {[604, 614, 624, 634, 640].map((hy, i) => i % 2 === 1 && (
                      <line key={hy} x1="768" y1={hy} x2="890" y2={hy}
                        stroke="#4a9eff" strokeWidth="2.5" opacity="0.45"
                        style={{ strokeDasharray: '12 8', animation: `wcFlow ${flowDuration}s linear ${i * 0.12}s infinite` }}/>
                    ))}
                  </g>
                )}

                {/* ── RÜCKLAUF (on return pipe, bottom center) ── */}
                <g className="wc-station" onClick={() => chooseStation('ruecklauf')} style={{ cursor: 'pointer' }}>
                  <rect x="345" y="662" width="88" height="35" rx="5" fill="#060f22" stroke={selectedStationId === 'ruecklauf' ? '#4a9eff' : '#1a3a5a'} strokeWidth="1.2"/>
                  {/* Flow-meter symbol: circle with crossing lines */}
                  <circle cx="389" cy="679" r="12" fill="#040d1a" stroke={selectedStationId === 'ruecklauf' ? '#4a9eff' : '#1a4060'} strokeWidth="1.2"/>
                  <line x1="377" y1="679" x2="401" y2="679" stroke="#4a9eff" strokeWidth="1.8" opacity="0.65"/>
                  <line x1="389" y1="667" x2="389" y2="691" stroke="#4a9eff" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.35"/>
                  <polygon points="396,675 403,679 396,683" fill="#4a9eff" opacity={metrics.flowRate > 0 ? 0.85 : 0.3}/>
                  {/* Animated flow dot when active */}
                  {metrics.flowRate > 0 && (
                    <circle cx="389" cy="679" r="4" fill="none" stroke="#4ac8ff" strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  <text x="389" y="657" fill="#5a8090" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">RÜCKLAUF</text>
                  <text x="389" y="710" fill="#2a5070" fontSize="6" fontFamily="monospace" textAnchor="middle">EINSTRÖMSYSTEM</text>
                </g>

                {/* Kanal / Abwurf */}
                <rect x="964" y="650" width="130" height="38" rx="5" fill="#060f22"
                  stroke={controls.backwashMode ? '#f09030' : '#1a3a5a'} strokeWidth={controls.backwashMode ? 1.8 : 1.2}/>
                {/* Drain arrow symbol */}
                <polygon points="1029,657 1034,667 1024,667" fill={controls.backwashMode ? '#f09030' : '#1a3a5a'} opacity="0.7"/>
                <line x1="1029" y1="667" x2="1029" y2="680" stroke={controls.backwashMode ? '#f09030' : '#1a4060'} strokeWidth="1.5" opacity="0.6"/>
                {/* Backwash drain wave when active */}
                {controls.backwashMode && metrics.flowRate > 0 && (
                  <path d="M967 682 Q990 677 1010 682 Q1030 687 1050 682 Q1070 677 1091 682"
                    fill="none" stroke="#f09030" strokeWidth="1.2" opacity="0.55" className="wc-surface"/>
                )}
                <text x="1029" y="695" fill={controls.backwashMode ? '#f09030' : '#2a4060'} fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">KANAL / ABWURF</text>
                <text x="1029" y="640" fill={controls.backwashMode ? '#f09030' : '#1a3a5a'} fontSize="6.5" fontFamily="monospace" textAnchor="middle">{controls.backwashMode ? '⚠ RÜCKSPÜLUNG' : 'SCHMUTZWASSER'}</text>

                {/* Return path label */}
                <text x="200" y="696" fill="#1a4070" fontSize="7" fontFamily="monospace" textAnchor="middle">←── RÜCKLAUF INS BECKEN ──←</text>

                {/* ── FULL CIRCUIT FLOW: durchgehender Kreislauf durch ALLE Stationen ── */}
                {metrics.flowRate > 0 && !controls.backwashMode && (() => {
                  // Becken(195,125) → Rinne → Schwall(435,125→500,296) → Pumpe(500,320→555,375) → Flockung(635,375→635,100) → Filter(760,100→825,531) → Desinf(825,570) → Heizung(825,592) → Rücklauf(755,627→400,680) → Becken(112,680→112,525)
                  const circuit = 'M 195 125 L 435 125 L 435 200 L 500 296 L 500 320 L 500 375 L 555 375 L 635 375 L 635 100 L 760 100 L 825 100 L 825 531 L 825 570 L 825 592 L 825 627 L 755 627 L 400 627 L 400 680 L 340 680 L 112 680 L 112 525';
                  const circuitRel = 'M 0 0 L 240 0 L 240 75 L 305 171 L 305 195 L 305 250 L 360 250 L 440 250 L 440 -25 L 565 -25 L 630 -25 L 630 406 L 630 445 L 630 467 L 630 502 L 560 502 L 205 502 L 205 555 L 145 555 L -83 555 L -83 400';
                  const dur = (parseFloat(flowDuration) * 4 + 3).toFixed(1);
                  return (
                    <g pointerEvents="none">
                      {/* Backing for contrast */}
                      <path d={circuit} fill="none" stroke="#0a3a6a"
                        strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                      {/* Animated flow line */}
                      <path d={circuit} fill="none" stroke="#60d8ff"
                        strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"
                        className="wc-flow" style={{ animationDuration: `${flowDuration}s` }}
                        filter="url(#wcGlowStrong)"/>
                      {/* 6 water particles traveling the full circuit */}
                      {[0, 0.17, 0.33, 0.5, 0.67, 0.83].map((frac, i) => (
                        <circle key={`dc-${i}`} r="4.5" fill="#48cae4" opacity="0.9" cx="195" cy="125" filter="url(#wcGlowStrong)">
                          <animateMotion
                            dur={`${dur}s`}
                            begin={`${(frac * parseFloat(dur)).toFixed(1)}s`}
                            repeatCount="indefinite"
                            path={circuitRel}
                            keyPoints="0;1"
                            keyTimes="0;1"
                            calcMode="linear"/>
                        </circle>
                      ))}
                    </g>
                  );
                })()}

                {/* ── BACKWASH FLOW OVERLAY (segment-based, only during backwash) ── */}
                {controls.backwashMode && metrics.flowRate > 0 && (
                  <g pointerEvents="none">
                    {pipeStates.filter(p => p.hasFlow).map(pipe => (
                      <g key={`ftop-${pipe.id}`}>
                        <path d={pipe.path} fill="none" stroke="#804020"
                          strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                        <path d={pipe.path} fill="none" stroke="#f0a040"
                          strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.88"
                          className={`wc-flow${pipe.reverse ? ' wc-flow-reverse' : ''}`}
                          style={{ animationDuration: `${flowDuration}s` }}
                          filter="url(#wcGlowStrong)"/>
                      </g>
                    ))}
                  </g>
                )}

                {/* ── CHLOR-INJEKTION: animierte Tropfen vom NaOCl-Tank zum Rohr ── */}
                {controls.disinfectPumpEnabled && metrics.flowRate > 0 && (
                  <g pointerEvents="none">
                    {[0, 0.4, 0.8].map((delay) => (
                      <circle key={delay} cx="852" cy="572" r="2.5" fill="#4abaff" opacity="0.9" filter="url(#wcGlow)">
                        <animate attributeName="cx" values="865;840;825" dur="1.4s" begin={`${delay}s`} repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.9;0.7;0" dur="1.4s" begin={`${delay}s`} repeatCount="indefinite"/>
                      </circle>
                    ))}
                    {/* Injection splash at pipe */}
                    <circle cx="825" cy="572" r="6" fill="none" stroke="#4abaff" strokeWidth="1.5" opacity="0.6" filter="url(#wcGlow)">
                      <animate attributeName="r" values="4;10;4" dur="1.8s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                  </g>
                )}

                {/* ── SCHWALL-EINTRITT: Wasserfall aus der Rinne in den Zylinder ── */}
                {metrics.flowRate > 0 && !controls.backwashMode && (
                  <g pointerEvents="none">
                    <path d={`M 444 155 L 444 ${Math.round(100 + (178 - metrics.surgeLevel * 1.78))}`}
                      fill="none" stroke="#60d8ff" strokeWidth="8" strokeLinecap="round" opacity="0.75"
                      className="wc-flow" style={{ animationDuration: '0.55s' }}
                      filter="url(#wcGlowStrong)"/>
                    {(() => {
                      const wy = Math.round(100 + (178 - metrics.surgeLevel * 1.78));
                      return <polygon points={`438,${wy - 8} 444,${wy + 4} 450,${wy - 8}`} fill="#60d8ff" opacity="0.85"/>;
                    })()}
                  </g>
                )}

                {/* ── FLOW SEQUENCE NUMBERS ── */}
                <g pointerEvents="none">
                  {[
                    { n: '①', x: 35,  y: 93  },  // Becken
                    { n: '②', x: 250, y: 82  },  // Überlauf
                    { n: '③', x: 422, y: 85  },  // Schwall
                    { n: '④', x: 422, y: 323 },  // Pumpe
                    { n: '⑤', x: 640, y: 231 },  // Flockung
                    { n: '⑥', x: 738, y: 68  },  // Filter
                    { n: '⑦', x: 848, y: 534 },  // Desinfektion
                    { n: '⑧', x: 738, y: 578 },  // Heizung
                    { n: '⑨', x: 331, y: 654 },  // Rücklauf
                  ].map(({ n, x, y }) => (
                    <text key={n} x={x} y={y} fill="#1a5578" fontSize="11" fontFamily="monospace" fontWeight="bold">{n}</text>
                  ))}
                </g>

                {/* ── VALVE BUTTONS ── */}
                {[
                  { key: 'rawValveOpen',     x: 500, y: 308, label: 'V1' },
                  { key: 'returnValveOpen',  x: 180, y: 680, label: 'V2' },
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
                {deepDiveStation.id === 'filter' && (
                  <div className="rounded-xl p-3" style={{ background: '#0a1a2e', border: '1px solid #1a3a5a' }}>
                    <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>FILTERWISSEN</p>
                    <div className="flex gap-1.5 mb-2">
                      <button
                        onClick={() => setFilterInfoTab('materialien')}
                        className="rounded-md px-2 py-1 text-[11px] font-semibold"
                        style={{
                          background: filterInfoTab === 'materialien' ? '#1e4f76' : '#0c2238',
                          color: filterInfoTab === 'materialien' ? '#d7efff' : '#7aa7c8',
                          border: '1px solid #2a5a90'
                        }}>
                        Materialien
                      </button>
                      <button
                        onClick={() => setFilterInfoTab('filterarten')}
                        className="rounded-md px-2 py-1 text-[11px] font-semibold"
                        style={{
                          background: filterInfoTab === 'filterarten' ? '#1e4f76' : '#0c2238',
                          color: filterInfoTab === 'filterarten' ? '#d7efff' : '#7aa7c8',
                          border: '1px solid #2a5a90'
                        }}>
                        Filterarten
                      </button>
                    </div>
                    <ul className="space-y-1.5 text-sm">
                      {(FILTER_REFERENCE_TABS[filterInfoTab] || []).map((item) => (
                        <li key={item} className="flex gap-2">
                          <span style={{ color: '#4a9eff', flexShrink: 0 }}>-</span>
                          <span style={{ color: '#b0c8e0' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
