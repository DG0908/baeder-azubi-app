import { GraduationCap, FileText, Waves } from 'lucide-react';

const ExamModeSwitcher = ({ darkMode, examSimulatorMode, setExamSimulatorMode }) => (
  <div className="space-y-3">
    <div
      className={`${
        darkMode
          ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-900'
          : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500'
      } text-white rounded-2xl p-6 shadow-lg`}
    >
      <h2 className="text-2xl font-bold flex items-center gap-3 mb-1">
        <GraduationCap size={26} />
        Prüfungssimulator
      </h2>
      <p className="text-sm opacity-90">
        Theoretische Prüfung mit 30 Fragen oder praktische Disziplinen eintragen.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => setExamSimulatorMode('theory')}
        className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          examSimulatorMode === 'theory'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
            : darkMode
              ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
              : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
        }`}
      >
        <FileText size={16} />
        Theorie
      </button>
      <button
        onClick={() => setExamSimulatorMode('practical')}
        className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          examSimulatorMode === 'practical'
            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-sm'
            : darkMode
              ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
              : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
        }`}
      >
        <Waves size={16} />
        Praxis
      </button>
    </div>
  </div>
);

export default ExamModeSwitcher;
