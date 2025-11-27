'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiShoppingCart, FiPlus, FiMenu, FiX } from "react-icons/fi";
import ylogo from "../../../public/y_logo.png";
import CommonDrawer from "./CommonDrawer";


const CustomersHeader = () => {
    const router = useRouter();
    const [popup, setPopup] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const cartItems = useSelector((state) => state.cart.items);
    const [user, setUser] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem('user'));
        setUser(userStorage || null);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/");
        setPopup(false);
    };

    return (
        <>
            <motion.header
                className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white py-4'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">

                        {/* Logo */}
                        <motion.div
                            className="flex items-center space-x-3"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Link href={'/'} className="flex items-center space-x-2 cursor-pointer">
                                <Image src={ylogo} alt="Restaurant Logo" width={40} height={40} className="rounded-2xl" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">FoodExpress</h1>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                                <Link href="/" className="text-gray-600 hover:text-[#fc8019] transition-colors font-medium">
                                    Home
                                </Link>
                            </motion.div>

                            {user ? (
                                <>
                                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                                        <Link href="/myprofile" className="flex items-center space-x-2 text-gray-600 hover:text-[#fc8019] transition-colors font-medium">
                                            <FiUser size={16} />
                                            <span>{user?.name}</span>
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                                        <button
                                            onClick={() => setPopup(true)}
                                            className="flex items-center space-x-2 text-gray-600 hover:text-[#fc8019] transition-colors font-medium"
                                        >
                                            <FiLogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} onClick={() => setOpenDrawer(true)}>
                                        {/* <Link href="/" className="text-gray-600 hover:text-[#fc8019] transition-colors font-medium" onClick={() => setOpenDrawer(true)}> */}
                                        Login
                                        {/* </Link> */}
                                    </motion.div>
                                </>
                            )}

                            {/* Cart */}
                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                <Link
                                    href={cartItems?.length ? '/cart' : '#'}
                                    className={`flex items-center space-x-2 transition-colors font-medium ${cartItems?.length ? 'text-[#fc8019]' : 'text-gray-400'
                                        }`}
                                >
                                    <FiShoppingCart size={18} />
                                    <span>Cart</span>
                                    {cartItems?.length > 0 && (
                                        <motion.span
                                            className="absolute -top-2 -right-2 bg-[#fc8019] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            {cartItems.length}
                                        </motion.span>
                                    )}
                                </Link>
                            </motion.div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center space-x-4 md:hidden">
                            {/* Cart for Mobile */}
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="relative"
                            >
                                <Link
                                    href={cartItems?.length ? '/cart' : '#'}
                                    className={`p-2 rounded-lg transition-colors ${cartItems?.length ? 'text-[#fc8019]' : 'text-gray-400'
                                        }`}
                                >
                                    <FiShoppingCart size={20} />
                                    {cartItems?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#fc8019] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>
                            </motion.div>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className="p-2 rounded-lg text-gray-600 hover:text-[#fc8019] transition-colors"
                            >
                                {mobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    <AnimatePresence>
                        {mobileMenu && (
                            <motion.div
                                className="md:hidden bg-white border-t border-gray-100 mt-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="py-4 space-y-3">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <Link
                                            href="/"
                                            className="block py-2 text-gray-600 hover:text-[#fc8019] transition-colors font-medium"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            Home
                                        </Link>
                                    </motion.div>

                                    {user ? (
                                        <>
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Link
                                                    href="/myprofile"
                                                    className="flex items-center space-x-2 py-2 text-gray-600 hover:text-[#fc8019] transition-colors font-medium"
                                                    onClick={() => setMobileMenu(false)}
                                                >
                                                    <FiUser size={16} />
                                                    <span>{user?.name}</span>
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setPopup(true);
                                                        setMobileMenu(false);
                                                    }}
                                                    className="flex items-center space-x-2 w-full text-left py-2 text-gray-600 hover:text-[#fc8019] transition-colors font-medium"
                                                >
                                                    <FiLogOut size={16} />
                                                    <span>Logout</span>
                                                </button>
                                            </motion.div>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Link
                                                    href="/"
                                                    className="block py-2 text-gray-600 hover:text-[#fc8019] transition-colors font-medium"
                                                    onClick={() => setMobileMenu(false)}
                                                >
                                                    Login
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <Link
                                                    href="/user-auth"
                                                    className="block py-2 text-gray-600 hover:text-[#fc8019] transition-colors font-medium"
                                                    onClick={() => setMobileMenu(false)}
                                                >
                                                    Signup
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}

                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Link
                                            href="/"
                                            className="flex items-center space-x-2 py-2 text-gray-600 hover:text-[#fc8019] transition-colors font-medium"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            <FiPlus size={16} />
                                            <span>Add Restaurant</span>
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.header>

            {/* Spacer for fixed header
            <div className="h-20"></div> */}

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {popup && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full mx-4 border border-gray-100"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">Confirm Logout</h2>
                            <p className="text-gray-600 text-center mb-6">Are you sure you want to logout?</p>
                            <div className="flex justify-center space-x-3">
                                <motion.button
                                    onClick={() => setPopup(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex-1"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-[#fc8019] text-white rounded-lg hover:bg-[#e86f0e] transition-colors font-medium flex-1"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Logout
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {<CommonDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}
                onUserAuthenticated={(authUser) => setUser(authUser)}
            />}
        </>
    );
};

export default CustomersHeader;