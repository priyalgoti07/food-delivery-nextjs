import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../../public/food-logo.png";
import CommonDrawer from "./CommonDrawer";

const HomePageHeader = () => {
  const [popup, setPopup] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("user")) || null;
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPopup(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPartnerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full py-4 px-6 bg-orange-400 text-white z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <Image
              src={logo}
              alt="Yukky Logo"
              width={150}
              height={150}
              className="rounded-2xl"
            />
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-6 items-center">

              {/* Partner dropdown */}
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setPartnerOpen(!partnerOpen)}
                  className="font-bold leading-5 tracking-wider"
                >
                  Partner with us ▾
                </button>

                {partnerOpen && (
                  <ul className="absolute left-4 mt-3 w-60 bg-white text-black rounded-xl shadow-lg overflow-hidden z-50">
                    
                    <li>
                      <Link
                        href="/restaurant"
                        className="block px-5 py-3 hover:bg-gray-100 font-medium"
                        onClick={() => setPartnerOpen(false)}
                      >
                        🏪 Restaurant Partner
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/deliverydashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-5 py-3 hover:bg-gray-100 font-medium"
                        onClick={() => setPartnerOpen(false)}
                      >
                        🚚 Delivery Partner
                      </Link>
                    </li>

                  </ul>
                )}
              </li>

              {/* Auth */}
              {user ? (
                <>
                  <li className="font-bold tracking-wider">{user?.name}</li>
                  <li>
                    <button
                      onClick={() => setPopup(true)}
                      className="font-bold tracking-wider"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => setOpenDrawer(true)}
                    className="font-bold tracking-wider py-3 px-6 bg-black rounded-xl"
                  >
                    Sign in
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Logout Modal */}
        {popup && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-600">
                Are you sure you want to logout?
              </h2>
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
        )}
      </header>

      <CommonDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        onUserAuthenticated={(authUser) => setUser(authUser)}
      />
    </>
  );
};

export default HomePageHeader;
