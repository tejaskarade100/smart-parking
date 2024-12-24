import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    // Add your form submission logic here
    console.log("Form submitted:", formData);
    // Redirect to success page or dashboard
    navigate("/admin/dashboard");
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent formData={formData} handleChange={handleChange} />
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Previous
              </button>
              
              {currentStep === steps.length ? (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Registration
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Next Step
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParkingAdminRegistrationForm;
