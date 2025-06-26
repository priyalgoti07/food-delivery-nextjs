'use client';
import React, { useEffect, useState } from 'react';
import CustomersHeader from '../_components/CustomersHeader';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';

const PaymentOptions = () => {
    const dispatch = useDispatch();
    const [isCODOpen, setIsCODOpen] = useState(false);

    const toggleCOD = () => setIsCODOpen(!isCODOpen);

    const commonBox = "bg-white shadow-sm p-4 rounded-md border border-gray-200 cursor-default";

    const cartItems = useSelector((state) => state.cart.items);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    console.log("totalAmount", totalAmount);
    const handleOrder = async () => {
        let user_id = user?._id || JSON.parse(localStorage.getItem('user'))?._id;
        let foodItemIds = cartItems.map(item => item._id).toString();
        let resto_id = cartItems.length > 0 ? cartItems[0].resto_id : '';
        let deliveryBoy_id = '67ff7d0d34d85efc5939c86a';
        let orderDetails = {
            user_Id: user_id,
            foodItemIds: foodItemIds,
            resto_id: resto_id,
            deliveryBoy_id: deliveryBoy_id, // Assuming no delivery
            amount: totalAmount.toString(),
            status: 'pending',
        }

        try {
            let respons = await fetch('http://localhost:3000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            })
            const data = await respons.json();
            if (data.success) {
                alert("Order placed successfully!");
                dispatch(clearCart([]))

            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (err) {
            alert('Something went wrong');
        }
    }

    return (
        <>
            <CustomersHeader />

            <div className="max-w-xl mx-auto my-10 space-y-4 py-20">
                <div className="bg-white shadow-sm p-5 rounded-md mb-5">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Payment Options</h2>
                    <div className="text-gray-700 text-sm">
                        <p className="mb-1">
                            <strong>{itemCount} items</strong> • <strong>Total: ₹{totalAmount}</strong>
                        </p>
                        {user?.address ? (
                            <p>
                                <strong>Delivery:</strong> {user.address} {user.city}, {user.pincode}
                            </p>
                        ) : (
                            <p className="text-red-500">No delivery address found.</p>
                        )}
                    </div>
                </div>
                <div className={commonBox}>
                    <h3 className="text-gray-700 font-medium">Wallets</h3>
                    <p className="text-sm text-gray-500 mt-1">PhonePe, Amazon Pay & more</p>
                </div>

                <div className={commonBox}>
                    <h3 className="text-gray-700 font-medium">Netbanking</h3>
                    <p className="text-sm text-gray-500 mt-1">Select from a list of banks</p>
                </div>

                {/* Pay on Delivery (expandable) */}
                <div
                    className="bg-white shadow-sm p-4 rounded-md border border-gray-300 cursor-pointer hover:shadow-md transition"
                    onClick={toggleCOD}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-gray-800 font-semibold">Pay on Delivery</h3>
                            <p className="text-sm text-gray-500">Pay in cash or pay online</p>
                        </div>
                        <span className="text-xl text-gray-600">{isCODOpen ? '−' : '+'}</span>
                    </div>
                    {/* Drawer shown when clicked */}
                    {isCODOpen && (
                        <div className="bg-white shadow-inner p-4 rounded-md border border-green-600 border-t-0 animate-fade-in">
                            <div className="mb-2">
                                <h4 className="text-green-700 font-semibold">Pay on Delivery (Cash/UPI)</h4>
                                <p className="text-sm text-gray-600">Pay cash or ask for QR code</p>
                            </div>
                            <button className="bg-green-600 hover:shadow-lg transition w-full py-2 text-white font-bold rounded" disabled={totalAmount === 0} onClick={(e) => {
                                e.stopPropagation();
                                handleOrder()
                            }}>
                                PAY ₹{totalAmount} WITH CASH
                            </button>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default PaymentOptions;
