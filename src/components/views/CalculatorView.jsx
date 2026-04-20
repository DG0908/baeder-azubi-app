import { Calculator } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CalculatorTabs from './calculator/CalculatorTabs';
import CalculatorResult from './calculator/CalculatorResult';
import PhCalculator from './calculator/PhCalculator';
import ChlorineCalculator from './calculator/ChlorineCalculator';
import VolumeCalculator from './calculator/VolumeCalculator';
import ChemicalsCalculator from './calculator/ChemicalsCalculator';
import PeriodicCalculator from './calculator/PeriodicCalculator';
import DilutionCalculator from './calculator/DilutionCalculator';
import FlocculationCalculator from './calculator/FlocculationCalculator';
import IndustrialTimeCalculator from './calculator/IndustrialTimeCalculator';

const getHoseOptionsForPumpModel = (model) => {
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

  const handleSelectType = (nextType) => {
    if (nextType === 'chlorine') {
      setCalculatorInputs({
        chlorineDirection: 'increase',
        chlorineProductId: chlorinationProducts[0]?.id || '',
        chlorineDosingMethod: 'manual',
        chlorinePlantRunHours: '8',
        antichlorProductId: antichlorProducts[0]?.id || '',
      });
    } else if (nextType === 'dilution') {
      setCalculatorInputs({
        dilutionMode: 'partToWater',
        concentrateParts: '1',
        ratioValue: '10',
        containerSize: '1',
        containerUnit: 'l',
        containerCount: '1',
      });
    } else if (nextType === 'flocculation') {
      const initialPumpType = flocculantPumpTypes[0]?.id || 'peristaltic';
      const initialPumpModel =
        flocculantPumpModels.find((m) => m.pumpTypeId === initialPumpType) || null;
      setCalculatorInputs({
        flocculationMode: 'continuous',
        flocProductId: flocculantProducts[0]?.id || '',
        flocPumpTypeId: initialPumpType,
        flocPumpModelId: initialPumpModel?.id || '',
        flocHoseSizeMm: getHoseOptionsForPumpModel(initialPumpModel)[0]?.id || '',
        circulationFlow: '',
        poolVolume: '',
        dosingHoursPerDay: '24',
        stockConcentrationPercent: '1',
        stockTankLiters: '60',
        loadProfile: 'normal',
        waterCondition: 'normal',
      });
    } else if (nextType === 'industrialTime') {
      setCalculatorInputs({ industrialMode: 'clockToIndustrial' });
    } else {
      setCalculatorInputs({});
    }
    setCalculatorType(nextType);
    setCalculatorResult(null);
  };

  const showCalculateButton =
    calculatorType !== 'chemicals' && calculatorType !== 'periodic';

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <CalculatorTabs
        darkMode={darkMode}
        calculatorType={calculatorType}
        onSelectType={handleSelectType}
      />

      {calculatorType === 'ph' && (
        <PhCalculator
          darkMode={darkMode}
          calculatorInputs={calculatorInputs}
          setCalculatorInputs={setCalculatorInputs}
        />
      )}
      {calculatorType === 'chlorine' && (
        <ChlorineCalculator
          darkMode={darkMode}
          calculatorInputs={calculatorInputs}
          setCalculatorInputs={setCalculatorInputs}
          setCalculatorResult={setCalculatorResult}
          chlorinationProducts={chlorinationProducts}
          antichlorProducts={antichlorProducts}
        />
      )}
      {calculatorType === 'volume' && (
        <VolumeCalculator
          darkMode={darkMode}
          calculatorInputs={calculatorInputs}
          setCalculatorInputs={setCalculatorInputs}
        />
      )}
      {calculatorType === 'chemicals' && (
        <ChemicalsCalculator
          darkMode={darkMode}
          selectedChemical={selectedChemical}
          setSelectedChemical={setSelectedChemical}
          playSound={playSound}
        />
      )}
      {calculatorType === 'periodic' && (
        <PeriodicCalculator
          darkMode={darkMode}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          playSound={playSound}
        />
      )}
      {calculatorType === 'dilution' && (
        <DilutionCalculator
          darkMode={darkMode}
          calculatorInputs={calculatorInputs}
          setCalculatorInputs={setCalculatorInputs}
          setCalculatorResult={setCalculatorResult}
        />
      )}
      {calculatorType === 'flocculation' && (
        <FlocculationCalculator
          darkMode={darkMode}
          calculatorInputs={calculatorInputs}
          setCalculatorInputs={setCalculatorInputs}
          setCalculatorResult={setCalculatorResult}
          flocculantProducts={flocculantProducts}
          flocculantPumpTypes={flocculantPumpTypes}
          flocculantPumpModels={flocculantPumpModels}
        />
      )}
      {calculatorType === 'industrialTime' && (
        <IndustrialTimeCalculator
          darkMode={darkMode}
          calculatorInputs={calculatorInputs}
          setCalculatorInputs={setCalculatorInputs}
          setCalculatorResult={setCalculatorResult}
        />
      )}

      {showCalculateButton && (
        <button
          onClick={performCalculation}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Calculator size={18} />
          Berechnen
        </button>
      )}

      <CalculatorResult result={calculatorResult} darkMode={darkMode} />
    </div>
  );
};

export default CalculatorView;
