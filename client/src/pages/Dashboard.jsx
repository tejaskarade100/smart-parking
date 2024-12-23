import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ParkingMap from '../components/ParkingMap';
import ParkingLocationCard from '../components/ParkingLocationCard';
import BookNow from '../components/BookNow';

// Function to generate random parking spots around a location
const generateParkingSpots = async (location = 'Pune') => {
  try {
    // Use OpenStreetMap Nominatim API to get coordinates
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data = await response.json();
    
    if (data && data[0]) {
      const { lat, lon } = data[0];
      const baseLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
      
      // Generate 4 random parking spots around the location
      return [
        {
          name: `${location} Central Parking`,
          lat: baseLocation.lat + (Math.random() - 0.5) * 0.05,
          lng: baseLocation.lng + (Math.random() - 0.5) * 0.05,
          price: `₹${Math.floor(Math.random() * 30 + 20)}/hr`,
          facilities: ["Covered Parking", "24/7 Security"]
        },
        {
          name: `${location} Mall Parking`,
          lat: baseLocation.lat + (Math.random() - 0.5) * 0.05,
          lng: baseLocation.lng + (Math.random() - 0.5) * 0.05,
          price: `₹${Math.floor(Math.random() * 30 + 20)}/hr`,
          facilities: ["Valet Parking", "EV Charging"]
        },
        {
          name: `${location} Station Parking`,
          lat: baseLocation.lat + (Math.random() - 0.5) * 0.05,
          lng: baseLocation.lng + (Math.random() - 0.5) * 0.05,
          price: `₹${Math.floor(Math.random() * 30 + 20)}/hr`,
          facilities: ["Open Parking"]
        },
        {
          name: `${location} Market Parking`,
          lat: baseLocation.lat + (Math.random() - 0.5) * 0.05,
          lng: baseLocation.lng + (Math.random() - 0.5) * 0.05,
          price: `₹${Math.floor(Math.random() * 30 + 20)}/hr`,
          facilities: ["CCTV Surveillance", "Covered Parking"]
        }
      ];
    }
    return [];
  } catch (error) {
    console.error('Error generating parking spots:', error);
    return [];
  }
};

const Dashboard = () => {
  const { state } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [showBookNow, setShowBookNow] = useState(false);
  const [bookingLocation, setBookingLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParkingSpots = async () => {
      setIsLoading(true);
      if (state?.location) {
        const spots = await generateParkingSpots(state.location);
        setParkingSpots(spots);
        if (spots.length > 0) {
          setSelectedLocation(spots[0]);
        }
      }
      setIsLoading(false);
    };

    fetchParkingSpots();
  }, [state?.location]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleBookNow = (location) => {
    setBookingLocation(location);
    setShowBookNow(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative">
      {/* Left Panel - 40% */}
      <div className="w-[40%] h-full flex flex-col bg-gray-50 border-r overflow-auto">
        <div className="p-4">
          <div className="space-y-3">
            {parkingSpots.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ParkingLocationCard
                  location={location}
                  onSelect={handleLocationSelect}
                  isSelected={selectedLocation && selectedLocation.name === location.name}
                  onBookNow={handleBookNow}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Map - 60% */}
      <div className="w-[60%] h-full relative">
        <ParkingMap
          locations={parkingSpots}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          onBookNow={handleBookNow}
        />
      </div>

      {/* BookNow Modal */}
      {showBookNow && bookingLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative z-[10000]">
            <BookNow
              location={bookingLocation}
              onClose={() => {
                setShowBookNow(false);
                setBookingLocation(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
