import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaApple, FaGooglePlay, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import orange_logo from "../../../public/orange_logo.png";

const RestaurantFooter = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">

                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <Link href={'/'} className="inline-block mb-4">
                            <Image
                                src={orange_logo}
                                alt="Restaurant Logo"
                                width={180}
                                height={60}
                                className="rounded-xl"
                            />
                        </Link>
                        <p className="text-gray-300 mb-6 max-w-md text-lg leading-relaxed">
                            Delivering delicious meals to your doorstep. Experience the finest cuisine with fast delivery and exceptional service.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-300">
                                <FaMapMarkerAlt className="text-[#fc8019] flex-shrink-0" />
                                <span>123 Food Street, Culinary City, CC 12345</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <FaPhone className="text-[#fc8019] flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <FaEnvelope className="text-[#fc8019] flex-shrink-0" />
                                <span>support@restoapp.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <FaClock className="text-[#fc8019] flex-shrink-0" />
                                <span>Open 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-[#fc8019] pl-3">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-2 h-2 bg-[#fc8019] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-2 h-2 bg-[#fc8019] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Our Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-2 h-2 bg-[#fc8019] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-2 h-2 bg-[#fc8019] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-2 h-2 bg-[#fc8019] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Download */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-[#fc8019] pl-3">Legal & App</h3>

                        {/* Legal Links */}
                        <ul className="space-y-3 mb-6">
                            <li>
                                <Link href="/terms" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-[#fc8019] transition-colors duration-300">
                                    FAQ
                                </Link>
                            </li>
                        </ul>

                        {/* Download App */}
                        <div>
                            <h4 className="font-semibold mb-3 text-gray-300">Download Our App</h4>
                            <div className="flex flex-col gap-3">
                                <button className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 transition-colors duration-300 px-4 py-3 rounded-lg border border-gray-700">
                                    <FaApple className="text-2xl" />
                                    <div className="text-left">
                                        <div className="text-xs text-gray-400">Download on the</div>
                                        <div className="font-semibold">App Store</div>
                                    </div>
                                </button>
                                <button className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 transition-colors duration-300 px-4 py-3 rounded-lg border border-gray-700">
                                    <FaGooglePlay className="text-xl" />
                                    <div className="text-left">
                                        <div className="text-xs text-gray-400">Get it on</div>
                                        <div className="font-semibold">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Copyright */}
                    <div className="text-gray-400 text-sm">
                        <p>© {new Date().getFullYear()} RestoApp Limited. All rights reserved.</p>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-6">
                        <a href="#" className="bg-gray-800 hover:bg-[#fc8019] transition-all duration-300 p-3 rounded-full transform hover:scale-110">
                            <FaFacebookF className="text-lg" />
                        </a>
                        <a href="#" className="bg-gray-800 hover:bg-[#fc8019] transition-all duration-300 p-3 rounded-full transform hover:scale-110">
                            <FaInstagram className="text-lg" />
                        </a>
                        <a href="#" className="bg-gray-800 hover:bg-[#fc8019] transition-all duration-300 p-3 rounded-full transform hover:scale-110">
                            <FaTwitter className="text-lg" />
                        </a>
                        <a href="#" className="bg-gray-800 hover:bg-[#fc8019] transition-all duration-300 p-3 rounded-full transform hover:scale-110">
                            <FaLinkedinIn className="text-lg" />
                        </a>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span>We accept:</span>
                        <div className="flex gap-2">
                            <div className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-800">VISA</div>
                            <div className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-800">MC</div>
                            <div className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-800">PayPal</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Subscription */}
            {/* <div className="bg-[#fc8019] py-8">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                    <p className="text-orange-100 mb-4">Subscribe to our newsletter for exclusive deals and updates</p>
                    <div className="max-w-md mx-auto flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div> */}
        </footer>
    );
};

export default RestaurantFooter;