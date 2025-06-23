import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../../public/food-logo.png";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const CustomersHeader = () => {
    const router = useRouter();
    const [popup, setPopup] = useState(false);
    const cartItems = useSelector((state) => state.cart.items);
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(userStorage ? userStorage : undefined);

    const handleLogout = () => {
        localStorage.removeItem("user")
        router.push("/user-auth")
        setPopup(false)
    }
    return (
        <header className="w-full py-4 px-6 fixed top-0 z-11 shadow-lg bg-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Image src={logo} alt="Restaurant Logo" width={60} height={60} />
                    <h1 className="text-xl font-bold">Restaurant Portal</h1>
                </div>

                {/* Navigation Links */}
                <nav className="flex justify-around">
                    <ul className="flex space-x-6">
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        {
                            user ? <>
                                <li>
                                    <Link href="/">{user?.name}</Link>
                                </li>
                                <li>
                                    <button onClick={() => setPopup(true)}>Logout</button>
                                </li>
                            </> :
                                <>
                                    <li>
                                        <Link href="/">Login</Link>
                                    </li>
                                    <li>
                                        <Link href="/user-auth">Signup</Link>
                                    </li>
                                </>
                        }
                        <li>
                            <Link href={`${cartItems?.length ? '/cart' : '#'}`}>Cart({cartItems?.length})</Link>
                        </li>
                        <li>
                            <Link href="/">Add Restaurant</Link>
                        </li>
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

export default CustomersHeader;
