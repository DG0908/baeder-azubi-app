import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Send, ArrowLeft, Pin, Lock, Trash2, ChevronRight, Clock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

import {
  loadForumCategoryCounts as dsLoadForumCategoryCounts,
  loadForumPosts as dsLoadForumPosts,
  loadForumThread as dsLoadForumThread,
  createForumPost as dsCreateForumPost,
  createForumReply as dsCreateForumReply,
  deleteForumPost as dsDeleteForumPost,
  deleteForumReply as dsDeleteForumReply,
  toggleForumPostPin as dsToggleForumPostPin,
  toggleForumPostLock as dsToggleForumPostLock
} from '../../lib/dataService';

interface ForumCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  canPost: string[];
  canRead: string[];
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  user_name: string;
  user_role: string;
  user_avatar?: string | null;
  category: string;
  pinned?: boolean;
  locked?: boolean;
  reply_count?: number;
  created_at: string;
}

interface ForumReply {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_role: string;
  created_at: string;
}

const FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'updates', label: 'Aktualisierungen', icon: '📢', color: 'bg-blue-500', description: 'Neuigkeiten zur App', canPost: ['admin'], canRead: ['all'] },
  { id: 'wuensche', label: 'Wünsche & Anregungen', icon: '💡', color: 'bg-amber-500', description: 'Feedback und Ideen', canPost: ['all'], canRead: ['all'] },
  { id: 'fragen', label: 'Fragen', icon: '❓', color: 'bg-orange-500', description: 'Fragen stellen und beantworten', canPost: ['all'], canRead: ['all'] },
  { id: 'ausbilder', label: 'Ausbilderaustausch', icon: '🎓', color: 'bg-purple-500', description: 'Nur für Ausbilder & Admins', canPost: ['trainer', 'admin'], canRead: ['trainer', 'admin'] },
  { id: 'azubi', label: 'Azubiaustausch', icon: '🏊', color: 'bg-cyan-500', description: 'Azubis & Ausbilder', canPost: ['all'], canRead: ['all'] },
  { id: 'nuetzliches', label: 'Interessantes & Nützliches', icon: '⭐', color: 'bg-emerald-500', description: 'Tipps, Links, Wissenswertes', canPost: ['all'], canRead: ['all'] },
];

