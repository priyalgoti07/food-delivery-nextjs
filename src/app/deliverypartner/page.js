'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DeliveryHeader from '../_components/DeliveryHeader';
import { request } from '../lib/request';
import { FaUser, FaLock, FaPhone, FaCity, FaMapMarkerAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail, MdLocationCity } from 'react-icons/md';
import { BsShieldLock } from 'react-icons/bs';

const DeliveryPartner = () => {
    const router = useRouter();
    const [login, setLogin] = useState(true);
    const [form, setForm] = useState({ loginMobile: '', loginPassword: '' });
    const [errors, setErrors] = useState({ loginMobile: '', loginPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Signup states
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        let newErrors = { ...errors };

        if (name === 'loginMobile') {
            if (!value) newErrors.loginMobile = 'Please enter mobile number';
            else if (!/^[6-9]\d{9}$/.test(value)) newErrors.loginMobile = 'Invalid mobile number';
            else newErrors.loginMobile = '';
        }

        if (name === 'loginPassword') {
            if (!value) newErrors.loginPassword = 'Please enter password';
            else if (value.length < 6) newErrors.loginPassword = 'Password must be at least 6 characters';
            else newErrors.loginPassword = '';
        }

        setErrors(newErrors);
    };

    const validateBeforeSubmit = () => {
        const temp = { loginMobile: '', loginPassword: '' };
        let valid = true;

        if (!form.loginMobile) {
            temp.loginMobile = 'Please enter mobile number';
            valid = false;
        } else if (!/^[6-9]\d{9}$/.test(form.loginMobile)) {
            temp.loginMobile = 'Invalid mobile number';
            valid = false;
        }

        if (!form.loginPassword) {
            temp.loginPassword = 'Please enter password';
            valid = false;
        } else if (form.loginPassword.length < 6) {
            temp.loginPassword = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(temp);
        return valid;
    };

    const validateSignup = () => {
        let hasError = false;
        const errors = [];

        if (!name) errors.push('Name is required');
        if (!mobile) errors.push('Mobile number is required');
        else if (!/^[6-9]\d{9}$/.test(mobile)) errors.push('Invalid mobile number');
        if (!password) errors.push('Password is required');
        else if (password.length < 6) errors.push('Password must be at least 6 characters');
        if (!cpassword) errors.push('Please confirm password');
        if (password !== cpassword) errors.push('Passwords do not match');
        if (!city) errors.push('City is required');
        if (!address) errors.push('Address is required');

        setError(errors.length > 0);
        setPasswordError(errors.find(err => err.includes('Passwords')) || '');
        return errors.length === 0;
    };

    const handleLogin = async () => {
        if (!validateBeforeSubmit()) return;

        setIsLoading(true);
        try {
            const data = await request.post('/api/deliverypartners/login', {
                ...form,
                login: true,
            });
            if (data.success) {
                const { result } = data;
                delete result.password;
                localStorage.setItem('delivertPartner', JSON.stringify(result));
                router.push('/deliverydashboard');
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (err) {
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateSignup()) return;

        setIsLoading(true);
        try {
            const data = await request.post('/api/deliverypartners/signup', {
                name,
                password,
                city,
                address,
                mobile,
            });
            if (data.success) {
                const { result } = data;
                delete result.password;
                localStorage.setItem('delivertPartner', JSON.stringify(result));
                router.push('/deliverydashboard');
            } else {
                alert('Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delivery = JSON.parse(localStorage.getItem('delivertPartner'));
        if (delivery) {
            router.push('/deliverydashboard');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
            <DeliveryHeader />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                Yukky
                            </span>{' '}
                            Delivery Partner
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Join our network of delivery partners and start earning with Yukky
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Panel - Benefits */}
                        <div className="lg:w-2/5 bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <BsShieldLock className="text-orange-500" />
                                Why Join Yukky?
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-orange-600 font-bold">₹</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Earn More</h3>
                                        <p className="text-gray-600 text-sm">Competitive payouts with daily settlements</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 font-bold">⚡</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Flexible Hours</h3>
                                        <p className="text-gray-600 text-sm">Work whenever you want, no fixed schedules</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 font-bold">🏆</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Weekly Bonuses</h3>
                                        <p className="text-gray-600 text-sm">Extra earnings for top performers</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-purple-600 font-bold">🛡️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Partner Support</h3>
                                        <p className="text-gray-600 text-sm">24/7 support for all delivery partners</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">500+</div>
                                        <div className="text-sm text-gray-600">Partners</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">10k+</div>
                                        <div className="text-sm text-gray-600">Deliveries</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">4.8</div>
                                        <div className="text-sm text-gray-600">Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Form */}
                        <div className="lg:w-3/5">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                {/* Form Tabs */}
                                <div className="flex border-b">
                                    <button
                                        className={`flex-1 py-4 text-center font-semibold transition-colors ${login 
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                                            : 'text-gray-600 hover:bg-gray-50'}`}
                                        onClick={() => setLogin(true)}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className={`flex-1 py-4 text-center font-semibold transition-colors ${!login 
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                                            : 'text-gray-600 hover:bg-gray-50'}`}
                                        onClick={() => setLogin(false)}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                <div className="p-8">
                                    {login ? (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                Welcome Back Partner!
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Sign in to access your delivery dashboard
                                            </p>

                                            {/* Mobile Input */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Mobile Number
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaPhone className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        name="loginMobile"
                                                        type="text"
                                                        placeholder="Enter 10-digit mobile number"
                                                        className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.loginMobile
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                                            }`}
                                                        value={form.loginMobile}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                {errors.loginMobile && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.loginMobile}</p>
                                                )}
                                            </div>

                                            {/* Password Input */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaLock className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        name="loginPassword"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your password"
                                                        className={`w-full pl-10 pr-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.loginPassword
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                                            }`}
                                                        value={form.loginPassword}
                                                        onChange={handleChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                                        ) : (
                                                            <FaEye className="text-gray-400 hover:text-gray-600" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.loginPassword && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.loginPassword}</p>
                                                )}
                                            </div>

                                            <button
                                                className={`w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-[1.02] ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                                onClick={handleLogin}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                                        Signing In...
                                                    </span>
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </button>

                                            <div className="text-center">
                                                <Link 
                                                    href="#" 
                                                    className="text-sm text-orange-600 hover:text-orange-800"
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                Join Our Delivery Team
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Fill in your details to get started
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Name */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaUser className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your full name"
                                                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                    </div>
                                                    {error && !name && (
                                                        <p className="mt-2 text-sm text-red-600">Name is required</p>
                                                    )}
                                                </div>

                                                {/* Mobile */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Mobile Number
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaPhone className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter 10-digit mobile number"
                                                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                            value={mobile}
                                                            onChange={(e) => setMobile(e.target.value)}
                                                        />
                                                    </div>
                                                    {error && !mobile && (
                                                        <p className="mt-2 text-sm text-red-600">Mobile number is required</p>
                                                    )}
                                                </div>

                                                {/* Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Password
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaLock className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Enter password"
                                                            className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? (
                                                                <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                                            ) : (
                                                                <FaEye className="text-gray-400 hover:text-gray-600" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {error && !password && (
                                                        <p className="mt-2 text-sm text-red-600">Password is required</p>
                                                    )}
                                                </div>

                                                {/* Confirm Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Confirm Password
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaLock className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="Confirm password"
                                                            className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                            value={cpassword}
                                                            onChange={(e) => setCPassword(e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        >
                                                            {showConfirmPassword ? (
                                                                <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                                            ) : (
                                                                <FaEye className="text-gray-400 hover:text-gray-600" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {passwordError && (
                                                        <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                                                    )}
                                                </div>

                                                {/* City */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        City
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <MdLocationCity className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your city"
                                                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                            value={city}
                                                            onChange={(e) => setCity(e.target.value)}
                                                        />
                                                    </div>
                                                    {error && !city && (
                                                        <p className="mt-2 text-sm text-red-600">City is required</p>
                                                    )}
                                                </div>

                                                {/* Address */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Address
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                                            <FaMapMarkerAlt className="text-gray-400" />
                                                        </div>
                                                        <textarea
                                                            placeholder="Enter your complete address"
                                                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                            rows="3"
                                                            value={address}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                        />
                                                    </div>
                                                    {error && !address && (
                                                        <p className="mt-2 text-sm text-red-600">Address is required</p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                className={`w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-[1.02] ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                                onClick={handleSubmit}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                                        Creating Account...
                                                    </span>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </button>

                                            <div className="text-center text-sm text-gray-600">
                                                By signing up, you agree to our{' '}
                                                <Link href="/terms" className="text-orange-600 hover:text-orange-800">
                                                    Terms & Conditions
                                                </Link>{' '}
                                                and{' '}
                                                <Link href="/privacy" className="text-orange-600 hover:text-orange-800">
                                                    Privacy Policy
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    className="font-semibold text-orange-600 hover:text-orange-800 transition-colors"
                                    onClick={() => setLogin(!login)}
                                >
                                    {login 
                                        ? "Don't have an account? Sign Up" 
                                        : 'Already have an account? Sign In'}
                                    <span className="ml-2">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-lg font-bold mb-2">Yukky Delivery Partners</p>
                    <p className="text-gray-400 text-sm">
                        Need help? Contact us at support@Yukky.com or call +91 98765 43210
                    </p>
                    <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400">
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/help" className="hover:text-white">Help Center</Link>
                        <Link href="/contact" className="hover:text-white">Contact Us</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPartner;