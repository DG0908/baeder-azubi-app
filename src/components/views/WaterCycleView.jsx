import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Gauge, ListChecks, Play, ShieldCheck } from 'lucide-react';
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

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const readValue = (condition, snapshot) => (condition.source === 'control' ? snapshot.controls[condition.key] : snapshot.metrics[condition.key]);
const conditionOk = (condition, snapshot) => {
  const value = readValue(condition, snapshot);
  if (Object.prototype.hasOwnProperty.call(condition, 'equals') && value !== condition.equals) return false;
  if (Object.prototype.hasOwnProperty.call(condition, 'min') && !(Number(value) >= condition.min)) return false;
  if (Object.prototype.hasOwnProperty.call(condition, 'max') && !(Number(value) <= condition.max)) return false;
  return true;
};
const missionSolved = (mission, snapshot) => (mission?.solveWhen?.all || []).every((condition) => conditionOk(condition, snapshot));

const WaterCycleView = () => {
  const { darkMode, playSound, showToast } = useApp();
  const [selectedStationId, setSelectedStationId] = useState(WATER_CYCLE_STATION_ORDER[0]);
  const [controls, setControls] = useState(WATER_CYCLE_DEFAULT_CONTROLS);
  const [xrayMode, setXrayMode] = useState(false);
  const [autoTour, setAutoTour] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState(WATER_CYCLE_MISSIONS[0].id);
  const [backwashProgress, setBackwashProgress] = useState(0);
  const [missionStates, setMissionStates] = useState(() => Object.fromEntries(WATER_CYCLE_MISSIONS.map((m) => [m.id, { status: 'idle', attempts: 0, solvedAt: null }])));
  const [missionLog, setMissionLog] = useState([]);

  const stationMap = useMemo(() => new Map(WATER_CYCLE_STATIONS.map((s) => [s.id, s])), []);
  const selected = stationMap.get(selectedStationId) || WATER_CYCLE_STATIONS[0];
  const selectedIndex = Math.max(0, WATER_CYCLE_STATION_ORDER.indexOf(selected.id));
  const mission = WATER_CYCLE_MISSIONS.find((entry) => entry.id === activeMissionId) || WATER_CYCLE_MISSIONS[0];
  const missionState = missionStates[activeMissionId] || { status: 'idle', attempts: 0, solvedAt: null };
  const missionActive = missionState.status === 'active' && !missionState.solvedAt;
  const symptoms = missionActive ? new Set(mission.symptom.visualFlags || []) : new Set();

  const metrics = useMemo(() => {
    const valveFactor = (controls.rawValveOpen ? 1 : 0.55) * (controls.returnValveOpen ? 1 : 0.7);
    const pumpFactor = controls.pumpEnabled ? controls.pumpPower / 100 : 0;
    let flowRate = Math.round((80 + controls.pumpPower * 1.85) * valveFactor * pumpFactor);
    if (controls.backwashMode) flowRate = Math.round(flowRate * 0.62);
    if (symptoms.has('pumpBubbles') && !controls.ventValveOpen) flowRate = Math.round(flowRate * 0.58);
    const pressureBar = controls.pumpEnabled ? clamp(Number((0.75 + flowRate / 150 + (controls.backwashMode ? 0.28 : 0)).toFixed(2)), 0, 3) : 0.12;
    const differentialPressure = clamp(Number((0.22 + flowRate / 320 + (symptoms.has('filterTurbidity') ? 0.5 : 0) - backwashProgress / 220).toFixed(2)), 0.12, 1.6);
    let freeChlorine = 0.22 + (controls.disinfectPumpEnabled ? controls.disinfectSetpoint * 0.045 : -0.08);
    if (symptoms.has('lowChlorine')) freeChlorine -= 0.12;
    freeChlorine = clamp(Number(freeChlorine.toFixed(2)), 0.05, 1.1);
    const pH = clamp(Number((7.2 + controls.phTrim * 0.03).toFixed(2)), 6.5, 7.8);
    const temperature = clamp(Number((25.6 + controls.heatExchangerPower * 0.08 - (controls.backwashMode ? 0.35 : 0)).toFixed(1)), 24, 34);
    const surgeLevel = clamp(Math.round(44 + (controls.rawValveOpen ? 9 : -11) - flowRate / 17), 10, 95);
    return { flowRate, pressureBar, differentialPressure, freeChlorine, pH, temperature, surgeLevel };
  }, [controls, symptoms, backwashProgress]);

  const snapshot = useMemo(() => ({ controls, metrics: { ...metrics, backwashProgress } }), [controls, metrics, backwashProgress]);
  const flowSpeed = clamp(5 - metrics.flowRate / 55, 0.8, 4.8).toFixed(2);

  useEffect(() => {
    if (!autoTour) return undefined;
    const timer = window.setInterval(() => setSelectedStationId((prev) => WATER_CYCLE_STATION_ORDER[(WATER_CYCLE_STATION_ORDER.indexOf(prev) + 1) % WATER_CYCLE_STATION_ORDER.length]), 3200);
    return () => window.clearInterval(timer);
  }, [autoTour]);

  useEffect(() => {
    if (!(controls.backwashMode && controls.backwashValveOpen && controls.pumpEnabled)) return undefined;
    const timer = window.setInterval(() => setBackwashProgress((prev) => clamp(prev + 6, 0, 100)), 450);
    return () => window.clearInterval(timer);
  }, [controls.backwashMode, controls.backwashValveOpen, controls.pumpEnabled]);

  useEffect(() => {
    if (controls.backwashMode || backwashProgress <= 0) return undefined;
    const timer = window.setInterval(() => setBackwashProgress((prev) => clamp(prev - 4, 0, 100)), 620);
    return () => window.clearInterval(timer);
  }, [controls.backwashMode, backwashProgress]);

  useEffect(() => {
    if (!missionActive) return undefined;
    playSound(mission.symptom.audio === 'bubble' ? 'bubble' : 'wrong');
    const timer = window.setInterval(() => playSound(mission.symptom.audio === 'bubble' ? 'bubble' : 'wrong'), 5200);
    return () => window.clearInterval(timer);
  }, [missionActive, mission.id, mission.symptom.audio, playSound]);

  useEffect(() => {
    if (!missionActive || !missionSolved(mission, snapshot)) return;
    const solvedAt = new Date().toISOString();
    setMissionStates((prev) => ({ ...prev, [activeMissionId]: { ...prev[activeMissionId], status: 'solved', solvedAt } }));
    setMissionLog((prev) => [{ id: `${activeMissionId}-${solvedAt}`, message: `${mission.title}: ${mission.successFeedback}`, createdAt: solvedAt }, ...prev]);
    showToast(mission.successFeedback, 'success', 3800);
    playSound('correct');
  }, [missionActive, mission, snapshot, activeMissionId, showToast, playSound]);

  const setControl = (key, value) => setControls((prev) => ({ ...prev, [key]: value }));
  const toggleControl = (key) => { setControl(key, !controls[key]); playSound('splash'); };
  const chooseStation = (id) => { setSelectedStationId(id); playSound('splash'); };
  const startMission = () => setMissionStates((prev) => ({ ...prev, [activeMissionId]: { ...prev[activeMissionId], status: 'active', attempts: prev[activeMissionId].attempts + 1, solvedAt: null } }));

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      <style>{`
        @keyframes flowDash { to { stroke-dashoffset: -120; } }
        @keyframes impeller { to { transform: rotate(360deg); } }
        @keyframes bubble { 0% { transform: translateY(0); opacity: 0.1; } 60% { opacity: 0.85; } 100% { transform: translateY(-16px); opacity: 0; } }
        .wc-flow { stroke-dasharray: 16 12; animation: flowDash linear infinite; }
        .wc-reverse { animation-direction: reverse; }
        .wc-impeller { transform-origin: center; animation: impeller 1.1s linear infinite; }
        .wc-bubble { animation: bubble 1.2s ease-in infinite; }
      `}</style>

      <section className={`rounded-3xl border p-5 shadow-xl ${darkMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-cyan-100 text-slate-900'}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-4xl"><p className={`text-xs uppercase tracking-[0.2em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Technikraum Simulation</p><h2 className="text-3xl font-black mt-1">Interaktiver Wasserkreislauf 2.0</h2><p className={`text-sm mt-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Realistisches Anlagenmodell mit Missionen, Dashboard und Roentgenansicht.</p></div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setAutoTour((prev) => !prev)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${autoTour ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700')}`}><Play size={16} />{autoTour ? 'Auto stop' : 'Auto start'}</button>
            <button onClick={() => setXrayMode((prev) => !prev)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${xrayMode ? 'bg-violet-500 text-white' : (darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700')}`}>{xrayMode ? 'Roentgen an' : 'Roentgen aus'}</button>
            <button onClick={() => setShowSheet((prev) => !prev)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${showSheet ? 'bg-emerald-500 text-white' : (darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700')}`}>DIN Spickzettel</button>
          </div>
        </div>
      </section>

      <div className="grid xl:grid-cols-[minmax(0,1.9fr)_minmax(360px,1fr)] gap-4">
        <section className={`rounded-3xl border p-4 shadow-xl ${darkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-cyan-100'}`}>
          <div className="overflow-x-auto">
            <svg className="min-w-[980px] w-full h-[620px] rounded-2xl" viewBox={`0 0 ${WATER_CYCLE_VIEWBOX.width} ${WATER_CYCLE_VIEWBOX.height}`}>
              <defs><linearGradient id="p" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={darkMode ? '#334155' : '#cbd5e1'} /><stop offset="100%" stopColor={darkMode ? '#475569' : '#94a3b8'} /></linearGradient><linearGradient id="w" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#0284c7" /></linearGradient><linearGradient id="bw" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
              <rect width="100%" height="100%" rx="24" fill={darkMode ? '#0f172a' : '#ecfeff'} />
              {WATER_CYCLE_PIPES.map((pipe) => { const on = controls.backwashMode ? pipe.mode !== 'normal' || pipe.reversibleInBackwash : pipe.mode !== 'backwash'; const flow = on && metrics.flowRate > 0; const reverse = controls.backwashMode && pipe.reversibleInBackwash; const backwash = pipe.mode === 'backwash' || reverse; return <g key={pipe.id}><path d={pipe.path} fill="none" stroke="url(#p)" strokeWidth="16" strokeLinecap="round" />{flow && <path d={pipe.path} fill="none" stroke={backwash ? 'url(#bw)' : 'url(#w)'} strokeWidth="9" strokeLinecap="round" className={`wc-flow ${reverse ? 'wc-reverse' : ''}`} style={{ animationDuration: `${flowSpeed}s` }} />}</g>; })}
              <g onClick={() => chooseStation('becken')} style={{ cursor: 'pointer' }}><rect x="72" y="242" width="220" height="190" rx="28" fill={darkMode ? '#0f2942' : '#cfeafe'} stroke="#0ea5e9" strokeWidth="4" /><rect x="88" y="282" width="188" height="130" rx="18" fill={darkMode ? '#0e7490aa' : '#7dd3fc'} /><text x="92" y="234" fontSize="15" fill={darkMode ? '#e2e8f0' : '#0f172a'} fontWeight="700">Becken + Ueberlauf</text></g>
              <g onClick={() => chooseStation('schwall')} style={{ cursor: 'pointer' }}><rect x="430" y="142" width="182" height="136" rx="18" fill={darkMode ? '#10243d' : '#dbeafe'} stroke="#60a5fa" strokeWidth="3" /><rect x="438" y={146 + (100 - metrics.surgeLevel)} width="166" height={metrics.surgeLevel} rx="10" fill={darkMode ? '#0ea5e955' : '#38bdf888'} /><text x="442" y="134" fontSize="15" fill={darkMode ? '#e2e8f0' : '#0f172a'} fontWeight="700">Schwallwasserbehaelter</text></g>
              <g onClick={() => chooseStation('pumpe')} style={{ cursor: 'pointer' }}><circle cx="472" cy="404" r="34" fill={darkMode ? '#1f2937' : '#f8fafc'} stroke="#94a3b8" strokeWidth="3" /><circle cx="532" cy="430" r="52" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="4" /><g className={controls.pumpEnabled ? 'wc-impeller' : ''}><line x1="532" y1="412" x2="532" y2="448" stroke="#38bdf8" strokeWidth="4" /><line x1="514" y1="430" x2="550" y2="430" stroke="#38bdf8" strokeWidth="4" /></g>{symptoms.has('pumpBubbles') && <><circle cx="466" cy="402" r="4" fill="#7dd3fc" className="wc-bubble" /><circle cx="479" cy="414" r="3" fill="#67e8f9" className="wc-bubble" style={{ animationDelay: '0.2s' }} /></>}{xrayMode && selectedStationId === 'pumpe' && <circle cx="532" cy="430" r="36" fill="none" stroke="#67e8f9" strokeDasharray="4 4" />}</g>
              <g onClick={() => chooseStation('flockung')} style={{ cursor: 'pointer' }}><rect x="648" y="390" width="72" height="90" rx="8" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="3" /><rect x="728" y="408" width="26" height="44" rx="6" fill={darkMode ? '#334155' : '#cbd5e1'} /></g>
              <g onClick={() => chooseStation('filter')} style={{ cursor: 'pointer' }}><ellipse cx="850" cy="312" rx="52" ry="16" fill={darkMode ? '#334155' : '#cbd5e1'} /><rect x="798" y="312" width="104" height="214" rx="38" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="4" /><ellipse cx="850" cy="526" rx="52" ry="16" fill={darkMode ? '#334155' : '#cbd5e1'} /><circle cx="918" cy="390" r="18" fill={symptoms.has('filterTurbidity') ? '#f59e0b' : '#7dd3fc'} stroke="#0f172a" strokeWidth="3" />{xrayMode && selectedStationId === 'filter' && <><rect x="808" y="320" width="84" height="56" fill="#a3e635aa" /><rect x="808" y="376" width="84" height="72" fill="#facc15aa" /><rect x="808" y="448" width="84" height="68" fill="#f97316aa" /></>}</g>
              <g onClick={() => chooseStation('desinfektion')} style={{ cursor: 'pointer' }}><rect x="976" y="274" width="96" height="110" rx="10" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="3" /><rect x="986" y="286" width="32" height="86" rx="7" fill={darkMode ? '#0f172a' : '#f8fafc'} /><rect x="1028" y="286" width="32" height="86" rx="7" fill={darkMode ? '#0f172a' : '#f8fafc'} /></g>
              <g onClick={() => chooseStation('heizung')} style={{ cursor: 'pointer' }}><rect x="968" y="132" width="102" height="72" rx="10" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="3" /></g>
              <g onClick={() => chooseStation('ruecklauf')} style={{ cursor: 'pointer' }}><rect x="724" y="126" width="84" height="54" rx="8" fill={darkMode ? '#1f2937' : '#e2e8f0'} stroke="#64748b" strokeWidth="3" /></g>
              {[{ key: 'rawValveOpen', x: 520, y: 334, label: 'V1' }, { key: 'returnValveOpen', x: 520, y: 210, label: 'V2' }, { key: 'ventValveOpen', x: 540, y: 366, label: 'V3' }, { key: 'backwashValveOpen', x: 850, y: 548, label: 'V4' }].map((valve) => <g key={valve.key} onClick={() => toggleControl(valve.key)} style={{ cursor: 'pointer' }}><circle cx={valve.x} cy={valve.y} r="14" fill={controls[valve.key] ? '#22c55e' : '#ef4444'} stroke={darkMode ? '#0f172a' : '#fff'} strokeWidth="3" /><text x={valve.x + 20} y={valve.y + 4} fontSize="12" fill={darkMode ? '#cbd5e1' : '#334155'}>{valve.label}</text></g>)}
            </svg>
          </div>
          <div className={`mt-3 rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
            <h3 className="font-black flex items-center gap-2"><Gauge size={16} />Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2"><div className="rounded-lg p-2 bg-cyan-500/10">Q: {metrics.flowRate} m3/h</div><div className="rounded-lg p-2 bg-blue-500/10">P: {metrics.pressureBar} bar</div><div className={`rounded-lg p-2 ${metrics.freeChlorine >= 0.3 ? 'bg-emerald-500/10' : 'bg-red-500/20'}`}>Cl: {metrics.freeChlorine} mg/L</div><div className="rounded-lg p-2 bg-violet-500/10">pH: {metrics.pH}</div><div className="rounded-lg p-2 bg-orange-500/10">T: {metrics.temperature} C</div><div className={`rounded-lg p-2 ${metrics.differentialPressure < 0.8 ? 'bg-amber-500/10' : 'bg-red-500/20'}`}>dP: {metrics.differentialPressure} bar</div><div className="rounded-lg p-2 bg-slate-500/20">Speicher: {metrics.surgeLevel}%</div><div className="rounded-lg p-2 bg-amber-500/10">Rueckspuel: {Math.round(backwashProgress)}%</div></div>
            <div className="grid md:grid-cols-2 gap-2 mt-2 text-xs"><label className="rounded-lg p-2 bg-slate-500/10">Pumpenleistung {controls.pumpPower}%<input type="range" min="20" max="100" value={controls.pumpPower} onChange={(e) => setControl('pumpPower', Number(e.target.value))} className="w-full accent-cyan-500" /></label><label className="rounded-lg p-2 bg-slate-500/10">Cl-Sollwert {controls.disinfectSetpoint}<input type="range" min="1" max="12" value={controls.disinfectSetpoint} onChange={(e) => setControl('disinfectSetpoint', Number(e.target.value))} className="w-full accent-emerald-500" /></label></div>
            <div className="flex flex-wrap gap-2 mt-2"><button onClick={() => toggleControl('pumpEnabled')} className={`px-2.5 py-1 rounded text-xs font-bold ${controls.pumpEnabled ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{controls.pumpEnabled ? 'Pumpe ein' : 'Pumpe aus'}</button><button onClick={() => { toggleControl('backwashMode'); if (!controls.backwashMode) setBackwashProgress(0); }} className={`px-2.5 py-1 rounded text-xs font-bold ${controls.backwashMode ? 'bg-amber-500 text-white' : (darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700')}`}>{controls.backwashMode ? 'Rueckspuel aktiv' : 'Rueckspuel aus'}</button><button onClick={() => toggleControl('disinfectPumpEnabled')} className={`px-2.5 py-1 rounded text-xs font-bold ${controls.disinfectPumpEnabled ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{controls.disinfectPumpEnabled ? 'Dosierpumpe ein' : 'Dosierpumpe aus'}</button></div>
          </div>
        </section>

        <aside className={`rounded-3xl border p-4 shadow-xl space-y-4 ${darkMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-cyan-100 text-slate-900'}`}>
          <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}><p className={`text-xs uppercase tracking-[0.14em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Station {selectedIndex + 1}/{WATER_CYCLE_STATION_ORDER.length}</p><h3 className="text-xl font-black mt-1">{selected.title}</h3><p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selected.summary}</p><div className="mt-2 flex flex-wrap gap-1.5">{WATER_CYCLE_STATION_ORDER.map((id) => <button key={id} onClick={() => chooseStation(id)} className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${id === selectedStationId ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')}`}>{stationMap.get(id)?.shortLabel}</button>)}</div></section>
          <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}><h3 className="font-black flex items-center gap-2"><ListChecks size={16} />Missions-Logbuch</h3><select value={activeMissionId} onChange={(e) => setActiveMissionId(e.target.value)} className={`mt-2 w-full rounded-lg border px-2 py-2 text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}>{WATER_CYCLE_MISSIONS.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select><p className={`text-sm mt-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}><span className="font-semibold">{mission.symptom.title}:</span> {mission.symptom.description}</p><p className="text-xs mt-1"><span className="font-semibold">Ziel:</span> {mission.targetAction}</p><div className="flex gap-2 mt-2"><button onClick={startMission} className="flex-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold py-2">Mission starten</button><button onClick={() => setMissionStates((prev) => ({ ...prev, [activeMissionId]: { ...prev[activeMissionId], status: 'idle', solvedAt: null } }))} className={`rounded-lg px-3 text-sm font-bold ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'}`}>Reset</button></div><div className="mt-2 space-y-1 text-xs">{(mission.solveWhen?.all || []).map((c) => <p key={`${mission.id}-${c.key}-${c.min ?? c.equals ?? 'x'}`} className={conditionOk(c, snapshot) ? 'text-emerald-400' : (darkMode ? 'text-slate-300' : 'text-slate-600')}>{conditionOk(c, snapshot) ? 'OK' : 'Offen'} - {c.key}{Object.prototype.hasOwnProperty.call(c, 'min') ? ` >= ${c.min}` : Object.prototype.hasOwnProperty.call(c, 'equals') ? ` = ${String(c.equals)}` : ''}</p>)}</div><div className="mt-2 space-y-1 text-xs max-h-24 overflow-y-auto">{missionLog.length === 0 && <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Noch keine Eintraege.</p>}{missionLog.map((entry) => <div key={entry.id} className={`rounded p-2 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>{entry.message}<div className={darkMode ? 'text-slate-500' : 'text-slate-400'}>{new Date(entry.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div></div>)}</div></section>
          {showSheet && <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}><h3 className="font-black flex items-center gap-2"><ShieldCheck size={16} />Profi-Spickzettel</h3><div className="mt-2 text-sm space-y-2">{WATER_CYCLE_PROFI_SPICKZETTEL.map((block) => <div key={block.title}><p className="font-semibold">{block.title}</p><ul className="mt-1 space-y-1 text-xs">{block.items.map((item) => <li key={item}>- {item}</li>)}</ul></div>)}</div></section>}
          <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}><h3 className="font-black mb-2">Naechste Module</h3><div className="space-y-2 text-sm">{WATER_CYCLE_FUTURE_MODULES.map((module) => <div key={module.id} className="flex items-center justify-between rounded-lg border border-dashed border-slate-400/40 px-2 py-1.5"><span>{module.label}</span><span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20">{module.status}</span></div>)}</div></section>
          <section className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}><h3 className="font-black mb-1">Anlagenstatus</h3><p className="text-xs flex items-center gap-2"><Activity size={13} className={missionActive ? 'text-amber-400' : 'text-emerald-400'} />{missionActive ? 'Stoerung aktiv' : 'Anlage stabil'}</p><p className="text-xs mt-1 flex items-center gap-2"><AlertTriangle size={13} className={metrics.freeChlorine < 0.3 ? 'text-red-400' : 'text-emerald-400'} />Chlorreserve {metrics.freeChlorine < 0.3 ? 'unter Soll' : 'im Soll'}</p><p className="text-xs mt-1">Versuche: {missionState.attempts}</p></section>
        </aside>
      </div>
    </div>
  );
};

export default WaterCycleView;
