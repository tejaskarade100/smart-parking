import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ParkingMap from '../components/ParkingMap';
import ParkingLocationCard from '../components/ParkingLocationCard';
import BookNow from '../components/BookNow';
import SearchForm from '../components/SearchForm';
import axios from 'axios';

// Function to fetch real parking spots from admins
const fetchParkingSpots = async (location = 'Pune') => {
  try {
    // First get coordinates for the searched location
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const geoData = await geoResponse.json();
    
    if (geoData && geoData[0]) {
      const { lat, lon } = geoData[0];
      
      // Fetch parking spots from our backend
      const response = await axios.get(`/api/admin/parking-spots?location=${encodeURIComponent(location)}`);
      const adminSpots = response.data;
      
      // Transform admin data to match our parking spot format
      return adminSpots.map(spot => ({
        name: spot.parkingName,
        adminId: spot._id,
        adminUsername: spot.username, // Changed from adminName to adminUsername
        lat: spot.latitude || parseFloat(lat), // Use admin's lat or center location
        lng: spot.longitude || parseFloat(lon), // Use admin's lng or center location
        spotRate: spot.hourlyRate,
        price: `₹${spot.hourlyRate}/hr`,
        facilities: spot.facilities || ["Covered Parking", "24/7 Security"],
        address: spot.parkingAddress,
        city: spot.city,
        state: spot.state,
        parkingType: spot.parkingType,
        category: spot.category,
        twoWheelerSpaces: spot.twoWheelerSpaces,
        fourWheelerSpaces: spot.fourWheelerSpaces
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching parking spots:', error);
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
  const [locationError, setLocationError] = useState('');
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
    const loadParkingSpots = async () => {
      setIsLoading(true);
      if (state?.location) {
        const spots = await fetchParkingSpots(state.location);
        setParkingSpots(spots);
        if (spots.length > 0) {
          setSelectedLocation(spots[0]);
        }
      }
      setIsLoading(false);
    };

    loadParkingSpots();
  }, [state?.location, state?.startDateTime, state?.endDateTime]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationError(''); // Clear any previous error
  };

  const handleBookNow = (location) => {
    setBookingLocation({
      ...location,
      spotRate: location.spotRate || location.hourlyRate || 40
    });
    setShowBookNow(true);
  };

  const handleSearchSubmit = async (formData) => {
    if (!formData.location?.trim()) {
      setLocationError('Please enter a location to search');
      return;
    }
    setLocationError(''); // Clear error if location is provided
    setIsLoading(true);
    
    const spots = await fetchParkingSpots(formData.location);
    setParkingSpots(spots);
    if (spots.length > 0) {
      setSelectedLocation(spots[0]);
    }
    setIsLoading(false);
    
    setSearchDateTime({
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime
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
      <SearchForm 
        onSubmit={handleSearchSubmit}
        error={locationError}
      />
    </div>
  );
};

export default Dashboard;
