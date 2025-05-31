/* eslint-disable @next/next/no-img-element */
'use client'
import CustomersHeader from '@/app/_components/CustomersHeader';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
const Page = () => {
    const params = useParams();
    const searchParams = useSearchParams(); // URLSearchParams object
    const id = searchParams.get('id'); // Get the ID from query string

    const [restaurantDetails, setRestaurantDetails] = useState();
    const [foodDetails, setFoodDetails] = useState();
    const [selectedItem, setSelectedItem] = useState(null);
    useEffect(() => {
        loadRestaurantdetails()
    }, [])


    const loadRestaurantdetails = async () => {
        try {
            let response = await fetch(`http://localhost:3000/api/customer/${id}`)
            response = await response.json();
            console.log("resp", response)
            if (response.success) {
                setRestaurantDetails(response?.details)
                setFoodDetails(response?.
                    foodItms)
            }
        } catch (error) {

        }
    }
    console.log("id=-------------->I", foodDetails, restaurantDetails?.contact)
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
                <>
                    {/* Flex layout of food cards */}
                    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-wrap gap-6 justify-center">
                        {foodDetails?.map((item) => (
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
                                    <button
                                        className="mt-4 w-full border-1 border-gray-200 text-sm font-bold py-2 px-4 rounded-lg transition-all duration-200"
                                        style={{
                                            color: 'rgb(27, 166, 114)',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(2, 6, 12, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Add to cart");
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Modal Popup */}
                    {selectedItem && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
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
                                <div className="text-xl font-semibold text-green-600">₹{selectedItem.price}</div>
                            </div>
                        </div>
                    )}
                </>
            </div>

        </>
    )
}

export default Page