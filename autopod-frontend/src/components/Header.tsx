import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="px-4 sm:px-6 py-4 border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/autopod-logo.jpg" 
            alt="AutoPod Logo" 
            className="w-10 h-10 rounded-lg object-cover transition-transform duration-300 hover:scale-110 shadow-lg"
          />
          <span className="text-lg sm:text-xl font-semibold">AutoPod</span>
        </Link>
        
        {/* <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/features" 
            className={`transition-colors duration-300 ${isActive('/features') ? 'text-white border-b-2 border-white pb-1' : 'text-gray-300 hover:text-white'}`}
          >
            Features
          </Link>
        </nav> */}

        {/* <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base">Login</Link>
          <Link to="/signup" className="bg-white text-black hover:bg-gray-200 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">Sign Up</Link>
        </div> */}
      </div>
    </header>
  );
}

export default Header;