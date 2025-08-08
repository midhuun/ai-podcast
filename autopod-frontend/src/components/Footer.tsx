import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

function Footer() {
  return (
    <footer className="px-4 sm:px-6 py-12 sm:py-16 bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <span className="text-black font-bold text-sm">Z</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold">ZappPodcast</span>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base">
              Create professional AI-powered podcasts in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Product</h4>
            <div className="space-y-2">
              <Link to="/features" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Features</Link>
              <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Pricing</Link>
              <Link to="/testimonials" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Testimonials</Link>
              <Link to="/faq" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">FAQ</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Blog</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Tutorials</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Support Center</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Contact Us</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-base sm:text-lg">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Terms of Service</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Privacy Policy</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Cookie Policy</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">GDPR</a>
            </div>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-gray-700 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2024 ZappPodcast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;