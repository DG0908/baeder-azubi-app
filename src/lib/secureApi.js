import {
  apiRequest,
  clearApiAccessToken,
  isSecureBackendApiEnabled,
  setApiAccessToken
} from './secureApiClient';

const BACKEND_ROLE_TO_FRONTEND = {
  ADMIN: 'admin',
  AUSBILDER: 'trainer',
  AZUBI: 'azubi',
  RETTUNGSSCHWIMMER_AZUBI: 'rettungsschwimmer_azubi'
};

const BACKEND_STATUS_TO_APPROVED = {
  APPROVED: true,
  PENDING: false,
  REJECTED: false,
  DISABLED: false
};

export const mapBackendRoleToFrontendRole = (role) => (
  BACKEND_ROLE_TO_FRONTEND[String(role || '').toUpperCase()] || 'azubi'
);

export const mapBackendUserToFrontendUser = (user) => {
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
    status: hasExplicitStatus ? user.status : 'APPROVED',
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
    berichtsheft_profile: user.reportBookProfile ?? user.report_book_profile ?? null
  };
};

export const mapFrontendRoleToBackendRole = (role) => {
  const normalizedRole = String(role || '').trim().toLowerCase();
  if (normalizedRole === 'admin') return 'ADMIN';
  if (normalizedRole === 'trainer') return 'AUSBILDER';
  if (normalizedRole === 'rettungsschwimmer_azubi') return 'RETTUNGSSCHWIMMER_AZUBI';
  return 'AZUBI';
};

