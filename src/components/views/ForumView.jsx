import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Lock,
  MessageSquare,
  Pin,
  Plus,
  Send,
  Trash2,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';
import {
  isSecureBackendApiEnabled,
  mapBackendRoleToFrontendRole,
  secureForumApi
} from '../../lib/secureApi';

const FORUM_CATEGORIES = [
  {
    id: 'updates',
    label: 'Aktualisierungen',
    icon: 'UP',
    color: 'bg-blue-500',
    description: 'Neuigkeiten zur App',
    canPost: ['admin'],
    canRead: ['all']
  },
  {
    id: 'wuensche',
    label: 'Wuensche & Anregungen',
    icon: 'ID',
    color: 'bg-amber-500',
    description: 'Feedback und Ideen',
    canPost: ['all'],
    canRead: ['all']
  },
  {
    id: 'fragen',
    label: 'Fragen',
    icon: 'Q?',
    color: 'bg-orange-500',
    description: 'Fragen stellen und beantworten',
    canPost: ['all'],
    canRead: ['all']
  },
  {
    id: 'ausbilder',
    label: 'Ausbilderaustausch',
    icon: 'TR',
    color: 'bg-purple-500',
    description: 'Nur fuer Ausbilder und Admins',
    canPost: ['trainer', 'admin'],
    canRead: ['trainer', 'admin']
  },
  {
    id: 'azubi',
    label: 'Azubiaustausch',
    icon: 'AZ',
    color: 'bg-cyan-500',
    description: 'Azubis und Ausbilder',
    canPost: ['all'],
    canRead: ['all']
  },
  {
    id: 'nuetzliches',
    label: 'Interessantes & Nuetzliches',
    icon: 'IN',
    color: 'bg-emerald-500',
    description: 'Tipps, Links und Wissenswertes',
    canPost: ['all'],
    canRead: ['all']
  }
];

const getErrorMessage = (error, fallbackMessage) => (
  String(error?.message || '').trim() || fallbackMessage
);

const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toLowerCase();
  if (
    normalized === 'admin' ||
    normalized === 'trainer' ||
    normalized === 'azubi' ||
    normalized === 'rettungsschwimmer_azubi'
  ) {
    return normalized;
  }

  return mapBackendRoleToFrontendRole(role);
};

const normalizePost = (post) => ({
  id: post?.id || '',
  category: post?.category || '',
  title: post?.title || '',
  content: post?.content || '',
  pinned: Boolean(post?.pinned),
  locked: Boolean(post?.locked),
  user_id: post?.user_id || post?.userId || post?.user?.id || '',
  user_name: post?.user_name || post?.userName || post?.user?.displayName || 'Unbekannt',
  user_role: normalizeRole(post?.user_role || post?.userRole || post?.user?.role),
  created_at: post?.created_at || post?.createdAt || new Date().toISOString(),
  updated_at: post?.updated_at || post?.updatedAt || post?.created_at || post?.createdAt || new Date().toISOString(),
  last_reply_at: post?.last_reply_at || post?.lastReplyAt || null,
  reply_count: Number(post?.reply_count ?? post?.replyCount ?? post?._count?.replies ?? 0)
});

const normalizeReply = (reply) => ({
  id: reply?.id || '',
  post_id: reply?.post_id || reply?.postId || '',
  user_id: reply?.user_id || reply?.userId || reply?.user?.id || '',
  user_name: reply?.user_name || reply?.userName || reply?.user?.displayName || 'Unbekannt',
  user_role: normalizeRole(reply?.user_role || reply?.userRole || reply?.user?.role),
  content: reply?.content || '',
  created_at: reply?.created_at || reply?.createdAt || new Date().toISOString(),
  updated_at: reply?.updated_at || reply?.updatedAt || reply?.created_at || reply?.createdAt || new Date().toISOString()
});

