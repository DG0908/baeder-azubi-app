import type { ReactNode } from 'react';
import type { SpeedPreset, ViewPreset } from '../types';

interface ModuleControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speedPreset: SpeedPreset;
  onSpeedChange: (speed: SpeedPreset) => void;
  viewPreset: ViewPreset;
  onViewChange: (view: ViewPreset) => void;
  showTechniqueAreas: boolean;
  onToggleTechniqueAreas: () => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
  phaseMode: boolean;
  onTogglePhaseMode: () => void;
  phaseIndex: number;
  phaseCount: number;
  onPrevPhase: () => void;
  onNextPhase: () => void;
}

const SPEED_OPTIONS: SpeedPreset[] = ['slow', 'normal', 'fast'];
const VIEW_OPTIONS: ViewPreset[] = ['front', 'side', 'top', 'free'];

const speedLabel = (value: SpeedPreset) => {
  if (value === 'slow') return 'Langsam';
  if (value === 'fast') return 'Schnell';
  return 'Normal';
};

const viewLabel = (value: ViewPreset) => {
  if (value === 'front') return 'Vorne';
  if (value === 'side') return 'Seite';
  if (value === 'top') return 'Oben';
  return 'Frei';
};

function SegmentedButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        active
          ? 'bg-cyan-500/20 text-cyan-100 border-cyan-400/60'
          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

export default function ModuleControls({
  isPlaying,
  onTogglePlay,
  speedPreset,
  onSpeedChange,
  viewPreset,
  onViewChange,
  showTechniqueAreas,
  onToggleTechniqueAreas,
  showHotspots,
  onToggleHotspots,
  phaseMode,
  onTogglePhaseMode,
  phaseIndex,
  phaseCount,
  onPrevPhase,
  onNextPhase
}: ModuleControlsProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/65 p-4 backdrop-blur-sm space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onTogglePlay}
          className="px-3 py-2 rounded-lg text-sm font-bold border border-cyan-400/50 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
        >
          {isPlaying ? 'Animation stoppen' : 'Animation starten'}
        </button>

        <button
          type="button"
          onClick={onTogglePhaseMode}
          className={`px-3 py-2 rounded-lg text-sm font-bold border ${
            phaseMode
              ? 'border-violet-400/60 bg-violet-500/20 text-violet-100'
              : 'border-slate-700 bg-slate-800 text-slate-200'
          }`}
        >
          Phasenmodus
        </button>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Geschwindigkeit</p>
        <div className="flex flex-wrap gap-2">
          {SPEED_OPTIONS.map((option) => (
            <SegmentedButton
              key={option}
              active={speedPreset === option}
              onClick={() => onSpeedChange(option)}
            >
              {speedLabel(option)}
            </SegmentedButton>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Kamera</p>
        <div className="flex flex-wrap gap-2">
          {VIEW_OPTIONS.map((option) => (
            <SegmentedButton
              key={option}
              active={viewPreset === option}
              onClick={() => onViewChange(option)}
            >
              {viewLabel(option)}
            </SegmentedButton>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <SegmentedButton active={showTechniqueAreas} onClick={onToggleTechniqueAreas}>
          Technikbereiche
        </SegmentedButton>
        <SegmentedButton active={showHotspots} onClick={onToggleHotspots}>
          Hotspots
        </SegmentedButton>
      </div>

      {phaseMode && (
        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-2">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onPrevPhase}
              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-700 text-slate-100 hover:bg-slate-600"
            >
              Vorherige
            </button>
            <span className="text-xs text-slate-200">
              Phase {((phaseIndex % phaseCount) + phaseCount) % phaseCount + 1} / {phaseCount}
            </span>
            <button
              type="button"
              onClick={onNextPhase}
              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-700 text-slate-100 hover:bg-slate-600"
            >
              Naechste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
