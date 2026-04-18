import { Bell } from 'lucide-react';
import AvatarBadge from './AvatarBadge';
import { getAvatarById, getLevel, getLevelProgress } from '../../data/constants';
import { getTotalXpFromStats } from '../../lib/quizHelpers';

export function AppHeader({
  darkMode, setDarkMode,
  soundEnabled, setSoundEnabled,
  sidebarCollapsed, setSidebarCollapsed,
  appConfig, user, userStats,
  setCurrentView, playSound,
  updateAvailable, updatingApp, applyPwaUpdate,
  enablePushNotifications,
  notifications, showNotificationsPanel, setShowNotificationsPanel,
  handleLogout,
}) {
  const tickerVisible = appConfig.featureFlags?.quizMaintenance
    || (appConfig.announcement?.enabled && appConfig.announcement?.message);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`${darkMode ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800' : 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600'} text-white shadow-lg relative z-20 ${tickerVisible ? 'mt-8' : ''}`}>
      <div className={`flex justify-between items-center px-4 py-2 transition-all ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors"
            title={sidebarCollapsed ? 'Menü ausklappen' : 'Menü einklappen'}
          >
            <span className="text-lg leading-none">{sidebarCollapsed ? '☰' : '✕'}</span>
          </button>
          <button
            onClick={() => { setCurrentView('profile'); playSound('splash'); }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <AvatarBadge
              avatar={user.avatar ? getAvatarById(user.avatar) : null}
              size="sm"
              className="border border-white/40"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold leading-tight">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-white/20 rounded-full px-1.5 py-0.5 leading-none">
                  Lv.{getLevel(getTotalXpFromStats(userStats))}
                </span>
                <div className="w-10 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/80 rounded-full" style={{ width: `${getLevelProgress(getTotalXpFromStats(userStats)) * 100}%` }} />
                </div>
              </div>
            </div>
          </button>
        </div>

        <h1 className="text-lg font-bold drop-shadow-lg hidden md:block absolute left-1/2 -translate-x-1/2">Bäder-Azubi App</h1>
        <h1 className="text-lg font-bold drop-shadow-lg md:hidden">Bäder-Azubi</h1>

        <div className="flex items-center gap-2">
          <button onClick={() => { setDarkMode(!darkMode); playSound('splash'); }} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors" title={darkMode ? 'Tag-Modus' : 'Nacht-Modus'}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => { setSoundEnabled(!soundEnabled); if (!soundEnabled) playSound('splash'); }} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors hidden sm:block" title={soundEnabled ? 'Sound aus' : 'Sound an'}>
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          {(updateAvailable || updatingApp) && (
            <button onClick={() => { void applyPwaUpdate(); }} disabled={updatingApp} className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 bg-emerald-500/90 hover:bg-emerald-600/90 text-sm ${updatingApp ? 'opacity-70 cursor-not-allowed' : ''}`} title="Neue Version installieren">
              <span>{updatingApp ? '⏳' : '⬆️'}</span>
              <span className="hidden sm:inline text-xs font-medium">{updatingApp ? 'Update...' : 'Update'}</span>
            </button>
          )}
          {'Notification' in window && Notification.permission === 'default' && (
            <button onClick={() => { void enablePushNotifications(); }} className="bg-yellow-500/80 hover:bg-yellow-600/80 px-2 py-1.5 rounded-lg transition-colors font-bold text-xs flex items-center gap-1 animate-pulse" title="Benachrichtigungen erlauben">
              🔔
            </button>
          )}
          <div className="relative">
            <button id="notification-bell" onClick={() => { setShowNotificationsPanel(!showNotificationsPanel); playSound('splash'); }} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">{unreadCount}</span>
              )}
            </button>
          </div>
          <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors text-sm hidden sm:block">Abmelden</button>
        </div>
      </div>
    </div>
  );
}
