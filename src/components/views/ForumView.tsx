import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Plus, Send, ArrowLeft, Pin, Lock, Trash2, ChevronRight, Clock, User, X, FolderPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

import {
  loadForumCategoryData,
  createForumCategory,
  deleteForumCategory,
  loadForumPosts,
  loadForumThread,
  createForumPost,
  createForumReply,
  deleteForumPost,
  deleteForumReply,
  toggleForumPostPin,
  toggleForumPostLock,
  type ForumCustomCategory,
  type ForumPost,
  type ForumReply
} from '../../lib/api/forum';

interface ForumCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  canPost: string[];
  canRead: string[];
}

const FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'updates', label: 'Aktualisierungen', icon: '📢', color: 'bg-blue-500', description: 'Neuigkeiten zur App', canPost: ['admin'], canRead: ['all'] },
  { id: 'wuensche', label: 'Wünsche & Anregungen', icon: '💡', color: 'bg-amber-500', description: 'Feedback und Ideen', canPost: ['all'], canRead: ['all'] },
  { id: 'fragen', label: 'Fragen', icon: '❓', color: 'bg-orange-500', description: 'Fragen stellen und beantworten', canPost: ['all'], canRead: ['all'] },
  { id: 'ausbilder', label: 'Ausbilderaustausch', icon: '🎓', color: 'bg-purple-500', description: 'Nur für Ausbilder & Admins', canPost: ['trainer', 'admin'], canRead: ['trainer', 'admin'] },
  { id: 'azubi', label: 'Azubiaustausch', icon: '🏊', color: 'bg-cyan-500', description: 'Azubis & Ausbilder', canPost: ['all'], canRead: ['all'] },
  { id: 'nuetzliches', label: 'Interessantes & Nützliches', icon: '⭐', color: 'bg-emerald-500', description: 'Tipps, Links, Wissenswertes', canPost: ['all'], canRead: ['all'] },
];

const CUSTOM_COLOR_CLASSES: Record<string, string> = {
  slate: 'bg-slate-500',
  blue: 'bg-blue-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  orange: 'bg-orange-500',
  rose: 'bg-rose-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500'
};

const CUSTOM_COLOR_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'slate', label: 'Grau' },
  { key: 'blue', label: 'Blau' },
  { key: 'cyan', label: 'Cyan' },
  { key: 'teal', label: 'Türkis' },
  { key: 'emerald', label: 'Smaragd' },
  { key: 'amber', label: 'Bernstein' },
  { key: 'orange', label: 'Orange' },
  { key: 'rose', label: 'Rosé' },
  { key: 'pink', label: 'Pink' },
  { key: 'purple', label: 'Violett' },
  { key: 'indigo', label: 'Indigo' },
  { key: 'violet', label: 'Veilchen' }
];

const customColorClass = (key: string) => CUSTOM_COLOR_CLASSES[key] || CUSTOM_COLOR_CLASSES.slate;

type CustomCategoryEntry = ForumCustomCategory & { kind: 'custom' };
type BuiltinCategoryEntry = ForumCategory & { kind: 'builtin' };
type CategoryEntry = BuiltinCategoryEntry | CustomCategoryEntry;

