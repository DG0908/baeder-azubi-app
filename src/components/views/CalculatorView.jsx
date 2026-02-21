import React from 'react';
import { useApp } from '../../context/AppContext';
import { POOL_CHEMICALS, PERIODIC_TABLE } from '../../data/chemistry';

const CalculatorView = ({
  calculatorType,
  setCalculatorType,
  calculatorInputs,
  setCalculatorInputs,
  calculatorResult,
  setCalculatorResult,
  selectedChemical,
  setSelectedChemical,
  selectedElement,
  setSelectedElement,
  performCalculation,
  chlorinationProducts = [],
  antichlorProducts = [],
  flocculantProducts = [],
  flocculantPumpTypes = [],
  flocculantPumpModels = [],
}) => {
  const { darkMode, playSound } = useApp();

  const handleCalculation = () => {
    performCalculation();
  };

  const getDefaultPumpModelForType = (pumpTypeId) => (
    flocculantPumpModels.find((model) => model.pumpTypeId === pumpTypeId)?.id || ''
  );

  const selectedPumpTypeId = calculatorInputs.flocPumpTypeId
    || flocculantPumpTypes[0]?.id
    || 'peristaltic';
  const pumpModelsForType = flocculantPumpModels.filter(
    (model) => model.pumpTypeId === selectedPumpTypeId
  );
  const selectedPumpModel = pumpModelsForType.find(
    (model) => model.id === (calculatorInputs.flocPumpModelId || '')
  ) || pumpModelsForType[0] || null;

  const getHoseOptionsForPumpModel = (model) => {
    if (!model || model.pumpTypeId !== 'peristaltic') return [];

    if (Array.isArray(model.hoseOptions) && model.hoseOptions.length > 0) {
      return model.hoseOptions.map((option) => ({
        ...option,
        id: option.id || String(option.innerDiameterMm || option.label || '')
      }));
    }

    const legacyKeys = Object.keys(model.maxMlHByHose || {});
    return legacyKeys.map((key) => ({
      id: key,
      label: `SK ${key} mm`,
      innerDiameterMm: Number(key) || null,
      minMlH: model.minMlHByHose?.[key] ?? null,
      maxMlH: model.maxMlHByHose?.[key] ?? null
    }));
  };

  const hoseOptionsForSelectedModel = getHoseOptionsForPumpModel(selectedPumpModel);
  const getDefaultHoseOptionIdForPumpModel = (model) => getHoseOptionsForPumpModel(model)[0]?.id || '';
  const selectedHoseOption = hoseOptionsForSelectedModel.find(
    (option) => option.id === (calculatorInputs.flocHoseSizeMm || '')
  ) || hoseOptionsForSelectedModel[0] || null;

  const commonDilutionPresets = [
    { label: '1:2', concentrateParts: '1', ratioValue: '2' },
    { label: '1:3', concentrateParts: '1', ratioValue: '3' },
    { label: '1:4', concentrateParts: '1', ratioValue: '4' },
    { label: '1:5', concentrateParts: '1', ratioValue: '5' },
    { label: '1:10', concentrateParts: '1', ratioValue: '10' },
    { label: '1:20', concentrateParts: '1', ratioValue: '20' },
    { label: '1:50', concentrateParts: '1', ratioValue: '50' },
    { label: '1:100', concentrateParts: '1', ratioValue: '100' }
  ];

  const applyDilutionPreset = (preset) => {
    setCalculatorInputs({
      ...calculatorInputs,
      concentrateParts: preset.concentrateParts,
      ratioValue: preset.ratioValue
    });
    setCalculatorResult(null);
  };

  const isDilutionPresetActive = (preset) => (
    String(calculatorInputs.concentrateParts || '') === preset.concentrateParts
    && String(calculatorInputs.ratioValue || '') === preset.ratioValue
  );

  return (
  <div className="max-w-4xl mx-auto">
    <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        🧮 Praxis-Rechner
      </h2>
      
      <div className="grid md:grid-cols-8 gap-4 mb-6">
        <button
          onClick={() => {
            setCalculatorType('ph');
            setCalculatorInputs({});
            setCalculatorResult(null);
          }}
          className={`p-4 rounded-xl font-bold ${
            calculatorType === 'ph'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          💧 pH-Wert
        </button>
        <button
          onClick={() => {
            setCalculatorType('chlorine');
            setCalculatorInputs({
              chlorineDirection: 'increase',
              chlorineProductId: chlorinationProducts[0]?.id || '',
              chlorineDosingMethod: 'manual',
              chlorinePlantRunHours: '8',
              antichlorProductId: antichlorProducts[0]?.id || ''
            });
            setCalculatorResult(null);
          }}
          className={`p-4 rounded-xl font-bold ${
            calculatorType === 'chlorine'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          ⚗️ Chlor-Bedarf
        </button>
        <button
          onClick={() => {
            setCalculatorType('volume');
            setCalculatorInputs({});
            setCalculatorResult(null);
          }}
          className={`p-4 rounded-xl font-bold ${
            calculatorType === 'volume'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          📏 Beckenvolumen
        </button>
        <button
          onClick={() => {
            setCalculatorType('dilution');
            setCalculatorInputs({
              dilutionMode: 'partToWater',
              concentrateParts: '1',
              ratioValue: '10',
              containerSize: '1',
              containerUnit: 'l',
              containerCount: '1'
            });
            setCalculatorResult(null);
          }}
          className={`p-4 rounded-xl font-bold ${
            calculatorType === 'dilution'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
              : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Mix / Verduennung
        </button>
        <button
          onClick={() => {
            const initialPumpType = flocculantPumpTypes[0]?.id || 'peristaltic';
            const initialPumpModel = flocculantPumpModels.find((model) => model.pumpTypeId === initialPumpType) || null;
            setCalculatorType('flocculation');
            setCalculatorInputs({
              flocculationMode: 'continuous',
              flocProductId: flocculantProducts[0]?.id || '',
              flocPumpTypeId: initialPumpType,
              flocPumpModelId: getDefaultPumpModelForType(initialPumpType),
              flocHoseSizeMm: getDefaultHoseOptionIdForPumpModel(initialPumpModel),
              circulationFlow: '',
              poolVolume: '',
              dosingHoursPerDay: '24',
              stockConcentrationPercent: '1',
              stockTankLiters: '60',
              loadProfile: 'normal',
              waterCondition: 'normal'
            });
            setCalculatorResult(null);
          }}
          className={`p-4 rounded-xl font-bold ${
            calculatorType === 'flocculation'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white'
              : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Flockung
        </button>
        <button
          onClick={() => {
            setCalculatorType('chemicals');
            setCalculatorInputs({});
            setCalculatorResult(null);
          }}
          className={`p-4 rounded-xl font-bold ${
            calculatorType === 'chemicals'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          🧪 Chemikalien
        </button>
        <button
          onClick={() => {
            setCalculatorType('periodic');
            setCalculatorInputs({});
            setCalculatorResult(null);
          }}
          className={`p-4 rounded-xl font-bold ${
            calculatorType === 'periodic'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          ⚛️ Periodensystem
        </button>
        <button
          onClick={() => {
            setCalculatorType('industrialTime');
            setCalculatorInputs({ industrialMode: 'clockToIndustrial' });
            setCalculatorResult(null);
          }}
          className={`p-4 rounded-xl font-bold ${
            calculatorType === 'industrialTime'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
              : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          ⏱️ Industriezeit
        </button>
      </div>

      {calculatorType === 'ph' && (
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-blue-50'} rounded-xl p-6 mb-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-800'}`}>pH-Wert / Säurekapazität berechnen</h3>
          <div className="space-y-3">
            <input
              type="number"
              step="0.1"
              placeholder="Chlor-Wert (mg/L)"
              value={calculatorInputs.chlorine || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, chlorine: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="number"
              placeholder="Alkalinität (mg/L)"
              value={calculatorInputs.alkalinity || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, alkalinity: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Säurekapazität (mmol/L) - Optional"
              value={calculatorInputs.acidCapacity || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, acidCapacity: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <div className={`${darkMode ? 'bg-slate-600' : 'bg-blue-100'} rounded-lg p-3 text-sm`}>
              <p className={darkMode ? 'text-cyan-300' : 'text-blue-800'}>
                💡 <strong>Säurekapazität:</strong> Maß für die Pufferfähigkeit des Wassers. Optimal: 2,0-3,0 mmol/L
              </p>
            </div>
          </div>
        </div>
      )}

      {calculatorType === 'chlorine' && (
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-green-50'} rounded-xl p-6 mb-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>Chlor- / Anti-Chlor-Bedarf</h3>
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setCalculatorInputs({
                    ...calculatorInputs,
                    chlorineDirection: 'increase',
                    chlorineProductId: calculatorInputs.chlorineProductId || chlorinationProducts[0]?.id || '',
                    chlorineDosingMethod: calculatorInputs.chlorineDosingMethod || 'manual'
                  });
                  setCalculatorResult(null);
                }}
                className={`px-4 py-3 rounded-lg font-semibold ${
                  (calculatorInputs.chlorineDirection || 'increase') === 'increase'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : (darkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-white text-gray-800 hover:bg-gray-100')
                }`}
              >
                Hochchloren
              </button>
              <button
                onClick={() => {
                  setCalculatorInputs({
                    ...calculatorInputs,
                    chlorineDirection: 'decrease',
                    antichlorProductId: calculatorInputs.antichlorProductId || antichlorProducts[0]?.id || ''
                  });
                  setCalculatorResult(null);
                }}
                className={`px-4 py-3 rounded-lg font-semibold ${
                  (calculatorInputs.chlorineDirection || 'increase') === 'decrease'
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                    : (darkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-white text-gray-800 hover:bg-gray-100')
                }`}
              >
                Runterchloren (Anti-Chlor)
              </button>
            </div>

            <input
              type="number"
              placeholder="Beckenvolumen (m3)"
              value={calculatorInputs.poolVolume || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, poolVolume: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Aktueller Chlor-Wert (mg/L)"
              value={calculatorInputs.currentChlorine || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, currentChlorine: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Ziel-Chlor-Wert (mg/L)"
              value={calculatorInputs.targetChlorine || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, targetChlorine: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />

            {(calculatorInputs.chlorineDirection || 'increase') === 'increase' && (
              <>
                <select
                  value={calculatorInputs.chlorineProductId || chlorinationProducts[0]?.id || ''}
                  onChange={(e) => setCalculatorInputs({ ...calculatorInputs, chlorineProductId: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
                >
                  {chlorinationProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.label}
                    </option>
                  ))}
                </select>

                <div className="grid md:grid-cols-2 gap-3">
                  <select
                    value={calculatorInputs.chlorineDosingMethod || 'manual'}
                    onChange={(e) => {
                      setCalculatorInputs({ ...calculatorInputs, chlorineDosingMethod: e.target.value });
                      setCalculatorResult(null);
                    }}
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
                  >
                    <option value="manual">Manuelle Zugabe</option>
                    <option value="plant">Dosierung ueber Chloranlage</option>
                  </select>

                  {(calculatorInputs.chlorineDosingMethod || 'manual') === 'plant' && (
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Anlagenlaufzeit (h/Tag)"
                      value={calculatorInputs.chlorinePlantRunHours || ''}
                      onChange={(e) => setCalculatorInputs({ ...calculatorInputs, chlorinePlantRunHours: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                  )}
                </div>
              </>
            )}

            {(calculatorInputs.chlorineDirection || 'increase') === 'decrease' && (
              <select
                value={calculatorInputs.antichlorProductId || antichlorProducts[0]?.id || ''}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, antichlorProductId: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
              >
                {antichlorProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.label}
                  </option>
                ))}
              </select>
            )}

            <div className={`${darkMode ? 'bg-slate-600' : 'bg-green-100'} rounded-lg p-3 text-sm`}>
              <p className={darkMode ? 'text-green-200' : 'text-green-900'}>
                Tipp: Nach jeder Dosierung ausreichend umwaelzen und Kontrollmessung durchfuehren.
              </p>
            </div>
          </div>
        </div>
      )}

      {calculatorType === 'volume' && (

        <div className={`${darkMode ? 'bg-slate-700' : 'bg-purple-50'} rounded-xl p-6 mb-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>Beckenvolumen berechnen</h3>
          <div className="space-y-3">
            <input
              type="number"
              step="0.1"
              placeholder="Länge (m)"
              value={calculatorInputs.length || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, length: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Breite (m)"
              value={calculatorInputs.width || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, width: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Tiefe (m)"
              value={calculatorInputs.depth || ''}
              onChange={(e) => setCalculatorInputs({...calculatorInputs, depth: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
          </div>
        </div>
      )}

      {calculatorType === 'chemicals' && (
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-orange-50'} rounded-xl p-6 mb-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>🧪 Chemische Zusammensetzungen</h3>
          <select
            value={selectedChemical?.name || ''}
            onChange={(e) => {
              const chem = POOL_CHEMICALS.find(c => c.name === e.target.value);
              setSelectedChemical(chem);
              playSound('bubble');
            }}
            className={`w-full px-4 py-3 rounded-lg mb-4 ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
          >
            <option value="">-- Chemikalie wählen --</option>
            {POOL_CHEMICALS.map(chem => (
              <option key={chem.name} value={chem.name}>{chem.name}</option>
            ))}
          </select>
          
          {selectedChemical && (
            <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-6 border-2 ${darkMode ? 'border-orange-500' : 'border-orange-400'}`}>
              <div className="text-center mb-4">
                <h4 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {selectedChemical.name}
                </h4>
                <div className={`text-5xl font-bold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {selectedChemical.formula}
                </div>
              </div>
              <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <p className={`font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                  Verwendung:
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {selectedChemical.use}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {calculatorType === 'periodic' && (
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-indigo-50'} rounded-xl p-6 mb-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>⚛️ Periodensystem der Elemente</h3>
          
          <div className="grid grid-cols-18 gap-1 mb-6 overflow-x-auto">
            {PERIODIC_TABLE.map(element => {
              const colors = {
                'alkali': 'bg-red-500',
                'alkaline-earth': 'bg-orange-500',
                'transition': 'bg-yellow-500',
                'post-transition': 'bg-green-500',
                'metalloid': 'bg-teal-500',
                'nonmetal': 'bg-blue-500',
                'halogen': 'bg-purple-500',
                'noble-gas': 'bg-pink-500',
                'lanthanide': 'bg-cyan-500',
                'actinide': 'bg-lime-500'
              };
              
              const bgColor = colors[element.category] || 'bg-gray-400';
              
              return (
                <button
                  key={element.number}
                  onClick={() => {
                    setSelectedElement(element);
                    playSound('bubble');
                  }}
                  className={`${bgColor} hover:scale-110 transition-transform rounded p-1 text-white text-center cursor-pointer ${
                    selectedElement?.number === element.number ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{
                    gridColumn: element.group,
                    gridRow: element.period,
                    minWidth: '40px'
                  }}
                >
                  <div className="text-[8px] font-bold">{element.number}</div>
                  <div className="text-xs font-bold">{element.symbol}</div>
                </button>
              );
            })}
          </div>

          {selectedElement && (
            <div className={`${darkMode ? 'bg-slate-600 border-indigo-500' : 'bg-white border-indigo-400'} rounded-lg p-6 border-2`}>
              <div className="text-center mb-4">
                <div className={`text-6xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {selectedElement.symbol}
                </div>
                <h4 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {selectedElement.name}
                </h4>
              </div>
              <div className={`grid grid-cols-2 gap-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ordnungszahl</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.number}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Atommasse</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.mass} u</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gruppe</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.group}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Periode</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.period}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Alkalimetalle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Erdalkalimetalle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Übergangsmetalle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nichtmetalle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Halogene</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Edelgase</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Halbmetalle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lanthanoide</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-lime-500 rounded"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actinoide</span>
            </div>
          </div>
        </div>
      )}


      {calculatorType === 'dilution' && (
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-amber-50'} rounded-xl p-6 mb-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>Verduennung / Mischverhaeltnis</h3>

          <div className="mb-4">
            <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-amber-200' : 'text-amber-900'}`}>
              Gaengige Mischverhaeltnisse:
            </div>
            <div className="flex flex-wrap gap-2">
              {commonDilutionPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyDilutionPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isDilutionPresetActive(preset)
                      ? 'bg-amber-500 text-white'
                      : (darkMode ? 'bg-slate-600 text-gray-100 hover:bg-slate-500' : 'bg-white text-gray-700 hover:bg-amber-100')
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
                setCalculatorInputs({ ...calculatorInputs, dilutionMode: 'partToWater' });
                setCalculatorResult(null);
              }}
              className={`px-4 py-3 rounded-lg font-semibold ${
                (calculatorInputs.dilutionMode || 'partToWater') === 'partToWater'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : (darkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-white text-gray-800 hover:bg-gray-100')
              }`}
            >
              1:10 = 1 Teil + 10 Teile Wasser
            </button>
            <button
              onClick={() => {
                setCalculatorInputs({ ...calculatorInputs, dilutionMode: 'partToTotal' });
                setCalculatorResult(null);
              }}
              className={`px-4 py-3 rounded-lg font-semibold ${
                (calculatorInputs.dilutionMode || 'partToWater') === 'partToTotal'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : (darkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-white text-gray-800 hover:bg-gray-100')
              }`}
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
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, concentrateParts: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Teil Gegenwert (z. B. 10)"
              value={calculatorInputs.ratioValue || ''}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, ratioValue: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Behaeltergroesse"
              value={calculatorInputs.containerSize || ''}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, containerSize: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <select
              value={calculatorInputs.containerUnit || 'l'}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, containerUnit: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
            >
              <option value="l">Liter (L)</option>
              <option value="ml">Milliliter (ml)</option>
            </select>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Anzahl Behaelter"
              value={calculatorInputs.containerCount || ''}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, containerCount: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
          </div>

          <div className={`${darkMode ? 'bg-slate-600' : 'bg-amber-100'} rounded-lg p-3 text-sm mt-4`}>
            <p className={darkMode ? 'text-amber-200' : 'text-amber-800'}>
              Hinweis: Beide Interpretationen sind vorhanden, weil 1:10 in der Praxis unterschiedlich genutzt wird.
            </p>
          </div>
        </div>
      )}

      {calculatorType === 'flocculation' && (
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-cyan-50'} rounded-xl p-6 mb-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
            Flockungsmittel-Einstellung und Dosierung
          </h3>

          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <select
              value={calculatorInputs.flocculationMode || 'continuous'}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, flocculationMode: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
            >
              <option value="continuous">Kontinuierliche Flockung</option>
              <option value="shock">Stossflockung</option>
            </select>
            <select
              value={calculatorInputs.flocProductId || flocculantProducts[0]?.id || ''}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, flocProductId: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
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
              placeholder="Umwaelzleistung (m3/h)"
              value={calculatorInputs.circulationFlow || ''}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, circulationFlow: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="text"
              placeholder="Beckenvolumen (m3)"
              value={calculatorInputs.poolVolume || ''}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, poolVolume: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
            <input
              type="text"
              placeholder="Dosierstunden pro Tag (z.B. 24)"
              value={calculatorInputs.dosingHoursPerDay || ''}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, dosingHoursPerDay: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <select
              value={calculatorInputs.loadProfile || 'normal'}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, loadProfile: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
            >
              <option value="low">Niedrige Belastung</option>
              <option value="normal">Normale Belastung</option>
              <option value="high">Hohe Belastung</option>
              <option value="peak">Spitzenlast</option>
            </select>
            <select
              value={calculatorInputs.waterCondition || 'normal'}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, waterCondition: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
            >
              <option value="clear">Sehr klares Wasser</option>
              <option value="normal">Normales Wasser</option>
              <option value="turbid">Truebung erhoeht</option>
              <option value="severe">Stark trueb / Problemfall</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <select
              value={selectedPumpTypeId}
              onChange={(e) => {
                const nextType = e.target.value;
                const nextDefaultModel = flocculantPumpModels.find((model) => model.pumpTypeId === nextType) || null;
                setCalculatorInputs({
                  ...calculatorInputs,
                  flocPumpTypeId: nextType,
                  flocPumpModelId: getDefaultPumpModelForType(nextType),
                  flocHoseSizeMm: getDefaultHoseOptionIdForPumpModel(nextDefaultModel)
                });
                setCalculatorResult(null);
              }}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
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
                const nextModel = pumpModelsForType.find((model) => model.id === nextModelId) || null;
                setCalculatorInputs({
                  ...calculatorInputs,
                  flocPumpModelId: nextModelId,
                  flocHoseSizeMm: getDefaultHoseOptionIdForPumpModel(nextModel)
                });
                setCalculatorResult(null);
              }}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
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
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, flocHoseSizeMm: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border bg-white'}`}
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
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, stockConcentrationPercent: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
              />
              <input
                type="text"
                placeholder="Ansatzbehaelter (L)"
                value={calculatorInputs.stockTankLiters || ''}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, stockTankLiters: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
              />
              {selectedHoseOption && (
                <div className={`md:col-span-3 rounded-lg p-3 text-sm ${darkMode ? 'bg-slate-600 text-cyan-200' : 'bg-white text-cyan-900 border'}`}>
                  Durchfluss Schlauch:
                  {' '}
                  {selectedHoseOption.minMlH}
                  {' '}
                  -
                  {' '}
                  {selectedHoseOption.maxMlH}
                  {' '}
                  ml/h
                  {Number.isFinite(selectedHoseOption.minPressureBar) && Number.isFinite(selectedHoseOption.maxPressureBar) && (
                    <>
                      {' | Druck: '}
                      {Math.abs(selectedHoseOption.minPressureBar - selectedHoseOption.maxPressureBar) < 0.001
                        ? `${selectedHoseOption.maxPressureBar.toFixed(1).replace('.', ',')} bar`
                        : `${selectedHoseOption.minPressureBar.toFixed(1).replace('.', ',')} - ${selectedHoseOption.maxPressureBar.toFixed(1).replace('.', ',')} bar`}
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
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, stockConcentrationPercent: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
              />
              <input
                type="text"
                placeholder="Ansatzbehaelter (L)"
                value={calculatorInputs.stockTankLiters || ''}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, stockTankLiters: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
              />
            </div>
          )}

          <div className={`${darkMode ? 'bg-slate-600' : 'bg-cyan-100'} rounded-lg p-3 text-sm`}>
            <p className={darkMode ? 'text-cyan-200' : 'text-cyan-900'}>
              Tipp: Der Rechner liefert dir Sollwerte fuer Produktbedarf, Dosierloesung, Tankreichweite und Pumpeneinstellung.
              Im Alltag danach Sichtkontrolle, Flockenbild und Filtrationsverhalten gegenpruefen.
            </p>
          </div>
        </div>
      )}

      {calculatorType === 'industrialTime' && (
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-teal-50'} rounded-xl p-6 mb-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-teal-300' : 'text-teal-800'}`}>Industriezeit / Industrieminuten</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => {
                setCalculatorInputs({ industrialMode: 'clockToIndustrial' });
                setCalculatorResult(null);
              }}
              className={`px-4 py-3 rounded-lg font-semibold ${
                (calculatorInputs.industrialMode || 'clockToIndustrial') === 'clockToIndustrial'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  : (darkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-white text-gray-800 hover:bg-gray-100')
              }`}
            >
              Uhrzeit → Industriezeit
            </button>
            <button
              onClick={() => {
                setCalculatorInputs({ industrialMode: 'industrialToClock' });
                setCalculatorResult(null);
              }}
              className={`px-4 py-3 rounded-lg font-semibold ${
                (calculatorInputs.industrialMode || 'clockToIndustrial') === 'industrialToClock'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  : (darkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-white text-gray-800 hover:bg-gray-100')
              }`}
            >
              Industriezeit → Uhrzeit
            </button>
          </div>

          {(calculatorInputs.industrialMode || 'clockToIndustrial') === 'clockToIndustrial' ? (
            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Stunden (z. B. 1)"
                value={calculatorInputs.clockHours || ''}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, clockHours: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
              />
              <input
                type="number"
                min="0"
                max="59"
                step="1"
                placeholder="Minuten (0-59)"
                value={calculatorInputs.clockMinutes || ''}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, clockMinutes: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="Industriestunden (z. B. 1,75)"
              value={calculatorInputs.industrialHours || ''}
              onChange={(e) => setCalculatorInputs({ ...calculatorInputs, industrialHours: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
            />
          )}

          <div className={`${darkMode ? 'bg-slate-600' : 'bg-teal-100'} rounded-lg p-3 text-sm mt-4`}>
            <p className={darkMode ? 'text-teal-200' : 'text-teal-800'}>
              💡 1 Stunde = 60 Realminuten = 100 Industrieminuten.
            </p>
          </div>
        </div>
      )}

      {calculatorType !== 'chemicals' && calculatorType !== 'periodic' && (
        <button
          onClick={handleCalculation}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg mb-6"
        >
          Berechnen 🧮
        </button>
      )}

      {calculatorResult && (
        <div className={`${darkMode ? 'bg-slate-700 border-cyan-600' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300'} border-2 rounded-xl p-6`}>
          <div className={`text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <div className="text-sm font-bold mb-2">ERGEBNIS</div>
            <div className="text-4xl font-bold mb-2">{calculatorResult.result}</div>
          </div>
          <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-4 mb-4`}>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Berechnung:</strong> {calculatorResult.explanation}
            </p>
            {calculatorResult.details && (
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {calculatorResult.details}
              </p>
            )}
            <p className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
              💡 {calculatorResult.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default CalculatorView;
