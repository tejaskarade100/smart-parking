import React from 'react';

const SecurityAndAccess = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="securityMeasures" className="block text-sm font-medium text-gray-700">
          Security Measures
        </label>
        <div className="space-y-2">
          {['cctv', 'guards', 'access-control', 'lighting', 'emergency-response'].map((measure) => (
            <label key={measure} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={measure}
                name="securityMeasures"
                value={measure}
                checked={formData.securityMeasures?.includes(measure) || false}
                onChange={(e) => {
                  const measures = formData.securityMeasures || [];
                  if (e.target.checked) {
                    handleChange({
                      target: {
                        name: 'securityMeasures',
                        value: [...measures, measure]
                      }
                    });
                  } else {
                    handleChange({
                      target: {
                        name: 'securityMeasures',
                        value: measures.filter(m => m !== measure)
                      }
                    });
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 capitalize">{measure.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="accessHours" className="block text-sm font-medium text-gray-700">
          Access Hours
        </label>
        <select
          id="accessHours"
          name="accessHours"
          value={formData.accessHours || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Hours</option>
          <option value="24/7">24/7 Access</option>
          <option value="business">Business Hours (9 AM - 6 PM)</option>
          <option value="extended">Extended Hours (6 AM - 10 PM)</option>
          <option value="custom">Custom Hours</option>
        </select>
      </div>

      {formData.accessHours === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="openTime" className="block text-sm font-medium text-gray-700">
              Opening Time
            </label>
            <input
              type="time"
              id="openTime"
              name="openTime"
              value={formData.openTime || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="closeTime" className="block text-sm font-medium text-gray-700">
              Closing Time
            </label>
            <input
              type="time"
              id="closeTime"
              name="closeTime"
              value={formData.closeTime || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
          Emergency Contact Number
        </label>
        <input
          type="tel"
          id="emergencyContact"
          name="emergencyContact"
          value={formData.emergencyContact || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted || false}
            onChange={(e) => handleChange({
              target: {
                name: 'termsAccepted',
                value: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            I agree to the terms and conditions and privacy policy
          </span>
        </label>
      </div>
    </div>
  );
};

export default SecurityAndAccess;
