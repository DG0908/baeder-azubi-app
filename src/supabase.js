import { createClient } from '@supabase/supabase-js';

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
}

const rawSupabase = createClient(supabaseUrl, supabaseAnonKey);

const unsafeLegacyWritesFlag = String(import.meta.env.VITE_ENABLE_UNSAFE_LEGACY_DB_WRITES || '')
  .trim()
  .toLowerCase();

export const LEGACY_FRONTEND_WRITE_PROTECTION_ENABLED = unsafeLegacyWritesFlag !== 'true';
export const LEGACY_FRONTEND_WRITE_PROTECTION_MESSAGE =
  'Frontend-Schreibzugriffe sind gesperrt. Bitte die Backend-API verwenden.';

const BLOCKED_FRONTEND_TABLE_WRITES = new Set([
  'app_config',
  'custom_questions',
  'forum_posts',
  'forum_replies',
  'games',
  'invitation_codes',
  'materials',
  'messages',
  'news',
  'notifications',
  'organizations',
  'push_subscriptions',
  'practical_exam_attempts',
  'profiles',
  'question_reports',
  'resources',
  'exams',
  'theory_exam_attempts',
  'user_badges',
  'user_stats'
]);

const BLOCKED_FRONTEND_RPCS = new Set([
  'create_user_profile',
  'use_invitation_code'
]);

const warnedOperations = new Set();

const createLegacyWriteError = (target, operation) => ({
  code: 'legacy_frontend_write_blocked',
  message: `Security mode blocks frontend ${operation} on "${target}". Use the backend API instead.`,
  details: 'Set VITE_ENABLE_UNSAFE_LEGACY_DB_WRITES=true only in an isolated migration environment.',
  hint: LEGACY_FRONTEND_WRITE_PROTECTION_MESSAGE
});

const logBlockedOperation = (target, operation) => {
  const key = `${target}:${operation}`;
  if (warnedOperations.has(key)) return;
  warnedOperations.add(key);
  console.warn(
    `[security] Blocked legacy frontend ${operation} on "${target}". ` +
    'Use the NestJS backend instead.'
  );
};

const createBlockedMutationChain = (target, operation) => {
  logBlockedOperation(target, operation);

  const result = Promise.resolve({
    data: null,
    error: createLegacyWriteError(target, operation),
    count: null,
    status: 403,
    statusText: 'Legacy frontend write blocked'
  });

  let proxy = null;
  proxy = new Proxy({}, {
    get(_obj, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return result[prop].bind(result);
      }

      if (prop === 'throwOnError') {
        return async () => {
          const errorData = createLegacyWriteError(target, operation);
          throw Object.assign(new Error(errorData.message), errorData);
        };
      }

      return () => proxy;
    }
  });

  return proxy;
};

const wrapQueryBuilder = (table, builder) => {
  if (!LEGACY_FRONTEND_WRITE_PROTECTION_ENABLED || !BLOCKED_FRONTEND_TABLE_WRITES.has(table)) {
    return builder;
  }

  return new Proxy(builder, {
    get(target, prop, receiver) {
      const propName = String(prop);
      if (propName === 'insert' || propName === 'update' || propName === 'upsert' || propName === 'delete') {
        return () => createBlockedMutationChain(table, propName);
      }

      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'function' ? value.bind(target) : value;
    }
  });
};

export const supabase = new Proxy(rawSupabase, {
  get(target, prop, receiver) {
    if (prop === 'from') {
      return (table) => wrapQueryBuilder(table, target.from(table));
    }

    if (prop === 'rpc') {
      return (fnName, args, options) => {
        if (LEGACY_FRONTEND_WRITE_PROTECTION_ENABLED && BLOCKED_FRONTEND_RPCS.has(fnName)) {
          return Promise.resolve({
            data: null,
            error: createLegacyWriteError(`rpc:${fnName}`, 'rpc'),
            count: null,
            status: 403,
            statusText: 'Legacy frontend write blocked'
          });
        }

        return target.rpc(fnName, args, options);
      };
    }

    const value = Reflect.get(target, prop, receiver);
    return typeof value === 'function' ? value.bind(target) : value;
  }
});
