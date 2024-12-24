import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import HowItWorks from '../components/HowItWorks';
import BookNow from '../components/BookNow';
import { useNavigate } from 'react-router-dom';
import { Car, ParkingSquare, MapPin } from 'lucide-react';

const locations = [
  {
    name: "City Center Parking",
    lat: 18.5204,
    lng: 73.8567,
    price: "$6/hour",
    facilities: ["CCTV", "24/7", "Covered"]
  },
  {
    name: "Mall Parking Complex",
    lat: 18.5304,
    lng: 73.8467,
    price: "$5/hour",
    facilities: ["Security", "EV Charging"]
  },
  {
    name: "Station Parking",
    lat: 18.5104,
    lng: 73.8667,
    price: "$4/hour",
    facilities: ["Open 24/7", "Bike Parking"]
  }
];

const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleBookNow = (location) => {
    setSelectedLocation(location);
    setShowBooking(true);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate('/dashboard', { state: { location: searchTerm.trim() } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="relative flex-1 h-full">
      <Header />
      
      <motion.section 
        className="pt-32 pb-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-8 lg:ml-20" variants={itemVariants}>
              <h1 className="text-5xl font-bold leading-tight">
                Parking made easy,<br />
                <span className="text-blue-600">wherever you go</span>
              </h1>
              <SearchForm 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyPress={handleKeyPress} 
                onSubmit={handleSearch} 
              />
              <motion.div 
                className="flex space-x-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center">
                  <Car className="text-blue-500 mr-2" />
                  <span>Easy Booking</span>
                </div>
                <div className="flex items-center">
                  <ParkingSquare className="text-blue-500 mr-2" />
                  <span>Secure Parking</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-blue-500 mr-2" />
                  <span>Multiple Locations</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative h-[500px] rounded-2xl overflow-hidden lg:mr-20 shadow-2xl"
              variants={itemVariants}
            >
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20240408/pngtree-cars-parked-in-the-outdoor-parking-lot-image_15649938.jpg"
                alt="Person using phone in parking garage"
                className="object-cover w-full h-full"
              />
              <motion.div 
                className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm font-semibold">Find parking near you</p>
                <p className="text-xs text-gray-600">100+ locations available</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {showBooking && selectedLocation && (
        <BookNow
          location={selectedLocation}
          onClose={() => setShowBooking(false)}
        />
      )}

      <HowItWorks />
    </div>
  );
};

export default Home;
