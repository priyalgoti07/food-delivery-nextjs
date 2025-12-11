'use client';
import React, { useState } from 'react';
import AddFooditem from '@/app/_components/AddFooditem';
import FooditemList from '@/app/_components/FooditemList';
import RestaurantHeader from '@/app/_components/RestaurantHeader';
import { FaPlus, FaThLarge, FaChartLine, FaUtensils } from 'react-icons/fa';
import { MdDashboard, MdFastfood } from 'react-icons/md';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingId, setEditingId] = useState(null); // Add this state

    // Function to handle edit from FooditemList
    const handleEditItem = (id) => {
        setEditingId(id);
        setActiveTab('add-food');
    };

    // Function to reset after adding/editing
    const handleBackToList = () => {
        setEditingId(null);
        setActiveTab('manage-food');
    };

    // Function to cancel edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setActiveTab('manage-food');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <RestaurantHeader />
            
            <div className="container mx-auto px-4 pt-28 pb-12">
                {/* Header with edit mode indicator */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {editingId ? 'Edit Food Item' : 'Restaurant Dashboard'}
                    </h1>
                    <p className="text-gray-600">
                        {editingId ? 'Update your food item details' : 'Manage your menu, orders, and restaurant analytics'}
                    </p>
                </div>

                {/* Tabs - Hide when editing */}
                {!editingId && (
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${activeTab === 'dashboard'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                        >
                            <MdDashboard className="w-5 h-5" />
                            Dashboard
                        </button>

                        <button
                            onClick={() => { setEditingId(null); setActiveTab('add-food'); }}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${activeTab === 'add-food'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                        >
                            <FaPlus className="w-5 h-5" />
                            Add Food Item
                        </button>

                        <button
                            onClick={() => setActiveTab('manage-food')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${activeTab === 'manage-food'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                        >
                            <FaThLarge className="w-5 h-5" />
                            Manage Menu
                        </button>
                    </div>
                )}

                {/* Back button when editing */}
                {editingId && (
                    <div className="mb-6">
                        <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                        >
                            ← Back to Menu Items
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        {/* Show AddFooditem when in add-food tab OR when editing */}
                        {(activeTab === 'add-food' || editingId) ? (
                            <AddFooditem 
                                setActiveTab={setActiveTab}
                                editId={editingId}
                                onBack={handleBackToList}
                                onCancel={handleCancelEdit}
                            />
                        ) : activeTab === 'manage-food' ? (
                            <FooditemList 
                                onEditItem={handleEditItem} // Pass edit handler
                            />
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h3>
                                <p className="text-gray-600">Select a tab to manage your restaurant</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;