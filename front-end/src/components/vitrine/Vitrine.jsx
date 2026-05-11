import React from 'react';
import Navbar from '../shared/Navbar';
import Hero from './Hero';
import Features from './Features';
import Gallery from './Gallery';
import SocialProof from './SocialProof';
import Pricing from './Pricing';
import Footer from '../shared/Footer';

const Vitrine = () => {
  return (
    <div className="min-h-screen bg-[#040a14] font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Gallery />
        <SocialProof />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Vitrine;
