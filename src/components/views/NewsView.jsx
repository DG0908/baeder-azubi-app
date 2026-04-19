import React from 'react';
import { Bell, Plus, Trash2, User as UserIcon, Clock, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const now = Date.now();
  const diffMin = Math.floor((now - d.getTime()) / 60000);
  if (diffMin < 1) return 'gerade eben';
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `vor ${diffH} Std.`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `vor ${diffD} Tagen`;
  return d.toLocaleDateString('de-DE');
};

const NewsView = ({ news, newsTitle, setNewsTitle, newsContent, setNewsContent, addNews, deleteNews }) => {
  const { user } = useAuth();
  const { darkMode } = useApp();
  const canPost = !!user?.permissions?.canPostNews;

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-rose-900 via-slate-900 to-red-900' : 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500'} text-white rounded-2xl p-8 shadow-lg`}>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Bell size={30} />
          Ankündigungen & News
        </h2>
        <p className="text-white/80">
          Alles Wichtige aus deinem Betrieb und der Ausbildung — an einem Ort.
        </p>
      </div>

      {canPost && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-rose-300' : 'text-gray-800'}`}>
            <Megaphone size={18} />
            Neue Ankündigung
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="Titel"
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-400 ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'}`}
            />
            <textarea
              value={newsContent}
              onChange={(e) => setNewsContent(e.target.value)}
              placeholder="Inhalt"
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-400 resize-none ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'}`}
            />
            <button
              onClick={addNews}
              className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Veröffentlichen
            </button>
          </div>
        </div>
      )}

      {news.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-rose-50'}`}>
            <Bell size={36} className={darkMode ? 'text-rose-300' : 'text-rose-500'} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Keine Ankündigungen
          </h3>
          <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {canPost
              ? 'Schreibe die erste Ankündigung für deinen Betrieb oben im Formular.'
              : 'Sobald dein Ausbilder oder Admin News veröffentlicht, erscheinen sie hier.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-red-500" />
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className={`text-lg font-bold break-words ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {item.title}
                </h3>
                {canPost && (
                  <button
                    onClick={() => deleteNews(item.id)}
                    className={`p-2 rounded-lg flex-shrink-0 transition-colors ${darkMode ? 'text-red-400 hover:bg-white/10' : 'text-red-500 hover:bg-red-50'}`}
                    title="Löschen"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className={`whitespace-pre-wrap leading-relaxed mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {item.content}
              </p>
              <div className={`flex flex-wrap items-center gap-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1">
                  <UserIcon size={12} />
                  {item.author || 'Unbekannt'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(item.time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsView;
