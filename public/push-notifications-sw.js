/* global self, clients */

const DEFAULT_ICON = '/icons/icon-192x192.png';

const parsePushPayload = (event) => {
  if (!event.data) return {};
  try {
    return event.data.json();
  } catch (_error) {
    const text = event.data.text();
    return { message: text };
  }
};

self.addEventListener('push', (event) => {
  const payload = parsePushPayload(event);
  const title = payload.title || 'Aqua Pilot';
  const body = payload.message || payload.body || 'Neue Benachrichtigung';
  const data = payload.data || {};
  const targetUrl = data.url || payload.url || '/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: payload.icon || DEFAULT_ICON,
      badge: payload.badge || DEFAULT_ICON,
      tag: payload.tag || `push-${Date.now()}`,
      data: { ...data, url: targetUrl },
      renotify: true,
      vibrate: [120, 60, 120]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || '/';

  event.waitUntil((async () => {
    const matchedClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of matchedClients) {
      if (client.url.startsWith(self.location.origin) && 'focus' in client) {
        await client.focus();
        client.postMessage({ type: 'PUSH_NOTIFICATION_CLICK', url: targetUrl });
        return;
      }
    }

    if (clients.openWindow) {
      await clients.openWindow(targetUrl);
    }
  })());
});
