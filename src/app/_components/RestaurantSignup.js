import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { request } from '../lib/request';

const RestaurantSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const router = useRouter();
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false)

  const handleSubmit = async () => {
    let hasError = false;

    // Reset all errors
    setError(false);
    setPasswordError(false);

    // Validation for empty fields
    if (!email || !password || !cpassword || !name || !city || !address || !contact) {
      setError(true);
      hasError = true;
    }

    // Password mismatch validation
    if (password !== cpassword) {
      setPasswordError(true);
      hasError = true;
    }

    // If any error exists, stop here
    if (hasError) return;
    try {
      const data = await request.post('/api/restaurant', {
        email,
        password,
        name,
        city,
        address,
        contact,
      });
      if (data.success) {
        const { result } = data
        delete result.password
        localStorage.setItem("restaurantUser", JSON.stringify(result))
        router.push("/restaurant/dashboard")
        alert("User add Successfully")
      } else {
        alert("Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Error during signup", error)
    }

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-1/4bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <input
          type="text"
          name="email"
          placeholder="Enter email id"
          className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && !email && <p className='text-red-600 mt-[-7px] text-[12px]'>Enter email id</p>}
        <input
          type="password"
          name='password-text'
          placeholder="Enter password"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {error && !password && <p className='text-red-600 mt-[-7px] text-[12px]'>Enter password</p>}

        <input
          type="password"
          placeholder="Enter Confirm-password"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cpassword}
          onChange={(e) => setCPassword(e.target.value)}
        />
        {error && !cpassword && <p className='text-red-600 mt-[-7px] text-[12px]'>Enter confirm password</p>}

        {passwordError &&
          <p className='text-red-600 mt-[-7px] text-[12px]'>Password and Confirm password not match</p>
        }
        <input
          type="text"
          placeholder="Enter restaurant name"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && !name && <p className='text-red-600 mt-[-7px] text-[12px]'>Enter email name</p>}

        <input
          type="text"
          placeholder="Enter city"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {error && !city && <p className='text-red-600 mt-[-7px] text-[12px]'>Enter city</p>}

        <input
          type="text"
          placeholder="Enter full address"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {error && !address && <p className='text-red-600 mt-[-7px] text-[12px]'>Enter address</p>}

        <input
          type="text"
          placeholder="Enter contact"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        {error && !contact && <p className='text-red-600 mt-[-7px] text-[12px]'>Enter contact</p>}

        <button type='submit' className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          onClick={handleSubmit}
        >
          SignUp
        </button>
      </div>
    </div>
  )
}

export default RestaurantSignUp