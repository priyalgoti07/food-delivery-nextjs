'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const UserSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        let hasError = false;
        setError(false);
        setPasswordError(false);

        if (!email || !password || !cpassword || !name || !city || !address || !mobile) {
            setError(true);
            hasError = true;
        }
        if (password !== cpassword) {
            setPasswordError(true);
            hasError = true;
        }
        if (hasError) return;

        try {
            let response = await fetch('http://localhost:3000/api/user', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, city, address, mobile }),
            });

            response = await response.json();
            if (response.success) {
                const { result } = response;
                delete result.password;
                localStorage.setItem('user', JSON.stringify(result));
                router.push('/');
                alert('User added successfully!');
            } else {
                alert('Signup failed. Try again.');
            }
        } catch (error) {
            console.error('Error during signup', error);
        }
    };

    return (

        <div className="flex items-center justify-center bg-gray-50">
            <div className=" rounded-x w-full max-w-md p-8 space-y-4">
                <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">User Signup</h2>

                {[
                    { label: "Name", type: "text", state: name, setState: setName },
                    { label: "Email ID", type: "text", state: email, setState: setEmail },
                    { label: "Password", type: "password", state: password, setState: setPassword },
                    { label: "Confirm Password", type: "password", state: cpassword, setState: setCPassword },
                    { label: "City", type: "text", state: city, setState: setCity },
                    { label: "Address", type: "text", state: address, setState: setAddress },
                    { label: "Mobile", type: "text", state: mobile, setState: setMobile },
                ].map(({ label, type, state, setState }, idx) => (
                    <div key={idx}>
                        <input
                            type={type}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                        {error && !state && (
                            <p className="text-red-500 text-xs mt-1">Enter {label.toLowerCase()}</p>
                        )}
                    </div>
                ))}

                {passwordError && (
                    <p className="text-red-500 text-xs mt-[-6px]">Passwords do not match</p>
                )}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-200"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default UserSignup;
