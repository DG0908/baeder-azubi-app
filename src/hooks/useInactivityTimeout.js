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

  // Store callbacks in refs so the reset function never needs to change identity.
  // Without this, inline lambdas passed from App.jsx would change on every render,
  // causing reset to change, causing the useEffect to re-run and restart the timers.
  const onWarnRef = useRef(onWarn);
  const onDismissWarnRef = useRef(onDismissWarn);
  const onLogoutRef = useRef(onLogout);

  useEffect(() => { onWarnRef.current = onWarn; });
  useEffect(() => { onDismissWarnRef.current = onDismissWarn; });
  useEffect(() => { onLogoutRef.current = onLogout; });

  const reset = useCallback(() => {
    clearTimeout(warnTimer.current);
    clearTimeout(logoutTimer.current);
    onDismissWarnRef.current?.();

    warnTimer.current = setTimeout(() => onWarnRef.current?.(), WARNING_MS);
    logoutTimer.current = setTimeout(() => onLogoutRef.current?.(), TIMEOUT_MS);
  }, []); // Stable: refs handle callback updates without changing reset's identity.

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
