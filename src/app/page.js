'use client'
import { useEffect, useState } from "react";
import CustomersHeader from "./_components/CustomersHeader";
import RestaurantFooter from "./_components/RestaurantFooter";
import { useRouter } from "next/navigation";

export default function Home() {

  const [location, setLoaction] = useState([]);
  const [selectLoaction, setSelectLoaction] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showLoaction, setShowLoaction] = useState(false);
  const route = useRouter();

  useEffect(() => {
    loadLoction();
    loadRestaurants();
  }, [])

  const loadRestaurants = async (parmas = {}) => {

    try {
      let url = 'http://localhost:3000/api/customer';

      if (parmas?.location) {
        url = `${url}?location=${parmas.location}`
      } else if (parmas?.restaurant) {
        url = `${url}?restaurant=${parmas.restaurant}`
      }
      let repRestaurant = await fetch(url);

      if (!repRestaurant.ok) {
        throw new Error(`HTTP error! status:${repRestaurant?.status}`)
      }
      let data = await repRestaurant.json();
      if (data?.success) {
        setRestaurants(data?.result)
      }
    } catch (error) {
      console.error("Somthing went wrong")
    }

  }

  const loadLoction = async () => {
    try {
      let response = await fetch("http://localhost:3000/api/customer/locations");

      // response = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status:${response?.status}`)
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (data.success) {
        setLoaction(data.result)
      } else {
        alert("Somthing went wrong")
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  const handleListitem = (item) => {
    setSelectLoaction(item);
    setShowLoaction(false);
    loadRestaurants({ location: item })
  }

  return (
    <>
      <CustomersHeader />
      <div className="relative bg-[url('https://media.istockphoto.com/id/856382602/photo/top-view-of-rainbow-vegetables-autumn-harvest.jpg?s=2048x2048&w=is&k=20&c=S4YDmcJeaLvsHOczkk1k8WPUPIudjsJB75x3vDlF5J8=')] bg-cover bg-center min-h-[300px]">
        {/* Black shadow overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-black text-center pt-2" >
          <h1 className="text-4xl font-bold mb-4">Food Delivery App</h1>
          <div className=" bg-[#ffff] border-1-[#ccc] rounded-md w-[70%] m-auto text-left p-1.5">
            <input
              type="text"
              placeholder="Select Place"
              className="p-2  text-black border-none focus:outline-none focus:ring-0"
              value={selectLoaction}
              onClick={() => setShowLoaction(true)}
              readOnly
            />
            {/* Dropdown */}
            <ul className="absolute z-10 mt-1 w-[12%] bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto" >
              {showLoaction && location.map((item, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) => handleListitem(item)} // Replace with actual logic
                >
                  {item}
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Enter food or restaurant"
              className="p-2 md text-black focus:outline-none focus:ring-0 border-l border-[#ccc] flex-1 pl-3.5"
              onChange={(event) => loadRestaurants({ restaurant: event.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mb-6">
        {restaurants?.map((item) => (
          <div
            key={item._id}
            className="bg-orange-400 shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
            onClick={() => route.push(`explore/${item.name}?id=${item._id}`)}
          >
            {/* Line 1: Name and Contact */}
            <div className="flex justify-between mb-2">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-700 font-medium">📞 {item.contact}</p>
            </div>

            {/* Line 2: Address, City, Email */}
            <div className="text-gray-700 flex flex-wrap gap-x-6">
              <p><span className="font-medium">Address:</span> {item.address}</p>
              <p><span className="font-medium">City:</span> {item.city}</p>
              <p><span className="font-medium">Email:</span> {item.email}</p>
            </div>

          </div>
        ))}
      </div>

      <RestaurantFooter />

    </>
  );
}
