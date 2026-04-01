import { getApiAccessToken } from './secureApiClient';
import { secureNotificationsApi } from './secureApi';

const WEB_PUSH_PUBLIC_KEY = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY || '';
const SMARTBADEN_PUSH_BACKEND_URL = 'https://push.smartbaden.de/api/push/send';

export const getPushBackendUrl = () => {
  const configuredUrl = String(import.meta.env.VITE_PUSH_BACKEND_URL || '').trim();
  const hasAbsoluteConfiguredUrl = /^https?:\/\//i.test(configuredUrl);
  if (hasAbsoluteConfiguredUrl) return configuredUrl;

  if (typeof window !== 'undefined') {
    const hostname = String(window.location.hostname || '').trim().toLowerCase();
    if (hostname === 'smartbaden.de' || hostname.endsWith('.smartbaden.de')) {
      return SMARTBADEN_PUSH_BACKEND_URL;
    }
  }

  if (configuredUrl) return configuredUrl;
  return '/api/push/send';
};

export const buildPushBackendApiUrl = (pathname = '/api/push/send') => {
  const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  const url = new URL(getPushBackendUrl(), fallbackOrigin);
  if (pathname) {
    url.pathname = pathname;
  }
  url.search = '';
  url.hash = '';
  return url.toString();
};

const parseBackendResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json')
    ? response.json()
    : response.text();
};

export const fetchPushBackendWithAuth = async ({
  pathname,
  method = 'POST',
  body
}) => {
  const backendUrl = buildPushBackendApiUrl(pathname);
  if (!backendUrl) {
    throw new Error('Push-/Backend-URL ist nicht konfiguriert.');
  }

  const doRequest = async (accessToken) => fetch(backendUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  let accessToken = getApiAccessToken() || '';
  if (!accessToken) {
    throw new Error('Keine aktive Sitzung für den Backend-Request gefunden.');
  }

  let response = await doRequest(accessToken);
  if (response.status === 401) {
    accessToken = getApiAccessToken() || '';
    if (!accessToken) {
      throw new Error('Sitzung auf diesem Gerät abgelaufen. Bitte einmal neu einloggen.');
    }
    response = await doRequest(accessToken);
  }

  const responseData = await parseBackendResponse(response);

  if (!response.ok) {
    let messageText = typeof responseData === 'string'
      ? responseData
      : responseData?.error || `Push backend request failed (${response.status}).`;

    if (response.status === 401 && /unauthorized request/i.test(String(messageText || ''))) {
      messageText = 'Sitzung auf diesem Gerät abgelaufen. Bitte einmal neu einloggen.';
    }

    throw new Error(messageText);
  }

  return responseData;
};

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
  if (!user?.id || !user?.name) return { enabled: false, reason: 'missing-user' };
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

  await secureNotificationsApi.upsertPushSubscription({
    endpoint: serialized.endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    userAgent: navigator.userAgent
  });

  return { enabled: true, subscription: serialized };
};

export const clearUserPushSubscription = async ({ user }) => {
  if (!user?.id) return { cleared: false, reason: 'missing-user' };
  if (!isWebPushSupported()) return { cleared: false, reason: 'unsupported' };

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  const serialized = subscription?.toJSON?.() || {};
  const endpoint = String(serialized?.endpoint || '').trim();

  if (endpoint) {
    await secureNotificationsApi.removePushSubscription({ endpoint });
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

export const triggerWebPushNotification = async ({
  userName,
  title,
  message,
  type = 'info',
  notificationId
}) => {
  if (!userName || !title) return { sent: false, reason: 'missing-input' };

  const body = { userName, title, message, type };
  if (notificationId) body.notificationId = notificationId;

  const pushBackendUrl = getPushBackendUrl();
  if (String(pushBackendUrl || '').trim()) {
    try {
      const responseData = await fetchPushBackendWithAuth({
        pathname: '/api/push/send',
        method: 'POST',
        body
      });
      return { sent: true, data: responseData };
    } catch (error) {
      console.warn('Push backend dispatch failed:', error);
      if (!isWebPushConfigured()) throw error;
    }
  }

  if (!isWebPushConfigured()) {
    return { sent: false, reason: 'missing-vapid-key' };
  }

  return { sent: false, reason: 'push-backend-unavailable' };
};
