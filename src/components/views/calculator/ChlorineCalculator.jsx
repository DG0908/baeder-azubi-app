import { FlaskConical, Info } from 'lucide-react';
import { inputClass, selectClass, infoBoxClass, sectionCardClass } from './calculatorUi';

const ChlorineCalculator = ({
  darkMode,
  calculatorInputs,
  setCalculatorInputs,
  setCalculatorResult,
  chlorinationProducts,
  antichlorProducts,
}) => {
  const update = (patch) => setCalculatorInputs({ ...calculatorInputs, ...patch });
  const direction = calculatorInputs.chlorineDirection || 'increase';
  const dosingMethod = calculatorInputs.chlorineDosingMethod || 'manual';

  const modeBtnClass = (active, gradient) =>
    `px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
      active
        ? `bg-gradient-to-r ${gradient} text-white shadow-sm`
        : darkMode
          ? 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
          : 'bg-white/70 text-gray-700 hover:bg-white border border-gray-200'
    }`;

  return (
    <div className={sectionCardClass}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
      <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
        <FlaskConical size={18} className={darkMode ? 'text-emerald-300' : 'text-green-600'} />
        Chlor- / Anti-Chlor-Bedarf
      </h3>
      <div className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              update({
                chlorineDirection: 'increase',
                chlorineProductId:
                  calculatorInputs.chlorineProductId || chlorinationProducts[0]?.id || '',
                chlorineDosingMethod: calculatorInputs.chlorineDosingMethod || 'manual',
              });
              setCalculatorResult(null);
            }}
            className={modeBtnClass(direction === 'increase', 'from-green-500 to-emerald-500')}
          >
            Hochchloren
          </button>
          <button
            onClick={() => {
              update({
                chlorineDirection: 'decrease',
                antichlorProductId:
                  calculatorInputs.antichlorProductId || antichlorProducts[0]?.id || '',
              });
              setCalculatorResult(null);
            }}
            className={modeBtnClass(direction === 'decrease', 'from-rose-500 to-orange-500')}
          >
            Runterchloren (Anti-Chlor)
          </button>
        </div>

        <input
          type="number"
          placeholder="Beckenvolumen (m3)"
          value={calculatorInputs.poolVolume || ''}
          onChange={(e) => update({ poolVolume: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Aktueller Chlor-Wert (mg/L)"
          value={calculatorInputs.currentChlorine || ''}
          onChange={(e) => update({ currentChlorine: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Ziel-Chlor-Wert (mg/L)"
          value={calculatorInputs.targetChlorine || ''}
          onChange={(e) => update({ targetChlorine: e.target.value })}
          className={inputClass(darkMode)}
        />

        {direction === 'increase' && (
          <>
            <select
              value={calculatorInputs.chlorineProductId || chlorinationProducts[0]?.id || ''}
              onChange={(e) => update({ chlorineProductId: e.target.value })}
              className={selectClass(darkMode)}
            >
              {chlorinationProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.label}
                </option>
              ))}
            </select>

            <div className="grid md:grid-cols-2 gap-3">
              <select
                value={dosingMethod}
                onChange={(e) => {
                  update({ chlorineDosingMethod: e.target.value });
                  setCalculatorResult(null);
                }}
                className={selectClass(darkMode)}
              >
                <option value="manual">Manuelle Zugabe</option>
                <option value="plant">Dosierung über Chloranlage</option>
              </select>

              {dosingMethod === 'plant' && (
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="Anlagenlaufzeit (h/Tag)"
                  value={calculatorInputs.chlorinePlantRunHours || ''}
                  onChange={(e) => update({ chlorinePlantRunHours: e.target.value })}
                  className={inputClass(darkMode)}
                />
              )}
            </div>
          </>
        )}

        {direction === 'decrease' && (
          <select
            value={calculatorInputs.antichlorProductId || antichlorProducts[0]?.id || ''}
            onChange={(e) => update({ antichlorProductId: e.target.value })}
            className={selectClass(darkMode)}
          >
            {antichlorProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.label}
              </option>
            ))}
          </select>
        )}

        <div className={infoBoxClass(darkMode, 'emerald')}>
          <p className="flex items-start gap-2">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <span>Tipp: Nach jeder Dosierung ausreichend umwälzen und Kontrollmessung durchführen.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChlorineCalculator;
