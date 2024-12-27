import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/Admin/AdminLayout';
import BookingsList from '../components/Admin/BookingsList';
import { useAuth } from '../context/AuthContext';

const AdminBookings = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  return (
    <AdminLayout>
      <BookingsList />
    </AdminLayout>
  );
};

export default AdminBookings;