const ForumView = () => {
  const { user } = useAuth();
  const { darkMode, showToast } = useApp();

  const [view, setView] = useState('categories');
  const [activeCategory, setActiveCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [categoryCounts, setCategoryCounts] = useState({});

  const secureMode = isSecureBackendApiEnabled();
  const userRole = user?.role || 'azubi';
  const isAdmin = userRole === 'admin' || user?.isOwner;

  const canReadCategory = (category) => {
    if (isAdmin) return true;
    if (category.canRead.includes('all')) return true;
    return category.canRead.includes(userRole);
  };

  const canPostInCategory = (category) => {
    if (isAdmin) return true;
    if (category.canPost.includes('all')) return true;
    return category.canPost.includes(userRole);
  };

  const canDeletePost = (post) => (
    isAdmin || (user?.id === post?.user_id && Number(post?.reply_count || 0) === 0)
  );

  const canDeleteReply = (itemUserId) => user?.id === itemUserId || isAdmin;
  const visibleCategories = FORUM_CATEGORIES.filter(canReadCategory);
  const canReplyInActiveCategory = activeCategory ? canPostInCategory(activeCategory) : false;

  const loadCategoryCounts = async () => {
    if (!user?.id) {
      setCategoryCounts({});
      return;
    }

    try {
      if (secureMode) {
        const counts = await secureForumApi.listCategories();
        const nextCounts = {};
        (counts || []).forEach((entry) => {
          nextCounts[entry.category] = Number(entry.count || 0);
        });
        setCategoryCounts(nextCounts);
        return;
      }

      const { data, error } = await supabase
        .from('forum_posts')
        .select('category');

      if (error) {
        throw error;
      }

      const nextCounts = {};
      (data || []).forEach((entry) => {
        nextCounts[entry.category] = (nextCounts[entry.category] || 0) + 1;
      });
      setCategoryCounts(nextCounts);
    } catch (error) {
      showToast(getErrorMessage(error, 'Forum-Kategorien konnten nicht geladen werden.'), 'error');
    }
  };

  const loadPosts = async (categoryId) => {
    setLoading(true);
    try {
      if (secureMode) {
        const data = await secureForumApi.listPosts({ category: categoryId });
        setPosts((data || []).map(normalizePost));
      } else {
        const { data, error } = await supabase
          .from('forum_posts')
          .select('*')
          .eq('category', categoryId)
          .order('pinned', { ascending: false })
          .order('last_reply_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setPosts((data || []).map(normalizePost));
      }
    } catch (error) {
      setPosts([]);
      showToast(getErrorMessage(error, 'Fehler beim Laden der Beitraege.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async (postId) => {
    setLoading(true);
    try {
      if (secureMode) {
        const thread = await secureForumApi.getThread(postId);
        setActivePost(normalizePost(thread?.post));
        setReplies((thread?.replies || []).map(normalizeReply));
      } else {
        const { data, error } = await supabase
          .from('forum_replies')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        setReplies((data || []).map(normalizeReply));
      }
    } catch (error) {
      showToast(getErrorMessage(error, 'Fehler beim Laden des Themas.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryCounts();
  }, [user?.id, secureMode]);

  const openCategory = (category) => {
    setActiveCategory(category);
    setActivePost(null);
    setReplies([]);
    loadPosts(category.id);
    setView('list');
  };

  const openThread = (post) => {
    setActivePost(post);
    setReplies([]);
    loadThread(post.id);
    setView('thread');
  };

  const createPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Titel und Inhalt sind Pflichtfelder.', 'error');
      return;
    }

    try {
      if (secureMode) {
        await secureForumApi.createPost({
          category: activeCategory.id,
          title: newTitle.trim(),
          content: newContent.trim()
        });
      } else {
        const { error } = await supabase.from('forum_posts').insert({
          user_id: user.id,
          user_name: user.name,
          user_role: user.role,
          user_avatar: user.avatar,
          category: activeCategory.id,
          title: newTitle.trim(),
          content: newContent.trim()
        });

        if (error) {
          throw error;
        }
      }

      showToast('Beitrag erstellt.', 'success');
      setNewTitle('');
      setNewContent('');
      setView('list');
      await loadPosts(activeCategory.id);
      await loadCategoryCounts();
    } catch (error) {
      showToast(getErrorMessage(error, 'Beitrag konnte nicht erstellt werden.'), 'error');
    }
  };

  const sendReply = async () => {
    if (!replyContent.trim()) {
      return;
    }

    if (!canReplyInActiveCategory) {
      showToast('In dieser Kategorie darfst du nicht antworten.', 'error');
      return;
    }

    if (activePost?.locked) {
      showToast('Dieses Thema ist geschlossen.', 'error');
      return;
    }

    try {
      if (secureMode) {
        const thread = await secureForumApi.createReply(activePost.id, {
          content: replyContent.trim()
        });
        setActivePost(normalizePost(thread?.post));
        setReplies((thread?.replies || []).map(normalizeReply));
        await loadPosts(activeCategory.id);
      } else {
        const { error } = await supabase.from('forum_replies').insert({
          post_id: activePost.id,
          user_id: user.id,
          user_name: user.name,
          user_role: user.role,
          user_avatar: user.avatar,
          content: replyContent.trim()
        });

        if (error) {
          throw error;
        }

        await loadThread(activePost.id);
        setActivePost((previous) => ({
          ...previous,
          reply_count: Number(previous?.reply_count || 0) + 1
        }));
      }

      setReplyContent('');
    } catch (error) {
      showToast(getErrorMessage(error, 'Antwort konnte nicht gesendet werden.'), 'error');
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Beitrag wirklich loeschen?')) {
      return;
    }

    try {
      if (secureMode) {
        await secureForumApi.removePost(postId);
      } else {
        const { error } = await supabase.from('forum_posts').delete().eq('id', postId);
        if (error) {
          throw error;
        }
      }

      showToast('Beitrag geloescht.', 'success');
      setActivePost(null);
      setReplies([]);
      setView('list');
      await loadPosts(activeCategory.id);
      await loadCategoryCounts();
    } catch (error) {
      showToast(getErrorMessage(error, 'Beitrag konnte nicht geloescht werden.'), 'error');
    }
  };

  const deleteReply = async (replyId) => {
    if (!window.confirm('Antwort loeschen?')) {
      return;
    }

    try {
      if (secureMode) {
        const result = await secureForumApi.removeReply(replyId);
        await loadThread(result.postId);
        await loadPosts(activeCategory.id);
      } else {
        const { error } = await supabase.from('forum_replies').delete().eq('id', replyId);
        if (error) {
          throw error;
        }

        await loadThread(activePost.id);
        setActivePost((previous) => ({
          ...previous,
          reply_count: Math.max(Number(previous?.reply_count || 1) - 1, 0)
        }));
      }

      showToast('Antwort geloescht.', 'success');
    } catch (error) {
      showToast(getErrorMessage(error, 'Antwort konnte nicht geloescht werden.'), 'error');
    }
  };

  const togglePin = async (postId) => {
    try {
      if (secureMode) {
        const updated = await secureForumApi.togglePin(postId);
        setActivePost(normalizePost(updated));
      } else {
        const { error } = await supabase
          .from('forum_posts')
          .update({ pinned: !activePost.pinned })
          .eq('id', postId);

        if (error) {
          throw error;
        }

        setActivePost((previous) => ({
          ...previous,
          pinned: !previous?.pinned
        }));
      }

      await loadPosts(activeCategory.id);
    } catch (error) {
      showToast(getErrorMessage(error, 'Anheften konnte nicht geaendert werden.'), 'error');
    }
  };

  const toggleLock = async (postId) => {
    try {
      if (secureMode) {
        const updated = await secureForumApi.toggleLock(postId);
        setActivePost(normalizePost(updated));
      } else {
        const { error } = await supabase
          .from('forum_posts')
          .update({ locked: !activePost.locked })
          .eq('id', postId);

        if (error) {
          throw error;
        }

        setActivePost((previous) => ({
          ...previous,
          locked: !previous?.locked
        }));
      }

      await loadPosts(activeCategory.id);
    } catch (error) {
      showToast(getErrorMessage(error, 'Sperre konnte nicht geaendert werden.'), 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Gerade eben';
    if (diffMin < 60) return `vor ${diffMin} Min.`;
    if (diffH < 24) return `vor ${diffH} Std.`;
    if (diffD < 7) return `vor ${diffD} Tagen`;
    return date.toLocaleDateString('de-DE');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-purple-200 text-purple-800">Admin</span>;
      case 'trainer':
        return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-200 text-blue-800">Ausbilder</span>;
      case 'rettungsschwimmer_azubi':
        return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-cyan-200 text-cyan-800">Rettungsschwimmer-Azubi</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-green-200 text-green-800">Azubi</span>;
    }
  };

  if (view === 'categories') {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Forum</h2>
          <p className="opacity-90">Austausch, Ideen und Neuigkeiten</p>
        </div>

        <div className="grid gap-3">
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => openCategory(category)}
              className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'} rounded-xl p-5 shadow-md text-left transition-all flex items-center justify-between group`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-sm font-bold text-white`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{category.label}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{category.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {categoryCounts[category.id] > 0 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {categoryCounts[category.id]}
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
              Zurueck
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{activeCategory?.icon}</span>
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
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lade Beitraege...</div>
        ) : posts.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
            <p>Noch keine Beitraege in dieser Kategorie.</p>
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
            {posts.map((post) => (
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

  if (view === 'new') {
    return (
      <div className="space-y-4">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md`}>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
          >
            <ArrowLeft size={20} />
            Zurueck zu {activeCategory?.label}
          </button>
        </div>

        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-md space-y-4`}>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Neues Thema in "{activeCategory?.label}"
          </h3>

          <input
            type="text"
            placeholder="Titel"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />

          <textarea
            placeholder="Was moechtest du teilen?"
            value={newContent}
            onChange={(event) => setNewContent(event.target.value)}
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
              onClick={() => {
                setView('list');
                setNewTitle('');
                setNewContent('');
              }}
              className={`px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'thread' && activePost) {
    return (
      <div className="space-y-4">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md`}>
          <button
            onClick={() => {
              setView('list');
              loadPosts(activeCategory.id);
            }}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
          >
            <ArrowLeft size={20} />
            Zurueck zu {activeCategory?.label}
          </button>
        </div>

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
                  onClick={() => togglePin(activePost.id)}
                  className={`p-2 rounded-lg ${activePost.pinned ? 'bg-amber-100 text-amber-600' : darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'} hover:opacity-80`}
                  title={activePost.pinned ? 'Loesen' : 'Anheften'}
                >
                  <Pin size={16} />
                </button>
                <button
                  onClick={() => toggleLock(activePost.id)}
                  className={`p-2 rounded-lg ${activePost.locked ? 'bg-red-100 text-red-600' : darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'} hover:opacity-80`}
                  title={activePost.locked ? 'Entsperren' : 'Sperren'}
                >
                  <Lock size={16} />
                </button>
                <button
                  onClick={() => deletePost(activePost.id)}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-red-400' : 'bg-red-50 text-red-500'} hover:opacity-80`}
                  title="Beitrag loeschen"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {!isAdmin && canDeletePost(activePost) && (
              <button
                onClick={() => deletePost(activePost.id)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-red-400' : 'bg-red-50 text-red-500'} hover:opacity-80`}
                title="Beitrag loeschen"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className={`whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {activePost.content}
          </div>
        </div>

        {loading ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lade Antworten...</div>
        ) : replies.length > 0 && (
          <div className="space-y-2">
            <h4 className={`font-bold px-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {replies.length} {replies.length === 1 ? 'Antwort' : 'Antworten'}
            </h4>
            {replies.map((reply) => (
              <div key={reply.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-medium">{reply.user_name}</span>
                    {getRoleBadge(reply.user_role)}
                    <span>{formatDate(reply.created_at)}</span>
                  </div>
                  {canDeleteReply(reply.user_id) && (
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

        {activePost.locked ? (
          <div className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center gap-2`}>
            <Lock size={16} />
            Dieses Thema ist geschlossen.
          </div>
        ) : !canReplyInActiveCategory ? (
          <div className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            In dieser Kategorie darfst du nicht antworten.
          </div>
        ) : (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md`}>
            <div className="flex gap-2">
              <textarea
                placeholder="Antwort schreiben..."
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
                rows={2}
                className={`flex-1 px-4 py-2 rounded-lg border resize-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
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
              Enter zum Senden, Shift+Enter fuer neue Zeile
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ForumView;
