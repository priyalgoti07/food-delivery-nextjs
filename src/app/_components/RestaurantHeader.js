'use client'
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../../public/food-logo.png";

import {
    FiHome,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronDown,
    FiSettings,
    FiBell,
    FiSearch,
    FiBarChart2,
    FiPackage,
    FiDollarSign,
    FiTrendingUp
} from 'react-icons/fi';
import {
    HiOutlineUser,
    HiOutlineViewGrid,
    HiOutlineClipboardList
} from 'react-icons/hi';

const RestaurantHeader = () => {
    const [details, setDetails] = useState(null);
    const [popup, setPopup] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    // const [notificationCount, setNotificationCount] = useState(3); // Example notifications
    const searchRef = useRef(null);
    const router = useRouter();
    const pathName = usePathname();

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Click outside to close search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let storeData = localStorage.getItem("restaurantUser");
        if (!storeData && pathName === "/restaurant/dashboard") {
            router.push("/restaurant");
        } else if (storeData && pathName === "/restaurant") {
            router.push("/restaurant/dashboard");
        } else {
            setDetails(JSON.parse(storeData));
        }
    }, [pathName, router]);

    const handleLogout = () => {
        localStorage.removeItem("restaurantUser");
        setDetails(null);
        setPopup(false);
        router.push("/restaurant");
    };

    const menuVariants = {
        closed: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2
            }
        },
        open: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        closed: { x: -20, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    const searchVariants = {
        closed: { width: 0, opacity: 0 },
        open: { width: 300, opacity: 1 }
    };

    return (
        <>
            <motion.header
                className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-gradient-to-r from-[#fc8019]/95 via-[#ff6b35]/95 to-[#ff512f]/95 backdrop-blur-md shadow-lg py-2'
                    : 'bg-gradient-to-r from-[#fc8019] via-[#ff6b35] to-[#ff512f] py-3'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">

                        {/* Logo Section */}
                        <motion.div
                            className="flex items-center space-x-3"
                            whileHover={{ scale: 0.95 }}
                        >
                            <Link href={'/'} className="flex items-center space-x-2 cursor-pointer">
                                <Image src={logo} alt="Yukky Restaurant Logo" width={120} height={120} className="rounded-2xl" />
                            </Link>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {/* Dashboard */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/restaurant/dashboard"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${scrolled
                                        ? 'text-gray-700 hover:bg-[#fc8019] hover:text-white'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <HiOutlineViewGrid size={18} />
                                    <span>Dashboard</span>
                                </Link>
                            </motion.div>

                            {/* Orders */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${scrolled
                                        ? 'text-gray-700 hover:bg-[#fc8019] hover:text-white'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <HiOutlineClipboardList size={18} />
                                    <span>Orders</span>
                                </span>
                            </motion.div>

                            {/* Analytics */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${scrolled
                                        ? 'text-gray-700 hover:bg-[#fc8019] hover:text-white'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <FiBarChart2 size={18} />
                                    <span>Analytics</span>
                                </span>
                            </motion.div>

                            {details ? (
                                <>
                                    {/* User Dropdown */}
                                    <div className="relative">
                                        <motion.button
                                            onClick={() => setUserDropdown(!userDropdown)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${scrolled
                                                ? 'text-gray-700 hover:bg-[#fc8019] hover:text-white'
                                                : 'text-white hover:bg-white/20'
                                                }`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                <HiOutlineUser size={16} />
                                            </div>
                                            <span className="max-w-24 truncate">{details.name || 'Restaurant'}</span>
                                            <motion.div
                                                animate={{ rotate: userDropdown ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <FiChevronDown size={16} />
                                            </motion.div>
                                        </motion.button>

                                        <AnimatePresence>
                                            {userDropdown && (
                                                <motion.div
                                                    className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="px-4 py-3 border-b border-gray-200">
                                                        <p className="font-semibold text-gray-900">{details.name}</p>
                                                        <p className="text-sm text-gray-600">Restaurant Owner</p>
                                                    </div>

                                                    <Link
                                                        href="/restaurant/profile"
                                                        className="flex items-center space-x-2 px-4 py-3 hover:bg-[#fc8019] hover:text-white transition-all duration-300"
                                                        onClick={() => setUserDropdown(false)}
                                                    >
                                                        <FiUser size={16} />
                                                        <span>Restaurant Profile</span>
                                                    </Link>

                                                    <Link
                                                        href="/restaurant/menu"
                                                        className="flex items-center space-x-2 px-4 py-3 hover:bg-[#fc8019] hover:text-white transition-all duration-300"
                                                        onClick={() => setUserDropdown(false)}
                                                    >
                                                        <FiPackage size={16} />
                                                        <span>Menu Management</span>
                                                    </Link>

                                                    <Link
                                                        href="/restaurant/finance"
                                                        className="flex items-center space-x-2 px-4 py-3 hover:bg-[#fc8019] hover:text-white transition-all duration-300"
                                                        onClick={() => setUserDropdown(false)}
                                                    >
                                                        <FiDollarSign size={16} />
                                                        <span>Earnings</span>
                                                    </Link>

                                                    <div className="border-t border-gray-200 my-1"></div>

                                                    <button
                                                        onClick={() => {
                                                            setUserDropdown(false);
                                                            setPopup(true);
                                                        }}
                                                        className="flex items-center space-x-2 w-full text-left px-4 py-3 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300"
                                                    >
                                                        <FiLogOut size={16} />
                                                        <span>Logout</span>
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/restaurant"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${scrolled
                                            ? 'text-gray-700 hover:bg-[#fc8019] hover:text-white'
                                            : 'text-white hover:bg-white/20'
                                            }`} 
                                    >
                                        <HiOutlineUser size={18} />
                                        <span>Restaurant Login</span>
                                    </Link>
                                </motion.div>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center space-x-2 lg:hidden">
                            {/* Search Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSearchOpen(!searchOpen)}
                                className={`p-2 rounded-xl ${scrolled
                                    ? 'text-gray-700 hover:bg-[#fc8019] hover:text-white'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                <FiSearch size={20} />
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className={`p-2 rounded-xl ${scrolled
                                    ? 'text-gray-700 hover:bg-[#fc8019] hover:text-white'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                {mobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <AnimatePresence>
                        {searchOpen && (
                            <motion.div
                                className="lg:hidden mt-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search menu items..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {mobileMenu && (
                        <motion.div
                            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-white/20"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="max-w-7xl mx-auto px-4 py-4">
                                <motion.div
                                    className="flex flex-col space-y-2"
                                    variants={menuVariants}
                                    initial="closed"
                                    animate="open"
                                >
                                    <motion.div variants={itemVariants}>
                                        <Link
                                            href="/restaurant/dashboard"
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#fc8019] hover:text-white transition-all duration-300 text-gray-800"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            <HiOutlineViewGrid size={18} />
                                            <span>Dashboard</span>
                                        </Link>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <span
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#fc8019] hover:text-white transition-all duration-300 text-gray-800"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            <HiOutlineClipboardList size={18} />
                                            <span>Orders</span>
                                        </span>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <sapn
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#fc8019] hover:text-white transition-all duration-300 text-gray-800"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            <FiPackage size={18} />
                                            <span>Menu Management</span>
                                        </sapn>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <span
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#fc8019] hover:text-white transition-all duration-300 text-gray-800"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            <FiBarChart2 size={18} />
                                            <span>Analytics</span>
                                        </span>
                                    </motion.div>

                                    {details ? (
                                        <>
                                            <motion.div variants={itemVariants}>
                                                <sapn
                                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#fc8019] hover:text-white transition-all duration-300 text-gray-800"
                                                    onClick={() => setMobileMenu(false)}
                                                >
                                                    <FiUser size={18} />
                                                    <span>Profile</span>
                                                </sapn>
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <button
                                                    onClick={() => {
                                                        setPopup(true);
                                                        setMobileMenu(false);
                                                    }}
                                                    className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 text-red-600"
                                                >
                                                    <FiLogOut size={18} />
                                                    <span>Logout</span>
                                                </button>
                                            </motion.div>
                                        </>
                                    ) : (
                                        <motion.div variants={itemVariants}>
                                            <Link
                                                href="/restaurant"
                                                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#fc8019] text-white hover:bg-[#e86f0e] transition-all duration-300"
                                                onClick={() => setMobileMenu(false)}
                                            >
                                                <HiOutlineUser size={18} />
                                                <span>Restaurant Login</span>
                                            </Link>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Spacer for fixed header */}
            <div className="h-20"></div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {popup && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            <div className="text-center mb-6">
                                <motion.div
                                    className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <FiLogOut className="text-red-500 text-3xl" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Logout</h2>
                                <p className="text-gray-600">Are you sure you want to logout from your restaurant dashboard?</p>
                            </div>
                            <div className="flex justify-center space-x-4">
                                <motion.button
                                    onClick={() => setPopup(false)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleLogout}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Logout
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default RestaurantHeader;