const ForumView: React.FC = () => {
  const auth = useAuth();
  const app = useApp();
  const user = auth?.user;
  const darkMode = app?.darkMode;
  const showToast = app?.showToast;

  const [view, setView] = useState<'categories' | 'list' | 'thread' | 'new'>('categories');
  const [activeCategory, setActiveCategory] = useState<CategoryEntry | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [customCategories, setCustomCategories] = useState<ForumCustomCategory[]>([]);

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    slug: '',
    name: '',
    icon: '💬',
    colorKey: 'indigo',
    description: ''
  });
  const [creatingCategory, setCreatingCategory] = useState(false);

  const userRole = user?.role || 'azubi';
  const isAdmin = userRole === 'admin' || !!(user as Record<string, unknown>)?.isOwner;

  const canReadCategory = (cat: ForumCategory): boolean => {
    if (isAdmin) return true;
    if (cat.canRead.includes('all')) return true;
    return cat.canRead.includes(userRole);
  };

  const canPostInCategory = (cat: ForumCategory): boolean => {
    if (isAdmin) return true;
    if (cat.canPost.includes('all')) return true;
    return cat.canPost.includes(userRole);
  };

  const visibleBuiltIns = FORUM_CATEGORIES.filter(canReadCategory);

  const loadCategoryData = useCallback(async () => {
    try {
      const { counts, customCategories: customs } = await loadForumCategoryData();
      setCategoryCounts(counts);
      setCustomCategories(customs);
    } catch (error) {
      console.error('Forum categories error:', error);
    }
  }, []);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData, view]);

  const loadPostsForCategory = async (slug: string) => {
    setLoading(true);
    try {
      setPosts(await loadForumPosts(slug));
    } catch (error: unknown) {
      showToast?.('Fehler beim Laden: ' + (error as Error).message, 'error');
    }
    setLoading(false);
  };

  const loadReplies = async (postId: string) => {
    setLoading(true);
    try {
      const thread = await loadForumThread(postId);
      setReplies(thread?.replies || []);
      if (thread?.post) {
        setActivePost(thread.post);
      }
    } catch (error) {
      console.error('Forum replies error:', error);
    }
    setLoading(false);
  };

  const activeSlug = (cat: CategoryEntry) => (cat.kind === 'custom' ? cat.slug : cat.id);
  const activeLabel = (cat: CategoryEntry) => (cat.kind === 'custom' ? cat.name : cat.label);
  const activeIcon = (cat: CategoryEntry) => cat.icon;
  const activeCanPost = (cat: CategoryEntry) =>
    cat.kind === 'custom' ? true : canPostInCategory(cat);

  const openBuiltIn = (cat: ForumCategory) => {
    setActiveCategory({ ...cat, kind: 'builtin' });
    loadPostsForCategory(cat.id);
    setView('list');
  };

  const openCustom = (cat: ForumCustomCategory) => {
    setActiveCategory({ ...cat, kind: 'custom' });
    loadPostsForCategory(cat.slug);
    setView('list');
  };

  const openThread = (post: ForumPost) => {
    setActivePost(post);
    loadReplies(post.id);
    setView('thread');
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      showToast?.('Titel und Inhalt sind Pflichtfelder!', 'error');
      return;
    }
    if (!activeCategory) return;
    const slug = activeSlug(activeCategory);
    try {
      await createForumPost({ category: slug, title: newTitle.trim(), content: newContent.trim() });
      showToast?.('Beitrag erstellt!', 'success');
      setNewTitle('');
      setNewContent('');
      setView('list');
      loadCategoryData();
      loadPostsForCategory(slug);
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const sendReply = async () => {
    if (!replyContent.trim()) return;
    if (activePost?.locked) {
      showToast?.('Dieses Thema ist geschlossen.', 'error');
      return;
    }
    try {
      await createForumReply(activePost!.id, { content: replyContent.trim() });
      setReplyContent('');
      loadReplies(activePost!.id);
      setActivePost((prev) => (prev ? { ...prev, reply_count: (prev.reply_count || 0) + 1 } : prev));
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Beitrag wirklich löschen? Alle Antworten werden ebenfalls gelöscht.')) return;
    try {
      await deleteForumPost(postId);
      showToast?.('Beitrag gelöscht', 'success');
      loadCategoryData();
      if (view === 'thread') {
        setView('list');
      }
      if (activeCategory) {
        loadPostsForCategory(activeSlug(activeCategory));
      }
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Antwort löschen?')) return;
    try {
      await deleteForumReply(replyId);
      showToast?.('Antwort gelöscht', 'success');
      loadReplies(activePost!.id);
      setActivePost((prev) =>
        prev ? { ...prev, reply_count: Math.max((prev.reply_count || 1) - 1, 0) } : prev
      );
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const togglePin = async (postId: string) => {
    try {
      await toggleForumPostPin(postId);
      if (activeCategory) loadPostsForCategory(activeSlug(activeCategory));
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const toggleLock = async (postId: string, currentLocked?: boolean) => {
    try {
      await toggleForumPostLock(postId);
      if (view === 'thread') {
        setActivePost((prev) => (prev ? { ...prev, locked: !currentLocked } : prev));
      }
      if (activeCategory) loadPostsForCategory(activeSlug(activeCategory));
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ slug: '', name: '', icon: '💬', colorKey: 'indigo', description: '' });
    setShowCreateCategory(false);
  };

  const submitCategory = async () => {
    const slug = categoryForm.slug.trim().toLowerCase();
    const name = categoryForm.name.trim();
    const icon = categoryForm.icon.trim();
    if (!slug || !name || !icon) {
      showToast?.('Slug, Name und Icon sind Pflichtfelder.', 'error');
      return;
    }
    if (!/^[a-z0-9-]{2,32}$/.test(slug)) {
      showToast?.('Slug nur aus a-z, 0-9 und Bindestrich (2–32 Zeichen).', 'error');
      return;
    }
    setCreatingCategory(true);
    try {
      await createForumCategory({
        slug,
        name,
        icon,
        colorKey: categoryForm.colorKey,
        description: categoryForm.description.trim() || undefined
      });
      showToast?.('Kategorie angelegt.', 'success');
      resetCategoryForm();
      loadCategoryData();
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat: ForumCustomCategory) => {
    if (!confirm(`Kategorie „${cat.name}" löschen?`)) return;
    try {
      await deleteForumCategory(cat.customId);
      showToast?.('Kategorie gelöscht.', 'success');
      loadCategoryData();
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Gerade eben';
    if (diffMin < 60) return `vor ${diffMin} Min.`;
    if (diffH < 24) return `vor ${diffH} Std.`;
    if (diffD < 7) return `vor ${diffD} Tagen`;
    return d.toLocaleDateString('de-DE');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-purple-200 text-purple-800">Admin</span>;
      case 'trainer':
        return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-200 text-blue-800">Ausbilder</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-green-200 text-green-800">Azubi</span>;
    }
  };

  const canDeleteItem = (itemUserId: string): boolean => {
    return user!.id === itemUserId || !!isAdmin;
  };

  // ─── CATEGORIES VIEW ───
  if (view === 'categories') {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">💬 Forum</h2>
          <p className="opacity-90">Austausch, Ideen & Neuigkeiten</p>
        </div>

        <div className="grid gap-3">
          {visibleBuiltIns.map((cat) => (
            <button
              key={cat.id}
              onClick={() => openBuiltIn(cat)}
              className="glass-card glass-card-hover rounded-2xl p-5 text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{cat.label}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {categoryCounts[cat.id] > 0 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${darkMode ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                    {categoryCounts[cat.id]}
                  </span>
                )}
                <ChevronRight className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:translate-x-1 transition-transform`} size={20} />
              </div>
            </button>
          ))}

          {customCategories.map((cat) => (
            <div
              key={cat.customId}
              className="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between group"
            >
              <button onClick={() => openCustom(cat)} className="flex items-center gap-4 flex-1 text-left">
                <div className={`w-12 h-12 ${customColorClass(cat.colorKey)} rounded-xl flex items-center justify-center text-2xl`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{cat.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cat.description || 'Eigene Kategorie'}</p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                {cat.count > 0 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${darkMode ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                    {cat.count}
                  </span>
                )}
                {cat.canDelete && (
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className={`p-2 rounded-lg ${darkMode ? 'bg-white/10 text-red-400 hover:bg-white/15' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                    title="Kategorie löschen"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => openCustom(cat)}
                  className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:translate-x-1 transition-transform`}
                  title="Öffnen"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowCreateCategory(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-white/10 hover:bg-white/15 text-gray-200' : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'}`}
            >
              <FolderPlus size={16} />
              Neue Kategorie anlegen
            </button>
          </div>
        )}

        {showCreateCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className={`w-full max-w-md rounded-2xl p-6 space-y-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Neue Kategorie</h3>
                <button onClick={resetCategoryForm} className="p-1 rounded hover:bg-white/10">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Slug (URL-Teil)</label>
                  <input
                    type="text"
                    placeholder="z.B. bundesland-nrw"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300'}`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    a–z, 0–9 und Bindestrich, 2–32 Zeichen.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Icon</label>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, icon: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border text-sm text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Farbe</label>
                    <select
                      value={categoryForm.colorKey}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, colorKey: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300'}`}
                    >
                      {CUSTOM_COLOR_OPTIONS.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium">Vorschau:</span>
                  <div className={`w-10 h-10 ${customColorClass(categoryForm.colorKey)} rounded-xl flex items-center justify-center text-xl`}>
                    {categoryForm.icon || '💬'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Beschreibung (optional)</label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={resetCategoryForm}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Abbrechen
                </button>
                <button
                  onClick={submitCategory}
                  disabled={creatingCategory}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white"
                >
                  {creatingCategory ? 'Speichert…' : 'Anlegen'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── POST LIST VIEW ───
  if (view === 'list' && activeCategory) {
    return (
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('categories')}
              className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
            >
              <ArrowLeft size={20} />
              Zurück
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeIcon(activeCategory)}</span>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeLabel(activeCategory)}</h3>
            </div>
            {activeCanPost(activeCategory) && (
              <button
                onClick={() => setView('new')}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium"
              >
                <Plus size={16} /> Neues Thema
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lade Beiträge...</div>
        ) : posts.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
            <p>Noch keine Beiträge in dieser Kategorie.</p>
            {activeCanPost(activeCategory) && (
              <button
                onClick={() => setView('new')}
                className="mt-3 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium"
              >
                Ersten Beitrag erstellen
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => openThread(post)}
                className="w-full text-left glass-card glass-card-hover rounded-2xl p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {post.pinned && <Pin size={14} className="text-amber-500" />}
                      {post.locked && <Lock size={14} className="text-red-400" />}
                      <h4 className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{post.title}</h4>
                    </div>
                    <p className={`text-sm truncate mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {post.content}
                    </p>
                    <div className={`flex items-center gap-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {post.user_name}
                      </span>
                      {getRoleBadge(post.user_role)}
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(post.created_at || '')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 ml-3">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <MessageSquare size={14} className={darkMode ? 'text-gray-300' : 'text-gray-500'} />
                      <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>{post.reply_count || 0}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── NEW POST VIEW ───
  if (view === 'new' && activeCategory) {
    return (
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-4">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
          >
            <ArrowLeft size={20} />
            Zurück zu {activeLabel(activeCategory)}
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Neues Thema in „{activeLabel(activeCategory)}"
          </h3>

          <input
            type="text"
            placeholder="Titel"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />

          <textarea
            placeholder="Was möchtest du teilen?"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={6}
            className={`w-full px-4 py-3 rounded-lg border resize-none ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />

          <div className="flex gap-3">
            <button
              onClick={handleCreatePost}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-colors"
            >
              <Send size={18} />
              Beitrag erstellen
            </button>
            <button
              onClick={() => { setView('list'); setNewTitle(''); setNewContent(''); }}
              className={`px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-white/10 hover:bg-white/15 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── THREAD VIEW ───
  if (view === 'thread' && activePost && activeCategory) {
    return (
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-4">
          <button
            onClick={() => { setView('list'); loadPostsForCategory(activeSlug(activeCategory)); }}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
          >
            <ArrowLeft size={20} />
            Zurück zu {activeLabel(activeCategory)}
          </button>
        </div>

        {/* Original Post */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {activePost.pinned && <Pin size={14} className="text-amber-500" />}
                {activePost.locked && <Lock size={14} className="text-red-400" />}
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activePost.title}</h3>
              </div>
              <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>{activePost.user_name}</span>
                {getRoleBadge(activePost.user_role)}
                <span>{formatDate(activePost.created_at || '')}</span>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-1">
                <button
                  onClick={() => togglePin(activePost.id)}
                  className={`p-2 rounded-lg ${activePost.pinned ? 'bg-amber-100 text-amber-600' : darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-500'} hover:opacity-80`}
                  title={activePost.pinned ? 'Loslösen' : 'Anheften'}
                >
                  <Pin size={16} />
                </button>
                <button
                  onClick={() => toggleLock(activePost.id, activePost.locked)}
                  className={`p-2 rounded-lg ${activePost.locked ? 'bg-red-100 text-red-600' : darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-500'} hover:opacity-80`}
                  title={activePost.locked ? 'Entsperren' : 'Sperren'}
                >
                  <Lock size={16} />
                </button>
                <button
                  onClick={() => handleDeletePost(activePost.id)}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-white/10 text-red-400' : 'bg-red-50 text-red-500'} hover:opacity-80`}
                  title="Beitrag löschen"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {!isAdmin && canDeleteItem(activePost.user_id || '') && (
              <button
                onClick={() => handleDeletePost(activePost.id)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-white/10 text-red-400' : 'bg-red-50 text-red-500'} hover:opacity-80`}
                title="Beitrag löschen"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className={`whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {activePost.content}
          </div>
        </div>

        {/* Replies */}
        {loading ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lade Antworten...</div>
        ) : replies.length > 0 && (
          <div className="space-y-2">
            <h4 className={`font-bold px-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {replies.length} {replies.length === 1 ? 'Antwort' : 'Antworten'}
            </h4>
            {replies.map((reply) => (
              <div key={reply.id} className="glass-card rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    <span className="font-medium">{reply.user_name}</span>
                    {getRoleBadge(reply.user_role)}
                    <span>{formatDate(reply.created_at || '')}</span>
                  </div>
                  {canDeleteItem(reply.user_id || '') && (
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className={`p-1 rounded ${darkMode ? 'text-red-400 hover:bg-white/10' : 'text-red-400 hover:bg-red-50'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className={`whitespace-pre-wrap ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {reply.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply input */}
        {!activePost.locked ? (
          <div className="glass-card rounded-2xl p-4">
            <div className="flex gap-2">
              <textarea
                placeholder="Antwort schreiben..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className={`flex-1 px-4 py-2 rounded-lg border resize-none ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
              />
              <button
                onClick={sendReply}
                disabled={!replyContent.trim()}
                className="px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white rounded-lg transition-colors self-end"
              >
                <Send size={20} />
              </button>
            </div>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Enter zum Senden, Shift+Enter für neue Zeile
            </p>
          </div>
        ) : (
          <div className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center gap-2`}>
            <Lock size={16} />
            Dieses Thema ist geschlossen.
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ForumView;
