import React, { useState } from 'react';
import { Send, ArrowLeft, MoreVertical, Search, CheckCheck, User, Phone, Video } from 'lucide-react';

interface MessagesAppProps {
  onSendMessage?: (contact: string, text: string) => void;
  uiState?: any;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({ onSendMessage }) => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>('t1');
  const [inputText, setInputText] = useState('');
  const [threads, setThreads] = useState([
    {
      id: 't1',
      contact: 'Alex Chen',
      role: 'Product Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Are we still meeting at the cafe around 3 PM?',
      time: '12:32 PM',
      unread: false,
      messages: [
        { id: 'm1', sender: 'them', text: 'Hey, did you get the project deck for the Android agent architecture?', time: '12:28 PM' },
        { id: 'm2', sender: 'me', text: 'Yes! Reviewing the Kotlin ReAct tool dispatching right now.', time: '12:30 PM' },
        { id: 'm3', sender: 'them', text: 'Are we still meeting at the cafe around 3 PM?', time: '12:32 PM' },
      ]
    },
    {
      id: 't2',
      contact: 'Sarah Miller (Dr.)',
      role: 'Physician',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Lab report results have been uploaded to your health portal.',
      time: '11:15 AM',
      unread: true,
      messages: [
        { id: 'm4', sender: 'them', text: 'Lab report results have been uploaded to your health portal.', time: '11:15 AM' }
      ]
    },
    {
      id: 't3',
      contact: 'Dev Team Lead',
      role: 'Android Architecture',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Kotlin multiplatform build passed CI/CD pipeline! 🚀',
      time: 'Yesterday',
      unread: false,
      messages: [
        { id: 'm5', sender: 'them', text: 'Kotlin multiplatform build passed CI/CD pipeline! 🚀', time: 'Yesterday' }
      ]
    }
  ]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleSend = () => {
    if (!inputText.trim() || !activeThreadId) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: inputText,
          time: now,
          messages: [
            ...t.messages,
            { id: `m_${Date.now()}`, sender: 'me', text: inputText, time: now }
          ]
        };
      }
      return t;
    }));

    if (onSendMessage && activeThread) {
      onSendMessage(activeThread.contact, inputText);
    }
    setInputText('');
  };

  return (
    <div id="app-messages" className="flex flex-col h-full bg-slate-950 text-slate-100 select-none">
      {activeThread ? (
        // Active Chat View
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <button 
                id="btn-messages-back"
                onClick={() => setActiveThreadId(null)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img 
                src={activeThread.avatar} 
                alt={activeThread.contact} 
                className="w-8 h-8 rounded-full object-cover border border-slate-700" 
              />
              <div>
                <h3 className="text-sm font-semibold leading-tight text-slate-100">{activeThread.contact}</h3>
                <span className="text-[10px] text-emerald-400 font-mono">● Online (RCS)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
              <Video className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
              <MoreVertical className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60">
            <div className="text-center my-1">
              <span className="text-[10px] bg-slate-800/80 text-slate-400 px-2.5 py-0.5 rounded-full font-mono">
                End-to-end encrypted RCS Chat
              </span>
            </div>

            {activeThread.messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.sender === 'me' 
                      ? 'bg-blue-600 text-white rounded-br-xs' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-xs border border-slate-700/60'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-0.5 px-1">
                  <span className="text-[9px] text-slate-500 font-mono">{msg.time}</span>
                  {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-blue-400" />}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              id="com.google.android.apps.messaging:id/compose_message_text"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Chat message (RCS)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-3.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              id="btn-send-message"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        // Thread List View
        <div className="flex flex-col h-full">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">Messages</h2>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <User className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {threads.map(thread => (
              <div
                key={thread.id}
                id={`thread-${thread.id}`}
                onClick={() => setActiveThreadId(thread.id)}
                className="flex items-center gap-3 p-3 hover:bg-slate-900/80 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <img 
                    src={thread.avatar} 
                    alt={thread.contact} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-700" 
                  />
                  {thread.unread && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-100 truncate">{thread.contact}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{thread.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{thread.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
