import { useState } from 'react';

// ─── SVG Bausteine ────────────────────────────────────────────────────────────

// Seitenansicht (Kraul, Rücken, Delphin)
const SideSVG = ({ head, bodyPts, arms, legs, darkMode, label }) => {
  const sky     = darkMode ? '#0c1a2e' : '#dbeafe';
  const wColor  = darkMode ? '#1e3a8a' : '#bfdbfe';
  const wLine   = darkMode ? '#38bdf8' : '#3b82f6';
  const body    = darkMode ? '#7dd3fc' : '#1d4ed8';
  const skin    = darkMode ? '#fcd34d' : '#f59e0b';
  const above   = darkMode ? '#fb923c' : '#ea580c';
  const W = 48; // Wasserlinie y

  return (
    <svg viewBox="0 0 280 100" className="w-full" style={{ display: 'block' }}>
      <rect x="0" y="0" width="280" height={W} fill={sky} />
      <rect x="0" y={W} width="280" height={100 - W} fill={wColor} opacity="0.65" />
      <line x1="0" y1={W} x2="280" y2={W} stroke={wLine} strokeWidth="1.5" />

      {/* Körper */}
      <polyline points={bodyPts} fill="none" stroke={body} strokeWidth="7"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Kopf */}
      <circle cx={head[0]} cy={head[1]} r={head[2] ?? 10}
        fill={skin} stroke={darkMode ? '#78350f' : '#92400e'} strokeWidth="1.5" />

      {/* Arme */}
      {arms && arms.map((a, i) => (
        <polyline key={i} points={a.pts} fill="none"
          stroke={a.above ? above : body}
          strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {/* Beine */}
      {legs && legs.map((l, i) => (
        <polyline key={i} points={l} fill="none" stroke={body}
          strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {/* Richtungspfeil */}
      <polygon points="270,6 280,10 270,14" fill={wLine} opacity="0.6" />
      <line x1="245" y1="10" x2="270" y2="10" stroke={wLine} strokeWidth="1.5" opacity="0.6" />

      {label && (
        <text x="4" y="97" fontSize="8" fill={darkMode ? '#64748b' : '#94a3b8'}>{label}</text>
      )}
    </svg>
  );
};

// Draufsicht (Brustschwimmen)
const TopSVG = ({ arms, legs, darkMode }) => {
  const bg   = darkMode ? '#1e3a8a' : '#bfdbfe';
  const body = darkMode ? '#7dd3fc' : '#1d4ed8';
  const skin = darkMode ? '#fcd34d' : '#f59e0b';

  return (
    <svg viewBox="0 0 280 130" className="w-full" style={{ display: 'block' }}>
      <rect x="0" y="0" width="280" height="130" fill={bg} opacity="0.7" />
      {/* Wasser-Glanz */}
      <ellipse cx="140" cy="18" rx="128" ry="7"
        fill={darkMode ? '#38bdf8' : '#60a5fa'} opacity="0.25" />

      {/* Schwimmrichtungs-Pfeil */}
      <polygon points="125,6 140,0 155,6" fill={darkMode ? '#38bdf8' : '#2563eb'} opacity="0.5" />

      {/* Körper */}
      <ellipse cx="140" cy="70" rx="11" ry="44" fill={body} opacity="0.85" />

      {/* Kopf */}
      <circle cx="140" cy="22" r="14"
        fill={skin} stroke={darkMode ? '#78350f' : '#92400e'} strokeWidth="1.5" />

      {/* Arme */}
      {arms && arms.map((a, i) => (
        <polyline key={i} points={a} fill="none" stroke={body}
          strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {/* Beine */}
      {legs && legs.map((l, i) => (
        <polyline key={i} points={l} fill="none" stroke={body}
          strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
};

// ─── Phasendaten ──────────────────────────────────────────────────────────────

// Kraul-Schulter x=228 y=61, Hüfte x=90 y=64
const KRAUL = [
  {
    name: 'Eintauchen', sub: 'Arm gestreckt vor der Schulter einstechen',
    svg: (dm) => <SideSVG darkMode={dm}
      head={[245, 51, 10]}
      bodyPts="82,63 228,61"
      arms={[
        { pts: "228,61 260,64 282,67", above: false },
        { pts: "92,64 82,73 74,81", above: false },
      ]}
      legs={["90,64 62,70 40,76", "86,64 58,59 36,54"]} />,
    punkte: ['Hand taucht VOR der Schulter ein — nie über die Körpermitte', 'Kleiner Finger oder Daumen leicht nach unten', 'Arm streckt sich in die Gleitlage (Strecklage)'],
    fehler: 'Hand kreuzt die Kopfmitte → Schlangenlinie',
    tipp: '„Fenster aufmachen" — Hand zuerst, Arm folgt durch dasselbe Loch.',
  },
  {
    name: 'Wasserfassen', sub: 'High-Elbow-Catch: Ellbogen hoch, Unterarm als Paddel',
    svg: (dm) => <SideSVG darkMode={dm}
      head={[245, 51, 10]}
      bodyPts="82,63 228,61"
      arms={[
        { pts: "228,61 246,74 252,90", above: false },
        { pts: "92,64 98,52 107,43", above: true },
      ]}
      legs={["90,64 62,70 40,76", "86,64 58,59 36,54"]} />,
    punkte: ['Ellbogen zeigt nach AUSSEN und bleibt hoch (high elbow)', 'Unterarm kippt nach unten — „Wasser fassen"', 'Schulter rotiert mit (Körperrotation startet)'],
    fehler: 'Ellbogen sinkt nach unten (dropped elbow) → kaum Vortrieb',
    tipp: '„Ellbogen über eine unsichtbare Stange hängen" — er bleibt oben.',
  },
  {
    name: 'Zugphase', sub: 'Arm zieht unter dem Körper durch',
    svg: (dm) => <SideSVG darkMode={dm}
      head={[245, 51, 10]}
      bodyPts="82,63 228,61"
      arms={[
        { pts: "228,61 214,75 200,79", above: false },
        { pts: "92,64 107,51 120,42", above: true },
      ]}
      legs={["90,64 62,70 40,76", "86,64 58,59 36,54"]} />,
    punkte: ['Ellbogen bleibt gebeugt (ca. 90°) für maximale Kraft', 'Arm zieht unter dem Körper — nicht zu weit innen/außen', 'Rumpf stabilisiert — kein Wackeln'],
    fehler: 'Arm kreuzt unter der Körpermitte → Schlingern',
    tipp: '„An einem Seil nach hinten ziehen" — gleichmäßig und kraftvoll.',
  },
  {
    name: 'Druckphase', sub: 'Arm drückt bis zur Hüfte — letzter Schub',
    svg: (dm) => <SideSVG darkMode={dm}
      head={[245, 51, 10]}
      bodyPts="82,63 228,61"
      arms={[
        { pts: "228,61 206,69 186,73", above: false },
        { pts: "92,64 116,61 140,59", above: false },
      ]}
      legs={["90,64 62,70 40,76", "86,64 58,59 36,54"]} />,
    punkte: ['Arm drückt BIS zum Oberschenkel — nicht früher abbrechen!', 'Handinnenfläche zeigt nach hinten/oben', 'Daumen streift am Oberschenkel vorbei'],
    fehler: 'Druckphase zu früh abgebrochen → verlorener Vortrieb',
    tipp: '„Bis der Daumen den Oberschenkel kitzelt" — erst dann ist der Schub vollständig.',
  },
  {
    name: 'Umlaufphase', sub: 'Ellbogen-geführte Rückholung über dem Wasser',
    svg: (dm) => <SideSVG darkMode={dm}
      head={[245, 51, 10]}
      bodyPts="82,63 228,61"
      arms={[
        { pts: "228,61 220,49 212,41", above: true },
        { pts: "92,64 117,63 142,65", above: false },
      ]}
      legs={["90,64 62,70 40,76", "86,64 58,59 36,54"]} />,
    punkte: ['Ellbogen führt die Rückholung — hoch und locker', 'Hand und Unterarm hängen entspannt nach unten', 'Schulter dreht sich aus dem Wasser heraus'],
    fehler: 'Arm gestreckt über Wasser führen → verkrampft und langsam',
    tipp: '„Ellbogen zieht die Hand vorwärts" — die Hand folgt locker hinterher.',
  },
];

// Brust-Schultern: L=(128,36) R=(152,36) | Hüfte: L=(128,96) R=(152,96)
const BRUST = [
  {
    name: 'Strecklage', sub: 'Gleitphase — maximale Stromlinienform',
    svg: (dm) => <TopSVG darkMode={dm}
      arms={["128,36 106,29 86,25", "152,36 174,29 194,25"]}
      legs={["128,96 114,112 108,124", "152,96 166,112 172,124"]} />,
    punkte: ['Beide Arme gestreckt nach vorn — Hände übereinander oder nebeneinander', 'Körper gerade, Beine geschlossen gestreckt', 'Kopf im Wasser (Blick nach unten)'],
    fehler: 'Gleitphase zu kurz → hoher Energieverbrauch, kein Rhythmus',
    tipp: 'Je länger die Gleitphase, desto effizienter das Schwimmen — kurz „einfrieren".',
  },
  {
    name: 'Ansatzphase', sub: 'Arme greifen seitlich nach außen',
    svg: (dm) => <TopSVG darkMode={dm}
      arms={["128,36 106,42 86,54", "152,36 174,42 194,54"]}
      legs={["128,96 114,112 108,124", "152,96 166,112 172,124"]} />,
    punkte: ['Arme drehen nach außen und beginnen zu spreizen', 'Ellbogen bleibt leicht gebeugt', 'Hände zeigen nach außen-unten'],
    fehler: 'Arme zu weit nach hinten spreizen → mehr Widerstand als Vortrieb',
    tipp: 'Nur bis zur Schulterlinie spreizen — danach beginnt der Zug.',
  },
  {
    name: 'Zugphase', sub: 'Arme ziehen halbkreisförmig nach innen',
    svg: (dm) => <TopSVG darkMode={dm}
      arms={["128,36 110,57 104,74", "152,36 170,57 176,74"]}
      legs={["128,96 114,112 108,124", "152,96 166,112 172,124"]} />,
    punkte: ['Arme beschreiben einen Halbkreis nach innen-unten', 'Ellbogen bleibt HOCH und gebeugt', 'Hände ziehen Richtung Brust zusammen'],
    fehler: 'Ellbogen sinkt — zu flacher Zug ohne Kraft',
    tipp: 'Denke an „Wasserpaddel" — der Unterarm drückt das Wasser nach hinten.',
  },
  {
    name: 'Schwungphase', sub: 'Beinschlag: Fersen anziehen, Beine spreizen, zusammenschlagen',
    svg: (dm) => <TopSVG darkMode={dm}
      arms={["128,36 133,53 138,62", "152,36 147,53 142,62"]}
      legs={["128,96 110,106 96,120 102,130", "152,96 170,106 184,120 178,130"]} />,
    punkte: ['Fersen zum Gesäß anziehen (Knie nur leicht spreizen!)', 'Füße drehen nach außen (dorsalflektiert)', 'Beine peitschen kreisförmig zusammen → Grätschstoß', 'Arme kommen gleichzeitig nach vorn'],
    fehler: 'Knie zu weit auseinander → hoher Wasserwiderstand',
    tipp: '„Frosch-Kick" — Füße wie ein Frosch drehen und Wasser nach hinten drücken.',
  },
  {
    name: 'Gleitphase', sub: 'Zurück in die Strecklage — Zyklus beginnt neu',
    svg: (dm) => <TopSVG darkMode={dm}
      arms={["128,36 106,29 86,25", "152,36 174,29 194,25"]}
      legs={["128,96 114,112 108,124", "152,96 166,112 172,124"]} />,
    punkte: ['Arme und Beine gleichzeitig strecken', 'Kurz in Strecklage halten (Gleitphase nutzen!)', 'Kopf senkt sich wieder ins Wasser'],
    fehler: 'Keine Pause — sofort nächster Zug → ineffizient und ermüdend',
    tipp: 'Der Rhythmus: Ziehen — Gleiten — Stoßen — Gleiten. Die Pausen geben Tempo!',
  },
];

// Rücken: Schwimmer liegt auf dem Rücken, Gesicht nach oben
const RUECKEN = [
  {
    name: 'Eintauchen', sub: 'Arm taucht hinter dem Kopf ins Wasser',
    svg: (dm) => <SideSVG darkMode={dm} label="Rückenschwimmen"
      head={[245, 45, 10]}
      bodyPts="82,65 232,63"
      arms={[
        { pts: "228,63 246,49 258,38", above: true },
        { pts: "92,65 80,74 70,81", above: false },
      ]}
      legs={["90,65 62,71 40,77", "86,65 58,60 36,56"]} />,
    punkte: ['Arm taucht mit kleinem Finger zuerst hinter dem Kopf ein', 'Schulter dreht sich aus dem Wasser heraus (Körperrotation)', 'Eintauchpunkt: ca. Schulterbreite hinter dem Kopf'],
    fehler: 'Arm taucht zu weit seitlich ein → schlechte Zugposition',
    tipp: '„Arm zeigt zur 12 Uhr" — senkrecht nach oben, dann hinter den Kopf.',
  },
  {
    name: 'Wasserfassen', sub: 'Arm im Wasser, Zug beginnt',
    svg: (dm) => <SideSVG darkMode={dm} label="Rückenschwimmen"
      head={[245, 45, 10]}
      bodyPts="82,65 232,63"
      arms={[
        { pts: "228,63 246,73 252,86", above: false },
        { pts: "92,65 88,53 83,44", above: true },
      ]}
      legs={["90,65 62,71 40,77", "86,65 58,60 36,56"]} />,
    punkte: ['Arm biegt sich im Ellbogen (ca. 90°) — Wasser fassen', 'Ellbogen zeigt zur Beckenseite hin', 'Anderer Arm startet Rückholung über Wasser'],
    fehler: 'Arm bleibt gestreckt — zu wenig Hebelwirkung',
    tipp: 'Körperrotation nutzen: Je mehr Rotation, desto tiefer und kraftvoller der Catch.',
  },
  {
    name: 'Zugphase', sub: 'Arm zieht durch — parallel zur Körperachse',
    svg: (dm) => <SideSVG darkMode={dm} label="Rückenschwimmen"
      head={[245, 45, 10]}
      bodyPts="82,65 232,63"
      arms={[
        { pts: "228,63 212,72 198,77", above: false },
        { pts: "92,65 98,52 106,43", above: true },
      ]}
      legs={["90,65 62,71 40,77", "86,65 58,60 36,56"]} />,
    punkte: ['Zug verläuft nah an der Körpermitte — nicht zu weit außen', 'Gleichmäßige Kraft durch die gesamte Zugphase', 'Kopf bleibt ruhig — Augen nach oben'],
    fehler: 'Arm schlägt einen Bogen nach außen → weniger Vortrieb',
    tipp: '„Tunnelzug" — der Arm zieht direkt unter dem Körper durch.',
  },
  {
    name: 'Druckphase', sub: 'Arm drückt bis zum Oberschenkel — letzter Schub',
    svg: (dm) => <SideSVG darkMode={dm} label="Rückenschwimmen"
      head={[245, 45, 10]}
      bodyPts="82,65 232,63"
      arms={[
        { pts: "228,63 208,69 190,73", above: false },
        { pts: "92,65 112,58 132,53", above: false },
      ]}
      legs={["90,65 62,71 40,77", "86,65 58,60 36,56"]} />,
    punkte: ['Druck bis zum Oberschenkel — Daumen zeigt nach außen beim Austauchen', 'Arm tritt senkrecht aus dem Wasser (kleiner Finger zuerst)', 'Schulter dreht zurück in die Ausgangslage'],
    fehler: 'Druck zu früh abgebrochen → verlorener Vortrieb',
    tipp: '„Daumen kitzelt den Oberschenkel" — erst dann ist der Schub vollständig.',
  },
  {
    name: 'Umlaufphase', sub: 'Gestreckte Rückholung über dem Wasser',
    svg: (dm) => <SideSVG darkMode={dm} label="Rückenschwimmen"
      head={[245, 45, 10]}
      bodyPts="82,65 232,63"
      arms={[
        { pts: "228,63 220,49 212,38", above: true },
        { pts: "92,65 117,63 142,65", above: false },
      ]}
      legs={["90,65 62,71 40,77", "86,65 58,60 36,56"]} />,
    punkte: ['Arm gestreckt und entspannt über das Wasser zurückführen', 'Daumen zeigt beim Austauchen nach oben → automatische Innenrotation', 'Hand führt durch die 12-Uhr-Position senkrecht nach oben'],
    fehler: 'Arm biegt beim Austauchpunkt ab → unsauberer Eintauchwinkel',
    tipp: 'Beim Auftauchen Daumen oben — beim Eintauchen kleiner Finger zuerst. Der Arm dreht sich auf dem Weg.',
  },
];

// Delphin: Körperwelle ist das Kernmerkmal
const DELPHIN = [
  {
    name: 'Eintauchen', sub: 'Beide Arme gleichzeitig einstechen, 1. Delfinkick',
    svg: (dm) => <SideSVG darkMode={dm} label="Delphinschwimmen"
      head={[245, 54, 10]}
      bodyPts="82,70 115,66 160,60 200,64 232,70"
      arms={[
        { pts: "232,70 262,73 282,77", above: false },
        { pts: "232,70 215,63 202,58", above: false },
      ]}
      legs={["82,70 56,78 38,85"]} />,
    punkte: ['Beide Arme gleichzeitig einstechen (schulterbreit, vor der Schulter)', 'Kopf taucht nach dem Eintauchen ab', 'Hüfte steigt → erster Delfinkick aus den Hüften', 'Knie leicht gebeugt, Fußgelenke locker'],
    fehler: 'Kick aus den Knien statt der Hüfte → ineffizient',
    tipp: '„Delfin-Welle von der Brust bis zu den Zehen" — der Impuls kommt von oben.',
  },
  {
    name: 'Wasserfassen', sub: 'High-Elbow-Catch: Ellbogen hoch, Unterarm als Paddel',
    svg: (dm) => <SideSVG darkMode={dm} label="Delphinschwimmen"
      head={[245, 52, 10]}
      bodyPts="82,68 130,64 180,62 220,64 232,64"
      arms={[
        { pts: "232,64 248,76 256,90", above: false },
      ]}
      legs={["82,68 56,73 38,77"]} />,
    punkte: ['Ellbogen bleibt hoch, Unterarm kippt nach unten („Wasser fassen")', 'Beide Arme symmetrisch — kein Versatz wie beim Kraul', 'Erste Welle vom Eintauchen läuft den Körper hinunter'],
    fehler: 'Ellbogen sinkt (dropped elbow) → Unterarm rutscht durchs Wasser, kaum Vortrieb',
    tipp: '„Ellbogen über die unsichtbare Stange hängen" — er bleibt oben, beide Seiten gleich.',
  },
  {
    name: 'Zugphase', sub: 'Keyhole-Zug: Arme nach außen, dann unter dem Körper',
    svg: (dm) => <SideSVG darkMode={dm} label="Delphinschwimmen"
      head={[245, 51, 10]}
      bodyPts="82,65 130,63 180,65 220,67 232,65"
      arms={[
        { pts: "232,65 215,75 200,79", above: false },
      ]}
      legs={["82,65 56,62 38,58"]} />,
    punkte: ['Ellbogen hoch beim Catch (wie beim Kraul)', 'Arme ziehen zunächst leicht nach außen, dann unter dem Körper zusammen', 'Schlüsselloch-Form (Keyhole) für maximalen Vortrieb'],
    fehler: 'Arme zu weit nach außen ziehen → Schmetterlings-Fehler',
    tipp: 'Unter dem Körper berühren sich die Hände fast — enger Zug = mehr Kraft.',
  },
  {
    name: 'Druckphase & Atmung', sub: '2. Kick, Druck bis zur Hüfte, Kopf hebt sich kurz',
    svg: (dm) => <SideSVG darkMode={dm} label="Delphinschwimmen"
      head={[245, 45, 10]}
      bodyPts="82,72 120,68 160,62 200,58 232,62"
      arms={[
        { pts: "232,62 210,69 192,73", above: false },
      ]}
      legs={["82,72 55,80 38,87"]} />,
    punkte: ['Druckphase bis zum Oberschenkel (wie beim Kraul)', 'Zweiter Delfinkick — kräftiger als der erste', 'Kopf hebt sich knapp über die Wasseroberfläche zum Atmen', 'Mund öffnet sich während der Druckphase'],
    fehler: 'Kopf zu weit heben → Hüfte sinkt, Widerstand steigt',
    tipp: 'Nur Kinn ans Wasser — nicht den ganzen Kopf heben. „Drachen-Atmung": Schnell und tief!',
  },
  {
    name: 'Umlaufphase', sub: 'Arme schwingen gleichzeitig über das Wasser nach vorn',
    svg: (dm) => <SideSVG darkMode={dm} label="Delphinschwimmen"
      head={[245, 51, 10]}
      bodyPts="82,65 130,65 178,65 220,66 232,65"
      arms={[
        { pts: "232,65 220,51 210,41", above: true },
        { pts: "232,65 218,55 208,47", above: true },
      ]}
      legs={["82,65 56,59 38,54"]} />,
    punkte: ['Beide Arme schwingen gleichzeitig und gestreckt über das Wasser', 'Ellbogen leicht gebeugt (entspannt)', 'Kopf taucht beim Eintauchen der Arme ab', 'Beine bleiben gestreckt für sauberes Eintauchen'],
    fehler: 'Arme klatschen auf das Wasser → hoher Wasserwiderstand',
    tipp: '„Schmetterlingsflügel" — Arme schwingen locker, fast ohne Kraft. Wasser weich berühren.',
  },
];

const STROKES = [
  { id: 'kraul',   name: 'Kraul',   icon: '🏊',  color: 'cyan',    phases: KRAUL,   topView: false },
  { id: 'brust',   name: 'Brust',   icon: '🐸',  color: 'teal',    phases: BRUST,   topView: true  },
  { id: 'ruecken', name: 'Rücken',  icon: '🌊',  color: 'blue',    phases: RUECKEN, topView: false },
  { id: 'delphin', name: 'Delphin', icon: '🐬',  color: 'violet',  phases: DELPHIN, topView: false },
];

const colorMap = {
  cyan:   { active: 'bg-cyan-600 text-white',   ring: 'border-cyan-500',   text: darkMode => darkMode ? 'text-cyan-400' : 'text-cyan-700',   badge: darkMode => darkMode ? 'bg-cyan-900/40 text-cyan-300' : 'bg-cyan-100 text-cyan-800' },
  teal:   { active: 'bg-teal-600 text-white',   ring: 'border-teal-500',   text: darkMode => darkMode ? 'text-teal-400' : 'text-teal-700',   badge: darkMode => darkMode ? 'bg-teal-900/40 text-teal-300' : 'bg-teal-100 text-teal-800' },
  blue:   { active: 'bg-blue-600 text-white',   ring: 'border-blue-500',   text: darkMode => darkMode ? 'text-blue-400' : 'text-blue-700',   badge: darkMode => darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-800' },
  violet: { active: 'bg-violet-600 text-white', ring: 'border-violet-500', text: darkMode => darkMode ? 'text-violet-400' : 'text-violet-700', badge: darkMode => darkMode ? 'bg-violet-900/40 text-violet-300' : 'bg-violet-100 text-violet-800' },
};

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────
export default function SchwimmtechnikenDeepDiveView({ darkMode }) {
  const [strokeIdx, setStrokeIdx] = useState(0);
  const [phaseIdx, setPhaseIdx]   = useState(0);

  const stroke = STROKES[strokeIdx];
  const phase  = stroke.phases[phaseIdx];
  const colors = colorMap[stroke.color];

  const handleStroke = (i) => { setStrokeIdx(i); setPhaseIdx(0); };
  const prev = () => setPhaseIdx(i => Math.max(0, i - 1));
  const next = () => setPhaseIdx(i => Math.min(stroke.phases.length - 1, i + 1));

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>

      {/* Header */}
      <div className={`rounded-2xl p-4 mb-4 ${darkMode
        ? 'bg-gradient-to-br from-cyan-900/50 to-blue-900/30 border border-cyan-800'
        : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏊</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
              Schwimmtechniken
            </h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Kraul · Brust · Rücken · Delphin — Phasen im Detail
            </p>
          </div>
        </div>
      </div>

      {/* Stil-Tabs */}
      <div className="flex gap-2 mb-4">
        {STROKES.map((s, i) => (
          <button key={s.id} onClick={() => handleStroke(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              strokeIdx === i ? colors.active
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {/* Phasen-Nummern */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {stroke.phases.map((p, i) => (
          <button key={i} onClick={() => setPhaseIdx(i)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              phaseIdx === i
                ? `${colors.active} ${colors.ring} border`
                : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {i + 1}. {p.name}
          </button>
        ))}
      </div>

      {/* Haupt-Karte */}
      <div className={`rounded-2xl border overflow-hidden mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>

        {/* SVG-Illustration */}
        <div className={`${darkMode ? 'bg-slate-900' : 'bg-blue-50'} p-2`}>
          {phase.svg(darkMode)}
        </div>

        {/* Phasenkopf */}
        <div className={`px-4 pt-4 pb-2 border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge(darkMode)}`}>
              Phase {phaseIdx + 1} / {stroke.phases.length}
            </span>
            <span className={`text-sm font-bold ${colors.text(darkMode)}`}>{phase.name}</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{phase.sub}</p>
        </div>

        {/* Inhalt */}
        <div className="p-4 grid gap-3">
          {/* Schlüsselpunkte */}
          <div>
            <div className={`text-xs font-semibold mb-1.5 ${colors.text(darkMode)}`}>Worauf achten:</div>
            <ul className={`space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {phase.punkte.map((p, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className={`mt-0.5 flex-shrink-0 ${colors.text(darkMode)}`}>✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Häufiger Fehler */}
          <div className={`rounded-lg p-3 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
              ⚠️ Häufiger Fehler
            </div>
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{phase.fehler}</div>
          </div>

          {/* Tipp */}
          <div className={`rounded-lg p-3 border-l-4 border-emerald-500 ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
            <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              💡 Merksatz
            </div>
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{phase.tipp}</div>
          </div>
        </div>
      </div>

      {/* Navigation Vor/Zurück */}
      <div className="flex justify-between gap-2">
        <button onClick={prev} disabled={phaseIdx === 0}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 ${
            darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          ← Vorherige Phase
        </button>
        <button onClick={next} disabled={phaseIdx === stroke.phases.length - 1}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 ${
            darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Nächste Phase →
        </button>
      </div>

      {/* Alle Phasen Mini-Übersicht */}
      <div className={`mt-4 rounded-2xl border p-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className={`text-xs font-semibold mb-3 ${colors.text(darkMode)}`}>
          {stroke.icon} {stroke.name} — Alle Phasen im Überblick
        </div>
        <div className="grid gap-2">
          {stroke.phases.map((p, i) => (
            <button key={i} onClick={() => setPhaseIdx(i)}
              className={`flex items-start gap-3 text-left p-2.5 rounded-xl border transition-colors ${
                phaseIdx === i
                  ? `border-2 ${colors.ring} ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`
                  : darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-100 hover:bg-gray-50'
              }`}>
              <span className={`text-sm font-bold w-5 flex-shrink-0 ${phaseIdx === i ? colors.text(darkMode) : (darkMode ? 'text-slate-500' : 'text-gray-400')}`}>
                {i + 1}
              </span>
              <div>
                <div className={`text-xs font-semibold ${phaseIdx === i ? colors.text(darkMode) : (darkMode ? 'text-slate-300' : 'text-gray-700')}`}>
                  {p.name}
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{p.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
