'use client';
import React, { useState } from 'react';
import CustomersHeader from '../_components/CustomersHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DeliveryPartner = () => {
    const router = useRouter();
    const [login, setLogin] = useState(true);
    const [form, setForm] = useState({ loginMobile: '', loginPassword: '' });
    const [errors, setErrors] = useState({ loginMobile: '', loginPassword: '' });

    // Signup states
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        let newErrors = { ...errors };

        if (name === 'loginMobile') {
            if (!value) newErrors.loginMobile = 'Please enter mobile number';
            else if (!/^[6-9]\d{9}$/.test(value)) newErrors.loginMobile = 'Invalid mobile number';
            else newErrors.loginMobile = '';
        }

        if (name === 'loginPassword') {
            if (!value) newErrors.loginPassword = 'Please enter password';
            else if (value.length < 6) newErrors.loginPassword = 'Password must be at least 6 characters';
            else newErrors.loginPassword = '';
        }

        setErrors(newErrors);
    };

    const validateBeforeSubmit = () => {
        const temp = { loginMobile: '', loginPassword: '' };
        let valid = true;

        if (!form.loginMobile) {
            temp.loginMobile = 'Please enter mobile number';
            valid = false;
        } else if (!/^[6-9]\d{9}$/.test(form.loginMobile)) {
            temp.loginMobile = 'Invalid mobile number';
            valid = false;
        }

        if (!form.loginPassword) {
            temp.loginPassword = 'Please enter password';
            valid = false;
        } else if (form.loginPassword.length < 6) {
            temp.loginPassword = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(temp);
        return valid;
    };

    const handleLogin = async () => {
        if (!validateBeforeSubmit()) return;

        try {
            const res = await fetch('http://localhost:3000/api/deliverypartners/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, login: true }),
            });

            const data = await res.json();
            console.log("data", data)
            if (data.success) {
                const { result } = data;
                delete result.password;
                localStorage.setItem('delivertPartner', JSON.stringify(result));
                router.push('/');
                alert('Login successful');
            } else {
                alert('failed to login. Please try agin with valid email and password');
            }
        } catch (err) {
            console.log("err", err);
            alert('Something went wrong');
        }

    };

    const handleSubmit = async () => {
        let hasError = false;

        setError(false);
        setPasswordError(false);

        if (!password || !cpassword || !name || !city || !address || !mobile) {
            setError(true);
            hasError = true;
        }

        if (password !== cpassword) {
            setPasswordError(true);
            hasError = true;
        }

        if (hasError) return;

        try {
            let response = await fetch('http://localhost:3000/api/deliverypartners/signup', {
                method: 'POST',
                body: JSON.stringify({ name, password, city, address, mobile }),
            });

            response = await response.json();
            if (response.success) {
                const { result } = response;
                delete result.password;
                localStorage.setItem('delivertPartner', JSON.stringify(result));
                // router.push('/');
                alert('User added successfully!');
            } else {
                alert('Signup failed. Try again.');
            }
        } catch (error) {
            console.error('Error during signup', error);
        }

    };

    return (
        <div>
            <CustomersHeader />

            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Delivery Partner {login ? 'Login' : 'Signup'} Page
                </h1>

                <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                    {login ? (
                        <div className="space-y-4">
                            <input
                                name="loginMobile"
                                type="text"
                                placeholder="Enter Mobile Number"
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.loginMobile
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'focus:ring-blue-500'
                                    }`}
                                value={form.loginMobile}
                                onChange={handleChange}
                            />
                            {errors.loginMobile && (
                                <p className="text-red-600 text-sm">{errors.loginMobile}</p>
                            )}

                            <input
                                name="loginPassword"
                                type="password"
                                placeholder="Enter Password"
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.loginPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'focus:ring-blue-500'
                                    }`}
                                value={form.loginPassword}
                                onChange={handleChange}
                            />
                            {errors.loginPassword && (
                                <p className="text-red-600 text-sm">{errors.loginPassword}</p>
                            )}

                            <button
                                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">

                            <input
                                type="text"
                                placeholder="Enter Full Name"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {error && !name && (
                                <p className="text-red-600 text-sm">Enter name</p>
                            )}
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && !password && (
                                <p className="text-red-600 text-sm">Enter password</p>
                            )}

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={cpassword}
                                onChange={(e) => setCPassword(e.target.value)}
                            />
                            {error && !cpassword && (
                                <p className="text-red-600 text-sm">Enter confirm password</p>
                            )}
                            {passwordError && (
                                <p className="text-red-600 text-sm">
                                    Password and Confirm password do not match
                                </p>
                            )}

                            <input
                                type="text"
                                placeholder="Enter City"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                            {error && !city && (
                                <p className="text-red-600 text-sm">Enter city</p>
                            )}

                            <input
                                type="text"
                                placeholder="Enter Full Address"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            {error && !address && (
                                <p className="text-red-600 text-sm">Enter address</p>
                            )}

                            <input
                                type="text"
                                placeholder="Enter Mobile Number"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                            {error && !mobile && (
                                <p className="text-red-600 text-sm">Enter mobile</p>
                            )}

                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={handleSubmit}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>

                <Link
                    href="#"
                    className="mt-4 font-semibold text-blue-500 hover:underline"
                    onClick={(e) => {
                        e.preventDefault();
                        setLogin(!login);
                    }}
                >
                    {login ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
                </Link>
            </div>
        </div>
    );
};

export default DeliveryPartner;
