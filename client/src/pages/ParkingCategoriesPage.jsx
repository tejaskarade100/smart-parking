import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../ParkingCategories/Header';
import CategoryCard from '../ParkingCategories/CategoryCard';
import Footer from '../ParkingCategories/Footer';
import DetailModal from '../ParkingCategories/DetailModal';
import { categories } from '../ParkingCategories/data/categories';

const ParkingCategoriesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.h2 
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explore the various parking solutions tailored for every need
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.title}
              category={category}
              onLearnMore={() => setSelectedCategory(category.title)}
              index={index}
            />
          ))}
        </div>
      </main>
      <div className="flex justify-center mt-12 mb-16">
        <motion.button
          onClick={() => navigate('/admin-registration')}
          className="px-8 py-4 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Partner with Us Today!
        </motion.button>
      </div>
      <Footer />
      {selectedCategory && (
        <DetailModal
          category={categories.find(c => c.title === selectedCategory)}
          onClose={() => setSelectedCategory(null)}
        />
      )}
      
    </div>
  );
};

export default ParkingCategoriesPage;
