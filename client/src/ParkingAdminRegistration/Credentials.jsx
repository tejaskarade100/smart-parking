import React, { useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

// Create axios instance with base URL and configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

const Credentials = ({ formData, handleChange }) => {
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // Create debounced validation functions
  const debouncedValidateEmail = debounce(async (email) => {
    if (!email) {
      setEmailError('');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      const response = await api.post('/check-email', { email });
      console.log('Email check response:', response.data);
      if (response.data.exists) {
        setEmailError('This email is already registered');
      } else {
        setEmailError('');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      if (error.code === 'ERR_NETWORK') {
        setEmailError('Unable to connect to server. Please check your internet connection.');
      } else if (error.response) {
        setEmailError(error.response.data.message || 'Error validating email');
      } else {
        setEmailError('Error validating email. Please try again.');
      }
    }
  }, 500);

  const debouncedValidateUsername = debounce(async (username) => {
    if (!username) {
      setUsernameError('');
      return;
    }

    try {
      const response = await api.post('/check-username', { username });
      console.log('Username check response:', response.data);
      if (response.data.exists) {
        setUsernameError('This username is already taken');
      } else {
        setUsernameError('');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      if (error.code === 'ERR_NETWORK') {
        setUsernameError('Unable to connect to server. Please check your internet connection.');
      } else if (error.response) {
        setUsernameError(error.response.data.message || 'Error validating username');
      } else {
        setUsernameError('Error validating username. Please try again.');
      }
    }
  }, 500);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    handleChange(e);
    debouncedValidateEmail(value);
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    handleChange(e);
    debouncedValidateUsername(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Credentials</h2>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleEmailChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            emailError ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-600">{emailError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username || ''}
          onChange={handleUsernameChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            usernameError ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {usernameError && (
          <p className="mt-1 text-sm text-red-600">{usernameError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
};

export default Credentials;
