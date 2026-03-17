const express = require('express');
const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const requiredEnvKeys = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'WEB_PUSH_PUBLIC_KEY',
  'WEB_PUSH_PRIVATE_KEY'
];

const getEnv = () => {
  const values = {
    supabaseUrl: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    vapidPublicKey: process.env.WEB_PUSH_PUBLIC_KEY || '',
    vapidPrivateKey: process.env.WEB_PUSH_PRIVATE_KEY || '',
    vapidSubject: process.env.WEB_PUSH_SUBJECT || 'mailto:admin@example.com'
  };

  const missing = requiredEnvKeys.filter((key) => !String(process.env[key] || '').trim());
  return { ...values, missing };
};

const getJsonBody = (input) => (input && typeof input === 'object' ? input : {});

router.get('/health', (_req, res) => {
  const env = getEnv();
  res.status(env.missing.length > 0 ? 500 : 200).json({
    ok: env.missing.length === 0,
    missing: env.missing
  });
});

router.post('/send', async (req, res) => {
  const env = getEnv();
  if (env.missing.length > 0) {
    return res.status(500).json({
      error: 'Missing required environment variables.',
      missing: env.missing
    });
  }

  const authHeader = req.get('authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header.' });
  }

  const body = getJsonBody(req.body);
  const userName = String(body.userName || '').trim();
  const title = String(body.title || '').trim();
  const message = String(body.message || '').trim();
  const type = String(body.type || 'info').trim() || 'info';
  const notificationId = body.notificationId ?? null;
  const targetUrl = String(body.url || '/').trim() || '/';
  const icon = String(body.icon || '/icons/icon-192x192.png').trim() || '/icons/icon-192x192.png';
  const badge = String(body.badge || '/icons/icon-192x192.png').trim() || '/icons/icon-192x192.png';
  const data = body.data && typeof body.data === 'object' ? body.data : {};

  if (!userName || !title || !message) {
    return res.status(400).json({ error: 'userName, title and message are required.' });
  }

  try {
    const authClient = createClient(env.supabaseUrl, env.anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: authData, error: authError } = await authClient.auth.getUser();
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    const adminClient = createClient(env.supabaseUrl, env.serviceRoleKey);
    const { data: subscriptions, error: subscriptionsError } = await adminClient
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_name', userName);

    if (subscriptionsError) {
      console.error('Failed loading push subscriptions:', subscriptionsError);
      return res.status(500).json({ error: 'Failed loading push subscriptions.' });
    }

    if (!subscriptions?.length) {
      return res.json({ ok: true, sent: 0, failed: 0, removed: 0 });
    }

    webpush.setVapidDetails(env.vapidSubject, env.vapidPublicKey, env.vapidPrivateKey);

    const payload = JSON.stringify({
      title,
      message,
      type,
      notificationId,
      icon,
      badge,
      url: targetUrl,
      data,
      timestamp: new Date().toISOString()
    });

    let sent = 0;
    let failed = 0;
    const staleIds = [];

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          },
          payload
        );
        sent += 1;
      } catch (error) {
        const statusCode = Number(error?.statusCode || error?.status || 0);
        if (statusCode === 404 || statusCode === 410) {
          staleIds.push(subscription.id);
        } else {
          failed += 1;
        }

        console.error('Push send error:', {
          subscriptionId: subscription.id,
          statusCode,
          message: String(error)
        });
      }
    }

    let removed = 0;
    if (staleIds.length > 0) {
      const { error: deleteError } = await adminClient
        .from('push_subscriptions')
        .delete()
        .in('id', staleIds);

      if (deleteError) {
        console.error('Failed deleting stale subscriptions:', deleteError);
      } else {
        removed = staleIds.length;
      }
    }

    return res.json({ ok: true, sent, failed, removed });
  } catch (error) {
    console.error('Push route error:', error);
    return res.status(500).json({ error: 'Push dispatch failed.' });
  }
});

module.exports = router;
