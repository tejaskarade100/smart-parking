import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/ParkingCategories/Header';
import CategoryCard from '../components/ParkingCategories/CategoryCard';
import Footer from '../components/ParkingCategories/Footer';
import DetailModal from '../components/ParkingCategories/DetailModal';
import { categories } from '../components/ParkingCategories/data/categories';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const ParkingCategoriesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Explore the various parking solutions
            <span className="block text-blue-600">tailored for every need</span>
          </h2>
          <p className="text-xl text-gray-600">
            Whether you're looking for short-term or long-term parking solutions,
            we have options that perfectly match your requirements.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.title}
              category={category}
              onLearnMore={() => setSelectedCategory(category)}
              index={index}
            />
          ))}
        </motion.div>

        <motion.div 
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 text-center">
            Ready to revolutionize your parking experience?
          </h3>
          <motion.button
            onClick={() => navigate('/admin-registration')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl 
                     text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200
                     hover:from-blue-700 hover:to-blue-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Partner with Us Today!
          </motion.button>
        </motion.div>
      </main>

      <Footer />

      {selectedCategory && (
        <DetailModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};

export default ParkingCategoriesPage;
