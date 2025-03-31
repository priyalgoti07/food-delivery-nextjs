import React from 'react';

const RestaurantLogin = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-1/4bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <input 
                    type="text" 
                    placeholder="Enter email id" 
                    className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <input 
                    type="password" 
                    placeholder="Enter password" 
                    className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                    Login
                </button>
            </div>
        </div>
    );
}

export default RestaurantLogin;
