import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import Profile from './components/Profile';
import BookingConfirmation from './components/BookingConfirmation';

function App() {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen">
        <Header onProfileClick={() => setShowProfile(true)} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/booking-confirmation/:bookingId" 
              element={<BookingConfirmation />} 
            />
          </Routes>
        </main>

        {showProfile && (
          <Profile onClose={() => setShowProfile(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;