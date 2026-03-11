import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAvatarById } from '../../data/constants';
import AvatarBadge from '../ui/AvatarBadge';

const ChatView = ({ messages, newMessage, setNewMessage, sendMessage }) => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold flex items-center">
          <MessageCircle className="mr-2" />
          Team-Chat
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          🛡️ Respektvoller Umgang erforderlich - Beleidigungen und unangemessene Inhalte sind verboten
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.user === user.name ? 'justify-end' : 'justify-start'}`}>
            {msg.user !== user.name && (
              <AvatarBadge
                avatar={msg.avatar ? getAvatarById(msg.avatar) : null}
                fallback={msg.user.charAt(0).toUpperCase()}
                size="sm"
                className="border border-white/40 flex-shrink-0"
              />
            )}
            <div className={`max-w-xs rounded-xl p-3 ${
              msg.user === user.name
                ? 'bg-blue-500 text-white'
                : msg.isTrainer
                ? 'bg-purple-100 text-purple-900'
                : 'bg-gray-200 text-gray-900'
            }`}>
              <p className="text-xs font-bold mb-1">
                {msg.user} {msg.isTrainer && '👨‍🏫'}
              </p>
              <p>{msg.text}</p>
            </div>
            {msg.user === user.name && (
              <AvatarBadge
                avatar={user.avatar ? getAvatarById(user.avatar) : null}
                fallback={user.name.charAt(0).toUpperCase()}
                size="sm"
                className="border border-white/40 flex-shrink-0"
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Nachricht schreiben..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatView;
