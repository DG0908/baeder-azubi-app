import { Droplet, Lightbulb } from 'lucide-react';
import { inputClass, infoBoxClass, sectionCardClass } from './calculatorUi';

const PhCalculator = ({ darkMode, calculatorInputs, setCalculatorInputs }) => {
  const update = (patch) => setCalculatorInputs({ ...calculatorInputs, ...patch });

  return (
    <div className={sectionCardClass}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
      <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Droplet size={18} className={darkMode ? 'text-cyan-300' : 'text-blue-600'} />
        pH-Wert / Säurekapazität berechnen
      </h3>
      <div className="space-y-3">
        <input
          type="number"
          step="0.1"
          placeholder="Chlor-Wert (mg/L)"
          value={calculatorInputs.chlorine || ''}
          onChange={(e) => update({ chlorine: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="number"
          placeholder="Alkalinität (mg/L)"
          value={calculatorInputs.alkalinity || ''}
          onChange={(e) => update({ alkalinity: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Säurekapazität (mmol/L) - Optional"
          value={calculatorInputs.acidCapacity || ''}
          onChange={(e) => update({ acidCapacity: e.target.value })}
          className={inputClass(darkMode)}
        />
        <div className={infoBoxClass(darkMode, 'cyan')}>
          <p className="flex items-start gap-2">
            <Lightbulb size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>Säurekapazität:</strong> Maß für die Pufferfähigkeit des Wassers.
              Optimal: 2,0–3,0 mmol/L
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhCalculator;
