import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../../public/food-logo.png";
import CommonDrawer from "./CommonDrawer";


const HomePageHeader = () => {
    const [popup, setPopup] = useState(false);
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("user")) || null;
        }
        return null;
    });
    const [openDrawer, setOpenDrawer] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("user")
        setUser(null)
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
        <>
            <header className="w-full py-4 px-6 z-11 bg-orange-400 text-white">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link href={'/'} className="flex items-center space-x-2 cursor-pointer">
                        <Image src={logo} alt="Restaurant Logo" width={150} height={150} className="rounded-2xl" />
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex justify-around">
                        <ul className="flex space-x-6 items-center">
                            <ListItem href='/deliverydashboard' title="Delivery Partner with us" />
                            {
                                user ?
                                    <>
                                        <ListItem href='/myprofile' title={user?.name} />
                                        <li>
                                            <button onClick={() => setPopup(true)} className="font-bold leading-5 tracking-wider">Logout</button>
                                        </li>
                                    </> :
                                    <li>
                                        <button
                                            onClick={() => setOpenDrawer(true)}
                                            className="font-bold leading-5 tracking-wider  py-3 px-6 bg-black rounded-xl"
                                        >
                                            Sign in
                                        </button>
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
            {<CommonDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}
                onUserAuthenticated={(authUser) => setUser(authUser)}
            />}
        </>
    );
};

export default HomePageHeader;