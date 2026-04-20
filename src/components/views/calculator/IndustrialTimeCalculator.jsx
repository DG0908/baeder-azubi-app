import { Clock, Lightbulb } from 'lucide-react';
import { inputClass, infoBoxClass, sectionCardClass } from './calculatorUi';

const IndustrialTimeCalculator = ({
  darkMode,
  calculatorInputs,
  setCalculatorInputs,
  setCalculatorResult,
}) => {
  const update = (patch) => setCalculatorInputs({ ...calculatorInputs, ...patch });
  const mode = calculatorInputs.industrialMode || 'clockToIndustrial';

  const modeBtn = (active) =>
    `px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
      active
        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm'
        : darkMode
          ? 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
          : 'bg-white/70 text-gray-700 hover:bg-white border border-gray-200'
    }`;

  return (
    <div className={sectionCardClass}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
      <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Clock size={18} className={darkMode ? 'text-teal-300' : 'text-teal-600'} />
        Industriezeit / Industrieminuten
      </h3>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => {
            setCalculatorInputs({ industrialMode: 'clockToIndustrial' });
            setCalculatorResult(null);
          }}
          className={modeBtn(mode === 'clockToIndustrial')}
        >
          Uhrzeit → Industriezeit
        </button>
        <button
          onClick={() => {
            setCalculatorInputs({ industrialMode: 'industrialToClock' });
            setCalculatorResult(null);
          }}
          className={modeBtn(mode === 'industrialToClock')}
        >
          Industriezeit → Uhrzeit
        </button>
      </div>

      {mode === 'clockToIndustrial' ? (
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Stunden (z. B. 1)"
            value={calculatorInputs.clockHours || ''}
            onChange={(e) => update({ clockHours: e.target.value })}
            className={inputClass(darkMode)}
          />
          <input
            type="number"
            min="0"
            max="59"
            step="1"
            placeholder="Minuten (0–59)"
            value={calculatorInputs.clockMinutes || ''}
            onChange={(e) => update({ clockMinutes: e.target.value })}
            className={inputClass(darkMode)}
          />
        </div>
      ) : (
        <input
          type="text"
          placeholder="Industriestunden (z. B. 1,75)"
          value={calculatorInputs.industrialHours || ''}
          onChange={(e) => update({ industrialHours: e.target.value })}
          className={inputClass(darkMode)}
        />
      )}

      <div className={`${infoBoxClass(darkMode, 'cyan')} mt-4`}>
        <p className="flex items-start gap-2">
          <Lightbulb size={14} className="flex-shrink-0 mt-0.5" />
          <span>1 Stunde = 60 Realminuten = 100 Industrieminuten.</span>
        </p>
      </div>
    </div>
  );
};

export default IndustrialTimeCalculator;
