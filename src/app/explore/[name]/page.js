/* eslint-disable @next/next/no-img-element */
'use client'
import CustomersHeader from '@/app/_components/CustomersHeader';
import { addItemTocart, clearCart, decrementQuantity, incrementQuantity } from '@/app/store/slices/cartSlice';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '@/app/lib/request';
import { ShoppingCart, MapPin, Phone, Mail, Clock, Star } from 'lucide-react';

const Page = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [foodDetails, setFoodDetails] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [pendingItem, setPendingItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        loadRestaurantDetails();
    }, []);

    const loadRestaurantDetails = async () => {
        try {
            setLoading(true);
            const data = await request.get(`/api/customer/${id}`);
            if (data.success) {
                setRestaurantDetails(data?.details);
                setFoodDetails(data?.foodItms || []);
                localStorage.setItem("restaurantDetails", JSON.stringify(data?.details));
            }
        } catch (error) {
            console.error("Failed to load restaurant details", error);
        } finally {
            setLoading(false);
        }
    };

    const getQuantity = (itemId) => {
        if (!itemId) return 0;
        const found = cartItems.find((i) => i._id?.toString() === itemId?.toString());
        return found ? found.quantity : 0;
    };

    const addToCart = (item) => {
        if (cartItems?.length === 0) {
            dispatch(addItemTocart(item));
        } else {
            if (cartItems?.[0]?.resto_id === item?.resto_id) {
                dispatch(addItemTocart(item));
            } else {
                setConfirm(true);
                setPendingItem(item);
            }
        }
    };

    const handleReplaceResto = () => {
        dispatch(clearCart([]));
        dispatch(addItemTocart(pendingItem));
        setConfirm(false);
        setPendingItem(null);
    };

    // Extract unique categories
    const categories = ['all', ...new Set(foodDetails.map(item => item.category || 'Uncategorized'))];

    // Filter food items by category
    const filteredFoodDetails = activeCategory === 'all' 
        ? foodDetails 
        : foodDetails.filter(item => item.category === activeCategory);

    // Loading state
    if (loading) {
        return (
            <>
                <CustomersHeader />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
                            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-600 font-medium">Loading restaurant details...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <CustomersHeader />
            
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 min-h-[60vh] md:min-h-[70vh]">
                {/* Background Image with Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg')`,
                        opacity: 0.3
                    }}
                />
                
                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col justify-center min-h-[60vh] md:min-h-[70vh]">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                                <Star size={14} />
                                <span>4.5</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-300">Restaurant</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            {decodeURI(params.name)}
                        </h1>
                        
                        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
                            Experience the finest culinary delights crafted with passion and tradition.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <Clock size={18} className="text-orange-400" />
                                <span className="text-white">Open until 11 PM</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <ShoppingCart size={18} className="text-orange-400" />
                                <span className="text-white">Free delivery • 20 min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restaurant Info Section */}
            <div className="container mx-auto px-4 py-8 -mt-16 relative z-20">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <Phone className="text-orange-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Contact</h3>
                                <p className="text-gray-600">{restaurantDetails?.contact || 'Not available'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <MapPin className="text-orange-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Location</h3>
                                <p className="text-gray-600">{restaurantDetails?.city}, {restaurantDetails?.address}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <Mail className="text-orange-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                <p className="text-gray-600">{restaurantDetails?.email || 'Not available'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <Clock className="text-orange-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Timings</h3>
                                <p className="text-gray-600">10 AM - 11 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="container mx-auto px-4 py-8">
                {/* Category Filter */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex space-x-2 pb-4 min-w-max">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-3 rounded-full font-medium transition-all ${
                                    activeCategory === category
                                        ? 'bg-orange-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Food Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFoodDetails?.map((item) => {
                        const quantity = getQuantity(item._id);
                        return (
                            <div
                                key={item._id}
                                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
                                onClick={() => setSelectedItem(item)}
                            >
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={item.img_path || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="font-bold text-green-600">₹{item.price}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                        {item.category && (
                                            <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                                {item.category}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                                    {/* Add to Cart */}
                                    <div className="flex items-center justify-between">
                                        {quantity > 0 ? (
                                            <div className="flex items-center gap-4 bg-orange-50 rounded-xl px-4 py-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dispatch(decrementQuantity(item._id));
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    <span className="text-xl font-bold text-orange-600">−</span>
                                                </button>
                                                <span className="font-bold text-lg text-gray-800">{quantity}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dispatch(incrementQuantity(item._id));
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    <span className="text-xl font-bold text-orange-600">+</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(item);
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                        
                                        <button 
                                            className="ml-2 w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item);
                                            }}
                                        >
                                            <ShoppingCart size={20} className="text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredFoodDetails.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <ShoppingCart size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No items found</h3>
                        <p className="text-gray-500">Try selecting a different category</p>
                    </div>
                )}
            </div>

            {/* Item Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                            onClick={() => setSelectedItem(null)}
                        >
                            <span className="text-2xl font-bold text-gray-700">×</span>
                        </button>
                        
                        {/* Modal Image */}
                        <div className="relative h-64 md:h-80">
                            <img
                                src={selectedItem?.img_path || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
                                alt={selectedItem.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl">
                                <span className="text-2xl font-bold text-green-600">₹{selectedItem.price}</span>
                            </div>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-3xl font-bold text-gray-900">{selectedItem.name}</h2>
                                {selectedItem.category && (
                                    <span className="text-sm font-medium px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                                        {selectedItem.category}
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">{selectedItem.description}</p>
                            
                            <div className="flex items-center justify-between">
                                {getQuantity(selectedItem._id) > 0 ? (
                                    <div className="flex items-center gap-6 bg-orange-50 rounded-xl px-6 py-3">
                                        <button
                                            onClick={() => dispatch(decrementQuantity(selectedItem._id))}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <span className="text-xl font-bold text-orange-600">−</span>
                                        </button>
                                        <span className="text-2xl font-bold text-gray-800">{getQuantity(selectedItem._id)}</span>
                                        <button
                                            onClick={() => dispatch(incrementQuantity(selectedItem._id))}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <span className="text-xl font-bold text-orange-600">+</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-lg"
                                        onClick={() => addToCart(selectedItem)}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                                
                                <button 
                                    className="ml-4 w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    onClick={() => addToCart(selectedItem)}
                                >
                                    <ShoppingCart size={24} className="text-gray-700" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                                <ShoppingCart className="text-orange-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart Conflict</h2>
                            <p className="text-gray-600">
                                Your cart contains items from another restaurant. Would you like to clear your cart and add items from this restaurant instead?
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            <button
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                    setConfirm(false);
                                    setPendingItem(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                                onClick={handleReplaceResto}
                            >
                                Replace Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;