export const inputClass = (darkMode) =>
  `w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-400'
      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500'
  }`;

export const selectClass = (darkMode) =>
  `px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white'
      : 'bg-white/80 border-gray-300 text-gray-800'
  }`;

export const glassCard = 'glass-card rounded-2xl p-6 relative overflow-hidden';

export const sectionAccent = (gradient) =>
  `absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`;

export const subtleBoxClass = (darkMode) =>
  darkMode
    ? 'rounded-xl bg-white/5 border border-white/10 p-4'
    : 'rounded-xl bg-white/60 border border-gray-200 p-4';

export const pillBtn = (active, darkMode, gradient) =>
  `px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
    active
      ? `text-white bg-gradient-to-r ${gradient} shadow-sm`
      : darkMode
        ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
        : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
  }`;
