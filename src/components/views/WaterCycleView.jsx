import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Gauge,
  ListChecks,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Wrench,
  XCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  WATER_CYCLE_DEFAULT_CONTROLS,
  WATER_CYCLE_FUTURE_MODULES,
  WATER_CYCLE_PIPES,
  WATER_CYCLE_PROFI_SPICKZETTEL,
  WATER_CYCLE_STATION_ORDER,
  WATER_CYCLE_STATIONS,
  WATER_CYCLE_VIEWBOX
} from '../../data/waterCycle';
import { WATER_CYCLE_MISSIONS } from '../../data/waterCycleMissions';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const fixed = (value, digits = 2) => Number(value.toFixed(digits));

const CONTROL_LABELS = {
  pumpEnabled: 'Pumpe',
  ventValveOpen: 'Entlueftung V3',
  backwashMode: 'Rueckspuelmodus',
  backwashValveOpen: 'Rueckspuelventil V4',
  disinfectPumpEnabled: 'Dosierpumpe',
  rawValveOpen: 'Saugleitung V1',
  returnValveOpen: 'Ruecklaufventil V2'
};

const METRIC_LABELS = {
  flowRate: 'Volumenstrom',
  freeChlorine: 'Freies Chlor',
  backwashProgress: 'Rueckspuel-Fortschritt',
  differentialPressure: 'Differenzdruck'
};

const STATION_FOCUS = {
  becken: { x: 192, y: 338, r: 126 },
  ueberlauf: { x: 338, y: 252, r: 52 },
  schwall: { x: 522, y: 206, r: 108 },
  pumpe: { x: 532, y: 430, r: 84 },
  flockung: { x: 708, y: 430, r: 66 },
  filter: { x: 854, y: 420, r: 94 },
  desinfektion: { x: 1022, y: 326, r: 82 },
  heizung: { x: 1020, y: 166, r: 72 },
  ruecklauf: { x: 774, y: 154, r: 58 }
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
  return all.length > 0 && all.every((condition) => isConditionOk(condition, snapshot));
};

const formatCondition = (condition) => {
  const sourceLabel = condition.source === 'control'
    ? (CONTROL_LABELS[condition.key] || condition.key)
    : (METRIC_LABELS[condition.key] || condition.key);
  if (Object.prototype.hasOwnProperty.call(condition, 'equals')) {
    return `${sourceLabel} = ${String(condition.equals)}`;
  }
  if (Object.prototype.hasOwnProperty.call(condition, 'min')) {
    return `${sourceLabel} >= ${condition.min}`;
  }
  if (Object.prototype.hasOwnProperty.call(condition, 'max')) {
    return `${sourceLabel} <= ${condition.max}`;
  }
  return sourceLabel;
};

const formatLogTime = (timestamp) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
};

