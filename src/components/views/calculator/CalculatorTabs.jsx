import {
  Calculator,
  Droplet,
  FlaskConical,
  Ruler,
  Beaker,
  TestTube,
  Atom,
  Waves,
  Clock,
} from 'lucide-react';

const TABS = [
  { id: 'ph', label: 'pH-Wert', Icon: Droplet, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'chlorine', label: 'Chlor-Bedarf', Icon: FlaskConical, gradient: 'from-green-500 to-emerald-500' },
  { id: 'volume', label: 'Beckenvolumen', Icon: Ruler, gradient: 'from-purple-500 to-pink-500' },
  { id: 'dilution', label: 'Mix / Verdünnung', Icon: Beaker, gradient: 'from-amber-500 to-orange-500' },
  { id: 'flocculation', label: 'Flockung', Icon: Waves, gradient: 'from-sky-500 to-cyan-500' },
  { id: 'chemicals', label: 'Chemikalien', Icon: TestTube, gradient: 'from-orange-500 to-red-500' },
  { id: 'periodic', label: 'Periodensystem', Icon: Atom, gradient: 'from-indigo-500 to-purple-500' },
  { id: 'industrialTime', label: 'Industriezeit', Icon: Clock, gradient: 'from-teal-500 to-cyan-500' },
];

const CalculatorTabs = ({ darkMode, calculatorType, onSelectType }) => (
  <>
    <div
      className={`${
        darkMode
          ? 'bg-gradient-to-r from-indigo-900 via-slate-900 to-cyan-900'
          : 'bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500'
      } text-white rounded-2xl p-6 shadow-lg`}
    >
      <h2 className="text-2xl font-bold mb-1 flex items-center gap-3">
        <Calculator size={26} />
        Praxis-Rechner
      </h2>
      <p className="text-sm opacity-90">
        Werkzeuge für Wasserchemie, Dosierung, Volumen und Zeit
      </p>
    </div>

    <div className="flex gap-2 flex-wrap">
      {TABS.map(({ id, label, Icon, gradient }) => {
        const active = calculatorType === id;
        return (
          <button
            key={id}
            onClick={() => onSelectType(id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              active
                ? `text-white bg-gradient-to-r ${gradient} shadow-sm`
                : darkMode
                  ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
                  : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        );
      })}
    </div>
  </>
);

export default CalculatorTabs;
