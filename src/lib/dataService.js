/**
 * Data Service Layer — NestJS API adapter.
 *
 * Every function returns data in the shape that App.jsx / views expect.
 */

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
  secureBadgesApi,
  mapBackendUserToFrontendUser,
  mapBackendRoleToFrontendRole,
  mapFrontendRoleToBackendRole
} from './secureApi';
import { getApiAccessToken } from './secureApiClient';
import { PERMISSIONS } from '../data/constants';
import { triggerWebPushNotification } from './pushNotifications';


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

const normalizeChatRole = (role) => {
  const normalized = String(role || '').trim();
  if (!normalized) return 'azubi';

  const lowerCaseRole = normalized.toLowerCase();
  if (['admin', 'trainer', 'azubi', 'rettungsschwimmer_azubi'].includes(lowerCaseRole)) {
    return lowerCaseRole;
  }

  return mapBackendRoleToFrontendRole(normalized);
};

const mapChatMessageToFrontend = (message, fallback = {}) => ({
  id: message?.id,
  user: fallback.userName || message?.senderName || message?.user_name || message?.sender?.displayName || 'Unbekannt',
  text: message?.content || message?.text || '',
  time: new Date(message?.createdAt || message?.created_at || Date.now()).getTime(),
  avatar: fallback.avatar ?? message?.senderAvatar ?? message?.user_avatar ?? message?.sender?.avatar ?? null,
  senderId: fallback.senderId || message?.senderId || message?.sender_id || message?.sender?.id || null,
  senderRole: normalizeChatRole(
    fallback.senderRole || message?.senderRole || message?.user_role || message?.sender?.role || 'azubi'
  ),
  scope: String(
    fallback.scope || message?.scope || message?.chatScope || message?.chat_scope || 'public'
  ).toLowerCase(),
  organizationId: fallback.organizationId ?? message?.organizationId ?? message?.organization_id ?? null,
  recipientId: fallback.recipientId ?? message?.recipientId ?? message?.recipient_id ?? null,
  deletedAt: message?.deletedAt || message?.deleted_at || null,
  deletedByUserId: message?.deletedByUserId || message?.deleted_by_user_id || null,
  isDeleted: Boolean(message?.deletedAt || message?.deleted_at)
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
export const loadUsers = async (currentUser) => {
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
};

export const updateMyProfile = async (userId, payload) => {
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
};

export const updateMyAvatar = async (userId, avatarId) => {
  return updateMyProfile(userId, { avatar: avatarId });
};

export const changeMyPassword = async (payload) => {
  return secureAuthApi.changePassword({
    currentPassword: payload?.currentPassword,
    newPassword: payload?.newPassword
  });
};

export const previewInvitationCodeStatus = async (invitationCode) => {
  const code = String(invitationCode || '').trim().toUpperCase();
  if (!code || code.length < 4) return null;

  return { secureValidation: true };
};

export const requestPasswordReset = async (email, options = {}) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  return secureAuthApi.requestPasswordReset({ email: normalizedEmail });
};

export const confirmPasswordReset = async (payload = {}) => {
  const token = payload?.token || null;
  if (!token) {
    throw new Error('Der Passwort-Reset-Link ist unvollstÃ¤ndig oder abgelaufen.');
  }
  return secureAuthApi.confirmPasswordReset({
    token,
    newPassword: payload?.newPassword || ''
  });
};

export const loadCurrentAuthSession = async () => {
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
};

export const subscribeAuthStateChanges = () => {
  return () => {};
};

export const registerAuthAccount = async (payload = {}) => {
  const trimmedEmail = String(payload?.email || '').trim().toLowerCase();
  const trimmedName = String(payload?.name || payload?.displayName || '').trim();
  const trimmedCode = String(payload?.invitationCode || '').trim().toUpperCase();
  const trainingEnd = payload?.trainingEnd || null;
  const password = payload?.password || '';

  try {
    await secureAuthApi.register({
      email: trimmedEmail,
      displayName: trimmedName,
      password,
      invitationCode: trimmedCode,
      ...(trainingEnd ? { trainingEnd } : {})
    });
  } catch (error) {
    const message = String(error?.message || '').toLowerCase();
    if (error?.status === 409 || message.includes('already registered')) {
      throw createAuthFlowError('already_registered', 'Diese E-Mail ist bereits registriert.');
    }
    if (
      error?.status === 400
      && (message.includes('invitation') || message.includes('einladung') || message.includes('exhausted'))
    ) {
      throw createAuthFlowError('invalid_invitation', 'Ungueltiger oder abgelaufener Einladungscode.');
    }
    throw error;
  }

  return {
    email: trimmedEmail,
    organizationName: null,
    assignedRole: payload?.role || 'azubi',
    emailConfirmRequired: false
  };
};

export const loginAuthAccount = async (payload = {}) => {
  const email = String(payload?.email || '').trim();
  const password = payload?.password || '';

  let result;
  try {
    result = await secureAuthApi.login({ email, password });
  } catch (error) {
    // Re-map any 401 from the login endpoint to invalid_login so the UI
    // never shows "Sitzung abgelaufen" when credentials are rejected.
    if (error?.status === 401) {
      throw createAuthFlowError('invalid_login', error.message || 'Invalid credentials');
    }
    throw error;
  }

  // If server requires TOTP, propagate the pending token to the UI
  if (result?.requiresTotp && result?.totpToken) {
    throw createAuthFlowError('totp_required', result.totpToken);
  }

  // The backend always returns { accessToken, user } on success.
  // Only fall back to GET /me if the user is missing — and only when
  // a fresh access token is actually available to avoid a spurious
  // refresh-cookie lookup that would surface a confusing 401.
  let backendUser = result?.user ?? null;
  if (!backendUser && getApiAccessToken()) {
    backendUser = await secureAuthApi.me();
  }

  const user = withPermissions(mapBackendUserToFrontendUser(backendUser));

  if (!user?.approved) {
    await secureAuthApi.logout();
    throw createAuthFlowError('not_approved', 'Dein Account wurde noch nicht freigeschaltet.');
  }

  return {
    user,
    azubiProfile: user?.berichtsheft_profile || null
  };
};

export const logoutAuthSession = async () => {
  try {
    await secureAuthApi.logout();
  } catch {
    // ignore logout cleanup failures
  }
  return;
};

export const deleteMyAccount = async (userId) => {
  return secureUsersApi.deleteSelf();
};

// ─── TOTP / 2FA ──────────────────────────────────────────────────────

export const getTotpStatus = async () => secureAuthApi.getTotpStatus();
export const generateTotpSetup = async () => secureAuthApi.generateTotpSetup();
export const enableTotp = async (setupToken, code) => secureAuthApi.enableTotp(setupToken, code);
export const disableTotp = async (password) => secureAuthApi.disableTotp(password);
export const regenerateTotpRecoveryCodes = async (password) => secureAuthApi.regenerateTotpRecoveryCodes(password);

export const authenticateWithTotp = async (totpToken, payload = {}) => {
  const result = await secureAuthApi.authenticateWithTotp(totpToken, payload);
  const backendUser = result?.user ?? null;
  const user = withPermissions(mapBackendUserToFrontendUser(backendUser));
  if (!user?.approved) {
    await secureAuthApi.logout();
    throw createAuthFlowError('not_approved', 'Dein Account wurde noch nicht freigeschaltet.');
  }
  return { user, azubiProfile: user?.berichtsheft_profile || null };
};

// ─── App Config ──────────────────────────────────────────────────────

export const loadOrganizationsAndInvitations = async () => {
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
      organization_id: invitation.organization?.id,
      organizations: invitation.organization ? { name: invitation.organization.name } : null,
      role: String(invitation.role || '').toLowerCase(),
      max_uses: invitation.maxUses,
      used_count: invitation.usedCount || 0,
      is_active: invitation.revokedAt == null,
      created_at: invitation.createdAt,
      expires_at: invitation.expiresAt
    }))
  };
};

