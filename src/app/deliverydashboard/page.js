'use client'
import React, { useEffect, useState } from 'react';
import DeliveryHeader from '../_components/DeliveryHeader';
import { useRouter } from 'next/navigation';
import { request } from '../lib/request';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaCity, 
  FaMotorcycle, 
  FaCheckCircle, 
  FaClock,
  FaExclamationTriangle,
  FaTruck,
  FaMoneyBillWave,
  FaEdit
} from 'react-icons/fa';
import { MdDeliveryDining, MdLocationOn } from 'react-icons/md';

const DeliverPartnerProfile = () => {
    const router = useRouter();
    const [deliveryPartner, setDeliveryPartner] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        delivered: 0,
        pending: 0,
        totalEarnings: 0
    });
    const [activeTab, setActiveTab] = useState('all');

    // Check if delivery partner is logged in
    useEffect(() => {
        const storedPartner = JSON.parse(localStorage.getItem('delivertPartner'));
        if (!storedPartner) {
            router.push('/deliverypartner');
        } else {
            setDeliveryPartner(storedPartner);
        }
    }, [router]);

    // Fetch delivery partner orders
    const fetchPartnerOrders = async (partnerId) => {
        try {
            const data = await request.get(`/api/deliverypartners/orders/${partnerId}`);
            if (data.success) {
                setOrders(data.result);
                calculateStats(data.result);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = (orders) => {
        const totalOrders = orders.length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        const pending = orders.filter(o => o.status === 'pending' || o.status === 'on the way').length;
        const totalEarnings = orders
            .filter(o => o.status === 'delivered')
            .reduce((sum, order) => sum + (order.amount || 0), 0);

        setStats({
            totalOrders,
            delivered,
            pending,
            totalEarnings
        });
    };

    // Trigger API call when deliveryPartner is set
    useEffect(() => {
        if (deliveryPartner?._id) {
            fetchPartnerOrders(deliveryPartner._id);
        }
    }, [deliveryPartner]);

    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return order.status === 'pending';
        if (activeTab === 'delivered') return order.status === 'delivered';
        if (activeTab === 'active') return order.status === 'confirmed' || order.status === 'on the way';
        return true;
    });

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'on the way':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'failed to deliver':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <FaCheckCircle className="w-4 h-4" />;
            case 'confirmed':
                return <FaClock className="w-4 h-4" />;
            case 'on the way':
                return <FaMotorcycle className="w-4 h-4" />;
            case 'pending':
                return <FaClock className="w-4 h-4" />;
            case 'failed to deliver':
                return <FaExclamationTriangle className="w-4 h-4" />;
            default:
                return <FaClock className="w-4 h-4" />;
        }
    };

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const json = await request.put(`/api/deliverypartners/orders/${deliveryPartner._id}`, {
                id: orderId,
                status: newStatus,
            });
            if (json.success) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o._id === orderId ? { ...o, status: newStatus } : o
                    )
                );
                calculateStats(orders.map(o => o._id === orderId ? {...o, status: newStatus} : o));
                alert('Order status updated successfully!');
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert('Failed to update status. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
            <DeliveryHeader />
            
            <div className="container mx-auto px-4 pt-28 pb-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {deliveryPartner?.name || 'Partner'}! 👋
                    </h1>
                    <p className="text-gray-600">Manage your deliveries and track your earnings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {deliveryPartner?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{deliveryPartner?.name}</h2>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <FaMotorcycle className="w-4 h-4" />
                                        Delivery Partner
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <FaPhone className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Mobile</p>
                                        <p className="font-medium">{deliveryPartner?.mobile}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <FaCity className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">City</p>
                                        <p className="font-medium">{deliveryPartner?.city}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="font-medium">{deliveryPartner?.address}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                                onClick={() => alert('Edit profile feature coming soon!')}
                            >
                                <FaEdit className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                                    <div className="text-2xl font-bold text-orange-600">{stats.totalOrders}</div>
                                    <div className="text-sm text-gray-600">Total Orders</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                                    <div className="text-sm text-gray-600">Delivered</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                                    <div className="text-sm text-gray-600">Active</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                                    <div className="text-2xl font-bold text-purple-600">₹{stats.totalEarnings}</div>
                                    <div className="text-sm text-gray-600">Earnings</div>
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
                                        <h2 className="text-xl font-bold text-gray-900">Your Deliveries</h2>
                                        <p className="text-gray-600">Manage and update order status</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 font-medium">Filter:</span>
                                        <select
                                            value={activeTab}
                                            onChange={(e) => setActiveTab(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="all">All Orders</option>
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="p-6">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-12 h-12 border-t-2 border-orange-500 rounded-full animate-spin mb-4"></div>
                                        <p className="text-gray-600">Loading your orders...</p>
                                    </div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                            <MdDeliveryDining className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders found</h3>
                                        <p className="text-gray-500">
                                            {activeTab === 'all' 
                                                ? "You haven't received any orders yet." 
                                                : `No ${activeTab} orders at the moment.`}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredOrders.map((order) => (
                                            <div
                                                key={order._id}
                                                className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                                                {getStatusIcon(order.status)}
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </div>
                                                            <span className="text-lg font-semibold text-gray-900">
                                                                {order.data?.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <FaPhone className="w-3 h-3" />
                                                                {order.data?.contact}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <FaMoneyBillWave className="w-3 h-3" />
                                                                ₹{order.amount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col sm:items-end gap-2">
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-green-600">₹{order.amount}</p>
                                                            <p className="text-sm text-gray-500">Delivery Fee</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Customer Address */}
                                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-start gap-2">
                                                        <MdLocationOn className="text-gray-500 mt-1 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-medium text-gray-700">Delivery Address</p>
                                                            <p className="text-gray-600">{order.data?.address}, {order.data?.city}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Update */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Update Delivery Status:</p>
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                                                        >
                                                            <option value="pending">⏳ Pending</option>
                                                            <option value="confirmed">✅ Confirmed</option>
                                                            <option value="on the way">🚚 On the Way</option>
                                                            <option value="delivered">📦 Delivered</option>
                                                            <option value="failed to deliver">❌ Failed to Deliver</option>
                                                        </select>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => alert(`Order details for ${order.data?.name}`)}
                                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            {!loading && filteredOrders.length > 0 && (
                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Showing {filteredOrders.length} of {orders.length} orders
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                Total: {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliverPartnerProfile;