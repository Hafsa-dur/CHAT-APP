import React, { useState, useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

const ChatContainer = () => {
  const { selectedUser, messages, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);

  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Fetch history when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gallery Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      text: text,
      image: imagePreview,
    });

    setText('');
    setImagePreview(null);
  };

  if (!selectedUser) {
    return (
      <section className="flex h-full flex-1 items-center justify-center rounded-[32px] border border-white/10 glass-effect p-6 shadow-2xl">
        <p className="text-slate-400">Select a user to begin chatting</p>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-1 flex-col rounded-[32px] border border-white/10 glass-effect p-6 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-400/80">Chat Room</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            {selectedUser?.fullName || selectedUser?.name}
          </h1>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4 pr-2">
        {messages && messages.length > 0 ? (
          messages.map((message) => {
            const isMe = message.senderId === authUser?._id;
            return (
              <div
                key={message._id || message.id}
                className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img 
                    src={selectedUser?.profilePic || 'https://i.pravatar.cc/150'} 
                    alt="avatar" 
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover" 
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm ${
                    isMe ? 'bg-violet-600 text-white' : 'bg-white/10 text-slate-200'
                  }`}
                >
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Attachment" 
                      className="rounded-xl mb-2 max-h-48 w-full object-cover" 
                    />
                  )}
                  {message.text && <p className="leading-6">{message.text}</p>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-slate-500 my-auto text-sm">
            No messages yet. Say hi! 👋
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Image Preview Box */}
      {imagePreview && (
        <div className="relative mb-2 w-20">
          <img src={imagePreview} alt="preview" className="h-20 w-20 rounded-xl object-cover" />
          <button
            onClick={() => setImagePreview(null)}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-xs text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Form with Gallery Button */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-3">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        
        {/* Gallery Icon */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-white transition"
          title="Open Gallery"
        >
          🖼️
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
        />

        <button 
          type="submit" 
          className="rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
        >
          Send
        </button>
      </form>
    </section>
  );
};

export default ChatContainer;