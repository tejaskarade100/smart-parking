import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import Profile from './components/Profile';

const AppContent = () => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = React.useState(false);
  const location = useLocation();

  // Don't show header on Dashboard
  const showHeader = location.pathname !== '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header onProfileClick={() => setShowProfile(true)} />}
      <div className={showHeader ? "container mx-auto px-4 py-8" : ""}>
        <Routes>
          <Route 
            path="/" 
            element={<Home />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard /> : <Navigate to="/" />
            } 
          />
        </Routes>
      </div>

      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;