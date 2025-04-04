import React, { useState } from 'react';

const RestaurantLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = () => {
        console.log(email, password)
        if (!email && !password) {
            setError(true);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-1/4bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <input
                    name="custom-email"
                    type="text"
                    placeholder="Enter email id"
                    className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="new-password"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {
                    error && !email && <p className='text-red-600 text-[12px] mt-[-7px]'>Please enter email</p>
                }
                <input
                    name="custom-password"
                    type="password"
                    placeholder="Enter password"
                    className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="new-password"
                    inputMode='none'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && !password && <p className='text-red-600 text-[12px] mt-[-7px]'>Please enter password</p>}
                <button className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default RestaurantLogin;
