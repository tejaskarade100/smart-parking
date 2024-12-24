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
      
      // Generate 5 random parking spots around the location
      const spots = [];
      const baseRates = [40, 50, 60, 70, 80]; // Different rates for spots
      
      for (let i = 0; i < 5; i++) {
        spots.push({
          name: `${location} Parking Spot ${i + 1}`,
          lat: baseLocation.lat + (Math.random() - 0.5) * 0.05,
          lng: baseLocation.lng + (Math.random() - 0.5) * 0.05,
          spotRate: baseRates[i], // Assign different rates
          price: `₹${baseRates[i]}/hr`,
          facilities: ["Covered Parking", "24/7 Security"]
        });
      }
      return spots;
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
      console.log('Setting search date time:', state);
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
    console.log('Selected location:', location);
    setSelectedLocation(location);
  };

  const handleBookNow = (location) => {
    console.log('Booking location with data:', { location, searchDateTime });
    setBookingLocation({
      ...location,
      spotRate: location.spotRate || location.rate || 40 // Ensure rate is passed
    });
    setBookingDateTime(searchDateTime);
    setShowBookNow(true);
  };

  const handleSearchSubmit = (dateTime) => {
    console.log('Search date time:', dateTime);
    setSearchDateTime({
      startDateTime: dateTime.startDateTime,
      endDateTime: dateTime.endDateTime
    });
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
          bookingDateTime={searchDateTime}
        />
      )}
    </div>
  );
};

export default Dashboard;
