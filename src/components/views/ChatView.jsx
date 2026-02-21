import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AVATARS } from '../../data/constants';

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
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg flex-shrink-0">
                {msg.avatar ? AVATARS.find(a => a.id === msg.avatar)?.emoji || msg.user.charAt(0).toUpperCase() : msg.user.charAt(0).toUpperCase()}
              </div>
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
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                {user.avatar ? AVATARS.find(a => a.id === user.avatar)?.emoji || user.name.charAt(0).toUpperCase() : user.name.charAt(0).toUpperCase()}
              </div>
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
