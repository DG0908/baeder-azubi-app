/**
 * Data Service Layer — Dual-mode adapter for Supabase ↔ NestJS API.
 *
 * Every function returns data in the SAME shape that App.jsx / views expect,
 * regardless of which backend is active. When VITE_ENABLE_SECURE_BACKEND_API
 * is true, the NestJS endpoints (via secureApi.js) are used; otherwise
 * Supabase is called directly.
 *
 * This module is the single place where NestJS → frontend mapping happens
 * for App.jsx data loading. Individual views that have their own Supabase
 * imports will get their own adapters later.
 */

import { isSecureBackendApiEnabled } from './secureApiClient';
import {
  secureUsersApi,
  secureAppConfigApi,
  secureDuelsApi,
  secureChatApi,
  secureNotificationsApi,
  secureContentApi,
  secureFlashcardsApi,
  secureQuestionWorkflowsApi,
  secureUserStatsApi,
  secureExamSimulatorApi,
  secureSchoolAttendanceApi,
  secureExamGradesApi,
  secureReportBooksApi,
  secureSwimSessionsApi,
  secureSwimTrainingPlansApi,
  mapBackendUserToFrontendUser,
  mapFrontendRoleToBackendRole
} from './secureApi';

const USE_SECURE_API = isSecureBackendApiEnabled();

// ─── Helper ──────────────────────────────────────────────────────────

const safe = async (fn, fallback) => {
  try {
    return await fn();
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[dataService]', e);
    return fallback;
  }
};

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const pickPayloadValue = (payload, ...keys) => {
  if (!isPlainObject(payload)) return undefined;
  for (const key of keys) {
    if (payload[key] !== undefined) {
      return payload[key];
    }
  }
  return undefined;
};

const normalizeSignatureField = (field) => {
  const normalized = String(field || '').trim();
  if (normalized === 'teacher_signature' || normalized === 'teacherSignature') {
    return 'teacherSignature';
  }
  if (normalized === 'trainer_signature' || normalized === 'trainerSignature') {
    return 'trainerSignature';
  }
  return normalized;
};

const mapChatMessageToFrontend = (message, fallback = {}) => ({
  id: message?.id,
  user: fallback.userName || message?.senderName || message?.user_name || message?.sender?.displayName || 'Unbekannt',
  text: message?.content || message?.text || '',
  time: new Date(message?.createdAt || message?.created_at || Date.now()).getTime(),
  avatar: fallback.avatar ?? message?.senderAvatar ?? message?.user_avatar ?? message?.sender?.avatar ?? null,
  senderId: fallback.senderId || message?.senderId || message?.sender_id || message?.sender?.id || null,
  senderRole: String(
    fallback.senderRole || message?.senderRole || message?.user_role || message?.sender?.role || 'azubi'
  ).toLowerCase(),
  scope: String(
    fallback.scope || message?.scope || message?.chatScope || message?.chat_scope || 'public'
  ).toLowerCase(),
  organizationId: fallback.organizationId ?? message?.organizationId ?? message?.organization_id ?? null,
  recipientId: fallback.recipientId ?? message?.recipientId ?? message?.recipient_id ?? null
});

const mapQuestionSubmissionToFrontend = (question, fallback = {}) => ({
  id: question?.id,
  text: question?.question || question?.text || fallback.question || '',
  category: question?.category || fallback.category || '',
  answers: Array.isArray(question?.answers)
    ? question.answers
    : (Array.isArray(fallback.answers) ? fallback.answers : []),
  correct: question?.correctIndex ?? question?.correct ?? fallback.correct ?? 0,
  submittedBy: question?.createdBy || question?.creator?.displayName || question?.created_by || fallback.createdBy || '',
  approved: question?.approved ?? fallback.approved ?? false,
  time: new Date(question?.createdAt || question?.created_at || Date.now()).getTime()
});

const mapPermissionFieldToProfileColumn = (field) => {
  if (field === 'canSignReports') return 'can_sign_reports';
  if (field === 'canViewSchoolCards') return 'can_view_school_cards';
  if (field === 'canViewExamGrades') return 'can_view_exam_grades';
  return field;
};

const mapSecureReportBookToFrontendEntry = (entry) => ({
  id: entry.id,
  user_name: entry.userName,
  week_start: entry.weekStart,
  week_end: entry.weekEnd,
  ausbildungsjahr: entry.trainingYear,
  nachweis_nr: entry.evidenceNumber || entry.reportNumber,
  entries: entry.entries,
  bemerkung_azubi: entry.apprenticeNote || entry.azubiRemarks,
  bemerkung_ausbilder: entry.trainerNote || entry.trainerRemarks,
  signatur_azubi: entry.apprenticeSignature || entry.azubiSignature,
  signatur_ausbilder: entry.trainerSignature,
  datum_azubi: entry.apprenticeSignatureDate || entry.azubiDate,
  datum_ausbilder: entry.trainerSignatureDate || entry.trainerDate,
  total_hours: entry.totalHours,
  status: entry.status,
  assigned_trainer_id: entry.assignedTrainerId,
  assigned_trainer_name: entry.assignedTrainerName,
  assigned_by_id: entry.assignedById,
  assigned_at: entry.assignedAt,
  created_at: entry.createdAt,
  updated_at: entry.updatedAt
});

const mapSecureSwimTrainingPlanToFrontendEntry = (plan) => ({
  id: plan.id,
  name: plan.name,
  category: plan.category,
  difficulty: plan.difficulty,
  style_id: pickPayloadValue(plan, 'style_id', 'styleId'),
  target_distance: pickPayloadValue(plan, 'target_distance', 'targetDistance'),
  target_time: pickPayloadValue(plan, 'target_time', 'targetTime'),
  units_json: pickPayloadValue(plan, 'units_json', 'units') || [],
  xp_reward: pickPayloadValue(plan, 'xp_reward', 'xpReward'),
  description: plan.description,
  created_by_user_id: pickPayloadValue(plan, 'created_by_user_id', 'createdByUserId'),
  created_by_name: pickPayloadValue(plan, 'created_by_name', 'createdByName'),
  created_by_role: pickPayloadValue(plan, 'created_by_role', 'createdByRole'),
  assigned_user_id: pickPayloadValue(plan, 'assigned_user_id', 'assignedUserId'),
  assigned_user_name: pickPayloadValue(plan, 'assigned_user_name', 'assignedUserName'),
  assigned_user_role: pickPayloadValue(plan, 'assigned_user_role', 'assignedUserRole'),
  created_at: pickPayloadValue(plan, 'created_at', 'createdAt'),
  is_active: true
});

const mapSecurePracticalAttemptToFrontendEntry = (attempt) => ({
  id: attempt.id,
  user_id: attempt.userId,
  user_name: attempt.userName,
  exam_type: attempt.examType,
  average_grade: attempt.averageGrade,
  graded_count: attempt.gradedCount,
  passed: attempt.passed,
  result_rows: attempt.resultRows || attempt.rows || [],
  created_at: attempt.createdAt,
  created_by: attempt.createdById || attempt.createdBy,
  created_by_name: attempt.createdByName,
  source: 'remote'
});

const toSecureSchoolAttendancePayload = (payload) => ({
  date: String(pickPayloadValue(payload, 'date') || ''),
  startTime: String(pickPayloadValue(payload, 'startTime', 'start_time') || ''),
  endTime: String(pickPayloadValue(payload, 'endTime', 'end_time') || '')
});

const toSecureExamGradePayload = (payload) => ({
  date: String(pickPayloadValue(payload, 'date') || ''),
  subject: String(pickPayloadValue(payload, 'subject') || ''),
  topic: String(pickPayloadValue(payload, 'topic') || ''),
  grade: Number(pickPayloadValue(payload, 'grade') || 0),
  notes: pickPayloadValue(payload, 'notes') ?? undefined
});