export const createOrganizationEntry = async (payload) => {
  const slug = String(payload?.slug || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');

  return secureOrganizationsApi.create({
    name: String(payload?.name || '').trim(),
    slug,
    contactName: payload?.contact_name || payload?.contactName || undefined,
    contactEmail: payload?.contact_email || payload?.contactEmail || undefined
  });
};

export const createInvitationEntry = async (payload) => {
  return secureInvitationsApi.create({
    role: mapFrontendRoleToBackendRole(payload?.role),
    organizationId: payload?.organization_id || payload?.organizationId,
    maxUses: payload?.max_uses || payload?.maxUses || 30
  });
};

export const toggleInvitationEntryActive = async (invitationId, currentActive) => {
  if (currentActive) {
    return secureInvitationsApi.revoke(invitationId);
  }
  return null;
};

export const deleteInvitationEntry = async (invitationId) => {
  return secureInvitationsApi.revoke(invitationId);
};

export const loadActiveOrganizations = async () => {
  const organizations = await secureOrganizationsApi.list();
  return (organizations || []).map((organization) => ({
    id: organization.id,
    name: organization.name
  }));
};

export const assignUserOrganization = async (userId, organizationId) => {
  return secureUsersApi.updateOrganization(userId, { organizationId: organizationId || null });
};

export const adminResetUserPassword = async (userId, userEmail, newPassword) => {
  return secureUsersApi.adminResetPassword(userId, newPassword);
};

export const adminUpdateAvatarUnlocks = async (userId, avatarIds) => {
  return secureUsersApi.updateAvatarUnlocks(userId, Array.isArray(avatarIds) ? avatarIds : []);
};

export const loadRetentionCandidates = async () => {
  return secureUsersApi.list().then(users =>
    (users || []).filter(u => u.role === 'RETTUNGSSCHWIMMER_AZUBI' || u.role === 'AUSBILDER')
  );
};

export const exportUserDataBundle = async (userInput, fallbackUserName = null) => {
  const targetUser = isPlainObject(userInput) ? userInput : null;
  const targetUserId = String(targetUser?.id || '').trim();
  const email = String(targetUser?.email ?? userInput ?? '').trim();
  const userName = String(targetUser?.name ?? targetUser?.displayName ?? fallbackUserName ?? '').trim();

  if (targetUserId) {
    return secureUsersApi.exportUserData(targetUserId);
  }
  return secureUsersApi.exportMe();
};

export const loadAppConfig = async () => {
  const config = await safe(() => secureAppConfigApi.get(), null);
  if (!config) return null;
  return {
    menuItems: config.menuItems || null,
    themeColors: config.themeColors || null,
    featureFlags: config.featureFlags || {},
    companies: config.companies || null,
    announcement: config.announcement || null
  };
};

export const saveAppConfig = async (config) => {
  await secureAppConfigApi.update(config);
  return;
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
  const player1Score = Number(d.challengerScore ?? gs.player1Score ?? 0);
  const player2Score = Number(d.duelOpponentScore ?? gs.player2Score ?? 0);

  return {
    id: d.id,
    player1,
    player2,
    player1Score,
    player2Score,
    currentTurn,
    categoryRound: gs.categoryRound ?? 0,
    round: gs.categoryRound ?? 0,
    status: effectiveStatus,
    difficulty: gs.difficulty || 'normal',
    categoryRounds: gs.categoryRounds || [],
    winner: d.winnerUser?.displayName || gs.winner || null,
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

export const loadGames = async (limit = 200, currentUserId = null) => {
  const duels = await secureDuelsApi.list();
  return (duels || []).map(d => mapDuelToGame(d, currentUserId));
};

// ─── Chat Messages ───────────────────────────────────────────────────

export const loadMessages = async (normalizeFn, userDirectory, userRole) => {
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
      allMessages.push(
        ...result.value
          .map((message) => mapChatMessageToFrontend(message))
          .filter((message) => !message.isDeleted)
      );
    }
  }
  return allMessages;
};

export const loadDirectMessages = async ({ recipientId, currentUserId } = {}) => {
  if (!recipientId) return [];

  const directMsgs = await secureChatApi.list({
    scope: 'DIRECT_STAFF',
    recipientId,
    limit: 100
  });

  return (directMsgs || [])
    .map((message) => mapChatMessageToFrontend(message, { scope: 'direct_staff' }))
    .filter((message) => !message.isDeleted);
};

export const createChatMessage = async (payload) => {
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

  const requestPayload = {
    content: messagePayload.content,
    scope: messagePayload.scope.toUpperCase()
  };
  if (messagePayload.recipientId) {
    requestPayload.recipientId = messagePayload.recipientId;
  }
  const result = await secureChatApi.create(requestPayload);
  return mapChatMessageToFrontend(result, messagePayload);
};

export const deleteChatMessage = async (messageId) => {
  const result = await secureChatApi.remove(messageId);
  return {
    id: result?.id || messageId
  };
};

// ─── Forum ───────────────────────────────────────────────────────────

export const loadForumCategoryCounts = async () => {
  const data = await secureForumApi.listCategories();
  const counts = {};
  (data || []).forEach((entry) => {
    counts[entry.category] = entry.count || 0;
  });
  return counts;
};

export const loadForumPosts = async (categoryId) => {
  const data = await secureForumApi.listPosts({ category: categoryId });
  return (data || []).map(mapForumPostToFrontend);
};

export const loadForumThread = async (postId) => {
  const data = await secureForumApi.getThread(postId);
  return {
    post: data?.post ? mapForumPostToFrontend(data.post) : null,
    replies: (data?.replies || []).map(mapForumReplyToFrontend)
  };
};

export const createForumPost = async (payload) => {
  const result = await secureForumApi.createPost({
    category: payload?.category,
    title: payload?.title,
    content: payload?.content
  });
  return mapForumPostToFrontend(result?.post || result);
};

export const createForumReply = async (postId, payload) => {
  const result = await secureForumApi.createReply(postId, {
    content: payload?.content
  });
  return mapForumReplyToFrontend(result?.reply || result);
};

export const deleteForumPost = async (postId) => {
  return secureForumApi.removePost(postId);
};

export const deleteForumReply = async (replyId) => {
  return secureForumApi.removeReply(replyId);
};

export const toggleForumPostPin = async (postId, currentPinned) => {
  return secureForumApi.togglePin(postId);
};

export const toggleForumPostLock = async (postId, currentLocked) => {
  return secureForumApi.toggleLock(postId);
};

// ─── Notifications ───────────────────────────────────────────────────

export const loadNotifications = async (userName) => {
  const notifs = await secureNotificationsApi.list();
  return (notifs || []).map(n => ({
    id: n.id,
    title: n.title || '',
    message: n.message || n.body || '',
    type: n.type || 'info',
    read: Boolean(n.read ?? n.isRead),
    createdAt: n.createdAt
  }));
};

export const sendNotification = async ({ userName, title, message, type = 'info', triggerPush = true }) => {
  // Secure-backend mode emits notifications server-side from the action endpoints.
  // The legacy generic notification insert is Supabase-specific and should not
  // produce invalid DTO requests against NestJS.
  return null;
};

export const markNotificationRead = async (notifId) => {
  await secureNotificationsApi.markRead(notifId);
  return;
};

export const clearAllNotifications = async (userName) => {
  await secureNotificationsApi.clear();
  return;
};

// ─── User Stats ──────────────────────────────────────────────────────

export const getUserStats = async (userInput) => {
  return safe(() => secureUserStatsApi.me(), null);
};

export const getAllUserStats = async () => {
  return safe(() => secureUserStatsApi.summary(), []);
};

// Backend liefert { id (row-cuid), badgeId, earnedAt (ISO) }.
// useBadges.js erwartet { id (badge-token), earnedAt (epoch ms) }.
const mapBackendBadge = (row) => ({
  id: row.badgeId,
  earnedAt: row.earnedAt ? new Date(row.earnedAt).getTime() : Date.now()
});

export const loadUserBadges = async () => {
  return safe(async () => {
    const rows = await secureBadgesApi.me();
    return Array.isArray(rows) ? rows.map(mapBackendBadge) : [];
  }, []);
};

export const saveUserStats = async (userInput, stats) => {
  // The NestJS backend manages stats server-side via duel answers.
  // For now, we only persist category_stats from the frontend.
  // Full server-side stats sync is handled by the backend.
  return;
};

// ─── Content (Materials, Resources, News, Exams) ─────────────────────

export const loadMaterials = async () => {
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
};

export const loadResources = async () => {
  const data = await secureContentApi.listResources();
  return (data || []).map(r => ({
    id: r.id, title: r.title, description: r.description,
    url: r.url, type: r.category || r.type,
    addedBy: r.createdBy || r.creator?.displayName || '',
    time: new Date(r.createdAt || Date.now()).getTime()
  }));
};

export const loadNews = async () => {
  const data = await secureContentApi.listNews();
  return (data || []).map(n => ({
    id: n.id, title: n.title, content: n.content,
    author: n.author || n.creator?.displayName || '',
    time: new Date(n.createdAt || Date.now()).getTime()
  }));
};

export const loadExams = async () => {
  const data = await secureContentApi.listExams();
  return (data || []).map(e => ({
    id: e.id, title: e.title, description: e.description,
    date: e.examDate || e.date,
    location: e.location,
    createdBy: e.createdBy || e.creator?.displayName || '',
    time: new Date(e.createdAt || Date.now()).getTime()
  }));
};

// ─── Flashcards ──────────────────────────────────────────────────────

export const loadFlashcards = async () => {
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
};

// ─── Custom Questions + Reports ──────────────────────────────────────

export const createFlashcardEntry = async (payload) => {
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
};

export const loadCustomQuestions = async () => {
  const data = await secureQuestionWorkflowsApi.listSubmissions();
  return (data || []).map((question) => mapQuestionSubmissionToFrontend(question));
};

export const createQuestionSubmission = async (payload) => {
  const result = await secureQuestionWorkflowsApi.createSubmission({
    category: payload?.category,
    question: payload?.question,
    answers: payload?.answers,
    correct: payload?.correct
  });
  return mapQuestionSubmissionToFrontend(result, payload);
};

export const approveQuestionSubmission = async (questionId) => {
  return secureQuestionWorkflowsApi.approveSubmission(questionId);
};

export const loadQuestionReports = async () => {
  const data = await secureQuestionWorkflowsApi.listReports();
  return (data || []).map((r) => ({
    id: r.id ? String(r.id) : `remote-${Date.now()}`,
    questionKey: pickPayloadValue(r, 'questionKey', 'question_key') || '',
    questionText: pickPayloadValue(r, 'questionText', 'question_text', 'question') || '',
    category: r.category || 'unknown',
    source: r.source || 'unknown',
    note: r.note || '',
    answers: Array.isArray(r.answers) ? r.answers : [],
    reportedBy:
      pickPayloadValue(r, 'reportedBy', 'reported_by')
      || r.reporter?.displayName
      || 'Unbekannt',
    reportedById:
      pickPayloadValue(r, 'reportedById', 'reported_by_id')
      || r.reporter?.id
      || null,
    status: r.status || 'open',
    createdAt: pickPayloadValue(r, 'createdAt', 'created_at') || new Date().toISOString()
  }));
};

// ─── Admin: Approve / Delete / Role ──────────────────────────────────

export const approveUser = async (email, allUsers) => {
  const target = (allUsers || []).find(
    u => String(u.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase()
  );
  if (!target?.id) throw new Error('User nicht gefunden');
  const result = await secureUsersApi.updateApproval(target.id, { status: 'APPROVED' });
  return { account: mapBackendUserToFrontendUser(result) };
};

export const deleteUser = async (email, allUsers) => {
  const target = (allUsers || []).find(
    u => String(u.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase()
  );
  if (!target?.id) throw new Error('User nicht gefunden');
  if (target.role === 'admin') throw new Error('Administratoren können nicht gelöscht werden');
  await secureUsersApi.deleteUser(target.id);
  return;
};

export const purgeUserData = async (userId, userName) => {
  return secureUsersApi.deleteUser(userId);
};

export const changeUserRole = async (email, newRole, allUsers) => {
  const target = (allUsers || []).find(
    u => String(u.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase()
  );
  if (!target?.id) throw new Error('User nicht gefunden');
  await secureUsersApi.updateRole(target.id, {
    role: mapFrontendRoleToBackendRole(newRole)
  });
  return;
};

export const updateUserPermission = async (userId, field, enabled) => {
  return secureUsersApi.updatePermissions(userId, { [field]: enabled });
};

export const verifyParentalConsent = async (userId, status, note) => {
  const result = await secureUsersApi.verifyParentalConsent(userId, { status, note });
  return mapBackendUserToFrontendUser(result);
};

// ─── Swim Training Plans ─────────────────────────────────────────────

export const loadSwimTrainingPlans = async () => {
  const data = await secureSwimTrainingPlansApi.list();
  return (data || []).map(p => ({
    id: p.id,
    name: p.name || p.title,
    description: p.description || '',
    exercises: p.exercises || [],
    createdBy: p.createdBy || p.creator?.displayName || '',
    createdAt: p.createdAt
  }));
};

// ─── Theory Exam Attempts ────────────────────────────────────────────

export const startTheoryExamSession = async (keywordMode = false) => {
  return secureExamSimulatorApi.startTheorySession({
    keywordMode: Boolean(keywordMode)
  });
};

export const saveTheoryExamAttempt = async (userId, userName, progress, keywordMode, sessionPayload = null) => {
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
};

export const loadTheoryExamHistory = async (userId, canViewAll) => {
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
};

// ─── Practical Exam Attempts ─────────────────────────────────────────

export const deletePracticalExamAttempt = async (attemptId) => {
  await secureExamSimulatorApi.removePracticalAttempt(attemptId);
  return;
};

// ─── School Attendance ──────────────────────────────────────────────

export const loadSchoolAttendanceAzubis = async () => {
  const users = await secureUsersApi.list();
  return (users || [])
    .filter(u => String(u.role).toUpperCase() === 'AZUBI' && String(u.status).toUpperCase() === 'APPROVED')
    .map(u => ({ id: u.id, name: u.displayName, email: u.email }))
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'de'));
};

export const loadSchoolAttendance = async (userId) => {
  const entries = await secureSchoolAttendanceApi.list({ userId });
  return (entries || []).map(e => ({
    id: e.id, user_id: e.userId, user_name: e.userName,
    date: e.date, start_time: e.startTime, end_time: e.endTime,
    teacher_signature: e.teacherSignature || null,
    trainer_signature: e.trainerSignature || null,
    created_at: e.createdAt
  }));
};

export const addSchoolAttendanceEntry = async (payload) => {
  return secureSchoolAttendanceApi.create(toSecureSchoolAttendancePayload(payload));
};

export const updateSchoolAttendanceSignature = async (entryId, field, value) => {
  return secureSchoolAttendanceApi.updateSignature(entryId, {
    field: normalizeSignatureField(field),
    value
  });
};

export const deleteSchoolAttendanceEntry = async (entryId) => {
  return secureSchoolAttendanceApi.remove(entryId);
};

// ─── Exam Grades ────────────────────────────────────────────────────

export const loadExamGradesAzubis = async () => {
  // Same data source as school attendance azubis
  return loadSchoolAttendanceAzubis();
};

export const loadExamGradeEntries = async (userId) => {
  const entries = await secureExamGradesApi.list({ userId });
  return (entries || []).map(e => ({
    id: e.id, user_id: e.userId, user_name: e.userName,
    date: e.date, subject: e.subject, topic: e.topic,
    grade: e.grade, notes: e.notes, created_at: e.createdAt
  }));
};

export const addExamGradeEntry = async (payload) => {
  return secureExamGradesApi.create(toSecureExamGradePayload(payload));
};

export const deleteExamGradeEntry = async (gradeId) => {
  return secureExamGradesApi.remove(gradeId);
};

// ─── Content CRUD ───────────────────────────────────────────────────

export const addMaterialEntry = async (payload) => {
  const result = await secureContentApi.createMaterial(toSecureMaterialPayload(payload));
  return {
    id: result.id, title: result.title, category: result.category,
    createdBy: result.createdBy || result.created_by, time: new Date(result.createdAt || Date.now()).getTime()
  };
};

export const addResourceEntry = async (payload) => {
  const result = await secureContentApi.createResource(toSecureResourcePayload(payload));
  return {
    id: result.id, title: result.title, url: result.url,
    type: result.category || result.type, description: result.description,
    addedBy: result.createdBy || result.created_by, time: new Date(result.createdAt || Date.now()).getTime()
  };
};

export const deleteResourceEntry = async (resourceId) => {
  return secureContentApi.removeResource(resourceId);
};

export const addNewsEntry = async (payload) => {
  const result = await secureContentApi.createNews(toSecureNewsPayload(payload));
  return {
    id: result.id, title: result.title, content: result.content,
    author: result.author || result.createdBy, time: new Date(result.createdAt || Date.now()).getTime()
  };
};

export const deleteNewsEntry = async (newsId) => {
  return secureContentApi.removeNews(newsId);
};

export const addExamEntry = async (payload) => {
  const result = await secureContentApi.createExam(toSecureExamPayload(payload));
  return {
    id: result.id, title: result.title, description: result.description,
    date: result.examDate || result.date, createdBy: result.createdBy || result.created_by,
    time: new Date(result.createdAt || Date.now()).getTime()
  };
};

export const deleteExamEntry = async (examId) => {
  return secureContentApi.removeExam(examId);
};

export const approveFlashcardEntry = async (flashcardId) => {
  return secureFlashcardsApi.approve(flashcardId);
};

export const deleteFlashcardEntry = async (flashcardId) => {
  return secureFlashcardsApi.remove(flashcardId);
};

// ─── Quiz Duels ─────────────────────────────────────────────────────

export const createDuel = async (payload, currentUserId = null) => {
  const result = await secureDuelsApi.create({
    opponentId: payload.opponentId,
    requestTimeoutMinutes: payload.challengeTimeoutMinutes || undefined
  });
  return mapDuelToGame(result, currentUserId);
};

export const acceptDuel = async (gameId, currentUserId = null) => {
  const result = await secureDuelsApi.accept(gameId);
  return mapDuelToGame(result, currentUserId);
};

export const getDuelWithQuestions = async (duelId, currentUserId = null) => {
  const result = await secureDuelsApi.getById(duelId);
  const game = mapDuelToGame(result, currentUserId);

  // Store duelQuestionId and revealed correctOptionIndex in categoryRound questions.
  // Questions are ordered sequentially (orderIndex 0,1,2,...) across all rounds.
  if (Array.isArray(result.questions) && result.questions.length > 0) {
    let globalIdx = 0;
    game.categoryRounds = (game.categoryRounds || []).map((round) => ({
      ...round,
      questions: (round.questions || []).map((q) => {
        const apiQ = result.questions[globalIdx++];
        if (!apiQ) return q;
        const merged = { ...q, duelQuestionId: apiQ.id };
        if (apiQ.question?.correctOptionIndex != null) {
          merged.correct = apiQ.question.correctOptionIndex;
        }
        if (apiQ.myAnswer != null) {
          merged.myAnswerCorrect = apiQ.myAnswer.isCorrect ?? null;
        }
        return merged;
      })
    }));
  }

  return game;
};

export const submitDuelAnswer = async (duelId, duelQuestionId, selectedOptionIndex) => {
  return secureDuelsApi.submitAnswer(duelId, { duelQuestionId, selectedOptionIndex, answerType: 'single' });
};

export const submitDuelKeywordAnswer = async (duelId, duelQuestionId, keywordText, answerType = 'keyword') => {
  return secureDuelsApi.submitAnswer(duelId, {
    duelQuestionId,
    answerType,
    keywordText: String(keywordText ?? '').slice(0, 500)
  });
};

export const submitDuelMultiAnswer = async (duelId, duelQuestionId, selectedOptionIndices) => {
  const cleaned = Array.from(new Set(
    (Array.isArray(selectedOptionIndices) ? selectedOptionIndices : [])
      .map((idx) => Number(idx))
      .filter((idx) => Number.isInteger(idx) && idx >= 0 && idx <= 20)
  ));
  return secureDuelsApi.submitAnswer(duelId, {
    duelQuestionId,
    answerType: 'multi',
    selectedOptionIndices: cleaned
  });
};

export const startDuelRound = async (duelId, categoryId, currentUserId = null) => {
  await secureDuelsApi.startRound(duelId, categoryId);
  return getDuelWithQuestions(duelId, currentUserId);
};

export const forfeitDuel = async (duelId) => {
  return secureDuelsApi.forfeit(duelId);
};

// Questions and answer arrays are server-authoritative and must not be PATCHed via /state.
// The backend DTO (CategoryRoundDto) only accepts metadata fields — use POST /duels/:id/rounds
// and POST /duels/:id/answers instead. We still send round metadata so the backend keeps
// currentTurn/categoryRound in sync.
const toMetadataRound = (round) => {
  if (!round || typeof round !== 'object') return null;
  const categoryId = String(round.categoryId || round.category || '').trim();
  if (!categoryId) return null;
  const metadata = { categoryId };
  if (round.categoryName) metadata.categoryName = round.categoryName;
  if (round.chooser) metadata.chooser = round.chooser;
  return metadata;
};

export const saveDuelState = async (game) => {
  const metadataRounds = Array.isArray(game.categoryRounds)
    ? game.categoryRounds.map(toMetadataRound).filter(Boolean)
    : [];
  const gameState = {
    currentTurn: game.currentTurn,
    categoryRound: game.categoryRound || 0,
    status: game.status,
    difficulty: game.difficulty,
    categoryRounds: metadataRounds,
    challengeTimeoutMinutes: game.challengeTimeoutMinutes
  };
  await secureDuelsApi.updateGameState(game.id, gameState);
};


// ─── Swim Sessions ──────────────────────────────────────────────────

export const loadSwimSessionEntries = async () => {
  const sessions = await secureSwimSessionsApi.list();
  return (sessions || []).map(s => ({
    id: s.id, user_id: s.user_id || s.userId, user_name: s.user_name || s.userName, user_role: s.user_role || s.userRole,
    date: s.date, distance: s.distance, time_minutes: s.time_minutes ?? s.timeMinutes,
    style: s.style, notes: s.notes, challenge_id: s.challenge_id ?? s.challengeId ?? null,
    confirmed: Boolean(s.confirmed), confirmed_by: s.confirmed_by || s.confirmedBy || null,
    confirmed_at: s.confirmed_at || s.confirmedAt || null, created_at: s.created_at || s.createdAt
  }));
};

export const saveSwimSessionEntry = async (payload) => {
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
};

export const confirmSwimSessionEntry = async (sessionId, confirmerName) => {
  return secureSwimSessionsApi.confirm(sessionId);
};

export const rejectSwimSessionEntry = async (sessionId) => {
  return secureSwimSessionsApi.reject(sessionId);
};

export const withdrawSwimSessionEntry = async (sessionId) => {
  return secureSwimSessionsApi.withdraw(sessionId);
};

export const loadCustomSwimTrainingPlanEntries = async () => {
  const plans = await secureSwimTrainingPlansApi.list();
  return (plans || []).map(mapSecureSwimTrainingPlanToFrontendEntry);
};

export const createCustomSwimTrainingPlanEntry = async (payload) => {
  const result = await secureSwimTrainingPlansApi.create(toSecureSwimTrainingPlanPayload(payload));
  return mapSecureSwimTrainingPlanToFrontendEntry(result);
};

// ─── Berichtsheft ───────────────────────────────────────────────────

export const loadBerichtsheftEntriesFromDb = async (userName) => {
  const entries = await secureReportBooksApi.list();
  return (entries || []).map(mapSecureReportBookToFrontendEntry);
};

export const saveBerichtsheftEntry = async (payload, existingId = null) => {
  return secureReportBooksApi.submit(toSecureReportBookPayload(payload, existingId));
};

export const deleteBerichtsheftEntry = async (entryId) => {
  return secureReportBooksApi.remove(entryId);
};

export const loadBerichtsheftPending = async () => {
  const entries = await secureReportBooksApi.listPendingReview();
  return (entries || []).map(mapSecureReportBookToFrontendEntry);
};

export const assignBerichtsheftTrainerEntry = async (entryId, payload) => {
  return secureReportBooksApi.assignTrainer(entryId, toSecureAssignTrainerPayload(payload));
};

export const upsertBerichtsheftDraft = async (payload) => {
  const result = await secureReportBooksApi.upsertDraft(toSecureReportBookPayload(payload));
  return mapSecureReportBookToFrontendEntry(result?.entry || result);
};

export const deleteBerichtsheftDraftByWeek = async (weekStart, options = {}) => {
  return secureReportBooksApi.deleteDraftByWeek(weekStart);
};

export const loadBerichtsheftProfile = async (userId = null) => {
  return secureReportBooksApi.getProfile();
};

export const updateBerichtsheftProfile = async (userId, profile) => {
  return secureReportBooksApi.updateProfile(profile);
};

// ─── Practical Exam History ─────────────────────────────────────────

export const loadPracticalExamAttempts = async (userId, canViewAll) => {
  const attempts = await secureExamSimulatorApi.listPracticalAttempts(canViewAll ? {} : { userId });
  return (attempts || []).map(mapSecurePracticalAttemptToFrontendEntry);
};

export const savePracticalExamAttemptEntry = async (payload) => {
  const result = await secureExamSimulatorApi.createPracticalAttempt(toSecurePracticalExamAttemptPayload(payload));
  return mapSecurePracticalAttemptToFrontendEntry(result);
};

// ─── Question Reports ───────────────────────────────────────────────

export const reportQuestion = async (payload) => {
  return secureQuestionWorkflowsApi.createReport(toSecureQuestionReportPayload(payload));
};

export const updateQuestionReportStatus = async (reportId, status) => {
  return secureQuestionWorkflowsApi.updateReportStatus(reportId, { status });
};

export const deleteQuestionReport = async (reportId) => {
  return secureQuestionWorkflowsApi.deleteReport(reportId);
};

export const deleteResolvedQuestionReports = async () => {
  return secureQuestionWorkflowsApi.deleteResolvedReports();
};

// ─── Utility ────────────────────────────────────────────────────────

export const repairQuizStatsRemote = async (fetchPushBackendWithAuth) => {
  return secureUserStatsApi.repairQuizStats();
};

export const sendTestPushRemote = async (fetchPushBackendWithAuth, payload) => {
  return secureNotificationsApi.sendTestPush(toSecurePushTestPayload(payload));
};

export const getAuthorizedReviewers = async (filterField = null) => {
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
};

export const saveBadges = async (badges) => {
  if (!Array.isArray(badges) || badges.length === 0) return;
  const badgeIds = badges
    .map((b) => (typeof b === 'string' ? b : b?.id))
    .filter((id) => typeof id === 'string' && id.length > 0);
  if (badgeIds.length === 0) return;
  return safe(() => secureBadgesApi.grant(badgeIds), undefined);
};

export const resolveUserIdentity = async (userInput) => {
  if (userInput && typeof userInput === 'object' && userInput.id) {
    return {
      userId: userInput.id,
      userName: userInput.name || ''
    };
  }

  return null;
};

// ─── Swim Monthly Results ───────────────────────────────────────────

export const loadSwimMonthlyResultEntries = async (year) => {
  // NestJS backend may not have this endpoint yet — return empty
  return [];
};

export const upsertSwimMonthlyResultEntry = async (payload) => {
  // NestJS backend may not have this endpoint yet — no-op
  return;
};

// ─── Export flag for convenience ─────────────────────────────────────
