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

import { getApiAccessToken, isSecureBackendApiEnabled } from './secureApiClient';
import {
  secureAuthApi,
  secureUsersApi,
  secureOrganizationsApi,
  secureInvitationsApi,
  secureAppConfigApi,
  secureDuelsApi,
  secureChatApi,
  secureForumApi,
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
import { PERMISSIONS } from '../data/constants';
import { triggerWebPushNotification } from './pushNotifications';

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

const createAuthFlowError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const withPermissions = (frontendUser) => {
  if (!frontendUser) return null;
  return {
    ...frontendUser,
    permissions: PERMISSIONS[frontendUser.role] || PERMISSIONS.azubi
  };
};

const buildLegacyAuthUser = (userId, profile, organizationName = null) => withPermissions({
  id: userId,
  name: profile?.name || '',
  email: profile?.email || '',
  role: profile?.role || 'azubi',
  approved: Boolean(profile?.approved),
  status: profile?.approved ? 'APPROVED' : 'PENDING',
  isOwner: Boolean(profile?.is_owner),
  is_owner: Boolean(profile?.is_owner),
  avatar: profile?.avatar || null,
  company: profile?.company || null,
  birthDate: profile?.birth_date || null,
  birth_date: profile?.birth_date || null,
  organizationId: profile?.organization_id || null,
  organization_id: profile?.organization_id || null,
  organizationName: organizationName || null,
  trainingEnd: profile?.training_end || null,
  training_end: profile?.training_end || null,
  canViewSchoolCards: Boolean(profile?.can_view_school_cards),
  can_view_school_cards: Boolean(profile?.can_view_school_cards),
  canViewExamGrades: Boolean(profile?.can_view_exam_grades),
  can_view_exam_grades: Boolean(profile?.can_view_exam_grades),
  canSignReports: Boolean(profile?.can_sign_reports),
  can_sign_reports: Boolean(profile?.can_sign_reports),
  berichtsheft_profile: profile?.berichtsheft_profile || null
});

const loadLegacyOrganizationName = async (supabase, organizationId) => {
  if (!organizationId) return null;

  const { data } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', organizationId)
    .single();

  return data?.name || null;
};

const loadLegacyAuthState = async (supabase, userId) => {
  if (!userId) {
    return { profile: null, user: null, azubiProfile: null };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return { profile: null, user: null, azubiProfile: null };
  }

  const organizationName = await loadLegacyOrganizationName(supabase, profile.organization_id);
  return {
    profile,
    user: buildLegacyAuthUser(userId, profile, organizationName),
    azubiProfile: profile.berichtsheft_profile || null
  };
};

const ensureLegacyUserStatsRow = async (supabase, userId) => {
  if (!userId) return;

  const { data: existingStats } = await supabase
    .from('user_stats')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (existingStats) return;

  await supabase
    .from('user_stats')
    .insert([{
      user_id: userId,
      wins: 0,
      losses: 0,
      draws: 0,
      category_stats: {},
      opponents: {}
    }]);
};

const notifyAdminsAboutPendingRegistration = async (supabase, { name, email, role }) => {
  try {
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('name')
      .eq('role', 'admin')
      .eq('approved', true);

    if (adminsError) throw adminsError;

    const adminNames = [...new Set(
      (admins || [])
        .map((admin) => String(admin?.name || '').trim())
        .filter(Boolean)
    )];

    if (!adminNames.length) return;

    const title = '🆕 Neue Registrierung';
    const message = `${name} (${email}) hat sich als ${role} registriert und wartet auf Freischaltung.`;

    const rows = adminNames.map((adminName) => ({
      user_name: adminName,
      title,
      message,
      type: 'user_approval',
      read: false
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('notifications')
      .insert(rows)
      .select('id,user_name');

    if (insertError) throw insertError;

    for (const notification of inserted || []) {
      try {
        await triggerWebPushNotification({
          supabase,
          userName: notification.user_name,
          title,
          message,
          type: 'user_approval',
          notificationId: notification.id
        });
      } catch (pushError) {
        console.warn('Registration push dispatch failed:', pushError);
      }
    }
  } catch (error) {
    console.warn('Admin notification for registration failed:', error);
  }
};

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

const mapBackendRole = (role) => {
  const normalized = String(role || '').toUpperCase();
  if (normalized === 'ADMIN') return 'admin';
  if (normalized === 'AUSBILDER') return 'trainer';
  if (normalized === 'RETTUNGSSCHWIMMER_AZUBI') return 'rettungsschwimmer_azubi';
  return 'azubi';
};

const mapForumPostToFrontend = (post) => ({
  id: post?.id,
  category: post?.category,
  title: post?.title,
  content: post?.content,
  pinned: Boolean(post?.pinned),
  locked: Boolean(post?.locked),
  user_id: post?.userId || post?.user_id || null,
  user_name: post?.user?.displayName || post?.user_name || '',
  user_role: post?.user ? mapBackendRole(post.user.role) : mapBackendRole(post?.user_role),
  reply_count: post?.replyCount ?? post?.reply_count ?? 0,
  created_at: post?.createdAt || post?.created_at || null,
  last_reply_at: post?.lastReplyAt || post?.last_reply_at || null
});

const mapForumReplyToFrontend = (reply) => ({
  id: reply?.id,
  post_id: reply?.postId || reply?.post_id || null,
  content: reply?.content,
  user_id: reply?.userId || reply?.user_id || null,
  user_name: reply?.user?.displayName || reply?.user_name || '',
  user_role: reply?.user ? mapBackendRole(reply.user.role) : mapBackendRole(reply?.user_role),
  created_at: reply?.createdAt || reply?.created_at || null
});

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

export const updateMyProfile = async (supabase, userId, payload) => {
  if (USE_SECURE_API) {
    const securePayload = {};
    if (payload?.displayName !== undefined || payload?.name !== undefined) {
      securePayload.displayName = payload?.displayName ?? payload?.name ?? '';
    }
    if (payload?.avatar !== undefined) {
      securePayload.avatar = payload.avatar;
    }
    if (payload?.company !== undefined) {
      securePayload.company = payload.company;
    }
    if (payload?.birthDate !== undefined || payload?.birth_date !== undefined) {
      securePayload.birthDate = payload?.birthDate ?? payload?.birth_date ?? null;
    }
    return secureUsersApi.updateMe(securePayload);
  }

  const legacyPayload = {};
  if (payload?.displayName !== undefined || payload?.name !== undefined) {
    legacyPayload.name = payload?.displayName ?? payload?.name ?? '';
  }
  if (payload?.avatar !== undefined) {
    legacyPayload.avatar = payload.avatar;
  }
  if (payload?.company !== undefined) {
    legacyPayload.company = payload.company;
  }
  if (payload?.birthDate !== undefined || payload?.birth_date !== undefined) {
    legacyPayload.birth_date = payload?.birthDate ?? payload?.birth_date ?? null;
  }

  const { error } = await supabase
    .from('profiles')
    .update(legacyPayload)
    .eq('id', userId);
  if (error) throw error;
};

export const updateMyAvatar = async (supabase, userId, avatarId) => {
  return updateMyProfile(supabase, userId, { avatar: avatarId });
};

export const changeMyPassword = async (supabase, payload) => {
  if (USE_SECURE_API) {
    return secureAuthApi.changePassword({
      currentPassword: payload?.currentPassword,
      newPassword: payload?.newPassword
    });
  }

  const { error } = await supabase.auth.updateUser({ password: payload?.newPassword || '' });
  if (error) throw error;
};

export const previewInvitationCodeStatus = async (supabase, invitationCode) => {
  const code = String(invitationCode || '').trim().toUpperCase();
  if (!code || code.length < 4) return null;

  if (USE_SECURE_API) {
    return { secureValidation: true };
  }

  const { data, error } = await supabase
    .from('invitation_codes')
    .select('role, is_active, used_count, max_uses, expires_at, organizations(name)')
    .eq('code', code)
    .single();

  if (error || !data) {
    return { valid: false };
  }

  const expired = data.expires_at && new Date(data.expires_at) < new Date();
  const maxReached = Number(data.max_uses || 0) > 0 && Number(data.used_count || 0) >= Number(data.max_uses || 0);

  if (!data.is_active || expired || maxReached) {
    return {
      valid: false,
      reason: expired ? 'Code abgelaufen' : maxReached ? 'Code vollstÃ¤ndig genutzt' : 'Code deaktiviert'
    };
  }

  return {
    valid: true,
    orgName: data.organizations?.name || 'Unbekannt',
    role: data.role
  };
};

export const requestPasswordReset = async (supabase, email, options = {}) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (USE_SECURE_API) {
    return secureAuthApi.requestPasswordReset({ email: normalizedEmail });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: options?.redirectTo || window.location.origin
  });
  if (error) throw error;
};

export const confirmPasswordReset = async (supabase, payload = {}) => {
  if (USE_SECURE_API) {
    const token = payload?.token || null;
    if (!token) {
      throw new Error('Der Passwort-Reset-Link ist unvollstÃ¤ndig oder abgelaufen.');
    }
    return secureAuthApi.confirmPasswordReset({
      token,
      newPassword: payload?.newPassword || ''
    });
  }

  const { error } = await supabase.auth.updateUser({ password: payload?.newPassword || '' });
  if (error) throw error;
  await supabase.auth.signOut();
};

export const loadCurrentAuthSession = async (supabase) => {
  if (USE_SECURE_API) {
    let backendUser = null;

    if (getApiAccessToken()) {
      try {
        backendUser = await secureAuthApi.me();
      } catch {
        backendUser = null;
      }
    }

    if (!backendUser) {
      try {
        const refreshResult = await secureAuthApi.refreshSession();
        backendUser = refreshResult?.user || null;
      } catch {
        backendUser = null;
      }
    }

    const user = withPermissions(mapBackendUserToFrontendUser(backendUser));
    return {
      user,
      azubiProfile: user?.berichtsheft_profile || null
    };
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    return { user: null, azubiProfile: null };
  }

  const legacyState = await loadLegacyAuthState(supabase, session.user.id);
  if (!legacyState.profile) {
    await supabase.auth.signOut();
    return { user: null, azubiProfile: null, reason: 'missing_profile' };
  }

  if (!legacyState.profile.approved) {
    await supabase.auth.signOut();
    return { user: null, azubiProfile: null, reason: 'not_approved' };
  }

  return {
    user: legacyState.user,
    azubiProfile: legacyState.azubiProfile
  };
};

export const subscribeAuthStateChanges = (supabase, onEvent) => {
  if (USE_SECURE_API || !supabase?.auth?.onAuthStateChange) {
    return () => {};
  }

  const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(async (event, session) => {
    await onEvent?.(event, session);
  });

  return () => subscription?.unsubscribe?.();
};

export const registerAuthAccount = async (supabase, payload = {}) => {
  const trimmedEmail = String(payload?.email || '').trim().toLowerCase();
  const trimmedName = String(payload?.name || payload?.displayName || '').trim();
  const trimmedCode = String(payload?.invitationCode || '').trim().toUpperCase();
  const trainingEnd = payload?.trainingEnd || null;
  const password = payload?.password || '';

  if (USE_SECURE_API) {
    await secureAuthApi.register({
      email: trimmedEmail,
      displayName: trimmedName,
      password,
      invitationCode: trimmedCode,
      ...(trainingEnd ? { trainingEnd } : {})
    });

    return {
      email: trimmedEmail,
      organizationName: null,
      assignedRole: payload?.role || 'azubi',
      emailConfirmRequired: false
    };
  }

  const { data: codeResult, error: codeError } = await supabase
    .rpc('use_invitation_code', { p_code: trimmedCode });

  if (codeError) {
    throw createAuthFlowError('invalid_invitation', 'UngÃ¼ltiger oder abgelaufener Einladungscode!');
  }

  const invitation = codeResult?.[0];
  if (!invitation) {
    throw createAuthFlowError('invalid_invitation', 'UngÃ¼ltiger oder abgelaufener Einladungscode!');
  }

  const assignedRole = invitation.assigned_role || 'azubi';
  const organizationId = invitation.org_id || null;

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      data: {
        name: trimmedName,
        role: assignedRole,
        training_end: trainingEnd
      }
    }
  });

  if (error) {
    if (/already registered/i.test(error.message || '')) {
      throw createAuthFlowError('already_registered', 'Diese E-Mail ist bereits registriert!');
    }
    throw error;
  }

  if (import.meta.env.DEV) console.log('User created via Supabase Auth');

  if (data?.user) {
    try {
      const { error: rpcError } = await supabase.rpc('create_user_profile', {
        user_id: data.user.id,
        user_name: trimmedName,
        user_email: trimmedEmail,
        user_role: assignedRole,
        user_training_end: trainingEnd
      });

      if (rpcError) {
        console.warn('RPC Profil-Erstellung Info:', rpcError.message);
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: trimmedName,
            email: trimmedEmail,
            role: assignedRole,
            training_end: trainingEnd,
            approved: false,
            organization_id: organizationId
          }, { onConflict: 'id' });

        if (profileError) {
          console.warn('Profil-Fallback Info:', profileError.message);
        }
      } else if (import.meta.env.DEV) {
        console.log('Profil erfolgreich via RPC erstellt');
      }

      await supabase
        .from('profiles')
        .update({ organization_id: organizationId })
        .eq('id', data.user.id);
    } catch (profileError) {
      console.warn('Profil-Erstellung fehlgeschlagen:', profileError);
    }

    await notifyAdminsAboutPendingRegistration(supabase, {
      name: trimmedName,
      email: trimmedEmail,
      role: assignedRole
    });
  }

  await supabase.auth.signOut();

  return {
    email: trimmedEmail,
    organizationName: invitation.org_name || null,
    assignedRole,
    emailConfirmRequired: Boolean(data?.user && !data?.session)
  };
};

