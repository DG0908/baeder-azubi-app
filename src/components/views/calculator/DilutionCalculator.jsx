import { Beaker, Info } from 'lucide-react';
import { inputClass, selectClass, infoBoxClass, sectionCardClass } from './calculatorUi';

const PRESETS = [
  { label: '1:2', concentrateParts: '1', ratioValue: '2' },
  { label: '1:3', concentrateParts: '1', ratioValue: '3' },
  { label: '1:4', concentrateParts: '1', ratioValue: '4' },
  { label: '1:5', concentrateParts: '1', ratioValue: '5' },
  { label: '1:10', concentrateParts: '1', ratioValue: '10' },
  { label: '1:20', concentrateParts: '1', ratioValue: '20' },
  { label: '1:50', concentrateParts: '1', ratioValue: '50' },
  { label: '1:100', concentrateParts: '1', ratioValue: '100' },
];

const DilutionCalculator = ({
  darkMode,
  calculatorInputs,
  setCalculatorInputs,
  setCalculatorResult,
}) => {
  const update = (patch) => setCalculatorInputs({ ...calculatorInputs, ...patch });
  const mode = calculatorInputs.dilutionMode || 'partToWater';

  const isPresetActive = (preset) =>
    String(calculatorInputs.concentrateParts || '') === preset.concentrateParts &&
    String(calculatorInputs.ratioValue || '') === preset.ratioValue;

  const applyPreset = (preset) => {
    update({ concentrateParts: preset.concentrateParts, ratioValue: preset.ratioValue });
    setCalculatorResult(null);
  };

  const modeBtn = (active) =>
    `px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
      active
        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
        : darkMode
          ? 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
          : 'bg-white/70 text-gray-700 hover:bg-white border border-gray-200'
    }`;

  return (
    <div className={sectionCardClass}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
      <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Beaker size={18} className={darkMode ? 'text-amber-300' : 'text-amber-600'} />
        Verdünnung / Mischverhältnis
      </h3>

      <div className="mb-4">
        <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>
          Gängige Mischverhältnisse:
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                isPresetActive(preset)
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                  : darkMode
                    ? 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
                    : 'bg-white/70 text-gray-700 hover:bg-white border border-gray-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => {
            update({ dilutionMode: 'partToWater' });
            setCalculatorResult(null);
          }}
          className={modeBtn(mode === 'partToWater')}
        >
          1:10 = 1 Teil + 10 Teile Wasser
        </button>
        <button
          onClick={() => {
            update({ dilutionMode: 'partToTotal' });
            setCalculatorResult(null);
          }}
          className={modeBtn(mode === 'partToTotal')}
        >
          1:10 = 1 Teil in 10 Teilen gesamt
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="Teil Konzentrat (z. B. 1)"
          value={calculatorInputs.concentrateParts || ''}
          onChange={(e) => update({ concentrateParts: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="Teil Gegenwert (z. B. 10)"
          value={calculatorInputs.ratioValue || ''}
          onChange={(e) => update({ ratioValue: e.target.value })}
          className={inputClass(darkMode)}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="Behältergröße"
          value={calculatorInputs.containerSize || ''}
          onChange={(e) => update({ containerSize: e.target.value })}
          className={inputClass(darkMode)}
        />
        <select
          value={calculatorInputs.containerUnit || 'l'}
          onChange={(e) => update({ containerUnit: e.target.value })}
          className={selectClass(darkMode)}
        >
          <option value="l">Liter (L)</option>
          <option value="ml">Milliliter (ml)</option>
        </select>
        <input
          type="number"
          min="1"
          step="1"
          placeholder="Anzahl Behälter"
          value={calculatorInputs.containerCount || ''}
          onChange={(e) => update({ containerCount: e.target.value })}
          className={inputClass(darkMode)}
        />
      </div>

      <div className={infoBoxClass(darkMode, 'amber')}>
        <p className="flex items-start gap-2">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <span>
            Hinweis: Beide Interpretationen sind vorhanden, weil 1:10 in der Praxis unterschiedlich
            genutzt wird.
          </span>
        </p>
      </div>
    </div>
  );
};

export default DilutionCalculator;
