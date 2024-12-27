import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.isAdmin || false);
    }
  }, []);

  const logout = async () => {
    return new Promise((resolve) => {
      // Clear all auth-related data
      localStorage.clear(); // Clear all localStorage data
      sessionStorage.clear(); // Clear all sessionStorage data
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      resolve();
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      setIsAuthenticated, 
      isAdmin,
      setIsAdmin,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
