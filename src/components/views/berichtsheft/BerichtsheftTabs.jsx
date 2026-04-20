import React from 'react';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  PenTool,
  Plus,
  User as UserIcon,
} from 'lucide-react';

const TabButton = ({ active, onClick, icon: Icon, label, darkMode, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
      active
        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
        : darkMode
          ? 'bg-white/5 text-gray-300 hover:bg-white/10'
          : 'bg-white/70 text-gray-700 hover:bg-white'
    }`}
  >
    <Icon size={16} />
    {label}
    {badge != null && badge > 0 && (
      <span
        className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
          active
            ? 'bg-white/25 text-white'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);

const BerichtsheftTabs = ({
  darkMode,
  berichtsheftViewMode,
  openBerichtsheftDraftForCurrentWeek,
  setBerichtsheftViewMode,
  canManageBerichtsheftSignatures,
  pendingSignatureCount,
}) => (
  <div className="glass-card rounded-2xl p-3">
    <div className="flex flex-wrap gap-2">
      <TabButton
        active={berichtsheftViewMode === 'edit'}
        onClick={openBerichtsheftDraftForCurrentWeek}
        icon={Plus}
        label="Neu"
        darkMode={darkMode}
      />
      <TabButton
        active={berichtsheftViewMode === 'list'}
        onClick={() => setBerichtsheftViewMode('list')}
        icon={ClipboardList}
        label="Übersicht"
        darkMode={darkMode}
      />
      <TabButton
        active={berichtsheftViewMode === 'progress'}
        onClick={() => setBerichtsheftViewMode('progress')}
        icon={BarChart3}
        label="Fortschritt"
        darkMode={darkMode}
      />
      <TabButton
        active={berichtsheftViewMode === 'profile'}
        onClick={() => setBerichtsheftViewMode('profile')}
        icon={UserIcon}
        label="Profil"
        darkMode={darkMode}
      />
      <TabButton
        active={berichtsheftViewMode === 'kalender'}
        onClick={() => setBerichtsheftViewMode('kalender')}
        icon={CalendarDays}
        label="Kalender"
        darkMode={darkMode}
      />
      {canManageBerichtsheftSignatures && (
        <TabButton
          active={berichtsheftViewMode === 'sign'}
          onClick={() => setBerichtsheftViewMode('sign')}
          icon={PenTool}
          label="Zum Unterschreiben"
          darkMode={darkMode}
          badge={pendingSignatureCount}
        />
      )}
    </div>
  </div>
);

export default BerichtsheftTabs;