const WaterCycleView = () => {
  const { darkMode, playSound, showToast } = useApp();
  const [selectedStationId, setSelectedStationId] = useState(WATER_CYCLE_STATION_ORDER[0]);
  const [controls, setControls] = useState(WATER_CYCLE_DEFAULT_CONTROLS);
  const [xrayMode, setXrayMode] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [autoTour, setAutoTour] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState(WATER_CYCLE_MISSIONS[0].id);
  const [backwashProgress, setBackwashProgress] = useState(0);
  const [missionState, setMissionState] = useState(() => Object.fromEntries(
    WATER_CYCLE_MISSIONS.map((mission) => [mission.id, { status: 'idle', attempts: 0, solvedAt: null }])
  ));
  const [missionLog, setMissionLog] = useState([]);

  const stationMap = useMemo(() => new Map(WATER_CYCLE_STATIONS.map((station) => [station.id, station])), []);
  const selectedStation = stationMap.get(selectedStationId) || WATER_CYCLE_STATIONS[0];
  const stationIndex = Math.max(0, WATER_CYCLE_STATION_ORDER.indexOf(selectedStation.id));
  const stationFocus = STATION_FOCUS[selectedStationId] || STATION_FOCUS.becken;
  const mission = WATER_CYCLE_MISSIONS.find((entry) => entry.id === activeMissionId) || WATER_CYCLE_MISSIONS[0];
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
      0.12,
      1.7
    );
    let freeChlorine = 0.2 + (controls.disinfectPumpEnabled ? controls.disinfectSetpoint * 0.046 : -0.07);
    if (symptomFlags.has('lowChlorine')) freeChlorine -= 0.12;
    freeChlorine = clamp(fixed(freeChlorine, 2), 0.05, 1.15);
    const pH = clamp(fixed(7.2 + controls.phTrim * 0.03, 2), 6.5, 7.8);
    const temperature = clamp(
      fixed(25.5 + controls.heatExchangerPower * 0.08 - (controls.backwashMode ? 0.35 : 0), 1),
      23.8,
      34
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
    const timer = window.setInterval(() => {
      setSelectedStationId((prev) => {
        const index = WATER_CYCLE_STATION_ORDER.indexOf(prev);
        return WATER_CYCLE_STATION_ORDER[(index + 1) % WATER_CYCLE_STATION_ORDER.length];
      });
    }, 3200);
    return () => window.clearInterval(timer);
  }, [autoTour]);

  useEffect(() => {
    if (!(controls.backwashMode && controls.backwashValveOpen && controls.pumpEnabled)) return undefined;
    const timer = window.setInterval(() => setBackwashProgress((prev) => clamp(prev + 6, 0, 100)), 430);
    return () => window.clearInterval(timer);
  }, [controls.backwashMode, controls.backwashValveOpen, controls.pumpEnabled]);

  useEffect(() => {
    if (controls.backwashMode || backwashProgress <= 0) return undefined;
    const timer = window.setInterval(() => setBackwashProgress((prev) => clamp(prev - 4, 0, 100)), 620);
    return () => window.clearInterval(timer);
  }, [controls.backwashMode, backwashProgress]);

  useEffect(() => {
    if (!missionActive) return undefined;
    const alarmSound = mission?.symptom?.audio === 'bubble' ? 'bubble' : 'wrong';
    playSound(alarmSound);
    const timer = window.setInterval(() => playSound(alarmSound), 5200);
    return () => window.clearInterval(timer);
  }, [missionActive, mission?.symptom?.audio, playSound]);

  useEffect(() => {
    if (!missionActive || !isMissionSolved(mission, snapshot)) return;
    const solvedAt = new Date().toISOString();
    setMissionState((prev) => ({
      ...prev,
      [activeMissionId]: { ...prev[activeMissionId], status: 'solved', solvedAt }
    }));
    setMissionLog((prev) => [
      { id: `${activeMissionId}-${solvedAt}`, message: `${mission.title}: ${mission.successFeedback}`, createdAt: solvedAt },
      ...prev
    ]);
    showToast(mission.successFeedback, 'success', 3800);
    playSound('correct');
  }, [missionActive, mission, snapshot, activeMissionId, showToast, playSound]);

  const pipeStates = useMemo(() => WATER_CYCLE_PIPES.map((pipe) => {
    const activeInMode = controls.backwashMode ? pipe.mode !== 'normal' || pipe.reversibleInBackwash : pipe.mode !== 'backwash';
    const reverse = controls.backwashMode && pipe.reversibleInBackwash;
    return {
      ...pipe,
      hasFlow: activeInMode && metrics.flowRate > 0,
      reverse,
      backwash: pipe.mode === 'backwash' || reverse
    };
  }), [controls.backwashMode, metrics.flowRate]);

  const setControlValue = (key, value) => setControls((prev) => ({ ...prev, [key]: value }));
  const toggleControl = (key) => {
    setControlValue(key, !controls[key]);
    playSound('splash');
  };
  const chooseStation = (id) => {
    setSelectedStationId(id);
    playSound('splash');
  };

  const startMission = () => {
    setMissionState((prev) => ({
      ...prev,
      [activeMissionId]: {
        ...prev[activeMissionId],
        status: 'active',
        attempts: prev[activeMissionId].attempts + 1,
        solvedAt: null
      }
    }));
    setMissionLog((prev) => [
      { id: `${activeMissionId}-${Date.now()}-start`, message: `${mission.title} gestartet`, createdAt: new Date().toISOString() },
      ...prev
    ]);
    playSound('whistle');
  };

  const resetMission = () => {
    setMissionState((prev) => ({
      ...prev,
      [activeMissionId]: { ...prev[activeMissionId], status: 'idle', solvedAt: null }
    }));
    playSound('splash');
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      <style>{`
        @keyframes wcFlow { to { stroke-dashoffset: -120; } }
        @keyframes wcSpin { to { transform: rotate(360deg); } }
        @keyframes wcBubble { 0% { transform: translateY(0); opacity: 0.15; } 55% { opacity: 0.95; } 100% { transform: translateY(-18px); opacity: 0; } }
        @keyframes wcPulse { 0% { opacity: 0.85; transform: scale(0.97); } 100% { opacity: 0; transform: scale(1.08); } }
        @keyframes wcSurface { to { stroke-dashoffset: -80; } }
        .wc-flow { stroke-dasharray: 16 12; animation: wcFlow linear infinite; }
        .wc-flow-reverse { animation-direction: reverse; }
        .wc-impeller { transform-origin: center; animation: wcSpin 1.05s linear infinite; }
        .wc-bubble { animation: wcBubble 1.2s ease-in infinite; }
        .wc-pulse { transform-origin: center; animation: wcPulse 1.4s ease-out infinite; }
        .wc-surface { stroke-dasharray: 8 10; animation: wcSurface 1.4s linear infinite; }
      `}</style>

      <section className={`rounded-3xl border p-5 shadow-xl ${darkMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-cyan-100 text-slate-900'}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-4xl">
            <p className={`text-xs uppercase tracking-[0.2em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Technikraum Simulation</p>
            <h2 className="text-3xl font-black mt-1">Interaktiver Wasserkreislauf 3.1</h2>
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Detailliertes Anlagenbild mit Pumpenraum-Look, X-Ray-Ebene, Missionslogik und praxisnahem Leitstand.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAutoTour((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${autoTour ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}
            >
              <Play size={16} />
              {autoTour ? 'Auto stop' : 'Auto start'}
            </button>
            <button
              onClick={() => setXrayMode((prev) => !prev)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${xrayMode ? 'bg-violet-500 text-white' : (darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}
            >
              {xrayMode ? 'Roentgen an' : 'Roentgen aus'}
            </button>
            <button
              onClick={() => setShowCheatSheet((prev) => !prev)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${showCheatSheet ? 'bg-emerald-500 text-white' : (darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}
            >
              DIN Spickzettel
            </button>
          </div>
        </div>
      </section>

      <div className="grid xl:grid-cols-[minmax(0,1.95fr)_minmax(360px,1fr)] gap-4">
        <section className={`rounded-3xl border p-4 shadow-xl ${darkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-cyan-100'}`}>
          <div className="overflow-x-auto">
            <svg className="min-w-[980px] w-full h-[660px] rounded-2xl" viewBox={`0 0 ${WATER_CYCLE_VIEWBOX.width} ${WATER_CYCLE_VIEWBOX.height}`}>
              <defs>
                <linearGradient id="wcWall" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={darkMode ? '#0b1222' : '#ecfeff'} />
                  <stop offset="100%" stopColor={darkMode ? '#17263d' : '#f1f5f9'} />
                </linearGradient>
                <linearGradient id="wcFloor" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={darkMode ? '#111827' : '#dbeafe'} />
                  <stop offset="100%" stopColor={darkMode ? '#0f172a' : '#cbd5e1'} />
                </linearGradient>
                <linearGradient id="wcPipeBase" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={darkMode ? '#334155' : '#cbd5e1'} />
                  <stop offset="100%" stopColor={darkMode ? '#64748b' : '#94a3b8'} />
                </linearGradient>
                <linearGradient id="wcFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="wcBackwash" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="wcWater" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <pattern id="wcTiles" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                  <rect width="18" height="18" fill={darkMode ? '#132339' : '#e0f2fe'} />
                  <path d="M 0 0 L 18 0 M 0 0 L 0 18" stroke={darkMode ? '#1e3a5f' : '#bfdbfe'} strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" rx="24" fill="url(#wcWall)" />
              <polygon points="28,506 1240,506 1188,735 80,735" fill="url(#wcFloor)" />
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <line
                  key={`floor-line-${index}`}
                  x1={70 + index * 190}
                  y1="530"
                  x2={110 + index * 175}
                  y2="720"
                  stroke={darkMode ? '#1f334e' : '#93c5fd'}
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
              ))}

              <g pointerEvents="none">
                <circle cx={stationFocus.x} cy={stationFocus.y} r={stationFocus.r} fill="none" stroke="#22d3ee44" strokeWidth="7" />
                <circle cx={stationFocus.x} cy={stationFocus.y} r={stationFocus.r} fill="none" stroke="#22d3ee88" strokeWidth="3" className="wc-pulse" />
              </g>

              {pipeStates.map((pipe) => (
                <g key={pipe.id}>
                  <path d={pipe.path} fill="none" stroke="url(#wcPipeBase)" strokeWidth="18" strokeLinecap="round" />
                  <path d={pipe.path} fill="none" stroke={darkMode ? '#94a3b855' : '#f8fafccc'} strokeWidth="4" strokeLinecap="round" />
                  {pipe.hasFlow && (
                    <path
                      d={pipe.path}
                      fill="none"
                      stroke={pipe.backwash ? 'url(#wcBackwash)' : 'url(#wcFlow)'}
                      strokeWidth="9"
                      strokeLinecap="round"
                      className={`wc-flow ${pipe.reverse ? 'wc-flow-reverse' : ''}`}
                      style={{ animationDuration: `${flowDuration}s` }}
                    />
                  )}
                </g>
              ))}

              <g onClick={() => chooseStation('becken')} style={{ cursor: 'pointer' }}>
                <rect x="72" y="230" width="240" height="210" rx="28" fill="url(#wcTiles)" stroke={selectedStationId === 'becken' ? '#06b6d4' : '#38bdf8'} strokeWidth="5" />
                <rect x="90" y="284" width="204" height="138" rx="18" fill="url(#wcWater)" opacity="0.92" />
                <path d="M 102 296 C 146 284 198 304 240 292 C 264 286 282 294 292 298" fill="none" stroke="#e0f2fe" strokeWidth="3" className="wc-surface" />
                <rect x="88" y="252" width="208" height="16" rx="8" fill={darkMode ? '#334155' : '#cbd5e1'} />
                <rect x="108" y="222" width="150" height="24" rx="8" fill={darkMode ? '#0f172acc' : '#ffffffdd'} />
                <text x="117" y="239" fill={darkMode ? '#e2e8f0' : '#0f172a'} fontWeight="700" fontSize="14">Becken + Ueberlaufrinne</text>
              </g>

              <g onClick={() => chooseStation('ueberlauf')} style={{ cursor: 'pointer' }}>
                <rect x="320" y="238" width="46" height="28" rx="6" fill={darkMode ? '#374151' : '#e2e8f0'} stroke="#64748b" strokeWidth="2.5" />
                <rect x="324" y="244" width="38" height="10" rx="5" fill="#60a5fa" opacity="0.7" />
              </g>

              <g onClick={() => chooseStation('schwall')} style={{ cursor: 'pointer' }}>
                <rect x="430" y="132" width="188" height="146" rx="16" fill={darkMode ? '#10243d' : '#dbeafe'} stroke="#60a5fa" strokeWidth="3" />
                <rect x="438" y={140 + (100 - metrics.surgeLevel)} width="172" height={metrics.surgeLevel} rx="10" fill={darkMode ? '#0ea5e955' : '#38bdf888'} />
                <rect x="444" y="142" width="160" height="20" rx="9" fill={darkMode ? '#0f172abf' : '#ffffffde'} />
                <text x="452" y="156" fill={darkMode ? '#e2e8f0' : '#0f172a'} fontWeight="700" fontSize="12">Schwallwasserbehaelter</text>
                <rect x="620" y="148" width="14" height="110" rx="6" fill={darkMode ? '#0f172a' : '#e2e8f0'} stroke="#64748b" />
                <rect x="622" y={250 - metrics.surgeLevel} width="10" height="8" rx="3" fill="#22d3ee" />
              </g>

              <g onClick={() => chooseStation('pumpe')} style={{ cursor: 'pointer' }}>
                <rect x="420" y="458" width="182" height="34" rx="8" fill={darkMode ? '#374151' : '#cbd5e1'} />
                <rect x="452" y="370" width="42" height="56" rx="10" fill={darkMode ? '#1f2937' : '#f1f5f9'} stroke="#94a3b8" strokeWidth="2.5" />
                <circle cx="472" cy="404" r="34" fill={darkMode ? '#1f2937' : '#f8fafc'} stroke="#94a3b8" strokeWidth="3" />
                <circle cx="532" cy="430" r="52" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="4" />
                <circle cx="532" cy="430" r="19" fill={darkMode ? '#0f172a' : '#94a3b8'} />
                <g className={controls.pumpEnabled ? 'wc-impeller' : ''}>
                  <line x1="532" y1="412" x2="532" y2="448" stroke="#22d3ee" strokeWidth="4" />
                  <line x1="514" y1="430" x2="550" y2="430" stroke="#22d3ee" strokeWidth="4" />
                  <line x1="520" y1="418" x2="544" y2="442" stroke="#22d3ee" strokeWidth="3" />
                </g>
                {symptomFlags.has('pumpBubbles') && (
                  <>
                    <circle cx="468" cy="406" r="4" fill="#67e8f9" className="wc-bubble" />
                    <circle cx="482" cy="418" r="3" fill="#22d3ee" className="wc-bubble" style={{ animationDelay: '0.25s' }} />
                    <circle cx="490" cy="410" r="2.8" fill="#7dd3fc" className="wc-bubble" style={{ animationDelay: '0.52s' }} />
                    <path d="M 458 352 L 444 330 L 472 330 Z" fill="#f59e0b" />
                  </>
                )}
                {xrayMode && selectedStationId === 'pumpe' && (
                  <>
                    <circle cx="532" cy="430" r="36" fill="none" stroke="#67e8f9" strokeDasharray="4 4" />
                    <circle cx="532" cy="430" r="10" fill="#06b6d4aa" />
                  </>
                )}
              </g>

              <g onClick={() => chooseStation('flockung')} style={{ cursor: 'pointer' }}>
                <rect x="650" y="388" width="72" height="96" rx="8" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="3" />
                <rect x="730" y="404" width="28" height="48" rx="6" fill={darkMode ? '#334155' : '#cbd5e1'} />
                <rect x="764" y="390" width="34" height="98" rx="10" fill={darkMode ? '#0f172a' : '#f8fafc'} stroke="#64748b" strokeWidth="2" />
                <rect x="770" y="408" width="22" height="74" rx="8" fill="#0ea5e9aa" />
                <circle cx="745" cy="428" r="4" fill={controls.disinfectPumpEnabled ? '#22c55e' : '#ef4444'} />
              </g>

              <g onClick={() => chooseStation('filter')} style={{ cursor: 'pointer' }}>
                <ellipse cx="854" cy="306" rx="54" ry="17" fill={darkMode ? '#334155' : '#cbd5e1'} />
                <rect x="800" y="306" width="108" height="224" rx="40" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="4" />
                <ellipse cx="854" cy="530" rx="54" ry="17" fill={darkMode ? '#334155' : '#cbd5e1'} />
                <circle cx="924" cy="388" r="18" fill={symptomFlags.has('filterTurbidity') ? '#f59e0b' : '#7dd3fc'} stroke="#1e293b" strokeWidth="3" />
                <path d="M 924 388 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0" fill={symptomFlags.has('filterTurbidity') ? '#fbbf24' : '#dbeafe'} />
                {symptomFlags.has('filterTurbidity') && <path d="M 938 360 L 924 338 L 952 338 Z" fill="#f59e0b" />}
                {xrayMode && selectedStationId === 'filter' && (
                  <>
                    <rect x="812" y="322" width="84" height="58" fill="#a3e63599" />
                    <rect x="812" y="380" width="84" height="74" fill="#facc1599" />
                    <rect x="812" y="454" width="84" height="62" fill="#f9731699" />
                  </>
                )}
              </g>

              <g onClick={() => chooseStation('desinfektion')} style={{ cursor: 'pointer' }}>
                <rect x="978" y="266" width="98" height="122" rx="10" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="3" />
                <rect x="988" y="278" width="34" height="94" rx="7" fill={darkMode ? '#0f172a' : '#f8fafc'} />
                <rect x="1032" y="278" width="34" height="94" rx="7" fill={darkMode ? '#0f172a' : '#f8fafc'} />
                <circle cx="1005" cy="383" r="7" fill={chlorInRange ? '#22c55e' : '#ef4444'} />
                <circle cx="1048" cy="383" r="7" fill={controls.disinfectPumpEnabled ? '#22c55e' : '#ef4444'} />
                {symptomFlags.has('lowChlorine') && <path d="M 1058 242 L 1044 220 L 1072 220 Z" fill="#f59e0b" />}
              </g>

              <g onClick={() => chooseStation('heizung')} style={{ cursor: 'pointer' }}>
                <rect x="970" y="126" width="106" height="74" rx="10" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="3" />
                <path d="M 985 164 C 996 144 1008 184 1020 164 C 1032 144 1044 184 1058 164" fill="none" stroke="#f97316" strokeWidth="3" />
              </g>

              <g onClick={() => chooseStation('ruecklauf')} style={{ cursor: 'pointer' }}>
                <rect x="726" y="122" width="88" height="56" rx="8" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="3" />
                <rect x="734" y="130" width="72" height="16" rx="6" fill={darkMode ? '#0f172a' : '#f8fafc'} />
                <text x="742" y="142" fill={darkMode ? '#e2e8f0' : '#334155'} fontSize="10" fontWeight="700">Ruecklauf</text>
              </g>

              {[
                { key: 'rawValveOpen', x: 520, y: 334, label: 'V1' },
                { key: 'returnValveOpen', x: 520, y: 210, label: 'V2' },
                { key: 'ventValveOpen', x: 540, y: 366, label: 'V3' },
                { key: 'backwashValveOpen', x: 854, y: 550, label: 'V4' }
              ].map((valve) => (
                <g key={valve.key} onClick={() => toggleControl(valve.key)} style={{ cursor: 'pointer' }}>
                  <circle cx={valve.x} cy={valve.y} r="14" fill={controls[valve.key] ? '#22c55e' : '#ef4444'} stroke={darkMode ? '#0f172a' : '#fff'} strokeWidth="3" />
                  <text x={valve.x + 20} y={valve.y + 4} fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12">{valve.label}</text>
                </g>
              ))}
            </svg>
          </div>

          <div className={`mt-3 rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
            <h3 className="font-black flex items-center gap-2"><Gauge size={16} />Technik-Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
              <div className="rounded-lg p-2 bg-cyan-500/10"><span className="font-semibold">Q</span>: {metrics.flowRate} m3/h</div>
              <div className="rounded-lg p-2 bg-blue-500/10"><span className="font-semibold">P</span>: {metrics.pressureBar} bar</div>
              <div className={`rounded-lg p-2 ${chlorInRange ? 'bg-emerald-500/10' : 'bg-red-500/20'}`}><span className="font-semibold">Cl</span>: {metrics.freeChlorine} mg/L</div>
              <div className="rounded-lg p-2 bg-violet-500/10"><span className="font-semibold">pH</span>: {metrics.pH}</div>
              <div className="rounded-lg p-2 bg-orange-500/10"><span className="font-semibold">T</span>: {metrics.temperature} C</div>
              <div className={`rounded-lg p-2 ${dpInRange ? 'bg-amber-500/10' : 'bg-red-500/20'}`}><span className="font-semibold">dP</span>: {metrics.differentialPressure} bar</div>
              <div className="rounded-lg p-2 bg-slate-500/20"><span className="font-semibold">Speicher</span>: {metrics.surgeLevel}%</div>
              <div className="rounded-lg p-2 bg-amber-500/10"><span className="font-semibold">Rueckspuel</span>: {Math.round(backwashProgress)}%</div>
            </div>
            <div className="grid md:grid-cols-2 gap-2 mt-2 text-xs">
              <label className="rounded-lg p-2 bg-slate-500/10">
                Pumpenleistung {controls.pumpPower}%
                <input type="range" min="20" max="100" value={controls.pumpPower} onChange={(event) => setControlValue('pumpPower', Number(event.target.value))} className="w-full accent-cyan-500" />
              </label>
              <label className="rounded-lg p-2 bg-slate-500/10">
                Cl-Sollwert {controls.disinfectSetpoint}
                <input type="range" min="1" max="12" value={controls.disinfectSetpoint} onChange={(event) => setControlValue('disinfectSetpoint', Number(event.target.value))} className="w-full accent-emerald-500" />
              </label>
              <label className="rounded-lg p-2 bg-slate-500/10">
                pH Trim {controls.phTrim}
                <input type="range" min="-10" max="10" value={controls.phTrim} onChange={(event) => setControlValue('phTrim', Number(event.target.value))} className="w-full accent-violet-500" />
              </label>
              <label className="rounded-lg p-2 bg-slate-500/10">
                Heizleistung {controls.heatExchangerPower}%
                <input type="range" min="0" max="100" value={controls.heatExchangerPower} onChange={(event) => setControlValue('heatExchangerPower', Number(event.target.value))} className="w-full accent-orange-500" />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => toggleControl('pumpEnabled')} className={`px-2.5 py-1 rounded text-xs font-bold ${controls.pumpEnabled ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {controls.pumpEnabled ? 'Pumpe ein' : 'Pumpe aus'}
              </button>
              <button
                onClick={() => {
                  setControlValue('backwashMode', !controls.backwashMode);
                  if (!controls.backwashMode) setBackwashProgress(0);
                  playSound('splash');
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold ${controls.backwashMode ? 'bg-amber-500 text-white' : (darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700')}`}
              >
                {controls.backwashMode ? 'Rueckspuel aktiv' : 'Rueckspuel aus'}
              </button>
              <button onClick={() => toggleControl('disinfectPumpEnabled')} className={`px-2.5 py-1 rounded text-xs font-bold ${controls.disinfectPumpEnabled ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {controls.disinfectPumpEnabled ? 'Dosierpumpe ein' : 'Dosierpumpe aus'}
              </button>
            </div>
          </div>
        </section>

        <aside className={`rounded-3xl border p-4 shadow-xl space-y-4 ${darkMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-cyan-100 text-slate-900'}`}>
          <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
            <p className={`text-xs uppercase tracking-[0.14em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
              Station {stationIndex + 1}/{WATER_CYCLE_STATION_ORDER.length}
            </p>
            <h3 className="text-xl font-black mt-1">{selectedStation.title}</h3>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStation.summary}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {WATER_CYCLE_STATION_ORDER.map((id) => (
                <button
                  key={id}
                  onClick={() => chooseStation(id)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${id === selectedStationId ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')}`}
                >
                  {stationMap.get(id)?.shortLabel}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <details open className={`rounded-lg border p-2 ${darkMode ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
                <summary className="text-xs font-semibold cursor-pointer">Kernfunktion</summary>
                <ul className="mt-1 space-y-1 text-xs">
                  {selectedStation.functionPoints.map((point) => <li key={point}>- {point}</li>)}
                </ul>
              </details>
              <details className={`rounded-lg border p-2 ${darkMode ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
                <summary className="text-xs font-semibold cursor-pointer">Sollwerte</summary>
                <div className="mt-1 space-y-1 text-xs">
                  {selectedStation.targetValues.map((entry) => (
                    <div key={entry.label} className="flex justify-between gap-2">
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{entry.label}</span>
                      <span className="font-semibold text-right">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </details>
              <details className={`rounded-lg border p-2 ${darkMode ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
                <summary className="text-xs font-semibold cursor-pointer">Warnsignale</summary>
                <ul className="mt-1 space-y-1 text-xs">
                  {selectedStation.faultSignals.map((signal) => <li key={signal}>- {signal}</li>)}
                </ul>
              </details>
              <details className={`rounded-lg border p-2 ${darkMode ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
                <summary className="text-xs font-semibold cursor-pointer">Praxis-Checks</summary>
                <ul className="mt-1 space-y-1 text-xs">
                  {selectedStation.practiceChecks.map((check) => <li key={check}>- {check}</li>)}
                </ul>
              </details>
            </div>
          </section>

          <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
            <h3 className="font-black flex items-center gap-2"><ListChecks size={16} />Missions-Logbuch</h3>
            <select
              value={activeMissionId}
              onChange={(event) => setActiveMissionId(event.target.value)}
              className={`mt-2 w-full rounded-lg border px-2 py-2 text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
            >
              {WATER_CYCLE_MISSIONS.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
            </select>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={`rounded-full px-2 py-0.5 font-semibold ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-700'}`}>{mission.level}</span>
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Versuche: {missionStatus.attempts}</span>
            </div>
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <span className="font-semibold">{mission.symptom.title}:</span> {mission.symptom.description}
            </p>
            <p className="text-xs mt-1"><span className="font-semibold">Ziel:</span> {mission.targetAction}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={startMission} className="flex-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold py-2">Mission starten</button>
              <button onClick={resetMission} className={`rounded-lg px-3 text-sm font-bold ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'}`}>Reset</button>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              {(mission.solveWhen?.all || []).map((condition) => {
                const ok = isConditionOk(condition, snapshot);
                return (
                  <p key={`${mission.id}-${condition.key}-${condition.min ?? condition.max ?? String(condition.equals)}`} className={`flex items-center gap-1.5 ${ok ? 'text-emerald-400' : (darkMode ? 'text-slate-300' : 'text-slate-600')}`}>
                    {ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {ok ? 'OK' : 'Offen'} - {formatCondition(condition)}
                  </p>
                );
              })}
            </div>
            <div className="mt-2 space-y-1 text-xs max-h-28 overflow-y-auto">
              {missionLog.length === 0 && <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Noch keine Eintraege.</p>}
              {missionLog.map((entry) => (
                <div key={entry.id} className={`rounded p-2 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                  {entry.message}
                  <div className={darkMode ? 'text-slate-500' : 'text-slate-400'}>{formatLogTime(entry.createdAt)}</div>
                </div>
              ))}
            </div>
          </section>

          {showCheatSheet && (
            <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
              <h3 className="font-black flex items-center gap-2"><ShieldCheck size={16} />Profi-Spickzettel</h3>
              <div className="mt-2 text-sm space-y-2">
                {WATER_CYCLE_PROFI_SPICKZETTEL.map((block) => (
                  <div key={block.title}>
                    <p className="font-semibold">{block.title}</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      {block.items.map((item) => <li key={item}>- {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
            <h3 className="font-black mb-2">Naechste Module</h3>
            <div className="space-y-2 text-sm">
              {WATER_CYCLE_FUTURE_MODULES.map((module) => (
                <div key={module.id} className="flex items-center justify-between rounded-lg border border-dashed border-slate-400/40 px-2 py-1.5">
                  <span>{module.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20">{module.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
            <h3 className="font-black mb-2">Anlagenstatus</h3>
            <div className="space-y-1.5 text-xs">
              <p className="flex items-center gap-2">
                <Activity size={13} className={missionActive ? 'text-amber-400' : 'text-emerald-400'} />
                {missionActive ? 'Stoerung aktiv' : 'Anlage stabil'}
              </p>
              <p className="flex items-center gap-2">
                <Droplets size={13} className={chlorInRange ? 'text-emerald-400' : 'text-red-400'} />
                Chlorreserve {chlorInRange ? 'im Soll' : 'unter Soll'}
              </p>
              <p className="flex items-center gap-2">
                <Thermometer size={13} className={temperatureInRange ? 'text-emerald-400' : 'text-amber-400'} />
                Temperatur {temperatureInRange ? 'stabil' : 'abweichend'}
              </p>
              <p className="flex items-center gap-2">
                <Gauge size={13} className={dpInRange ? 'text-emerald-400' : 'text-red-400'} />
                Filterdruck {dpInRange ? 'normal' : 'kritisch'}
              </p>
              <p className="flex items-center gap-2">
                <Wrench size={13} className={controls.backwashMode ? 'text-amber-400' : 'text-slate-400'} />
                Rueckspuelmodus {controls.backwashMode ? 'aktiv' : 'aus'}
              </p>
              <p className="flex items-center gap-2">
                <SlidersHorizontal size={13} className={missionActive ? 'text-amber-400' : 'text-emerald-400'} />
                Missionstatus {missionStatus.status === 'solved' ? 'geloest' : missionStatus.status === 'active' ? 'laeuft' : 'bereit'}
              </p>
              {!chlorInRange && (
                <p className="flex items-center gap-2 text-red-400">
                  <AlertTriangle size={13} />
                  Grenzwert alarmiert
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default WaterCycleView;
