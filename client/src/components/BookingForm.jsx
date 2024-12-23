import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaCar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingForm = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [distance, setDistance] = useState(5);
  const [facilities, setFacilities] = useState({
    evCharging: false,
    coveredParking: false,
    valet: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ location, date, time, vehicleType, priceRange, distance, facilities });
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
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="vehicleType">
          Vehicle Type
        </label>
        <div className="relative">
          <select
            id="vehicleType"
            className="w-full px-2 py-1 pl-8 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">Select vehicle type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
          </select>
          <FaCar className="absolute left-3 top-3 text-gray-400" />
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