const toSecureMaterialPayload = (payload) => ({
  title: String(pickPayloadValue(payload, 'title') || ''),
  category: String(pickPayloadValue(payload, 'category') || ''),
  content: pickPayloadValue(payload, 'content') ?? undefined,
  type: pickPayloadValue(payload, 'type') ?? undefined,
  url: pickPayloadValue(payload, 'url') ?? undefined
});

const toSecureResourcePayload = (payload) => ({
  title: String(pickPayloadValue(payload, 'title') || ''),
  description: pickPayloadValue(payload, 'description') ?? undefined,
  url: String(pickPayloadValue(payload, 'url') || ''),
  category: String(pickPayloadValue(payload, 'category') || '')
});

const toSecureNewsPayload = (payload) => ({
  title: String(pickPayloadValue(payload, 'title') || ''),
  content: String(pickPayloadValue(payload, 'content') || '')
});

const toSecureExamPayload = (payload) => ({
  title: String(pickPayloadValue(payload, 'title') || ''),
  description: pickPayloadValue(payload, 'description') ?? undefined,
  examDate: pickPayloadValue(payload, 'examDate', 'exam_date') ?? undefined,
  location: pickPayloadValue(payload, 'location') ?? undefined
});

const toSecureSwimSessionPayload = (payload) => ({
  date: String(pickPayloadValue(payload, 'date') || ''),
  distanceMeters: Number(pickPayloadValue(payload, 'distanceMeters', 'distance') || 0),
  timeMinutes: Number(pickPayloadValue(payload, 'timeMinutes', 'time_minutes') || 0),
  styleId: String(pickPayloadValue(payload, 'styleId', 'style') || ''),
  notes: pickPayloadValue(payload, 'notes') ?? undefined,
  challengeId: pickPayloadValue(payload, 'challengeId', 'challenge_id') ?? undefined
});

const toSecureSwimTrainingPlanUnits = (payload) => {
  const units = pickPayloadValue(payload, 'units', 'units_json');
  if (!Array.isArray(units)) return [];

  return units.map((unit, index) => ({
    id: String(pickPayloadValue(unit, 'id') || `unit_${index + 1}`),
    styleId: String(pickPayloadValue(unit, 'styleId', 'style_id') || ''),
    targetDistance: Number(pickPayloadValue(unit, 'targetDistance', 'target_distance') || 0),
    targetTime: Number(pickPayloadValue(unit, 'targetTime', 'target_time') || 0)
  }));
};

const toSecureSwimTrainingPlanPayload = (payload) => ({
  name: String(pickPayloadValue(payload, 'name') || ''),
  category: String(pickPayloadValue(payload, 'category') || ''),
  difficulty: String(pickPayloadValue(payload, 'difficulty') || ''),
  units: toSecureSwimTrainingPlanUnits(payload),
  xpReward: Number(pickPayloadValue(payload, 'xpReward', 'xp_reward') || 0),
  description: pickPayloadValue(payload, 'description') ?? undefined,
  assignedUserId: pickPayloadValue(payload, 'assignedUserId', 'assigned_user_id') ?? undefined
});

const toSecureReportBookPayload = (payload, entryId = null) => ({
  entryId: entryId || pickPayloadValue(payload, 'entryId', 'id') || undefined,
  weekStart: String(pickPayloadValue(payload, 'weekStart', 'week_start') || ''),
  trainingYear: Number(pickPayloadValue(payload, 'trainingYear', 'ausbildungsjahr') || 0),
  evidenceNumber: Number(pickPayloadValue(payload, 'evidenceNumber', 'reportNumber', 'nachweis_nr') || 0),
  entries: pickPayloadValue(payload, 'entries') || {},
  apprenticeNote: pickPayloadValue(payload, 'apprenticeNote', 'azubiRemarks', 'bemerkung_azubi') ?? undefined,
  trainerNote: pickPayloadValue(payload, 'trainerNote', 'trainerRemarks', 'bemerkung_ausbilder') ?? undefined,
  apprenticeSignature: pickPayloadValue(payload, 'apprenticeSignature', 'azubiSignature', 'signatur_azubi') ?? undefined,
  trainerSignature: pickPayloadValue(payload, 'trainerSignature', 'signatur_ausbilder') ?? undefined,
  apprenticeSignatureDate: pickPayloadValue(payload, 'apprenticeSignatureDate', 'azubiDate', 'datum_azubi') ?? undefined,
  trainerSignatureDate: pickPayloadValue(payload, 'trainerSignatureDate', 'trainerDate', 'datum_ausbilder') ?? undefined
});

const toSecureAssignTrainerPayload = (payload) => ({
  trainerId: String(pickPayloadValue(payload, 'trainerId', 'assigned_trainer_id') || '')
});

const toSecurePracticalExamAttemptPayload = (payload) => ({
  examType: String(pickPayloadValue(payload, 'examType', 'exam_type') || ''),
  userId: pickPayloadValue(payload, 'userId', 'user_id') || undefined,
  inputValues: pickPayloadValue(payload, 'inputValues', 'input_values') || {}
});

const toSecureTheoryExamAnswerPayload = (answer) => {
  const question = isPlainObject(answer?.question) ? answer.question : {};
  const questionId = String(pickPayloadValue(answer, 'questionId') || pickPayloadValue(question, 'id') || '').trim();
  if (!questionId) return null;

  if (answer?.answerType === 'keyword' || answer?.keywordText !== undefined) {
    return {
      questionId,
      keywordText: String(answer?.keywordText || '')
    };
  }

  const selectedAnswerIndices = Array.isArray(answer?.selectedAnswers)
    ? answer.selectedAnswers
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0)
    : [];
  if (selectedAnswerIndices.length > 0) {
    return {
      questionId,
      selectedAnswerIndices
    };
  }

  const selectedAnswerIndex = Number(answer?.selectedAnswer);
  if (Number.isInteger(selectedAnswerIndex) && selectedAnswerIndex >= 0) {
    return {
      questionId,
      selectedAnswerIndex
    };
  }

  return {
    questionId
  };
};

const toSecureQuestionReportPayload = (payload) => ({
  questionKey: String(pickPayloadValue(payload, 'questionKey', 'question_key') || ''),
  questionText: String(pickPayloadValue(payload, 'questionText', 'question_text') || ''),
  category: String(pickPayloadValue(payload, 'category') || ''),
  source: String(pickPayloadValue(payload, 'source') || ''),
  note: pickPayloadValue(payload, 'note') ?? undefined,
  answers: Array.isArray(pickPayloadValue(payload, 'answers')) ? pickPayloadValue(payload, 'answers') : undefined
});

const toSecurePushTestPayload = (payload) => ({
  targetScope: pickPayloadValue(payload, 'targetScope') || undefined,
  delaySeconds: Number(pickPayloadValue(payload, 'delaySeconds') || 0)
});

// ─── Users ───────────────────────────────────────────────────────────

/**
 * Returns { allUsers, pendingUsers } in the same shape as Supabase profiles rows.
 */
export const loadUsers = async (supabase, currentUser) => {
  if (USE_SECURE_API) {
    const mapUser = (u) => {
      const mapped = mapBackendUserToFrontendUser(u);
      // App.jsx expects snake_case fields from Supabase profiles
      return {
        ...mapped,
        name: mapped.name || u.displayName,
        approved: mapped.approved,
        organization_id: mapped.organizationId,
        birth_date: mapped.birthDate,
        training_end: mapped.trainingEnd,
        last_login: mapped.lastLogin,
        created_at: mapped.createdAt,
        is_owner: mapped.isOwner || false,
        can_view_school_cards: mapped.canViewSchoolCards || false,
        can_view_exam_grades: mapped.canViewExamGrades || false,
        can_sign_reports: mapped.canSignReports || false
      };
    };

    if (currentUser?.permissions?.canManageUsers) {
      const [allRaw, pendingRaw] = await Promise.all([
        secureUsersApi.list(),
        secureUsersApi.pending()
      ]);
      const all = (allRaw || []).map(mapUser);
      const pending = (pendingRaw || []).map(mapUser);
      const approved = all.filter(u => u.approved);
      return { allUsers: approved, pendingUsers: pending };
    }

    const contacts = await secureUsersApi.contacts();
    const mapped = (contacts || []).map(mapUser);
    return { allUsers: mapped, pendingUsers: [] };
  }

  // Supabase path
  if (currentUser?.permissions?.canManageUsers) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    const approved = (data || []).filter(u => u.approved);
    const pending = (data || []).filter(u => !u.approved);
    return { allUsers: approved, pendingUsers: pending };
  }

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('approved', true);
  return { allUsers: data || [], pendingUsers: [] };
};

