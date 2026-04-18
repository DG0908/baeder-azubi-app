import {
  apiRequest,
  clearApiAccessToken,
  isSecureBackendApiEnabled,
  refreshApiSession,
  setApiAccessToken
} from './secureApiClient';

// ─── Role / Status Mappings ───────────────────────────────

const BACKEND_ROLE_TO_FRONTEND: Record<string, string> = {
  ADMIN: 'admin',
  AUSBILDER: 'trainer',
  AZUBI: 'azubi',
  RETTUNGSSCHWIMMER_AZUBI: 'rettungsschwimmer_azubi'
};

const BACKEND_STATUS_TO_APPROVED: Record<string, boolean> = {
  APPROVED: true,
  PENDING: false,
  REJECTED: false,
  DISABLED: false
};

export const mapBackendRoleToFrontendRole = (role: unknown): string => (
  BACKEND_ROLE_TO_FRONTEND[String(role || '').toUpperCase()] || 'azubi'
);

interface BackendUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  status?: string;
  avatar?: string | null;
  company?: string | null;
  birthDate?: string | null;
  organizationId?: string | null;
  organization?: { id?: string; name?: string } | null;
  trainingEnd?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  approvedAt?: string | null;
  canSignReports?: boolean;
  can_sign_reports?: boolean;
  reportBookProfile?: unknown;
  report_book_profile?: unknown;
  unlockedAvatarIds?: string[];
  parentalConsentStatus?: string;
  parentalConsentNote?: string | null;
  parentalConsentVerifiedAt?: string | null;
}

export interface FrontendUser {
  id: string;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  status: string;
  isOwner: boolean;
  is_owner: boolean;
  avatar: string | null;
  company: string | null;
  birthDate: string | null;
  organizationId: string | null;
  organization_id: string | null;
  organizationName: string | null;
  trainingEnd: string | null;
  lastLogin: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  approvedAt: string | null;
  canViewSchoolCards: boolean;
  can_view_school_cards: boolean;
  canViewExamGrades: boolean;
  can_view_exam_grades: boolean;
  canSignReports: boolean;
  can_sign_reports: boolean;
  berichtsheft_profile: unknown;
  unlockedAvatarIds: string[];
  parentalConsentStatus: string;
  parentalConsentNote: string | null;
  parentalConsentVerifiedAt: string | null;
}

export const mapBackendUserToFrontendUser = (user: BackendUser | null | undefined): FrontendUser | null => {
  if (!user) return null;

  const frontendRole = mapBackendRoleToFrontendRole(user.role);
  const normalizedStatus = String(user.status || '').toUpperCase();
  const hasExplicitStatus = normalizedStatus.length > 0;
  return {
    id: user.id,
    name: user.displayName,
    email: user.email,
    role: frontendRole,
    approved: hasExplicitStatus
      ? (BACKEND_STATUS_TO_APPROVED[normalizedStatus] ?? false)
      : true,
    status: hasExplicitStatus ? user.status! : 'APPROVED',
    isOwner: false,
    is_owner: false,
    avatar: user.avatar || null,
    company: user.company || null,
    birthDate: user.birthDate || null,
    organizationId: user.organizationId || user.organization?.id || null,
    organization_id: user.organizationId || user.organization?.id || null,
    organizationName: user.organization?.name || null,
    trainingEnd: user.trainingEnd || null,
    lastLogin: user.lastLoginAt || null,
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null,
    approvedAt: user.approvedAt || null,
    canViewSchoolCards: false,
    can_view_school_cards: false,
    canViewExamGrades: false,
    can_view_exam_grades: false,
    canSignReports: Boolean(user.canSignReports ?? user.can_sign_reports),
    can_sign_reports: Boolean(user.canSignReports ?? user.can_sign_reports),
    berichtsheft_profile: user.reportBookProfile ?? user.report_book_profile ?? null,
    unlockedAvatarIds: Array.isArray(user.unlockedAvatarIds) ? user.unlockedAvatarIds : [],
    parentalConsentStatus: user.parentalConsentStatus || 'NOT_REQUIRED',
    parentalConsentNote: user.parentalConsentNote || null,
    parentalConsentVerifiedAt: user.parentalConsentVerifiedAt || null
  };
};

