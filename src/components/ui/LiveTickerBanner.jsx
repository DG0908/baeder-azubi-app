export function LiveTickerBanner({ appConfig }) {
  const maintenanceActive = appConfig?.featureFlags?.quizMaintenance;
  const announcementActive = appConfig?.announcement?.enabled && appConfig?.announcement?.message;
  if (!maintenanceActive && !announcementActive) return null;

  const isMaintenanceTicker = maintenanceActive && !announcementActive;
  const tickerText = announcementActive
    ? appConfig.announcement.message
    : 'Quiz-Wartung läuft — wir verbessern das Quizduell für euch. Bitte bald wieder vorbeischauen!';

  const bgColor = isMaintenanceTicker ? '#b45309' : '#d97706';
  const textColor = '#fff8e1';
  const badgeLabel = isMaintenanceTicker ? 'WARTUNG' : 'INFO';
  const badgeBg = isMaintenanceTicker ? '#92400e' : '#b45309';

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9997] flex items-center overflow-hidden"
      style={{ background: bgColor, height: '32px' }}
    >
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-3 h-full text-xs font-black tracking-widest z-10"
        style={{ background: badgeBg, color: textColor, minWidth: 'max-content' }}
      >
        <span className="animate-live-pulse inline-block w-1.5 h-1.5 rounded-full bg-white" />
        {badgeLabel}
      </div>

      <div className="flex-1 overflow-hidden h-full flex items-center relative">
        <span
          className={announcementActive ? 'animate-ticker-slow' : 'animate-ticker'}
          style={{ color: textColor, fontSize: '0.78rem', fontWeight: 600 }}
        >
          {tickerText}
          &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
          {tickerText}
        </span>
      </div>

      <div
        className="flex-shrink-0 px-3 text-xs font-semibold tabular-nums"
        style={{ color: textColor, opacity: 0.75 }}
      >
        {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
