import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import ParkingStatusVisualization from './ParkingStatusVisualization';
import { Car, Bike, IndianRupee, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const MainContent = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSpaces: parseInt(user?.totalSpaces) || 0,
    availableSpaces: 0,
    revenue: 0,
    pendingBookings: 0,
    twoWheelerAvailable: 0,
    fourWheelerAvailable: 0,
    twoWheelerTotal: parseInt(user?.twoWheelerSpaces) || 0,
    fourWheelerTotal: parseInt(user?.fourWheelerSpaces) || 0
  });

  useEffect(() => {
    // Update total spaces when user data changes
    setStats(prev => ({
      ...prev,
      totalSpaces: parseInt(user?.totalSpaces) || 0,
      twoWheelerTotal: parseInt(user?.twoWheelerSpaces) || 0,
      fourWheelerTotal: parseInt(user?.fourWheelerSpaces) || 0
    }));
  }, [user]);

  const fetchStats = async () => {
    try {
      if (!user?._id) {
        console.log('No user ID available');
        return;
      }

      // Get bookings stats
      const statsResponse = await api.get(`/api/admin/stats/${user._id}`);
      const { activeBookings, completedBookings, revenue } = statsResponse.data;

      // Calculate available spaces
      const twoWheelerBooked = activeBookings.filter(b => b.vehicleType === 'two-wheeler').length;
      const fourWheelerBooked = activeBookings.filter(b => b.vehicleType === 'four-wheeler').length;
      const twoWheelerAvailable = Math.max(0, stats.twoWheelerTotal - twoWheelerBooked);
      const fourWheelerAvailable = Math.max(0, stats.fourWheelerTotal - fourWheelerBooked);
      const availableSpaces = twoWheelerAvailable + fourWheelerAvailable;

      setStats(prev => ({
        ...prev,
        availableSpaces,
        revenue,
        pendingBookings: activeBookings.length,
        twoWheelerAvailable,
        fourWheelerAvailable
      }));
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStats();
    // Set up polling for real-time updates
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [user?._id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <motion.h1 
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard 
          title="Total Parking Spaces" 
          value={stats.totalSpaces.toString()} 
          icon={<Car className="w-8 h-8 text-blue-500" />}
          details={[
            { label: 'Two-wheelers', value: stats.twoWheelerTotal.toString() },
            { label: 'Four-wheelers', value: stats.fourWheelerTotal.toString() }
          ]}
        />
        <StatCard 
          title="Available Slots" 
          value={stats.availableSpaces.toString()} 
          icon={<Bike className="w-8 h-8 text-green-500" />}
          details={[
            { label: 'Two-wheelers', value: stats.twoWheelerAvailable.toString() },
            { label: 'Four-wheelers', value: stats.fourWheelerAvailable.toString() }
          ]}
        />
        <StatCard 
          title="Revenue" 
          value={`₹${stats.revenue}`}
          icon={<IndianRupee className="w-8 h-8 text-yellow-500" />}
          details={[{ label: "Total earnings", value: `₹${stats.revenue}` }]}
        />
        <StatCard 
          title="Active Bookings" 
          value={stats.pendingBookings.toString()} 
          icon={<Clock className="w-8 h-8 text-red-500" />}
          details={[{ label: 'Currently parked', value: stats.pendingBookings.toString() }]}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Real-time Parking Status</h2>
        <ParkingStatusVisualization />
      </motion.div>
    </div>
  );
};

export default MainContent;
