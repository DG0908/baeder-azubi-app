import { useState, useEffect, useRef, useCallback } from 'react';
import {
  loadNotifications as dsLoadNotifications,
  markNotificationRead as dsMarkNotificationRead,
  clearAllNotifications as dsClearAllNotifications,
} from '../lib/dataService';
import {
  clearUserPushSubscription,
  ensureUserPushSubscription,
  getCurrentPushDeviceState,
  isWebPushConfigured,
} from '../lib/pushNotifications';

// ── Types ───────────────────────────────────────────────────
interface NotificationUser {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  userName: string;
  time: number;
  read: boolean;
}

interface PushDeviceStateExtended {
  supported: boolean;
  configured: boolean;
  permission: NotificationPermission | 'unsupported' | 'default';
  hasSubscription: boolean;
  endpoint: string;
  checking: boolean;
}

interface NotificationTracker {
  userId: string | null;
  initialized: boolean;
  knownIds: Set<string>;
  announcedIds: Set<string>;
}

interface UseNotificationsDeps {
  user: NotificationUser | null;
  authReady: boolean;
  allUsers: Array<{ name?: string; approved?: boolean; organization_id?: string; organizationId?: string }>;
  showToast: (message: string, type?: string, duration?: number) => void;
  playSound: (type: string) => void;
}

