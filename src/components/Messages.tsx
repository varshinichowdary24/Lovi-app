import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User as UserIcon } from 'lucide-react';
import { useStore } from '../lib/useStore';
import { cn } from '../lib/utils';

export function Messages() {
  const { currentUser, messages, users, sendMessage, markMessageRead } = useStore();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const myMessages = currentUser
    ? messages.filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id)
    : [];

  const conversationPartners = new Map<string, { userId: string; lastMessage: typeof myMessages[0]; unread: number }>();

  myMessages.forEach(m => {
    const otherId = m.senderId === currentUser?.id ? m.receiverId : m.senderId;
    const existing = conversationPartners.get(otherId);
    if (!existing || new Date(m.createdAt) > new Date(existing.lastMessage.createdAt)) {
      conversationPartners.set(otherId, {
        userId: otherId,
        lastMessage: m,
        unread: (existing?.unread || 0) + (m.receiverId === currentUser?.id && !m.isRead ? 1 : 0),
      });
    } else if (m.receiverId === currentUser?.id && !m.isRead) {
      existing!.unread += 1;
    }
  });

  const sortedPartners = Array.from(conversationPartners.values())
    .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());

  const chatMessages = selectedUserId
    ? myMessages
        .filter(m => (m.senderId === selectedUserId || m.receiverId === selectedUserId))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (selectedUserId) {
      chatMessages
        .filter(m => m.receiverId === currentUser?.id && !m.isRead)
        .forEach(m => markMessageRead(m.id));
    }
  }, [selectedUserId, chatMessages.length]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUserId) return;
    try {
      await sendMessage(selectedUserId, input.trim());
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] min-h-[500px] bg-navy-800/30 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex">
      {/* Contact List */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col",
        selectedUserId && "hidden md:flex"
      )}>
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-black text-white">Messages</h2>
          <p className="text-xs text-white/30 font-medium mt-0.5">{sortedPartners.length} conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedPartners.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <UserIcon className="w-12 h-12 text-white/10 mb-4" />
              <p className="text-sm font-medium text-white/30">No conversations yet</p>
              <p className="text-xs text-white/20 mt-1">Messages will appear when you connect with a professional.</p>
            </div>
          ) : (
            sortedPartners.map(({ userId, lastMessage, unread }) => {
              const user = users.find(u => u.id === userId);
              return (
                <button
                  key={userId}
                  onClick={() => setSelectedUserId(userId)}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5",
                    selectedUserId === userId && "bg-white/5"
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white truncate">{user?.name || 'Unknown'}</span>
                      <span className="text-[10px] text-white/20 flex-shrink-0">
                        {new Date(lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 truncate mt-0.5">{lastMessage.content}</p>
                  </div>
                  {unread > 0 && (
                    <span className="w-5 h-5 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedUserId && "hidden md:flex"
      )}>
        {selectedUserId && selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <button onClick={() => setSelectedUserId(null)} className="md:hidden p-1 -ml-1">
                <ArrowLeft className="w-5 h-5 text-white/60" />
              </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-black">
                {selectedUser.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{selectedUser.name}</p>
                <p className="text-[10px] text-white/30 font-medium">{selectedUser.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-white/20 font-medium">No messages yet. Say hello!</p>
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isMine = msg.senderId === currentUser?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex", isMine ? "justify-end" : "justify-start")}
                    >
                      <div className={cn(
                        "max-w-[75%] px-4 py-2.5 rounded-2xl",
                        isMine
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-white/10 text-white/80 rounded-bl-md"
                      )}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={cn(
                          "text-[10px] mt-1",
                          isMine ? "text-blue-200" : "text-white/30"
                        )}>
                          {new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-navy-900/50 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all active:scale-95"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <UserIcon className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white/40">Select a conversation</h3>
              <p className="text-sm text-white/20 mt-1">Choose a contact from the left to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
