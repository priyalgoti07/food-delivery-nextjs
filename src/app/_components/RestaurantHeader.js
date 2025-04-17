'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/food-logo.png';
import { usePathname, useRouter } from 'next/navigation';

const RestaurantHeader = () => {
    const [details, setDetails] = useState();
    const router = useRouter();
    const pathName = usePathname();
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        let storeData = localStorage.getItem("restaurantUser")
        if (!storeData && pathName === "/restaurant/dashboard") {
            router.push("/restaurant")
        } else if (storeData && pathName === "/restaurant") {
            router.push("/restaurant/dashboard")
        } else {
            setDetails(JSON.parse(storeData))
        }
    }, [])
    const handleLogout = () => {
        localStorage.removeItem("restaurantUser")
        router.push("/restaurant")
    }
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
                        {
                            details && details.name ?
                                <>
                                    <li>
                                        <button className='cursor-pointer' onClick={() => setPopup(true)}>Logout</button>
                                    </li>
                                    <li>
                                        <Link href="/profile" className="hover:text-gray-200 transition">
                                            Profile
                                        </Link>
                                    </li>
                                </>
                                :
                                <li>

                                    <Link href="/restaurant" className="hover:text-gray-200 transition">
                                        Login/SignUp
                                    </Link>
                                </li>
                        }

                    </ul>
                </nav>
            </div>
            {popup &&
                <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setPopup(false)}
                                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            }

        </header>
    );
};

export default RestaurantHeader;
