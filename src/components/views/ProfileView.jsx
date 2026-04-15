import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, Pencil, X as XIcon, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  updateMyProfile as dsUpdateMyProfile,
  changeMyPassword as dsChangeMyPassword,
  deleteMyAccount as dsDeleteMyAccount,
  getTotpStatus as dsGetTotpStatus,
  adminUpdateAvatarUnlocks as dsAdminUpdateAvatarUnlocks
} from '../../lib/dataService';
import { AVATARS, PERMISSIONS, getAvatarById, getLevel, getStickerSpriteStyle, isStickerAvatar } from '../../data/constants';
import AvatarBadge from '../ui/AvatarBadge';
import PremiumAvatarBadge from '../ui/PremiumAvatarBadge';
import { getAgeHandicap } from '../../data/swimming';
import TotpSetupView from './TotpSetupView';

const ProfileView = ({
  userStats,
  swimSessions,
  userBadges,
  setCurrentView,
  pushDeviceState,
  enablePushNotifications,
  syncPushSubscription,
  disablePushNotifications,
  companies = []
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pushActionLoading, setPushActionLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarFilter, setAvatarFilter] = useState('all');
  const [adminStickerSaving, setAdminStickerSaving] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    dsGetTotpStatus().then((res) => {
      if (res?.totpEnabled !== undefined) setTotpEnabled(res.totpEnabled);
    }).catch(() => {});
  }, [isAdmin]);

  // Profil-Vervollständigung
  const profileNameLooksLikeEmail = /^[^@]+@[^@]+\.[^@]+$/.test(String(user?.name || '').trim());
  const isProfileIncomplete = profileNameLooksLikeEmail || !user?.company || !user?.birthDate;
  const profileCompletionItems = [
    { key: 'name', label: 'Anzeigename', missing: profileNameLooksLikeEmail },
    { key: 'company', label: 'Betrieb', missing: !user?.company },
    { key: 'birthDate', label: 'Geburtsdatum', missing: !user?.birthDate },
  ];
  const profileCompletionCount = profileCompletionItems.filter(i => !i.missing).length;

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
    },
    sticker: {
      label: 'Sticker',
      chipClass: darkMode ? 'bg-pink-900/60 text-pink-200' : 'bg-pink-100 text-pink-700'
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
    // Admin-only sticker avatars: unlocked only if admin explicitly granted it
    if (avatarInput?.unlock?.adminOnly) {
      const grantedIds = Array.isArray(user?.unlockedAvatarIds) ? user.unlockedAvatarIds : [];
      const unlocked = grantedIds.includes(avatarInput.id);
      return {
        unlocked,
        progress: unlocked ? 1 : 0,
        requirements: [],
        nextRequirementText: unlocked ? 'Freigeschaltet' : 'Von Admin freischaltbar'
      };
    }

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

  const updateProfileName = async () => {
    if (!profileEditName.trim()) {
      showToast('Bitte gib einen Namen ein.', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      await dsUpdateMyProfile(user.id, { displayName: profileEditName.trim() });
      const updatedUser = { ...user, name: profileEditName.trim() };
      setUser(updatedUser);
      localStorage.setItem('bäder_user', JSON.stringify(updatedUser));
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
    if (!profileCurrentPassword) {
      showToast('Bitte gib dein aktuelles Passwort ein.', 'warning');
      return;
    }
    if (!profileEditPassword || !profileEditPasswordConfirm) {
      showToast('Bitte alle Passwort-Felder ausfüllen.', 'warning');
      return;
    }
    if (profileEditPassword !== profileEditPasswordConfirm) {
      showToast('Die Passwörter stimmen nicht überein!', 'error');
      return;
    }
    if (profileEditPassword.length < 6) {
      showToast('Das Passwort muss mindestens 6 Zeichen haben.', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      await dsChangeMyPassword({
        currentPassword: profileCurrentPassword,
        newPassword: profileEditPassword
      });
      showToast('Passwort erfolgreich geändert!', 'success');
      setProfileCurrentPassword('');
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
      await dsUpdateMyProfile(user.id, { avatar: avatarId });
      const updatedUser = { ...user, avatar: avatarId };
      setUser(updatedUser);
      localStorage.setItem('bäder_user', JSON.stringify(updatedUser));
      showToast(avatarId ? 'Avatar geändert!' : 'Avatar entfernt', 'success');
    } catch (error) {
      console.error('Error updating avatar:', error);
      showToast('Fehler beim Ändern des Avatars', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Admin: einzelnen Sticker für sich selbst ein-/ausschalten
  const adminToggleStickerForSelf = async (avatarId) => {
    if (!isAdmin || adminStickerSaving) return;
    const current = Array.isArray(user?.unlockedAvatarIds) ? user.unlockedAvatarIds : [];
    const next = current.includes(avatarId)
      ? current.filter(id => id !== avatarId)
      : [...current, avatarId];
    setAdminStickerSaving(true);
    try {
      await dsAdminUpdateAvatarUnlocks(user.id, next);
      const updatedUser = { ...user, unlockedAvatarIds: next };
      setUser(updatedUser);
      localStorage.setItem('bäder_user', JSON.stringify(updatedUser));
    } catch (error) {
      showToast('Fehler beim Freischalten', 'error');
    } finally {
      setAdminStickerSaving(false);
    }
  };

  const updateProfileCompany = async () => {
    setProfileSaving(true);
    try {
      await dsUpdateMyProfile(user.id, { company: profileEditCompany.trim() || null });
      const updatedUser = { ...user, company: profileEditCompany.trim() || null };
      setUser(updatedUser);
      localStorage.setItem('bäder_user', JSON.stringify(updatedUser));
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
      await dsUpdateMyProfile(user.id, { birthDate: profileEditBirthDate });
      const updatedUser = { ...user, birthDate: profileEditBirthDate };
      setUser(updatedUser);
      localStorage.setItem('bäder_user', JSON.stringify(updatedUser));
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

  const filteredAvatarStates = avatarFilter === 'all'
    ? avatarStates
    : avatarStates.filter(e => (e.avatar.rarity || 'common') === avatarFilter);

  return (
    <div className="space-y-6">
      {/* Profil-Vervollständigungs-Banner */}
      {isProfileIncomplete && (
        <div className={`${darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-300'} border-2 rounded-xl p-4 flex items-start gap-3`}>
          <AlertTriangle className={`flex-shrink-0 mt-0.5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} size={22} />
          <div>
            <p className={`font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
              Profil unvollständig ({profileCompletionCount}/3)
            </p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-amber-200/70' : 'text-amber-700'}`}>
              Bitte ergänze die fehlenden Angaben:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profileCompletionItems.filter(i => i.missing).map(item => (
                <span key={item.key} className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-amber-800/50 text-amber-200' : 'bg-amber-200 text-amber-800'}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profil-Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-8 text-center">
        <div className="mb-3 flex justify-center">
          <button onClick={() => setShowAvatarPicker(true)} className="relative group" title="Avatar ändern">
            <PremiumAvatarBadge
              avatar={equippedAvatar || fallbackAvatar}
              size="xl"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil size={24} />
            </div>
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
        <p className="opacity-90">{PERMISSIONS[user.role]?.label || user.role}</p>
        {profileNameLooksLikeEmail && (
          <p className="mt-2 text-sm bg-white/20 rounded-lg px-3 py-1 inline-block">
            Tipp: Ändere deinen Anzeigenamen unten — gerade sehen andere deine E-Mail!
          </p>
        )}
      </div>

      {/* Avatar kompakt + Modal */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AvatarBadge avatar={equippedAvatar || fallbackAvatar} size="md" />
            <div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {equippedAvatar?.label || 'Kein Avatar'}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {unlockedAvatarCount}/{AVATARS.length} freigeschaltet · Level {currentLevel} · {totalXp} XP
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded-lg transition-all"
            >
              Avatar ändern
            </button>
            <button
              onClick={() => setCurrentView('collection')}
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Sammlung
            </button>
          </div>
        </div>
      </div>

      {/* Avatar-Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowAvatarPicker(false)}>
          <div
            className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} p-6`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Avatar auswählen</h3>
              <button onClick={() => setShowAvatarPicker(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { key: 'all', label: 'Alle' },
                { key: 'common', label: 'Standard' },
                { key: 'bronze', label: 'Bronze' },
                { key: 'silver', label: 'Silber' },
                { key: 'gold', label: 'Gold' },
                { key: 'legendary', label: 'Legendär' },
                { key: 'sticker', label: '🐠 Sticker' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAvatarFilter(tab.key)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                    avatarFilter === tab.key
                      ? 'bg-cyan-500 text-white'
                      : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAvatarStates.map((entry) => {
                const { avatar, unlocked, nextRequirementText, requirements } = entry;
                const isSelected = user.avatar === avatar.id;
                const rarityMeta = AVATAR_RARITY_META[avatar.rarity] || AVATAR_RARITY_META.common;
                const isAdminOnly = avatar?.unlock?.adminOnly;
                const hasUnlockRules = requirements.length > 0 || isAdminOnly;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => { if (!isAdminOnly || unlocked) { updateProfileAvatar(avatar.id); setShowAvatarPicker(false); } }}
                    disabled={profileSaving || (isAdminOnly && !unlocked)}
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
                    {/* Admin-Schnell-Toggle für eigene Sticker */}
                    {isAdmin && isAdminOnly && (
                      <button
                        onClick={(e) => { e.stopPropagation(); adminToggleStickerForSelf(avatar.id); }}
                        disabled={adminStickerSaving}
                        className={`mt-1 w-full text-[10px] font-bold py-0.5 rounded transition-colors ${
                          unlocked
                            ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-600'
                        }`}
                      >
                        {unlocked ? '✓ Freigeschalten' : '+ Freischalten'}
                      </button>
                    )}
                  </button>
                );
              })}
            </div>
            {user.avatar && (
              <button
                onClick={() => { updateProfileAvatar(null); setShowAvatarPicker(false); }}
                disabled={profileSaving}
                className={`mt-4 text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
              >
                Avatar entfernen
              </button>
            )}
          </div>
        </div>
      )}

      {/* Persönliche Daten — alles in einer Karte */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Persönliche Daten
        </h3>
        <div className="space-y-5">
          {/* E-Mail (nur Anzeige) */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E-Mail</label>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.email}</p>
          </div>

          {/* Rolle (nur Anzeige) */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rolle</label>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{PERMISSIONS[user.role]?.label || user.role}</p>
          </div>

          {/* Anzeigename */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Anzeigename</label>
            <p className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {user.name}
              {profileNameLooksLikeEmail && (
                <span className={`ml-2 text-xs font-normal ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                  (sieht aus wie eine E-Mail — bitte ändern)
                </span>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Neuer Name"
                value={profileEditName}
                onChange={(e) => setProfileEditName(e.target.value)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
              />
              <button
                onClick={updateProfileName}
                disabled={profileSaving || !profileEditName.trim()}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg transition-all"
              >
                {profileSaving ? 'Speichern...' : 'Ändern'}
              </button>
            </div>
            <p className={`mt-1.5 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Wird in der App, im Chat und in der Bestenliste angezeigt.
            </p>
          </div>

          <div className={`border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`} />

          {/* Betrieb */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Betrieb</label>
            {(user.organizationName || user.company) && (
              <p className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {user.organizationName || user.company}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              {companies.length > 0 ? (
                <select
                  value={profileEditCompany || user.company || ''}
                  onChange={(e) => setProfileEditCompany(e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                >
                  <option value="">-- Betrieb wählen --</option>
                  {companies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={user.company || "z.B. Stadtbad München, Hallenbad Köln..."}
                  value={profileEditCompany}
                  onChange={(e) => setProfileEditCompany(e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                />
              )}
              <button
                onClick={updateProfileCompany}
                disabled={profileSaving}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg transition-all"
              >
                {profileSaving ? 'Speichern...' : 'Speichern'}
              </button>
            </div>
            <p className={`mt-1.5 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              In welchem Schwimmbad / Betrieb arbeitest du?
            </p>
          </div>

          <div className={`border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`} />

          {/* Geburtsdatum */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Geburtsdatum</label>
            {user.birthDate && (
              <p className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {new Date(user.birthDate).toLocaleDateString('de-DE')}
                {getAgeHandicap(user.birthDate) > 0 && (
                  <span className="ml-2 text-sm font-normal text-cyan-500">
                    (Handicap: {Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus)
                  </span>
                )}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={profileEditBirthDate || (user.birthDate ? user.birthDate.slice(0, 10) : '')}
                onChange={(e) => setProfileEditBirthDate(e.target.value)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
              />
              <button
                onClick={updateProfileBirthDate}
                disabled={profileSaving || !profileEditBirthDate}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg transition-all"
              >
                {profileSaving ? 'Speichern...' : 'Speichern'}
              </button>
            </div>
            <p className={`mt-1.5 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Wird für das Alters-Handicap bei der Schwimm-Challenge verwendet (ab 40 Jahren).
            </p>
          </div>
        </div>
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

      {/* Handy-Benachrichtigungen */}
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
            disabled={pushActionLoading || !pushDeviceState?.supported}
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

      {/* Freunde einladen */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-pink-900/80 to-purple-900/80' : 'bg-gradient-to-r from-pink-100 to-purple-100'} rounded-xl p-6 shadow-lg border-2 ${darkMode ? 'border-pink-700' : 'border-pink-300'}`}>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Freunde einladen
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
                  await navigator.clipboard.writeText('https://azubi.smartbaden.de');
                  showToast('Link kopiert! Teile ihn mit deinen Freunden.', 'success');
                  playSound('splash');
                } catch (err) {
                  showToast('Link: https://azubi.smartbaden.de', 'info');
                }
              }
            }}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
          >
            App teilen
          </button>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText('https://azubi.smartbaden.de');
                showToast('Link kopiert!', 'success');
                playSound('splash');
              } catch (err) {
                showToast('Link: https://azubi.smartbaden.de', 'info');
              }
            }}
            className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
            }`}
          >
            Link kopieren
          </button>
        </div>
      </div>

      {/* Sicherheit — Passwort + Abmelden */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Sicherheit
        </h3>
        <form onSubmit={(e) => { e.preventDefault(); updateProfilePassword(); }} className="space-y-4">
          <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Aktuelles Passwort
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Aktuelles Passwort"
                value={profileCurrentPassword}
                onChange={(e) => setProfileCurrentPassword(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
              />
            </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Neues Passwort
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Mindestens 6 Zeichen"
                value={profileEditPassword}
                onChange={(e) => setProfileEditPassword(e.target.value)}
                className={`w-full px-4 py-2.5 pr-12 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
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
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Passwort bestätigen
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Passwort wiederholen"
                value={profileEditPasswordConfirm}
                onChange={(e) => setProfileEditPasswordConfirm(e.target.value)}
                className={`w-full px-4 py-2.5 pr-12 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
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
            type="submit"
            disabled={profileSaving || !profileCurrentPassword || !profileEditPassword || !profileEditPasswordConfirm}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Passwort ändern'}
          </button>
        </form>

        <div className={`mt-6 pt-5 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-all"
          >
            Abmelden
          </button>
          <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Du wirst aus der App abgemeldet und musst dich erneut anmelden.
          </p>
        </div>
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
          <button
            onClick={() => setCurrentView('agb')}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
          >
            Nutzungsbedingungen
          </button>
        </div>

        {/* 2FA-Setup (nur Admins) */}
        {isAdmin && (
          <div className="mt-6">
            <TotpSetupView
              initialEnabled={totpEnabled}
              onStatusChange={(enabled) => setTotpEnabled(enabled)}
            />
          </div>
        )}

        {/* Konto löschen (Art. 17 DSGVO) */}
        {user?.role !== 'admin' && (
          <div className={`mt-6 p-4 rounded-xl border-2 ${darkMode ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'}`}>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={`flex items-center gap-2 text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
              >
                <Trash2 size={16} />
                Konto und alle Daten löschen
              </button>
            ) : (
              <div className="space-y-3">
                <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Konto unwiderruflich löschen?
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Alle deine Daten (Berichtshefte, Quizduelle, Chat-Nachrichten, Statistiken) werden gelöscht.
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tippe <strong>LÖSCHEN</strong> zur Bestätigung:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="LÖSCHEN"
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (deleteConfirmText !== 'LÖSCHEN') {
                        showToast('Bitte tippe LÖSCHEN zur Bestätigung.', 'error');
                        return;
                      }
                      setDeleting(true);
                      try {
                        await dsDeleteMyAccount(user.id);
                        showToast('Dein Konto wurde gelöscht.', 'success');
                        handleLogout();
                      } catch (err) {
                        console.error('Delete account error:', err);
                        showToast('Fehler beim Löschen: ' + (err.message || 'Unbekannter Fehler'), 'error');
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    disabled={deleting || deleteConfirmText !== 'LÖSCHEN'}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-bold transition-all"
                  >
                    {deleting ? 'Wird gelöscht...' : 'Endgültig löschen'}
                  </button>
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                    className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
