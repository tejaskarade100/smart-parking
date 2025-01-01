import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

const SplashScreen = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);

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
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((prev) => {
        const nextProgress = Math.min(prev + 1, 100);
        if (nextProgress === 100) onFinished();
        return nextProgress;
      });
    }, 30);

    return () => clearTimeout(timer);
  }, [progress, onFinished]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMEw5My4zMDEyNyAyNUw5My4zMDEyNyA3NUw1MCAxMDBMNi42OTg3MyA3NUw2LjY5ODczIDI1WiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] bg-repeat opacity-30" />
      </motion.div>

      <div className="relative text-white text-center z-10">
        {/* Logo Animation */}
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          className="mb-12 scale-150"
        >
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Car className="text-white w-16 h-16" />
            </motion.div>
            <div className="flex items-center">
              <motion.span 
                className="text-white font-bold text-6xl"
                variants={textVariants}
                initial="initial"
                animate="animate"
                custom={1}
              >
                PARK
              </motion.span>
              <motion.span 
                className="font-bold text-6xl text-blue-200"
                variants={textVariants}
                initial="initial"
                animate="animate"
                custom={2}
              >
                 EASE
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-xl text-blue-100 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Smart Parking Solutions
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="relative w-64 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div className="h-2 bg-blue-800/30 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-200 to-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.03 }}
            />
          </div>
          <motion.div
            className="absolute -right-8 top-1/2 -translate-y-1/2 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            {progress}%
          </motion.div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full"
            initial={{
              opacity: 0,
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100
            }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
