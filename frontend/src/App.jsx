import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Admin from './pages/Admin';
import Footer from './components/Footer';


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
			<Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;