'use client'
import React, { useEffect, useState } from 'react';
import DeliveryHeader from '../_components/DeliveryHeader';
import { useRouter } from 'next/navigation';

const DeliverPartnerProfile = () => {
    const router = useRouter();
    const [deliveryPartner, setDeliveryPartner] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
            const response = await fetch(`http://localhost:3000/api/deliverypartners/orders/${partnerId}`);
            const data = await response.json();
            if (data.success) {
                setOrders(data.result);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };
    // Trigger API call when deliveryPartner is set
    useEffect(() => {
        if (deliveryPartner?._id) {
            fetchPartnerOrders(deliveryPartner._id);
        }
    }, [deliveryPartner]);

    return (
        <div>
            <DeliveryHeader />
            <div className="max-w-3xl mx-auto px-4 py-30 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Delivery Partner Profile</h2>

                {deliveryPartner && (
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                        <p className="text-lg font-medium text-gray-700 mb-1">
                            <strong>Name:</strong> {deliveryPartner.name}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>City:</strong> {deliveryPartner.city}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Address:</strong> {deliveryPartner.address}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Mobile:</strong> {deliveryPartner.mobile}
                        </p>
                    </div>
                )}

                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Your Assigned Orders</h3>

                    {loading ? (
                        <p className="text-gray-500">Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-gray-500 text-center">No orders assigned yet.</p>
                    ) : (
                        orders.map((order, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-md font-semibold text-gray-800">
                                        {order.data?.name}
                                    </h4>

                                    {/* 🔽 Status Dropdown */}
                                    <select
                                        value={order.status}
                                        onChange={async (e) => {
                                            const newStatus = e.target.value;
                                            try {
                                                const res = await fetch(`http://localhost:3000/api/deliverypartners/orders/${deliveryPartner._id}`, {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ id: order?._id, status: newStatus }),
                                                });
                                                const json = await res.json();
                                                if (json.success) {
                                                    // Update status locally
                                                    setOrders((prev) =>
                                                        prev.map((o) =>
                                                            o._id === order._id ? { ...o, status: newStatus } : o
                                                        )
                                                    );
                                                }
                                            } catch (error) {
                                                console.error("Failed to update status:", error);
                                            }
                                        }}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="on the way">On the Way</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="failed to deliver">Failed to Deliver</option>
                                    </select>
                                </div>

                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Address:</strong> {order.data?.address}, {order.data?.city}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Contact:</strong> {order.data?.contact}
                                </p>
                                <div className="mt-2 text-right">
                                    <span className="text-base font-bold text-green-600">
                                        ₹{order.amount}
                                    </span>
                                </div>
                            </div>

                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliverPartnerProfile;
