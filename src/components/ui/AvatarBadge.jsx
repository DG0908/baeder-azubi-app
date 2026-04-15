import React from 'react';
import { avatarHasSunglasses, getAvatarShortCode, getStickerSpriteStyle, isStickerAvatar } from '../../data/constants';

const SIZE_STYLES = {
  sm: {
    box: 'w-8 h-8 text-lg',
    glasses: 'text-[10px] -top-1 -right-1'
  },
  md: {
    box: 'w-12 h-12 text-2xl',
    glasses: 'text-xs -top-1 -right-1'
  },
  lg: {
    box: 'w-14 h-14 text-3xl',
    glasses: 'text-sm -top-1.5 -right-1'
  },
  xl: {
    box: 'w-20 h-20 text-5xl',
    glasses: 'text-lg -top-2 -right-1'
  }
};

const THEME_STYLES = {
  ocean: 'from-cyan-500 to-blue-600',
  rescue: 'from-sky-500 to-indigo-600',
  tech: 'from-indigo-500 to-violet-600',
  hygiene: 'from-emerald-500 to-teal-600',
  firstaid: 'from-red-500 to-rose-600',
  elite: 'from-amber-500 to-orange-600'
};

const AvatarBadge = ({
  avatar,
  size = 'md',
  fallback = '◈',
  className = ''
}) => {
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  // Sticker sprite rendering
  if (isStickerAvatar(avatar)) {
    const spriteStyle = getStickerSpriteStyle(avatar);
    return (
      <div
        className={`relative rounded-full overflow-hidden ${sizeStyle.box} ${className} shadow-md ring-2 ring-white/30`}
        style={spriteStyle}
        title={avatar?.label || 'Sticker Avatar'}
      />
    );
  }

  const theme = String(avatar?.theme || 'ocean').toLowerCase();
  const gradientClass = THEME_STYLES[theme] || THEME_STYLES.ocean;
  const icon = avatar ? getAvatarShortCode(avatar) : fallback;
  const showGlasses = avatarHasSunglasses(avatar);

  return (
    <div
      className={`relative rounded-full bg-gradient-to-br ${gradientClass} ${sizeStyle.box} ${className} flex items-center justify-center shadow-md`}
      title={avatar?.label || 'Avatar'}
    >
      <span className="leading-none drop-shadow">{icon}</span>
      {showGlasses && (
        <span className={`absolute ${sizeStyle.glasses}`} aria-hidden>
          🕶️
        </span>
      )}
    </div>
  );
};

export default AvatarBadge;
