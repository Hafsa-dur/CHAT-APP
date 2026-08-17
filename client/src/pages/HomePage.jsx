import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BsThreeDotsVertical, 
  BsImage, 
  BsSendFill, 
  BsInfoCircle,
  BsX
} from 'react-icons/bs';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Home = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers } = useContext(AuthContext);
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    messages, 
    getMessages, 
    sendMessage, 
    unseenMessages 
  } = useContext(ChatContext);
  
  // UI States
  const [showMenu, setShowMenu] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [imageBase64, setImageBase64] = useState(null); // Fixed: Base64 String state
  const [searchInput, setSearchInput] = useState('');

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Fetch real users on mount
  useEffect(() => {
    if (getUsers) getUsers();
  }, [getUsers, onlineUsers]);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle File Selection and Convert to Base64 (FIXED)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result); // Base64 string set ho rahi hai
    };
  };

  // Filter users based on search
  const filteredUsers = searchInput 
    ? users?.filter((user) => user.fullName?.toLowerCase().includes(searchInput.toLowerCase()))
    : users;

  // Handle Send Message
  const handleSendMessage = async () => {
    if (!messageText.trim() && !imageBase64) return;
    
    await sendMessage({ 
      text: messageText.trim(), 
      image: imageBase64 
    });

    setMessageText('');
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Filter media items for Right Sidebar (FIXED)
  const mediaMessages = messages?.filter((msg) => msg.image && msg.image.trim() !== '') || [];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black">
      
      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-6xl h-[85vh] bg-slate-950/70 border border-slate-800/80 rounded-2xl backdrop-blur-xl flex overflow-hidden shadow-2xl relative">
        
        {/* ================= 1. LEFT SIDEBAR (USERS LIST) ================= */}
        <div className="w-80 border-r border-slate-800/80 flex flex-col bg-slate-900/30">
          
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-slate-800/60 relative">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold">💬</div>
              <h1 className="font-semibold text-lg">QuickChat</h1>
            </div>

            {/* 3 Dots Button */}
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
            >
              <BsThreeDotsVertical />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-4 top-14 w-36 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-md">
                <p 
                  onClick={() => navigate('/profile')} 
                  className="w-full text-left px-4 py-2 hover:bg-purple-600/30 text-sm cursor-pointer transition"
                >
                  Edit Profile
                </p>
                <hr className="my-1 border-t border-slate-800" />
                <p 
                  onClick={() => logout()} 
                  className="w-full text-left px-4 py-2 hover:bg-red-600/30 text-sm text-red-400 cursor-pointer transition"
                >
                  Logout
                </p>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="p-3">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search User..." 
              className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-slate-200"
            />
          </div>

          {/* Dynamic Real User List from Database */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isOnline = onlineUsers?.includes(user._id);

                return (
                  <div 
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                      selectedUser?._id === user._id ? 'bg-slate-800/80 border border-slate-700/50' : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={user.profilePic || 'https://i.pravatar.cc/150'} 
                          alt={user.fullName} 
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{user.fullName || user.name}</h4>
                        <p className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>

                    {unseenMessages && unseenMessages[user._id] > 0 && (
                      <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full text-white font-medium">
                        {unseenMessages[user._id]}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-slate-500 mt-4">No users found</p>
            )}
          </div>
        </div>

        {/* ================= 2. CENTER PANEL (CHAT ROOM) ================= */}
        <div className="flex-1 flex flex-col bg-slate-950/20">
          
          {selectedUser ? (
            <>
              {/* Active Chat Header */}
              <div className="p-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/20">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedUser.profilePic || 'https://i.pravatar.cc/150'} 
                    alt="" 
                    className="w-9 h-9 rounded-full object-cover" 
                  />
                  <div>
                    <span className="font-medium text-sm block">{selectedUser.fullName || selectedUser.name}</span>
                    <span className="text-xs text-slate-400">
                      {onlineUsers?.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white"><BsInfoCircle /></button>
              </div>

              {/* Dynamic Chat Messages Window */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages && messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isMyMessage = msg.senderId !== selectedUser._id;

                    return (
                      <div 
                        key={msg._id || index}
                        className={`p-3 rounded-2xl max-w-xs text-sm border ${
                          isMyMessage 
                            ? 'bg-purple-900/60 border-purple-500/30 ml-auto' 
                            : 'bg-slate-800/80 border-slate-700/50'
                        }`}
                      >
                        {/* Image Render Fix */}
                        {msg.image && (
                          <img 
                            src={msg.image} 
                            alt="Attachment" 
                            className="rounded-lg mb-2 max-h-48 w-full object-cover border border-slate-700" 
                          />
                        )}
                        {msg.text && <p className="leading-5">{msg.text}</p>}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-xs text-slate-500 my-auto">No messages yet. Say hi!</p>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Image Preview Window before sending */}
              {imageBase64 && (
                <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2">
                  <div className="relative">
                    <img src={imageBase64} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-purple-500" />
                    <button 
                      onClick={() => setImageBase64(null)}
                      className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 text-white"
                    >
                      <BsX size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">Image attached</span>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 border-t border-slate-800/60 bg-slate-900/40 flex items-center gap-2">
                <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-2 flex items-center gap-3">
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Send a message" 
                    className="bg-transparent border-none outline-none w-full text-sm text-slate-200"
                  />
                  
                  <label htmlFor="img-upload" className="cursor-pointer text-slate-400 hover:text-purple-400 transition">
                    <BsImage size={18} />
                  </label>
                  <input 
                    type="file" 
                    id="img-upload" 
                    ref={fileInputRef}
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageSelect}
                  />
                </div>

                <button 
                  onClick={handleSendMessage}
                  className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition shadow-lg shadow-purple-600/30"
                >
                  <BsSendFill size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-2xl mb-3 border border-purple-500/30">
                💬
              </div>
              <p className="text-sm font-medium text-slate-300">Chat anytime, anywhere</p>
            </div>
          )}

        </div>

        {/* ================= 3. RIGHT PANEL (PROFILE SIDEBAR) ================= */}
        {selectedUser && (
          <div className="w-72 border-l border-slate-800/80 p-6 flex flex-col items-center bg-slate-900/40 text-center overflow-y-auto">
            <img 
              src={selectedUser.profilePic || 'https://i.pravatar.cc/150'} 
              alt="" 
              className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-purple-500/40" 
            />
            <h3 className="font-semibold text-base">{selectedUser.fullName || selectedUser.name}</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">{selectedUser.bio || 'Hey there! I am using QuickChat.'}</p>

            {/* Dynamic Media Section (FIXED) */}
            <div className="w-full text-left border-t border-slate-800/80 pt-4">
              <span className="text-xs text-slate-400 font-medium block mb-3">
                Media ({mediaMessages.length})
              </span>
              
              {mediaMessages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {mediaMessages.map((msg, idx) => (
                    <a 
                      key={msg._id || idx} 
                      href={msg.image} 
                      target="_blank" 
                      rel="noreferrer"
                      className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700/50 hover:opacity-80 transition"
                    >
                      <img src={msg.image} alt="Media" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No media shared yet</p>
              )}
            </div>

            <button 
              onClick={() => logout()} 
              className="mt-auto w-full py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-600/20"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;