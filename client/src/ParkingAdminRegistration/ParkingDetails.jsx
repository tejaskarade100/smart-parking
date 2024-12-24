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

      <div className="space-y-2">
        <label htmlFor="purposeOfAccess" className="block text-sm font-medium text-gray-700">
          Purpose of Access
        </label>
        <textarea
          id="purposeOfAccess"
          name="purposeOfAccess"
          value={formData.purposeOfAccess || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
          Additional Comments/Notes
        </label>
        <textarea
          id="additionalComments"
          name="additionalComments"
          value={formData.additionalComments || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default ParkingDetails;
