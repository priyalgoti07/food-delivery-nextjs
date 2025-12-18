// components/FoodItems.jsx
import React from "react";
import { useRouter } from "next/navigation";

const FoodItems = ({ foodList }) => {
    const router = useRouter();

    // Remove duplicates based on name similarity
    const seen = new Map();
    const uniqueFoodList = foodList.filter((item) => {
        const name = item.name.toLowerCase();
        for (const key of seen.keys()) {
            if (name.includes(key) || key.includes(name)) {
                return false;
            }
        }
        seen.set(name, true);
        return true;
    });

    // Split into rows for better layout
    const row1 = uniqueFoodList.filter((_, i) => i % 2 === 0);
    const row2 = uniqueFoodList.filter((_, i) => i % 2 !== 0);

    return (
        <div className="flex gap-8 md:gap-10 lg:gap-12">
            {row1.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                    {/* First Row Item */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                        <button
                            onClick={() => router.push(`/restaurantlist/${encodeURIComponent(item.name)}?id=${item._id}`)}
                            className="relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 flex items-center justify-center bg-white rounded-full border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden"
                        >
                            <img
                                src={item.img_path || "https://via.placeholder.com/300"}
                                alt={item.name}
                                className="w-full h-full object-cover pointer-events-none select-none"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                        </button>
                        <p className="text-center mt-4 font-semibold text-gray-800 text-sm md:text-base truncate w-32 md:w-36">
                            {item.name}
                        </p>
                    </div>

                    {/* Second Row Item (if exists) */}
                    {row2[index] && (
                        <div className="group relative mt-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                            <button
                                onClick={() => router.push(`/restaurantlist/${encodeURIComponent(row2[index].name)}?id=${row2[index]._id}`)}
                                className="relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 flex items-center justify-center bg-white rounded-full border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden"
                            >
                                <img
                                    src={row2[index].img_path || "https://via.placeholder.com/300"}
                                    alt={row2[index].name}
                                    className="w-full h-full object-cover pointer-events-none select-none"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                            </button>
                            <p className="text-center mt-4 font-semibold text-gray-800 text-sm md:text-base truncate w-32 md:w-36">
                                {row2[index].name}
                            </p>
                        </div>
                    )}
                </div>
            ))}
            
            {/* Empty state for food items */}
            {uniqueFoodList.length === 0 && (
                <div className="w-full py-12 flex flex-col items-center justify-center text-gray-400">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium">No food categories available</p>
                    <p className="text-sm mt-1">Try a different search</p>
                </div>
            )}
        </div>
    );
};

export default FoodItems;