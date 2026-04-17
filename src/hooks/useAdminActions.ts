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

// ── Types ───────────────────────────────────────────────────
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isOwner?: boolean;
  is_owner?: boolean;
  organizationId?: string | null;
  permissions?: { canManageUsers?: boolean };
  [key: string]: unknown;
}

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  approved?: boolean;
  is_owner?: boolean;
  isOwner?: boolean;
  trainingEnd?: string | null;
  lastLogin?: string | null;
  last_login?: string | null;
  organization_id?: string | null;
  organizationId?: string | null;
  [key: string]: unknown;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  group: string;
  order: number;
  visible: boolean;
}

interface AppConfig {
  menuItems: MenuItem[];
  themeColors: Record<string, string>;
  featureFlags: Record<string, boolean>;
  companies: unknown[];
  announcement: { enabled: boolean; [key: string]: unknown };
}

interface StatsSources {
  materials: unknown[];
  submittedQuestions: Array<{ approved?: boolean }>;
  activeGames: unknown[];
  chatMessageCount: number;
}

interface UseAdminActionsDeps {
  user: AdminUser | null;
  allUsers: AdminAccount[];
  pendingUsers: AdminAccount[];
  showToast: (message: string, type?: string) => void;
  playSound: (type: string) => void;
  loadData: () => void;
  appConfig: AppConfig;
  setAppConfig: (config: AppConfig) => void;
  statsSources: StatsSources;
}

// ── Hook ─────────────────────────────────────────────────────
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
}: UseAdminActionsDeps) {
  // ── Editing state (only used in admin config UI) ─────────
  const [editingMenuItems, setEditingMenuItems] = useState<MenuItem[]>([]);
  const [editingThemeColors, setEditingThemeColors] = useState<Record<string, string>>({});

  // ── Data retention helper ────────────────────────────────
  const getDaysUntilDeletion = useCallback((account: AdminAccount): number | null => {
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
      const lastLoginTime = new Date((account.lastLogin || account.last_login)!).getTime();
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
  const deleteUserData = useCallback(async (userId: string, email: string, userName: string) => {
    try {
      await (dsPurgeUserData as (id: string, name: string) => Promise<void>)(userId, userName);
      console.log(`Alle Daten für ${email} gelöscht`);
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  }, []);

  const exportUserData = useCallback(async (targetInput: AdminAccount | string, fallbackName = '') => {
    const targetUser =
      targetInput && typeof targetInput === 'object'
        ? targetInput
        : { email: targetInput, name: fallbackName } as AdminAccount;
    const targetLabel = String(
      targetUser?.name || (targetUser as Record<string, unknown>)?.displayName || targetUser?.email || 'nutzer'
    ).trim();
    try {
      const exportData = await (dsExportUserDataBundle as (user: AdminAccount) => Promise<unknown>)(targetUser);
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
    async (email: string) => {
      try {
        const result = await (dsApproveUser as (email: string, users: AdminAccount[]) => Promise<{ account?: { name?: string } }>)(email, [
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
    async (email: string) => {
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

        await (dsDeleteUser as (email: string, users: AdminAccount[]) => Promise<void>)(email, allUsers);
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
    async (email: string, newRole: string) => {
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

        await (dsChangeUserRole as (email: string, role: string, users: AdminAccount[]) => Promise<void>)(targetEmail, newRole, allUsers);
        loadData();
        showToast(`Rolle geändert zu: ${(PERMISSIONS as Record<string, { label: string }>)[newRole].label}`, 'success');
      } catch (error) {
        console.error('Error changing role:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [user, allUsers, loadData, showToast]
  );

  // ── Permission toggles ──────────────────────────────────
  const togglePermission = useCallback(
    async (userId: string, field: string, currentValue: boolean, labels: { granted: string; revoked: string }) => {
      try {
        await (dsUpdateUserPermission as (id: string, field: string, value: boolean) => Promise<void>)(userId, field, !currentValue);
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
    (userId: string, currentValue: boolean) =>
      togglePermission(userId, 'canViewSchoolCards', currentValue, {
        granted: 'Kontrollkarten-Berechtigung erteilt',
        revoked: 'Kontrollkarten-Berechtigung entzogen',
      }),
    [togglePermission]
  );

  const toggleSignReportsPermission = useCallback(
    (userId: string, currentValue: boolean) =>
      togglePermission(userId, 'canSignReports', currentValue, {
        granted: 'Berichtsheft-Unterschrift-Berechtigung erteilt',
        revoked: 'Berichtsheft-Unterschrift-Berechtigung entzogen',
      }),
    [togglePermission]
  );

  const toggleExamGradesPermission = useCallback(
    (userId: string, currentValue: boolean) =>
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
    const responseData = await (dsRepairQuizStats as (fetcher: typeof fetchPushBackendWithAuth) => Promise<unknown>)(fetchPushBackendWithAuth);
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

      return (dsSendTestPush as (fetcher: typeof fetchPushBackendWithAuth, payload: Record<string, unknown>) => Promise<unknown>)(fetchPushBackendWithAuth, payload);
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
      await (dsSaveAppConfig as (config: Record<string, unknown>) => Promise<void>)({
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
    async (announcement: { enabled: boolean; [key: string]: unknown }) => {
      const updated = { ...appConfig, announcement };
      try {
        await (dsSaveAppConfig as (config: Record<string, unknown>) => Promise<void>)({
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
    async (key: string, value: boolean) => {
      const nextFlags = { ...appConfig.featureFlags, [key]: value };
      const updated = { ...appConfig, featureFlags: nextFlags };
      try {
        await (dsSaveAppConfig as (config: Record<string, unknown>) => Promise<void>)({ featureFlags: nextFlags });
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
    async (newCompanies: unknown[]) => {
      const updated = { ...appConfig, companies: newCompanies };
      try {
        await (dsSaveAppConfig as (config: Record<string, unknown>) => Promise<void>)({
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
    setEditingMenuItems([...(DEFAULT_MENU_ITEMS as MenuItem[])]);
    setEditingThemeColors({ ...(DEFAULT_THEME_COLORS as Record<string, string>) });
    showToast(
      'Zurückgesetzt auf Standardwerte. Klicke Speichern um zu übernehmen.',
      'info'
    );
  }, [showToast]);

  // ── Menu editing helpers ─────────────────────────────────
  const moveMenuItem = useCallback(
    (itemId: string, direction: 'up' | 'down') => {
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
    (itemId: string) => {
      setEditingMenuItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, visible: !item.visible } : item
        )
      );
    },
    []
  );

  const updateMenuItemLabel = useCallback((itemId: string, newLabel: string) => {
    setEditingMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, label: newLabel } : item
      )
    );
  }, []);

  const updateMenuItemIcon = useCallback((itemId: string, newIcon: string) => {
    setEditingMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, icon: newIcon } : item
      )
    );
  }, []);

  const updateMenuItemGroup = useCallback((itemId: string, newGroup: string) => {
    setEditingMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, group: newGroup } : item
      )
    );
  }, []);

  const updateThemeColor = useCallback((colorKey: string, newColor: string) => {
    setEditingThemeColors((prev) => ({ ...prev, [colorKey]: newColor }));
  }, []);

  const verifyParentalConsent = useCallback(
    async (userId: string, status: string, note?: string) => {
      try {
        await (dsVerifyParentalConsent as unknown as (id: string, status: string, note?: string) => Promise<void>)(userId, status, note);
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
