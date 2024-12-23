import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import Profile from './Profile';

function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setShowProfileModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-[#1E5EFF] font-bold text-2xl">PARK</span>
            <span className="font-bold text-2xl">EASE</span>
          </a>
          
          <nav className="flex items-center space-x-8">
            <a href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </a>
            <button className="inline-flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              <span>Get the App</span>
            </button>
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={handleAccountClick}
                  className="inline-flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                  <span>{user?.name || 'My Profile'}</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAccountClick}
                className="inline-flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {showLoginModal && (
        <LoginPage onClose={() => setShowLoginModal(false)} />
      )}

      {showProfileModal && (
        <Profile onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
}

export default Header;