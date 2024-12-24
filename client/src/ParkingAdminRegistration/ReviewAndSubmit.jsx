import React from 'react';
import { useFormContext } from 'react-hook-form';

const ReviewAndSubmit = () => {
  const { getValues } = useFormContext();
  const values = getValues();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Review and Submit</h2>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <p>Full Name: {values.fullName}</p>
        <p>Email: {values.email}</p>
        <p>Phone: {values.phoneNumber}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Credentials</h3>
        <p>Username: {values.username}</p>
        <p>Password: ********</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Verification Details</h3>
        <p>Organization: {values.organizationName}</p>
        <p>Job Title: {values.jobTitle}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Security and Access</h3>
        <p>Access Level: {values.accessLevel}</p>
        <p>2FA Enabled: {values.twoFactorAuth ? 'Yes' : 'No'}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Parking Details</h3>
        <p>Parking Name: {values.parkingName}</p>
        <p>Address: {values.parkingAddress}</p>
        <p>Total Spaces: {values.totalSpaces}</p>
        <p>Two-Wheeler Spaces: {values.twoWheelerSpaces}</p>
        <p>Four-Wheeler Spaces: {values.fourWheelerSpaces}</p>
        <p>Hourly Rate: ${values.hourlyRate}</p>
      </div>
      <p className="text-sm text-gray-600">Please review the information above before submitting. If you need to make any changes, you can go back to the previous steps using the 'Previous' button.</p>
    </div>
  );
};

export default ReviewAndSubmit;

