/* eslint-disable @next/next/no-img-element */
'use client'
import CustomersHeader from '@/app/_components/CustomersHeader';
import { addItemTocart, clearCart, decrementQuantity, incrementQuantity } from '@/app/store/slices/cartSlice';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const Page = () => {
    const params = useParams();
    const searchParams = useSearchParams(); // URLSearchParams object
    const id = searchParams.get('id'); // Get the ID from query string

    const [restaurantDetails, setRestaurantDetails] = useState();
    const [foodDetails, setFoodDetails] = useState();
    const [selectedItem, setSelectedItem] = useState(null);
    const [confirm, setConfirm] = useState('');
    const [pandingItem, setPandinItem] = useState([]);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    useEffect(() => {
        loadRestaurantdetails()
    }, [])

    const loadRestaurantdetails = async () => {
        try {
            let response = await fetch(`http://localhost:3000/api/customer/${id}`)
            response = await response.json();
            if (response.success) {
                setRestaurantDetails(response?.details)
                localStorage.setItem("restaurantDetails", JSON.stringify(response?.details))
                setFoodDetails(response?.
                    foodItms)
            }
        } catch (error) {

        }
    }
    const getQuantity = (itemId) => {
        if (!itemId) return 0;
        const found = cartItems.find((i) => i._id?.toString() === itemId?.toString());
        return found ? found.quantity : 0;
    };

    const addTocat = (item) => {
        if (cartItems?.length === 0) {
            dispatch(addItemTocart(item))
        } else {
            if (cartItems?.[0]?.resto_id === item?.resto_id) {
                dispatch(addItemTocart(item))
            } else {
                setConfirm(true)
                setPandinItem(item)
            }
        }
    }

    const handleRepalceResto = () => {
        dispatch(clearCart([]))
        dispatch(addItemTocart(pandingItem))
        setConfirm(false)
    }

    return (
        <>
            <CustomersHeader />
            <div className="relative bg-[url('https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg')] bg-cover bg-center min-h-[400px]">
                {/* Black shadow overlay */}
                <div className="absolute inset-0 bg-black opacity-50 "></div>
                <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                    <h1 className="text-6xl font-bold mb-4">{decodeURI(params.name)}</h1>

                </div>

            </div>
            {/* Restaurant Info Section */}
            <div className="max-w-4xl mx-auto px-4 py-6 bg-white shadow-lg rounded-xl mt-8 space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Restaurant Info</h2>
                <p><strong>Contact:</strong> {restaurantDetails?.contact}</p>
                <p><strong>City:</strong> {restaurantDetails?.city}</p>
                <p><strong>Address:</strong> {restaurantDetails?.address}</p>
                <p><strong>Email:</strong> {restaurantDetails?.email}</p>
            </div>
            <div>
                {/* Flex layout of food cards */}
                <div className="max-w-6xl mx-auto px-4 py-10 flex flex-wrap gap-6 justify-center">
                    {foodDetails?.map((item) => {
                        const quantity = getQuantity(item._id);
                        return (
                            <div
                                key={item._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer w-full sm:w-[48%] lg:w-[30%]"
                                onClick={() => setSelectedItem(item)}
                            >
                                <img
                                    src={item.img_path}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded"
                                />
                                <div className="p-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h4>
                                    <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                                    <div className="mt-2 text-green-600 font-bold">₹{item.price}</div>
                                    {/* Add to Cart Button */}
                                    {quantity > 0 ? (
                                        <div className="mt-4 flex items-center justify-between border border-gray-200 px-4 py-2 rounded-lg"
                                            style={{ color: 'rgb(27, 166, 114)' }}

                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(decrementQuantity(item._id));
                                                }}
                                                className="px-3 font-bold text-xl"
                                            >
                                                −
                                            </button>
                                            <span className="font-semibold">{quantity}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(incrementQuantity(item._id));
                                                }}
                                                className="px-3 font-bold text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="mt-4 w-full border border-gray-200 text-sm font-bold py-2 px-4 rounded-lg transition-all duration-200"
                                            style={{ color: 'rgb(27, 166, 114)' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(2, 6, 12, 0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addTocat(item);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal Popup */}
                {selectedItem && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedItem(null)}>
                        <div className="bg-white rounded-xl p-6 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="absolute top-1 right-2 text-gray-500 hover:text-red-500 text-2xl"
                                onClick={() => setSelectedItem(null)}
                            >
                                &times;
                            </button>
                            <img
                                src={selectedItem?.img_path}
                                alt={selectedItem.name}
                                className="w-full h-64 object-cover rounded-md mb-4"
                            />
                            <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
                            <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                            <div className="text-xl font-semibold text-green-600 mb-4">₹{selectedItem.price}</div>

                            {/* Modal Quantity Buttons */}
                            {getQuantity(selectedItem._id) > 0 ? (
                                <div className="flex items-center justify-between border border-gray-200 px-4 py-2 rounded-lg"
                                    style={{ color: 'rgb(27, 166, 114)' }}
                                >
                                    <button
                                        onClick={() => dispatch(decrementQuantity(selectedItem._id))}
                                        className="px-3 font-bold text-xl"
                                    >
                                        −
                                    </button>
                                    <span className="font-semibold">{getQuantity(selectedItem._id)}</span>
                                    <button
                                        onClick={() => dispatch(incrementQuantity(selectedItem._id))}
                                        className="px-3 font-bold text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="w-full border border-gray-300 text-sm font-bold py-2 px-4 rounded-lg transition-all duration-200"
                                    style={{ color: 'rgb(27, 166, 114)' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(2, 6, 12, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                    onClick={() => addTocat(selectedItem)}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div >

            {confirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center relative">
                        <button
                            className="absolute top-2 right-3 text-gray-400 text-2xl hover:text-red-500"
                            onClick={() => setConfirm(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Replace Cart Items?</h2>
                        <p className="text-gray-600 mb-6">
                            Your cart has items from another restaurant. Do you want to replace them?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                                onClick={() => setConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={handleRepalceResto}
                            >
                                Yes, Replace
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Page