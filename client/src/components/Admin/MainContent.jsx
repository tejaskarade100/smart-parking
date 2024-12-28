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
    totalSpaces: {
      twoWheeler: parseInt(user?.twoWheelerSpaces) || 0,
      fourWheeler: parseInt(user?.fourWheelerSpaces) || 0
    },
    availableSpaces: {
      twoWheeler: parseInt(user?.twoWheelerSpaces) || 0,
      fourWheeler: parseInt(user?.fourWheelerSpaces) || 0
    },
    revenue: 0,
    activeBookings: []
  });

  const fetchStats = async () => {
    try {
      if (!user?.email) {
        console.log('No user email available');
        return;
      }

      console.log('Fetching stats for user:', user.email);
      // Remove /api prefix since it's already in baseURL
      const response = await api.get(`/admin/stats/${encodeURIComponent(user.email)}`);
      const statsData = response.data;
      console.log('Received stats:', statsData);

      // Ensure all required fields are present
      const validatedStats = {
        totalSpaces: {
          twoWheeler: parseInt(statsData.totalSpaces?.twoWheeler) || 0,
          fourWheeler: parseInt(statsData.totalSpaces?.fourWheeler) || 0
        },
        availableSpaces: {
          twoWheeler: parseInt(statsData.availableSpaces?.twoWheeler) || 0,
          fourWheeler: parseInt(statsData.availableSpaces?.fourWheeler) || 0
        },
        revenue: parseFloat(statsData.revenue) || 0,
        activeBookings: Array.isArray(statsData.activeBookings) ? statsData.activeBookings : []
      };

      console.log('Setting stats:', validatedStats);
      setStats(validatedStats);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStats();
    // Set up polling for real-time updates
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [user?.email]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Calculate total spaces
  const totalSpaces = stats.totalSpaces.twoWheeler + stats.totalSpaces.fourWheeler;
  const availableSpaces = stats.availableSpaces.twoWheeler + stats.availableSpaces.fourWheeler;

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
          value={totalSpaces.toString()} 
          icon={<Car className="w-8 h-8 text-blue-500" />}
          details={[
            { label: 'Two-wheelers', value: stats.totalSpaces.twoWheeler.toString() },
            { label: 'Four-wheelers', value: stats.totalSpaces.fourWheeler.toString() }
          ]}
        />
        <StatCard 
          title="Available Slots" 
          value={availableSpaces.toString()} 
          icon={<Bike className="w-8 h-8 text-green-500" />}
          details={[
            { label: 'Two-wheelers', value: stats.availableSpaces.twoWheeler.toString() },
            { label: 'Four-wheelers', value: stats.availableSpaces.fourWheeler.toString() }
          ]}
        />
        <StatCard 
          title="Revenue" 
          value={`₹${stats.revenue.toFixed(2)}`}
          icon={<IndianRupee className="w-8 h-8 text-yellow-500" />}
          details={[{ label: "Total earnings", value: `₹${stats.revenue.toFixed(2)}` }]}
        />
        <StatCard 
          title="Active Bookings" 
          value={stats.activeBookings.length.toString()} 
          icon={<Clock className="w-8 h-8 text-red-500" />}
          details={[{ label: 'Currently parked', value: stats.activeBookings.length.toString() }]}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Real-time Parking Status</h2>
        <ParkingStatusVisualization 
          twoWheelerTotal={stats.totalSpaces.twoWheeler}
          fourWheelerTotal={stats.totalSpaces.fourWheeler}
          twoWheelerAvailable={stats.availableSpaces.twoWheeler}
          fourWheelerAvailable={stats.availableSpaces.fourWheeler}
        />
      </motion.div>
    </div>
  );
};

export default MainContent;
