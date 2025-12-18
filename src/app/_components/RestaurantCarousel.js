// components/RestaurantCarousel.jsx
import React, { useRef, useEffect, useState } from "react";
import RestaurentCard from "./RestaurentCard";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import FoodItems from "./FoodItems";

const RestaurantCarousel = ({ 
  restaurants, 
  foodList, 
  ref, 
  title = "Discover best restaurants",
  type = "restaurants" // "restaurants" or "food"
}) => {
    const containerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const scroll = (direction) => {
        const container = ref?.current || containerRef.current;
        if (!container) return;
        
        const scrollAmount = type === "food" ? 200 : 350; // Different scroll amounts
        if (direction === "left") {
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const checkScroll = () => {
        const container = ref?.current || containerRef.current;
        if (!container) return;
        
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
    };

    useEffect(() => {
        const container = ref?.current || containerRef.current;
        if (!container) return;
        
        checkScroll();
        container.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
        
        return () => {
            container.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [restaurants, foodList]);

    const currentRef = ref || containerRef;

    return (
        <div className="relative w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {(restaurants?.length || foodList?.length || 0)} places to explore
                    </p>
                </div>
                
                {/* Navigation buttons - Show only if there's content */}
                {(restaurants?.length > 0 || foodList?.length > 0) && (
                    <div className="flex items-center gap-2">
                        <button
                            className={`h-8 w-8 bg-white shadow rounded-full flex items-center justify-center transition-all duration-200 ${
                                showLeftArrow 
                                    ? "opacity-100 cursor-pointer hover:bg-gray-50" 
                                    : "opacity-40 cursor-not-allowed"
                            }`}
                            onClick={() => showLeftArrow && scroll("left")}
                            disabled={!showLeftArrow}
                            aria-label="Scroll left"
                        >
                            <GoArrowLeft className="text-gray-700" />
                        </button>
                        <button
                            className={`h-8 w-8 bg-white shadow rounded-full flex items-center justify-center transition-all duration-200 ${
                                showRightArrow 
                                    ? "opacity-100 cursor-pointer hover:bg-gray-50" 
                                    : "opacity-40 cursor-not-allowed"
                            }`}
                            onClick={() => showRightArrow && scroll("right")}
                            disabled={!showRightArrow}
                            aria-label="Scroll right"
                        >
                            <GoArrowRight className="text-gray-700" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content container */}
            <div
                ref={currentRef}
                className={`overflow-x-auto scroll-smooth no-scrollbar ${
                    type === "food" 
                        ? "flex gap-6 px-4 pb-2" 
                        : "flex gap-4 px-4 pb-4"
                }`}
                style={{
                    scrollPadding: "0 16px",
                }}
            >
                {foodList ? (
                    <FoodItems 
                        foodList={foodList} 
                        type={type}
                    />
                ) : (
                    restaurants?.map((item) => (
                        <RestaurentCard key={item._id} data={item} />
                    ))
                )}
            </div>
        </div>
    );
};

export default RestaurantCarousel;