// ─── App Config ──────────────────────────────────────────────────────

export const loadAppConfig = async (supabase) => {
  if (USE_SECURE_API) {
    const config = await safe(() => secureAppConfigApi.get(), null);
    if (!config) return null;
    return {
      menuItems: config.menuItems || null,
      themeColors: config.themeColors || null
    };
  }

  const { data, error } = await supabase
    .from('app_config')
    .select('id, menu_items, theme_colors')
    .eq('id', 'main')
    .single();

  if (error || !data) return null;
  return {
    menuItems: data.menu_items || null,
    themeColors: data.theme_colors || null
  };
};

export const saveAppConfig = async (supabase, config) => {
  if (USE_SECURE_API) {
    await secureAppConfigApi.update(config);
    return;
  }

  const { error } = await supabase
    .from('app_config')
    .upsert({
      id: 'main',
      menu_items: config.menuItems,
      theme_colors: config.themeColors
    }, { onConflict: 'id' });
  if (error) throw error;
};

// ─── Games / Duels ───────────────────────────────────────────────────

const mapDuelToGame = (d, currentUserId) => {
  const status = mapDuelStatus(d.status);
  // Restore client-managed game state from backend gameState JSON
  const gs = d.gameState || {};

  const player1 = d.challenger?.displayName || '';
  const player2 = d.opponent?.displayName || '';
  const effectiveStatus = gs.status || status;
  // If game is active but no currentTurn saved, default to player1 (challenger picks first)
  const currentTurn = gs.currentTurn || (effectiveStatus === 'active' ? player1 : '');

  return {
    id: d.id,
    player1,
    player2,
    player1Score: gs.player1Score ?? 0,
    player2Score: gs.player2Score ?? 0,
    currentTurn,
    categoryRound: gs.categoryRound ?? 0,
    round: gs.categoryRound ?? 0,
    status: effectiveStatus,
    difficulty: gs.difficulty || 'normal',
    categoryRounds: gs.categoryRounds || [],
    winner: gs.winner || d.winnerUser?.displayName || null,
    questionHistory: [],
    updatedAt: d.updatedAt,
    createdAt: d.createdAt,
    challengeTimeoutMinutes: gs.challengeTimeoutMinutes || 60,
    challengeExpiresAt: d.expiresAt || null,
    questionCount: d.questionCount || 5,
    challengerId: d.challenger?.id || null,
    opponentId: d.opponent?.id || null
  };
};

const mapDuelStatus = (status) => {
  if (!status) return 'unknown';
  const s = String(status).toUpperCase();
  if (s === 'PENDING') return 'waiting';
  if (s === 'ACTIVE') return 'active';
  if (s === 'FINISHED' || s === 'COMPLETED') return 'finished';
  if (s === 'EXPIRED') return 'finished';
  return status.toLowerCase();
};

export const loadGames = async (supabase, limit = 200, currentUserId = null) => {
  if (USE_SECURE_API) {
    const duels = await secureDuelsApi.list();
    return (duels || []).map(d => mapDuelToGame(d, currentUserId));
  }

  const { data } = await supabase
    .from('games')
    .select('id, player1, player2, player1_score, player2_score, current_turn, round, status, difficulty, rounds_data, winner, updated_at, created_at, challenge_timeout_minutes, challenge_expires_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!data) return [];
  return data.map(g => {
    let winner = g.winner || null;
    if (!winner && g.status === 'finished') {
      if (g.player1_score > g.player2_score) winner = g.player1;
      else if (g.player2_score > g.player1_score) winner = g.player2;
    }
    return {
      id: g.id, player1: g.player1, player2: g.player2,
      player1Score: g.player1_score, player2Score: g.player2_score,
      currentTurn: g.current_turn, categoryRound: g.round || 0, round: g.round || 0,
      status: g.status, difficulty: g.difficulty, categoryRounds: g.rounds_data || [],
      winner, questionHistory: [], updatedAt: g.updated_at, createdAt: g.created_at,
      challengeTimeoutMinutes: g.challenge_timeout_minutes,
      challengeExpiresAt: g.challenge_expires_at || null
    };
  });
};

// ─── Chat Messages ───────────────────────────────────────────────────

export const loadMessages = async (supabase, normalizeFn, userDirectory, userRole) => {
  if (USE_SECURE_API) {
    // Load room scopes in parallel (backend returns one scope at a time)
    // DIRECT_STAFF requires recipientId so it's loaded on-demand in the chat view
    // AZUBI_ROOM is only accessible by apprentices; staff/admin only see STAFF_ROOM
    const isApprentice = ['azubi', 'rettungsschwimmer_azubi'].includes(String(userRole).toLowerCase());
    const scopes = isApprentice ? ['AZUBI_ROOM', 'STAFF_ROOM'] : ['STAFF_ROOM'];
    const results = await Promise.allSettled(
      scopes.map(scope => secureChatApi.list({ scope, limit: 100 }))
    );
    const allMessages = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allMessages.push(...result.value.map((message) => mapChatMessageToFrontend(message)));
      }
    }
    return allMessages;
  }

  const { data } = await supabase
    .from('messages')
    .select('id, content, user_name, sender_id, created_at, chat_scope, recipient_id, user_avatar')
    .order('created_at', { ascending: true })
    .limit(100);

  if (!data) return [];
  return data.map(row => normalizeFn(row, userDirectory));
};

export const createChatMessage = async (supabase, payload) => {
  const messagePayload = {
    content: payload?.content || '',
    scope: String(payload?.scope || 'public').trim(),
    userName: payload?.userName || 'Unbekannt',
    avatar: payload?.avatar || null,
    senderRole: payload?.senderRole || 'azubi',
    senderId: payload?.senderId || null,
    organizationId: payload?.organizationId || null,
    recipientId: payload?.recipientId || null
  };

  if (USE_SECURE_API) {
    const requestPayload = {
      content: messagePayload.content,
      scope: messagePayload.scope.toUpperCase()
    };
    if (messagePayload.recipientId) {
      requestPayload.recipientId = messagePayload.recipientId;
    }
    const result = await secureChatApi.create(requestPayload);
    return mapChatMessageToFrontend(result, messagePayload);
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([{
      user_name: messagePayload.userName,
      user_avatar: messagePayload.avatar,
      user_role: messagePayload.senderRole,
      sender_id: messagePayload.senderId,
      organization_id: messagePayload.organizationId,
      chat_scope: messagePayload.scope,
      recipient_id: messagePayload.recipientId,
      content: messagePayload.content
    }])
    .select('*')
    .single();

  if (error) throw error;
  return mapChatMessageToFrontend(data, messagePayload);
};

// ─── Notifications ───────────────────────────────────────────────────

export const loadNotifications = async (supabase, userName) => {
  if (USE_SECURE_API) {
    const notifs = await secureNotificationsApi.list();
    return (notifs || []).map(n => ({
      id: n.id,
      title: n.title || '',
      message: n.message || n.body || '',
      type: n.type || 'info',
      read: Boolean(n.read ?? n.isRead),
      createdAt: n.createdAt
    }));
  }

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_name', userName)
    .order('created_at', { ascending: false })
    .limit(50);

  return (data || []).map(n => ({
    id: n.id,
    title: n.title || '',
    message: n.message || '',
    type: n.type || 'info',
    read: Boolean(n.read),
    createdAt: n.created_at
  }));
};

export const sendNotification = async (supabase, { userName, title, message, type = 'info', triggerPush = true }) => {
  if (USE_SECURE_API) {
    // Secure-backend mode emits notifications server-side from the action endpoints.
    // The legacy generic notification insert is Supabase-specific and should not
    // produce invalid DTO requests against NestJS.
    return null;
  }

  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_name: userName, title, message, type, read: false }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const markNotificationRead = async (supabase, notifId) => {
  if (USE_SECURE_API) {
    await secureNotificationsApi.markRead(notifId);
    return;
  }

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notifId);
  if (error) throw error;
};

