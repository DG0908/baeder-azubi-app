import { Ruler } from 'lucide-react';
import { inputClass, sectionCardClass } from './calculatorUi';

const VolumeCalculator = ({ darkMode, calculatorInputs, setCalculatorInputs }) => {
  const update = (patch) => setCalculatorInputs({ ...calculatorInputs, ...patch });
  return (
    <div className={sectionCardClass}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
      <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Ruler size={18} className={darkMode ? 'text-purple-300' : 'text-purple-600'} />
        Beckenvolumen berechnen
      </h3>
      <div className="space-y-3">
        <input
          type="number"
          step="0.1"
          placeholder="Länge (m)"
          value={calculatorInputs.length || ''}
          onChange={(e) => update({ length: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Breite (m)"
          value={calculatorInputs.width || ''}
          onChange={(e) => update({ width: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Tiefe (m)"
          value={calculatorInputs.depth || ''}
          onChange={(e) => update({ depth: e.target.value })}
          className={inputClass(darkMode)}
        />
      </div>
    </div>
  );
};

export default VolumeCalculator;
