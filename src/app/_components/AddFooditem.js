'use client';
import React, { useState, useEffect } from 'react';
import { request } from '../lib/request';
import { FaImage, FaRupeeSign, FaEdit, FaUpload } from 'react-icons/fa';
import { MdDescription, MdFastfood, MdClose } from 'react-icons/md';

const AddFooditem = ({ setActiveTab, editId }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        path: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (editId) {
            fetchFoodItem();
        }
    }, [editId]);

    const fetchFoodItem = async () => {
        try {
            const data = await request.get(`/api/restaurant/foods/edit/${editId}`);
            if (data.success) {
                setFormData({
                    name: data.result?.name || '',
                    price: data.result?.price || '',
                    path: data.result?.img_path || '',
                    description: data.result?.description || ''
                });
            }
        } catch (error) {
            console.error("Error fetching food item:", error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Food name is required';
        if (!formData.price.trim()) newErrors.price = 'Price is required';
        else if (isNaN(formData.price) || Number(formData.price) <= 0) 
            newErrors.price = 'Enter a valid price';
        if (!formData.path.trim()) newErrors.path = 'Image URL is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length < 10) 
            newErrors.description = 'Description must be at least 10 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);

        try {
            const restaurantUser = JSON.parse(localStorage?.getItem("restaurantUser") || '{}');
            
            if (editId) {
                // Update existing item
                const data = await request.put(`/api/restaurant/foods/edit/${editId}`, {
                    name: formData.name,
                    price: formData.price,
                    path: formData.path,
                    description: formData.description,
                });
                
                if (data.success) {
                    alert("Food item updated successfully!");
                    setActiveTab('manage-food');
                } else {
                    alert("Failed to update food item. Please try again.");
                }
            } else {
                // Add new item
                const data = await request.post('/api/restaurant/foods', {
                    name: formData.name,
                    img_path: formData.path,
                    price: formData.price,
                    description: formData.description,
                    ...(restaurantUser?._id && { resto_id: restaurantUser._id }),
                });
                
                if (data.success) {
                    alert("Food item added successfully!");
                    setFormData({
                        name: '',
                        price: '',
                        path: '',
                        description: ''
                    });
                    setActiveTab('manage-food');
                } else {
                    alert("Failed to add food item. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {editId ? 'Edit Food Item' : 'Add New Food Item'}
                </h3>
                <p className="text-gray-600">
                    {editId ? 'Update your menu item details' : 'Add delicious items to your restaurant menu'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                {/* Food Name */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Food Name *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MdFastfood className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter food name (e.g., Margherita Pizza)"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Price */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaRupeeSign className="text-gray-400" />
                        </div>
                        <input
                            type="number"
                            name="price"
                            placeholder="Enter price (e.g., 299)"
                            min="0"
                            step="0.01"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.price && (
                        <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                    )}
                </div>

                {/* Image URL */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaImage className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="path"
                            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.path ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                            value={formData.path}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.path && (
                        <p className="mt-2 text-sm text-red-600">{errors.path}</p>
                    )}
                    {formData.path && (
                        <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                            <div className="w-32 h-32 rounded-lg overflow-hidden border">
                                <img 
                                    src={formData.path} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <MdDescription className="text-gray-400" />
                        </div>
                        <textarea
                            name="description"
                            placeholder="Describe your food item (ingredients, special notes, etc.)"
                            rows="4"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.description && (
                        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                        {formData.description.length}/500 characters
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                {editId ? 'Updating...' : 'Adding...'}
                            </>
                        ) : (
                            <>
                                <FaUpload className="w-4 h-4" />
                                {editId ? 'Update Food Item' : 'Add Food Item'}
                            </>
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setActiveTab('manage-food')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        * Required fields. Make sure all information is accurate before submitting.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AddFooditem;