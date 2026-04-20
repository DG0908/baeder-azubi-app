import React from 'react';
import { BookOpen } from 'lucide-react';

const BerichtsheftHero = ({ darkMode, totalEntries, signedCount, openCount, totalHoursAll }) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-lg ${
      darkMode
        ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900'
        : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600'
    }`}
  >
    <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
            <BookOpen size={26} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Digitales Berichtsheft</h2>
        </div>
        <p className="text-white/80 text-sm md:text-base">
          Wochenberichte erfassen, unterschreiben und deinen Fortschritt im Blick behalten.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm min-w-[110px]">
          <div className="text-2xl font-bold">{totalEntries}</div>
          <div className="text-xs text-white/80">Wochen</div>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm min-w-[110px]">
          <div className="text-2xl font-bold">{signedCount}</div>
          <div className="text-xs text-white/80">Unterschrieben</div>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm min-w-[110px]">
          <div className="text-2xl font-bold">{openCount}</div>
          <div className="text-xs text-white/80">Offen</div>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm min-w-[110px]">
          <div className="text-2xl font-bold">{totalHoursAll}</div>
          <div className="text-xs text-white/80">Stunden</div>
        </div>
      </div>
    </div>
  </div>
);

export default BerichtsheftHero;
