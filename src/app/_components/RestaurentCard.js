// components/RestaurentCard.jsx
import React from "react";
import { useRouter } from "next/navigation";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaStar } from "react-icons/fa";

const RestaurentCard = ({ data }) => {
    const router = useRouter();

    // Generate random rating for demo (you can replace with actual data)
    const rating = Math.floor(Math.random() * 2) + 3 + Math.random();

    return (
        <div
            className="group relative min-w-[280px] sm:min-w-[300px] md:min-w-[320px] bg-white rounded-2xl h-fit shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-100 cursor-pointer overflow-hidden"
            onClick={() => router.push(`/explore/${encodeURIComponent(data.name)}?id=${data._id}`)}
        >
            {/* Image Container */}
            <div className="relative h-48 md:h-52 overflow-hidden">
                <img
                    src={data.img_path || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop"}
                    alt={data.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <FaStar className="text-yellow-500 text-sm" />
                    <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                </div>
                
                {/* View Details Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-medium">View Details →</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1">
                        {data.name}
                    </h2>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 mb-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {data.address}, {data.city}
                    </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                    {data.contact && (
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaPhone className="text-gray-400 text-sm" />
                            <span className="text-sm font-medium">{data.contact}</span>
                        </div>
                    )}
                    
                    {data.email && (
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaEnvelope className="text-gray-400 text-sm" />
                            <span className="text-sm truncate">{data.email}</span>
                        </div>
                    )}
                </div>

                {/* Tags/Categories (optional) */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                        {data.category || "Restaurant"}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        {data.city}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RestaurentCard;