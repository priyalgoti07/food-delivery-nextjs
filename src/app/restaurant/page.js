'use client'
import { useState } from "react";
import RestaurantLogin from "../_components/RestaurantLogin";
import RestaurantSignUp from "../_components/RestaurantSignup";
import RestaurantHeader from "../_components/RestaurantHeader";
import RestaurantFooter from "../_components/RestaurantFooter";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

const Restaurant = () => {
    const [login, setLogin] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <RestaurantHeader />
            
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    {/* Right Panel - Form Only */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {login ? "Restaurant Login" : "Create Account"}
                                    </h2>
                                    <p className="text-orange-100 mt-1">
                                        {login ? "Sign in to your dashboard" : "Start your journey with us"}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    {login ? (
                                        <FaSignInAlt className="text-white text-xl" />
                                    ) : (
                                        <FaUserPlus className="text-white text-xl" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            <div className="mb-6">
                                <div className="inline-flex bg-gray-100 rounded-full p-1">
                                    <button
                                        onClick={() => setLogin(true)}
                                        className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${login 
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <FaSignInAlt className="mr-2" />
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setLogin(false)}
                                        className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${!login 
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <FaUserPlus className="mr-2" />
                                        Sign Up
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-[400px]">
                                {login ? <RestaurantLogin /> : <RestaurantSignUp />}
                            </div>

                            <div className="text-center mt-6 pt-6 border-t border-gray-100">
                                <p className="text-gray-600">
                                    {login ? "Don't have an account?" : "Already have an account?"}
                                    <button
                                        onClick={() => setLogin(!login)}
                                        className="ml-2 text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity"
                                    >
                                        {login ? "Sign Up" : "Log In"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <RestaurantFooter />
        </div>
    );
};

export default Restaurant;