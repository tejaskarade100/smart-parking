import React from 'react';

const VerificationDetails = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="idType" className="block text-sm font-medium text-gray-700">
          ID Type
        </label>
        <select
          id="idType"
          name="idType"
          value={formData.idType || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select ID Type</option>
          <option value="aadhar">Aadhar Card</option>
          <option value="pan">PAN Card</option>
          <option value="driving">Driving License</option>
          <option value="passport">Passport</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
          ID Number
        </label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          value={formData.idNumber || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
          Business Type
        </label>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Business Type</option>
          <option value="individual">Individual</option>
          <option value="partnership">Partnership</option>
          <option value="company">Company</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
          GST Number (Optional)
        </label>
        <input
          type="text"
          id="gstNumber"
          name="gstNumber"
          value={formData.gstNumber || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
          Business Registration Number (Optional)
        </label>
        <input
          type="text"
          id="registrationNumber"
          name="registrationNumber"
          value={formData.registrationNumber || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="verificationConsent"
            checked={formData.verificationConsent || false}
            onChange={(e) => handleChange({
              target: {
                name: 'verificationConsent',
                value: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <span className="text-sm text-gray-700">
            I consent to verification of my provided details
          </span>
        </label>
      </div>
    </div>
  );
};

export default VerificationDetails;
