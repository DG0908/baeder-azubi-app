import { Waves, Info } from 'lucide-react';
import { inputClass, selectClass, infoBoxClass, sectionCardClass } from './calculatorUi';

const getHoseOptions = (model) => {
  if (!model || model.pumpTypeId !== 'peristaltic') return [];
  if (Array.isArray(model.hoseOptions) && model.hoseOptions.length > 0) {
    return model.hoseOptions.map((option) => ({
      ...option,
      id: option.id || String(option.innerDiameterMm || option.label || ''),
    }));
  }
  const legacyKeys = Object.keys(model.maxMlHByHose || {});
  return legacyKeys.map((key) => ({
    id: key,
    label: `SK ${key} mm`,
    innerDiameterMm: Number(key) || null,
    minMlH: model.minMlHByHose?.[key] ?? null,
    maxMlH: model.maxMlHByHose?.[key] ?? null,
  }));
};

const getDefaultHoseOptionId = (model) => getHoseOptions(model)[0]?.id || '';

const FlocculationCalculator = ({
  darkMode,
  calculatorInputs,
  setCalculatorInputs,
  setCalculatorResult,
  flocculantProducts,
  flocculantPumpTypes,
  flocculantPumpModels,
}) => {
  const update = (patch) => setCalculatorInputs({ ...calculatorInputs, ...patch });
  const getDefaultPumpModelForType = (pumpTypeId) =>
    flocculantPumpModels.find((model) => model.pumpTypeId === pumpTypeId)?.id || '';

  const selectedPumpTypeId =
    calculatorInputs.flocPumpTypeId || flocculantPumpTypes[0]?.id || 'peristaltic';
  const pumpModelsForType = flocculantPumpModels.filter(
    (model) => model.pumpTypeId === selectedPumpTypeId,
  );
  const selectedPumpModel =
    pumpModelsForType.find((m) => m.id === (calculatorInputs.flocPumpModelId || '')) ||
    pumpModelsForType[0] ||
    null;

  const hoseOptionsForSelectedModel = getHoseOptions(selectedPumpModel);
  const selectedHoseOption =
    hoseOptionsForSelectedModel.find(
      (opt) => opt.id === (calculatorInputs.flocHoseSizeMm || ''),
    ) ||
    hoseOptionsForSelectedModel[0] ||
    null;

  return (
    <div className={sectionCardClass}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-500" />
      <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Waves size={18} className={darkMode ? 'text-cyan-300' : 'text-sky-600'} />
        Flockungsmittel-Einstellung und Dosierung
      </h3>

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <select
          value={calculatorInputs.flocculationMode || 'continuous'}
          onChange={(e) => update({ flocculationMode: e.target.value })}
          className={selectClass(darkMode)}
        >
          <option value="continuous">Kontinuierliche Flockung</option>
          <option value="shock">Stossflockung</option>
        </select>
        <select
          value={calculatorInputs.flocProductId || flocculantProducts[0]?.id || ''}
          onChange={(e) => update({ flocProductId: e.target.value })}
          className={selectClass(darkMode)}
        >
          {flocculantProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <input
          type="text"
          placeholder="Umwälzleistung (m3/h)"
          value={calculatorInputs.circulationFlow || ''}
          onChange={(e) => update({ circulationFlow: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="text"
          placeholder="Beckenvolumen (m3)"
          value={calculatorInputs.poolVolume || ''}
          onChange={(e) => update({ poolVolume: e.target.value })}
          className={inputClass(darkMode)}
        />
        <input
          type="text"
          placeholder="Dosierstunden pro Tag (z.B. 24)"
          value={calculatorInputs.dosingHoursPerDay || ''}
          onChange={(e) => update({ dosingHoursPerDay: e.target.value })}
          className={inputClass(darkMode)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <select
          value={calculatorInputs.loadProfile || 'normal'}
          onChange={(e) => update({ loadProfile: e.target.value })}
          className={selectClass(darkMode)}
        >
          <option value="low">Niedrige Belastung</option>
          <option value="normal">Normale Belastung</option>
          <option value="high">Hohe Belastung</option>
          <option value="peak">Spitzenlast</option>
        </select>
        <select
          value={calculatorInputs.waterCondition || 'normal'}
          onChange={(e) => update({ waterCondition: e.target.value })}
          className={selectClass(darkMode)}
        >
          <option value="clear">Sehr klares Wasser</option>
          <option value="normal">Normales Wasser</option>
          <option value="turbid">Trübung erhöht</option>
          <option value="severe">Stark trüb / Problemfall</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <select
          value={selectedPumpTypeId}
          onChange={(e) => {
            const nextType = e.target.value;
            const nextDefaultModel =
              flocculantPumpModels.find((m) => m.pumpTypeId === nextType) || null;
            update({
              flocPumpTypeId: nextType,
              flocPumpModelId: getDefaultPumpModelForType(nextType),
              flocHoseSizeMm: getDefaultHoseOptionId(nextDefaultModel),
            });
            setCalculatorResult(null);
          }}
          className={selectClass(darkMode)}
        >
          {flocculantPumpTypes.map((pumpType) => (
            <option key={pumpType.id} value={pumpType.id}>
              {pumpType.label}
            </option>
          ))}
        </select>
        <select
          value={calculatorInputs.flocPumpModelId || pumpModelsForType[0]?.id || ''}
          onChange={(e) => {
            const nextModelId = e.target.value;
            const nextModel = pumpModelsForType.find((m) => m.id === nextModelId) || null;
            update({
              flocPumpModelId: nextModelId,
              flocHoseSizeMm: getDefaultHoseOptionId(nextModel),
            });
            setCalculatorResult(null);
          }}
          className={selectClass(darkMode)}
        >
          {pumpModelsForType.map((model) => (
            <option key={model.id} value={model.id}>
              {model.label}
            </option>
          ))}
        </select>
      </div>

      {selectedPumpTypeId === 'peristaltic' && (
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <select
            value={calculatorInputs.flocHoseSizeMm || hoseOptionsForSelectedModel[0]?.id || ''}
            onChange={(e) => update({ flocHoseSizeMm: e.target.value })}
            className={selectClass(darkMode)}
          >
            {hoseOptionsForSelectedModel.map((option) => (
              <option key={option.id} value={option.id}>
                {(option.color ? `${option.color} - ` : '') + option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Ansatzkonzentration (%)"
            value={calculatorInputs.stockConcentrationPercent || ''}
            onChange={(e) => update({ stockConcentrationPercent: e.target.value })}
            className={inputClass(darkMode)}
          />
          <input
            type="text"
            placeholder="Ansatzbehälter (L)"
            value={calculatorInputs.stockTankLiters || ''}
            onChange={(e) => update({ stockTankLiters: e.target.value })}
            className={inputClass(darkMode)}
          />
          {selectedHoseOption && (
            <div
              className={`md:col-span-3 rounded-lg p-3 text-sm ${
                darkMode ? 'bg-white/5 text-cyan-200' : 'bg-white/70 text-cyan-800 border border-gray-200'
              }`}
            >
              Durchfluss Schlauch: {selectedHoseOption.minMlH} – {selectedHoseOption.maxMlH} ml/h
              {Number.isFinite(selectedHoseOption.minPressureBar) &&
                Number.isFinite(selectedHoseOption.maxPressureBar) && (
                  <>
                    {' | Druck: '}
                    {Math.abs(selectedHoseOption.minPressureBar - selectedHoseOption.maxPressureBar) < 0.001
                      ? `${selectedHoseOption.maxPressureBar.toFixed(1).replace('.', ',')} bar`
                      : `${selectedHoseOption.minPressureBar.toFixed(1).replace('.', ',')} – ${selectedHoseOption.maxPressureBar
                          .toFixed(1)
                          .replace('.', ',')} bar`}
                  </>
                )}
            </div>
          )}
        </div>
      )}

      {selectedPumpTypeId !== 'peristaltic' && (
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Ansatzkonzentration (%)"
            value={calculatorInputs.stockConcentrationPercent || ''}
            onChange={(e) => update({ stockConcentrationPercent: e.target.value })}
            className={inputClass(darkMode)}
          />
          <input
            type="text"
            placeholder="Ansatzbehälter (L)"
            value={calculatorInputs.stockTankLiters || ''}
            onChange={(e) => update({ stockTankLiters: e.target.value })}
            className={inputClass(darkMode)}
          />
        </div>
      )}

      <div className={infoBoxClass(darkMode, 'cyan')}>
        <p className="flex items-start gap-2">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <span>
            Tipp: Der Rechner liefert Sollwerte für Produktbedarf, Dosierlösung, Tankreichweite und
            Pumpeneinstellung. Im Alltag Sichtkontrolle, Flockenbild und Filtrationsverhalten
            gegenprüfen.
          </span>
        </p>
      </div>
    </div>
  );
};

export default FlocculationCalculator;
