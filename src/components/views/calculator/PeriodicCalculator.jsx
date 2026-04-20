import { Atom } from 'lucide-react';
import { PERIODIC_TABLE } from '../../../data/chemistry';
import { sectionCardClass } from './calculatorUi';

const CATEGORY_COLORS = {
  alkali: 'bg-red-500',
  'alkaline-earth': 'bg-orange-500',
  transition: 'bg-yellow-500',
  'post-transition': 'bg-green-500',
  metalloid: 'bg-teal-500',
  nonmetal: 'bg-blue-500',
  halogen: 'bg-purple-500',
  'noble-gas': 'bg-pink-500',
  lanthanide: 'bg-cyan-500',
  actinide: 'bg-lime-500',
};

const LEGEND = [
  ['bg-red-500', 'Alkalimetalle'],
  ['bg-orange-500', 'Erdalkalimetalle'],
  ['bg-yellow-500', 'Übergangsmetalle'],
  ['bg-blue-500', 'Nichtmetalle'],
  ['bg-purple-500', 'Halogene'],
  ['bg-pink-500', 'Edelgase'],
  ['bg-teal-500', 'Halbmetalle'],
  ['bg-cyan-500', 'Lanthanoide'],
  ['bg-lime-500', 'Actinoide'],
];

const PeriodicCalculator = ({ darkMode, selectedElement, setSelectedElement, playSound }) => (
  <div className={sectionCardClass}>
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
    <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
      <Atom size={18} className={darkMode ? 'text-indigo-300' : 'text-indigo-600'} />
      Periodensystem der Elemente
    </h3>

    <div className="grid grid-cols-18 gap-1 mb-6 overflow-x-auto">
      {PERIODIC_TABLE.map((element) => {
        const bgColor = CATEGORY_COLORS[element.category] || 'bg-gray-400';
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
              minWidth: '40px',
            }}
          >
            <div className="text-[8px] font-bold">{element.number}</div>
            <div className="text-xs font-bold">{element.symbol}</div>
          </button>
        );
      })}
    </div>

    {selectedElement && (
      <div
        className={`rounded-xl p-6 border-2 ${
          darkMode ? 'bg-white/5 border-indigo-500/50' : 'bg-white/70 border-indigo-400'
        }`}
      >
        <div className="text-center mb-4">
          <div className={`text-6xl font-bold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            {selectedElement.symbol}
          </div>
          <h4 className="text-2xl font-bold mb-2 text-gray-800">{selectedElement.name}</h4>
        </div>
        <div
          className={`grid grid-cols-2 gap-4 rounded-lg p-4 ${
            darkMode ? 'bg-white/5' : 'bg-white/60 border border-gray-200'
          }`}
        >
          {[
            ['Ordnungszahl', selectedElement.number],
            ['Atommasse', `${selectedElement.mass} u`],
            ['Gruppe', selectedElement.group],
            ['Periode', selectedElement.period],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-sm text-gray-500">{k}</p>
              <p className="text-xl font-bold text-gray-800">{v}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
      {LEGEND.map(([color, label]) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-4 h-4 ${color} rounded`} />
          <span className="text-xs text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default PeriodicCalculator;
