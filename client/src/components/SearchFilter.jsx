import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const SearchFilter = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    priceRange: {
      min: '',
      max: ''
    },
    vehicleType: 'all',
    securityFeatures: [],
    accessHours: 'all'
  });

  const securityFeaturesList = [
    'CCTV',
    'Security Guard',
    'Emergency Response',
    'Access Control',
    'Proper Lighting'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (type, value) => {
    const newPriceRange = { ...filters.priceRange, [type]: value };
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSecurityFeatureToggle = (feature) => {
    const newFeatures = filters.securityFeatures.includes(feature)
      ? filters.securityFeatures.filter(f => f !== feature)
      : [...filters.securityFeatures, feature];
    
    const newFilters = { ...filters, securityFeatures: newFeatures };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      priceRange: { min: '', max: '' },
      vehicleType: 'all',
      securityFeatures: [],
      accessHours: 'all'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      {/* Search and Expand Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search locations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 p-2 rounded-lg bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Price Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Min"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Max"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              />
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vehicle Type
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={filters.vehicleType}
              onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="two-wheeler">Two Wheeler</option>
              <option value="four-wheeler">Four Wheeler</option>
            </select>
          </div>

          {/* Security Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Security Features
            </label>
            <div className="flex flex-wrap gap-2">
              {securityFeaturesList.map((feature) => (
                <button
                  key={feature}
                  onClick={() => handleSecurityFeatureToggle(feature)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.securityFeatures.includes(feature)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  } hover:opacity-90 transition-colors`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Access Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Access Hours
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={filters.accessHours}
              onChange={(e) => handleFilterChange('accessHours', e.target.value)}
            >
              <option value="all">All Hours</option>
              <option value="24/7">24/7</option>
              <option value="day">Day Time Only</option>
              <option value="custom">Custom Hours</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchFilter;
