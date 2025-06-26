'use client';
import React, { useEffect, useState } from 'react';
import CustomersHeader from '../_components/CustomersHeader';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { useRouter } from 'next/navigation';

const PaymentOptions = () => {
    const dispatch = useDispatch();
    const router = useRouter();

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

    // useEffect(() => {
    //     if (totalAmount === 0) {
    //         router.push('/'); // Redirect to home if cart is empty
    //     }
    // }, [totalAmount])
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
                router.push('/myprofile');
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
                    className={`group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer ${isCODOpen ? 'ring-2 ring-green-500/40' : ''
                        }`}
                    onClick={toggleCOD}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                Pay on Delivery
                            </h3>
                            <p className="text-sm text-gray-500">Cash or UPI on delivery</p>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xl transition-transform duration-300 group-hover:scale-110">
                            {isCODOpen ? '−' : '+'}
                        </div>
                    </div>

                    {isCODOpen && (
                        <div className="mt-4 border-t border-dashed border-green-400 pt-4 animate-fade-in">
                            <div className="mb-3">
                                <h4 className="text-green-700 font-medium text-sm">Pay on Delivery (Cash or UPI)</h4>
                                <p className="text-xs text-gray-600 mt-1">Choose to pay with cash or scan QR code on delivery</p>
                            </div>
                            <button
                                className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={totalAmount === 0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOrder();
                                }}
                            >
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