// ── Hook ─────────────────────────────────────────────────────
export function useNotifications({ user, authReady, allUsers, showToast, playSound }: UseNotificationsDeps) {
  // ── Notification state ───────────────────────────────────
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

  const notificationTrackerRef = useRef<NotificationTracker>({
    userId: null,
    initialized: false,
    knownIds: new Set(),
    announcedIds: new Set(),
  });

  // Reset tracker when user changes
  useEffect(() => {
    notificationTrackerRef.current = {
      userId: user?.id || null,
      initialized: false,
      knownIds: new Set(),
      announcedIds: new Set(),
    };
  }, [user?.id]);

  // ── Push device state ────────────────────────────────────
  const [pushDeviceState, setPushDeviceState] = useState<PushDeviceStateExtended>({
    supported: false,
    configured: false,
    permission: 'default',
    hasSubscription: false,
    endpoint: '',
    checking: false,
  });

  const refreshPushDeviceState = useCallback(async () => {
    setPushDeviceState((prev) => ({ ...prev, checking: true }));
    try {
      const nextState = await getCurrentPushDeviceState();
      setPushDeviceState({ ...nextState, checking: false });
      return nextState;
    } catch (error) {
      console.warn('Push device state check failed:', error);
      const permission: NotificationPermission | 'unsupported' =
        typeof window !== 'undefined' && 'Notification' in window
          ? Notification.permission
          : 'unsupported';
      const fallbackState: PushDeviceStateExtended = {
        supported: false,
        configured: isWebPushConfigured(),
        permission,
        hasSubscription: false,
        endpoint: '',
        checking: false,
      };
      setPushDeviceState(fallbackState);
      return fallbackState;
    }
  }, []);

  const syncPushSubscription = useCallback(
    async (requestPermission = false) => {
      try {
        const result = await ensureUserPushSubscription({ user, requestPermission });
        await refreshPushDeviceState();
        return result.enabled;
      } catch (error) {
        console.warn('Push subscription sync failed:', error);
        await refreshPushDeviceState();
        return false;
      }
    },
    [refreshPushDeviceState, user]
  );

  const disablePushNotifications = useCallback(async () => {
    try {
      const result = await clearUserPushSubscription({ user });
      await refreshPushDeviceState();
      return result;
    } catch (error) {
      console.warn('Push disable failed:', error);
      await refreshPushDeviceState();
      throw error;
    }
  }, [refreshPushDeviceState, user]);

  const enablePushNotifications = useCallback(async () => {
    if (!isWebPushConfigured()) {
      showToast('Push ist noch nicht konfiguriert (VAPID Public Key fehlt).', 'warning');
      return;
    }
    const enabled = await syncPushSubscription(true);
    if (!enabled) {
      if ('Notification' in window && Notification.permission === 'denied') {
        showToast(
          'Bitte aktiviere Benachrichtigungen in den Browser-/App-Einstellungen.',
          'warning'
        );
      } else {
        showToast('Push konnte nicht aktiviert werden.', 'error');
      }
      return;
    }
    showToast('Push-Benachrichtigungen aktiviert.', 'success');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Push aktiviert', {
        body: 'Du erhaeltst jetzt Handy-Benachrichtigungen für neue Ereignisse.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'push-enabled',
      });
    }
  }, [syncPushSubscription, showToast]);

  // ── Push effects ─────────────────────────────────────────
  // Reset push state when user logs out
  useEffect(() => {
    if (!authReady) return;
    if (!user?.id) {
      setPushDeviceState({
        supported: false,
        configured: isWebPushConfigured(),
        permission:
          typeof window !== 'undefined' && 'Notification' in window
            ? Notification.permission
            : 'default',
        hasSubscription: false,
        endpoint: '',
        checking: false,
      });
      return;
    }
    void refreshPushDeviceState();
  }, [authReady, refreshPushDeviceState, user?.id]);

  // Auto-sync push subscription on login
  useEffect(() => {
    if (!authReady || !user?.id) return;
    if (!isWebPushConfigured()) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    void syncPushSubscription(false);
  }, [authReady, user?.id, syncPushSubscription]);

  // ── PWA update state ─────────────────────────────────────
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updatingApp, setUpdatingApp] = useState(false);

  const checkForPwaUpdate = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return false;
      if (registration.waiting) {
        setUpdateAvailable(true);
        return true;
      }
      await registration.update();
      if (registration.waiting) {
        setUpdateAvailable(true);
        return true;
      }
      if (registration.installing) {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting) {
            setUpdateAvailable(true);
          }
        });
      }
      return false;
    } catch (error) {
      console.warn('PWA update check failed:', error);
      return false;
    }
  }, []);

  const applyPwaUpdate = useCallback(async () => {
    if (updatingApp) return;
    setUpdatingApp(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      window.location.reload();
    } catch (error) {
      console.error('PWA update failed:', error);
      setUpdatingApp(false);
      showToast('Update fehlgeschlagen. Bitte Seite neu laden.', 'error');
    }
  }, [updatingApp, showToast]);

  // PWA lifecycle effect
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return undefined;

    const onControllerChange = () => window.location.reload();
    const onForeground = () => {
      if (document.visibilityState === 'visible') void checkForPwaUpdate();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    document.addEventListener('visibilitychange', onForeground);
    window.addEventListener('focus', onForeground);
    void checkForPwaUpdate();
    const intervalId = window.setInterval(() => void checkForPwaUpdate(), 120000);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      document.removeEventListener('visibilitychange', onForeground);
      window.removeEventListener('focus', onForeground);
      window.clearInterval(intervalId);
    };
  }, [checkForPwaUpdate]);

  // ── Announce helper ──────────────────────────────────────
  const announceNotificationLocally = useCallback(
    async (notification: AppNotification) => {
      const notificationId = String(notification?.id || '').trim();
      if (!notificationId) return;

      const tracker = notificationTrackerRef.current;
      if (tracker.announcedIds.has(notificationId)) return;
      tracker.announcedIds.add(notificationId);

      if (user?.name === notification?.userName) {
        playSound('whistle');
      }

      const toastType =
        notification?.type === 'error' || notification?.type === 'warning'
          ? notification.type
          : 'info';

      try {
        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          const opts: NotificationOptions = {
            body: notification.message,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            tag: `notif-${notificationId}`,
            data: { url: '/' },
          };
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration?.showNotification) {
              await registration.showNotification(notification.title, opts);
              return;
            }
          }
          new Notification(notification.title, opts);
          return;
        }
      } catch (error) {
        console.warn('Local notification fallback failed:', error);
      }

      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        showToast(`${notification.title}: ${notification.message}`, toastType, 4500);
      }
    },
    [playSound, showToast, user?.name]
  );

  // ── Load / CRUD ──────────────────────────────────────────
  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const rawNotifs = await (dsLoadNotifications as (name: string) => Promise<Array<{ id: string; title: string; message: string; type: string; createdAt?: string; read: boolean }>>)(user.name);
      const notifs: AppNotification[] = rawNotifs.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        userName: user.name,
        time: new Date(n.createdAt || Date.now()).getTime(),
        read: n.read,
      }));

      const tracker = notificationTrackerRef.current;
      const knownIds = tracker.knownIds || new Set();
      const freshNotifications = tracker.initialized
        ? notifs.filter((notif) => !knownIds.has(String(notif.id || '')))
        : [];

      tracker.userId = user.id;
      tracker.initialized = true;
      tracker.knownIds = new Set(notifs.map((notif) => String(notif.id || '')));

      setNotifications(notifs);

      for (const notif of [...freshNotifications].reverse()) {
        if (!notif.read) {
          void announceNotificationLocally(notif);
        }
      }
    } catch {
      console.log('Loading notifications...');
    }
  }, [user, announceNotificationLocally]);

  // No-op — NestJS backend handles notifications server-side
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendNotification = useCallback(async (_userName?: string, _title?: string, _message?: string, _type?: string) => null, []);

  const sendNotificationToApprovedUsers = useCallback(
    async ({ title, message, type = 'info', excludeUserNames = [] }: { title: string; message: string; type?: string; excludeUserNames?: string[] }) => {
      try {
        const excluded = new Set(
          (excludeUserNames || [])
            .map((value) => String(value || '').trim().toLowerCase())
            .filter(Boolean)
        );
        const targetNames = [
          ...new Set(
            (allUsers || [])
              .map((u) => String(u.name || '').trim())
              .filter(Boolean)
          ),
        ].filter((name) => !excluded.has(name.toLowerCase()));

        for (const name of targetNames) {
          await sendNotification(name, title, message, type);
        }
        return targetNames.length;
      } catch (error) {
        console.error('Broadcast notification error:', error);
        return 0;
      }
    },
    [allUsers, sendNotification]
  );

  const markNotificationAsRead = useCallback(
    async (notifId: string) => {
      try {
        await (dsMarkNotificationRead as (id: string) => Promise<void>)(notifId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
        );
      } catch (error) {
        console.error('Mark read error:', error);
      }
    },
    []
  );

  const clearAllNotificationsAction = useCallback(async () => {
    try {
      await (dsClearAllNotifications as (name: string) => Promise<void>)(user!.name);
      setNotifications([]);
    } catch (error) {
      console.error('Clear notifications error:', error);
    }
  }, [user?.name]);

  // ── Return ───────────────────────────────────────────────
  return {
    // Notification state
    notifications,
    showNotificationsPanel,
    setShowNotificationsPanel,

    // Notification actions
    loadNotifications,
    sendNotification,
    sendNotificationToApprovedUsers,
    markNotificationAsRead,
    clearAllNotifications: clearAllNotificationsAction,

    // Push
    pushDeviceState,
    enablePushNotifications,
    disablePushNotifications,
    syncPushSubscription,

    // PWA update
    updateAvailable,
    updatingApp,
    applyPwaUpdate,
  };
}
