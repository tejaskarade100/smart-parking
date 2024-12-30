import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaCar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BookingForm = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [vehicleType, setVehicleType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [distance, setDistance] = useState(5);
  const [facilities, setFacilities] = useState({
    evCharging: false,
    coveredParking: false,
    valet: false,
  });

  // Fetch user's vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get(`/user/vehicles/${user._id}`);
        setVehicles(response.data);
        if (response.data.length > 0) {
          const defaultVehicle = response.data[0];
          setSelectedVehicle(defaultVehicle._id);
          setVehicleType(defaultVehicle.type || 'four-wheeler');
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    if (user?._id) {
      fetchVehicles();
    }
  }, [user?._id]);

  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);
    
    if (vehicleId) {
      const selectedVehicle = vehicles.find(v => v._id === vehicleId);
      if (selectedVehicle) {
        setVehicleType(selectedVehicle.type || 'four-wheeler');
      }
    } else {
      setVehicleType('');
    }
  };

  const handleVehicleTypeChange = async (e) => {
    const newType = e.target.value;
    setVehicleType(newType);
    
    // Update vehicle type in database immediately
    if (selectedVehicle) {
      try {
        await api.patch(`/user/vehicles/${selectedVehicle}`, {
          type: newType
        });
        // Update the vehicles array with the new type
        setVehicles(vehicles.map(vehicle => 
          vehicle._id === selectedVehicle 
            ? { ...vehicle, type: newType }
            : vehicle
        ));
      } catch (error) {
        console.error('Error updating vehicle type:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedVehicleDetails = vehicles.find(v => v._id === selectedVehicle);
    
    // Handle form submission with vehicle details
    const bookingData = {
      location,
      date,
      time,
      vehicle: {
        ...selectedVehicleDetails,
        type: vehicleType
      },
      priceRange,
      distance,
      facilities
    };
    
    console.log('Booking Data:', bookingData);
    // Submit booking data
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="location">
          Location
        </label>
        <div className="relative">
          <input
            type="text"
            id="location"
            className="w-full px-2 py-1 pl-8 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      <div className="mb-4 flex space-x-4">
        <div className="w-1/2">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="date">
            Date
          </label>
          <div className="relative">
            <DatePicker
              id="date"
              selected={date}
              onChange={(date) => setDate(date)}
              className="w-full px-2 py-1 pl-8 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="time">
            Time
          </label>
          <div className="relative">
            <input
              type="time"
              id="time"
              className="w-full px-2 py-1 pl-8 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <FaClock className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Vehicle Selection and Type */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="vehicle">
            Select Vehicle
          </label>
          <div className="relative">
            <select
              id="vehicle"
              className="w-full px-2 py-1 pl-8 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedVehicle}
              onChange={handleVehicleChange}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.makeModel} - {vehicle.licensePlate}
                </option>
              ))}
            </select>
            <FaCar className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Vehicle Type Selection - Always visible */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="vehicleType">
            Vehicle Type
          </label>
          <div className="relative">
            <select
              id="vehicleType"
              className="w-full px-2 py-1 pl-8 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={vehicleType}
              onChange={handleVehicleTypeChange}
            >
              <option value="two-wheeler">Two Wheeler</option>
              <option value="four-wheeler">Four Wheeler</option>
            </select>
            <FaCar className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Price Range (₹{priceRange[0]} - ₹{priceRange[1]})
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Distance ({distance} km)
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Facilities
        </label>
        <div className="flex flex-wrap">
          <label className="inline-flex items-center mr-4 mb-2">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500"
              checked={facilities.evCharging}
              onChange={(e) => setFacilities({ ...facilities, evCharging: e.target.checked })}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">EV Charging</span>
          </label>
          <label className="inline-flex items-center mr-4 mb-2">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500"
              checked={facilities.coveredParking}
              onChange={(e) => setFacilities({ ...facilities, coveredParking: e.target.checked })}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Covered Parking</span>
          </label>
          <label className="inline-flex items-center mr-4 mb-2">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500"
              checked={facilities.valet}
              onChange={(e) => setFacilities({ ...facilities, valet: e.target.checked })}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Valet Service</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 text-sm rounded focus:outline-none focus:shadow-outline"
      >
        Search Parking
      </button>
    </form>
  );
};

export default BookingForm;
