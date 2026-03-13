import React from 'react';
import { getAvatarShortCode, avatarHasSunglasses } from '../../data/constants';

/* ── size presets ────────────────────────────────────────── */
const SIZES = {
  sm:  { box: 48,  icon: 20, ring: 2, glasses: 10 },
  md:  { box: 64,  icon: 28, ring: 3, glasses: 13 },
  lg:  { box: 80,  icon: 34, ring: 3, glasses: 16 },
  xl:  { box: 112, icon: 48, ring: 4, glasses: 22 },
};

/* ── rarity colour palettes ─────────────────────────────── */
const RARITY = {
  common: {
    bg: 'linear-gradient(145deg, #334155, #1e293b)',
    ring: '#475569',
    glow: 'none',
    particle: false,
    shimmer: false,
    label: 'Standard',
  },
  bronze: {
    bg: 'linear-gradient(145deg, #b45309, #78350f)',
    ring: '#d97706',
    glow: '0 0 18px rgba(217,119,6,0.35)',
    particle: false,
    shimmer: true,
    label: 'Bronze',
  },
  silver: {
    bg: 'linear-gradient(145deg, #64748b, #334155)',
    ring: '#94a3b8',
    glow: '0 0 22px rgba(148,163,184,0.35)',
    particle: false,
    shimmer: true,
    label: 'Silber',
  },
  gold: {
    bg: 'linear-gradient(145deg, #ca8a04, #854d0e)',
    ring: '#facc15',
    glow: '0 0 28px rgba(250,204,21,0.4)',
    particle: true,
    shimmer: true,
    label: 'Gold',
  },
  legendary: {
    bg: 'linear-gradient(145deg, #7c3aed, #4c1d95)',
    ring: '#a78bfa',
    glow: '0 0 36px rgba(167,139,250,0.5), 0 0 72px rgba(139,92,246,0.2)',
    particle: true,
    shimmer: true,
    label: 'Legendär',
  },
};

/* ── theme accent colours ───────────────────────────────── */
const THEME_ACCENTS = {
  ocean:    { from: '#06b6d4', to: '#2563eb' },
  rescue:   { from: '#0ea5e9', to: '#4f46e5' },
  tech:     { from: '#6366f1', to: '#7c3aed' },
  hygiene:  { from: '#10b981', to: '#0d9488' },
  firstaid: { from: '#ef4444', to: '#e11d48' },
  elite:    { from: '#f59e0b', to: '#ea580c' },
};

