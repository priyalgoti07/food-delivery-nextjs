'use client'
import { useState } from "react";
import RestaurantLogin from "../_components/RestaurantLogin";
import RestaurantSignUp from "../_components/RestaurantSignup";
import Link from "next/link";
import RestaurantHeader from "../_components/RestaurantHeader";
import RestaurantFooter from "../_components/RestaurantFooter";

const Restaurant = () => {
    const [login, setLogin] = useState(true);

    return (
        <div>
            <RestaurantHeader />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Restaurant {login ? "Login" : "Signup"} Page
                </h1>

                <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                    {login ? <RestaurantLogin /> : <RestaurantSignUp />}
                </div>

                <Link
                    href={login ? "/signup" : "/login"}
                    className="mt-4 font-semibold rounded-l transition text-blue-400"
                    onClick={(e) => {
                        e.preventDefault();
                        setLogin(!login);
                    }}
                >
                    {login ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </Link>
            </div>
            <RestaurantFooter />
        </div>
    );
};

export default Restaurant;
