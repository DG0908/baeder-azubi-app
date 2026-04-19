// Profile banner presets rendered behind the profile hero card.
// Keys are persisted server-side (User.profileBannerKey) — keep ids stable.
// Tiers:
//   'free'    → every user can pick
//   'admin'   → admins only (private/internal designs)
//   'premium' → reserved for later paid unlocks
// Optional imageUrl overrides the gradient with a cover-image; gradient stays
// as a graceful fallback while the image loads (or on <img> error).

export const PROFILE_BANNERS = [
  {
    id: 'cyan-classic',
    tier: 'free',
    label: 'Cyan Classic',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
  },
  {
    id: 'pool-deep',
    tier: 'free',
    label: 'Pool Deep',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #0f172a 100%)'
  },
  {
    id: 'sunset',
    tier: 'free',
    label: 'Sonnenuntergang',
    gradient: 'linear-gradient(135deg, #f97316 0%, #db2777 60%, #7c3aed 100%)'
  },
  {
    id: 'sunrise',
    tier: 'free',
    label: 'Morgenrot',
    gradient: 'linear-gradient(135deg, #fde68a 0%, #f97316 50%, #dc2626 100%)'
  },
  {
    id: 'tropic',
    tier: 'free',
    label: 'Tropic',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 55%, #6366f1 100%)'
  },
  {
    id: 'lagune',
    tier: 'free',
    label: 'Lagune',
    gradient: 'linear-gradient(135deg, #99f6e4 0%, #14b8a6 45%, #0369a1 100%)'
  },
  {
    id: 'aurora',
    tier: 'free',
    label: 'Aurora',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #ec4899 100%)'
  },
  {
    id: 'forest',
    tier: 'free',
    label: 'Wald',
    gradient: 'linear-gradient(135deg, #166534 0%, #0f766e 60%, #0c4a6e 100%)'
  },
  {
    id: 'midnight',
    tier: 'free',
    label: 'Mitternacht',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)'
  },
  {
    id: 'rose-gold',
    tier: 'free',
    label: 'Roségold',
    gradient: 'linear-gradient(135deg, #fecdd3 0%, #fb7185 55%, #be123c 100%)'
  },
  {
    id: 'fcb-admin',
    tier: 'admin',
    label: 'FC Bayern München',
    imageUrl: '/banners/fcb-admin.png',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #0c0a09 100%)'
  }
];

export const DEFAULT_PROFILE_BANNER_ID = 'cyan-classic';

export const getProfileBannerById = (id) =>
  PROFILE_BANNERS.find((b) => b.id === id) || null;

const resolveBanner = (id) =>
  getProfileBannerById(id) || getProfileBannerById(DEFAULT_PROFILE_BANNER_ID);

export const getProfileBannerGradient = (id) => resolveBanner(id).gradient;

// CSS `background` value — image (if any) layered on top of the gradient so
// the fallback shows through while the image decodes.
export const getProfileBannerBackground = (id) => {
  const banner = resolveBanner(id);
  if (banner.imageUrl) {
    return `url('${banner.imageUrl}') center/contain no-repeat, ${banner.gradient}`;
  }
  return banner.gradient;
};

// Filter banners the current user is allowed to pick.
export const getVisibleBanners = (userRole) => {
  const role = String(userRole || '').toLowerCase();
  const isAdmin = role === 'admin';
  return PROFILE_BANNERS.filter((b) => {
    if (b.tier === 'admin') return isAdmin;
    return true;
  });
};
