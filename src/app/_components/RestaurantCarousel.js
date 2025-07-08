// components/RestaurantCarousel.jsx
import React, { useRef } from "react";
import RestaurentCard from "./RestaurentCard";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import FoodItems from "./FoodItems";

const RestaurantCarousel = ({ restaurants, foodList, ref }) => {

    const scroll = (direction) => {
        const container = ref.current;
        const scrollAmount = 350; // Adjust as per card width
        if (direction === "left") {
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="relative w-full">
            {/* Heading */}
            <div className={`flex mb-4 ${restaurants?.length > 0 ? "justify-between" : "justify-end"}`}>
                {
                    restaurants?.length > 0 &&
                    <h2 className="text-2xl font-bold m1-4 pl-4">
                        Discover best restaurants
                    </h2>
                }
                {/* Navigation buttons */}
                <div className="flex gap-2">
                    <button
                        className="h-8 w-8 bg-white shadow-md rounded-full p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => scroll("left")}
                    >
                        <GoArrowLeft />
                    </button>
                    <button
                        className="h-8 w-8 bg-white shadow-md rounded-full p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => scroll("right")}
                    >
                        <GoArrowRight />
                    </button>
                </div>
            </div>

            {/* Cards container */}
            <div
                ref={ref}
                className={`flex ${restaurants?.length > 0 ? "gap-4" : "gap-12"}  overflow-x-auto overflow-y-hidden scroll-smooth flex gap-4 px-4 py-2 no-scrollbar`}
            >
                {foodList ?
                    <FoodItems foodList={foodList} />
                    :
                    restaurants?.map((item) => (
                        <RestaurentCard key={item._id} data={item} />
                    ))}
            </div>
        </div>
    );
};

export default RestaurantCarousel;
