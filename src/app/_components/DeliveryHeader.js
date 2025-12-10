import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../../../public/food-logo.png";
import { FaBicycle, FaUser, FaSignOutAlt, FaHome, FaBell } from "react-icons/fa";

const DeliveryHeader = () => {
    const router = useRouter();
    const [popup, setPopup] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Get delivery partner info from localStorage
    const deliveryPartner = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('delivertPartner') || '{}')
        : {};

    const handleLogout = () => {
        localStorage.removeItem("delivertPartner");
        router.push("/deliverypartner");
        setPopup(false);
    };

    const navigateToDashboard = () => {
        if (deliveryPartner && deliveryPartner._id) {
            router.push('/deliverydashboard');
        }
    };

    return (
        <>
            <header className="w-full py-4 px-4 md:px-6 fixed top-0 z-50 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={navigateToDashboard}>
                        <div className="relative w-12 h-12 md:w-14 md:h-14">
                            <Image
                                src={logo}
                                alt="Yukky Logo"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 48px, 56px"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Yukky Delivery
                            </h1>
                            <p className="text-xs md:text-sm text-gray-600">Partner Portal</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex items-center space-x-4 md:space-x-6">
                        {deliveryPartner && deliveryPartner._id ? (
                            <>
                                <div className="hidden md:flex items-center space-x-4">
                                    <Link
                                        href="/deliverydashboard"
                                        className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                                    >
                                        <FaHome className="w-5 h-5" />
                                        <span className="font-medium">Dashboard</span>
                                    </Link>
                                </div>

                                {/* Profile Section */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfile(!showProfile)}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                                            {deliveryPartner.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <p className="font-semibold text-gray-900">{deliveryPartner.name || 'Partner'}</p>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <FaBicycle className="w-3 h-3" />
                                                Delivery Partner
                                            </p>
                                        </div>
                                        <FaUser className="text-gray-600" />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {showProfile && (
                                        <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-semibold text-gray-900">{deliveryPartner.name}</p>
                                                <p className="text-sm text-gray-600">{deliveryPartner.mobile}</p>
                                                <p className="text-xs text-gray-500 mt-1">{deliveryPartner.city}</p>
                                            </div>

                                            <span
                                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                                onClick={() => setShowProfile(false)}
                                            >
                                                <FaUser className="w-4 h-4 mr-3" />
                                                My Profile
                                            </span>

                                            <span
                                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                                onClick={() => setShowProfile(false)}
                                            >
                                                <FaBell className="w-4 h-4 mr-3" />
                                                Settings
                                            </span>

                                            <button
                                                onClick={() => {
                                                    setShowProfile(false);
                                                    setPopup(true);
                                                }}
                                                className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <FaSignOutAlt className="w-4 h-4 mr-3" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors px-4 py-2 rounded-lg hover:bg-white/50"
                                >
                                    <FaHome className="w-5 h-5" />
                                    <span className="font-medium hidden md:inline">Home</span>
                                </Link>

                                <Link
                                    href="/deliverypartner"
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>

                {/* Mobile Navigation */}
                {deliveryPartner && deliveryPartner._id && (
                    <div className="md:hidden mt-4 pb-2 border-t border-orange-100 pt-3">
                        <div className="flex justify-around items-center">
                            <Link
                                href="/deliverydashboard"
                                className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition-colors"
                            >
                                <FaHome className="w-6 h-6" />
                                <span className="text-xs mt-1">Dashboard</span>
                            </Link>

                            <Link
                                href="/deliveryorders"
                                className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition-colors"
                            >
                                <FaBicycle className="w-6 h-6" />
                                <span className="text-xs mt-1">Orders</span>
                            </Link>

                            <button
                                onClick={() => setPopup(true)}
                                className="flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <FaSignOutAlt className="w-6 h-6" />
                                <span className="text-xs mt-1">Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Logout Confirmation Popup */}
            {popup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                                <FaSignOutAlt className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Logout Confirmation</h2>
                            <p className="text-gray-600">
                                Are you sure you want to logout from your account?
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPopup(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                            >
                                Yes, Logout
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">
                                You'll need to sign in again to access your dashboard
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close profile dropdown */}
            {showProfile && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfile(false)}
                />
            )}
        </>
    );
};

export default DeliveryHeader;