export const clearAllNotifications = async (supabase, userName) => {
  if (USE_SECURE_API) {
    await secureNotificationsApi.clear();
    return;
  }

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_name', userName);
  if (error) throw error;
};

// ─── User Stats ──────────────────────────────────────────────────────

export const getUserStats = async (supabase, userInput) => {
  if (USE_SECURE_API) {
    return safe(() => secureUserStatsApi.me(), null);
  }

  const userId = userInput?.id;
  if (!userId) return null;
  const { data } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data;
};

export const getAllUserStats = async (supabase) => {
  if (USE_SECURE_API) {
    return safe(() => secureUserStatsApi.summary(), []);
  }

  const { data } = await supabase
    .from('user_stats')
    .select('user_id, wins, losses, draws, category_stats');
  return data || [];
};

export const saveUserStats = async (supabase, userInput, stats) => {
  if (USE_SECURE_API) {
    // The NestJS backend manages stats server-side via duel answers.
    // For now, we only persist category_stats from the frontend.
    // Full server-side stats sync is handled by the backend.
    return;
  }

  const userId = userInput?.id;
  const userName = userInput?.name;
  if (!userId) return;

  const { error } = await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      user_name: userName,
      wins: stats.wins || 0,
      losses: stats.losses || 0,
      draws: stats.draws || 0,
      category_stats: stats.category_stats || stats.categoryStats || {},
      opponents: stats.opponents || {}
    }, { onConflict: 'user_id' });
  if (error) throw error;
};

// ─── Content (Materials, Resources, News, Exams) ─────────────────────

export const loadMaterials = async (supabase) => {
  if (USE_SECURE_API) {
    const data = await secureContentApi.listMaterials();
    return (data || []).map(m => ({
      id: m.id,
      title: m.title,
      content: m.content,
      category: m.category,
      type: m.type,
      url: m.url,
      createdBy: m.createdBy || m.creator?.displayName || '',
      time: new Date(m.createdAt || Date.now()).getTime()
    }));
  }

  const { data } = await supabase
    .from('materials')
    .select('id, title, content, category, type, url, created_by, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  return (data || []).map(m => ({
    id: m.id, title: m.title, content: m.content, category: m.category,
    type: m.type, url: m.url, createdBy: m.created_by,
    time: new Date(m.created_at).getTime()
  }));
};

export const loadResources = async (supabase) => {
  if (USE_SECURE_API) {
    const data = await secureContentApi.listResources();
    return (data || []).map(r => ({
      id: r.id, title: r.title, description: r.description,
      url: r.url, type: r.category || r.type,
      addedBy: r.createdBy || r.creator?.displayName || '',
      time: new Date(r.createdAt || Date.now()).getTime()
    }));
  }

  const { data } = await supabase
    .from('resources')
    .select('id, title, description, url, category, created_by, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  return (data || []).map(r => ({
    id: r.id, title: r.title, description: r.description,
    url: r.url, type: r.category,
    addedBy: r.created_by, time: new Date(r.created_at).getTime()
  }));
};

export const loadNews = async (supabase) => {
  if (USE_SECURE_API) {
    const data = await secureContentApi.listNews();
    return (data || []).map(n => ({
      id: n.id, title: n.title, content: n.content,
      author: n.author || n.creator?.displayName || '',
      time: new Date(n.createdAt || Date.now()).getTime()
    }));
  }

  const { data } = await supabase
    .from('news')
    .select('id, title, content, author, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (data || []).map(n => ({
    id: n.id, title: n.title, content: n.content,
    author: n.author, time: new Date(n.created_at).getTime()
  }));
};

export const loadExams = async (supabase) => {
  if (USE_SECURE_API) {
    const data = await secureContentApi.listExams();
    return (data || []).map(e => ({
      id: e.id, title: e.title, description: e.description,
      date: e.examDate || e.date,
      location: e.location,
      createdBy: e.createdBy || e.creator?.displayName || '',
      time: new Date(e.createdAt || Date.now()).getTime()
    }));
  }

  const { data } = await supabase
    .from('exams')
    .select('id, title, description, exam_date, location, created_by, created_at')
    .order('exam_date', { ascending: true })
    .limit(50);

  return (data || []).map(e => ({
    id: e.id, title: e.title, description: e.description,
    date: e.exam_date, location: e.location,
    createdBy: e.created_by, time: new Date(e.created_at).getTime()
  }));
};

// ─── Flashcards ──────────────────────────────────────────────────────

export const loadFlashcards = async (supabase) => {
  if (USE_SECURE_API) {
    const [approved, pending] = await Promise.all([
      secureFlashcardsApi.list(),
      safe(() => secureFlashcardsApi.listPending(), [])
    ]);
    const mapFc = (fc) => ({
      id: fc.id, category: fc.category,
      front: fc.question || fc.front,
      back: fc.answer || fc.back,
      approved: fc.approved ?? true,
      userId: fc.userId || fc.creatorId
    });
    return {
      approved: (approved || []).map(mapFc),
      pending: (pending || []).map(mapFc)
    };
  }

  const { data } = await supabase
    .from('flashcards')
    .select('id, category, question, answer, approved, user_id, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  const approvedCards = [];
  const pendingCards = [];
  (data || []).forEach(fc => {
    const card = {
      id: fc.id, category: fc.category,
      front: fc.question, back: fc.answer,
      approved: fc.approved, userId: fc.user_id
    };
    if (fc.approved) approvedCards.push(card);
    else pendingCards.push(card);
  });
  return { approved: approvedCards, pending: pendingCards };
};

// ─── Custom Questions + Reports ──────────────────────────────────────

export const loadCustomQuestions = async (supabase) => {
  if (USE_SECURE_API) {
    const data = await secureQuestionWorkflowsApi.listSubmissions();
    return (data || []).map((question) => mapQuestionSubmissionToFrontend(question));
  }

  const { data } = await supabase
    .from('custom_questions')
    .select('id, question, category, answers, correct, created_by, approved, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (data || []).map((question) => mapQuestionSubmissionToFrontend(question));
};

export const createQuestionSubmission = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureQuestionWorkflowsApi.createSubmission({
      category: payload?.category,
      question: payload?.question,
      answers: payload?.answers,
      correct: payload?.correct
    });
    return mapQuestionSubmissionToFrontend(result, payload);
  }

  const { data, error } = await supabase
    .from('custom_questions')
    .insert([{
      category: payload?.category,
      question: payload?.question,
      answers: payload?.answers,
      correct: payload?.correct,
      created_by: payload?.createdBy,
      approved: false
    }])
    .select()
    .single();

  if (error) throw error;
  return mapQuestionSubmissionToFrontend(data, payload);
};

export const approveQuestionSubmission = async (supabase, questionId) => {
  if (USE_SECURE_API) {
    return secureQuestionWorkflowsApi.approveSubmission(questionId);
  }

  const { error } = await supabase
    .from('custom_questions')
    .update({ approved: true })
    .eq('id', questionId);
  if (error) throw error;
};

