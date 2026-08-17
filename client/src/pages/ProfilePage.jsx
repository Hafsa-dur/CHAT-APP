import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Import your assets/avatar fallback image here
// import assets from '../assets/assets'; 

const ProfileUpdate = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState(authUser?.fullName || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImg(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // If no new image is selected, update name and bio only
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/');
      return;
    }

    // Convert selected image to Base64 and update profile
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/');
    };
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black">
      
      {/* Profile Details Modal */}
      <div className="w-full max-w-2xl bg-slate-950/80 border border-slate-800/80 rounded-2xl backdrop-blur-xl p-8 shadow-2xl">
        <h2 className="text-lg font-medium mb-6">Profile details</h2>

        <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-8 items-center justify-between">
          
          {/* Inputs Section */}
          <div className="flex-1 w-full space-y-4">
            
            {/* Upload Icon/Image & Label */}
            <label htmlFor="profile-img" className="flex items-center gap-3 text-slate-400 hover:text-slate-200 cursor-pointer text-sm">
              <img 
                src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || 'https://i.pravatar.cc/150?img=11')} 
                alt="Avatar Icon" 
                className={`w-12 h-12 object-cover ${selectedImg && 'rounded-full'}`} 
              />
              <span>upload profile image</span>
            </label>
            <input 
              type="file" 
              id="profile-img" 
              accept=".png, .jpg, .jpeg" 
              onChange={handleImageChange} 
              className="hidden" 
            />

            {/* Name Input */}
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-slate-200"
            />

            {/* Bio Input */}
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write profile bio"
              className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-slate-200 resize-none"
            />

            {/* Save Button */}
            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl font-medium text-sm transition shadow-lg shadow-purple-600/30"
            >
              Save
            </button>
          </div>

          {/* Main Profile Picture Preview */}
          <div className="flex flex-col items-center">
            <img 
              src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || 'https://i.pravatar.cc/150?img=11')} 
              alt="Profile Preview" 
              className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 object-cover border-2 border-purple-500/50 shadow-xl ${selectedImg && 'rounded-full'}`}
            />
          </div>

        </form>
      </div>

    </div>
  );
};

export default ProfileUpdate;