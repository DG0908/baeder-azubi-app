import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-reminder-secret'
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })

type ReminderRequestBody = {
  force?: boolean
  dryRun?: boolean
  source?: string
}

type ProfileRow = {
  name: string | null
  role: string | null
  approved: boolean | null
}

type BerichtsheftRow = {
  user_name: string | null
  entries: Record<string, unknown> | null
}

type ReminderNotificationRow = {
  user_name: string | null
  created_at: string | null
}

type PushSubscriptionRow = {
  id: string
  endpoint: string
  p256dh: string
  auth: string
}

type LocalDateParts = {
  isoDate: string
  weekdayShort: string
  hour: number
}

const STAFF_ROLES = new Set(['admin', 'trainer', 'ausbilder'])
const REMINDER_NOTIFICATION_TYPE = 'berichtsheft_daily_reminder'
const DEFAULT_TITLE = 'Berichtsheft-Erinnerung'
const DEFAULT_MESSAGE = 'Bitte trage heute noch deinen Tageseintrag im Berichtsheft ein.'
const DEFAULT_TIMEZONE = 'Europe/Berlin'
const DEFAULT_TARGET_HOUR = 21
const WEEKDAY_TO_KEY: Record<string, string> = {
  Mon: 'Mo',
  Tue: 'Di',
  Wed: 'Mi',
  Thu: 'Do',
  Fri: 'Fr',
  Sat: 'Sa',
  Sun: 'So'
}

const toUniqueNames = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const normalized = String(value || '').trim()
    if (!normalized) continue
    const key = normalized.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(normalized)
  }
  return out
}

const chunk = <T>(list: T[], size: number) => {
  const result: T[][] = []
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size))
  }
  return result
}

const getLocalDateParts = (value: Date, timeZone: string): LocalDateParts => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  })

  const map: Record<string, string> = {}
  for (const part of formatter.formatToParts(value)) {
    if (part.type !== 'literal') {
      map[part.type] = part.value
    }
  }

  return {
    isoDate: `${map.year}-${map.month}-${map.day}`,
    weekdayShort: map.weekday || '',
    hour: Number(map.hour || 0)
  }
}

const hasDayContent = (entries: Record<string, unknown> | null | undefined, dayKey: string) => {
  if (!entries || typeof entries !== 'object') return false
  const rows = (entries as Record<string, unknown>)[dayKey]
  if (!Array.isArray(rows)) return false
  return rows.some((row) => {
    if (!row || typeof row !== 'object') return false
    const taetigkeit = String((row as Record<string, unknown>).taetigkeit || '').trim()
    return taetigkeit.length > 0
  })
}