export const loadQuestionReports = async (supabase) => {
  if (USE_SECURE_API) {
    const data = await secureQuestionWorkflowsApi.listReports();
    return (data || []).map(r => ({
      id: r.id ? String(r.id) : `remote-${Date.now()}`,
      questionKey: r.questionKey || '',
      questionText: r.questionText || r.question || '',
      category: r.category || 'unknown',
      source: r.source || 'unknown',
      note: r.note || '',
      answers: r.answers || [],
      reportedBy: r.reportedBy || r.reporter?.displayName || 'Unbekannt',
      reportedById: r.reportedById || r.reporter?.id || null,
      status: r.status || 'open',
      createdAt: r.createdAt || new Date().toISOString()
    }));
  }

  const { data, error } = await supabase
    .from('question_reports')
    .select('id, question_text, question, category, question_key, source, note, answers, reported_by, user_name, reported_by_id, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return [];
  return (data || []).map(row => ({
    id: row.id ? String(row.id) : `remote-${Date.now()}`,
    questionKey: row.question_key || '',
    questionText: String(row.question_text || row.question || '').trim(),
    category: String(row.category || 'unknown'),
    source: String(row.source || 'unknown'),
    note: String(row.note || ''),
    answers: Array.isArray(row.answers) ? row.answers : [],
    reportedBy: String(row.reported_by || row.user_name || 'Unbekannt'),
    reportedById: row.reported_by_id || null,
    status: String(row.status || 'open'),
    createdAt: row.created_at || new Date().toISOString()
  }));
};

// ─── Admin: Approve / Delete / Role ──────────────────────────────────

export const approveUser = async (supabase, email, allUsers) => {
  if (USE_SECURE_API) {
    const target = (allUsers || []).find(
      u => String(u.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase()
    );
    if (!target?.id) throw new Error('User nicht gefunden');
    const result = await secureUsersApi.updateApproval(target.id, { status: 'APPROVED' });
    return { account: mapBackendUserToFrontendUser(result) };
  }

  const { data: account, error } = await supabase
    .from('profiles')
    .update({ approved: true })
    .eq('email', email)
    .select()
    .single();
  if (error) throw error;

  // Init stats
  const { data: existingStats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', account.id)
    .single();

  if (!existingStats) {
    await supabase.from('user_stats').insert([{
      user_id: account.id, wins: 0, losses: 0, draws: 0,
      category_stats: {}, opponents: {}
    }]);
  }

  return { account };
};

export const deleteUser = async (supabase, email, allUsers) => {
  if (USE_SECURE_API) {
    const target = (allUsers || []).find(
      u => String(u.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase()
    );
    if (!target?.id) throw new Error('User nicht gefunden');
    if (target.role === 'admin') throw new Error('Administratoren können nicht gelöscht werden');
    await secureUsersApi.deleteUser(target.id);
    return;
  }

  const { data: account, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();
  if (fetchError || !account) throw new Error('User nicht gefunden');
  if (account.role === 'admin') throw new Error('Administratoren können nicht gelöscht werden');

  const { error } = await supabase.from('profiles').delete().eq('email', email);
  if (error) throw error;
};

export const purgeUserData = async (supabase, userId, userName) => {
  if (USE_SECURE_API) {
    return secureUsersApi.deleteUser(userId);
  }

  const results = await Promise.all([
    supabase.from('user_stats').delete().eq('user_id', userId),
    supabase.from('user_badges').delete().eq('user_name', userName),
    supabase.from('notifications').delete().eq('user_name', userName),
    supabase.from('profiles').delete().eq('id', userId)
  ]);
  const firstError = results.find((result) => result?.error)?.error;
  if (firstError) throw firstError;
};

export const changeUserRole = async (supabase, email, newRole, allUsers) => {
  if (USE_SECURE_API) {
    const target = (allUsers || []).find(
      u => String(u.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase()
    );
    if (!target?.id) throw new Error('User nicht gefunden');
    await secureUsersApi.updateRole(target.id, {
      role: mapFrontendRoleToBackendRole(newRole)
    });
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('email', String(email || '').trim().toLowerCase());
  if (error) throw error;
};

export const updateUserPermission = async (supabase, userId, field, enabled) => {
  if (USE_SECURE_API) {
    return secureUsersApi.updatePermissions(userId, { [field]: enabled });
  }

  const profileColumn = mapPermissionFieldToProfileColumn(field);
  const { error } = await supabase
    .from('profiles')
    .update({ [profileColumn]: enabled })
    .eq('id', userId);
  if (error) throw error;
};

// ─── Swim Training Plans ─────────────────────────────────────────────

export const loadSwimTrainingPlans = async (supabase) => {
  if (USE_SECURE_API) {
    const data = await secureSwimTrainingPlansApi.list();
    return (data || []).map(p => ({
      id: p.id,
      name: p.name || p.title,
      description: p.description || '',
      exercises: p.exercises || [],
      createdBy: p.createdBy || p.creator?.displayName || '',
      createdAt: p.createdAt
    }));
  }

  const { data } = await supabase
    .from('swim_training_plans')
    .select('*')
    .order('created_at', { ascending: false });

  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    exercises: p.exercises || [],
    createdBy: p.created_by || '',
    createdAt: p.created_at
  }));
};

// ─── Theory Exam Attempts ────────────────────────────────────────────

export const startTheoryExamSession = async (supabase, keywordMode = false) => {
  if (USE_SECURE_API) {
    return secureExamSimulatorApi.startTheorySession({
      keywordMode: Boolean(keywordMode)
    });
  }
  return null;
};

export const saveTheoryExamAttempt = async (supabase, userId, userName, progress, keywordMode, sessionPayload = null) => {
  if (USE_SECURE_API) {
    const sessionId = String(pickPayloadValue(sessionPayload, 'sessionId') || '').trim();
    if (!sessionId) {
      throw new Error('Theory exam sessionId fehlt fuer Secure-Submit.');
    }

    const rawAnswers = Array.isArray(sessionPayload?.answers) ? sessionPayload.answers : [];
    const answers = rawAnswers
      .map(toSecureTheoryExamAnswerPayload)
      .filter(Boolean);

    return secureExamSimulatorApi.submitTheorySession(sessionId, {
      answers,
      timeMs: Number(progress?.timeMs || 0)
    });
  }

  await supabase.from('theory_exam_attempts').insert([{
    user_id: userId,
    user_name: userName,
    correct: progress.correct,
    total: progress.total,
    percentage: progress.percentage,
    passed: progress.passed,
    time_ms: progress.timeMs,
    keyword_mode: keywordMode
  }]);
};

export const loadTheoryExamHistory = async (supabase, userId, canViewAll) => {
  if (USE_SECURE_API) {
    const data = await secureExamSimulatorApi.listTheoryAttempts(
      canViewAll ? {} : { userId }
    );
    return (data || []).map(a => ({
      id: a.id,
      user_id: a.userId,
      user_name: a.userName || a.user?.displayName || '',
      correct: a.correct,
      total: a.total,
      percentage: a.percentage,
      passed: a.passed,
      time_ms: a.timeMs,
      keyword_mode: a.keywordMode,
      created_at: a.createdAt
    }));
  }

  let query = supabase.from('theory_exam_attempts')
    .select('*')
    .order('created_at', { ascending: false });
  if (!canViewAll) {
    query = query.eq('user_id', userId);
  }
  const { data } = await query;
  return data || [];
};

// ─── Practical Exam Attempts ─────────────────────────────────────────

export const deletePracticalExamAttempt = async (supabase, attemptId) => {
  if (USE_SECURE_API) {
    await secureExamSimulatorApi.removePracticalAttempt(attemptId);
    return;
  }

  await supabase.from('practical_exam_attempts').delete().eq('id', attemptId);
};

// ─── School Attendance ──────────────────────────────────────────────

export const loadSchoolAttendanceAzubis = async (supabase) => {
  if (USE_SECURE_API) {
    const users = await secureUsersApi.list();
    return (users || [])
      .filter(u => String(u.role).toUpperCase() === 'AZUBI' && String(u.status).toUpperCase() === 'APPROVED')
      .map(u => ({ id: u.id, name: u.displayName, email: u.email }))
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'de'));
  }
  const { data, error } = await supabase
    .from('profiles').select('id, name, email').eq('role', 'azubi').eq('approved', true).order('name');
  if (error) throw error;
  return data || [];
};

export const loadSchoolAttendance = async (supabase, userId) => {
  if (USE_SECURE_API) {
    const entries = await secureSchoolAttendanceApi.list({ userId });
    return (entries || []).map(e => ({
      id: e.id, user_id: e.userId, user_name: e.userName,
      date: e.date, start_time: e.startTime, end_time: e.endTime,
      teacher_signature: e.teacherSignature || null,
      trainer_signature: e.trainerSignature || null,
      created_at: e.createdAt
    }));
  }
  const { data, error } = await supabase
    .from('school_attendance').select('*').eq('user_id', userId).order('date', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addSchoolAttendanceEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    return secureSchoolAttendanceApi.create(toSecureSchoolAttendancePayload(payload));
  }
  const { error } = await supabase.from('school_attendance').insert(payload);
  if (error) throw error;
};

export const updateSchoolAttendanceSignature = async (supabase, entryId, field, value) => {
  if (USE_SECURE_API) {
    return secureSchoolAttendanceApi.updateSignature(entryId, {
      field: normalizeSignatureField(field),
      value
    });
  }
  const { error } = await supabase.from('school_attendance').update({ [field]: value }).eq('id', entryId);
  if (error) throw error;
};

export const deleteSchoolAttendanceEntry = async (supabase, entryId) => {
  if (USE_SECURE_API) {
    return secureSchoolAttendanceApi.remove(entryId);
  }
  const { error } = await supabase.from('school_attendance').delete().eq('id', entryId);
  if (error) throw error;
};

// ─── Exam Grades ────────────────────────────────────────────────────

export const loadExamGradesAzubis = async (supabase) => {
  // Same data source as school attendance azubis
  return loadSchoolAttendanceAzubis(supabase);
};

export const loadExamGradeEntries = async (supabase, userId) => {
  if (USE_SECURE_API) {
    const entries = await secureExamGradesApi.list({ userId });
    return (entries || []).map(e => ({
      id: e.id, user_id: e.userId, user_name: e.userName,
      date: e.date, subject: e.subject, topic: e.topic,
      grade: e.grade, notes: e.notes, created_at: e.createdAt
    }));
  }
  const { data, error } = await supabase
    .from('exam_grades').select('*').eq('user_id', userId).order('date', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addExamGradeEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    return secureExamGradesApi.create(toSecureExamGradePayload(payload));
  }
  const { error } = await supabase.from('exam_grades').insert(payload);
  if (error) throw error;
};

export const deleteExamGradeEntry = async (supabase, gradeId) => {
  if (USE_SECURE_API) {
    return secureExamGradesApi.remove(gradeId);
  }
  const { error } = await supabase.from('exam_grades').delete().eq('id', gradeId);
  if (error) throw error;
};

// ─── Content CRUD ───────────────────────────────────────────────────

export const addMaterialEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureContentApi.createMaterial(toSecureMaterialPayload(payload));
    return {
      id: result.id, title: result.title, category: result.category,
      createdBy: result.createdBy || result.created_by, time: new Date(result.createdAt || Date.now()).getTime()
    };
  }
  const { data, error } = await supabase.from('materials')
    .insert([{ title: payload.title, category: payload.category, created_by: payload.createdBy }])
    .select().single();
  if (error) throw error;
  return {
    id: data.id, title: data.title, category: data.category,
    createdBy: data.created_by, time: new Date(data.created_at).getTime()
  };
};

