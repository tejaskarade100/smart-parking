import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { format, parse } from 'date-fns';
import { Search, Calendar, MapPin, Clock } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

function SearchForm() {
  const [searchType, setSearchType] = useState('hourly');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date;
  });
  const [startDateInput, setStartDateInput] = useState(format(new Date(), "MMM dd, yyyy HH:mm"));
  const [endDateInput, setEndDateInput] = useState(format(new Date().setHours(new Date().getHours() + 24), "MMM dd, yyyy HH:mm"));
  const navigate = useNavigate();

  const handleSearch = () => {
    if (location.trim()) {
      // Convert dates to ISO strings for consistent format
      const searchData = {
        location: location.trim(),
        searchType,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString()
      };
      console.log('Search data:', searchData);
      navigate('/dashboard', { state: searchData });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && location.trim()) {
      handleSearch();
    }
  };

  const handleDateInputChange = (inputValue, setDate, setInputValue, isStartDate = false) => {
    setInputValue(inputValue);
    try {
      const parsedDate = parse(inputValue, "MMM dd, yyyy HH:mm", new Date());
      if (parsedDate instanceof Date && !isNaN(parsedDate)) {
        const now = new Date();
        
        if (isStartDate) {
          // Prevent selecting time before current time
          if (parsedDate < now) {
            setDate(now);
            setInputValue(format(now, "MMM dd, yyyy HH:mm"));
            return;
          }
          
          // Update end date to be 24 hours after start date
          const newEndDate = new Date(parsedDate);
          newEndDate.setHours(newEndDate.getHours() + 24);
          setEndDate(newEndDate);
          setEndDateInput(format(newEndDate, "MMM dd, yyyy HH:mm"));
        } else {
          // Prevent selecting end date before start date
          if (parsedDate <= startDate) {
            const minEndDate = new Date(startDate);
            minEndDate.setHours(minEndDate.getHours() + 1);
            setDate(minEndDate);
            setInputValue(format(minEndDate, "MMM dd, yyyy HH:mm"));
            return;
          }
        }
        setDate(parsedDate);
      }
    } catch (error) {
      console.error('Date parsing error:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-xl space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-gray-100 p-1 rounded-lg inline-flex"
        variants={itemVariants}
      >
        <motion.button
          onClick={() => setSearchType('hourly')}
          className={`px-6 py-2 rounded-md text-sm transition-colors duration-200 ${
            searchType === 'hourly'
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Hourly/Daily
        </motion.button>
        <motion.button
          onClick={() => setSearchType('monthly')}
          className={`px-6 py-2 rounded-md text-sm transition-colors duration-200 ${
            searchType === 'monthly'
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Monthly
        </motion.button>
      </motion.div>

      <motion.div className="space-y-3" variants={itemVariants}>
        <motion.div className="relative" variants={itemVariants}>
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Where are you going?"
            className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </motion.div>
        
        <motion.div className="relative" variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={startDateInput}
              onChange={(e) => handleDateInputChange(e.target.value, setStartDate, setStartDateInput, true)}
              placeholder="MMM DD, YYYY HH:MM"
              className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                const now = new Date();
                if (date < now) {
                  date = now;
                }
                setStartDate(date);
                setStartDateInput(format(date, "MMM dd, yyyy HH:mm"));
                
                // Update end date to be 24 hours after start date
                const newEndDate = new Date(date);
                newEndDate.setHours(newEndDate.getHours() + 24);
                setEndDate(newEndDate);
                setEndDateInput(format(newEndDate, "MMM dd, yyyy HH:mm"));
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={60}
              minDate={new Date()}
              timeCaption="time"
              dateFormat="MMM d, yyyy h:mm aa"
              customInput={
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center p-1 bg-transparent text-gray-700 hover:text-blue-500 transition-colors duration-200">
                  <Calendar className="text-gray-800" size={18} />
                </button>
              }
            />
          </div>
        </motion.div>

        <motion.div className="relative" variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={endDateInput}
              onChange={(e) => handleDateInputChange(e.target.value, setEndDate, setEndDateInput, false)}
              placeholder="MMM DD, YYYY HH:MM"
              className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                // Ensure minimum 1 hour difference
                const minEndDate = new Date(startDate);
                minEndDate.setHours(minEndDate.getHours() + 1);
                
                if (date <= startDate || date < minEndDate) {
                  date = minEndDate;
                }
                
                setEndDate(date);
                setEndDateInput(format(date, "MMM dd, yyyy HH:mm"));
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={60}
              minDate={startDate}
              timeCaption="time"
              dateFormat="MMM d, yyyy h:mm aa"
              customInput={
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center p-1 bg-transparent text-gray-700 hover:text-blue-500 transition-colors duration-200">
                  <Calendar className="text-gray-800" size={18} />
                </button>
              }
            />
          </div>
        </motion.div>

        <motion.button 
          onClick={handleSearch}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Search className="mr-2" size={20} />
          Find Parking Spots
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default SearchForm;