const ForumView: React.FC = () => {
  const auth = useAuth();
  const app = useApp();
  const user = auth?.user;
  const darkMode = app?.darkMode;
  const showToast = app?.showToast;

  const [view, setView] = useState<'categories' | 'list' | 'thread' | 'new'>('categories');
  const [activeCategory, setActiveCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

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

  const visibleCategories = FORUM_CATEGORIES.filter(canReadCategory);

  const loadCounts = async () => {
    try {
      setCategoryCounts(await (dsLoadForumCategoryCounts as () => Promise<Record<string, number>>)());
    } catch (error) {
      console.error('Forum counts error:', error);
    }
  };

  useEffect(() => {
    loadCounts();
  }, [view]);

  const loadPosts = async (categoryId: string) => {
    setLoading(true);
    try {
      setPosts(await (dsLoadForumPosts as (id: string) => Promise<ForumPost[]>)(categoryId));
    } catch (error: unknown) {
      showToast?.('Fehler beim Laden: ' + (error as Error).message, 'error');
    }
    setLoading(false);
  };

  const loadReplies = async (postId: string) => {
    setLoading(true);
    try {
      const thread = await (dsLoadForumThread as (id: string) => Promise<{ post?: ForumPost; replies?: ForumReply[] }>)(postId);
      setReplies(thread?.replies || []);
      if (thread?.post) {
        setActivePost(thread.post);
      }
    } catch (error) {
      console.error('Forum replies error:', error);
    }
    setLoading(false);
  };

  const openCategory = (cat: ForumCategory) => {
    setActiveCategory(cat);
    loadPosts(cat.id);
    setView('list');
  };

  const openThread = (post: ForumPost) => {
    setActivePost(post);
    loadReplies(post.id);
    setView('thread');
  };

  const createPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      showToast?.('Titel und Inhalt sind Pflichtfelder!', 'error');
      return;
    }
    try {
      await (dsCreateForumPost as (data: Record<string, unknown>) => Promise<unknown>)({
        userId: user!.id,
        userName: user!.name,
        userRole: user!.role,
        userAvatar: (user as Record<string, unknown>)?.avatar,
        category: activeCategory!.id,
        title: newTitle.trim(),
        content: newContent.trim()
      });
      showToast?.('Beitrag erstellt!', 'success');
      setNewTitle('');
      setNewContent('');
      setView('list');
      loadCounts();
      loadPosts(activeCategory!.id);
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
      await (dsCreateForumReply as (postId: string, data: Record<string, unknown>) => Promise<unknown>)(activePost!.id, {
        userId: user!.id,
        userName: user!.name,
        userRole: user!.role,
        userAvatar: (user as Record<string, unknown>)?.avatar,
        content: replyContent.trim()
      });
      setReplyContent('');
      loadReplies(activePost!.id);
      setActivePost(prev => prev ? { ...prev, reply_count: (prev.reply_count || 0) + 1 } : prev);
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Beitrag wirklich löschen? Alle Antworten werden ebenfalls gelöscht.')) return;
    try {
      await (dsDeleteForumPost as (id: string) => Promise<unknown>)(postId);
      showToast?.('Beitrag gelöscht', 'success');
      loadCounts();
      if (view === 'thread') {
        setView('list');
        loadPosts(activeCategory!.id);
      } else {
        loadPosts(activeCategory!.id);
      }
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const deleteReply = async (replyId: string) => {
    if (!confirm('Antwort löschen?')) return;
    try {
      await (dsDeleteForumReply as (id: string) => Promise<unknown>)(replyId);
      showToast?.('Antwort gelöscht', 'success');
      loadReplies(activePost!.id);
      setActivePost(prev => prev ? { ...prev, reply_count: Math.max((prev.reply_count || 1) - 1, 0) } : prev);
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const togglePin = async (postId: string, currentPinned?: boolean) => {
    try {
      await (dsToggleForumPostPin as (id: string, pinned: boolean | undefined) => Promise<unknown>)(postId, currentPinned);
      loadPosts(activeCategory!.id);
    } catch (error: unknown) {
      showToast?.('Fehler: ' + (error as Error).message, 'error');
    }
  };

  const toggleLock = async (postId: string, currentLocked?: boolean) => {
    try {
      await (dsToggleForumPostLock as (id: string, locked: boolean | undefined) => Promise<unknown>)(postId, currentLocked);
      if (view === 'thread') {
        setActivePost(prev => prev ? { ...prev, locked: !currentLocked } : prev);
      }
      loadPosts(activeCategory!.id);
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
      case 'admin': return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-purple-200 text-purple-800">Admin</span>;
      case 'trainer': return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-200 text-blue-800">Ausbilder</span>;
      default: return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-green-200 text-green-800">Azubi</span>;
    }
  };

  const canDelete = (itemUserId: string): boolean => {
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
          {visibleCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => openCategory(cat)}
              className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'} rounded-xl p-5 shadow-md text-left transition-all flex items-center justify-between group`}
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
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {categoryCounts[cat.id]}
                  </span>
                )}
                <ChevronRight className={`${darkMode ? 'text-gray-600' : 'text-gray-400'} group-hover:translate-x-1 transition-transform`} size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── POST LIST VIEW ───
  if (view === 'list') {
    return (
      <div className="space-y-4">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('categories')}
              className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
            >
              <ArrowLeft size={20} />
              Zurück
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeCategory?.icon}</span>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeCategory?.label}</h3>
            </div>
            {activeCategory && canPostInCategory(activeCategory) && (
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
            {activeCategory && canPostInCategory(activeCategory) && (
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
            {posts.map(post => (
              <button
                key={post.id}
                onClick={() => openThread(post)}
                className={`w-full text-left ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 shadow-sm transition-all`}
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
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 ml-3">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <MessageSquare size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{post.reply_count || 0}</span>
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
  if (view === 'new') {
    return (
      <div className="space-y-4">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md`}>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
          >
            <ArrowLeft size={20} />
            Zurück zu {activeCategory?.label}
          </button>
        </div>

        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-md space-y-4`}>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Neues Thema in „{activeCategory?.label}"
          </h3>

          <input
            type="text"
            placeholder="Titel"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />

          <textarea
            placeholder="Was möchtest du teilen?"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={6}
            className={`w-full px-4 py-3 rounded-lg border resize-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />

          <div className="flex gap-3">
            <button
              onClick={createPost}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-colors"
            >
              <Send size={18} />
              Beitrag erstellen
            </button>
            <button
              onClick={() => { setView('list'); setNewTitle(''); setNewContent(''); }}
              className={`px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── THREAD VIEW ───
  if (view === 'thread' && activePost) {
    return (
      <div className="space-y-4">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md`}>
          <button
            onClick={() => { setView('list'); loadPosts(activeCategory!.id); }}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
          >
            <ArrowLeft size={20} />
            Zurück zu {activeCategory?.label}
          </button>
        </div>

        {/* Original Post */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
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
                <span>{formatDate(activePost.created_at)}</span>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-1">
                <button
                  onClick={() => togglePin(activePost.id, activePost.pinned)}
                  className={`p-2 rounded-lg ${activePost.pinned ? 'bg-amber-100 text-amber-600' : darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'} hover:opacity-80`}
                  title={activePost.pinned ? 'Loslösen' : 'Anheften'}
                >
                  <Pin size={16} />
                </button>
                <button
                  onClick={() => toggleLock(activePost.id, activePost.locked)}
                  className={`p-2 rounded-lg ${activePost.locked ? 'bg-red-100 text-red-600' : darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'} hover:opacity-80`}
                  title={activePost.locked ? 'Entsperren' : 'Sperren'}
                >
                  <Lock size={16} />
                </button>
                <button
                  onClick={() => deletePost(activePost.id)}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-red-400' : 'bg-red-50 text-red-500'} hover:opacity-80`}
                  title="Beitrag löschen"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {!isAdmin && canDelete(activePost.user_id) && (
              <button
                onClick={() => deletePost(activePost.id)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-red-400' : 'bg-red-50 text-red-500'} hover:opacity-80`}
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
            {replies.map(reply => (
              <div key={reply.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-medium">{reply.user_name}</span>
                    {getRoleBadge(reply.user_role)}
                    <span>{formatDate(reply.created_at)}</span>
                  </div>
                  {canDelete(reply.user_id) && (
                    <button
                      onClick={() => deleteReply(reply.id)}
                      className={`p-1 rounded ${darkMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-400 hover:bg-red-50'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {reply.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply input */}
        {!activePost.locked ? (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md`}>
            <div className="flex gap-2">
              <textarea
                placeholder="Antwort schreiben..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className={`flex-1 px-4 py-2 rounded-lg border resize-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
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
