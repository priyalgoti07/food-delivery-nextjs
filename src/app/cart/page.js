'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementQuantity, decrementQuantity } from '@/app/store/slices/cartSlice';
import CustomersHeader from '../_components/CustomersHeader';
import Link from 'next/link';

const CartPage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 96;
    const gst = 57;
    const total = itemTotal + deliveryFee + gst;

    if (cartItems.length === 0) {
        return (
            <>
                <CustomersHeader />
                <div className="min-h-[80vh] flex flex-col items-center justify-center text-gray-600">
                    <img
                        src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0"
                        alt="Empty Cart"
                        className="w-72 mb-6"
                    />
                    <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">You can go to the home page to view more restaurants.</p>
                    <Link
                        href="/"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                        SEE RESTAURANTS NEAR YOU
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <CustomersHeader />
            <div className="max-w-5xl mx-auto mt-40 mb-10 bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Cart Summary</h2>

                    {cartItems.map((item) => (
                        <div key={item._id} className="flex justify-between items-center border-b border-gray-200 py-4">
                            <div className="flex gap-3 items-center">
                                <img src={item.img_path} alt={item.name} className="w-14 h-14 rounded object-cover" />
                                <div>
                                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-green-500">Customize &gt;</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => dispatch(decrementQuantity(item._id))}
                                    className="border border-gray-300 px-2 rounded hover:bg-gray-100"
                                >−</button>
                                <span className="font-medium text-gray-700">{item.quantity}</span>
                                <button
                                    onClick={() => dispatch(incrementQuantity(item._id))}
                                    className="border border-gray-300 px-2 rounded hover:bg-gray-100"
                                >+</button>
                                <div className="w-16 text-right text-gray-700 font-medium">₹{item.price}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border border-gray-200 p-3 rounded-lg text-sm text-gray-600">
                    <label className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>
                            <strong>Opt in for No-contact Delivery</strong><br />
                            Unwell or avoiding contact? Partner will leave order at your door (not for COD).
                        </span>
                    </label>
                </div>

                <div className="border border-gray-200 p-3 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-700">
                    <p className="font-medium">Apply Coupon</p>
                </div>

                <div className="text-gray-700 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Item Total</span>
                        <span>₹{itemTotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Fee | 14.1 kms</span>
                        <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>GST & Other Charges</span>
                        <span>₹{gst}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between font-semibold text-base">
                        <span>TO PAY</span>
                        <span>₹{total}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
