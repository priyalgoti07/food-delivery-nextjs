import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const RestaurantSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    console.log(name, email)
    let response = await fetch('http://localhost:3000/api/restaurant',
      {
        method: "POST",
        body: JSON.stringify({ email, password, name, city, address, contact })
      })
    response = await response.json()
    if (response.success) {
      const { result } = response
      delete result.password
      console.log(result)
      localStorage.setItem("restaurantUser", JSON.stringify(result))
      router.push("/restaurant/dashboard")
      alert("User add Successfully")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-1/4bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <input
          type="text"
          placeholder="Enter email id"
          className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Confirm-password"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cpassword}
          onChange={(e) => setCPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter restaurant name"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter city"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter full address"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter contact"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <button className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          onClick={handleSubmit}
        >
          SignUp
        </button>
      </div>
    </div>
  )
}

export default RestaurantSignUp