/* ── keyframes (injected once) ──────────────────────────── */
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const css = `
@keyframes pab-spin { to { transform: rotate(360deg); } }
@keyframes pab-shimmer {
  0%   { opacity: 0; transform: translateX(-100%) rotate(25deg); }
  40%  { opacity: 0.7; }
  100% { opacity: 0; transform: translateX(200%) rotate(25deg); }
}
@keyframes pab-particle {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-18px) scale(0); opacity: 0; }
}
@keyframes pab-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(167,139,250,0.3); }
  50%      { box-shadow: 0 0 28px rgba(167,139,250,0.6); }
}
@keyframes pab-float {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-3px); }
}
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

/* ── particle dots for gold & legendary ─────────────────── */
function Particles({ size, color }) {
  const count = 5;
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i;
    const r = size / 2 + 4;
    const x = Math.cos((angle * Math.PI) / 180) * r;
    const y = Math.sin((angle * Math.PI) / 180) * r;
    particles.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: color,
          left: '50%',
          top: '50%',
          marginLeft: x - 2,
          marginTop: y - 2,
          animation: `pab-particle 1.8s ease-in-out ${i * 0.35}s infinite`,
          pointerEvents: 'none',
        }}
      />
    );
  }
  return <>{particles}</>;
}

/* ── main component ─────────────────────────────────────── */
const PremiumAvatarBadge = ({
  avatar,
  size = 'md',
  locked = false,
  progress = 0,        // 0–1 for locked avatars
  showLabel = false,
  className = '',
  onClick,
}) => {
  injectStyles();

  const s = SIZES[size] || SIZES.md;
  const rarity = RARITY[avatar?.rarity] || RARITY.common;
  const theme = THEME_ACCENTS[avatar?.theme] || THEME_ACCENTS.ocean;
  const icon = avatar ? getAvatarShortCode(avatar) : '◈';
  const showGlasses = avatarHasSunglasses(avatar);
  const isLegendary = avatar?.rarity === 'legendary';
  const isGold = avatar?.rarity === 'gold';

  /* outer glow + floating for legendary */
  const outerStyle = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: onClick ? 'pointer' : 'default',
    animation: isLegendary ? 'pab-float 3s ease-in-out infinite' : 'none',
  };

  /* rotating ring border */
  const ringSize = s.box + s.ring * 2 + 4;
  const ringStyle = {
    position: 'absolute',
    top: -s.ring - 2,
    left: -s.ring - 2,
    width: ringSize,
    height: ringSize,
    borderRadius: '50%',
    background: (isGold || isLegendary)
      ? `conic-gradient(from 0deg, ${theme.from}, ${rarity.ring}, ${theme.to}, ${rarity.ring}, ${theme.from})`
      : rarity.ring,
    animation: (isGold || isLegendary) ? 'pab-spin 4s linear infinite' : 'none',
    opacity: locked ? 0.3 : 1,
  };

  /* inner circle mask */
  const maskSize = s.box + 2;
  const maskStyle = {
    position: 'absolute',
    top: s.ring,
    left: s.ring,
    width: maskSize,
    height: maskSize,
    borderRadius: '50%',
    background: '#0a1628',
  };

  /* main badge circle */
  const badgeStyle = {
    position: 'relative',
    width: s.box,
    height: s.box,
    borderRadius: '50%',
    background: locked ? 'linear-gradient(145deg, #1e293b, #0f172a)' : rarity.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: locked ? 'none' : rarity.glow,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    filter: locked ? 'grayscale(0.8) brightness(0.5)' : 'none',
    animation: isLegendary && !locked ? 'pab-pulse 2.5s ease-in-out infinite' : 'none',
  };

  /* shimmer overlay */
  const shimmerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
    animation: 'pab-shimmer 3s ease-in-out infinite',
    pointerEvents: 'none',
    borderRadius: '50%',
  };

  /* progress ring for locked avatars */
  const progressRing = locked && progress > 0 ? (
    <svg
      style={{ position: 'absolute', top: -s.ring - 2, left: -s.ring - 2, width: ringSize, height: ringSize, transform: 'rotate(-90deg)' }}
    >
      <circle
        cx={ringSize / 2} cy={ringSize / 2} r={(ringSize - 4) / 2}
        fill="none"
        stroke="rgba(100,116,139,0.2)"
        strokeWidth={s.ring}
      />
      <circle
        cx={ringSize / 2} cy={ringSize / 2} r={(ringSize - 4) / 2}
        fill="none"
        stroke={theme.from}
        strokeWidth={s.ring}
        strokeDasharray={Math.PI * (ringSize - 4)}
        strokeDashoffset={Math.PI * (ringSize - 4) * (1 - Math.min(1, progress))}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  ) : null;

  return (
    <div style={outerStyle} className={className} onClick={onClick} title={avatar?.label || 'Avatar'}>
      <div style={{ position: 'relative', width: s.box, height: s.box }}>
        {/* Rotating ring */}
        {!locked && <div style={ringStyle} />}
        {!locked && <div style={maskStyle} />}

        {/* Progress ring for locked */}
        {progressRing}

        {/* Badge circle */}
        <div style={badgeStyle}>
          <span style={{ fontSize: s.icon, lineHeight: 1, filter: locked ? 'grayscale(1)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
            {locked ? '🔒' : icon}
          </span>

          {/* Shimmer effect */}
          {rarity.shimmer && !locked && <div style={shimmerStyle} />}

          {/* Sunglasses */}
          {showGlasses && !locked && (
            <span style={{
              position: 'absolute',
              top: s.icon * 0.1,
              right: s.icon * 0.15,
              fontSize: s.glasses,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
            }}>
              🕶️
            </span>
          )}
        </div>

        {/* Particles for gold/legendary */}
        {rarity.particle && !locked && <Particles size={s.box} color={rarity.ring} />}
      </div>

      {/* Label */}
      {showLabel && (
        <div style={{
          textAlign: 'center',
          maxWidth: s.box + 20,
        }}>
          <div style={{
            fontSize: size === 'sm' ? 10 : 12,
            fontWeight: 600,
            color: locked ? '#64748b' : '#e2e8f0',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {avatar?.label || '???'}
          </div>
          {!locked && (
            <div style={{
              fontSize: size === 'sm' ? 8 : 10,
              color: rarity.ring,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: 2,
            }}>
              {rarity.label}
            </div>
          )}
          {locked && progress > 0 && (
            <div style={{
              fontSize: size === 'sm' ? 8 : 10,
              color: '#64748b',
              marginTop: 2,
            }}>
              {Math.round(progress * 100)}%
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumAvatarBadge;
