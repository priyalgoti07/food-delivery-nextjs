'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { request } from '../lib/request';

const initialForm = { name: '', email: '', phone: '' };
const initialErrors = { name: '', email: '', phone: '' };

const UserSignup = () => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState(initialErrors);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (field, value) => {
        setErrors((prev) => ({ ...prev, [field]: '' }));
        setForm((prev) => {
            if (field === 'phone') {
                const cleaned = value.replace(/\D/g, '').slice(0, 10);
                return { ...prev, phone: cleaned };
            }
            return { ...prev, [field]: value };
        });
    };

    const validate = () => {
        const nextErrors = { ...initialErrors };
        let isValid = true;

        if (!form.name.trim()) {
            nextErrors.name = 'Name is required';
            isValid = false;
        } else if (form.name.trim().length < 2) {
            nextErrors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        if (!form.email.trim()) {
            nextErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
            nextErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!form.phone) {
            nextErrors.phone = 'Phone is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(form.phone)) {
            nextErrors.phone = 'Phone must be exactly 10 digits';
            isValid = false;
        }

        setErrors(nextErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);

        try {
            const data = await request.post('/api/user', {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone,
            });
            if (data.success) {
                const { result } = data;
                localStorage.setItem('user', JSON.stringify(result));
                router.push('/');
                alert('Account created successfully!');
                setForm(initialForm);
            } else {
                alert(data.message || 'Signup failed. Try again.');
            }
        } catch (error) {
            console.error('Error during signup', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50">
            <div className="rounded-x w-full max-w-md p-8 space-y-4">
                <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">User Signup</h2>

                <div>
                    <input
                        type="text"
                        placeholder="Enter name"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Enter phone"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Creating...' : 'Sign Up'}
                </button>
            </div>
        </div>
    );
};

export default UserSignup;
