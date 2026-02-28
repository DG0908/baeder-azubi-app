import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  WATER_CYCLE_STATIONS,
  WATER_CYCLE_STATION_ORDER,
  WATER_CYCLE_FLOW
} from '../../data/waterCycle';

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 680;

const WaterCycleView = () => {
  const { darkMode, playSound } = useApp();
  const [selectedStationId, setSelectedStationId] = useState(WATER_CYCLE_STATION_ORDER[0]);
  const [autoFlowEnabled, setAutoFlowEnabled] = useState(false);

  const stationById = useMemo(() => {
    const map = new Map();
    WATER_CYCLE_STATIONS.forEach((station) => map.set(station.id, station));
    return map;
  }, []);

  const selectedIndex = Math.max(0, WATER_CYCLE_STATION_ORDER.indexOf(selectedStationId));
  const selectedStation = stationById.get(selectedStationId) || WATER_CYCLE_STATIONS[0];

  const flowSegments = useMemo(() => {
    return WATER_CYCLE_FLOW.slice(0, -1)
      .map((fromId, index) => {
        const toId = WATER_CYCLE_FLOW[index + 1];
        const from = stationById.get(fromId);
        const to = stationById.get(toId);
        if (!from || !to) return null;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const controlX = from.x + dx * 0.5;
        const controlY = from.y + dy * 0.5 + (Math.abs(dx) > Math.abs(dy) ? -dx * 0.16 : dy * 0.16);

        return {
          id: `${fromId}-${toId}`,
          index,
          path: `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`
        };
      })
      .filter(Boolean);
  }, [stationById]);

  useEffect(() => {
    if (!autoFlowEnabled) return undefined;

    const timer = window.setInterval(() => {
      setSelectedStationId((prev) => {
        const currentIndex = WATER_CYCLE_STATION_ORDER.indexOf(prev);
        const nextIndex = (currentIndex + 1) % WATER_CYCLE_STATION_ORDER.length;
        return WATER_CYCLE_STATION_ORDER[nextIndex];
      });
    }, 3200);

    return () => window.clearInterval(timer);
  }, [autoFlowEnabled]);

  const jumpToStation = (id) => {
    setSelectedStationId(id);
    playSound('splash');
  };

  const selectPrevious = () => {
    const nextIndex = (selectedIndex - 1 + WATER_CYCLE_STATION_ORDER.length) % WATER_CYCLE_STATION_ORDER.length;
    jumpToStation(WATER_CYCLE_STATION_ORDER[nextIndex]);
  };

  const selectNext = () => {
    const nextIndex = (selectedIndex + 1) % WATER_CYCLE_STATION_ORDER.length;
    jumpToStation(WATER_CYCLE_STATION_ORDER[nextIndex]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <style>
        {`
          @keyframes waterCycleDash {
            to { stroke-dashoffset: -96; }
          }
          @keyframes waterCyclePulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.35); }
            50% { transform: scale(1.06); box-shadow: 0 0 0 16px rgba(56, 189, 248, 0); }
          }
          .waterCycleLineAnimated {
            stroke-dasharray: 14 10;
            animation: waterCycleDash 2.8s linear infinite;
          }
          .waterCycleNodeActive {
            animation: waterCyclePulse 2.1s ease-in-out infinite;
          }
        `}
      </style>

      <section
        className={`rounded-3xl border p-6 shadow-xl ${
          darkMode
            ? 'bg-slate-900/80 border-slate-700 text-white'
            : 'bg-white/95 border-cyan-100 text-slate-900'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
              Inaktives Lernen
            </p>
            <h2 className="text-3xl font-black mt-1">Interaktiver Wasserkreislauf</h2>
            <p className={`mt-2 max-w-3xl text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Klicke durch jede Station der Aufbereitung: vom Becken ueber Schwallwasser, Pumpe, Flockung,
              Filter und Desinfektion bis zum Ruecklauf ins Becken.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={selectPrevious}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                darkMode
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft size={16} />
              Zurueck
            </button>
            <button
              onClick={() => setAutoFlowEnabled((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                autoFlowEnabled
                  ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                  : darkMode
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {autoFlowEnabled ? <Pause size={16} /> : <Play size={16} />}
              {autoFlowEnabled ? 'Auto-Stopp' : 'Auto-Erklaerung'}
            </button>
            <button
              onClick={selectNext}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                darkMode
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Weiter
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="grid xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)] gap-4">
        <section
          className={`rounded-3xl border p-4 shadow-xl ${
            darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/95 border-cyan-100'
          }`}
        >
          <div className="overflow-x-auto">
            <div
              className={`relative min-w-[860px] h-[560px] rounded-2xl overflow-hidden ${
                darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-cyan-50 via-white to-emerald-50'
              }`}
            >
              <div className="absolute -top-20 -left-14 w-64 h-64 rounded-full bg-cyan-300/20 blur-2xl" />
              <div className="absolute -bottom-24 -right-12 w-80 h-80 rounded-full bg-emerald-300/20 blur-2xl" />

              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                role="img"
                aria-label="Wasserkreislauf im Schwimmbad"
              >
                <defs>
                  <linearGradient id="waterCycleBaseLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={darkMode ? '#1e293b' : '#bae6fd'} />
                    <stop offset="100%" stopColor={darkMode ? '#0f172a' : '#cffafe'} />
                  </linearGradient>
                  <linearGradient id="waterCycleFlowLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>

                {flowSegments.map((segment) => (
                  <g key={segment.id}>
                    <path
                      d={segment.path}
                      fill="none"
                      stroke="url(#waterCycleBaseLine)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity={0.75}
                    />
                    <path
                      d={segment.path}
                      fill="none"
                      stroke="url(#waterCycleFlowLine)"
                      strokeWidth={segment.index <= selectedIndex ? '7' : '4'}
                      strokeLinecap="round"
                      className={segment.index <= selectedIndex || autoFlowEnabled ? 'waterCycleLineAnimated' : ''}
                      opacity={segment.index <= selectedIndex ? 1 : 0.35}
                    />
                  </g>
                ))}
              </svg>

              {WATER_CYCLE_STATIONS.map((station, index) => {
                const isActive = station.id === selectedStationId;
                const isPassed = index <= selectedIndex;
                const left = `${(station.x / VIEWBOX_WIDTH) * 100}%`;
                const top = `${(station.y / VIEWBOX_HEIGHT) * 100}%`;

                return (
                  <button
                    key={station.id}
                    onClick={() => jumpToStation(station.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3 py-2 text-left transition ${
                      isActive
                        ? `waterCycleNodeActive border-cyan-300 ${darkMode ? 'bg-cyan-500/20 text-cyan-100' : 'bg-cyan-500 text-white'}`
                        : isPassed
                          ? darkMode
                            ? 'border-cyan-900 bg-slate-800 text-slate-100 hover:bg-slate-700'
                            : 'border-cyan-200 bg-white text-slate-700 hover:bg-cyan-50'
                          : darkMode
                            ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                            : 'border-slate-200 bg-white/90 text-slate-600 hover:bg-slate-50'
                    }`}
                    style={{ left, top, width: '12.4rem' }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] opacity-80">{station.shortLabel}</p>
                    <p className="text-sm font-black leading-tight mt-0.5">
                      {station.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {WATER_CYCLE_STATION_ORDER.map((stationId, index) => {
              const station = stationById.get(stationId);
              if (!station) return null;
              const active = stationId === selectedStationId;
              return (
                <button
                  key={stationId}
                  onClick={() => jumpToStation(stationId)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-cyan-500 text-white'
                      : darkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}. {station.title}
                </button>
              );
            })}
          </div>
        </section>

        <aside
          className={`rounded-3xl border p-5 shadow-xl ${
            darkMode ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-white/95 border-cyan-100 text-slate-900'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-xs uppercase tracking-[0.16em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                Station {selectedIndex + 1} von {WATER_CYCLE_STATION_ORDER.length}
              </p>
              <h3 className="text-2xl font-black mt-1">{selectedStation.title}</h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {selectedStation.summary}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                darkMode ? 'bg-cyan-900/60 text-cyan-200' : 'bg-cyan-100 text-cyan-800'
              }`}
            >
              {selectedStation.shortLabel}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className={`text-sm font-black uppercase tracking-[0.12em] ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                Was passiert hier?
              </h4>
              <ul className="mt-2 space-y-1.5">
                {selectedStation.functionPoints.map((point) => (
                  <li key={point} className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    • {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`text-sm font-black uppercase tracking-[0.12em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                Wichtige Sollwerte
              </h4>
              <div className="mt-2 grid sm:grid-cols-2 gap-2">
                {selectedStation.targetValues.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl border p-2.5 ${
                      darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <p className={`text-[11px] uppercase tracking-[0.08em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-black uppercase tracking-[0.12em] ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                Typische Stoerbilder
              </h4>
              <ul className="mt-2 space-y-1.5">
                {selectedStation.faultSignals.map((point) => (
                  <li key={point} className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    • {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`text-sm font-black uppercase tracking-[0.12em] ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-700'}`}>
                Praxis-Check
              </h4>
              <ul className="mt-2 space-y-1.5">
                {selectedStation.practiceChecks.map((point) => (
                  <li key={point} className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    • {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WaterCycleView;