export const secureAuthApi = {
  async register(payload) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async login(payload) {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (result?.accessToken) {
      setApiAccessToken(result.accessToken);
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

  async changePassword(payload) {
    return apiRequest('/auth/password', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async requestPasswordReset(payload) {
    return apiRequest('/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async confirmPasswordReset(payload) {
    return apiRequest('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

export const secureUsersApi = {
  me: () => apiRequest('/users/me', { method: 'GET' }),
  list: () => apiRequest('/users', { method: 'GET' }),
  pending: () => apiRequest('/users/pending', { method: 'GET' }),
  contacts: () => apiRequest('/users/contacts', { method: 'GET' }),
  updateMe: (payload) => apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  updateApproval: (userId, payload) => apiRequest(`/users/${userId}/approval`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  updateRole: (userId, payload) => apiRequest(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  updateOrganization: (userId, payload) => apiRequest(`/users/${userId}/organization`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  deleteUser: (userId) => apiRequest(`/users/${userId}`, {
    method: 'DELETE'
  }),
  deleteSelf: () => apiRequest('/users/me', {
    method: 'DELETE'
  }),
  updatePermissions: (userId, payload) => apiRequest(`/users/${userId}/permissions`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
};

export const secureOrganizationsApi = {
  list: () => apiRequest('/organizations', { method: 'GET' }),
  create: (payload) => apiRequest('/organizations', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getById: (organizationId) => apiRequest(`/organizations/${organizationId}`, { method: 'GET' })
};

export const secureAppConfigApi = {
  get: () => apiRequest('/app-config', { method: 'GET' }),
  update: (payload) => apiRequest('/app-config', {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
};

export const secureInvitationsApi = {
  list: () => apiRequest('/invitations', { method: 'GET' }),
  create: (payload) => apiRequest('/invitations', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  revoke: (invitationId) => apiRequest(`/invitations/${invitationId}`, {
    method: 'DELETE'
  })
};

export const secureDuelsApi = {
  list: () => apiRequest('/duels', { method: 'GET' }),
  leaderboard: () => apiRequest('/duels/leaderboard', { method: 'GET' }),
  getById: (duelId) => apiRequest(`/duels/${duelId}`, { method: 'GET' }),
  create: (payload) => apiRequest('/duels', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  accept: (duelId) => apiRequest(`/duels/${duelId}/accept`, {
    method: 'POST'
  }),
  submitAnswer: (duelId, payload) => apiRequest(`/duels/${duelId}/answers`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateGameState: (duelId, gameState) => apiRequest(`/duels/${duelId}/state`, {
    method: 'PATCH',
    body: JSON.stringify({ gameState })
  })
};

const buildQueryString = (params = {}) => {
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

export const secureChatApi = {
  list: (params = {}) => apiRequest(`/chat/messages${buildQueryString(params)}`, { method: 'GET' }),
  create: (payload) => apiRequest('/chat/messages', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

export const secureNotificationsApi = {
  list: () => apiRequest('/notifications', { method: 'GET' }),
  emitEvent: (payload) => apiRequest('/notifications/events', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  upsertPushSubscription: (payload) => apiRequest('/notifications/push/subscriptions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removePushSubscription: (payload) => apiRequest('/notifications/push/subscriptions', {
    method: 'DELETE',
    body: JSON.stringify(payload)
  }),
  sendTestPush: (payload) => apiRequest('/notifications/push/test', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  markRead: (notificationId) => apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PATCH'
  }),
  clear: () => apiRequest('/notifications', {
    method: 'DELETE'
  })
};

export const secureContentApi = {
  listMaterials: () => apiRequest('/content/materials', { method: 'GET' }),
  createMaterial: (payload) => apiRequest('/content/materials', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  listResources: () => apiRequest('/content/resources', { method: 'GET' }),
  createResource: (payload) => apiRequest('/content/resources', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removeResource: (resourceId) => apiRequest(`/content/resources/${resourceId}`, {
    method: 'DELETE'
  }),
  listNews: () => apiRequest('/content/news', { method: 'GET' }),
  createNews: (payload) => apiRequest('/content/news', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removeNews: (newsId) => apiRequest(`/content/news/${newsId}`, {
    method: 'DELETE'
  }),
  listExams: () => apiRequest('/content/exams', { method: 'GET' }),
  createExam: (payload) => apiRequest('/content/exams', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removeExam: (examId) => apiRequest(`/content/exams/${examId}`, {
    method: 'DELETE'
  })
};

export const secureForumApi = {
  listCategories: () => apiRequest('/forum/categories', { method: 'GET' }),
  listPosts: (params = {}) => apiRequest(`/forum/posts${buildQueryString(params)}`, { method: 'GET' }),
  getThread: (postId) => apiRequest(`/forum/posts/${postId}/replies`, { method: 'GET' }),
  createPost: (payload) => apiRequest('/forum/posts', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  createReply: (postId, payload) => apiRequest(`/forum/posts/${postId}/replies`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removePost: (postId) => apiRequest(`/forum/posts/${postId}`, {
    method: 'DELETE'
  }),
  removeReply: (replyId) => apiRequest(`/forum/replies/${replyId}`, {
    method: 'DELETE'
  }),
  togglePin: (postId) => apiRequest(`/forum/posts/${postId}/pin`, {
    method: 'PATCH'
  }),
  toggleLock: (postId) => apiRequest(`/forum/posts/${postId}/lock`, {
    method: 'PATCH'
  })
};

export const secureSchoolAttendanceApi = {
  list: (params = {}) => apiRequest(`/school-attendance${buildQueryString(params)}`, { method: 'GET' }),
  create: (payload) => apiRequest('/school-attendance', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateSignature: (entryId, payload) => apiRequest(`/school-attendance/${entryId}/signature`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  remove: (entryId) => apiRequest(`/school-attendance/${entryId}`, {
    method: 'DELETE'
  })
};

export const secureExamGradesApi = {
  list: (params = {}) => apiRequest(`/exam-grades${buildQueryString(params)}`, { method: 'GET' }),
  create: (payload) => apiRequest('/exam-grades', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  remove: (gradeId) => apiRequest(`/exam-grades/${gradeId}`, {
    method: 'DELETE'
  })
};

export const secureReportBooksApi = {
  getProfile: () => apiRequest('/report-books/profile', { method: 'GET' }),
  updateProfile: (payload) => apiRequest('/report-books/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  list: (params = {}) => apiRequest(`/report-books${buildQueryString(params)}`, { method: 'GET' }),
  listPendingReview: () => apiRequest('/report-books/pending-review', { method: 'GET' }),
  upsertDraft: (payload) => apiRequest('/report-books/draft', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deleteDraftByWeek: (weekStart) => apiRequest(`/report-books/drafts/${encodeURIComponent(weekStart)}`, {
    method: 'DELETE'
  }),
  submit: (payload) => apiRequest('/report-books/submit', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  assignTrainer: (entryId, payload) => apiRequest(`/report-books/${entryId}/assignment`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  remove: (entryId) => apiRequest(`/report-books/${entryId}`, {
    method: 'DELETE'
  })
};

export const secureSwimSessionsApi = {
  list: () => apiRequest('/swim-sessions', { method: 'GET' }),
  listPending: () => apiRequest('/swim-sessions/pending', { method: 'GET' }),
  create: (payload) => apiRequest('/swim-sessions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  confirm: (sessionId) => apiRequest(`/swim-sessions/${sessionId}/confirm`, {
    method: 'PATCH'
  }),
  reject: (sessionId) => apiRequest(`/swim-sessions/${sessionId}/reject`, {
    method: 'PATCH'
  })
};

export const secureSwimTrainingPlansApi = {
  list: () => apiRequest('/swim-training-plans', { method: 'GET' }),
  create: (payload) => apiRequest('/swim-training-plans', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

export const secureUserStatsApi = {
  me: () => apiRequest('/user-stats/me', { method: 'GET' }),
  summary: () => apiRequest('/user-stats/summary', { method: 'GET' }),
  repairQuizStats: () => apiRequest('/user-stats/repair-quiz-stats', {
    method: 'POST'
  })
};

export const secureExamSimulatorApi = {
  startTheorySession: (payload = {}) => apiRequest('/exam-simulator/theory/sessions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  submitTheorySession: (sessionId, payload) => apiRequest(`/exam-simulator/theory/sessions/${sessionId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  listTheoryAttempts: (params = {}) => apiRequest(`/exam-simulator/theory/attempts${buildQueryString(params)}`, { method: 'GET' }),
  listPracticalAttempts: (params = {}) => apiRequest(`/exam-simulator/practical/attempts${buildQueryString(params)}`, { method: 'GET' }),
  createPracticalAttempt: (payload) => apiRequest('/exam-simulator/practical/attempts', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  removePracticalAttempt: (attemptId) => apiRequest(`/exam-simulator/practical/attempts/${attemptId}`, {
    method: 'DELETE'
  })
};

export const secureFlashcardsApi = {
  list: () => apiRequest('/flashcards', { method: 'GET' }),
  listPending: () => apiRequest('/flashcards/pending', { method: 'GET' }),
  create: (payload) => apiRequest('/flashcards', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  approve: (flashcardId) => apiRequest(`/flashcards/${flashcardId}/approve`, {
    method: 'PATCH'
  }),
  remove: (flashcardId) => apiRequest(`/flashcards/${flashcardId}`, {
    method: 'DELETE'
  })
};

export const secureQuestionWorkflowsApi = {
  listSubmissions: () => apiRequest('/question-workflows/submissions', { method: 'GET' }),
  createSubmission: (payload) => apiRequest('/question-workflows/submissions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  approveSubmission: (questionId) => apiRequest(`/question-workflows/submissions/${questionId}/approve`, {
    method: 'PATCH'
  }),
  listReports: () => apiRequest('/question-workflows/reports', { method: 'GET' }),
  createReport: (payload) => apiRequest('/question-workflows/reports', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateReportStatus: (reportId, payload) => apiRequest(`/question-workflows/reports/${reportId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
};

export {
  clearApiAccessToken,
  isSecureBackendApiEnabled,
  setApiAccessToken
};
