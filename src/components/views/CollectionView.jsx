import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

import { updateMyAvatar as dsUpdateMyAvatar } from '../../lib/dataService';
import { AVATARS, getLevel } from '../../data/constants';
import PremiumAvatarBadge from '../ui/PremiumAvatarBadge';

const RARITY_ORDER = ['common', 'bronze', 'silver', 'gold', 'legendary', 'sticker'];
const RARITY_META = {
  common:    { label: 'Standard',  color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  bronze:    { label: 'Bronze',    color: '#d97706', bg: 'rgba(217,119,6,0.15)' },
  silver:    { label: 'Silber',    color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
  gold:      { label: 'Gold',      color: '#facc15', bg: 'rgba(250,204,21,0.15)' },
  legendary: { label: 'Legendär',  color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  sticker:   { label: 'Sticker',   color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
};

const FILTER_OPTIONS = [
  { id: 'all', label: 'Alle' },
  { id: 'unlocked', label: 'Freigeschaltet' },
  { id: 'locked', label: 'Gesperrt' },
  { id: 'legendary', label: 'Legendär' },
  { id: 'gold', label: 'Gold' },
  { id: 'sticker', label: '🐠 Sticker' },
];

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
  badgeCount: 'Badges',
};

const CollectionView = ({ userStats, swimSessions, userBadges, setCurrentView }) => {
  const { user, setUser } = useAuth();
  const { darkMode, showToast, playSound } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const toSafeInt = (v) => { const n = Number(v); return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0; };

  const getTotalXp = () => {
    const raw = Number(userStats?.categoryStats?.__meta?.totalXp);
    return Number.isFinite(raw) ? Math.max(0, Math.round(raw)) : 0;
  };

  const totalXp = getTotalXp();
  const currentLevel = getLevel(totalXp);
  const categoryStats = (userStats?.categoryStats && typeof userStats.categoryStats === 'object') ? userStats.categoryStats : {};
  const getCat = (id) => toSafeInt(categoryStats?.[id]?.correct);
  const totalCorrect = Object.entries(categoryStats).reduce((s, [k, v]) => k === '__meta' ? s : s + toSafeInt(v?.correct), 0);

  const userNameNorm = String(user?.name || '').trim().toLowerCase();
  const mySessions = (Array.isArray(swimSessions) ? swimSessions : []).filter((s) => {
    const sid = String(s?.user_id || '').trim();
    const sname = String(s?.user_name || '').trim().toLowerCase();
    return ((user?.id && sid && sid === String(user.id)) || (userNameNorm && sname === userNameNorm)) && s?.confirmed !== false;
  });
  const swimDist = mySessions.reduce((s, x) => s + toSafeInt(x?.distance), 0);
  const swimCount = mySessions.length;
  const badgeCount = Array.isArray(userBadges) ? userBadges.length : 0;

  const metrics = {
    level: currentLevel, totalXp, quizWins: toSafeInt(userStats?.wins),
    totalCorrect, techCorrect: getCat('tech'), swimCorrect: getCat('swim'),
    hygieneCorrect: getCat('hygiene'), firstAidCorrect: getCat('first') + getCat('health'),
    swimSessions: swimCount, swimDistance: swimDist, badgeCount,
  };

  const getUnlockState = (av) => {
    // Admin-only sticker avatars
    if (av?.unlock?.adminOnly) {
      const grantedIds = Array.isArray(user?.unlockedAvatarIds) ? user.unlockedAvatarIds : [];
      const unlocked = grantedIds.includes(av.id);
      return { unlocked, progress: unlocked ? 1 : 0, reqs: [], states: [], adminOnly: true };
    }

    let reqs = [];
    if (Array.isArray(av?.unlock?.requirements) && av.unlock.requirements.length > 0) {
      reqs = av.unlock.requirements.map(r => ({ metric: String(r?.metric || ''), target: Math.max(1, toSafeInt(r?.target)) })).filter(r => r.metric);
    } else {
      const lvl = Number(av?.minLevel);
      if (Number.isFinite(lvl) && lvl > 1) reqs = [{ metric: 'level', target: Math.round(lvl) }];
    }
    if (reqs.length === 0) return { unlocked: true, progress: 1, reqs: [], states: [] };

    const states = reqs.map(r => {
      const cur = toSafeInt(metrics[r.metric]);
      const tgt = Math.max(1, r.target);
      return { ...r, current: cur, met: cur >= tgt, ratio: Math.min(1, cur / tgt) };
    });
    const unlocked = states.every(s => s.met);
    const progress = states.reduce((s, x) => s + x.ratio, 0) / states.length;
    return { unlocked, progress, reqs, states };
  };

  const avatarStates = AVATARS.map(av => ({ avatar: av, ...getUnlockState(av) }));
  const unlockedCount = avatarStates.filter(e => e.unlocked).length;

  const filtered = avatarStates.filter(e => {
    if (filter === 'unlocked') return e.unlocked;
    if (filter === 'locked') return !e.unlocked;
    if (filter === 'legendary') return e.avatar.rarity === 'legendary';
    if (filter === 'gold') return e.avatar.rarity === 'gold';
    if (filter === 'sticker') return e.avatar.rarity === 'sticker';
    return true;
  });

  // Group by rarity
  const grouped = RARITY_ORDER.map(rarity => ({
    rarity,
    meta: RARITY_META[rarity],
    items: filtered.filter(e => e.avatar.rarity === rarity),
  })).filter(g => g.items.length > 0);

  const equipAvatar = async (avatarId) => {
    const entry = avatarStates.find(e => e.avatar.id === avatarId);
    if (!entry?.unlocked) {
      showToast(`${entry?.avatar?.label || 'Avatar'} ist noch gesperrt!`, 'warning');
      return;
    }
    try {
      await dsUpdateMyAvatar(user.id, avatarId);
      const updated = { ...user, avatar: avatarId };
      setUser(updated);
      localStorage.setItem('bäder_user', JSON.stringify(updated));
      playSound?.('success');
      showToast(`${entry.avatar.label} ausgerüstet!`, 'success');
      setSelectedAvatar(null);
    } catch (err) {
      showToast('Fehler beim Auswählen', 'error');
    }
  };

  const fmtVal = (metric, val) => metric === 'swimDistance' ? `${toSafeInt(val).toLocaleString('de-DE')} m` : toSafeInt(val).toLocaleString('de-DE');

  const bg = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const card = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${bg} pb-8`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-8 rounded-b-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentView('profile')} className="text-white/80 hover:text-white text-sm font-medium">
            ← Zurück
          </button>
          <span className="text-xs font-mono bg-white/15 px-3 py-1 rounded-full">
            {unlockedCount}/{AVATARS.length} GESAMMELT
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Sammlung</h1>
        <p className="text-white/70 text-sm">Schalte einzigartige Avatare frei durch Quizze, Schwimmen und Lernen</p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-700"
              style={{ width: `${(unlockedCount / AVATARS.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-white/50">
            <span>{Math.round((unlockedCount / AVATARS.length) * 100)}% komplett</span>
            <span>Level {currentLevel} · {totalXp} XP</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="px-4 mt-4 flex gap-2 overflow-x-auto pb-2">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === opt.id
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                : darkMode ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Avatar grid grouped by rarity */}
      <div className="px-4 mt-4 space-y-6">
        {grouped.map(group => (
          <div key={group.rarity}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: group.meta.color, boxShadow: `0 0 8px ${group.meta.color}` }} />
              <h2 className={`text-lg font-bold ${text}`}>{group.meta.label}</h2>
              <span className={`text-xs ${textMuted}`}>({group.items.length})</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {group.items.map(entry => {
                const isEquipped = user.avatar === entry.avatar.id;
                return (
                  <button
                    key={entry.avatar.id}
                    onClick={() => setSelectedAvatar(entry)}
                    className={`relative flex flex-col items-center p-3 rounded-xl border transition-all ${
                      isEquipped
                        ? `ring-2 ring-cyan-400 ${darkMode ? 'bg-cyan-900/20 border-cyan-600' : 'bg-cyan-50 border-cyan-300'}`
                        : `${card} hover:scale-105`
                    }`}
                  >
                    {isEquipped && (
                      <span className="absolute top-1 right-1 text-[10px] bg-cyan-500 text-white rounded-full px-1.5 py-0.5 font-bold">
                        IN USE
                      </span>
                    )}
                    <PremiumAvatarBadge
                      avatar={entry.avatar}
                      size="md"
                      locked={!entry.unlocked}
                      progress={entry.progress}
                    />
                    <span className={`mt-2 text-xs font-semibold text-center leading-tight ${entry.unlocked ? text : textMuted}`}>
                      {entry.avatar.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <div className={`text-center py-12 ${textMuted}`}>
            Keine Avatare in dieser Kategorie
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAvatar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setSelectedAvatar(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className={`relative max-w-sm w-full rounded-2xl p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAvatar(null)}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              ✕
            </button>

            {/* Avatar display */}
            <div className="flex justify-center mb-4">
              <PremiumAvatarBadge
                avatar={selectedAvatar.avatar}
                size="xl"
                locked={!selectedAvatar.unlocked}
                progress={selectedAvatar.progress}
              />
            </div>

            <h3 className={`text-xl font-bold text-center ${text}`}>{selectedAvatar.avatar.label}</h3>

            {/* Rarity + discipline */}
            <div className="flex justify-center gap-2 mt-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: RARITY_META[selectedAvatar.avatar.rarity]?.bg, color: RARITY_META[selectedAvatar.avatar.rarity]?.color }}
              >
                {RARITY_META[selectedAvatar.avatar.rarity]?.label}
              </span>
              {selectedAvatar.avatar.discipline && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-cyan-900/40 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
                  {selectedAvatar.avatar.discipline}
                </span>
              )}
            </div>

            {/* Unlock requirements */}
            {selectedAvatar.states.length > 0 && (
              <div className="mt-5 space-y-3">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${textMuted}`}>
                  {selectedAvatar.unlocked ? 'Anforderungen erfüllt' : 'Anforderungen'}
                </h4>
                {selectedAvatar.states.map((st, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={text}>{UNLOCK_METRIC_LABELS[st.metric] || st.metric}</span>
                      <span className={st.met ? 'text-emerald-400 font-bold' : textMuted}>
                        {fmtVal(st.metric, st.current)} / {fmtVal(st.metric, st.target)}
                        {st.met && ' ✓'}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${st.met ? 'bg-emerald-500' : 'bg-violet-500'}`}
                        style={{ width: `${Math.round(st.ratio * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              {selectedAvatar.unlocked ? (
                <button
                  onClick={() => equipAvatar(selectedAvatar.avatar.id)}
                  disabled={user.avatar === selectedAvatar.avatar.id}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    user.avatar === selectedAvatar.avatar.id
                      ? 'bg-gray-500/30 text-gray-400 cursor-default'
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-violet-500/30 active:scale-95'
                  }`}
                >
                  {user.avatar === selectedAvatar.avatar.id ? 'Bereits ausgerüstet' : 'Ausrüsten'}
                </button>
              ) : (
                <div className={`flex-1 py-3 rounded-xl text-center font-bold text-sm ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-400'}`}>
                  {selectedAvatar.adminOnly
                    ? '🔒 Von Admin freischaltbar'
                    : `🔒 Noch ${Math.round((1 - selectedAvatar.progress) * 100)}% fehlen`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionView;
