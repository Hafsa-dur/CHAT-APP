import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const RightSidebar = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const { selectedUser, messages } = useContext(ChatContext);

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(authUser?.bio || 'Hi everyone, I am using QuickChat');

  const handleUpdate = async () => {
    await updateProfile({ bio });
    setIsEditing(false);
  };

  // Shared Media Filter
  const sharedMedia = messages?.filter((msg) => msg.image) || [];

  return (
    <aside className="hidden w-full max-w-[300px] flex-col gap-6 rounded-[32px] border border-white/10 glass-effect p-6 shadow-2xl xl:flex overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <p className="mt-1 text-sm text-slate-400">User details and media.</p>
      </div>

      {/* Logged In User Profile */}
      <div className="space-y-4 rounded-3xl bg-white/5 p-4 border border-white/10">
        <div className="flex items-center gap-4">
          <img 
            src={authUser?.profilePic || 'https://i.pravatar.cc/150'} 
            alt="profile" 
            className="h-14 w-14 rounded-full object-cover border-2 border-violet-500"
          />
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-white truncate">{authUser?.fullName || authUser?.name}</p>
            <p className="text-sm text-emerald-400">Active Now</p>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-300">
          {authUser?.bio || bio}
        </p>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
        
        {isEditing && (
          <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-400 resize-none"
              rows="2"
            />
            <button 
              onClick={handleUpdate}
              className="w-full rounded-2xl bg-violet-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              Update Profile
            </button>
          </div>
        )}
      </div>

      {/* Shared Media Section */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.32em] text-slate-400">
          Shared Media ({sharedMedia.length})
        </h3>
        {sharedMedia.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {sharedMedia.map((m) => (
              <img
                key={m._id || m.id}
                src={m.image}
                alt="shared"
                className="h-20 w-full rounded-xl object-cover border border-white/10"
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No media shared yet</p>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;