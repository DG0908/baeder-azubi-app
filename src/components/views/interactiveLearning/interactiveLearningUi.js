export const glassCard = 'glass-card rounded-2xl p-6 relative overflow-hidden';

export const sectionAccent = (gradient) =>
  `absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`;

export const backButtonClass = (darkMode) =>
  `inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
    darkMode
      ? 'bg-white/5 hover:bg-white/10 text-cyan-200 border border-white/10'
      : 'bg-white/70 hover:bg-white text-cyan-700 border border-gray-200'
  }`;

export const suspenseFallbackClass = (darkMode) =>
  `glass-card rounded-2xl p-6 text-sm ${
    darkMode ? 'text-slate-300' : 'text-gray-600'
  }`;

export const moduleButtonClass = (available, darkMode) =>
  `w-full text-left rounded-2xl p-4 border transition-all glass-card relative overflow-hidden ${
    available
      ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
      : darkMode
        ? 'opacity-60 cursor-not-allowed border-white/5'
        : 'opacity-60 cursor-not-allowed border-gray-200'
  }`;
