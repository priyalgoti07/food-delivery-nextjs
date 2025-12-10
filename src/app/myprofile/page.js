'use client';

import React, { useEffect, useState } from 'react';
import CustomersHeader from '../_components/CustomersHeader';
import RestaurantFooter from '../_components/RestaurantFooter';
import { request } from '../lib/request';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaMotorcycle,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaStar,
  FaHistory,
  FaEdit
} from 'react-icons/fa';
import { MdRestaurant, MdLocationOn } from 'react-icons/md';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [userStats, setUserStats] = useState({
        totalOrders: 0,
        delivered: 0,
        pending: 0,
        totalSpent: 0
    });

    // Check for user on client-side only
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const getMyOrders = async () => {
        if (!user?._id) {
            setLoading(false);
            return;
        }

        try {
            const data = await request.get(`/api/order?id=${user._id}`);
            if (data.success) {
                setMyOrders(data.result);
                calculateStats(data.result);
            }
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (orders) => {
        const totalOrders = orders.length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        const pending = orders.filter(o => ['pending', 'confirmed', 'on the way'].includes(o.status)).length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

        setUserStats({
            totalOrders,
            delivered,
            pending,
            totalSpent
        });
    };

    useEffect(() => {
        if (user) {
            getMyOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Filter orders based on active tab
    const filteredOrders = myOrders.filter(order => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return ['pending', 'confirmed', 'on the way'].includes(order.status);
        if (activeTab === 'delivered') return order.status === 'delivered';
        if (activeTab === 'cancelled') return order.status === 'failed to deliver';
        return true;
    });

    // Get status badge configuration
    const getStatusConfig = (status) => {
        const configs = {
            'pending': { 
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: <FaClock className="w-3 h-3" />,
                label: 'Pending'
            },
            'confirmed': { 
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: <FaCheckCircle className="w-3 h-3" />,
                label: 'Confirmed'
            },
            'on the way': { 
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                icon: <FaMotorcycle className="w-3 h-3" />,
                label: 'On the Way'
            },
            'delivered': { 
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: <FaCheckCircle className="w-3 h-3" />,
                label: 'Delivered'
            },
            'failed to deliver': { 
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: <FaExclamationTriangle className="w-3 h-3" />,
                label: 'Cancelled'
            }
        };
        return configs[status] || { 
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: <FaClock className="w-3 h-3" />,
            label: status
        };
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
                <CustomersHeader />
                <div className="container mx-auto px-4 pt-32 pb-12">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="w-16 h-16 border-t-2 border-orange-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading your profile...</p>
                    </div>
                </div>
                <RestaurantFooter />
            </div>
        );
    }

    // No user found (not logged in)
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
                <CustomersHeader />
                <div className="container mx-auto px-4 pt-32 pb-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <FaUser className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Please Sign In</h2>
                        <p className="text-gray-600 mb-6">You need to be signed in to view your profile and orders.</p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                        >
                            Sign In to Continue
                        </button>
                    </div>
                </div>
                <RestaurantFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
            <CustomersHeader />
            
            <div className="container mx-auto px-4 pt-28 pb-12">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-orange-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <FaPhone className="w-4 h-4" />
                                        <span>{user.contact}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <FaMapMarkerAlt className="w-4 h-4" />
                                        <span>{user.city}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => alert('Edit profile feature coming soon!')}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <FaEdit className="w-4 h-4" />
                                Edit Profile
                            </button>
                            <button
                                onClick={() => window.location.href = '/menu'}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2"
                            >
                                <MdRestaurant className="w-4 h-4" />
                                Order Food
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Stats */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FaShoppingBag className="text-orange-500" />
                                Order Summary
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                                    <div className="text-2xl font-bold text-orange-600">{userStats.totalOrders}</div>
                                    <div className="text-sm text-gray-600">Total Orders</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600">{userStats.delivered}</div>
                                    <div className="text-sm text-gray-600">Delivered</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600">{userStats.pending}</div>
                                    <div className="text-sm text-gray-600">Active</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                                    <div className="text-2xl font-bold text-purple-600">₹{userStats.totalSpent}</div>
                                    <div className="text-sm text-gray-600">Total Spent</div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <FaUser className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <FaPhone className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Mobile</p>
                                        <p className="font-medium">{user.contact}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">City</p>
                                        <p className="font-medium">{user.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                            {/* Orders Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <FaHistory className="text-orange-500" />
                                            Order History
                                        </h2>
                                        <p className="text-gray-600">Track and manage your orders</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 font-medium">Filter:</span>
                                        <select
                                            value={activeTab}
                                            onChange={(e) => setActiveTab(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="all">All Orders</option>
                                            <option value="pending">Active Orders</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="p-6">
                                {filteredOrders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                            <FaShoppingBag className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders found</h3>
                                        <p className="text-gray-500 mb-6">
                                            {activeTab === 'all' 
                                                ? "You haven't placed any orders yet." 
                                                : `No ${activeTab} orders at the moment.`}
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/menu'}
                                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                                        >
                                            Order Now
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredOrders.map((order, index) => {
                                            const statusConfig = getStatusConfig(order.status);
                                            return (
                                                <div
                                                    key={order._id || index}
                                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${statusConfig.color}`}>
                                                                    {statusConfig.icon}
                                                                    {statusConfig.label}
                                                                </div>
                                                                <span className="text-lg font-semibold text-gray-900">
                                                                    Order #{order._id?.slice(-6) || index + 1}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                                <span className="flex items-center gap-1">
                                                                    <MdRestaurant className="w-3 h-3" />
                                                                    {order.data?.name || 'Order'}
                                                                </span>
                                                                <span className="hidden sm:inline">•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <FaMoneyBillWave className="w-3 h-3" />
                                                                    ₹{order.amount || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-green-600">₹{order.amount || 0}</p>
                                                            {order.createdAt && (
                                                                <p className="text-sm text-gray-500">
                                                                    {formatDate(order.createdAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Delivery Details */}
                                                    {order.data && (
                                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <MdLocationOn className="text-gray-500 mt-1 flex-shrink-0" />
                                                                <div>
                                                                    <p className="font-medium text-gray-700">Delivery Address</p>
                                                                    <p className="text-gray-600">
                                                                        {order.data.address || ''}, {order.data.city || ''}
                                                                    </p>
                                                                    {order.data.contact && (
                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                            Contact: {order.data.contact}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Order Actions */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => alert('Order details coming soon!')}
                                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                                            >
                                                                View Details
                                                            </button>
                                                            {order.status === 'delivered' && (
                                                                <button
                                                                    onClick={() => alert('Rate order feature coming soon!')}
                                                                    className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm flex items-center gap-2"
                                                                >
                                                                    <FaStar className="w-3 h-3" />
                                                                    Rate Order
                                                                </button>
                                                            )}
                                                        </div>
                                                        
                                                        {['pending', 'confirmed'].includes(order.status) && (
                                                            <button
                                                                onClick={() => alert('Cancel order feature coming soon!')}
                                                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                                                            >
                                                                Cancel Order
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            {filteredOrders.length > 0 && (
                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Showing {filteredOrders.length} of {myOrders.length} orders
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                Total Spent: ₹{filteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <RestaurantFooter />
        </div>
    );
};

export default Profile;