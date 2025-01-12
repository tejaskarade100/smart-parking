import React from 'react';

const ParkingDetails = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="parkingName" className="block text-sm font-medium text-gray-700">
          Parking Name
        </label>
        <input
          type="text"
          id="parkingName"
          name="parkingName"
          value={formData.parkingName || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="parkingType" className="block text-sm font-medium text-gray-700">
          Parking Type
        </label>
        <select
          id="parkingType"
          name="parkingType"
          value={formData.parkingType || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Parking Type</option>
          <option value="commercial">Commercial</option>
          <option value="residential">Residential</option>
          <option value="event">Event</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Category</option>
          <option value="Operators">Operators</option>
          <option value="Monthly/Long-term Partners">Monthly/Long-term Partners</option>
          <option value="Airport/Railway/Bus Stand Operators">Airport/Railway/Bus Stand Operators</option>
          <option value="Event and Venue Partnerships">Event and Venue Partnerships</option>
          <option value="Municipalities">Municipalities</option>
          <option value="Property Managers">Property Managers</option>
          <option value="Spot Owners (Personal Parking Renters)">Spot Owners (Personal Parking Renters)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="parkingAddress" className="block text-sm font-medium text-gray-700">
          Full Address
        </label>
        <textarea
          id="parkingAddress"
          name="parkingAddress"
          value={formData.parkingAddress || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="totalSpaces" className="block text-sm font-medium text-gray-700">
          Total Spaces
        </label>
        <input
          type="number"
          id="totalSpaces"
          name="totalSpaces"
          value={formData.totalSpaces || ''}
          onChange={handleChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="twoWheelerSpaces" className="block text-sm font-medium text-gray-700">
          Two-Wheeler Spaces
        </label>
        <input
          type="number"
          id="twoWheelerSpaces"
          name="twoWheelerSpaces"
          value={formData.twoWheelerSpaces || ''}
          onChange={handleChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="fourWheelerSpaces" className="block text-sm font-medium text-gray-700">
          Four-Wheeler Spaces
        </label>
        <input
          type="number"
          id="fourWheelerSpaces"
          name="fourWheelerSpaces"
          value={formData.fourWheelerSpaces || ''}
          onChange={handleChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="twoWheelerHourlyRate" className="block text-sm font-medium text-gray-700">
          Two-Wheeler Hourly Rate (₹)
        </label>
        <input
          type="number"
          id="twoWheelerHourlyRate"
          name="twoWheelerHourlyRate"
          value={formData.twoWheelerHourlyRate || ''}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="fourWheelerHourlyRate" className="block text-sm font-medium text-gray-700">
          Four-Wheeler Hourly Rate (₹)
        </label>
        <input
          type="number"
          id="fourWheelerHourlyRate"
          name="fourWheelerHourlyRate"
          value={formData.fourWheelerHourlyRate || ''}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
          Hourly Rate (₹)
        </label>
        <input
          type="number"
          id="hourlyRate"
          name="hourlyRate"
          value={formData.hourlyRate || ''}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
};

export default ParkingDetails;
