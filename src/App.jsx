import React from 'react';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
=======
>>>>>>> merge-test
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
<<<<<<< HEAD
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
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
=======

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
>>>>>>> merge-test
  );
}

export default App;