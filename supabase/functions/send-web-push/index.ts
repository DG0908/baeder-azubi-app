import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })

type PushRequestBody = {
  userName?: string
  title?: string
  message?: string
  type?: string
  notificationId?: string | number
  url?: string
  icon?: string
  badge?: string
  data?: Record<string, unknown>
}

type PushSubscriptionRow = {
  id: string
  endpoint: string
  p256dh: string
  auth: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const vapidPublicKey = Deno.env.get('WEB_PUSH_PUBLIC_KEY')
  const vapidPrivateKey = Deno.env.get('WEB_PUSH_PRIVATE_KEY')
  const vapidSubject = Deno.env.get('WEB_PUSH_SUBJECT') || 'mailto:admin@example.com'

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !vapidPublicKey || !vapidPrivateKey) {
    return json({ error: 'Missing required environment variables for push sending.' }, 500)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return json({ error: 'Missing Authorization header.' }, 401)
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } }
  })
  const { data: authData, error: authError } = await authClient.auth.getUser()
  if (authError || !authData?.user) {
    return json({ error: 'Unauthorized request.' }, 401)
  }

  let body: PushRequestBody
  try {
    body = await req.json()
  } catch (_error) {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const userName = String(body.userName || '').trim()
  const title = String(body.title || '').trim()
  const message = String(body.message || '').trim()
  const type = String(body.type || 'info').trim() || 'info'

  if (!userName || !title || !message) {
    return json({ error: 'userName, title and message are required.' }, 400)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const { data: subscriptions, error: subscriptionsError } = await adminClient
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_name', userName)

  if (subscriptionsError) {
    console.error('Failed loading push subscriptions:', subscriptionsError)
    return json({ error: 'Failed loading push subscriptions.' }, 500)
  }

  if (!subscriptions?.length) {
    return json({ ok: true, sent: 0, failed: 0, removed: 0 })
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)

  const data = body.data && typeof body.data === 'object' ? body.data : {}
  const payload = JSON.stringify({
    title,
    message,
    type,
    notificationId: body.notificationId ?? null,
    icon: body.icon || '/icons/icon-192x192.png',
    badge: body.badge || '/icons/icon-192x192.png',
    url: body.url || '/',
    data,
    timestamp: new Date().toISOString()
  })

  let sent = 0
  let failed = 0
  const staleIds: string[] = []

  for (const subscription of subscriptions as PushSubscriptionRow[]) {
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
      )
      sent += 1
    } catch (error) {
      const e = error as { statusCode?: number; status?: number; body?: string }
      const statusCode = Number(e.statusCode || e.status || 0)

      if (statusCode === 404 || statusCode === 410) {
        staleIds.push(subscription.id)
      } else {
        failed += 1
      }

      console.error('Push send error:', {
        subscriptionId: subscription.id,
        statusCode,
        message: String(error)
      })
    }
  }

  let removed = 0
  if (staleIds.length > 0) {
    const { error: deleteError } = await adminClient
      .from('push_subscriptions')
      .delete()
      .in('id', staleIds)

    if (deleteError) {
      console.error('Failed deleting stale subscriptions:', deleteError)
    } else {
      removed = staleIds.length
    }
  }

  return json({ ok: true, sent, failed, removed })
})
