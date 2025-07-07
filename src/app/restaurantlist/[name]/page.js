'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import RestaurentCard from '@/app/_components/RestaurentCard';
import RestaurantHeader from '@/app/_components/RestaurantHeader';

const page = () => {
    const params = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const category = decodeURIComponent(params.name || ''); // e.g., "Samosas"

    useEffect(() => {
        getRestaurantes()
    }, [])

    const getRestaurantes = async () => {

        try {
            let res = await fetch(`http://localhost:3000/api/restaurant/foods?name=${encodeURIComponent(category)}`)
            const data = await res.json();
            if (data.success) {
                setRestaurants(data.restaurants);
                console.log()
            } else {
                console.warn('No restaurants found for this category');
            }
        } catch (error) {
            console.error('Fetch failed', error);
        }

    }
    
    return (
        <div>
            <RestaurantHeader />
            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold mb-4">{category}</h1>
                </div>

                {/* Restaurant Cards */}
                <div className="flex flex-wrap gap-6 justify-start px-4 py-2">
                    {restaurants.length > 0 ? (
                        restaurants.map((resto) => (
                            <RestaurentCard key={resto._id} data={resto} />
                        ))
                    ) : (
                        <p className="text-gray-600">No restaurants available.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default page