import{useContext} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import {Toaster }from "react-hot-toast";
import { AuthContext } from './context/AuthContext';

function App() {
  const {authUser} = useContext (AuthContext)
  return (
    <div className="min-h-screen bg-[#090b17] text-white">
      <Toaster/>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to ="/"/>} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to ="/login"/>} />
      </Routes>
    </div>
  );
}

export default App;
