'use client';
import AddFooditem from '@/app/_components/AddFooditem';
import FooditemList from '@/app/_components/FooditemList';
import RestaurantHeader from '@/app/_components/RestaurantHeader';
import React, { useState } from 'react';

const Dashboard = () => {
    const [addItem, setAddItem] = useState(false);

    return (
        <>
            <RestaurantHeader />
            <div className="flex gap-4 justify-center my-4">
                <button
                    onClick={() => setAddItem(true)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${addItem
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-100'
                        }`}
                >
                    Add Food
                </button>

                <button
                    onClick={() => setAddItem(false)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${!addItem
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-100'
                        }`}
                >
                    Dashboard
                </button>
            </div>

            <div className="px-6 py-4">
                {addItem ? <AddFooditem /> : <FooditemList />}
            </div>
        </>
    );
};

export default Dashboard;
