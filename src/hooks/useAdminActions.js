import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  approveUser as dsApproveUser,
  deleteUser as dsDeleteUser,
  purgeUserData as dsPurgeUserData,
  changeUserRole as dsChangeUserRole,
  updateUserPermission as dsUpdateUserPermission,
  saveAppConfig as dsSaveAppConfig,
  repairQuizStatsRemote as dsRepairQuizStats,
  sendTestPushRemote as dsSendTestPush,
  exportUserDataBundle as dsExportUserDataBundle,
  verifyParentalConsent as dsVerifyParentalConsent,
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';
import { PERMISSIONS, DEFAULT_MENU_ITEMS, DEFAULT_THEME_COLORS } from '../data/constants';
import { fetchPushBackendWithAuth } from '../lib/pushNotifications';

/**
 * Extracts all admin-related actions from App.jsx:
 * user management, app config, menu editing, permission toggles.
 *
 * @param {object}   deps
 * @param {object}   deps.user         – current user
 * @param {Array}    deps.allUsers     – all users
 * @param {Array}    deps.pendingUsers – pending approval
 * @param {Function} deps.showToast
 * @param {Function} deps.playSound
 * @param {Function} deps.loadData     – reload all data
 * @param {object}   deps.appConfig
 * @param {Function} deps.setAppConfig
 * @param {object}   deps.statsSources – { materials, submittedQuestions, activeGames, chatMessageCount }
 */
