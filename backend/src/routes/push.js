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
const DEFAULT_ICON = '/icons/icon-192x192.png';
const MAX_TEST_DELAY_SECONDS = 120;
const PROFILE_SELECT = 'id, name, email, role, approved, organization_id';

const createAuthClient = (env, authHeader) => createClient(env.supabaseUrl, env.anonKey, {
  global: { headers: { Authorization: authHeader } }
});

const createAdminClient = (env) => createClient(env.supabaseUrl, env.serviceRoleKey);

const authenticateRequest = async (env, authHeader) => {
  const authClient = createAuthClient(env, authHeader);
  const { data: authData, error: authError } = await authClient.auth.getUser();
  if (authError || !authData?.user) {
    return { user: null, error: authError || new Error('Unauthorized request.') };
  }

  return { user: authData.user, error: null };
};

const loadSubscriptionsByUserName = async (adminClient, userName) => {
  const { data: subscriptions, error } = await adminClient
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_name', userName);

  return {
    subscriptions: Array.isArray(subscriptions) ? subscriptions : [],
    error
  };
};

const loadSubscriptionsByUserNames = async (adminClient, userNames) => {
  const normalizedNames = [...new Set(
    (userNames || [])
      .map((value) => String(value || '').trim())
      .filter(Boolean)
  )];

  if (!normalizedNames.length) {
    return { subscriptions: [], error: null };
  }

  const { data: subscriptions, error } = await adminClient
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .in('user_name', normalizedNames);

  return {
    subscriptions: Array.isArray(subscriptions) ? subscriptions : [],
    error
  };
};

const resolveCallerProfile = async (adminClient, authUser, fallbackInput = {}) => {
  const authUserId = String(authUser?.id || '').trim();
  const authEmail = String(authUser?.email || fallbackInput.email || '').trim().toLowerCase();
  const fallbackUserName = String(fallbackInput.userName || '').trim();

  if (authUserId) {
    const { data, error } = await adminClient
      .from('profiles')
      .select(PROFILE_SELECT)
      .eq('id', authUserId)
      .maybeSingle();

    if (data) return { profile: data, error: null };
    if (error) return { profile: null, error };
  }

  if (authEmail) {
    const { data, error } = await adminClient
      .from('profiles')
      .select(PROFILE_SELECT)
      .eq('email', authEmail)
      .maybeSingle();

    if (data) return { profile: data, error: null };
    if (error) return { profile: null, error };
  }

  if (fallbackUserName) {
    const { data, error } = await adminClient
      .from('profiles')
      .select(PROFILE_SELECT)
      .eq('name', fallbackUserName)
      .maybeSingle();

    if (data) return { profile: data, error: null };
    if (error) return { profile: null, error };
  }

  return { profile: null, error: null };
};

const dispatchPushToSubscriptions = async ({
  env,
  adminClient,
  subscriptions,
  title,
  message,
  type = 'info',
  notificationId = null,
  targetUrl = '/',
  icon = DEFAULT_ICON,
  badge = DEFAULT_ICON,
  data = {}
}) => {
  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return { sent: 0, failed: 0, removed: 0 };
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

  return { sent, failed, removed };
};

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
  const icon = String(body.icon || DEFAULT_ICON).trim() || DEFAULT_ICON;
  const badge = String(body.badge || DEFAULT_ICON).trim() || DEFAULT_ICON;
  const data = body.data && typeof body.data === 'object' ? body.data : {};

  if (!userName || !title || !message) {
    return res.status(400).json({ error: 'userName, title and message are required.' });
  }

  try {
    const { user, error: authError } = await authenticateRequest(env, authHeader);
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    const adminClient = createAdminClient(env);
    const { subscriptions, error: subscriptionsError } = await loadSubscriptionsByUserName(adminClient, userName);

    if (subscriptionsError) {
      console.error('Failed loading push subscriptions:', subscriptionsError);
      return res.status(500).json({ error: 'Failed loading push subscriptions.' });
    }

    if (!subscriptions.length) {
      return res.json({ ok: true, sent: 0, failed: 0, removed: 0 });
    }

    const { sent, failed, removed } = await dispatchPushToSubscriptions({
      env,
      adminClient,
      subscriptions,
      title,
      message,
      type,
      notificationId,
      targetUrl,
      icon,
      badge,
      data
    });

    return res.json({ ok: true, sent, failed, removed });
  } catch (error) {
    console.error('Push route error:', error);
    return res.status(500).json({ error: 'Push dispatch failed.' });
  }
});

