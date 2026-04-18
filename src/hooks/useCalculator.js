import { useState } from 'react';
import {
  calculatePH,
  calculateChlorine,
  calculateVolume,
  calculateIndustrialTime,
  calculateDilution,
  calculateFlocculation,
} from '../lib/poolCalc';

const CALCULATORS = {
  ph: calculatePH,
  chlorine: calculateChlorine,
  volume: calculateVolume,
  industrialTime: calculateIndustrialTime,
  dilution: calculateDilution,
  flocculation: calculateFlocculation,
};

export function useCalculator({ playSound }) {
  const [calculatorType, setCalculatorType] = useState('ph');
  const [calculatorInputs, setCalculatorInputs] = useState({});
  const [calculatorResult, setCalculatorResult] = useState(null);

  const handleCalculation = () => {
    const calc = CALCULATORS[calculatorType];
    const result = calc ? calc(calculatorInputs) : null;
    setCalculatorResult(result);
    if (result) playSound('correct');
  };

  return {
    calculatorType, setCalculatorType,
    calculatorInputs, setCalculatorInputs,
    calculatorResult, setCalculatorResult,
    handleCalculation,
  };
}
