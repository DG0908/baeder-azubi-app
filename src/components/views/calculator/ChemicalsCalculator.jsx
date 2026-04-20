import { TestTube } from 'lucide-react';
import { POOL_CHEMICALS } from '../../../data/chemistry';
import { selectClass, sectionCardClass } from './calculatorUi';

const ChemicalsCalculator = ({
  darkMode,
  selectedChemical,
  setSelectedChemical,
  playSound,
}) => (
  <div className={sectionCardClass}>
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500" />
    <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
      <TestTube size={18} className={darkMode ? 'text-orange-300' : 'text-orange-600'} />
      Chemische Zusammensetzungen
    </h3>
    <select
      value={selectedChemical?.name || ''}
      onChange={(e) => {
        const chem = POOL_CHEMICALS.find((c) => c.name === e.target.value);
        setSelectedChemical(chem);
        playSound('bubble');
      }}
      className={`${selectClass(darkMode)} mb-4`}
    >
      <option value="">-- Chemikalie wählen --</option>
      {POOL_CHEMICALS.map((chem) => (
        <option key={chem.name} value={chem.name}>
          {chem.name}
        </option>
      ))}
    </select>

    {selectedChemical && (
      <div
        className={`rounded-xl p-6 border-2 ${
          darkMode
            ? 'bg-white/5 border-orange-500/50'
            : 'bg-white/70 border-orange-400'
        }`}
      >
        <div className="text-center mb-4">
          <h4 className="text-2xl font-bold mb-2 text-gray-800">{selectedChemical.name}</h4>
          <div className={`text-5xl font-bold mb-4 ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
            {selectedChemical.formula}
          </div>
        </div>
        <div
          className={`rounded-lg p-4 ${
            darkMode ? 'bg-white/5' : 'bg-white/60 border border-gray-200'
          }`}
        >
          <p className={`font-bold mb-2 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
            Verwendung:
          </p>
          <p className="text-gray-700">{selectedChemical.use}</p>
        </div>
      </div>
    )}
  </div>
);

export default ChemicalsCalculator;
