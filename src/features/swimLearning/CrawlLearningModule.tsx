import { useMemo, useState } from 'react';
import ModuleControls from './components/ModuleControls';
import PoolScene from './components/PoolScene';
import TechniqueInfoPanel from './components/TechniqueInfoPanel';
import { SWIM_STYLES } from './data/styles';
import type { SpeedPreset, ViewPreset } from './types';

interface CrawlLearningModuleProps {
  darkMode?: boolean;
}

export default function CrawlLearningModule({ darkMode = true }: CrawlLearningModuleProps) {
  const styleData = useMemo(() => SWIM_STYLES['freestyle/crawl'], []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speedPreset, setSpeedPreset] = useState<SpeedPreset>('normal');
  const [viewPreset, setViewPreset] = useState<ViewPreset>('side');
  const [showTechniqueAreas, setShowTechniqueAreas] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [phaseMode, setPhaseMode] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [activeCyclePhase, setActiveCyclePhase] = useState(0);

  const activeHotspot = useMemo(
    () => styleData.hotspots.find((hotspot) => hotspot.id === activeHotspotId) ?? null,
    [activeHotspotId, styleData.hotspots]
  );

  const panelPhaseIndex = phaseMode ? phaseIndex : activeCyclePhase;

  return (
    <div className="space-y-4">
      <section
        className={`rounded-2xl border p-4 md:p-5 ${
          darkMode ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-cyan-100' : 'text-cyan-700'}`}>
              Kraulschwimmen - Interaktives 3D Lernmodul
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Stil: <span className="font-semibold">{styleData.id}</span> - {styleData.subtitle}
            </p>
          </div>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold border bg-cyan-500/10 border-cyan-500/40 text-cyan-100 self-start">
            Premium EdTech Ansicht
          </span>
        </div>

        <div className="mt-4">
          <ModuleControls
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying((value) => !value)}
            speedPreset={speedPreset}
            onSpeedChange={setSpeedPreset}
            viewPreset={viewPreset}
            onViewChange={setViewPreset}
            showTechniqueAreas={showTechniqueAreas}
            onToggleTechniqueAreas={() => setShowTechniqueAreas((value) => !value)}
            showHotspots={showHotspots}
            onToggleHotspots={() => setShowHotspots((value) => !value)}
            phaseMode={phaseMode}
            onTogglePhaseMode={() => setPhaseMode((value) => !value)}
            phaseIndex={phaseIndex}
            phaseCount={styleData.phases.length}
            onPrevPhase={() => setPhaseIndex((value) => (value - 1 + styleData.phases.length) % styleData.phases.length)}
            onNextPhase={() => setPhaseIndex((value) => (value + 1) % styleData.phases.length)}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <PoolScene
          styleData={styleData}
          isPlaying={isPlaying}
          speedPreset={speedPreset}
          phaseMode={phaseMode}
          phaseIndex={phaseIndex}
          viewPreset={viewPreset}
          showTechniqueAreas={showTechniqueAreas}
          showHotspots={showHotspots}
          activeHotspotId={activeHotspotId}
          onSelectHotspot={setActiveHotspotId}
          onPhaseChange={setActiveCyclePhase}
        />
        <TechniqueInfoPanel
          styleData={styleData}
          activeHotspot={activeHotspot}
          activePhaseIndex={panelPhaseIndex}
        />
      </section>

      <section className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-sm font-bold mb-2 ${darkMode ? 'text-cyan-100' : 'text-cyan-700'}`}>Phasenueberblick</h3>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {styleData.phases.map((phase, index) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => {
                setPhaseMode(true);
                setPhaseIndex(index);
              }}
              className={`text-left rounded-lg border p-2 transition-colors ${
                panelPhaseIndex === index
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-50'
                  : darkMode
                    ? 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-slate-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-white'
              }`}
            >
              <p className="text-xs font-semibold">{phase.label}</p>
              <p className="text-[11px] mt-1 opacity-85">{phase.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
