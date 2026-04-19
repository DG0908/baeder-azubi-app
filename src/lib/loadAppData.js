import {
  loadUsers as dsLoadUsers,
  loadAppConfig as dsLoadAppConfig,
  loadGames as dsLoadGames,
  getUserStats as dsGetUserStats,
  getAllUserStats as dsGetAllUserStats,
  loadMaterials as dsLoadMaterials,
  loadResources as dsLoadResources,
  loadNews as dsLoadNews,
  loadExams as dsLoadExams,
  loadCustomQuestions as dsLoadCustomQuestions,
  loadQuestionReports as dsLoadQuestionReports,
} from './dataService';
import {
  buildUserStatsFromRow,
  createEmptyUserStats,
  ensureUserStatsStructure,
  getXpMetaFromCategoryStats,
  normalizeChallengeTimeoutMinutes,
} from './quizHelpers';
import { mergeMenuItemsWithDefaults } from './menuConfig';
import { getQuestionPerformanceKey } from './questionKey';
import { DEFAULT_THEME_COLORS } from '../data/constants';
import { parseJsonSafe } from './jsonUtils';

const QUESTION_REPORTS_STORAGE_KEY = 'question_reports_v1';

export async function loadAppData({
  user,
  duel,
  setAppConfig,
  setConfigLoaded,
  setAllUsers,
  setPendingUsers,
  setStatsByUserId,
  setUserStats,
  setSubmittedQuestions,
  setQuestionReports,
  setMaterials,
  setResources,
  setNews,
  setExams,
  updateLeaderboard,
  loadCustomSwimTrainingPlans,
  loadChatMessages,
  loadFlashcardsFromBackend,
  loadUserBadges,
}) {
  try {
    let visibleUsers = [];

    try {
      const configResult = await dsLoadAppConfig();
      if (configResult) {
        const loadedMenuItems = mergeMenuItemsWithDefaults(configResult.menuItems);
        const loadedThemeColors = configResult.themeColors && Object.keys(configResult.themeColors).length > 0
          ? configResult.themeColors
          : DEFAULT_THEME_COLORS;
        const loadedCompanies = Array.isArray(configResult.companies) && configResult.companies.length > 0
          ? configResult.companies
          : ['Freizeitbad Oktopus'];
        const loadedAnnouncement = configResult.announcement && typeof configResult.announcement === 'object'
          ? configResult.announcement
          : { enabled: false, message: '' };
        const loadedFeatureFlags = configResult.featureFlags && typeof configResult.featureFlags === 'object'
          ? { quizMaintenance: false, ...configResult.featureFlags }
          : { quizMaintenance: false };
        setAppConfig({
          menuItems: loadedMenuItems,
          themeColors: loadedThemeColors,
          featureFlags: loadedFeatureFlags,
          companies: loadedCompanies,
          announcement: loadedAnnouncement,
        });
      }
      setConfigLoaded(true);
    } catch (err) {
      console.error('Config load error:', err);
      setConfigLoaded(true);
    }

    const usersResult = await dsLoadUsers(user);
    visibleUsers = usersResult.allUsers;
    setAllUsers(usersResult.allUsers);
    if (usersResult.pendingUsers.length > 0) {
      setPendingUsers(usersResult.pendingUsers);
    }

    await loadCustomSwimTrainingPlans();

    const gamesRaw = await dsLoadGames(200, user?.id);
    if (gamesRaw.length > 0) {
      const games = gamesRaw.map((g) => ({
        ...g,
        challengeTimeoutMinutes: normalizeChallengeTimeoutMinutes(g.challengeTimeoutMinutes),
      }));
      duel.setAllGames(games);
      duel.setActiveGames(games.filter((g) => g.status !== 'finished'));
      updateLeaderboard(games);
      await duel.checkExpiredAndRemindGames(games);
    }

    try {
      const allStatsData = await dsGetAllUserStats();
      const nextStatsByUserId = {};
      (allStatsData || []).forEach((row) => {
        const wins = row.wins || 0;
        const losses = row.losses || 0;
        const draws = row.draws || 0;
        const xpMeta = getXpMetaFromCategoryStats(row.category_stats || row.categoryStats || {});
        nextStatsByUserId[row.user_id || row.userId] = {
          wins,
          losses,
          draws,
          total: wins + losses + draws,
          totalXp: xpMeta.totalXp,
          xpBreakdown: xpMeta.breakdown,
        };
      });
      setStatsByUserId(nextStatsByUserId);
    } catch (e) {
      console.log('All stats load error:', e.message);
      setStatsByUserId({});
    }

    if (user && user.id) {
      try {
        const statsData = await dsGetUserStats(user);
        setUserStats(buildUserStatsFromRow(statsData));
      } catch (e) {
        console.log('Stats load:', e);
        setUserStats(ensureUserStatsStructure(createEmptyUserStats()));
      }
    }

    const userDirectory = Object.fromEntries(
      (visibleUsers || []).filter((a) => a?.id).map((a) => [a.id, a]),
    );
    await loadChatMessages(userDirectory, user?.role);

    const customQuestions = await dsLoadCustomQuestions();
    setSubmittedQuestions(customQuestions);

    if (user?.permissions?.canManageUsers) {
      try {
        const remoteReports = await dsLoadQuestionReports();
        const enriched = remoteReports.map((r) => ({
          ...r,
          questionKey: r.questionKey
            || getQuestionPerformanceKey({ q: r.questionText, category: r.category }, r.category),
        }));
        const localReports = parseJsonSafe(localStorage.getItem(QUESTION_REPORTS_STORAGE_KEY), []);
        const safeLocalReports = Array.isArray(localReports) ? localReports : [];
        const merged = [...enriched];
        const seen = new Set(enriched.map((e) => `${e.questionKey}|${e.createdAt}|${e.reportedBy}`));
        safeLocalReports.forEach((entry) => {
          const key = `${entry.questionKey}|${entry.createdAt}|${entry.reportedBy}`;
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(entry);
          }
        });
        setQuestionReports(merged.slice(0, 500));
      } catch {
        console.log('question_reports load skipped');
      }
    }

    setMaterials(await dsLoadMaterials());

    try {
      setResources(await dsLoadResources());
    } catch (err) {
      console.error('Resources fetch failed:', err);
    }

    setNews(await dsLoadNews());
    setExams(await dsLoadExams());

    await loadFlashcardsFromBackend();
    await loadUserBadges();
  } catch (error) {
    console.log('Loading data - some features may not work:', error.message);
  }
}

export async function refreshLightData({
  user,
  duel,
  allUsers,
  setUserStats,
  updateLeaderboard,
  loadChatMessages,
}) {
  try {
    const games = await dsLoadGames(100, user?.id);
    if (games.length > 0) {
      const normalized = games.map((g) => ({
        ...g,
        challengeTimeoutMinutes: normalizeChallengeTimeoutMinutes(g.challengeTimeoutMinutes),
      }));
      duel.setAllGames(normalized);
      duel.setActiveGames(normalized.filter((g) => g.status !== 'finished'));
      updateLeaderboard(normalized);
    }

    if (user?.id) {
      try {
        const statsData = await dsGetUserStats(user);
        setUserStats(buildUserStatsFromRow(statsData));
      } catch (e) {
        console.log('Stats refresh error:', e.message);
      }
    }

    const userDirectory = Object.fromEntries(
      (allUsers || []).filter((a) => a?.id).map((a) => [a.id, a]),
    );
    await loadChatMessages(userDirectory, user?.role);
  } catch (error) {
    console.log('Light data refresh error:', error.message);
  }
}
