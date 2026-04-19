// Profile banner presets: CSS-gradient backgrounds rendered behind the profile
// hero card. Keys are persisted server-side (User.profileBannerKey).
// Keep ids stable — changing them invalidates existing user selections.

export const PROFILE_BANNERS = [
  {
    id: 'cyan-classic',
    label: 'Cyan Classic',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
  },
  {
    id: 'pool-deep',
    label: 'Pool Deep',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #0f172a 100%)'
  },
  {
    id: 'sunset',
    label: 'Sonnenuntergang',
    gradient: 'linear-gradient(135deg, #f97316 0%, #db2777 60%, #7c3aed 100%)'
  },
  {
    id: 'sunrise',
    label: 'Morgenrot',
    gradient: 'linear-gradient(135deg, #fde68a 0%, #f97316 50%, #dc2626 100%)'
  },
  {
    id: 'tropic',
    label: 'Tropic',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 55%, #6366f1 100%)'
  },
  {
    id: 'lagune',
    label: 'Lagune',
    gradient: 'linear-gradient(135deg, #99f6e4 0%, #14b8a6 45%, #0369a1 100%)'
  },
  {
    id: 'aurora',
    label: 'Aurora',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #ec4899 100%)'
  },
  {
    id: 'forest',
    label: 'Wald',
    gradient: 'linear-gradient(135deg, #166534 0%, #0f766e 60%, #0c4a6e 100%)'
  },
  {
    id: 'midnight',
    label: 'Mitternacht',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)'
  },
  {
    id: 'rose-gold',
    label: 'Roségold',
    gradient: 'linear-gradient(135deg, #fecdd3 0%, #fb7185 55%, #be123c 100%)'
  }
];

export const DEFAULT_PROFILE_BANNER_ID = 'cyan-classic';

export const getProfileBannerById = (id) =>
  PROFILE_BANNERS.find((b) => b.id === id) || null;

export const getProfileBannerGradient = (id) =>
  (getProfileBannerById(id) || getProfileBannerById(DEFAULT_PROFILE_BANNER_ID)).gradient;
