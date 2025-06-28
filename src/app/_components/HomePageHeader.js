import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../../public/food-logo.png";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const HomePageHeader = () => {
    const router = useRouter();
    const [popup, setPopup] = useState(false);
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const [user] = useState(userStorage ? userStorage : undefined);

    const handleLogout = () => {
        localStorage.removeItem("user")
        router.push("/user-auth")
        setPopup(false)
    }

    const ListItem = ({ href, title }) => {
        return (
            <li>
                <Link href={href} className="font-bold leading-5 tracking-wider">{title}</Link>
            </li>
        )
    }

    return (
        <header className="w-full py-4 px-6 z-11 bg-orange-400 text-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href={'/'} className="flex items-center space-x-2 cursor-pointer">
                    <Image src={logo} alt="Restaurant Logo" width={60} height={60} />
                </Link>

                {/* Navigation Links */}
                <nav className="flex justify-around">
                    <ul className="flex space-x-6">
                        <ListItem href='/deliverydashboard' title="Delivery Partner with us" />
                        {
                            user ?
                                <>
                                    <ListItem href='/myprofile' title={user?.name} />
                                    <li>
                                        <button onClick={() => setPopup(true)} className="font-bold leading-5 tracking-wider">Logout</button>
                                    </li>
                                </> :
                                <ListItem href='/user-auth' title='Login' />
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

export default HomePageHeader;
