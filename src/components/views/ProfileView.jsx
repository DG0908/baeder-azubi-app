import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';
import { AVATARS, PERMISSIONS, getAvatarById, getLevel } from '../../data/constants';
import {
  isSecureBackendApiEnabled,
  mapBackendUserToFrontendUser,
  secureAuthApi,
  secureUsersApi
} from '../../lib/secureApi';
import AvatarBadge from '../ui/AvatarBadge';
import PremiumAvatarBadge from '../ui/PremiumAvatarBadge';
import { getAgeHandicap } from '../../data/swimming';

const ProfileView = ({
  userStats,
  swimSessions,
  userBadges,
  setCurrentView,
  pushDeviceState,
  enablePushNotifications,
  syncPushSubscription,
  disablePushNotifications
}) => {
  const { user, setUser, handleLogout } = useAuth();
  const { darkMode, showToast, playSound } = useApp();

  const [profileEditName, setProfileEditName] = useState('');
  const [profileCurrentPassword, setProfileCurrentPassword] = useState('');
  const [profileEditPassword, setProfileEditPassword] = useState('');
  const [profileEditPasswordConfirm, setProfileEditPasswordConfirm] = useState('');
  const [profileEditCompany, setProfileEditCompany] = useState('');
  const [profileEditBirthDate, setProfileEditBirthDate] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pushActionLoading, setPushActionLoading] = useState(false);
  const secureBackendProfileEnabled = isSecureBackendApiEnabled();
  const minimumPasswordLength = secureBackendProfileEnabled ? 12 : 6;

  const toSafeInt = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0;
  };

  const getTotalXpFromStats = (statsInput) => {
    const rawXp = Number(statsInput?.categoryStats?.__meta?.totalXp);
    return Number.isFinite(rawXp) ? Math.max(0, Math.round(rawXp)) : 0;
  };

  const totalXp = getTotalXpFromStats(userStats);
  const currentLevel = getLevel(totalXp);
  const categoryStats = (userStats?.categoryStats && typeof userStats.categoryStats === 'object')
    ? userStats.categoryStats
    : {};
  const getCategoryCorrect = (categoryId) => toSafeInt(categoryStats?.[categoryId]?.correct);
  const totalCorrectAnswers = Object.entries(categoryStats).reduce((sum, [categoryId, categoryValue]) => {
    if (categoryId === '__meta') return sum;
    return sum + toSafeInt(categoryValue?.correct);
  }, 0);
  const userNameNormalized = String(user?.name || '').trim().toLowerCase();
  const mySwimSessions = (Array.isArray(swimSessions) ? swimSessions : []).filter((session) => {
    const sessionUserId = String(session?.user_id || '').trim();
    const sessionUserName = String(session?.user_name || '').trim().toLowerCase();
    const belongsToUser = (user?.id && sessionUserId && sessionUserId === String(user.id))
      || (userNameNormalized && sessionUserName === userNameNormalized);
    return belongsToUser && session?.confirmed !== false;
  });
  const swimDistanceMeters = mySwimSessions.reduce((sum, session) => sum + toSafeInt(session?.distance), 0);
  const swimSessionCount = mySwimSessions.length;
  const badgeCount = Array.isArray(userBadges) ? userBadges.length : 0;
  const unlockMetrics = {
    level: currentLevel,
    totalXp,
    quizWins: toSafeInt(userStats?.wins),
    totalCorrect: totalCorrectAnswers,
    techCorrect: getCategoryCorrect('tech'),
    swimCorrect: getCategoryCorrect('swim'),
    hygieneCorrect: getCategoryCorrect('hygiene'),
    firstAidCorrect: getCategoryCorrect('first') + getCategoryCorrect('health'),
    swimSessions: swimSessionCount,
    swimDistance: swimDistanceMeters,
    badgeCount
  };
  const UNLOCK_METRIC_LABELS = {
    level: 'Level',
    totalXp: 'XP',
    quizWins: 'Quiz-Siege',
    totalCorrect: 'Richtige Antworten',
    techCorrect: 'Technik-Antworten',
    swimCorrect: 'Schwimm-Antworten',
    hygieneCorrect: 'Hygiene-Antworten',
    firstAidCorrect: 'Erste-Hilfe-Antworten',
    swimSessions: 'Schwimm-Sessions',
    swimDistance: 'Schwimm-Meter',
    badgeCount: 'Badges'
  };
  const AVATAR_RARITY_META = {
    common: {
      label: 'Standard',
      chipClass: darkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'
    },
    bronze: {
      label: 'Bronze',
      chipClass: darkMode ? 'bg-amber-900/60 text-amber-200' : 'bg-amber-100 text-amber-700'
    },
    silver: {
      label: 'Silber',
      chipClass: darkMode ? 'bg-slate-600 text-slate-100' : 'bg-slate-200 text-slate-700'
    },
    gold: {
      label: 'Gold',
      chipClass: darkMode ? 'bg-yellow-900/60 text-yellow-200' : 'bg-yellow-100 text-yellow-700'
    },
    legendary: {
      label: 'Legendär',
      chipClass: darkMode ? 'bg-violet-900/60 text-violet-200' : 'bg-violet-100 text-violet-700'
    }
  };
  const formatUnlockValue = (metric, value) => {
    if (metric === 'swimDistance') return `${toSafeInt(value).toLocaleString('de-DE')} m`;
    return toSafeInt(value).toLocaleString('de-DE');
  };
  const getAvatarRequirements = (avatarInput) => {
    if (Array.isArray(avatarInput?.unlock?.requirements) && avatarInput.unlock.requirements.length > 0) {
      return avatarInput.unlock.requirements.map((requirement) => ({
        metric: String(requirement?.metric || '').trim(),
        target: Math.max(1, toSafeInt(requirement?.target)),
        label: String(requirement?.label || '').trim()
      })).filter((requirement) => requirement.metric);
    }

    const legacyLevel = Number(avatarInput?.minLevel);
    if (Number.isFinite(legacyLevel) && legacyLevel > 1) {
      return [{ metric: 'level', target: Math.max(1, Math.round(legacyLevel)), label: '' }];
    }

    return [];
  };
  const getRequirementLabel = (requirementInput) => {
    if (!requirementInput) return '';
    if (requirementInput.label) return requirementInput.label;
    const label = UNLOCK_METRIC_LABELS[requirementInput.metric] || requirementInput.metric;
    return `${label}: ${formatUnlockValue(requirementInput.metric, requirementInput.target)}`;
  };
  const getAvatarUnlockState = (avatarInput) => {
    const requirements = getAvatarRequirements(avatarInput);
    if (requirements.length === 0) {
      return {
        unlocked: true,
        progress: 1,
        requirements,
        nextRequirementText: 'Freigeschaltet'
      };
    }

    const requirementStates = requirements.map((requirement) => {
      const current = toSafeInt(unlockMetrics[requirement.metric]);
      const target = Math.max(1, toSafeInt(requirement.target));
      return {
        requirement,
        current,
        target,
        met: current >= target,
        ratio: Math.min(1, current / target)
      };
    });

    const unlocked = requirementStates.every((state) => state.met);
    const progress = requirementStates.reduce((sum, state) => sum + state.ratio, 0) / requirementStates.length;
    const firstMissing = requirementStates.find((state) => !state.met) || null;

    return {
      unlocked,
      progress,
      requirements,
      nextRequirementText: firstMissing
        ? `${getRequirementLabel(firstMissing.requirement)} (noch ${formatUnlockValue(firstMissing.requirement.metric, Math.max(0, firstMissing.target - firstMissing.current))})`
        : 'Freigeschaltet'
    };
  };
  const avatarStates = AVATARS.map((avatar) => ({
    avatar,
    ...getAvatarUnlockState(avatar)
  }));
  const equippedAvatar = getAvatarById(user?.avatar);
  const fallbackAvatar = avatarStates.find((entry) => entry.unlocked)?.avatar || AVATARS[0] || null;
  const unlockedAvatarCount = avatarStates.filter((entry) => entry.unlocked).length;
  const nextLockedAvatar = avatarStates
    .filter((entry) => !entry.unlocked)
    .sort((a, b) => b.progress - a.progress)[0] || null;
  const applySecureUserUpdate = (backendUser) => {
    const mappedUser = mapBackendUserToFrontendUser(backendUser);
    if (!mappedUser) return;

    setUser({
      ...(user || {}),
      ...mappedUser,
      permissions: PERMISSIONS[mappedUser.role] || PERMISSIONS.azubi
    });
  };

  const updateProfileName = async () => {
    if (!profileEditName.trim()) {
      showToast('Bitte gib einen Namen ein.', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      if (secureBackendProfileEnabled) {
        const updatedUser = await secureUsersApi.updateMe({
          displayName: profileEditName.trim()
        });
        applySecureUserUpdate(updatedUser);
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ name: profileEditName.trim() })
          .eq('id', user.id);
        if (error) throw error;
      }
      if (!secureBackendProfileEnabled) {
        setUser({ ...user, name: profileEditName.trim() });
      }
      showToast('Name erfolgreich geändert!', 'success');
      setProfileEditName('');
    } catch (error) {
      console.error('Error updating name:', error);
      showToast('Fehler beim Ändern des Namens', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfilePassword = async () => {
    if (!profileEditPassword || !profileEditPasswordConfirm || (secureBackendProfileEnabled && !profileCurrentPassword)) {
      showToast('Bitte beide Passwort-Felder ausfüllen.', 'warning');
      return;
    }
    if (profileEditPassword !== profileEditPasswordConfirm) {
      showToast('Die Passwörter stimmen nicht überein!', 'error');
      return;
    }
    if (profileEditPassword.length < minimumPasswordLength) {
      showToast(`Das Passwort muss mindestens ${minimumPasswordLength} Zeichen haben.`, 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      if (secureBackendProfileEnabled) {
        await secureAuthApi.changePassword({
          currentPassword: profileCurrentPassword,
          newPassword: profileEditPassword
        });
        showToast('Passwort geändert. Bitte neu anmelden.', 'success');
        setProfileCurrentPassword('');
        setProfileEditPassword('');
        setProfileEditPasswordConfirm('');
        await handleLogout();
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: profileEditPassword });
      if (error) throw error;
      showToast('Passwort erfolgreich geändert!', 'success');
      setProfileEditPassword('');
      setProfileEditPasswordConfirm('');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Fehler beim Ändern des Passworts', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfileAvatar = async (avatarId) => {
    if (avatarId) {
      const selectedAvatar = getAvatarById(avatarId);
      const selectedAvatarState = avatarStates.find((entry) => entry.avatar.id === avatarId) || null;
      if (selectedAvatar && selectedAvatarState && !selectedAvatarState.unlocked) {
        const label = selectedAvatar.label || 'Dieser Avatar';
        showToast(`${label} ist noch gesperrt. ${selectedAvatarState.nextRequirementText}`, 'warning');
        return;
      }
    }

    setProfileSaving(true);
    try {
      if (secureBackendProfileEnabled) {
        const updatedUser = await secureUsersApi.updateMe({
          avatar: avatarId
        });
        applySecureUserUpdate(updatedUser);
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ avatar: avatarId })
          .eq('id', user.id);
        if (error) throw error;
      }
      if (!secureBackendProfileEnabled) {
        setUser({ ...user, avatar: avatarId });
      }
      showToast(avatarId ? 'Avatar geändert!' : 'Avatar entfernt', 'success');
    } catch (error) {
      console.error('Error updating avatar:', error);
      showToast('Fehler beim Ändern des Avatars', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfileCompany = async () => {
    setProfileSaving(true);
    try {
      if (secureBackendProfileEnabled) {
        const updatedUser = await secureUsersApi.updateMe({
          company: profileEditCompany.trim() || null
        });
        applySecureUserUpdate(updatedUser);
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ company: profileEditCompany.trim() || null })
          .eq('id', user.id);
        if (error) throw error;
      }
      if (!secureBackendProfileEnabled) {
        setUser({ ...user, company: profileEditCompany.trim() || null });
      }
      showToast('Betrieb gespeichert!', 'success');
      setProfileEditCompany('');
    } catch (error) {
      console.error('Error updating company:', error);
      showToast('Fehler beim Speichern des Betriebs', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfileBirthDate = async () => {
    if (!profileEditBirthDate) {
      showToast('Bitte gib dein Geburtsdatum ein', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      if (secureBackendProfileEnabled) {
        const updatedUser = await secureUsersApi.updateMe({
          birthDate: profileEditBirthDate
        });
        applySecureUserUpdate(updatedUser);
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ birth_date: profileEditBirthDate })
          .eq('id', user.id);
        if (error) throw error;
      }
      if (!secureBackendProfileEnabled) {
        setUser({ ...user, birthDate: profileEditBirthDate });
      }
      showToast('Geburtsdatum gespeichert!', 'success');
      setProfileEditBirthDate('');
    } catch (error) {
      console.error('Error updating birth date:', error);
      showToast('Fehler beim Speichern des Geburtsdatums', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleEnablePushOnDevice = async () => {
    if (typeof enablePushNotifications !== 'function') return;
    setPushActionLoading(true);
    try {
      await enablePushNotifications();
    } finally {
      setPushActionLoading(false);
    }
  };

  const handleResyncPushOnDevice = async () => {
    if (typeof syncPushSubscription !== 'function') return;
    setPushActionLoading(true);
    try {
      const enabled = await syncPushSubscription(false);
      if (enabled) {
        showToast('Push-Abo auf diesem Gerät neu synchronisiert.', 'success');
      } else {
        showToast('Auf diesem Gerät ist noch kein aktives Push-Abo vorhanden.', 'warning');
      }
    } catch (error) {
      console.error('Push resync failed:', error);
      showToast('Push-Abo konnte nicht synchronisiert werden.', 'error');
    } finally {
      setPushActionLoading(false);
    }
  };

  const handleDisablePushOnDevice = async () => {
    if (typeof disablePushNotifications !== 'function') return;
    setPushActionLoading(true);
    try {
      const result = await disablePushNotifications();
      if (result?.hadSubscription) {
        showToast('Push-Abo auf diesem Gerät entfernt.', 'success');
      } else {
        showToast('Auf diesem Gerät war kein aktives Push-Abo gespeichert.', 'info');
      }
    } catch (error) {
      console.error('Push disable failed:', error);
      showToast('Push-Abo konnte auf diesem Gerät nicht entfernt werden.', 'error');
    } finally {
      setPushActionLoading(false);
    }
  };

  const pushPermissionLabel = pushDeviceState?.permission === 'granted'
    ? 'Erlaubt'
    : pushDeviceState?.permission === 'denied'
      ? 'Blockiert'
      : pushDeviceState?.permission === 'default'
        ? 'Noch nicht erlaubt'
        : 'Nicht verfügbar';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-8 text-center">
        <div className="mb-3 flex justify-center">
          <PremiumAvatarBadge
            avatar={equippedAvatar || fallbackAvatar}
            size="xl"
          />
        </div>
        <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
        <p className="opacity-90">{PERMISSIONS[user.role]?.label || user.role}</p>
      </div>

      {/* Avatar auswählen */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Avatar auswählen
        </h3>
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Verdiene exklusive Avatare über Disziplinen wie Technik, Rettung, Hygiene und Erste Hilfe.
          </p>
          <button
            onClick={() => setCurrentView('collection')}
            className="ml-4 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-violet-500/30 transition-all whitespace-nowrap"
          >
            Sammlung öffnen
          </button>
        </div>
        <div className={`mb-4 flex flex-wrap items-center gap-2 text-xs ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
          <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-cyan-900/50' : 'bg-cyan-100'}`}>
            Level {currentLevel}
          </span>
          <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-100 text-gray-700'}`}>
            {totalXp} XP
          </span>
          <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
            {unlockedAvatarCount}/{AVATARS.length} freigeschaltet
          </span>
          {nextLockedAvatar && (
            <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
              Nächster: {nextLockedAvatar.avatar.label} · {nextLockedAvatar.nextRequirementText}
            </span>
          )}
          {!nextLockedAvatar && (
            <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
              Alle Avatare freigeschaltet
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {avatarStates.map((entry) => {
            const { avatar, unlocked, nextRequirementText, requirements } = entry;
            const isSelected = user.avatar === avatar.id;
            const rarityMeta = AVATAR_RARITY_META[avatar.rarity] || AVATAR_RARITY_META.common;
            const hasUnlockRules = requirements.length > 0;
            return (
              <button
                key={avatar.id}
                onClick={() => updateProfileAvatar(avatar.id)}
                disabled={profileSaving}
                title={avatar.label}
                className={`relative p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? `ring-2 ring-cyan-400 ${darkMode ? 'bg-cyan-900/30 border-cyan-500' : 'bg-cyan-50 border-cyan-300'}`
                    : darkMode
                      ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      : 'bg-gray-50 border-gray-200 hover:bg-white'
                } ${unlocked ? 'hover:-translate-y-0.5' : 'opacity-75'}`}
              >
                {!unlocked && (
                  <span className="absolute top-2 right-2 text-[10px] bg-black/70 text-white rounded-full px-1">🔒</span>
                )}
                <div className={`mb-2 rounded-lg border px-3 py-2 flex items-center justify-center ${darkMode ? 'bg-slate-800 border-slate-500' : 'bg-white border-gray-200'}`}>
                  <AvatarBadge avatar={avatar} size="md" className="border border-white/40" />
                </div>
                <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {avatar.label}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${rarityMeta.chipClass}`}>
                    {rarityMeta.label}
                  </span>
                  {avatar.discipline && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${darkMode ? 'bg-cyan-900/40 text-cyan-200' : 'bg-cyan-100 text-cyan-700'}`}>
                      {avatar.discipline}
                    </span>
                  )}
                </div>
                <div className={`mt-2 text-xs ${unlocked ? (darkMode ? 'text-emerald-300' : 'text-emerald-700') : (darkMode ? 'text-amber-300' : 'text-amber-700')}`}>
                  {hasUnlockRules ? (unlocked ? 'Freigeschaltet' : nextRequirementText) : 'Standard-Avatar'}
                </div>
              </button>
            );
          })}
        </div>
        {user.avatar && (
          <button
            onClick={() => updateProfileAvatar(null)}
            disabled={profileSaving}
            className={`mt-4 text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
          >
            Avatar entfernen
          </button>
        )}
      </div>

      {/* Aktivitäts-Statistik */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Meine Aktivitäten
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-green-900 to-emerald-900' : 'bg-gradient-to-br from-green-100 to-emerald-100'}`}>
            <div className="text-3xl mb-1">🏆</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {userStats?.wins || 0}
            </div>
            <div className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Quiz-Siege</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-blue-900 to-cyan-900' : 'bg-gradient-to-br from-blue-100 to-cyan-100'}`}>
            <div className="text-3xl mb-1">🏊</div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {swimDistanceMeters.toLocaleString('de-DE')}m
                </div>
                <div className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Geschwommen</div>
              </div>
              <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
                <div className="text-3xl mb-1">🎖️</div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {badgeCount}
                </div>
                <div className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Badges</div>
              </div>
              <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-orange-900 to-amber-900' : 'bg-gradient-to-br from-orange-100 to-amber-100'}`}>
                <div className="text-3xl mb-1">✅</div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {totalCorrectAnswers.toLocaleString('de-DE')}
                </div>
                <div className={`text-xs ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Richtige Antworten</div>
              </div>
        </div>
        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid grid-cols-3 gap-4 text-center`}>
          <div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {userStats?.losses || 0}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Niederlagen</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {userStats?.draws || 0}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unentschieden</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {swimSessionCount}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Schwimm-Einheiten</div>
          </div>
        </div>
      </div>

      {/* Aktuelle Daten */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Aktuelle Kontodaten
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E-Mail</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.email}</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rolle</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {PERMISSIONS[user.role]?.label || user.role}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Betrieb</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {user.organizationName || user.company || <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Nicht angegeben</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Betrieb ändern */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Handy-Benachrichtigungen
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aktiviere oder repariere das Push-Abo fuer dieses Geraet direkt in der App.
            </p>
          </div>
          <div className={`px-3 py-2 rounded-lg text-sm font-semibold ${
            pushDeviceState?.hasSubscription
              ? darkMode
                ? 'bg-emerald-900/50 text-emerald-300'
                : 'bg-emerald-100 text-emerald-700'
              : darkMode
                ? 'bg-amber-900/50 text-amber-300'
                : 'bg-amber-100 text-amber-700'
          }`}>
            {pushDeviceState?.hasSubscription ? 'Dieses Geraet ist gekoppelt' : 'Auf diesem Geraet ist noch kein aktives Push-Abo gespeichert'}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Geraete-Status</p>
            <p className={`mt-1 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {pushDeviceState?.checking
                ? 'Wird geprueft...'
                : pushDeviceState?.hasSubscription
                  ? 'Abo vorhanden'
                  : 'Kein Abo'}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Berechtigung</p>
            <p className={`mt-1 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {pushPermissionLabel}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Push-System</p>
            <p className={`mt-1 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {!pushDeviceState?.supported
                ? 'Nicht unterstuetzt'
                : !pushDeviceState?.configured
                  ? 'Nicht konfiguriert'
                  : 'Bereit'}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <button
            onClick={handleEnablePushOnDevice}
            disabled={
              pushActionLoading
              || !secureBackendProfileEnabled
              || !pushDeviceState?.supported
              || !pushDeviceState?.configured
            }
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {pushActionLoading ? 'Bitte warten...' : 'Auf diesem Geraet aktivieren'}
          </button>
          <button
            onClick={handleResyncPushOnDevice}
            disabled={
              pushActionLoading
              || !secureBackendProfileEnabled
              || !pushDeviceState?.supported
              || !pushDeviceState?.configured
            }
            className={`px-5 py-3 rounded-lg font-bold transition-all ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white'
                : 'bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-800 border border-gray-300'
            }`}
          >
            Abo neu synchronisieren
          </button>
          <button
            onClick={handleDisablePushOnDevice}
            disabled={pushActionLoading || !secureBackendProfileEnabled || !pushDeviceState?.supported}
            className="px-5 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            Abo auf diesem Geraet loeschen
          </button>
        </div>

        <div className={`mt-4 text-sm space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>
            Wenn nach dem Aktivieren nichts ankommt, oeffne die App auf diesem Handy einmal neu und tippe danach auf{' '}
            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Abo neu synchronisieren</span>.
          </p>
          {!secureBackendProfileEnabled && (
            <p className={darkMode ? 'text-amber-300' : 'text-amber-700'}>
              Web-Push ist nur noch im sicheren Backend-Modus verfuegbar. Der alte Browser-/Supabase-Pfad wurde stillgelegt.
            </p>
          )}
          {pushDeviceState?.permission === 'denied' && (
            <p className={darkMode ? 'text-amber-300' : 'text-amber-700'}>
              Benachrichtigungen sind fuer diese Web-App aktuell blockiert. Bitte erlaube sie in den Browser- oder App-Einstellungen.
            </p>
          )}
          {!pushDeviceState?.supported && (
            <p className={darkMode ? 'text-amber-300' : 'text-amber-700'}>
              Dieses Geraet oder dieser Browser unterstuetzt Web-Push in der aktuellen Form nicht.
            </p>
          )}
        </div>
      </div>

      {/* Betrieb aendern */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Betrieb angeben
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={user.company || "z.B. Stadtbad München, Hallenbad Köln..."}
            value={profileEditCompany}
            onChange={(e) => setProfileEditCompany(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
          />
          <button
            onClick={updateProfileCompany}
            disabled={profileSaving}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          In welchem Schwimmbad / Betrieb arbeitest du?
        </p>
      </div>

      {/* Geburtsdatum für Handicap */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🎂 Geburtsdatum
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={profileEditBirthDate || user.birthDate || ''}
            onChange={(e) => setProfileEditBirthDate(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
          />
          <button
            onClick={updateProfileBirthDate}
            disabled={profileSaving || !profileEditBirthDate}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
        {user.birthDate && (
          <p className={`mt-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            ✓ Gespeichert: {new Date(user.birthDate).toLocaleDateString('de-DE')}
            {getAgeHandicap(user.birthDate) > 0 && (
              <span className="ml-2 text-cyan-500">
                (Handicap: {Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus)
              </span>
            )}
          </p>
        )}
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Wird für das Alters-Handicap bei der Schwimm-Challenge verwendet (ab 40 Jahren).
        </p>
      </div>

      {/* Name ändern */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Anzeigename ändern
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Neuer Name"
            value={profileEditName}
            onChange={(e) => setProfileEditName(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
          />
          <button
            onClick={updateProfileName}
            disabled={profileSaving || !profileEditName.trim()}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Name ändern'}
          </button>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Dein Anzeigename wird in der App, im Chat und in der Bestenliste angezeigt.
        </p>
      </div>

      {/* Freunde einladen */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-pink-900/80 to-purple-900/80' : 'bg-gradient-to-r from-pink-100 to-purple-100'} rounded-xl p-6 shadow-lg border-2 ${darkMode ? 'border-pink-700' : 'border-pink-300'}`}>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🎉 Freunde einladen
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Teile Bäder Azubi mit deinem Team und lernt gemeinsam!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={async () => {
              const shareData = {
                title: 'Bäder Azubi',
                text: 'Hey! Schau dir Bäder Azubi an: Lern-App für Fachangestellte für Bäderbetriebe mit Quiz, Karteikarten, Schwimm-Challenge und mehr.',
                url: 'https://azubi.smartbaden.de'
              };
              if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                try {
                  await navigator.share(shareData);
                  showToast('Danke fürs Teilen!', 'success');
                } catch (err) {
                  if (err.name !== 'AbortError') console.error('Share error:', err);
                }
              } else {
                try {
                  await navigator.clipboard.writeText('https://bäder-azubi-app.vercel.app');
                  showToast('Link kopiert! Teile ihn mit deinen Freunden.', 'success');
                  playSound('splash');
                } catch (err) {
                  showToast('Link: https://bäder-azubi-app.vercel.app', 'info');
                }
              }
            }}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
          >
            <span className="text-xl">📤</span>
            <span>App teilen</span>
          </button>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText('https://bäder-azubi-app.vercel.app');
                showToast('Link kopiert!', 'success');
                playSound('splash');
              } catch (err) {
                showToast('Link: https://bäder-azubi-app.vercel.app', 'info');
              }
            }}
            className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
            }`}
          >
            <span className="text-xl">📋</span>
            <span>Link kopieren</span>
          </button>
        </div>
      </div>

      {/* Passwort ändern */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Passwort ändern
        </h3>
        <div className="space-y-4">
          {secureBackendProfileEnabled && (
            <div>
              <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Aktuelles Passwort
              </label>
              <input
                type="password"
                placeholder="Aktuelles Passwort"
                value={profileCurrentPassword}
                onChange={(e) => setProfileCurrentPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
              />
            </div>
          )}
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Neues Passwort
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={`Mindestens ${minimumPasswordLength} Zeichen`}
                value={profileEditPassword}
                onChange={(e) => setProfileEditPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Passwort bestätigen
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="Passwort wiederholen"
                value={profileEditPasswordConfirm}
                onChange={(e) => setProfileEditPasswordConfirm(e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            onClick={updateProfilePassword}
            disabled={profileSaving || !profileEditPassword || !profileEditPasswordConfirm || (secureBackendProfileEnabled && !profileCurrentPassword)}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Passwort ändern'}
          </button>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Verwende ein sicheres Passwort mit mindestens {minimumPasswordLength} Zeichen.
        </p>
      </div>

      {/* Abmelden */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Sitzung beenden
        </h3>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
        >
          Abmelden
        </button>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Du wirst aus der App abgemeldet und musst dich erneut anmelden.
        </p>
      </div>

      {/* Rechtliches */}
      <div className={`${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'} rounded-xl p-6`}>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          📜 Rechtliches
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setCurrentView('impressum')}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
          >
            Impressum
          </button>
          <button
            onClick={() => setCurrentView('datenschutz')}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
          >
            Datenschutzerklärung
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