router.post('/test', async (req, res) => {
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
  const requestedDelay = Number(body.delaySeconds);
  const requestedScope = String(body.targetScope || 'self').trim().toLowerCase();
  const targetScope = requestedScope === 'organization' ? 'organization' : 'self';
  const delaySeconds = Number.isFinite(requestedDelay)
    ? Math.max(0, Math.min(MAX_TEST_DELAY_SECONDS, Math.round(requestedDelay)))
    : 15;

  try {
    const { user, error: authError } = await authenticateRequest(env, authHeader);
    if (authError || !user?.id) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    const adminClient = createAdminClient(env);
    const { profile, error: profileError } = await resolveCallerProfile(adminClient, user, body);

    if (profileError || !profile?.name) {
      console.error('Push test profile lookup failed:', profileError);
      return res.status(404).json({ error: 'Kein passendes Profil fuer den Test-Push gefunden.' });
    }

    if (!profile.approved) {
      return res.status(403).json({ error: 'Nur freigeschaltete Nutzer koennen Test-Push verwenden.' });
    }

    const callerName = String(profile.name || '').trim();
    const fallbackOrganizationId = String(body.organizationId || '').trim() || null;
    const organizationId = profile.organization_id || fallbackOrganizationId;

    let targetNames = [callerName];
    if (targetScope === 'organization') {
      if (!organizationId) {
        return res.status(400).json({ error: 'Keine Organisation fuer den Test-Push gefunden.' });
      }

      const { data: orgProfiles, error: orgProfilesError } = await adminClient
        .from('profiles')
        .select('name')
        .eq('approved', true)
        .eq('organization_id', organizationId);

      if (orgProfilesError) {
        console.error('Push test organization lookup failed:', orgProfilesError);
        return res.status(500).json({ error: 'Organisation konnte nicht fuer den Test-Push geladen werden.' });
      }

      targetNames = [...new Set(
        (orgProfiles || [])
          .map((entry) => String(entry?.name || '').trim())
          .filter(Boolean)
      )];
    }

    const { subscriptions, error: subscriptionsError } = await loadSubscriptionsByUserNames(adminClient, targetNames);
    if (subscriptionsError) {
      console.error('Push test subscription lookup failed:', subscriptionsError);
      return res.status(500).json({ error: 'Push-Abos konnten nicht geladen werden.' });
    }

    if (!subscriptions.length) {
      return res.status(409).json({
        error: targetScope === 'organization'
          ? 'Kein aktives Push-Abo in dieser Organisation gefunden. Bitte die App auf den Zielgeraeten einmal offen lassen und Benachrichtigungen erlauben.'
          : 'Kein aktives Push-Abo fuer diesen Nutzer gefunden. Bitte App einmal offen lassen und Benachrichtigungen erlauben.'
      });
    }

    const sendPayload = async () => dispatchPushToSubscriptions({
      env,
      adminClient: createAdminClient(env),
      subscriptions,
      title: targetScope === 'organization' ? 'Org-Test-Push' : 'Test-Push',
      message: targetScope === 'organization'
        ? 'Wenn diese Nachricht in deiner Organisation bei geschlossener App ankommt, funktioniert Hintergrund-Push.'
        : 'Wenn du diese Nachricht bei geschlossener App siehst, funktioniert Hintergrund-Push.',
      type: 'info',
      targetUrl: '/',
      icon: DEFAULT_ICON,
      badge: DEFAULT_ICON,
      data: {
        kind: 'test-push',
        userId: user.id,
        targetScope
      }
    });

    if (delaySeconds > 0) {
      setTimeout(() => {
        void sendPayload().catch((error) => {
          console.error('Delayed test push failed:', error);
        });
      }, delaySeconds * 1000);

      return res.json({
        ok: true,
        scheduled: true,
        delaySeconds,
        subscriptionCount: subscriptions.length,
        userName: callerName,
        targetScope,
        targetCount: targetNames.length
      });
    }

    const result = await sendPayload();
    return res.json({
      ok: true,
      scheduled: false,
      delaySeconds: 0,
      subscriptionCount: subscriptions.length,
      userName: callerName,
      targetScope,
      targetCount: targetNames.length,
      ...result
    });
  } catch (error) {
    console.error('Push test route error:', error);
    return res.status(500).json({ error: 'Test-Push fehlgeschlagen.' });
  }
});

module.exports = router;
