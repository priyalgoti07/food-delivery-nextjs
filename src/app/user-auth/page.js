'use client'
import React, { useState } from 'react'
import CustomersHeader from '../_components/CustomersHeader'
import RestaurantFooter from '../_components/RestaurantFooter'
import UserSignup from '../_components/UserSignup'
import UserLogin from '../_components/UserLogin'
import Link from 'next/link'

const UserAuth = () => {
    const [login, setLogin] = useState(true);

    return (
        <div>
            <CustomersHeader />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">

                <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                    {login ? <UserLogin /> : <UserSignup />}
                </div>

                <Link
                    href={login ? "/signup" : "/login"}
                    className="mt-4 font-semibold rounded-l transition text-blue-400"
                    onClick={(e) => {
                        e.preventDefault();
                        setLogin(!login);
                    }}
                >
                    {login ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </Link>
            </div>
            {/* <UserSignup /> */}
            {/* <UserLogin /> */}
            <RestaurantFooter />
        </div>
    )
}

export default UserAuth