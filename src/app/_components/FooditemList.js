'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { request } from '../lib/request';
import { FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';

const FooditemList = ({ onEditItem }) => { // Receive onEditItem prop
    const [fooditems, setFooditems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadFooditems();
    }, []);

    const loadFooditems = async () => {
        setLoading(true);
        try {
            const userId = JSON.parse(localStorage.getItem("restaurantUser"));
            let resto_id = userId._id;
            const data = await request.get(`/api/restaurant/foods/${resto_id}`);
            if (data.result) {
                setFooditems(data.result);
            }
        } catch (error) {
            console.error("Error loading food items:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }
        
        try {
            const data = await request.delete(`/api/restaurant/foods/${id}`);
            if (data.success) {
                alert("Item deleted successfully!");
                loadFooditems();
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    // Use onEditItem prop instead of router
    const updateItem = (id) => {
        if (onEditItem) {
            onEditItem(id); // Call parent function
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Food Item List</h1>
                <div className="text-sm text-gray-600">
                    {fooditems.length} item{fooditems.length !== 1 ? 's' : ''}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading food items...</p>
                </div>
            ) : fooditems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No food items found. Add your first item!</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fooditems.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">₹{item.price}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.img_path ? (
                                            <img 
                                                src={item.img_path} 
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                                <span className="text-xs text-gray-500">No image</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => updateItem(item._id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                            >
                                                <FaEdit className="w-3 h-3 mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteItem(item._id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                                            >
                                                <FaTrash className="w-3 h-3 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FooditemList;