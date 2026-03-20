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
  readRoles: AppRole[] | 'all';
  postRoles: AppRole[] | 'all';
};

export const FORUM_CATEGORY_RULES: ForumCategoryRule[] = [
  {
    id: 'updates',
    readRoles: 'all',
    postRoles: [AppRole.ADMIN]
  },
  {
    id: 'wuensche',
    readRoles: 'all',
    postRoles: 'all'
  },
  {
    id: 'fragen',
    readRoles: 'all',
    postRoles: 'all'
  },
  {
    id: 'ausbilder',
    readRoles: [AppRole.ADMIN, AppRole.AUSBILDER],
    postRoles: [AppRole.ADMIN, AppRole.AUSBILDER]
  },
  {
    id: 'azubi',
    readRoles: 'all',
    postRoles: 'all'
  },
  {
    id: 'nuetzliches',
    readRoles: 'all',
    postRoles: 'all'
  }
];
