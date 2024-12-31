import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import Profile from './Profile';
import { Smartphone, User, LogIn, Car, Handshake } from 'lucide-react';

function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isAuthenticated, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setShowProfileModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handlePartnerClick = () => {
    navigate('/parking-categories');
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        layout
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.a 
            href="/" 
            className="flex items-center space-x-2"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Car className="text-blue-600 w-8 h-8" />
            <span className="text-blue-600 font-bold text-2xl">PARK</span>
            <span className="font-bold text-2xl">EASE</span>
          </motion.a>
          
          <nav className="flex items-center space-x-8">
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                About
              </Link>
            </motion.div>
            <motion.button 
              className="inline-flex items-center space-x-2 px-4 py-2 border rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Smartphone className="w-5 h-5" />
              <span>Get the App</span>
            </motion.button>

            <motion.button
              onClick={handlePartnerClick}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Handshake className="w-5 h-5" />
              <span>Partner with Us</span>
            </motion.button>

            <motion.button
              onClick={handleAccountClick}
              className="inline-flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              {isAuthenticated ? (
                <>
                  <User className="w-5 h-5" />
                  <span>{user?.name || 'Account'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </motion.button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {showLoginModal && (
          <LoginPage onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileModal && (
          <Profile onClose={() => setShowProfileModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
