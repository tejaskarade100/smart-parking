import React from "react";
import { motion } from "framer-motion";
import { Search, CreditCard, Car, MapPin, Clock, Shield } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      title: "Find Parking",
      description:
        "Search and compare prices at thousands of secure parking facilities across India.",
      icon: MapPin,
      color: "from-blue-500/60 to-blue-500/70",
      iconColor: "#3B82F6",
    },
    {
      title: "Quick Booking",
      description:
        "Book and pay securely with instant digital parking pass delivery to your email.",
      icon: Clock,
      color: "from-emerald-500/60 to-emerald-500/70",
      iconColor: "#10B981",
    },
    {
      title: "Safe Parking",
      description:
        "Drive in, show your pass, and park with confidence in your reserved spot.",
      icon: Shield,
      color: "from-violet-500/60 to-violet-500/70",
      iconColor: "#8B5CF6",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            className="mb-8 inline-block"
          >
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gray-800">How </span>
            <motion.span 
              className="text-blue-600"
              variants={textVariants}
              initial="initial"
              animate="animate"
              custom={1}
            >
              PARK
            </motion.span>
            <motion.span 
              className="text-blue-400"
              variants={textVariants}
              initial="initial"
              animate="animate"
              custom={2}
            >
              EASE
            </motion.span>
            <span className="text-gray-800"> Works</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience hassle-free parking in three simple steps
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className={`p-8 bg-gradient-to-br ${step.color}`}>
                <div className="flex justify-center">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <step.icon size={32} strokeWidth={1.5} color={step.iconColor} />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
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
