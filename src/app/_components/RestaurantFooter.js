import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import React from 'react';

const RestaurantFooter = () => {
  return (
    <footer className="bg-[#f6f6f6] text-gray-700 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        
        <div>
          <h2 className="text-xl font-semibold text-orange-500 mb-2">RestoApp</h2>
          <p className="text-xs">© {new Date().getFullYear()} RestoApp Limited</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Company</h3>
          <ul className="space-y-1">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Team</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Legal</h3>
          <ul className="space-y-1">
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Social Links</h3>
          <div className="flex gap-4 text-lg text-gray-600">
            <FaInstagram className="hover:text-orange-500" />
            <FaFacebookF className="hover:text-orange-500" />
            <FaTwitter className="hover:text-orange-500" />
            <FaLinkedinIn className="hover:text-orange-500" />
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-xs text-gray-500">
        For a better experience, download the RestoApp mobile app
      </div>
    </footer>
  );
};

export default RestaurantFooter;
