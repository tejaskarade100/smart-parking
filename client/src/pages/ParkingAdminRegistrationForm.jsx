import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import PersonalInformation from "../ParkingAdminRegistration/PersonalInformation";
import Credentials from "../ParkingAdminRegistration/Credentials";
import ParkingDetails from "../ParkingAdminRegistration/ParkingDetails";
import SecurityAndAccess from "../ParkingAdminRegistration/SecurityAndAccess";
import VerificationDetails from "../ParkingAdminRegistration/VerificationDetails";
import ReviewAndSubmit from "../ParkingAdminRegistration/ReviewAndSubmit";

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
    try {
      const response = await axios.post('http://localhost:5000/api/admin/register', formData);
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminId', response.data.adminId);
        setShowSuccessPopup(true);
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleDashboardAccess = () => {
    setShowSuccessPopup(false);
    navigate('/admin/dashboard');
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"> 
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Parking Admin Registration
            </h2>
            <div className="mt-4">
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                  />
                </div>
                <div className="flex justify-between">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center ${
                        step.id === currentStep
                          ? "text-blue-600"
                          : step.id < currentStep
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`rounded-full transition duration-500 ease-in-out h-6 w-6 flex items-center justify-center ${
                          step.id === currentStep
                            ? "bg-blue-600 text-white"
                            : step.id < currentStep
                            ? "bg-green-600 text-white"
                            : "bg-gray-300"
                        }`}
                      >
                        {step.id < currentStep ? "✓" : step.id}
                      </div>
                      <div className="text-xs mt-1">{step.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <CurrentStepComponent formData={formData} handleChange={handleChange} />
              
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors ml-auto"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Success Popup */}
          {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h3>
                <p className="text-gray-600 mb-6">
                  Your parking admin account has been created successfully. You can now access your dashboard.
                </p>
                <button
                  onClick={handleDashboardAccess}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Access Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingAdminRegistrationForm;