export function useAdminActions({
  user,
  allUsers,
  pendingUsers,
  showToast,
  playSound,
  loadData,
  appConfig,
  setAppConfig,
  statsSources,
}) {
  // ── Editing state (only used in admin config UI) ─────────
  const [editingMenuItems, setEditingMenuItems] = useState([]);
  const [editingThemeColors, setEditingThemeColors] = useState({});

  // ── Data retention helper ────────────────────────────────
  const getDaysUntilDeletion = useCallback((account) => {
    if (account.role === 'admin') return null;
    const now = Date.now();

    if (account.role === 'azubi' && account.trainingEnd) {
      const endDate = new Date(account.trainingEnd).getTime();
      if (isNaN(endDate)) return null;
      const threeMonthsMs = 3 * 30 * 24 * 60 * 60 * 1000;
      return Math.ceil((endDate + threeMonthsMs - now) / (1000 * 60 * 60 * 24));
    }

    if (account.role === 'trainer' && (account.lastLogin || account.last_login)) {
      const sixMonthsMs = 6 * 30 * 24 * 60 * 60 * 1000;
      const lastLoginTime = new Date(account.lastLogin || account.last_login).getTime();
      if (isNaN(lastLoginTime)) return null;
      return Math.ceil((lastLoginTime + sixMonthsMs - now) / (1000 * 60 * 60 * 24));
    }

    return null;
  }, []);

  // ── Admin stats ──────────────────────────────────────────
  const getAdminStats = useCallback(() => {
    const { materials, submittedQuestions, activeGames, chatMessageCount } = statsSources;
    const stats = {
      totalUsers: allUsers.length,
      pendingApprovals: pendingUsers.length,
      azubis: allUsers.filter((u) => u.role === 'azubi').length,
      trainers: allUsers.filter((u) => u.role === 'trainer').length,
      admins: allUsers.filter((u) => u.role === 'admin').length,
      usersToDeleteSoon: allUsers.filter((u) => {
        const days = getDaysUntilDeletion(u);
        return days !== null && days < 30 && days >= 0;
      }).length,
      totalGames: 0,
      totalMaterials: materials.length,
      totalQuestions: submittedQuestions.length,
      approvedQuestions: submittedQuestions.filter((q) => q.approved).length,
      pendingQuestions: submittedQuestions.filter((q) => !q.approved).length,
      activeGamesCount: activeGames.length,
      totalMessages: chatMessageCount,
    };
    activeGames.forEach(() => stats.totalGames++);
    return stats;
  }, [allUsers, pendingUsers, statsSources, getDaysUntilDeletion]);

  // ── User data helpers ────────────────────────────────────
  const deleteUserData = useCallback(async (userId, email, userName) => {
    try {
      await dsPurgeUserData(userId, userName);
      console.log(`Alle Daten für ${email} gelöscht`);
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  }, []);

  const exportUserData = useCallback(async (targetInput, fallbackName = '') => {
    const targetUser =
      targetInput && typeof targetInput === 'object'
        ? targetInput
        : { email: targetInput, name: fallbackName };
    const targetLabel = String(
      targetUser?.name || targetUser?.displayName || targetUser?.email || 'nutzer'
    ).trim();
    try {
      const exportData = await dsExportUserDataBundle(targetUser);
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${targetLabel}_daten_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Datenexport fuer ${targetLabel} erfolgreich heruntergeladen!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Fehler beim Datenexport!');
    }
  }, []);

  // ── User management ──────────────────────────────────────
  const approveUser = useCallback(
    async (email) => {
      try {
        const result = await dsApproveUser(email, [
          ...(allUsers || []),
          ...(pendingUsers || []),
        ]);
        loadData();
        playSound('whistle');
        showToast(`${result.account?.name || email} wurde freigeschaltet!`, 'success');
      } catch (error) {
        console.error('Error approving user:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [allUsers, pendingUsers, loadData, playSound, showToast]
  );

  const deleteUser = useCallback(
    async (email) => {
      try {
        const targetUser = allUsers.find(
          (u) =>
            String(u.email || '').trim().toLowerCase() ===
            String(email || '').trim().toLowerCase()
        );
        if (!targetUser) {
          showToast('User nicht gefunden', 'error');
          return;
        }
        if (targetUser.role === 'admin') {
          showToast('Administratoren können nicht gelöscht werden!', 'error');
          return;
        }
        if (
          !confirm(
            'Möchtest du diesen Nutzer wirklich löschen? Alle Daten werden unwiderruflich gelöscht!'
          )
        )
          return;

        await dsDeleteUser(email, allUsers);
        loadData();
        showToast('Nutzerprofil und Daten wurden gelöscht', 'success');
      } catch (error) {
        console.error('Delete user error:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [allUsers, loadData, showToast]
  );

  const changeUserRole = useCallback(
    async (email, newRole) => {
      try {
        if (!user?.permissions?.canManageUsers) {
          showToast('Keine Berechtigung für Rollenänderungen.', 'error');
          return;
        }
        const hasOwnerAccount = allUsers.some((account) => Boolean(account?.is_owner));
        const canManageSecurity =
          Boolean(user?.isOwner) || (user?.role === 'admin' && !hasOwnerAccount);
        if (!canManageSecurity) {
          showToast('Nur der Hauptadmin darf Rollen ändern.', 'error');
          return;
        }

        const targetEmail = String(email || '').trim().toLowerCase();
        const ownEmail = String(user?.email || '').trim().toLowerCase();
        const allowedRoles = ['azubi', 'trainer', 'admin'];
        if (!allowedRoles.includes(newRole)) {
          showToast('Ungültige Rolle ausgewählt', 'error');
          return;
        }

        if (targetEmail && targetEmail === ownEmail && newRole !== 'admin') {
          showToast('Deine eigene Admin-Rolle kann nicht geändert werden.', 'error');
          return;
        }

        const targetUser = allUsers.find(
          (account) =>
            String(account?.email || '').trim().toLowerCase() === targetEmail
        );
        if (targetUser?.role === 'admin' && newRole !== 'admin') {
          const adminCount = allUsers.filter(
            (account) => account.role === 'admin'
          ).length;
          if (adminCount <= 1) {
            showToast('Mindestens ein Administrator muss erhalten bleiben.', 'error');
            return;
          }
        }

        await dsChangeUserRole(targetEmail, newRole, allUsers);
        loadData();
        showToast(`Rolle geändert zu: ${PERMISSIONS[newRole].label}`, 'success');
      } catch (error) {
        console.error('Error changing role:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [user, allUsers, loadData, showToast]
  );

  // ── Permission toggles ──────────────────────────────────
  const togglePermission = useCallback(
    async (userId, field, currentValue, labels) => {
      try {
        await dsUpdateUserPermission(userId, field, !currentValue);
        loadData();
        showToast(!currentValue ? labels.granted : labels.revoked, 'success');
      } catch (error) {
        console.error(`Error toggling ${field}:`, error);
        showToast(friendlyError(error), 'error');
      }
    },
    [loadData, showToast]
  );

  const toggleSchoolCardPermission = useCallback(
    (userId, currentValue) =>
      togglePermission(userId, 'canViewSchoolCards', currentValue, {
        granted: 'Kontrollkarten-Berechtigung erteilt',
        revoked: 'Kontrollkarten-Berechtigung entzogen',
      }),
    [togglePermission]
  );

  const toggleSignReportsPermission = useCallback(
    (userId, currentValue) =>
      togglePermission(userId, 'canSignReports', currentValue, {
        granted: 'Berichtsheft-Unterschrift-Berechtigung erteilt',
        revoked: 'Berichtsheft-Unterschrift-Berechtigung entzogen',
      }),
    [togglePermission]
  );

  const toggleExamGradesPermission = useCallback(
    (userId, currentValue) =>
      togglePermission(userId, 'canViewExamGrades', currentValue, {
        granted: 'Klasuren-Berechtigung erteilt',
        revoked: 'Klasuren-Berechtigung entzogen',
      }),
    [togglePermission]
  );

  // ── Repair & test push ───────────────────────────────────
  const repairQuizStats = useCallback(async () => {
    if (!user?.permissions?.canManageUsers) {
      throw new Error('Keine Berechtigung für den Statistik-Repair.');
    }
    const responseData = await dsRepairQuizStats(fetchPushBackendWithAuth);
    await loadData();
    return responseData;
  }, [user?.permissions?.canManageUsers, loadData]);

  const sendTestPush = useCallback(
    async (targetScope = 'self') => {
      if (!user?.id) {
        throw new Error('Keine aktive Sitzung für den Test-Push gefunden.');
      }

      const requestedTargetUserNames =
        targetScope === 'organization'
          ? [
              ...new Set(
                (allUsers || [])
                  .filter((account) => account?.approved !== false)
                  .filter(
                    (account) =>
                      (account?.organization_id ||
                        account?.organizationId ||
                        null) === (user.organizationId || null)
                  )
                  .map((account) => String(account?.name || '').trim())
                  .filter(Boolean)
              ),
            ]
          : [String(user.name || '').trim()].filter(Boolean);

      const payload = {
        delaySeconds: 15,
        targetScope,
        userName: user.name || '',
        email: user.email || '',
        organizationId: user.organizationId || null,
        targetUserNames: requestedTargetUserNames,
      };

      return dsSendTestPush(fetchPushBackendWithAuth, payload);
    },
    [user, allUsers]
  );

  // ── App Config ───────────────────────────────────────────
  const saveAppConfig = useCallback(async () => {
    const hasOwnerAccount = allUsers.some((account) => Boolean(account?.is_owner));
    const canManageSecurity =
      Boolean(user?.isOwner) || (user?.role === 'admin' && !hasOwnerAccount);
    if (!canManageSecurity) {
      showToast('Nur der Hauptadmin kann die Konfiguration ändern.', 'warning');
      return;
    }

    try {
      await dsSaveAppConfig({
        menuItems: editingMenuItems,
        themeColors: editingThemeColors,
        featureFlags: appConfig.featureFlags,
      });
      setAppConfig({
        menuItems: editingMenuItems,
        themeColors: editingThemeColors,
        featureFlags: appConfig.featureFlags,
        companies: appConfig.companies,
        announcement: appConfig.announcement,
      });
      showToast('Konfiguration gespeichert.', 'success');
      playSound('splash');
    } catch (error) {
      console.error('Config save error:', error);
      showToast(friendlyError(error), 'error');
    }
  }, [user, allUsers, editingMenuItems, editingThemeColors, appConfig, setAppConfig, showToast, playSound]);

  const saveAnnouncement = useCallback(
    async (announcement) => {
      const updated = { ...appConfig, announcement };
      try {
        await dsSaveAppConfig({
          menuItems: appConfig.menuItems,
          themeColors: appConfig.themeColors,
          featureFlags: appConfig.featureFlags,
        });
        setAppConfig(updated);
        showToast(
          announcement.enabled
            ? 'Ankündigung aktiviert.'
            : 'Ankündigung deaktiviert.',
          'success'
        );
      } catch (error) {
        console.error('Announcement save error:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [appConfig, setAppConfig, showToast]
  );

  const saveFeatureFlag = useCallback(
    async (key, value) => {
      const nextFlags = { ...appConfig.featureFlags, [key]: value };
      const updated = { ...appConfig, featureFlags: nextFlags };
      try {
        await dsSaveAppConfig({ featureFlags: nextFlags });
        setAppConfig(updated);
        showToast(
          value ? 'Wartungsmodus aktiviert.' : 'Wartungsmodus deaktiviert.',
          'success'
        );
      } catch (error) {
        console.error('Feature flag save error:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [appConfig, setAppConfig, showToast]
  );

  const saveCompanies = useCallback(
    async (newCompanies) => {
      const updated = { ...appConfig, companies: newCompanies };
      try {
        await dsSaveAppConfig({
          menuItems: appConfig.menuItems,
          themeColors: appConfig.themeColors,
          featureFlags: appConfig.featureFlags,
        });
        setAppConfig(updated);
        showToast('Betriebe gespeichert.', 'success');
      } catch (error) {
        console.error('Companies save error:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [appConfig, setAppConfig, showToast]
  );

  const resetAppConfig = useCallback(() => {
    setEditingMenuItems([...DEFAULT_MENU_ITEMS]);
    setEditingThemeColors({ ...DEFAULT_THEME_COLORS });
    showToast(
      'Zurückgesetzt auf Standardwerte. Klicke Speichern um zu übernehmen.',
      'info'
    );
  }, [showToast]);

  // ── Menu editing helpers ─────────────────────────────────
  const moveMenuItem = useCallback(
    (itemId, direction) => {
      const sortedItems = [...editingMenuItems].sort((a, b) => a.order - b.order);
      const currentIndex = sortedItems.findIndex((item) => item.id === itemId);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sortedItems.length) return;
      [sortedItems[currentIndex], sortedItems[newIndex]] = [
        sortedItems[newIndex],
        sortedItems[currentIndex],
      ];
      const reorderedItems = sortedItems.map((item, idx) => ({
        ...item,
        order: idx,
      }));
      setEditingMenuItems(reorderedItems);
    },
    [editingMenuItems]
  );

  const toggleMenuItemVisibility = useCallback(
    (itemId) => {
      setEditingMenuItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, visible: !item.visible } : item
        )
      );
    },
    []
  );

  const updateMenuItemLabel = useCallback((itemId, newLabel) => {
    setEditingMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, label: newLabel } : item
      )
    );
  }, []);

  const updateMenuItemIcon = useCallback((itemId, newIcon) => {
    setEditingMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, icon: newIcon } : item
      )
    );
  }, []);

  const updateMenuItemGroup = useCallback((itemId, newGroup) => {
    setEditingMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, group: newGroup } : item
      )
    );
  }, []);

  const updateThemeColor = useCallback((colorKey, newColor) => {
    setEditingThemeColors((prev) => ({ ...prev, [colorKey]: newColor }));
  }, []);

  const verifyParentalConsent = useCallback(
    async (userId, status, note) => {
      try {
        await dsVerifyParentalConsent(userId, status, note);
        loadData();
        const label = status === 'VERIFIED' ? 'bestätigt' : 'abgelehnt';
        showToast(`Eltern-Einwilligung wurde ${label}.`, 'success');
      } catch (error) {
        console.error('Parental consent error:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [loadData, showToast]
  );

  // ── Return ───────────────────────────────────────────────
  return {
    // Stats & data retention
    getAdminStats,
    getDaysUntilDeletion,
    deleteUserData,
    exportUserData,

    // User management
    approveUser,
    deleteUser,
    changeUserRole,
    verifyParentalConsent,

    // Permission toggles
    toggleSchoolCardPermission,
    toggleSignReportsPermission,
    toggleExamGradesPermission,

    // Repair & push
    repairQuizStats,
    sendTestPush,

    // App config
    saveAppConfig,
    saveAnnouncement,
    saveFeatureFlag,
    saveCompanies,
    resetAppConfig,

    // Menu editing state
    editingMenuItems,
    setEditingMenuItems,
    editingThemeColors,
    setEditingThemeColors,

    // Menu editing helpers
    moveMenuItem,
    toggleMenuItemVisibility,
    updateMenuItemLabel,
    updateMenuItemIcon,
    updateMenuItemGroup,
    updateThemeColor,
  };
}
