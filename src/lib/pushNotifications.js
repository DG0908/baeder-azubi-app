const WEB_PUSH_PUBLIC_KEY = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY || '';
const PUSH_FUNCTION_NAME = import.meta.env.VITE_PUSH_FUNCTION_NAME || 'send-web-push';

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

export const ensureUserPushSubscription = async ({
  supabase,
  user,
  requestPermission = false
}) => {
  if (!supabase || !user?.id || !user?.name) return { enabled: false, reason: 'missing-user' };
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

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id: user.id,
        user_name: user.name,
        endpoint: serialized.endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_agent: navigator.userAgent,
        last_seen_at: new Date().toISOString()
      },
      { onConflict: 'endpoint' }
    );

  if (error) throw error;
  return { enabled: true, subscription: serialized };
};

export const triggerWebPushNotification = async ({
  supabase,
  userName,
  title,
  message,
  type = 'info',
  notificationId
}) => {
  if (!supabase || !userName || !title) return { sent: false, reason: 'missing-input' };
  if (!isWebPushConfigured()) return { sent: false, reason: 'missing-vapid-key' };

  const body = {
    userName,
    title,
    message,
    type
  };
  if (notificationId) body.notificationId = notificationId;

  const { data, error } = await supabase.functions.invoke(PUSH_FUNCTION_NAME, { body });
  if (error) throw error;
  return { sent: true, data };
};
