import React from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NewsView = ({ news, newsTitle, setNewsTitle, newsContent, setNewsContent, addNews, deleteNews }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Bell className="mr-2 text-red-500" />
          Ankündigungen & News
        </h2>
        {user.permissions.canPostNews && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Neue Ankündigung</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                placeholder="Titel"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <textarea
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                placeholder="Inhalt"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                onClick={addNews}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                <Plus className="inline mr-2" size={18} />
                Veröffentlichen
              </button>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {news.map(item => (
            <div key={item.id} className="border-l-4 border-red-500 bg-gray-50 rounded-r-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                {user?.permissions.canPostNews && (
                  <button
                    onClick={() => deleteNews(item.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-all"
                    title="Löschen"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-gray-700 mb-2">{item.content}</p>
              <p className="text-sm text-gray-500">
                Von {item.author} • {new Date(item.time).toLocaleDateString()}
              </p>
            </div>
          ))}
          {news.length === 0 && (
            <p className="text-gray-500 text-center py-8">Keine Ankündigungen vorhanden</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsView;
