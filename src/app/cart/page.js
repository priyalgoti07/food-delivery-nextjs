'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomersHeader from '../_components/CustomersHeader';
import { incrementQuantity, decrementQuantity } from '@/app/store/slices/cartSlice';

const CartPage = () => {
    const route = useRouter();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const storedUser = localStorage.getItem('user');
    const cartItems = useSelector((state) => state.cart.items);
    const restoDeatils = JSON.parse(localStorage.getItem("restaurantDetails"))


    useEffect(() => {
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);


    const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 96;
    const gst = 57;
    const total = parseFloat(itemTotal.toFixed(2)) + deliveryFee + gst;

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
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4  transition"
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
            <div className="max-w-6xl mx-auto mt-24 mb-10 flex flex-col md:flex-row gap-10 py-10">
                <div className="flex-1 space-y-6">
                    {!user ? (
                        <div className="bg-white -lg shadow-md p-6 space-y-4 flex  items-center justify-between">
                            <div className='flex flex-col gap-4'>
                                <h2 className="text-lg font-semibold text-gray-800">Account</h2>
                                <p className="text-sm text-gray-500">To place your order now, log in to your existing account or sign up.</p>
                                <div className="flex gap-4">
                                    <Link href="/user-auth" className="w-1/2 bg-white border border-green-600 text-green-600 text-center py-2  hover:bg-green-50">
                                        Have an account? <br />
                                        LOG IN</Link>
                                    <Link href="/user-auth" className="w-1/2 bg-green-600 text-white text-center py-2  hover:bg-green-700">
                                        New to Foody? <br />
                                        SIGN UP</Link>
                                </div>
                            </div>
                            <div>
                                <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_147,h_140/Image-login_btpq7r" alt="Empty Cart" className="w-30x-auto mt-6" />
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-4'>
                            <div className="bg-white -lg shadow-md p-6 space-y-4 text-lg font-semibold text-gray-800">
                                <div className="flex items-center gap-5">
                                    <h2 className="text-lg font-semibold text-gray-800">Logged In</h2>
                                    <FaCheckCircle className="text-green-600 text-lg" />
                                </div>
                                <p className="text-sm text-gray-600">{user.name} | {user.mobile}</p>
                            </div>
                            <div className="bg-white shadow-md p-6 space-y-4 text-gray-800">
                                <div className="flex items-center gap-5 font-semibold ">
                                    <h2 className=" text-gray-800">Delivery address</h2>
                                    <FaCheckCircle className="text-green-600" />
                                </div>
                                <p className='font-semibold'>Other</p>
                                <p className="text-[14px] text-gray-600">{user.address} | {user.city}</p>
                            </div>
                            <div className="bg-white shadow-md p-6 space-y-4 text-gray-800">
                                <div className="flex items-center gap-5 font-semibold ">
                                    <h2 className=" text-gray-800">Choose payment method</h2>
                                </div>
                                <button className="bg-green-600 p-2 w-full my-2 text-white font-bold shadow-md hover:shadow-lg transition-shadow" onClick={() => route.push('/payments')}>PROCEED TO PAY</button>
                            </div>
                        </div>

                    )}


                </div>

                <div className="w-full md:w-[350px] space-y-4">
                    <div className="bg-white p-6 -lg shadow space-y-4">

                        <h2 className="text-lg font-semibold text-gray-800" onClick={() => route.push(`explore/${restoDeatils.name}?id=${restoDeatils._id}`)}>{restoDeatils.name}</h2>

                        {cartItems.map((item) => (
                            <div key={item._id} className="flex justify-between items-center  py-2">
                                <div className="flex gap-3 items-center">
                                    {/* <img src={item.img_path} alt={item.name} className="w-14 h-14  object-cover" /> */}
                                    <div>
                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                        {/* <p className="text-sm text-green-500">Customize &gt;</p> */}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className='border border-gray-300 px-2  flex gap-2 items-center'>
                                        <button onClick={() => dispatch(decrementQuantity(item._id))} className='text-gray-300'>−</button>
                                        <span className="text-sm text-green-600 hover:text-green-700">{item.quantity}</span>
                                        <button onClick={() => dispatch(incrementQuantity(item._id))} className=" text-green-600 hover:text-green-700 hover:font-bold">+</button>
                                    </div>
                                    {/* <div className="w-16 text-right text-gray-700 font-medium">₹{item.quantity * item.price}</div> */}
                                    <div className="w-16 text-right text-gray-700 font-medium">₹{(parseFloat(item.quantity * item.price).toFixed(2))}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white border border-gray-200 p-4 -lg text-sm text-gray-600">
                        <label className="flex items-start gap-2">
                            <input type="checkbox" className="mt-1" />
                            <span>
                                <strong>Opt in for No-contact Delivery</strong><br />
                                Unwell or avoiding contact? Partner will leave order at your door (not for COD).
                            </span>
                        </label>
                    </div>

                    <div className="bg-white border border-gray-200 p-4 -lg cursor-pointer hover:bg-gray-50 text-gray-700">
                        <p className="font-medium">Apply Coupon</p>
                    </div>

                    <div className="bg-white border border-gray-200 p-4 -lg text-gray-700 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Item Total</span>
                            <span>₹{parseFloat(itemTotal.toFixed(2))}</span>
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
            </div>
        </>
    );
};

export default CartPage;