export const loginAuthAccount = async (supabase, payload = {}) => {
  const email = String(payload?.email || '').trim();
  const password = payload?.password || '';

  if (USE_SECURE_API) {
    const result = await secureAuthApi.login({ email, password });
    const backendUser = result?.user || (await secureAuthApi.me());
    const user = withPermissions(mapBackendUserToFrontendUser(backendUser));

    if (!user?.approved) {
      await secureAuthApi.logout();
      throw createAuthFlowError('not_approved', 'Dein Account wurde noch nicht freigeschaltet.');
    }

    return {
      user,
      azubiProfile: user?.berichtsheft_profile || null
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    if (/Invalid login/i.test(authError.message || '')) {
      throw createAuthFlowError('invalid_login', 'E-Mail oder Passwort falsch!');
    }
    if (/Email not confirmed/i.test(authError.message || '')) {
      throw createAuthFlowError('email_not_confirmed', 'Bitte bestÃ¤tige zuerst deine E-Mail-Adresse.');
    }
    throw authError;
  }

  const legacyState = await loadLegacyAuthState(supabase, authData?.user?.id);
  if (!legacyState.profile) {
    await supabase.auth.signOut();
    throw createAuthFlowError('missing_profile', 'Profil nicht gefunden. Bitte kontaktiere den Administrator.');
  }

  if (!legacyState.profile.approved) {
    await supabase.auth.signOut();
    throw createAuthFlowError('not_approved', 'Dein Account wurde noch nicht freigeschaltet.');
  }

  await supabase
    .from('profiles')
    .update({ last_login: new Date().toISOString() })
    .eq('id', authData.user.id);

  await ensureLegacyUserStatsRow(supabase, authData.user.id);

  return {
    user: legacyState.user,
    azubiProfile: legacyState.azubiProfile
  };
};

export const logoutAuthSession = async (supabase) => {
  if (USE_SECURE_API) {
    try {
      await secureAuthApi.logout();
    } catch {
      // ignore logout cleanup failures
    }
    return;
  }

  await supabase.auth.signOut();
};

export const deleteMyAccount = async (supabase, userId) => {
  if (USE_SECURE_API) {
    return secureUsersApi.deleteSelf();
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  if (error) throw error;
};

// ─── App Config ──────────────────────────────────────────────────────

export const loadOrganizationsAndInvitations = async (supabase) => {
  if (USE_SECURE_API) {
    const [organizations, invitations] = await Promise.all([
      secureOrganizationsApi.list(),
      secureInvitationsApi.list()
    ]);

    return {
      organizations: (organizations || []).map((organization) => ({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        contact_name: organization.contactName,
        contact_email: organization.contactEmail,
        max_azubis: organization.maxAzubis || 50,
        is_active: organization.isActive ?? true,
        created_at: organization.createdAt
      })),
      invitations: (invitations || []).map((invitation) => ({
        id: invitation.id,
        code: invitation.code,
        organization_id: invitation.organizationId,
        organizations: invitation.organization ? { name: invitation.organization.name } : null,
        role: String(invitation.role || '').toLowerCase(),
        max_uses: invitation.maxUses,
        used_count: invitation.currentUses || 0,
        is_active: invitation.isActive ?? true,
        created_at: invitation.createdAt,
        expires_at: invitation.expiresAt
      }))
    };
  }

  const [{ data: organizations, error: organizationsError }, { data: invitations, error: invitationsError }] = await Promise.all([
    supabase.from('organizations').select('*').order('created_at', { ascending: true }),
    supabase.from('invitation_codes').select('*, organizations(name)').order('created_at', { ascending: false })
  ]);

  if (organizationsError) throw organizationsError;
  if (invitationsError) throw invitationsError;

  return {
    organizations: organizations || [],
    invitations: invitations || []
  };
};

export const createOrganizationEntry = async (supabase, payload) => {
  const slug = String(payload?.slug || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');

  if (USE_SECURE_API) {
    return secureOrganizationsApi.create({
      name: String(payload?.name || '').trim(),
      slug,
      contactName: payload?.contact_name || payload?.contactName || undefined,
      contactEmail: payload?.contact_email || payload?.contactEmail || undefined
    });
  }

  const { data, error } = await supabase
    .from('organizations')
    .insert({
      ...payload,
      slug,
      name: String(payload?.name || '').trim()
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const createInvitationEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    return secureInvitationsApi.create({
      role: mapFrontendRoleToBackendRole(payload?.role),
      organizationId: payload?.organization_id || payload?.organizationId,
      maxUses: payload?.max_uses || payload?.maxUses || 30
    });
  }

  const { data, error } = await supabase
    .from('invitation_codes')
    .insert({
      organization_id: payload?.organization_id || payload?.organizationId,
      code: String(payload?.code || '').trim().toUpperCase(),
      role: payload?.role,
      max_uses: payload?.max_uses || payload?.maxUses,
      created_by: payload?.created_by ?? null
    })
    .select('*, organizations(name)')
    .single();
  if (error) throw error;
  return data;
};

export const toggleInvitationEntryActive = async (supabase, invitationId, currentActive) => {
  if (USE_SECURE_API) {
    if (currentActive) {
      return secureInvitationsApi.revoke(invitationId);
    }
    return null;
  }

  const { error } = await supabase
    .from('invitation_codes')
    .update({ is_active: !currentActive })
    .eq('id', invitationId);
  if (error) throw error;
};

export const deleteInvitationEntry = async (supabase, invitationId) => {
  if (USE_SECURE_API) {
    return secureInvitationsApi.revoke(invitationId);
  }

  const { error } = await supabase
    .from('invitation_codes')
    .delete()
    .eq('id', invitationId);
  if (error) throw error;
};

export const loadActiveOrganizations = async (supabase) => {
  if (USE_SECURE_API) {
    const organizations = await secureOrganizationsApi.list();
    return (organizations || []).map((organization) => ({
      id: organization.id,
      name: organization.name
    }));
  }

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data || [];
};

export const assignUserOrganization = async (supabase, userId, organizationId) => {
  if (USE_SECURE_API) {
    return secureUsersApi.updateOrganization(userId, { organizationId: organizationId || null });
  }

  const { error } = await supabase
    .from('profiles')
    .update({ organization_id: organizationId || null })
    .eq('id', userId);
  if (error) throw error;
};

export const adminResetUserPassword = async (supabase, userId, userEmail, newPassword) => {
  if (USE_SECURE_API) {
    return secureUsersApi.adminResetPassword(userId, newPassword);
  }

  const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
    redirectTo: window.location.origin
  });
  if (error) throw error;
};

export const loadRetentionCandidates = async (supabase) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, training_end, last_login')
    .in('role', ['azubi', 'trainer']);

  if (error) throw error;
  return data || [];
};

export const exportUserDataBundle = async (supabase, userInput, fallbackUserName = null) => {
  const targetUser = isPlainObject(userInput) ? userInput : null;
  const targetUserId = String(targetUser?.id || '').trim();
  const email = String(targetUser?.email ?? userInput ?? '').trim();
  const userName = String(targetUser?.name ?? targetUser?.displayName ?? fallbackUserName ?? '').trim();

  if (USE_SECURE_API) {
    if (targetUserId) {
      return secureUsersApi.exportUserData(targetUserId);
    }
    return secureUsersApi.exportMe();
  }

  const exportData = {
    exportDate: new Date().toISOString(),
    user: userName,
    email,
    meta: {
      exportVersion: 1,
      exportedVia: 'legacy-supabase'
    },
    data: {}
  };

  const { data: userData } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (userData) {
    exportData.data.account = userData;

    const { data: statsData } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    if (statsData) exportData.data.stats = statsData;
  }

  const [{ data: gamesData }, { data: examsData }, { data: questionsData }, { data: badgesData }] = await Promise.all([
    supabase.from('games').select('*').or(`player1.eq.${userName},player2.eq.${userName}`),
    supabase.from('exams').select('*').eq('created_by', userName),
    supabase.from('custom_questions').select('*').eq('created_by', userName),
    supabase.from('user_badges').select('*').eq('user_name', userName)
  ]);

  exportData.data.games = gamesData || [];
  exportData.data.exams = examsData || [];
  exportData.data.questions = questionsData || [];
  exportData.data.badges = badgesData || [];

  return exportData;
};

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

export const loadDirectMessages = async (supabase, { recipientId, currentUserId } = {}) => {
  if (!recipientId) return [];

  if (USE_SECURE_API) {
    const directMsgs = await secureChatApi.list({
      scope: 'DIRECT_STAFF',
      recipientId,
      limit: 100
    });

    return (directMsgs || []).map((message) => ({
      id: message?.id,
      user: message?.senderName || message?.sender?.displayName || 'Unbekannt',
      text: message?.content || message?.text || '',
      time: new Date(message?.createdAt || Date.now()).getTime(),
      avatar: message?.senderAvatar || message?.sender?.avatar || null,
      senderId: message?.senderId || message?.sender?.id || null,
      senderRole: String(message?.senderRole || message?.sender?.role || 'azubi').toLowerCase(),
      scope: 'direct_staff',
      organizationId: message?.organizationId || null,
      recipientId: message?.recipientId || null
    }));
  }

  if (!currentUserId) return [];

  const { data, error } = await supabase
    .from('messages')
    .select('id, content, user_name, sender_id, created_at, chat_scope, recipient_id, user_avatar, user_role, organization_id')
    .eq('chat_scope', 'direct_staff')
    .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) throw error;

  return (data || []).map((message) => ({
    id: message?.id,
    user: message?.user_name || 'Unbekannt',
    text: message?.content || '',
    time: new Date(message?.created_at || Date.now()).getTime(),
    avatar: message?.user_avatar || null,
    senderId: message?.sender_id || null,
    senderRole: String(message?.user_role || 'azubi').toLowerCase(),
    scope: 'direct_staff',
    organizationId: message?.organization_id || null,
    recipientId: message?.recipient_id || null
  }));
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

// ─── Forum ───────────────────────────────────────────────────────────

export const loadForumCategoryCounts = async (supabase) => {
  if (USE_SECURE_API) {
    const data = await secureForumApi.listCategories();
    const counts = {};
    (data || []).forEach((entry) => {
      counts[entry.category] = entry.count || 0;
    });
    return counts;
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .select('category');
  if (error) throw error;

  const counts = {};
  (data || []).forEach((post) => {
    const category = String(post?.category || '').trim();
    if (!category) return;
    counts[category] = (counts[category] || 0) + 1;
  });
  return counts;
};

export const loadForumPosts = async (supabase, categoryId) => {
  if (USE_SECURE_API) {
    const data = await secureForumApi.listPosts({ category: categoryId });
    return (data || []).map(mapForumPostToFrontend);
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('category', categoryId)
    .order('pinned', { ascending: false })
    .order('last_reply_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapForumPostToFrontend);
};

export const loadForumThread = async (supabase, postId) => {
  if (USE_SECURE_API) {
    const data = await secureForumApi.getThread(postId);
    return {
      post: data?.post ? mapForumPostToFrontend(data.post) : null,
      replies: (data?.replies || []).map(mapForumReplyToFrontend)
    };
  }

  const [{ data: posts, error: postError }, { data: replies, error: replyError }] = await Promise.all([
    supabase.from('forum_posts').select('*').eq('id', postId).limit(1),
    supabase.from('forum_replies').select('*').eq('post_id', postId).order('created_at', { ascending: true })
  ]);
  if (postError) throw postError;
  if (replyError) throw replyError;

  return {
    post: Array.isArray(posts) && posts.length > 0 ? mapForumPostToFrontend(posts[0]) : null,
    replies: (replies || []).map(mapForumReplyToFrontend)
  };
};

export const createForumPost = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureForumApi.createPost({
      category: payload?.category,
      title: payload?.title,
      content: payload?.content
    });
    return mapForumPostToFrontend(result?.post || result);
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      user_id: payload?.userId,
      user_name: payload?.userName,
      user_role: payload?.userRole,
      user_avatar: payload?.userAvatar,
      category: payload?.category,
      title: payload?.title,
      content: payload?.content
    })
    .select()
    .single();
  if (error) throw error;
  return mapForumPostToFrontend(data);
};

export const createForumReply = async (supabase, postId, payload) => {
  if (USE_SECURE_API) {
    const result = await secureForumApi.createReply(postId, {
      content: payload?.content
    });
    return mapForumReplyToFrontend(result?.reply || result);
  }

  const { data, error } = await supabase
    .from('forum_replies')
    .insert({
      post_id: postId,
      user_id: payload?.userId,
      user_name: payload?.userName,
      user_role: payload?.userRole,
      user_avatar: payload?.userAvatar,
      content: payload?.content
    })
    .select()
    .single();
  if (error) throw error;
  return mapForumReplyToFrontend(data);
};

export const deleteForumPost = async (supabase, postId) => {
  if (USE_SECURE_API) {
    return secureForumApi.removePost(postId);
  }

  const { error } = await supabase
    .from('forum_posts')
    .delete()
    .eq('id', postId);
  if (error) throw error;
};

export const deleteForumReply = async (supabase, replyId) => {
  if (USE_SECURE_API) {
    return secureForumApi.removeReply(replyId);
  }

  const { error } = await supabase
    .from('forum_replies')
    .delete()
    .eq('id', replyId);
  if (error) throw error;
};

export const toggleForumPostPin = async (supabase, postId, currentPinned) => {
  if (USE_SECURE_API) {
    return secureForumApi.togglePin(postId);
  }

  const { error } = await supabase
    .from('forum_posts')
    .update({ pinned: !currentPinned })
    .eq('id', postId);
  if (error) throw error;
};

export const toggleForumPostLock = async (supabase, postId, currentLocked) => {
  if (USE_SECURE_API) {
    return secureForumApi.toggleLock(postId);
  }

  const { error } = await supabase
    .from('forum_posts')
    .update({ locked: !currentLocked })
    .eq('id', postId);
  if (error) throw error;
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

export const loadUserBadges = async (supabase, userInput) => {
  if (!userInput?.id && !userInput?.name) return [];

  let badgesData = null;

  if (userInput?.id) {
    const { data } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_id', userInput.id);
    if (Array.isArray(data) && data.length > 0) {
      badgesData = data;
    }
  }

  if ((!badgesData || badgesData.length === 0) && userInput?.name) {
    const { data } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_name', userInput.name);
    badgesData = data || [];
  }

  return (badgesData || []).map((badge) => ({
    id: badge.badge_id,
    earnedAt: new Date(badge.earned_at).getTime()
  }));
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
      userId: fc.userId || fc.creatorId || fc.user_id,
      createdBy: fc.createdBy || fc.created_by || fc.creator?.displayName || '',
      time: new Date(fc.createdAt || fc.created_at || Date.now()).getTime()
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
      approved: fc.approved, userId: fc.user_id,
      createdBy: fc.created_by || '',
      time: new Date(fc.created_at || Date.now()).getTime()
    };
    if (fc.approved) approvedCards.push(card);
    else pendingCards.push(card);
  });
  return { approved: approvedCards, pending: pendingCards };
};