const sendPushToUser = async ({
  adminClient,
  userName,
  title,
  message,
  type,
  notificationId,
  localDate
}: {
  adminClient: ReturnType<typeof createClient>
  userName: string
  title: string
  message: string
  type: string
  notificationId?: string | number | null
  localDate: string
}) => {
  const { data: subscriptions, error: subscriptionsError } = await adminClient
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_name', userName)

  if (subscriptionsError) {
    console.error('Failed loading subscriptions for reminder push:', subscriptionsError)
    return { sent: 0, failed: 1, removed: 0 }
  }

  if (!subscriptions?.length) {
    return { sent: 0, failed: 0, removed: 0 }
  }

  const payload = JSON.stringify({
    title,
    message,
    type,
    notificationId: notificationId ?? null,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    url: '/',
    tag: `berichtsheft-reminder-${localDate}`,
    data: {
      url: '/',
      view: 'berichtsheft',
      source: 'berichtsheft-reminder'
    },
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
      const e = error as { statusCode?: number; status?: number }
      const statusCode = Number(e.statusCode || e.status || 0)
      if (statusCode === 404 || statusCode === 410) {
        staleIds.push(subscription.id)
      } else {
        failed += 1
      }
      console.error('Reminder push send error:', {
        userName,
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
      console.error('Failed deleting stale reminder subscriptions:', deleteError)
    } else {
      removed = staleIds.length
    }
  }

  return { sent, failed, removed }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const reminderSecret = Deno.env.get('BERICHTSHEFT_REMINDER_SECRET')
  const vapidPublicKey = Deno.env.get('WEB_PUSH_PUBLIC_KEY')
  const vapidPrivateKey = Deno.env.get('WEB_PUSH_PRIVATE_KEY')
  const vapidSubject = Deno.env.get('WEB_PUSH_SUBJECT') || 'mailto:admin@example.com'
  const reminderTimezone = Deno.env.get('BERICHTSHEFT_REMINDER_TIMEZONE') || DEFAULT_TIMEZONE
  const targetHour = Number(Deno.env.get('BERICHTSHEFT_REMINDER_TARGET_HOUR') || DEFAULT_TARGET_HOUR)

  if (!supabaseUrl || !serviceRoleKey || !reminderSecret) {
    return json({ error: 'Missing required environment variables for reminder function.' }, 500)
  }

  const requestSecret = req.headers.get('x-reminder-secret') || ''
  if (requestSecret !== reminderSecret) {
    return json({ error: 'Unauthorized request.' }, 401)
  }

  let body: ReminderRequestBody = {}
  try {
    body = await req.json()
  } catch (_error) {
    body = {}
  }

  const force = Boolean(body.force)
  const dryRun = Boolean(body.dryRun)

  const now = new Date()
  const localNow = getLocalDateParts(now, reminderTimezone)
  const dayKey = WEEKDAY_TO_KEY[localNow.weekdayShort]

  if (!dayKey) {
    return json({
      ok: true,
      skipped: true,
      reason: `Unsupported weekday mapping: ${localNow.weekdayShort}`,
      localDate: localNow.isoDate
    })
  }

  if (!force && localNow.hour !== targetHour) {
    return json({
      ok: true,
      skipped: true,
      reason: `Current local hour (${localNow.hour}) does not match target (${targetHour}).`,
      localDate: localNow.isoDate
    })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const { data: profiles, error: profilesError } = await adminClient
    .from('profiles')
    .select('name, role, approved')
    .eq('approved', true)

  if (profilesError) {
    console.error('Failed loading profiles for reminders:', profilesError)
    return json({ error: 'Failed loading profiles.' }, 500)
  }

  const targetNames = toUniqueNames(
    (profiles as ProfileRow[] || [])
      .filter((profile) => {
        const role = String(profile.role || '').trim().toLowerCase()
        return !STAFF_ROLES.has(role)
      })
      .map((profile) => profile.name)
  )

  if (targetNames.length === 0) {
    return json({
      ok: true,
      skipped: true,
      reason: 'No target users found.',
      localDate: localNow.isoDate
    })
  }

  const hasDayEntryByUser = new Map<string, boolean>()
  for (const batch of chunk(targetNames, 120)) {
    const { data: reports, error: reportsError } = await adminClient
      .from('berichtsheft')
      .select('user_name, entries')
      .in('user_name', batch)
      .lte('week_start', localNow.isoDate)
      .gte('week_end', localNow.isoDate)

    if (reportsError) {
      console.error('Failed loading berichtsheft reports:', reportsError)
      return json({ error: 'Failed loading berichtsheft entries.' }, 500)
    }

    for (const report of (reports as BerichtsheftRow[] || [])) {
      const name = String(report.user_name || '').trim()
      if (!name) continue
      const hasEntry = hasDayContent(report.entries, dayKey)
      if (hasEntry) {
        hasDayEntryByUser.set(name.toLowerCase(), true)
      } else if (!hasDayEntryByUser.has(name.toLowerCase())) {
        hasDayEntryByUser.set(name.toLowerCase(), false)
      }
    }
  }

  const sinceIso = new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  const alreadySentToday = new Set<string>()
  for (const batch of chunk(targetNames, 120)) {
    const { data: existingReminders, error: remindersError } = await adminClient
      .from('notifications')
      .select('user_name, created_at')
      .eq('type', REMINDER_NOTIFICATION_TYPE)
      .gte('created_at', sinceIso)
      .in('user_name', batch)

    if (remindersError) {
      console.error('Failed loading existing reminders:', remindersError)
      return json({ error: 'Failed loading existing reminders.' }, 500)
    }

    for (const item of (existingReminders as ReminderNotificationRow[] || [])) {
      const userName = String(item.user_name || '').trim()
      const createdAt = String(item.created_at || '').trim()
      if (!userName || !createdAt) continue
      const createdLocalDate = getLocalDateParts(new Date(createdAt), reminderTimezone).isoDate
      if (createdLocalDate === localNow.isoDate) {
        alreadySentToday.add(userName.toLowerCase())
      }
    }
  }

  const recipients = targetNames.filter((name) => {
    const key = name.toLowerCase()
    if (alreadySentToday.has(key)) return false
    return !hasDayEntryByUser.get(key)
  })

  if (dryRun) {
    return json({
      ok: true,
      dryRun: true,
      localDate: localNow.isoDate,
      dayKey,
      targetUsers: targetNames.length,
      recipients
    })
  }

  const pushEnabled = Boolean(vapidPublicKey && vapidPrivateKey)
  if (pushEnabled) {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey as string, vapidPrivateKey as string)
  }

  let insertedNotifications = 0
  let pushSent = 0
  let pushFailed = 0
  let pushRemoved = 0

  for (const recipient of recipients) {
    try {
      const { data: notif, error: insertError } = await adminClient
        .from('notifications')
        .insert([{
          user_name: recipient,
          title: DEFAULT_TITLE,
          message: DEFAULT_MESSAGE,
          type: REMINDER_NOTIFICATION_TYPE,
          read: false
        }])
        .select('id')
        .single()

      if (insertError) {
        console.error('Failed inserting reminder notification:', insertError)
        continue
      }

      insertedNotifications += 1

      if (!pushEnabled) continue
      const pushResult = await sendPushToUser({
        adminClient,
        userName: recipient,
        title: DEFAULT_TITLE,
        message: DEFAULT_MESSAGE,
        type: REMINDER_NOTIFICATION_TYPE,
        notificationId: (notif as { id?: string | number } | null)?.id ?? null,
        localDate: localNow.isoDate
      })
      pushSent += pushResult.sent
      pushFailed += pushResult.failed
      pushRemoved += pushResult.removed
    } catch (error) {
      console.error('Unexpected reminder error for recipient:', recipient, error)
    }
  }

  return json({
    ok: true,
    source: body.source || 'manual',
    localDate: localNow.isoDate,
    dayKey,
    targetUsers: targetNames.length,
    remindersCreated: insertedNotifications,
    recipients: recipients.length,
    push: {
      enabled: pushEnabled,
      sent: pushSent,
      failed: pushFailed,
      removed: pushRemoved
    }
  })
})
