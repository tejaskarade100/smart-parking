import React, { useEffect } from 'react';
import HeroSection from '../components/AboutUs/HeroSection';
import ProblemSection from '../components/AboutUs/ProblemSection';
import SolutionSection from '../components/AboutUs/SolutionSection';
import FeaturesSection from '../components/AboutUs/FeaturesSection';
import VisionSection from '../components/AboutUs/VisionSection';
import CtaSection from '../components/AboutUs/CtaSection';
import Footer from '../components/Footer';

const AboutUs = () => {
  useEffect(() => {
    // Update document title
    document.title = 'About ParkEase - Transforming Parking, Simplifying Lives';
    
    // Add Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="bg-white">
      <main className="overflow-hidden font-open-sans">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <VisionSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
