export const inputClass = (darkMode) =>
  `w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-400'
      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500'
  }`;

export const selectClass = (darkMode) =>
  `w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white'
      : 'bg-white/80 border-gray-300 text-gray-800'
  }`;

export const infoBoxClass = (darkMode, tone = 'cyan') => {
  const tones = {
    cyan: darkMode
      ? 'bg-cyan-900/30 border-cyan-500 text-cyan-200'
      : 'bg-cyan-50 border-cyan-500 text-cyan-800',
    amber: darkMode
      ? 'bg-amber-900/30 border-amber-500 text-amber-200'
      : 'bg-amber-50 border-amber-500 text-amber-800',
    emerald: darkMode
      ? 'bg-emerald-900/30 border-emerald-500 text-emerald-200'
      : 'bg-emerald-50 border-emerald-500 text-emerald-800',
    rose: darkMode
      ? 'bg-rose-900/30 border-rose-500 text-rose-200'
      : 'bg-rose-50 border-rose-500 text-rose-800',
  };
  return `rounded-xl border-l-4 p-3 text-sm ${tones[tone] || tones.cyan}`;
};

export const sectionCardClass = 'glass-card rounded-2xl p-6 relative overflow-hidden';
