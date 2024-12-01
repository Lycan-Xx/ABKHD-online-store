import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Products from './components/Products/Products';
import Services from './components/Services/Services';
import FAQ from './components/FAQ/FAQ';
import Contact from './components/Contact/Contact';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <Hero />
      <Products />
      <Services />
      <FAQ />
      <Contact />
    </div>
  );
}

export default App;