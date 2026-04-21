import { AppRole } from '@prisma/client';

export const FORUM_CATEGORY_IDS = [
  'updates',
  'wuensche',
  'fragen',
  'ausbilder',
  'azubi',
  'nuetzliches'
] as const;

export type ForumCategoryId = (typeof FORUM_CATEGORY_IDS)[number];

type ForumCategoryRule = {
  id: ForumCategoryId;
  name: string;
  icon: string;
  colorKey: string;
  description: string;
  readRoles: AppRole[] | 'all';
  postRoles: AppRole[] | 'all';
  order: number;
};

export const FORUM_CATEGORY_RULES: ForumCategoryRule[] = [
  {
    id: 'updates',
    name: 'Aktualisierungen',
    icon: '📢',
    colorKey: 'blue',
    description: 'Neuigkeiten zur App',
    readRoles: 'all',
    postRoles: [AppRole.ADMIN],
    order: 10
  },
  {
    id: 'wuensche',
    name: 'Wünsche & Anregungen',
    icon: '💡',
    colorKey: 'amber',
    description: 'Feedback und Ideen',
    readRoles: 'all',
    postRoles: 'all',
    order: 20
  },
  {
    id: 'fragen',
    name: 'Fragen',
    icon: '❓',
    colorKey: 'orange',
    description: 'Fragen stellen und beantworten',
    readRoles: 'all',
    postRoles: 'all',
    order: 30
  },
  {
    id: 'ausbilder',
    name: 'Ausbilderaustausch',
    icon: '🎓',
    colorKey: 'purple',
    description: 'Nur für Ausbilder & Admins',
    readRoles: [AppRole.ADMIN, AppRole.AUSBILDER],
    postRoles: [AppRole.ADMIN, AppRole.AUSBILDER],
    order: 40
  },
  {
    id: 'azubi',
    name: 'Azubiaustausch',
    icon: '🏊',
    colorKey: 'cyan',
    description: 'Azubis & Ausbilder',
    readRoles: 'all',
    postRoles: 'all',
    order: 50
  },
  {
    id: 'nuetzliches',
    name: 'Interessantes & Nützliches',
    icon: '⭐',
    colorKey: 'emerald',
    description: 'Tipps, Links, Wissenswertes',
    readRoles: 'all',
    postRoles: 'all',
    order: 60
  }
];

export const isBuiltInForumCategory = (slug: string): slug is ForumCategoryId =>
  FORUM_CATEGORY_IDS.includes(slug as ForumCategoryId);