// ─── Custom Questions + Reports ──────────────────────────────────────

export const createFlashcardEntry = async (supabase, payload) => {
  if (USE_SECURE_API) {
    const result = await secureFlashcardsApi.create({
      category: payload?.category,
      question: payload?.question,
      answer: payload?.answer
    });
    const flashcard = result?.flashcard || result;
    return {
      id: flashcard?.id,
      category: flashcard?.category,
      front: flashcard?.question || flashcard?.front || '',
      back: flashcard?.answer || flashcard?.back || '',
      approved: flashcard?.approved ?? false,
      userId: flashcard?.userId || flashcard?.creatorId || flashcard?.user_id || null,
      createdBy: flashcard?.createdBy || flashcard?.created_by || flashcard?.creator?.displayName || payload?.createdBy || '',
      time: new Date(flashcard?.createdAt || flashcard?.created_at || Date.now()).getTime()
    };
  }

  const { data, error } = await supabase
    .from('flashcards')
    .insert([{
      user_id: payload?.userId,
      category: payload?.category,
      question: payload?.question,
      answer: payload?.answer,
      approved: Boolean(payload?.approved)
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    category: data.category,
    front: data.question,
    back: data.answer,
    approved: Boolean(data.approved),
    userId: data.user_id,
    createdBy: payload?.createdBy || data.created_by || '',
    time: new Date(data.created_at || Date.now()).getTime()
  };
};

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

export const loadBerichtsheftProfile = async (supabase, userId = null) => {
  if (USE_SECURE_API) {
    return secureReportBooksApi.getProfile();
  }
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('berichtsheft_profile')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data?.berichtsheft_profile || null;
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
  if (userInput && typeof userInput === 'object' && userInput.id) {
    return {
      userId: userInput.id,
      userName: userInput.name || ''
    };
  }

  if (USE_SECURE_API) {
    return null;
  }

  const userName = String(userInput || '').trim();
  if (!userName) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name')
    .ilike('name', userName)
    .limit(2);

  if (error) throw error;
  if (!Array.isArray(data) || data.length !== 1) return null;

  return {
    userId: data[0].id,
    userName: data[0].name || userName
  };
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