export const addResourceEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureContentApi.createResource(toSecureResourcePayload(payload));
    return {
      id: result.id, title: result.title, url: result.url,
      type: result.category || result.type, description: result.description,
      addedBy: result.createdBy || result.created_by, time: new Date(result.createdAt || Date.now()).getTime()
    };
  }
  const { data, error } = await supabase.from('resources')
    .insert([{ title: payload.title, url: payload.url, category: payload.category, description: payload.description, created_by: payload.createdBy }])
    .select().single();
  if (error) throw error;
  return {
    id: data.id, title: data.title, url: data.url,
    type: data.category, description: data.description,
    addedBy: data.created_by, time: new Date(data.created_at).getTime()
  };
};

export const deleteResourceEntry = async (supabase, resourceId) => {
  if (USE_SECURE_API) {
    return secureContentApi.removeResource(resourceId);
  }
  const { error } = await supabase.from('resources').delete().eq('id', resourceId);
  if (error) throw error;
};

export const addNewsEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureContentApi.createNews(toSecureNewsPayload(payload));
    return {
      id: result.id, title: result.title, content: result.content,
      author: result.author || result.createdBy, time: new Date(result.createdAt || Date.now()).getTime()
    };
  }
  const { data, error } = await supabase.from('news')
    .insert([{ title: payload.title, content: payload.content, author: payload.author }])
    .select().single();
  if (error) throw error;
  return {
    id: data.id, title: data.title, content: data.content,
    author: data.author, time: new Date(data.created_at).getTime()
  };
};

export const deleteNewsEntry = async (supabase, newsId) => {
  if (USE_SECURE_API) {
    return secureContentApi.removeNews(newsId);
  }
  const { error } = await supabase.from('news').delete().eq('id', newsId);
  if (error) throw error;
};

export const addExamEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureContentApi.createExam(toSecureExamPayload(payload));
    return {
      id: result.id, title: result.title, description: result.description,
      date: result.examDate || result.date, createdBy: result.createdBy || result.created_by,
      time: new Date(result.createdAt || Date.now()).getTime()
    };
  }
  const { data, error } = await supabase.from('exams')
    .insert([{ title: payload.title, description: payload.description, exam_date: payload.examDate || null, created_by: payload.createdBy }])
    .select().single();
  if (error) throw error;
  return {
    id: data.id, title: data.title, description: data.description,
    date: data.exam_date, createdBy: data.created_by, time: new Date(data.created_at).getTime()
  };
};

export const deleteExamEntry = async (supabase, examId) => {
  if (USE_SECURE_API) {
    return secureContentApi.removeExam(examId);
  }
  const { error } = await supabase.from('exams').delete().eq('id', examId);
  if (error) throw error;
};

export const approveFlashcardEntry = async (supabase, flashcardId) => {
  if (USE_SECURE_API) {
    return secureFlashcardsApi.approve(flashcardId);
  }
  const { error } = await supabase.from('flashcards').update({ approved: true }).eq('id', flashcardId);
  if (error) throw error;
};

export const deleteFlashcardEntry = async (supabase, flashcardId) => {
  if (USE_SECURE_API) {
    return secureFlashcardsApi.remove(flashcardId);
  }
  const { error } = await supabase.from('flashcards').delete().eq('id', flashcardId);
  if (error) throw error;
};

// ─── Quiz Duels ─────────────────────────────────────────────────────

