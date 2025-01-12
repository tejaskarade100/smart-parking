import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import ParkingStatusVisualization from './ParkingStatusVisualization';
import { Car, Bike, IndianRupee, Clock, CheckSquare, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const MainContent = () => {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
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
    activeBookings: [],
    completedBookings: 0
  });

  const fetchAdminData = async () => {
    try {
      if (!user?._id) return;
      const response = await api.get(`/admin/${user._id}`);
      setAdminData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user?._id]);

  const fetchStats = async () => {
    try {
      if (!user?.email) {
        console.log('No user email available');
        return;
      }

      console.log('Fetching stats for user:', user.email);
      const response = await api.get(`/admin/stats/${encodeURIComponent(user.email)}`);
      const statsData = response.data;
      console.log('Received stats:', statsData);

      // Get bookings to calculate active/completed counts
      const bookingsResponse = await api.get(`/admin/bookings/${user._id}`);
      const bookings = bookingsResponse.data;

      // Process bookings to calculate status
      const now = new Date();
      const processedBookings = bookings.map(booking => {
        const endDateTime = new Date(booking.endDateTime);
        return {
          ...booking,
          status: endDateTime > now ? 'Active' : 'Completed'
        };
      });

      // Filter active and completed bookings
      const activeBookings = processedBookings.filter(b => b.status === 'Active');
      const completedBookings = processedBookings.filter(b => b.status === 'Completed');

      // Count active bookings by vehicle type
      const activeTwoWheelers = activeBookings.filter(b => 
        (b.vehicle?.category || b.vehicleDetails?.category) === 'two-wheeler'
      ).length;
      
      const activeFourWheelers = activeBookings.filter(b => 
        (b.vehicle?.category || b.vehicleDetails?.category) === 'four-wheeler'
      ).length;

      // Calculate total and available spaces
      const totalTwoWheelerSpaces = parseInt(statsData.totalSpaces?.twoWheeler) || 0;
      const totalFourWheelerSpaces = parseInt(statsData.totalSpaces?.fourWheeler) || 0;
      
      // Calculate available spaces by subtracting active bookings
      const availableTwoWheelerSpaces = Math.max(0, totalTwoWheelerSpaces - activeTwoWheelers);
      const availableFourWheelerSpaces = Math.max(0, totalFourWheelerSpaces - activeFourWheelers);

      const validatedStats = {
        totalSpaces: {
          twoWheeler: totalTwoWheelerSpaces,
          fourWheeler: totalFourWheelerSpaces
        },
        availableSpaces: {
          twoWheeler: availableTwoWheelerSpaces,
          fourWheeler: availableFourWheelerSpaces
        },
        revenue: parseFloat(statsData.revenue) || 0,
        activeBookings: activeBookings,
        completedBookings: completedBookings.length
      };

      console.log('Setting stats:', validatedStats);
      setStats(validatedStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Set up polling for real-time updates
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [user?.email]);

  useEffect(() => {
    // Update parking rate when user data changes
    setStats(prevStats => ({

      ...prevStats,
      parkingRate: parseInt(user?.hourlyRate) || 0
    }));
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Calculate totals for display
  const totalSpaces = stats.totalSpaces.twoWheeler + stats.totalSpaces.fourWheeler;
  const totalAvailableSpaces = stats.availableSpaces.twoWheeler + stats.availableSpaces.fourWheeler;
  const totalActiveBookings = stats.activeBookings.length;

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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
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
          value={totalAvailableSpaces.toString()} 
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
          value={totalActiveBookings.toString()} 
          icon={<Clock className="w-8 h-8 text-red-500" />}
          details={[{ label: 'Currently parked', value: totalActiveBookings.toString() }]}
        />
        <StatCard 
          title="Completed Bookings" 
          value={stats.completedBookings.toString()} 
          icon={<CheckSquare className="w-8 h-8 text-purple-500" />}
          details={[{ label: 'Total completed', value: stats.completedBookings.toString() }]}
        />
        <StatCard 
          title="Parking Rates" 
          value={`2W: ₹${adminData?.twoWheelerHourlyRate || 0}/hr`}
          icon={<Tag className="w-8 h-8 text-pink-500" />}
          details={[
            { label: "Two Wheeler Rate", value: `₹${adminData?.twoWheelerHourlyRate || 0}/hr` },
            { label: "Four Wheeler Rate", value: `₹${adminData?.fourWheelerHourlyRate || 0}/hr` }
          ]}
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
