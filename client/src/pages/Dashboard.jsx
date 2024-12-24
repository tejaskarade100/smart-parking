import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ParkingMap from '../components/ParkingMap';
import ParkingLocationCard from '../components/ParkingLocationCard';
import BookNow from '../components/BookNow';
import SearchForm from '../components/SearchForm';

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
          name: `${location} School Parking`,
          lat: baseLocation.lat + (Math.random() - 0.5) * 0.05,
          lng: baseLocation.lng + (Math.random() - 0.5) * 0.05,
          price: `₹${Math.floor(Math.random() * 30 + 20)}/hr`,
          facilities: ["Open and secure Parking"]
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
  const [bookingDateTime, setBookingDateTime] = useState(new Date());
  const [searchDateTime, setSearchDateTime] = useState({
    startDateTime: null,
    endDateTime: null
  });

  useEffect(() => {
    if (state?.startDateTime && state?.endDateTime) {
      setSearchDateTime({
        startDateTime: state.startDateTime,
        endDateTime: state.endDateTime
      });
    }
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
  }, [state?.location, state?.startDateTime, state?.endDateTime]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleBookNow = (location) => {
    setBookingLocation(location);
    setShowBookNow(true);
  };

  const handleSearchSubmit = (dateTime) => {
    setBookingDateTime(dateTime);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Main content container that starts below header */}
      <div className="flex flex-1 mt-16"> {/* mt-16 accounts for header height */}
        {/* Left Panel - 40% */}
        <div className="w-2/5 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Available Parking Spots</h2>
            {parkingSpots.map((spot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <ParkingLocationCard
                  location={spot}
                  isSelected={selectedLocation === spot}
                  onSelect={() => handleLocationSelect(spot)}
                  onBookNow={() => handleBookNow(spot)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel - 60% */}
        <div className="w-3/5 h-[calc(100vh-4rem)]">
          <ParkingMap
            locations={parkingSpots}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </div>

      {/* BookNow Modal */}
      {showBookNow && (
          <BookNow 
            onClose={() => setShowBookNow(false)}
            location={bookingLocation}
            bookingDateTime={{
              startDateTime: searchDateTime.startDateTime,
              endDateTime: searchDateTime.endDateTime
            }}
          />
        )}
    </div>
  );
};

export default Dashboard;
