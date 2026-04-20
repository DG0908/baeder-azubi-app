import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

const DAY_HEADERS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const getWeekStartForDate = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
};

const isSignedByAzubi = (entry) => Boolean(String(entry?.signatur_azubi || '').trim());
const isSignedByAusbilder = (entry) => Boolean(String(entry?.signatur_ausbilder || '').trim());

const BerichtsheftCalendarView = ({
  darkMode,
  berichtsheftEntries,
  loadBerichtsheftForEdit,
  setBerichtsheftViewMode,
}) => {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startDow = firstDay.getDay();
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - (startDow === 0 ? 6 : startDow - 1));

  const calDays = [];
  const cur = new Date(gridStart);
  while (cur <= lastDay || calDays.length % 7 !== 0) {
    calDays.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
    if (calDays.length > 42) break;
  }

  const entries = berichtsheftEntries || [];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            if (calMonth === 0) {
              setCalMonth(11);
              setCalYear((y) => y - 1);
            } else {
              setCalMonth((m) => m - 1);
            }
          }}
          className={`p-2 rounded-lg transition-all ${
            darkMode
              ? 'hover:bg-white/10 text-gray-300 border border-white/10'
              : 'hover:bg-white text-gray-600 border border-gray-200 bg-white/70'
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {MONTH_NAMES[calMonth]} {calYear}
        </h3>
        <button
          onClick={() => {
            if (calMonth === 11) {
              setCalMonth(0);
              setCalYear((y) => y + 1);
            } else {
              setCalMonth((m) => m + 1);
            }
          }}
          className={`p-2 rounded-lg transition-all ${
            darkMode
              ? 'hover:bg-white/10 text-gray-300 border border-white/10'
              : 'hover:bg-white text-gray-600 border border-gray-200 bg-white/70'
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Unterschrieben</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Azubi unterschrieben</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Eingetragen</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className={`text-center text-xs font-bold py-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calDays.map((day, i) => {
          const isCurrentMonth = day.getMonth() === calMonth;
          const isToday = day.toDateString() === today.toDateString();
          const weekStartStr = getWeekStartForDate(day);
          const entry = entries.find((e) => e.week_start === weekStartStr);
          const dotColor = !entry
            ? null
            : isSignedByAusbilder(entry)
              ? 'bg-emerald-400'
              : isSignedByAzubi(entry)
                ? 'bg-yellow-400'
                : 'bg-orange-400';

          return (
            <button
              key={i}
              onClick={() => {
                if (entry) {
                  loadBerichtsheftForEdit(entry);
                  setBerichtsheftViewMode('edit');
                }
              }}
              disabled={!entry}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all text-xs ${
                isToday
                  ? darkMode
                    ? 'ring-2 ring-cyan-400 bg-cyan-500/20'
                    : 'ring-2 ring-cyan-500 bg-cyan-50'
                  : entry
                    ? darkMode
                      ? 'hover:bg-white/10 cursor-pointer'
                      : 'hover:bg-white cursor-pointer'
                    : 'cursor-default'
              } ${!isCurrentMonth ? 'opacity-30' : ''}`}
            >
              <span
                className={`font-medium ${
                  darkMode
                    ? isCurrentMonth
                      ? 'text-white'
                      : 'text-gray-600'
                    : isCurrentMonth
                      ? 'text-gray-800'
                      : 'text-gray-300'
                }`}
              >
                {day.getDate()}
              </span>
              {dotColor && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${dotColor}`} />}
            </button>
          );
        })}
      </div>

      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {entries.length} Berichte gesamt{' · '}
          {entries.filter((e) => isSignedByAusbilder(e)).length} vollständig unterschrieben
        </p>
      </div>
    </div>
  );
};

export default BerichtsheftCalendarView;
