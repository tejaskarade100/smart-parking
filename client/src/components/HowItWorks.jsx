import React from "react";
import { motion } from "framer-motion";
import { Search, CreditCard, Car } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      title: "Look",
      description:
        "Search and compare prices at thousands of parking facilities across North America.",
      icon: Search,
      color: "from-blue-400 to-blue-600",
      iconColor: "#60A5FA",
    },
    {
      title: "Book",
      description:
        "Pay securely and receive a prepaid parking pass instantly via email or in the app.",
      icon: CreditCard,
      color: "from-green-400 to-green-600",
      iconColor: "#4ADE80",
    },
    {
      title: "Park",
      description:
        "When you arrive, follow the instructions included in your pass, park, and go!",
      icon: Car,
      color: "from-purple-400 to-purple-600",
      iconColor: "#C084FC",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
  How <span className="text-blue-600 font-bold text-4xl">PARK </span>
  <span className="font-bold text-4xl">EASE</span> Works
</h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className={`p-8 bg-gradient-to-r ${step.color}`}>
                <div className="flex justify-center mb-6">
                  <div className="bg-white rounded-full p-4">
                    <step.icon size={48} color={step.iconColor} />
                  </div>
                </div>
              </div>
              <div className="p-6 text-gray-800">
                <h3 className="text-2xl font-semibold mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
