'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const UserLogin = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        const newErrors = { ...errors };
        if (name === 'email') {
            if (!value) newErrors.email = 'Please enter email';
            else if (!/^\S+@\S+\.\S+$/.test(value)) newErrors.email = 'Invalid email format';
            else newErrors.email = '';
        }
        if (name === 'password') {
            if (!value) newErrors.password = 'Please enter password';
            else if (value.length < 6) newErrors.password = 'Password must be at least 6 characters';
            else newErrors.password = '';
        }

        setErrors(newErrors);
    };

    const validateBeforeSubmit = () => {
        const temp = { email: '', password: '' };
        let valid = true;

        if (!form.email) {
            temp.email = 'Please enter email';
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            temp.email = 'Invalid email format';
            valid = false;
        }

        if (!form.password) {
            temp.password = 'Please enter password';
            valid = false;
        } else if (form.password.length < 6) {
            temp.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(temp);
        return valid;
    };

    const handleLogin = async () => {
        if (!validateBeforeSubmit()) return;

        try {
            const res = await fetch('http://localhost:3000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, login: true }),
            });

            const data = await res.json();
            if (data.success) {
                const { result } = data;
                delete result.password;
                localStorage.setItem('user', JSON.stringify(result));
                router.push('/');
                alert('Login successful');
            } else {
                alert('failed to login. Please try agin with valid email and password');
            }
        } catch (err) {
            alert('Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50">
            <div className=" rounded-x w-full max-w-md p-8 space-y-4">
                <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">Login to Your Account</h2>

                <div>
                    <input
                        name="email"
                        type="text"
                        placeholder="Enter email id"
                        className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                            }`}
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                            }`}
                        value={form.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                </div>

                <button
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-200"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default UserLogin;
