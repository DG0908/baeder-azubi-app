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
  becken: { x: 208, y: 150, r: 130 },
  ueberlauf: { x: 426, y: 150, r: 46 },
  schwall: { x: 522, y: 150, r: 88 },
  pumpe: { x: 530, y: 328, r: 84 },
  flockung: { x: 686, y: 330, r: 68 },
  filter: { x: 854, y: 318, r: 88 },
  desinfektion: { x: 1040, y: 286, r: 84 },
  heizung: { x: 1040, y: 156, r: 72 },
  ruecklauf: { x: 808, y: 108, r: 62 }
};

const SCHEMATIC_PIPE_PATHS = {
  'becken-ueberlauf': 'M 356 148 L 420 148',
  'ueberlauf-schwall': 'M 434 148 L 470 148',
  'schwall-pumpe': 'M 530 206 L 530 280',
  'pumpe-flockung': 'M 568 330 L 650 330',
  'flockung-filter': 'M 722 330 L 820 330',
  'filter-desinfektion': 'M 888 304 C 950 292 1000 286 1040 286',
  'desinfektion-heizung': 'M 1040 270 L 1040 194',
  'heizung-ruecklauf': 'M 1010 138 C 950 114 902 108 840 108',
  'ruecklauf-becken': 'M 804 108 C 690 110 530 118 356 148',
  'filter-kanal': 'M 840 362 L 840 452 C 860 520 940 548 1020 548'
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
  const [deepDiveStationId, setDeepDiveStationId] = useState(null);

  const stationMap = useMemo(() => new Map(WATER_CYCLE_STATIONS.map((station) => [station.id, station])), []);
  const selectedStation = stationMap.get(selectedStationId) || WATER_CYCLE_STATIONS[0];
  const deepDiveStation = deepDiveStationId ? stationMap.get(deepDiveStationId) : null;
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
      path: SCHEMATIC_PIPE_PATHS[pipe.id] || pipe.path,
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
        @keyframes wcFloat { 0% { transform: translate3d(-50%, -52%, 0) rotateX(58deg) rotateZ(-28deg); } 50% { transform: translate3d(-50%, -48%, 10px) rotateX(58deg) rotateZ(-28deg); } 100% { transform: translate3d(-50%, -52%, 0) rotateX(58deg) rotateZ(-28deg); } }
        .wc-flow { stroke-dasharray: 16 12; animation: wcFlow linear infinite; }
        .wc-flow-reverse { animation-direction: reverse; }
        .wc-impeller { transform-origin: center; animation: wcSpin 1.05s linear infinite; }
        .wc-bubble { animation: wcBubble 1.2s ease-in infinite; }
        .wc-pulse { transform-origin: center; animation: wcPulse 1.4s ease-out infinite; }
        .wc-surface { stroke-dasharray: 8 10; animation: wcSurface 1.4s linear infinite; }
        .wc-3d-float { animation: wcFloat 5.4s ease-in-out infinite; transform-style: preserve-3d; }
      `}</style>

      <section className={`rounded-3xl border p-5 shadow-xl ${darkMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-cyan-100 text-slate-900'}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-4xl">
            <p className={`text-xs uppercase tracking-[0.2em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Technikraum Simulation</p>
            <h2 className="text-3xl font-black mt-1">Interaktiver Wasserkreislauf Studio</h2>
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Premium-Schaubild mit klarer Prozesslinie, Lernfokus, Missionslogik und Deep-Dive je Bauteil.
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
                <linearGradient id="wcSchematicBg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={darkMode ? '#0f172a' : '#f8fbff'} />
                  <stop offset="100%" stopColor={darkMode ? '#111827' : '#eef4fb'} />
                </linearGradient>
                <linearGradient id="wcPaperPanel" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={darkMode ? '#0b1220' : '#ffffff'} />
                  <stop offset="100%" stopColor={darkMode ? '#18253b' : '#f7fafc'} />
                </linearGradient>
                <linearGradient id="wcPipeBase" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={darkMode ? '#3c4f69' : '#a7b7c8'} />
                  <stop offset="100%" stopColor={darkMode ? '#60758f' : '#7e92a8'} />
                </linearGradient>
                <linearGradient id="wcFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="wcBackwash" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="wcWater" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8cd9ff" />
                  <stop offset="100%" stopColor="#2aa8e8" />
                </linearGradient>
                <pattern id="wcGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke={darkMode ? '#25344a' : '#d5e1ef'} strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" rx="24" fill="url(#wcSchematicBg)" />
              <rect x="28" y="28" width="1224" height="704" rx="20" fill="url(#wcPaperPanel)" stroke={darkMode ? '#334155' : '#d4e1ef'} />
              <rect x="28" y="28" width="1224" height="704" rx="20" fill="url(#wcGrid)" opacity={darkMode ? '0.38' : '0.8'} />
              <text x="58" y="66" fill={darkMode ? '#cbd5e1' : '#1e293b'} fontSize="20" fontWeight="700">Hydraulik-Schaubild Beckenwasseraufbereitung</text>
              <text x="58" y="88" fill={darkMode ? '#94a3b8' : '#64748b'} fontSize="12">Klick auf eine Komponente fuer Stationswissen oder Deep-Dive</text>

              <g pointerEvents="none">
                <circle cx={stationFocus.x} cy={stationFocus.y} r={stationFocus.r} fill="none" stroke="#22d3ee3f" strokeWidth="8" />
                <circle cx={stationFocus.x} cy={stationFocus.y} r={stationFocus.r} fill="none" stroke="#22d3ee7a" strokeWidth="3" className="wc-pulse" />
              </g>

              {pipeStates.map((pipe) => (
                <g key={pipe.id}>
                  <path d={pipe.path} fill="none" stroke="url(#wcPipeBase)" strokeWidth="16" strokeLinecap="round" />
                  <path d={pipe.path} fill="none" stroke={darkMode ? '#0f172a99' : '#ffffffbb'} strokeWidth="3" strokeLinecap="round" />
                  {pipe.hasFlow && (
                    <path
                      d={pipe.path}
                      fill="none"
                      stroke={pipe.backwash ? 'url(#wcBackwash)' : 'url(#wcFlow)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      className={`wc-flow ${pipe.reverse ? 'wc-flow-reverse' : ''}`}
                      style={{ animationDuration: `${flowDuration}s` }}
                    />
                  )}
                </g>
              ))}

              <g onClick={() => chooseStation('becken')} style={{ cursor: 'pointer' }}>
                <rect x="62" y="78" width="294" height="146" rx="16" fill={darkMode ? '#0e1a2c' : '#ffffff'} stroke={selectedStationId === 'becken' ? '#22d3ee' : '#93a9bf'} strokeWidth="3" />
                <rect x="80" y="122" width="254" height="90" rx="8" fill="url(#wcWater)" opacity="0.9" />
                <path d="M 96 136 C 130 122 176 142 214 130 C 252 118 290 138 320 128" fill="none" stroke="#dff4ff" strokeWidth="2.4" className="wc-surface" />
                <rect x="356" y="94" width="58" height="70" rx="8" fill={darkMode ? '#1f2937' : '#f1f5f9'} stroke="#7c90a6" strokeWidth="2" />
                <text x="76" y="104" fill={darkMode ? '#dbe7f5' : '#1e293b'} fontSize="13" fontWeight="700">Schwimmbecken + Ueberlauf</text>
              </g>

              <g onClick={() => chooseStation('ueberlauf')} style={{ cursor: 'pointer' }}>
                <rect x="418" y="128" width="18" height="40" rx="5" fill={darkMode ? '#1f2937' : '#e5edf7'} stroke="#7c90a6" strokeWidth="2" />
              </g>

              <g onClick={() => chooseStation('schwall')} style={{ cursor: 'pointer' }}>
                <rect x="470" y="88" width="118" height="120" rx="12" fill={darkMode ? '#13233a' : '#ecf4ff'} stroke={selectedStationId === 'schwall' ? '#22d3ee' : '#8aa0b6'} strokeWidth="3" />
                <rect x="478" y={92 + (104 - metrics.surgeLevel)} width="102" height={metrics.surgeLevel} rx="8" fill="#38bdf84d" />
                <text x="474" y="80" fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12" fontWeight="700">Schwallwasserbehaelter</text>
              </g>

              <g onClick={() => chooseStation('pumpe')} style={{ cursor: 'pointer' }}>
                <circle cx="530" cy="330" r="42" fill={darkMode ? '#1e293b' : '#e8eef5'} stroke="#6f8398" strokeWidth="3" />
                <circle cx="530" cy="330" r="18" fill={darkMode ? '#0f172a' : '#cbd5e1'} />
                <g className={controls.pumpEnabled ? 'wc-impeller' : ''}>
                  <line x1="530" y1="312" x2="530" y2="348" stroke="#22d3ee" strokeWidth="3.2" />
                  <line x1="512" y1="330" x2="548" y2="330" stroke="#22d3ee" strokeWidth="3.2" />
                  <line x1="516" y1="316" x2="544" y2="344" stroke="#22d3ee" strokeWidth="2.6" />
                </g>
                {symptomFlags.has('pumpBubbles') && (
                  <>
                    <circle cx="500" cy="312" r="3.5" fill="#7dd3fc" className="wc-bubble" />
                    <circle cx="510" cy="322" r="2.6" fill="#38bdf8" className="wc-bubble" style={{ animationDelay: '0.2s' }} />
                  </>
                )}
                <text x="494" y="386" fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12" fontWeight="700">Pumpe</text>
              </g>

              <g onClick={() => chooseStation('flockung')} style={{ cursor: 'pointer' }}>
                <rect x="654" y="284" width="68" height="92" rx="10" fill={darkMode ? '#1f2937' : '#e8eef5'} stroke="#7b8da2" strokeWidth="2.5" />
                <rect x="736" y="300" width="26" height="70" rx="8" fill={darkMode ? '#111827' : '#f8fafc'} stroke="#7b8da2" strokeWidth="2" />
                <rect x="742" y="318" width="14" height="46" rx="5" fill="#38bdf880" />
                <text x="642" y="392" fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12" fontWeight="700">Flockung</text>
              </g>

              <g onClick={() => chooseStation('filter')} style={{ cursor: 'pointer' }}>
                <ellipse cx="854" cy="246" rx="34" ry="12" fill={darkMode ? '#334155' : '#cbd5e1'} />
                <rect x="820" y="246" width="68" height="166" rx="28" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke={selectedStationId === 'filter' ? '#22d3ee' : '#72859b'} strokeWidth="3" />
                <ellipse cx="854" cy="412" rx="34" ry="12" fill={darkMode ? '#334155' : '#cbd5e1'} />
                <circle cx="906" cy="308" r="14" fill={symptomFlags.has('filterTurbidity') ? '#f59e0b' : '#7dd3fc'} stroke="#1f2937" strokeWidth="2.6" />
                {xrayMode && selectedStationId === 'filter' && (
                  <>
                    <rect x="828" y="264" width="52" height="46" fill="#86efac88" />
                    <rect x="828" y="310" width="52" height="54" fill="#facc1588" />
                    <rect x="828" y="364" width="52" height="36" fill="#fb923c88" />
                  </>
                )}
                <text x="824" y="434" fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12" fontWeight="700">Filterkessel</text>
              </g>

              <g onClick={() => chooseStation('desinfektion')} style={{ cursor: 'pointer' }}>
                <rect x="996" y="238" width="92" height="98" rx="10" fill={darkMode ? '#1f2937' : '#e8eef5'} stroke="#75889e" strokeWidth="3" />
                <rect x="1006" y="248" width="30" height="78" rx="6" fill={darkMode ? '#0f172a' : '#f8fafc'} />
                <rect x="1048" y="248" width="30" height="78" rx="6" fill={darkMode ? '#0f172a' : '#f8fafc'} />
                <circle cx="1021" cy="338" r="5.5" fill={chlorInRange ? '#22c55e' : '#ef4444'} />
                <circle cx="1062" cy="338" r="5.5" fill={controls.disinfectPumpEnabled ? '#22c55e' : '#ef4444'} />
                {symptomFlags.has('lowChlorine') && <path d="M 1086 226 L 1074 206 L 1098 206 Z" fill="#f59e0b" />}
                <text x="986" y="358" fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12" fontWeight="700">Desinfektion</text>
              </g>

              <g onClick={() => chooseStation('heizung')} style={{ cursor: 'pointer' }}>
                <rect x="986" y="106" width="108" height="56" rx="10" fill={darkMode ? '#1f2937' : '#e8eef5'} stroke="#75889e" strokeWidth="3" />
                <path d="M 1002 136 C 1014 122 1026 150 1038 136 C 1050 122 1062 150 1074 136" fill="none" stroke="#f97316" strokeWidth="2.8" />
                <text x="988" y="180" fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12" fontWeight="700">Waermetauscher</text>
              </g>

              <g onClick={() => chooseStation('ruecklauf')} style={{ cursor: 'pointer' }}>
                <rect x="756" y="84" width="84" height="48" rx="8" fill={darkMode ? '#1f2937' : '#e8eef5'} stroke="#7b8ea4" strokeWidth="2.8" />
                <rect x="764" y="94" width="68" height="12" rx="5" fill={darkMode ? '#0f172a' : '#ffffff'} />
                <text x="766" y="154" fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12" fontWeight="700">Ruecklauf</text>
              </g>

              <rect x="1004" y="548" width="120" height="44" rx="8" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#7b8ea4" strokeWidth="2" />
              <text x="1014" y="576" fill={darkMode ? '#cbd5e1' : '#334155'} fontSize="12" fontWeight="700">Kanal / Abwurf</text>

              {[
                { key: 'rawValveOpen', x: 530, y: 258, label: 'V1' },
                { key: 'returnValveOpen', x: 612, y: 148, label: 'V2' },
                { key: 'ventValveOpen', x: 558, y: 304, label: 'V3' },
                { key: 'backwashValveOpen', x: 840, y: 468, label: 'V4' }
              ].map((valve) => (
                <g key={valve.key} onClick={() => toggleControl(valve.key)} style={{ cursor: 'pointer' }}>
                  <circle cx={valve.x} cy={valve.y} r="12" fill={controls[valve.key] ? '#22c55e' : '#ef4444'} stroke={darkMode ? '#0f172a' : '#fff'} strokeWidth="2.6" />
                  <text x={valve.x + 16} y={valve.y + 4} fill={darkMode ? '#d3e0ef' : '#334155'} fontSize="11" fontWeight="700">{valve.label}</text>
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
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setDeepDiveStationId(selectedStation.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${darkMode ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40' : 'bg-cyan-100 text-cyan-800 border border-cyan-300'}`}
              >
                3D Deep-Dive
              </button>
              <button
                onClick={() => setXrayMode((prev) => !prev)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${xrayMode ? 'bg-violet-500 text-white' : (darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700')}`}
              >
                {xrayMode ? 'Roentgen an' : 'Roentgen aus'}
              </button>
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

      {deepDiveStation && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-4xl rounded-3xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <p className={`text-xs uppercase tracking-[0.16em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Deep Dive Ansicht</p>
                <h3 className="text-xl font-black">{deepDiveStation.title}</h3>
              </div>
              <button
                onClick={() => setDeepDiveStationId(null)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-700'}`}
              >
                Schliessen
              </button>
            </div>
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4 p-5">
              <div className={`relative rounded-2xl border min-h-[320px] overflow-hidden ${darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(circle_at_70%_75%,rgba(14,165,233,0.14),transparent_40%)]" />
                <div className="absolute inset-0 [perspective:1200px]">
                  <div
                    className={`wc-3d-float absolute left-1/2 top-1/2 w-64 h-40 border shadow-2xl ${xrayMode ? 'opacity-60' : 'opacity-100'} ${darkMode ? 'bg-slate-700/70 border-cyan-400/40' : 'bg-white/90 border-cyan-300'}`}
                    style={{ transform: 'translate3d(-50%, -50%, 0) rotateX(58deg) rotateZ(-28deg)' }}
                  />
                  <div
                    className={`absolute left-1/2 top-1/2 w-36 h-36 rounded-full border ${darkMode ? 'border-cyan-300/50 bg-cyan-400/10' : 'border-cyan-400 bg-cyan-100/60'}`}
                    style={{ transform: 'translate3d(-50%, -50%, 40px) rotateX(58deg) rotateZ(-28deg)' }}
                  />
                  <div
                    className={`absolute left-1/2 top-1/2 w-28 h-28 rounded-full border-2 ${darkMode ? 'border-cyan-200/60' : 'border-cyan-500'}`}
                    style={{ transform: 'translate3d(-50%, -50%, 70px) rotateX(58deg) rotateZ(-28deg)' }}
                  />
                </div>
                <div className={`absolute left-4 bottom-4 rounded-lg px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-slate-900/80 text-cyan-200' : 'bg-white/85 text-cyan-800'}`}>
                  Interaktive 3D-Schnittansicht
                </div>
              </div>
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}>
                  <h4 className="font-bold text-sm">Fokus</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{deepDiveStation.summary}</p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}>
                  <h4 className="font-bold text-sm">Was du hier lernst</h4>
                  <ul className="mt-2 space-y-1 text-xs">
                    {deepDiveStation.functionPoints.slice(0, 3).map((point) => <li key={point}>- {point}</li>)}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setXrayMode((prev) => !prev)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${xrayMode ? 'bg-violet-500 text-white' : (darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-700')}`}
                  >
                    {xrayMode ? 'Roentgen aktiv' : 'Roentgen starten'}
                  </button>
                  <button
                    onClick={() => setDeepDiveStationId(null)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Zurueck
                  </button>
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
