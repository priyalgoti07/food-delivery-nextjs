import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/food-logo.png';

const RestaurantHeader = () => {
    return (
        <header className="w-full py-4 px-6 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Image src={logo} alt="Restaurant Logo" width={60} height={60} />
                    <h1 className="text-xl font-bold">Restaurant Portal</h1>
                </div>

                {/* Navigation Links */}
                <nav className='flex justify-around'>
                    <ul className="flex space-x-6">
                        <li>
                            <Link href="/" className="hover:text-gray-200 transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="hover:text-gray-200 transition">
                                Login/SignUp
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile" className="hover:text-gray-200 transition">
                                Profile
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default RestaurantHeader;
