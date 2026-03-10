import type { SwimStyleData, TechniqueHotspot } from '../types';

interface TechniqueInfoPanelProps {
  styleData: SwimStyleData;
  activeHotspot: TechniqueHotspot | null;
  activePhaseIndex: number;
}

export default function TechniqueInfoPanel({
  styleData,
  activeHotspot,
  activePhaseIndex
}: TechniqueInfoPanelProps) {
  const safePhaseIndex = ((activePhaseIndex % styleData.phases.length) + styleData.phases.length) % styleData.phases.length;
  const activePhase = styleData.phases[safePhaseIndex];

  return (
    <aside className="rounded-2xl border border-slate-700 bg-slate-900/65 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-cyan-100">Technik-Info</h3>
        <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-cyan-500/15 border border-cyan-500/40 text-cyan-100">
          {activePhase.label}
        </span>
      </div>
      <p className="text-[12px] text-slate-300 mt-1">{activePhase.description}</p>

      {!activeHotspot && (
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/60 p-3">
          <p className="text-sm font-semibold text-slate-100">Hotspot auswaehlen</p>
          <p className="text-xs text-slate-300 mt-1">
            Tippe auf einen Marker im Modell, um Erklaerungen, typische Fehler und Praxistipps zu sehen.
          </p>
        </div>
      )}

      {activeHotspot && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
            <p className="text-sm font-bold text-white">{activeHotspot.title}</p>
            <p className="text-xs text-slate-200 mt-1">{activeHotspot.explanation}</p>
            {activeHotspot.phaseHint && (
              <p className="text-[11px] text-cyan-200 mt-2">
                Phase-Hinweis: {activeHotspot.phaseHint}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-rose-700/40 bg-rose-900/15 p-3">
            <p className="text-xs font-bold text-rose-200">Typische Fehler</p>
            <ul className="mt-1 space-y-1">
              {activeHotspot.mistakes.map((mistake) => (
                <li key={mistake} className="text-xs text-rose-100">
                  - {mistake}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-emerald-700/40 bg-emerald-900/15 p-3">
            <p className="text-xs font-bold text-emerald-200">Praxistipp</p>
            <p className="text-xs text-emerald-100 mt-1">{activeHotspot.tip}</p>
          </div>
        </div>
      )}
    </aside>
  );
}