export const mapFrontendRoleToBackendRole = (role: unknown): string => {
  const normalizedRole = String(role || '').trim().toLowerCase();
  if (normalizedRole === 'admin') return 'ADMIN';
  if (normalizedRole === 'trainer') return 'AUSBILDER';
  if (normalizedRole === 'rettungsschwimmer_azubi') return 'RETTUNGSSCHWIMMER_AZUBI';
  return 'AZUBI';
};

// ─── Auth API ─────────────────────────────────────────────

export const secureAuthApi = {
  async register(payload: Record<string, unknown>) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async login(payload: Record<string, unknown>) {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }) as Record<string, unknown> | null;

    if (result?.accessToken) {
      setApiAccessToken(result.accessToken as string);
    }

    return result;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST'
      });
    } finally {
      clearApiAccessToken();
    }
  },

  async me() {
    return apiRequest('/auth/me', {
      method: 'GET'
    });
  },

  async refreshSession() {
    return refreshApiSession();
  },

  async changePassword(payload: Record<string, unknown>) {
    return apiRequest('/auth/password', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async requestPasswordReset(payload: Record<string, unknown>) {
    return apiRequest('/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async confirmPasswordReset(payload: Record<string, unknown>) {
    return apiRequest('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getTotpStatus() {
    return apiRequest('/auth/2fa/status', { method: 'GET' });
  },

  async generateTotpSetup() {
    return apiRequest('/auth/2fa/setup', { method: 'POST' });
  },

  async enableTotp(setupToken: string, code: string) {
    return apiRequest('/auth/2fa/enable', {
      method: 'POST',
      body: JSON.stringify({ setupToken, code })
    });
  },

  async disableTotp(password: string) {
    return apiRequest('/auth/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
  },

  async regenerateTotpRecoveryCodes(password: string) {
    return apiRequest('/auth/2fa/recovery-codes/regenerate', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
  },

  async authenticateWithTotp(totpToken: string, payload: { code?: string; recoveryCode?: string } = {}) {
    const result = await apiRequest('/auth/2fa/authenticate', {
      method: 'POST',
      body: JSON.stringify({
        totpToken,
        code: payload?.code,
        recoveryCode: payload?.recoveryCode
      })
    }) as Record<string, unknown> | null;
    if (result?.accessToken) {
      setApiAccessToken(result.accessToken as string);
    }
    return result;
  }
};

// ─── Users API ────────────────────────────────────────────

export const secureUsersApi = {
  me: () => apiRequest('/users/me', { method: 'GET' }),
  exportMe: () => apiRequest('/users/me/export', { method: 'GET' }),
  list: () => apiRequest('/users', { method: 'GET' }),
  pending: () => apiRequest('/users/pending', { method: 'GET' }),
  contacts: () => apiRequest('/users/contacts', { method: 'GET' }),
  updateMe: (payload: Record<string, unknown>) => apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  updateApproval: (userId: string, payload: Record<string, unknown>) => apiRequest(`/users/${userId}/approval`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  updateRole: (userId: string, payload: Record<string, unknown>) => apiRequest(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  updateOrganization: (userId: string, payload: Record<string, unknown>) => apiRequest(`/users/${userId}/organization`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  exportUserData: (userId: string) => apiRequest(`/users/${userId}/export`, {
    method: 'GET'
  }),
  deleteUser: (userId: string) => apiRequest(`/users/${userId}`, {
    method: 'DELETE'
  }),
  deleteSelf: () => apiRequest('/users/me', {
    method: 'DELETE'
  }),
  updatePermissions: (userId: string, payload: Record<string, unknown>) => apiRequest(`/users/${userId}/permissions`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  adminResetPassword: (userId: string, newPassword: string) => apiRequest(`/users/${userId}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ newPassword })
  }),
  updateAvatarUnlocks: (userId: string, avatarIds: string[]) => apiRequest(`/users/${userId}/avatar-unlocks`, {
    method: 'POST',
    body: JSON.stringify({ avatarIds })
  }),
  verifyParentalConsent: (userId: string, payload: Record<string, unknown>) => apiRequest(`/users/${userId}/parental-consent`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
};

// ─── Organizations API ────────────────────────────────────

export const secureOrganizationsApi = {
  list: () => apiRequest('/organizations', { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/organizations', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getById: (organizationId: string) => apiRequest(`/organizations/${organizationId}`, { method: 'GET' })
};

// ─── App Config API ───────────────────────────────────────

export const secureAppConfigApi = {
  get: () => apiRequest('/app-config', { method: 'GET' }),
  update: (payload: Record<string, unknown>) => apiRequest('/app-config', {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
};

// ─── Invitations API ──────────────────────────────────────

export const secureInvitationsApi = {
  list: () => apiRequest('/invitations', { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/invitations', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  revoke: (invitationId: string) => apiRequest(`/invitations/${invitationId}`, {
    method: 'DELETE'
  })
};

// ─── Duels API ────────────────────────────────────────────

export const secureDuelsApi = {
  list: () => apiRequest('/duels', { method: 'GET' }),
  leaderboard: () => apiRequest('/duels/leaderboard', { method: 'GET' }),
  getById: (duelId: string) => apiRequest(`/duels/${duelId}`, { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/duels', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  accept: (duelId: string) => apiRequest(`/duels/${duelId}/accept`, {
    method: 'POST'
  }),
  submitAnswer: (duelId: string, payload: Record<string, unknown>) => apiRequest(`/duels/${duelId}/answers`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateGameState: (duelId: string, gameState: unknown) => apiRequest(`/duels/${duelId}/state`, {
    method: 'PATCH',
    body: JSON.stringify({ gameState })
  }),
  startRound: (duelId: string, categoryId: string) => apiRequest(`/duels/${duelId}/rounds`, {
    method: 'POST',
    body: JSON.stringify({ categoryId })
  }),
  forfeit: (duelId: string) => apiRequest(`/duels/${duelId}/forfeit`, { method: 'POST' })
};

// ─── Helper ───────────────────────────────────────────────

const buildQueryString = (params: Record<string, unknown> = {}): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : '';
};

// ─── Chat API ─────────────────────────────────────────────

export const secureChatApi = {
  list: (params: Record<string, unknown> = {}) => apiRequest(`/chat/messages${buildQueryString(params)}`, { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/chat/messages', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  remove: (messageId: string) => apiRequest(`/chat/messages/${messageId}`, {
    method: 'DELETE'
  })
};

// ─── Notifications API ────────────────────────────────────

export const secureNotificationsApi = {
  list: () => apiRequest('/notifications', { method: 'GET' }),
  emitEvent: (payload: Record<string, unknown>) => apiRequest('/notifications/events', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  upsertPushSubscription: (payload: Record<string, unknown>) => apiRequest('/notifications/push/subscriptions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removePushSubscription: (payload: Record<string, unknown>) => apiRequest('/notifications/push/subscriptions', {
    method: 'DELETE',
    body: JSON.stringify(payload)
  }),
  sendTestPush: (payload: Record<string, unknown>) => apiRequest('/notifications/push/test', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  markRead: (notificationId: string) => apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PATCH'
  }),
  clear: () => apiRequest('/notifications', {
    method: 'DELETE'
  })
};

// ─── Content API ──────────────────────────────────────────

export const secureContentApi = {
  listMaterials: () => apiRequest('/content/materials', { method: 'GET' }),
  createMaterial: (payload: Record<string, unknown>) => apiRequest('/content/materials', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  listResources: () => apiRequest('/content/resources', { method: 'GET' }),
  createResource: (payload: Record<string, unknown>) => apiRequest('/content/resources', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removeResource: (resourceId: string) => apiRequest(`/content/resources/${resourceId}`, {
    method: 'DELETE'
  }),
  listNews: () => apiRequest('/content/news', { method: 'GET' }),
  createNews: (payload: Record<string, unknown>) => apiRequest('/content/news', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removeNews: (newsId: string) => apiRequest(`/content/news/${newsId}`, {
    method: 'DELETE'
  }),
  listExams: () => apiRequest('/content/exams', { method: 'GET' }),
  createExam: (payload: Record<string, unknown>) => apiRequest('/content/exams', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removeExam: (examId: string) => apiRequest(`/content/exams/${examId}`, {
    method: 'DELETE'
  })
};

// ─── Forum API ────────────────────────────────────────────

export const secureForumApi = {
  listCategories: () => apiRequest('/forum/categories', { method: 'GET' }),
  listPosts: (params: Record<string, unknown> = {}) => apiRequest(`/forum/posts${buildQueryString(params)}`, { method: 'GET' }),
  getThread: (postId: string) => apiRequest(`/forum/posts/${postId}/replies`, { method: 'GET' }),
  createPost: (payload: Record<string, unknown>) => apiRequest('/forum/posts', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  createReply: (postId: string, payload: Record<string, unknown>) => apiRequest(`/forum/posts/${postId}/replies`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removePost: (postId: string) => apiRequest(`/forum/posts/${postId}`, {
    method: 'DELETE'
  }),
  removeReply: (replyId: string) => apiRequest(`/forum/replies/${replyId}`, {
    method: 'DELETE'
  }),
  togglePin: (postId: string) => apiRequest(`/forum/posts/${postId}/pin`, {
    method: 'PATCH'
  }),
  toggleLock: (postId: string) => apiRequest(`/forum/posts/${postId}/lock`, {
    method: 'PATCH'
  })
};

// ─── School Attendance API ────────────────────────────────

export const secureSchoolAttendanceApi = {
  list: (params: Record<string, unknown> = {}) => apiRequest(`/school-attendance${buildQueryString(params)}`, { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/school-attendance', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateSignature: (entryId: string, payload: Record<string, unknown>) => apiRequest(`/school-attendance/${entryId}/signature`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  remove: (entryId: string) => apiRequest(`/school-attendance/${entryId}`, {
    method: 'DELETE'
  })
};

// ─── Exam Grades API ─────────────────────────────────────

export const secureExamGradesApi = {
  list: (params: Record<string, unknown> = {}) => apiRequest(`/exam-grades${buildQueryString(params)}`, { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/exam-grades', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  remove: (gradeId: string) => apiRequest(`/exam-grades/${gradeId}`, {
    method: 'DELETE'
  })
};

// ─── Report Books API ─────────────────────────────────────

export const secureReportBooksApi = {
  getProfile: () => apiRequest('/report-books/profile', { method: 'GET' }),
  updateProfile: (payload: Record<string, unknown>) => apiRequest('/report-books/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  list: (params: Record<string, unknown> = {}) => apiRequest(`/report-books${buildQueryString(params)}`, { method: 'GET' }),
  listPendingReview: () => apiRequest('/report-books/pending-review', { method: 'GET' }),
  upsertDraft: (payload: Record<string, unknown>) => apiRequest('/report-books/draft', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deleteDraftByWeek: (weekStart: string) => apiRequest(`/report-books/drafts/${encodeURIComponent(weekStart)}`, {
    method: 'DELETE'
  }),
  submit: (payload: Record<string, unknown>) => apiRequest('/report-books/submit', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  assignTrainer: (entryId: string, payload: Record<string, unknown>) => apiRequest(`/report-books/${entryId}/assignment`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  remove: (entryId: string) => apiRequest(`/report-books/${entryId}`, {
    method: 'DELETE'
  })
};

// ─── Swim Sessions API ────────────────────────────────────

export const secureSwimSessionsApi = {
  list: () => apiRequest('/swim-sessions', { method: 'GET' }),
  listPending: () => apiRequest('/swim-sessions/pending', { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/swim-sessions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  confirm: (sessionId: string) => apiRequest(`/swim-sessions/${sessionId}/confirm`, {
    method: 'PATCH'
  }),
  reject: (sessionId: string) => apiRequest(`/swim-sessions/${sessionId}/reject`, {
    method: 'PATCH'
  }),
  withdraw: (sessionId: string) => apiRequest(`/swim-sessions/${sessionId}/withdraw`, {
    method: 'PATCH'
  })
};

// ─── Swim Training Plans API ──────────────────────────────

export const secureSwimTrainingPlansApi = {
  list: () => apiRequest('/swim-training-plans', { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/swim-training-plans', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

// ─── User Stats API ───────────────────────────────────────

export const secureUserStatsApi = {
  me: () => apiRequest('/user-stats/me', { method: 'GET' }),
  summary: () => apiRequest('/user-stats/summary', { method: 'GET' }),
  repairQuizStats: () => apiRequest('/user-stats/repair-quiz-stats', {
    method: 'POST'
  })
};

// ─── Badges API ──────────────────────────────────────────

export const secureBadgesApi = {
  me: () => apiRequest('/badges/me', { method: 'GET' }),
  grant: (badgeIds: string[]) => apiRequest('/badges/grant', {
    method: 'POST',
    body: JSON.stringify({ badgeIds })
  })
};

// ─── Exam Simulator API ──────────────────────────────────

export const secureExamSimulatorApi = {
  startTheorySession: (payload: Record<string, unknown> = {}) => apiRequest('/exam-simulator/theory/sessions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  submitTheorySession: (sessionId: string, payload: Record<string, unknown>) => apiRequest(`/exam-simulator/theory/sessions/${sessionId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  listTheoryAttempts: (params: Record<string, unknown> = {}) => apiRequest(`/exam-simulator/theory/attempts${buildQueryString(params)}`, { method: 'GET' }),
  listPracticalAttempts: (params: Record<string, unknown> = {}) => apiRequest(`/exam-simulator/practical/attempts${buildQueryString(params)}`, { method: 'GET' }),
  createPracticalAttempt: (payload: Record<string, unknown>) => apiRequest('/exam-simulator/practical/attempts', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removePracticalAttempt: (attemptId: string) => apiRequest(`/exam-simulator/practical/attempts/${attemptId}`, {
    method: 'DELETE'
  })
};

// ─── Flashcards API ───────────────────────────────────────

export const secureFlashcardsApi = {
  list: () => apiRequest('/flashcards', { method: 'GET' }),
  listPending: () => apiRequest('/flashcards/pending', { method: 'GET' }),
  create: (payload: Record<string, unknown>) => apiRequest('/flashcards', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  approve: (flashcardId: string) => apiRequest(`/flashcards/${flashcardId}/approve`, {
    method: 'PATCH'
  }),
  remove: (flashcardId: string) => apiRequest(`/flashcards/${flashcardId}`, {
    method: 'DELETE'
  })
};

// ─── Question Workflows API ──────────────────────────────

export const secureQuestionWorkflowsApi = {
  listSubmissions: () => apiRequest('/question-workflows/submissions', { method: 'GET' }),
  createSubmission: (payload: Record<string, unknown>) => apiRequest('/question-workflows/submissions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  approveSubmission: (questionId: string) => apiRequest(`/question-workflows/submissions/${questionId}/approve`, {
    method: 'PATCH'
  }),
  listReports: () => apiRequest('/question-workflows/reports', { method: 'GET' }),
  createReport: (payload: Record<string, unknown>) => apiRequest('/question-workflows/reports', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateReportStatus: (reportId: string, payload: Record<string, unknown>) => apiRequest(`/question-workflows/reports/${reportId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
};

// ─── Re-exports ───────────────────────────────────────────

export {
  clearApiAccessToken,
  isSecureBackendApiEnabled,
  setApiAccessToken
};
