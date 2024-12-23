import React, { useState } from 'react';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import HowItWorks from '../components/HowItWorks';
import ParkingMap from '../components/ParkingMap';
import BookNow from '../components/BookNow';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="relative flex-1 h-full">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 lg:ml-20">
              <h1 className="text-5xl font-bold leading-tight">
                Parking made easy,<br />
                wherever you go
              </h1>
              <SearchForm 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyPress={handleKeyPress} 
                onSubmit={handleSearch} 
              />
            </div>
            
            <div className="relative h-[500px] rounded-2xl overflow-hidden lg:mr-20">
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20240408/pngtree-cars-parked-in-the-outdoor-parking-lot-image_15649938.jpg"
                alt="Person using phone in parking garage"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 relative">
        <ParkingMap
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          onBookNow={handleBookNow}
        />
      </div>

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