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

const mapDuelToGame = (d) => ({
  id: d.id,
  player1: d.challenger?.displayName || d.challengerName || '',
  player2: d.opponent?.displayName || d.opponentName || '',
  player1Score: d.challengerScore ?? 0,
  player2Score: d.opponentScore ?? 0,
  currentTurn: d.currentTurnName || d.currentTurn || '',
  categoryRound: d.round ?? 0,
  round: d.round ?? 0,
  status: mapDuelStatus(d.status),
  difficulty: d.difficulty || 'normal',
  categoryRounds: d.roundsData || d.rounds || [],
  winner: d.winner?.displayName || d.winnerName || null,
  questionHistory: [],
  updatedAt: d.updatedAt,
  createdAt: d.createdAt,
  challengeTimeoutMinutes: d.requestTimeoutMinutes || 60,
  challengeExpiresAt: d.expiresAt || null
});

const mapDuelStatus = (status) => {
  if (!status) return 'unknown';
  const s = String(status).toUpperCase();
  if (s === 'PENDING') return 'waiting';
  if (s === 'ACTIVE') return 'playing';
  if (s === 'FINISHED') return 'finished';
  if (s === 'EXPIRED') return 'finished';
  return status.toLowerCase();
};

export const loadGames = async (supabase, limit = 200) => {
  if (USE_SECURE_API) {
    const duels = await secureDuelsApi.list();
    return (duels || []).map(mapDuelToGame);
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

export const loadMessages = async (supabase, normalizeFn, userDirectory) => {
  if (USE_SECURE_API) {
    const messages = await secureChatApi.list({ limit: 100 });
    return (messages || []).map(m => ({
      id: m.id,
      sender: m.senderName || m.sender?.displayName || 'Unbekannt',
      text: m.content || m.text || '',
      time: new Date(m.createdAt || Date.now()).getTime(),
      avatar: m.senderAvatar || m.sender?.avatar || null,
      senderId: m.senderId || m.sender?.id || null,
      senderRole: m.senderRole || m.sender?.role?.toLowerCase() || 'azubi',
      scope: m.scope || m.chatScope || 'public',
      organizationId: m.organizationId || null,
      recipientId: m.recipientId || null
    }));
  }

  const { data } = await supabase
    .from('messages')
    .select('id, content, user_name, sender_id, created_at, chat_scope, recipient_id, user_avatar')
    .order('created_at', { ascending: true })
    .limit(100);

  if (!data) return [];
  return data.map(row => normalizeFn(row, userDirectory));
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
    const result = await secureNotificationsApi.emitEvent({
      targetUserName: userName,
      title,
      message,
      type
    });
    return result;
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
    return (data || []).map(q => ({
      id: q.id, text: q.question || q.text,
      category: q.category, answers: q.answers,
      correct: q.correct ?? q.correctIndex,
      submittedBy: q.createdBy || q.creator?.displayName || '',
      approved: q.approved ?? false,
      time: new Date(q.createdAt || Date.now()).getTime()
    }));
  }

  const { data } = await supabase
    .from('custom_questions')
    .select('id, question, category, answers, correct, created_by, approved, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (data || []).map(q => ({
    id: q.id, text: q.question, category: q.category,
    answers: q.answers, correct: q.correct,
    submittedBy: q.created_by, approved: q.approved,
    time: new Date(q.created_at).getTime()
  }));
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

export const saveTheoryExamAttempt = async (supabase, userId, userName, progress, keywordMode) => {
  if (USE_SECURE_API) {
    await secureExamSimulatorApi.submitTheorySession('inline', {
      correct: progress.correct,
      total: progress.total,
      percentage: progress.percentage,
      passed: progress.passed,
      timeMs: progress.timeMs,
      keywordMode
    });
    return;
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

// ─── Export flag for convenience ─────────────────────────────────────
export { USE_SECURE_API };
