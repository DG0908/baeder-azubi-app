import { Sparkles, Lightbulb } from 'lucide-react';

const CalculatorResult = ({ result, darkMode }) => {
  if (!result) return null;
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500" />
      <div className="text-center mb-4 text-gray-800">
        <div className="text-xs font-bold mb-2 tracking-widest text-gray-500 flex items-center justify-center gap-1.5">
          <Sparkles size={14} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
          ERGEBNIS
        </div>
        <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
          {result.result}
        </div>
      </div>
      <div
        className={`rounded-xl p-4 ${
          darkMode ? 'bg-white/5' : 'bg-white/60 border border-gray-200'
        }`}
      >
        <p className="text-sm mb-2 text-gray-700">
          <strong>Berechnung:</strong> {result.explanation}
        </p>
        {result.details && <p className="text-sm mb-2 text-gray-600">{result.details}</p>}
        <p
          className={`text-sm font-bold flex items-start gap-1.5 ${
            darkMode ? 'text-cyan-300' : 'text-cyan-700'
          }`}
        >
          <Lightbulb size={14} className="flex-shrink-0 mt-0.5" />
          {result.recommendation}
        </p>
      </div>
    </div>
  );
};

export default CalculatorResult;
