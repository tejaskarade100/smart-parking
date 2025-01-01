import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../components/Admin/AdminLayout';
import MainContent from '../components/Admin/MainContent';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token || !user.isAdmin) {
          navigate('/');
          return;
        }

        // Clean up stats when dashboard loads
        await api.post(`/admin/cleanup-stats/${user._id}`);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <MainContent />
    </AdminLayout>
  );
};

export default AdminDashboard;
