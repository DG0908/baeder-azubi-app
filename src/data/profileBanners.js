// Profile banner presets rendered behind the profile hero card.
// Keys are persisted server-side (User.profileBannerKey) — keep ids stable.
// Tiers:
//   'free'    → every user can pick
//   'admin'   → admins only (private/internal designs)
//   'premium' → reserved for later paid unlocks
// Optional imageUrl overrides the gradient with a cover-image; gradient stays
// as a graceful fallback while the image loads (or on <img> error).

// Inline-SVG Krone als data-URI — keine externe Asset-Datei nötig.
// Wird als background-image über dem Gradient gelegt.
const CHEF_CROWN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23fef3c7"/><stop offset="50%" stop-color="%23fcd34d"/><stop offset="100%" stop-color="%23b45309"/></linearGradient><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23b45309"/><stop offset="100%" stop-color="%2378350f"/></linearGradient><radialGradient id="gem" cx="0.3" cy="0.3"><stop offset="0%" stop-color="%23fecaca"/><stop offset="100%" stop-color="%23991b1b"/></radialGradient></defs><g transform="translate(200,60)"><path d="M-48 30 L-36 -14 L-18 18 L0 -28 L18 18 L36 -14 L48 30 Z" fill="url(%23cg)" stroke="%2378350f" stroke-width="2" stroke-linejoin="round"/><rect x="-48" y="28" width="96" height="12" rx="2" fill="url(%23rg)"/><line x1="-46" y1="34" x2="46" y2="34" stroke="%23fef3c7" stroke-width="0.8" opacity="0.5"/><circle cx="-36" cy="-14" r="5" fill="%23fef3c7" stroke="%2378350f" stroke-width="1"/><circle cx="0" cy="-28" r="6" fill="url(%23gem)" stroke="%2378350f" stroke-width="1"/><circle cx="36" cy="-14" r="5" fill="%23fef3c7" stroke="%2378350f" stroke-width="1"/><circle cx="-18" cy="18" r="3" fill="url(%23gem)" stroke="%2378350f" stroke-width="0.8"/><circle cx="18" cy="18" r="3" fill="url(%23gem)" stroke="%2378350f" stroke-width="0.8"/></g><g fill="%23fcd34d" opacity="0.55"><circle cx="60" cy="30" r="2"/><circle cx="340" cy="30" r="2"/><circle cx="80" cy="90" r="1.5"/><circle cx="320" cy="90" r="1.5"/><circle cx="120" cy="20" r="1"/><circle cx="280" cy="20" r="1"/></g></svg>`;
const CHEF_CROWN_DATA_URI = `data:image/svg+xml;utf8,${CHEF_CROWN_SVG}`;

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
    id: 'chef',
    tier: 'admin',
    label: 'Chef',
    imageUrl: CHEF_CROWN_DATA_URI,
    gradient: 'linear-gradient(135deg, #1a0f06 0%, #78350f 30%, #b45309 60%, #fcd34d 100%)'
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
