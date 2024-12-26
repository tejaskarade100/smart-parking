import React from 'react';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import ParkingStatusVisualization from './ParkingStatusVisualization';
import { Car, Bike, DollarSign, Clock } from 'lucide-react';

const MainContent = () => {
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
          value="150" 
          icon={<Car className="w-8 h-8 text-blue-500" />}
          details={[
            { label: 'Two-wheelers', value: '50' },
            { label: 'Four-wheelers', value: '100' }
          ]}
        />
        <StatCard 
          title="Available Slots" 
          value="73" 
          icon={<Bike className="w-8 h-8 text-green-500" />}
          details={[
            { label: 'Two-wheelers', value: '28' },
            { label: 'Four-wheelers', value: '45' }
          ]}
        />
        <StatCard 
          title="Revenue" 
          value="$1,250" 
          icon={<DollarSign className="w-8 h-8 text-yellow-500" />}
          details={[{ label: "Today's earnings", value: '' }]}
        />
        <StatCard 
          title="Pending Bookings" 
          value="5" 
          icon={<Clock className="w-8 h-8 text-red-500" />}
          details={[{ label: 'Awaiting approval', value: '' }]}
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
