import { useEffect, useRef, useCallback } from 'react';

const TIMEOUT_MS = 30 * 60 * 1000;   // 30 Minuten bis Logout
const WARNING_MS = 28 * 60 * 1000;   // Warnung nach 28 Minuten

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

interface InactivityTimeoutOptions {
  enabled: boolean;
  onWarn: () => void;
  onDismissWarn: () => void;
  onLogout: () => void;
}

export function useInactivityTimeout({ enabled, onWarn, onDismissWarn, onLogout }: InactivityTimeoutOptions): void {
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onWarnRef = useRef(onWarn);
  const onDismissWarnRef = useRef(onDismissWarn);
  const onLogoutRef = useRef(onLogout);

  useEffect(() => { onWarnRef.current = onWarn; });
  useEffect(() => { onDismissWarnRef.current = onDismissWarn; });
  useEffect(() => { onLogoutRef.current = onLogout; });

  const reset = useCallback(() => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    onDismissWarnRef.current?.();

    warnTimer.current = setTimeout(() => onWarnRef.current?.(), WARNING_MS);
    logoutTimer.current = setTimeout(() => onLogoutRef.current?.(), TIMEOUT_MS);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      if (warnTimer.current) clearTimeout(warnTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled, reset]);
}
