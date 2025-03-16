import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';

const Hero = () => {
  // State for image to prevent regeneration on re-renders
  const [randomSeed, setRandomSeed] = useState(Math.floor(Math.random() * 1000));
  
  useEffect(() => {
    // More efficient animation using CSS variables and requestAnimationFrame
    const glitchElements = document.querySelectorAll('.glitch-text');
    let animationFrame;
    
    const triggerGlitch = () => {
      glitchElements.forEach(el => {
        el.classList.add('glitching');
        setTimeout(() => el.classList.remove('glitching'), 800);
      });
      
      animationFrame = setTimeout(triggerGlitch, 5000);
    };
    
    triggerGlitch();
    return () => clearTimeout(animationFrame);
  }, []);

  return (
    <section className="min-h-screen relative bg-gradient-to-b from-gray-900 to-black flex items-center justify-center overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Soft ambient light effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-400 opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-teal-400 opacity-5 blur-3xl"></div>
      
      {/* Main content container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side: Text content */}
          <div className="text-left space-y-8 mt-8	">

            
            <h1 className="font-light text-5xl lg:text-6xl tracking-tight text-white">
              <span className="block font-normal">Give Technology</span>
              <span className="block text-teal-400 font-medium mt-2 glitch-text">
                A Second Life
              </span>
            </h1>
            
            <p className="text-lg leading-relaxed text-gray-300 max-w-lg font-light">
            	Quality-tested
			  <span className="text-teal-400 text-xl font-mono"> SECOND HAND </span>
				devices at fair prices. We believe in extending the lifecycle of electronics while making technology accessible to everyone.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-6">
              <Link to="products" smooth={true} duration={800}>
                <button className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-normal rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-1">
                  Browse Devices
                </button>
              </Link>
              
              <Link to="about" smooth={true} duration={800}>
                <button className="px-8 py-3 bg-transparent border border-gray-400 hover:border-teal-400 text-gray-300 hover:text-teal-400 font-normal rounded-md transition-all duration-300">
                  Our Promise
                </button>
              </Link>
            </div>
          </div>
          
          {/* Right side: Device image with simpler framing */}
          <div className="relative h-96 flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group transition-all duration-500">
              {/* Frame with subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/20 to-blue-900/20 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Random Picsum image */}
              <img 
                src={`https://picsum.photos/seed/${randomSeed}/600/600`}
                alt="Premium Certified Device" 
                className="relative w-full h-full object-cover max-h-96 group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Quality badge */}
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm py-2 px-4 rounded-full">
                <p className="text-teal-400 text-sm font-medium">100% Tested & Certified</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Simplified scroll indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Link to="products" smooth={true} duration={800} className="cursor-pointer group">
            <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
              <p className="text-gray-400 group-hover:text-teal-400 text-sm transition-colors duration-300">Discover More</p>
              <svg className="w-6 h-6 text-teal-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Simple, elegant footer divider */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      
    </section>
  );
};

export default Hero;