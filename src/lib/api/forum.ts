import { secureForumApi } from '../secureApi';

type BackendRole = 'ADMIN' | 'AUSBILDER' | 'AZUBI' | 'RETTUNGSSCHWIMMER_AZUBI' | string;

export type ForumCustomCategory = {
  slug: string;
  customId: string;
  name: string;
  icon: string;
  colorKey: string;
  description: string;
  order: number;
  canDelete: boolean;
  count: number;
  createdBy: { id: string; displayName: string } | null;
  createdAt: string | null;
};

export type ForumPost = {
  id: string;
  category: string;
  title: string;
  content: string;
  pinned: boolean;
  locked: boolean;
  user_id: string | null;
  user_name: string;
  user_role: string;
  reply_count: number;
  created_at: string | null;
  last_reply_at: string | null;
};

export type ForumReply = {
  id: string;
  post_id: string | null;
  content: string;
  user_id: string | null;
  user_name: string;
  user_role: string;
  created_at: string | null;
};

const mapBackendRole = (role: BackendRole | undefined | null): string => {
  const normalized = String(role || '').toUpperCase();
  if (normalized === 'ADMIN') return 'admin';
  if (normalized === 'AUSBILDER') return 'trainer';
  if (normalized === 'RETTUNGSSCHWIMMER_AZUBI') return 'rettungsschwimmer_azubi';
  return 'azubi';
};

const mapPost = (post: any): ForumPost => ({
  id: post?.id,
  category: post?.category,
  title: post?.title,
  content: post?.content,
  pinned: Boolean(post?.pinned),
  locked: Boolean(post?.locked),
  user_id: post?.userId || post?.user_id || null,
  user_name: post?.user?.displayName || post?.user_name || '',
  user_role: post?.user ? mapBackendRole(post.user.role) : mapBackendRole(post?.user_role),
  reply_count: post?.replyCount ?? post?.reply_count ?? 0,
  created_at: post?.createdAt || post?.created_at || null,
  last_reply_at: post?.lastReplyAt || post?.last_reply_at || null
});

const mapReply = (reply: any): ForumReply => ({
  id: reply?.id,
  post_id: reply?.postId || reply?.post_id || null,
  content: reply?.content,
  user_id: reply?.userId || reply?.user_id || null,
  user_name: reply?.user?.displayName || reply?.user_name || '',
  user_role: reply?.user ? mapBackendRole(reply.user.role) : mapBackendRole(reply?.user_role),
  created_at: reply?.createdAt || reply?.created_at || null
});

const mapCustomCategory = (entry: any): ForumCustomCategory | null => {
  if (!entry?.custom || !entry?.customId) return null;
  return {
    slug: entry.slug || entry.category,
    customId: entry.customId,
    name: entry.name || entry.slug || '',
    icon: entry.icon || '💬',
    colorKey: entry.colorKey || 'slate',
    description: entry.description || '',
    order: Number(entry.order ?? 100),
    canDelete: Boolean(entry.canDelete),
    count: Number(entry.count ?? 0),
    createdBy: entry.createdBy
      ? { id: entry.createdBy.id, displayName: entry.createdBy.displayName }
      : null,
    createdAt: entry.createdAt || null
  };
};

export const loadForumCategoryData = async (): Promise<{
  counts: Record<string, number>;
  customCategories: ForumCustomCategory[];
}> => {
  const data = (await secureForumApi.listCategories()) as any[];
  const counts: Record<string, number> = {};
  const customCategories: ForumCustomCategory[] = [];
  (data || []).forEach((entry) => {
    const slug = entry?.slug || entry?.category;
    if (slug) {
      counts[slug] = Number(entry?.count ?? 0);
    }
    const custom = mapCustomCategory(entry);
    if (custom) customCategories.push(custom);
  });
  return { counts, customCategories };
};

export const createForumCategory = async (payload: {
  slug: string;
  name: string;
  icon: string;
  colorKey?: string;
  description?: string;
}): Promise<ForumCustomCategory | null> => {
  const result = await secureForumApi.createCategory(payload);
  return mapCustomCategory(result);
};

export const deleteForumCategory = async (customId: string): Promise<{ id: string; slug?: string }> => {
  return secureForumApi.removeCategory(customId) as Promise<{ id: string; slug?: string }>;
};

export const loadForumPosts = async (categoryId: string): Promise<ForumPost[]> => {
  const data = await secureForumApi.listPosts({ category: categoryId });
  return ((data as any[]) || []).map(mapPost);
};

export const loadForumThread = async (postId: string): Promise<{ post: ForumPost | null; replies: ForumReply[] }> => {
  const data = (await secureForumApi.getThread(postId)) as any;
  return {
    post: data?.post ? mapPost(data.post) : null,
    replies: (data?.replies || []).map(mapReply)
  };
};

export const createForumPost = async (payload: { category: string; title: string; content: string }): Promise<ForumPost> => {
  const result = (await secureForumApi.createPost(payload)) as any;
  return mapPost(result?.post || result);
};

export const createForumReply = async (postId: string, payload: { content: string }): Promise<ForumReply> => {
  const result = (await secureForumApi.createReply(postId, payload)) as any;
  return mapReply(result?.reply || result);
};

export const deleteForumPost = (postId: string) => secureForumApi.removePost(postId);
export const deleteForumReply = (replyId: string) => secureForumApi.removeReply(replyId);
export const toggleForumPostPin = (postId: string) => secureForumApi.togglePin(postId);
export const toggleForumPostLock = (postId: string) => secureForumApi.toggleLock(postId);
