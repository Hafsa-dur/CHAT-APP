import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = input 
    ? users?.filter((user) => user.fullName?.toLowerCase().includes(input.toLowerCase()))
    : users;

  return (
    <aside className={`flex h-full w-full max-w-[320px] flex-col gap-6 rounded-[32px] border border-white/10 glass-effect p-6 shadow-2xl md:max-w-[340px] ${selectedUser ? 'max-md:hidden' : ''}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">QuickChat</h2>
          <p className="mt-1 text-sm text-slate-400">Live messaging</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="space-y-4 rounded-3xl bg-white/5 p-4 border border-white/10">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search User..."
            className="w-full bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Dynamic Users List */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-3">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers?.includes(user._id);

            return (
              <button
                key={user._id || user.id}
                onClick={() => setSelectedUser(user)}
                className={`group relative flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left transition ${
                  selectedUser?._id === user._id
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/10 bg-white/5 hover:border-violet-400/40 hover:bg-white/10'
                }`}
              >
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden bg-slate-800">
                  <img 
                    src={user?.profilePic || 'https://i.pravatar.cc/150'} 
                    alt={user.fullName || user.name} 
                    className="h-full w-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#090b17] bg-emerald-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-white">{user.fullName || user.name}</p>
                  <p className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>

                {unseenMessages && unseenMessages[user._id] > 0 && (
                  <span className="flex-shrink-0 rounded-full bg-violet-500/50 px-2.5 py-1 text-xs text-white font-medium">
                    {unseenMessages[user._id]}
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <p className="text-center text-xs text-slate-500 mt-4">No users found</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;