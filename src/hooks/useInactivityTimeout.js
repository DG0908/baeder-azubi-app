import { useEffect, useRef, useCallback } from 'react';

const TIMEOUT_MS = 30 * 60 * 1000;   // 30 Minuten bis Logout
const WARNING_MS = 28 * 60 * 1000;   // Warnung nach 28 Minuten

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

/**
 * Meldet den User nach TIMEOUT_MS Inaktivität automatisch ab.
 * Ruft onWarn() bei 2 Minuten Restzeit auf und onLogout() beim Timeout.
 *
 * @param {{ enabled: boolean, onWarn: () => void, onDismissWarn: () => void, onLogout: () => void }} options
 */
export function useInactivityTimeout({ enabled, onWarn, onDismissWarn, onLogout }) {
  const warnTimer = useRef(null);
  const logoutTimer = useRef(null);

  const reset = useCallback(() => {
    clearTimeout(warnTimer.current);
    clearTimeout(logoutTimer.current);
    onDismissWarn();

    warnTimer.current = setTimeout(onWarn, WARNING_MS);
    logoutTimer.current = setTimeout(onLogout, TIMEOUT_MS);
  }, [onWarn, onDismissWarn, onLogout]);

  useEffect(() => {
    if (!enabled) return;

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(warnTimer.current);
      clearTimeout(logoutTimer.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled, reset]);
}
