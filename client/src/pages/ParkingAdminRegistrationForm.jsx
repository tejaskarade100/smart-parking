import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import PersonalInformation from "../components/AdminRegistration/PersonalInformation";
import Credentials from "../components/AdminRegistration/Credentials";
import ParkingDetails from "../components/AdminRegistration/ParkingDetails";
import SecurityAndAccess from "../components/AdminRegistration/SecurityAndAccess";
import VerificationDetails from "../components/AdminRegistration/VerificationDetails";
import ReviewAndSubmit from "../components/AdminRegistration/ReviewAndSubmit";

const steps = [
  { id: 1, name: "Personal Information", component: PersonalInformation },
  { id: 2, name: "Credentials", component: Credentials },
  { id: 3, name: "Parking Details", component: ParkingDetails },
  { id: 4, name: "Security & Access", component: SecurityAndAccess },
  { id: 5, name: "Verification", component: VerificationDetails },
  { id: 6, name: "Review & Submit", component: ReviewAndSubmit },
];

const ParkingAdminRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'securityMeasures') {
        const updatedMeasures = formData.securityMeasures || [];
        if (checked) {
          setFormData(prev => ({
            ...prev,
            securityMeasures: [...updatedMeasures, value]
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            securityMeasures: updatedMeasures.filter(measure => measure !== value)
          }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      // Basic validation
      if (!formData.email || !formData.username || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Password validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/admin/register', formData);
      
      if (response.data && response.data.success) {
        // Store token and admin ID
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminId', response.data.adminId);
        
        // Show success message and clear any errors
        setShowSuccessPopup(true);
        setError("");
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'An error occurred during registration. Please try again.'
      );
      setShowSuccessPopup(false);
    }
  };

  const handleDashboardAccess = () => {
    setShowSuccessPopup(false);
    navigate('/admin/dashboard');
  };

  const CurrentStep = steps[currentStep - 1].component;
  
  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <nav className="mb-6">
          <ol className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step) => (
              <li
                key={step.id}
                className={`flex items-center ${
                  currentStep === step.id ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
                      currentStep === step.id
                        ? "bg-indigo-600 text-white"
                        : currentStep > step.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {currentStep > step.id ? "✓" : step.id}
                  </span>
                  <span className="text-xs font-medium text-center whitespace-nowrap">
                    {step.name}
                  </span>
                </div>
                {step.id !== steps.length && (
                  <div className="flex-1 h-px bg-gray-300 mx-2 relative top-[-10px]"></div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form */}
        <div className="bg-white shadow rounded-lg max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {showSuccessPopup ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
                  <p className="text-gray-600 mb-8">Your parking admin account has been created successfully. You can now login to your admindashboard.</p>
                  <button
                    onClick={handleDashboardAccess}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    LOGIN AS ADMIN
                  </button>
                </div>
              ) : (
                <React.Fragment>
                  <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
                    <CurrentStep
                      formData={formData}
                      handleChange={handleChange}
                      onSubmit={currentStep === steps.length ? handleSubmit : undefined}
                    />
                    {error && (
                      <div className="mt-4 text-red-600 text-sm">{error}</div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-between border-t pt-4">
                    {currentStep > 1 && (
                      <button
                        onClick={handlePrevious}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Previous
                      </button>
                    )}
                    {currentStep < steps.length && (
                      <button
                        onClick={handleNext}
                        className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </React.Fragment>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ParkingAdminRegistrationForm;
