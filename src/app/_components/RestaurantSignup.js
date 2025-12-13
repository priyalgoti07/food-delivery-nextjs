// RestaurantSignUp.jsx - Updated Design
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { request } from '../lib/request';
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaCity, FaKey, FaEnvelope } from 'react-icons/fa';

const RestaurantSignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    cpassword: '',
    name: '',
    city: '',
    address: '',
    contact: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Check all required fields
    Object.keys(form).forEach(key => {
      if (!form[key] && key !== 'cpassword') {
        newErrors[key] = `Please enter ${key === 'cpassword' ? 'confirm password' : key}`;
        isValid = false;
      }
    });

    // Email validation
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Password match validation
    if (form.password !== form.cpassword) {
      newErrors.cpassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { cpassword, ...rest } = form;
      const data = await request.post('/api/restaurant', rest);
      if (data.success) {
        const { result } = data
        delete result.password
        localStorage.setItem("restaurantUser", JSON.stringify(result))
        router.push("/restaurant/dashboard")
      } else {
        alert("Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Error during signup", error)
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const inputFields = [
    {
      name: 'name',
      placeholder: 'Restaurant Name',
      icon: FaBuilding,
      type: 'text'
    },
    {
      name: 'email',
      placeholder: 'Email Address',
      icon: FaEnvelope,
      type: 'text'
    },
    {
      name: 'password',
      placeholder: 'Password (min 6 characters)',
      icon: FaKey,
      type: 'password'
    },
    {
      name: 'cpassword',
      placeholder: 'Confirm Password',
      icon: FaKey,
      type: 'password'
    },
    {
      name: 'city',
      placeholder: 'City',
      icon: FaCity,
      type: 'text'
    },
    {
      name: 'address',
      placeholder: 'Full Address',
      icon: FaMapMarkerAlt,
      type: 'text'
    },
    {
      name: 'contact',
      placeholder: 'Contact Number',
      icon: FaPhone,
      type: 'text'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputFields.map((field) => (
          <div key={field.name} className={field.name === 'address' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {field.name.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <field.icon />
              </div>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors[field.name] 
                  ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                  : 'border-gray-300 focus:ring-orange-200 focus:border-orange-300'
                }`}
                value={form[field.name]}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                autoComplete={field.type === 'password' ? 'new-password' : 'off'}
              />
            </div>
            {errors[field.name] && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mt-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-700">
            By signing up, you agree to our Terms of Service and Privacy Policy. We'll send you account-related emails occasionally.
          </p>
        </div>
      </div>

      <button
        type='submit'
        className="w-full py-3 mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </div>
        ) : (
          'Create Restaurant Account'
        )}
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => window.location.reload()} // This will trigger the parent component's toggle
            className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RestaurantSignUp;