'use client';

import React, { useEffect, useState } from 'react';
import CustomersHeader from '../_components/CustomersHeader';
import RestaurantFooter from '../_components/RestaurantFooter';
import { request } from '../lib/request';

const Profile = () => {
    const storedUser = typeof window !== 'undefined' && localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [myOrders, setMyOrders] = useState([]);

    const getMyOrders = async () => {
        if (!user?._id) return;

        try {
            const data = await request.get(`/api/order?id=${user._id}`);
            if (data.success) {
                setMyOrders(data.result);
            }
        } catch (error) {
            console.error("Failed to load orders", error);
        }
    };

    useEffect(() => {
        getMyOrders();
    }, []);

    return (
        <div className='py-20'>
            <CustomersHeader />

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>

                {myOrders.length === 0 ? (
                    <p className="text-gray-500 text-center">No orders found.</p>
                ) : (
                    myOrders.map((order, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {order.data.name}
                                </h3>
                                <span
                                    className={`px-3 py-1 text-xs rounded-full font-medium ${order.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : order.status === 'confirmed'
                                                ? 'bg-blue-100 text-blue-800'
                                                : order.status === 'on the way'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : order.status === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'failed to deliver'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-700' // fallback style
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Address:</strong> {order.data.address}, {order.data.city}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Contact:</strong> {order.data.contact}
                            </p>

                            <div className="mt-3 text-right">
                                <span className="text-base font-bold text-green-600">
                                    ₹{order.amount}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <RestaurantFooter />
        </div>
    );
};

export default Profile;