export const createDuel = async (supabase, payload, currentUserId = null) => {
  if (USE_SECURE_API) {
    const result = await secureDuelsApi.create({
      opponentId: payload.opponentId,
      requestTimeoutMinutes: payload.challengeTimeoutMinutes || undefined
    });
    return mapDuelToGame(result, currentUserId);
  }

  let timerColumnsUnavailable = false;
  const basePayload = {
    player1: payload.player1,
    player2: payload.player2,
    difficulty: payload.difficulty,
    status: 'waiting',
    round: 0,
    player1_score: 0,
    player2_score: 0,
    current_turn: payload.player1,
    rounds_data: []
  };
  const payloadWithTimer = {
    ...basePayload,
    challenge_timeout_minutes: payload.challengeTimeoutMinutes,
    challenge_expires_at: payload.challengeExpiresAt
  };

  let data = null;
  let error = null;
  const insertWithTimer = await supabase
    .from('games')
    .insert([payloadWithTimer])
    .select()
    .single();
  data = insertWithTimer.data;
  error = insertWithTimer.error;

  if (error && error.code === '42703' && (
    String(error.message || '').includes('challenge_timeout_minutes')
    || String(error.message || '').includes('challenge_expires_at')
  )) {
    timerColumnsUnavailable = true;
    const legacyInsert = await supabase
      .from('games')
      .insert([basePayload])
      .select()
      .single();
    data = legacyInsert.data;
    error = legacyInsert.error;
  }

  if (error) throw error;

  return {
    id: data.id,
    player1: data.player1,
    player2: data.player2,
    difficulty: data.difficulty,
    status: data.status,
    categoryRound: 0,
    round: 0,
    player1Score: data.player1_score,
    player2Score: data.player2_score,
    currentTurn: data.current_turn,
    categoryRounds: [],
    questionHistory: [],
    updatedAt: data.updated_at || new Date().toISOString(),
    createdAt: data.created_at || new Date().toISOString(),
    challengeTimeoutMinutes: timerColumnsUnavailable ? (48 * 60) : payload.challengeTimeoutMinutes,
    challengeExpiresAt: timerColumnsUnavailable ? null : (data.challenge_expires_at || payload.challengeExpiresAt || null),
    timerColumnsUnavailable
  };
};

export const acceptDuel = async (supabase, gameId, currentUserId = null) => {
  if (USE_SECURE_API) {
    const result = await secureDuelsApi.accept(gameId);
    return mapDuelToGame(result, currentUserId);
  }
  const acceptedAt = new Date().toISOString();
  const { error } = await supabase.from('games')
    .update({ status: 'active', updated_at: acceptedAt }).eq('id', gameId);
  if (error) throw error;
  return { acceptedAt };
};

export const getDuelWithQuestions = async (supabase, duelId, currentUserId = null) => {
  if (USE_SECURE_API) {
    const result = await secureDuelsApi.getById(duelId);
    return mapDuelToGame(result, currentUserId);
  }
  return null;
};

export const saveDuelState = async (supabase, game) => {
  if (USE_SECURE_API) {
    // Save client-managed game state to NestJS backend as JSON
    const gameState = {
      player1Score: game.player1Score,
      player2Score: game.player2Score,
      currentTurn: game.currentTurn,
      categoryRound: game.categoryRound || 0,
      status: game.status,
      difficulty: game.difficulty,
      categoryRounds: game.categoryRounds || [],
      winner: game.winner || null,
      challengeTimeoutMinutes: game.challengeTimeoutMinutes
    };
    await secureDuelsApi.updateGameState(game.id, gameState);
    return;
  }
  const updateData = {
    player1_score: game.player1Score, player2_score: game.player2Score,
    current_turn: game.currentTurn, round: game.categoryRound || 0,
    status: game.status, rounds_data: game.categoryRounds || [],
    updated_at: new Date().toISOString()
  };
  if (game.status === 'finished') updateData.winner = game.winner || null;
  const { error } = await supabase.from('games').update(updateData).eq('id', game.id);
  if (error) throw error;
};

export const submitDuelAnswer = async (supabase, duelId, payload) => {
  if (USE_SECURE_API) {
    return secureDuelsApi.submitAnswer(duelId, payload);
  }
  // In Supabase mode, answers are stored in rounds_data via saveDuelState
  return;
};

// ─── Swim Sessions ──────────────────────────────────────────────────

export const loadSwimSessionEntries = async (supabase) => {
  if (USE_SECURE_API) {
    const sessions = await secureSwimSessionsApi.list();
    return (sessions || []).map(s => ({
      id: s.id, user_id: s.user_id || s.userId, user_name: s.user_name || s.userName, user_role: s.user_role || s.userRole,
      date: s.date, distance: s.distance, time_minutes: s.time_minutes ?? s.timeMinutes,
      style: s.style, notes: s.notes, challenge_id: s.challenge_id ?? s.challengeId ?? null,
      confirmed: Boolean(s.confirmed), confirmed_by: s.confirmed_by || s.confirmedBy || null,
      confirmed_at: s.confirmed_at || s.confirmedAt || null, created_at: s.created_at || s.createdAt
    }));
  }
  const { data, error } = await supabase.from('swim_sessions')
    .select('*').order('created_at', { ascending: false });
  if (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) return [];
    throw error;
  }
  return data || [];
};

export const saveSwimSessionEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureSwimSessionsApi.create(toSecureSwimSessionPayload(payload));
    return {
      id: result.id,
      user_id: result.user_id || result.userId,
      user_name: result.user_name || result.userName,
      user_role: result.user_role || result.userRole,
      date: result.date,
      distance: result.distance ?? result.distanceMeters,
      time_minutes: result.time_minutes ?? result.timeMinutes,
      style: result.style || result.styleId,
      notes: result.notes,
      challenge_id: result.challenge_id ?? result.challengeId ?? null,
      confirmed: Boolean(result.confirmed),
      confirmed_by: result.confirmed_by || result.confirmedBy || null,
      confirmed_at: result.confirmed_at || result.confirmedAt || null,
      created_at: result.created_at || result.createdAt
    };
  }
  const { data, error } = await supabase.from('swim_sessions')
    .insert([payload]).select();
  if (error) throw error;
  return data?.[0] || null;
};

export const confirmSwimSessionEntry = async (supabase, sessionId, confirmerName) => {
  if (USE_SECURE_API) {
    return secureSwimSessionsApi.confirm(sessionId);
  }
  const { error } = await supabase.from('swim_sessions')
    .update({ confirmed: true, confirmed_by: confirmerName, confirmed_at: new Date().toISOString() })
    .eq('id', sessionId);
  if (error) throw error;
};

export const rejectSwimSessionEntry = async (supabase, sessionId) => {
  if (USE_SECURE_API) {
    return secureSwimSessionsApi.reject(sessionId);
  }
  const { error } = await supabase.from('swim_sessions').delete().eq('id', sessionId);
  if (error) throw error;
};

export const withdrawSwimSessionEntry = async (supabase, sessionId) => {
  if (USE_SECURE_API) {
    return secureSwimSessionsApi.withdraw(sessionId);
  }
  const { error } = await supabase.from('swim_sessions').delete().eq('id', sessionId);
  if (error) throw error;
};

export const loadCustomSwimTrainingPlanEntries = async (supabase) => {
  if (USE_SECURE_API) {
    const plans = await secureSwimTrainingPlansApi.list();
    return (plans || []).map(mapSecureSwimTrainingPlanToFrontendEntry);
  }
  const { data, error } = await supabase.from('swim_training_plans_custom')
    .select('*').eq('is_active', true).order('created_at', { ascending: false });
  if (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) return [];
    throw error;
  }
  return data || [];
};

export const createCustomSwimTrainingPlanEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureSwimTrainingPlansApi.create(toSecureSwimTrainingPlanPayload(payload));
    return mapSecureSwimTrainingPlanToFrontendEntry(result);
  }
  const { data, error } = await supabase.from('swim_training_plans_custom')
    .insert([payload]).select().single();
  if (error) throw error;
  return data;
};

// ─── Berichtsheft ───────────────────────────────────────────────────

export const loadBerichtsheftEntriesFromDb = async (supabase, userName) => {
  if (USE_SECURE_API) {
    const entries = await secureReportBooksApi.list();
    return (entries || []).map(mapSecureReportBookToFrontendEntry);
  }
  const { data, error } = await supabase.from('berichtsheft')
    .select('*').eq('user_name', userName).order('week_start', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const saveBerichtsheftEntry = async (supabase, payload, existingId = null) => {
  if (USE_SECURE_API) {
    return secureReportBooksApi.submit(toSecureReportBookPayload(payload, existingId));
  }
  if (existingId) {
    const { error } = await supabase.from('berichtsheft').update(payload).eq('id', existingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('berichtsheft').insert(payload);
    if (error) throw error;
  }
};

export const deleteBerichtsheftEntry = async (supabase, entryId) => {
  if (USE_SECURE_API) {
    return secureReportBooksApi.remove(entryId);
  }
  const { error } = await supabase.from('berichtsheft').delete().eq('id', entryId);
  if (error) throw error;
};

export const loadBerichtsheftPending = async (supabase) => {
  if (USE_SECURE_API) {
    const entries = await secureReportBooksApi.listPendingReview();
    return (entries || []).map(mapSecureReportBookToFrontendEntry);
  }
  const { data, error } = await supabase.from('berichtsheft')
    .select('*').order('week_start', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const assignBerichtsheftTrainerEntry = async (supabase, entryId, payload) => {
  if (USE_SECURE_API) {
    return secureReportBooksApi.assignTrainer(entryId, toSecureAssignTrainerPayload(payload));
  }
  const { error } = await supabase.from('berichtsheft').update(payload).eq('id', entryId);
  if (error) throw error;
};

export const upsertBerichtsheftDraft = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureReportBooksApi.upsertDraft(toSecureReportBookPayload(payload));
    return mapSecureReportBookToFrontendEntry(result?.entry || result);
  }

  const existingDraftId = pickPayloadValue(payload, 'existingDraftId');
  const { existingDraftId: _existingDraftId, ...draftPayload } = payload || {};
  const query = existingDraftId
    ? supabase.from('berichtsheft').update(draftPayload).eq('id', existingDraftId).select('*').single()
    : supabase.from('berichtsheft').insert(draftPayload).select('*').single();
  const { data, error } = await query;
  if (error) throw error;
  return data || null;
};

export const deleteBerichtsheftDraftByWeek = async (supabase, weekStart, options = {}) => {
  if (USE_SECURE_API) {
    return secureReportBooksApi.deleteDraftByWeek(weekStart);
  }

  let query = supabase.from('berichtsheft').delete();
  if (options?.draftId) {
    query = query.eq('id', options.draftId);
  } else {
    query = query.eq('week_start', weekStart).eq('status', 'draft');
  }
  const { error } = await query;
  if (error) throw error;
};

export const loadBerichtsheftProfile = async (supabase) => {
  if (USE_SECURE_API) {
    return secureReportBooksApi.getProfile();
  }
  return null;
};

export const updateBerichtsheftProfile = async (supabase, userId, profile) => {
  if (USE_SECURE_API) {
    return secureReportBooksApi.updateProfile(profile);
  }
  const { error } = await supabase.from('profiles')
    .update({ berichtsheft_profile: profile }).eq('id', userId);
  if (error) throw error;
};

// ─── Practical Exam History ─────────────────────────────────────────

export const loadPracticalExamAttempts = async (supabase, userId, canViewAll) => {
  if (USE_SECURE_API) {
    const attempts = await secureExamSimulatorApi.listPracticalAttempts(canViewAll ? {} : { userId });
    return (attempts || []).map(mapSecurePracticalAttemptToFrontendEntry);
  }
  let query = supabase.from('practical_exam_attempts').select('*').order('created_at', { ascending: false });
  if (!canViewAll) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) return [];
    throw error;
  }
  return data || [];
};

export const savePracticalExamAttemptEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureExamSimulatorApi.createPracticalAttempt(toSecurePracticalExamAttemptPayload(payload));
    return mapSecurePracticalAttemptToFrontendEntry(result);
  }
  const { data, error } = await supabase.from('practical_exam_attempts')
    .insert([payload]).select().single();
  if (error) throw error;
  return data;
};

// ─── Question Reports ───────────────────────────────────────────────

export const reportQuestion = async (supabase, payload) => {
  if (USE_SECURE_API) {
    return secureQuestionWorkflowsApi.createReport(toSecureQuestionReportPayload(payload));
  }
  const { error } = await supabase.from('question_reports').insert([payload]);
  if (error) throw error;
};

export const updateQuestionReportStatus = async (supabase, reportId, status) => {
  if (USE_SECURE_API) {
    return secureQuestionWorkflowsApi.updateReportStatus(reportId, { status });
  }
  await supabase.from('question_reports').update({ status }).eq('id', reportId);
};

// ─── Utility ────────────────────────────────────────────────────────

export const repairQuizStatsRemote = async (supabase, fetchPushBackendWithAuth) => {
  if (USE_SECURE_API) {
    return secureUserStatsApi.repairQuizStats();
  }
  return fetchPushBackendWithAuth({
    supabase,
    pathname: '/api/admin/repair-quiz-stats',
    method: 'POST',
    body: {}
  });
};

export const sendTestPushRemote = async (supabase, fetchPushBackendWithAuth, payload) => {
  if (USE_SECURE_API) {
    return secureNotificationsApi.sendTestPush(toSecurePushTestPayload(payload));
  }
  return fetchPushBackendWithAuth({
    supabase,
    pathname: '/api/push/test',
    method: 'POST',
    body: payload
  });
};

export const getAuthorizedReviewers = async (supabase, filterField = null) => {
  if (USE_SECURE_API) {
    const contacts = await secureUsersApi.contacts();
    const users = await secureUsersApi.list().catch(() => contacts || []);
    return (users || [])
      .filter(u => {
        const role = String(u.role).toUpperCase();
        if (role === 'ADMIN') return true;
        if (filterField === 'can_view_school_cards') return Boolean(u.canViewSchoolCards);
        if (filterField === 'can_view_exam_grades') return Boolean(u.canViewExamGrades);
        if (filterField === 'can_sign_reports') return Boolean(u.canSignReports);
        return role === 'AUSBILDER';
      })
      .map(u => ({ id: u.id, name: u.displayName }));
  }
  const filter = filterField
    ? `role.eq.admin,${filterField}.eq.true`
    : 'role.eq.admin,role.eq.trainer';
  const { data } = await supabase.from('profiles').select('id,name').or(filter);
  return data || [];
};

export const saveBadges = async (supabase, badges, userId, userName) => {
  if (USE_SECURE_API) {
    // NestJS backend manages badges server-side
    return;
  }
  for (const badge of badges) {
    await supabase.from('user_badges').insert([{
      user_id: userId, user_name: userName, badge_id: badge.id
    }]);
  }
};

export const resolveUserIdentity = async (supabase, userInput) => {
  if (USE_SECURE_API) {
    // In secure mode, identity resolution happens server-side
    if (userInput && typeof userInput === 'object') {
      return { userId: userInput.id, userName: userInput.name };
    }
    return null;
  }
  // Supabase path handled in App.jsx (complex query)
  return null;
};

// ─── Swim Monthly Results ───────────────────────────────────────────

export const loadSwimMonthlyResultEntries = async (supabase, year) => {
  if (USE_SECURE_API) {
    // NestJS backend may not have this endpoint yet — return empty
    return [];
  }
  const { data, error } = await supabase.from('swim_monthly_results')
    .select('*').eq('year', year).order('month', { ascending: true });
  if (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) return [];
    throw error;
  }
  return data || [];
};

export const upsertSwimMonthlyResultEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    // NestJS backend may not have this endpoint yet — no-op
    return;
  }
  const { error } = await supabase.from('swim_monthly_results')
    .upsert([payload], { onConflict: 'month_key' });
  if (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) return;
    throw error;
  }
};

// ─── Export flag for convenience ─────────────────────────────────────
export { USE_SECURE_API };
