import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Admin from './pages/Admin';

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;