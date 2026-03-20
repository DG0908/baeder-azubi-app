import { apiRequest, isSecureBackendApiEnabled } from './secureApiClient';

const WEB_PUSH_PUBLIC_KEY = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY || '';
const LEGACY_PUSH_DECOMMISSIONED_MESSAGE =
  'Der alte browserseitige Push-Pfad wurde stillgelegt. Push ist nur noch im sicheren Backend-Modus verfuegbar.';

const urlBase64ToUint8Array = (value) => {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  const base64 = normalized + padding;
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const isWebPushConfigured = () => Boolean(String(WEB_PUSH_PUBLIC_KEY).trim());

export const isWebPushSupported = () => (
  typeof window !== 'undefined'
  && 'Notification' in window
  && 'serviceWorker' in navigator
  && 'PushManager' in window
);

export const getCurrentPushDeviceState = async () => {
  const supported = isWebPushSupported();
  const configured = isWebPushConfigured();
  const permission = typeof window !== 'undefined' && 'Notification' in window
    ? Notification.permission
    : 'unsupported';

  if (!supported || !configured) {
    return {
      supported,
      configured,
      permission,
      hasSubscription: false,
      endpoint: ''
    };
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  const serialized = subscription?.toJSON?.() || {};

  return {
    supported,
    configured,
    permission,
    hasSubscription: Boolean(serialized?.endpoint),
    endpoint: String(serialized?.endpoint || '')
  };
};

export const ensureUserPushSubscription = async ({
  user,
  requestPermission = false
}) => {
  if (!user?.id) return { enabled: false, reason: 'missing-user' };
  if (!isSecureBackendApiEnabled()) {
    throw new Error(LEGACY_PUSH_DECOMMISSIONED_MESSAGE);
  }
  if (!isWebPushSupported()) return { enabled: false, reason: 'unsupported' };
  if (!isWebPushConfigured()) return { enabled: false, reason: 'missing-vapid-key' };

  let permission = Notification.permission;
  if (permission === 'default' && requestPermission) {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') return { enabled: false, reason: 'permission-not-granted' };

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(WEB_PUSH_PUBLIC_KEY)
    });
  }

  const serialized = subscription.toJSON();
  const keys = serialized?.keys || {};
  if (!serialized?.endpoint || !keys.p256dh || !keys.auth) {
    return { enabled: false, reason: 'invalid-subscription' };
  }

  await apiRequest('/notifications/push/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      endpoint: serialized.endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent: navigator.userAgent
    })
  });

  return { enabled: true, subscription: serialized };
};

export const clearUserPushSubscription = async ({
  user
}) => {
  if (!user?.id) return { cleared: false, reason: 'missing-user' };
  if (!isSecureBackendApiEnabled()) {
    throw new Error(LEGACY_PUSH_DECOMMISSIONED_MESSAGE);
  }
  if (!isWebPushSupported()) return { cleared: false, reason: 'unsupported' };

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  const serialized = subscription?.toJSON?.() || {};
  const endpoint = String(serialized?.endpoint || '').trim();

  if (endpoint) {
    await apiRequest('/notifications/push/subscriptions', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint })
    });
  }

  if (subscription) {
    await subscription.unsubscribe();
  }

  return {
    cleared: true,
    removedEndpoint: endpoint,
    hadSubscription: Boolean(endpoint)
  };
};

export const triggerWebPushNotification = async () => {
  return {
    sent: false,
    reason: 'server-side-notification-delivery'
  };
};
