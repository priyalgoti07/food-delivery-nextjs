import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { request } from '../lib/request';

const RestaurantLogin = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // update form state
        setForm((prev) => ({ ...prev, [name]: value }));

        // inline validation
        let newErrors = { ...errors };
        if (name === 'email') {
            if (!value) newErrors.email = "Please enter email";
            else if (!/^\S+@\S+\.\S+$/.test(value)) newErrors.email = "Invalid email format";
            else newErrors.email = '';
        }
        if (name === 'password') {
            if (!value) newErrors.password = "Please enter password";
            else if (value.length < 6) newErrors.password = "Password must be at least 6 characters";
            else newErrors.password = '';
        }

        setErrors(newErrors);
    };

    const validateBeforeSubmit = () => {
        const temp = { email: '', password: '' };
        let valid = true;

        if (!form.email) {
            temp.email = "Please enter email";
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            temp.email = "Invalid email format";
            valid = false;
        }

        if (!form.password) {
            temp.password = "Please enter password";
            valid = false;
        } else if (form.password.length < 6) {
            temp.password = "Password must be at least 6 characters";
            valid = false;
        }

        setErrors(temp);
        return valid;
    };

    const handleLogin = async () => {
        if (!validateBeforeSubmit()) return;

        try {
            const data = await request.post('/api/restaurant', {
                ...form,
                login: true,
            });
            if (data.success) {
                const { result } = data;
                delete result.password;
                localStorage.setItem("restaurantUser", JSON.stringify(result))
                router.push("/restaurant/dashboard")
                alert('Login successful');
            } else {
                alert('Invalid credentials');
            }
        } catch (err) {
            alert('Something went wrong');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-1/4bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <input
                    name="email"
                    type="text"
                    placeholder="Enter email id"
                    className={`w-full p-2 mb-1 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    autoComplete="off"
                    value={form.email}
                    onChange={handleChange}
                />
                {errors.email && <p className="text-red-600 text-[12px] mb-2">{errors.email}</p>}

                <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    className={`w-full p-2 mb-1 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    autoComplete="off"
                    value={form.password}
                    onChange={handleChange}
                />
                {errors.password && <p className="text-red-600 text-[12px] mb-4">{errors.password}</p>}

                <button
                    className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div >
    );
};

export default RestaurantLogin;
