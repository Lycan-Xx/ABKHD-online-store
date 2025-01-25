import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter basename="/ABKHD-online-store">
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={
          <div className="bg-gray-900 min-h-screen">
            <Navbar />
            <Hero />
            <Products />
            <Services />
            <FAQ />
            <Contact />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;