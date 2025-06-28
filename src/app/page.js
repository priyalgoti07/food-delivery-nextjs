'use client'
import { useEffect, useState } from "react";
import RestaurantFooter from "./_components/RestaurantFooter";
import { SlLocationPin } from "react-icons/sl";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { useRouter } from "next/navigation";
import HomePageHeader from "./_components/HomePageHeader";
import Link from "next/link";

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
    <div onClick={() => setShowLoaction(false)}>
      <HomePageHeader />
      <div className="bg-orange-400 relative flex flex-col items-center justify-center pt-16 pb-8" >

        {/* lef side image */}
        <img className="absolute h-[450px] w-[250px] left-0 top-0" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Veggies_new.png" alt="left_img"></img>

        {/* Tegline */}
        <div className="flex items-center justify-between px-4 order-0">
          <div className="w-[60%] mx-auto text-center text-white text-5xl font-semibold leading-14 mb-4 pl-3">Order food &amp; groceries. Discover best restaurants. Yumly it!</div>
        </div>

        {/* Search bar */}
        <div className="flex flex-row gap-2 m-auto p-3.5" onClick={(event) => event.stopPropagation()}>
          <div className="relative ">
            <div className=" bg-white border-amber-50 rounded-2xl flex justify-around items-center py-4 pl-4 pr-8 w-[350px] gap-2">
              <div>
                <SlLocationPin className="text-orange-500 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Select Place"
                className=" text-black border-none focus:outline-none focus:ring-0  flex-1"
                value={selectLoaction}
                onClick={() => setShowLoaction(true)}
                readOnly
              />
              {/* Clear icon (×) shown only if a value is selected */}
              {selectLoaction.length > 0 && (
                <div
                  className="cursor-pointer text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={() => setSelectLoaction([])}
                >
                  <RxCrossCircled className="w-4 h-4" onClick={() => loadRestaurants()} />
                </div>
              )}
              <div className="cursor-pointer font-bold" onClick={() => setShowLoaction(!showLoaction)}>
                {showLoaction ?
                  <IoIosArrowUp className="text-lg font-bold" />
                  :
                  <IoIosArrowDown className="text-lg font-bold" />
                }
              </div>
            </div>
            {/* Dropdown */}
            <ul className="absolute left-0 right-0 mt-1 bg-white border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto z-10">
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
          </div>

          <div className="bg-white border-amber-50 rounded-2xl py-2 pl-4 pr-8 w-[450px] flex justify-center items-center">
            <input
              type="text"
              placeholder="Search for restaurants"
              className="p-2 md text-black focus:outline-none focus:ring-0  border-[#ccc] flex-1"
              onChange={(event) => loadRestaurants({ restaurant: event.target.value })}
            />
            {<AiOutlineSearch />}
          </div>
        </div>

        {/* right side iamge */}
        <img className="absolute h-[450px] w-[250px] right-0 top-0" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Sushi_replace.png" alt="right_img"></img>
      </div >

      {/* card selection */}
      <div className="flex  items-center justify-center bg-orange-400 pr-2 pb-5">
        <div className="flex items-center justify-center w-[100%] max-w-[80%] min-h-[320px]">
          <div className="w-[100%] h-[100%]">
            <Link href='#'>
              <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/ec86a309-9b06-48e2-9adc-35753f06bc0a_Food3BU.png" alt="Food"></img>
            </Link>
          </div>
          <div className="w-[100%] h-[100%]">
            <Link href='#'>
              <img className="sc-bXCLTC gsiCGh" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b5c57bbf-df54-4dad-95d1-62e3a7a8424d_IM3BU.png" alt="IM">
              </img>
            </Link>
          </div>
          <div className="w-[100%] h-[100%]">
            <Link href='#'>
              <img className="sc-bXCLTC gsiCGh" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b6d9b7ab-91c7-4f72-9bf2-fcd4ceec3537_DO3BU.png" alt="DO"></img>
            </Link>
          </div>
        </div>
      </div>
      {/* Restaurant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mb-6">
        {restaurants?.map((item) => (
          <div
            key={item._id}
            className="bg-orange-400 shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
            onClick={() => route.push(`explore/${item.name}?id=${item._id}`)}
          >
            <div className="flex justify-between mb-2">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-700 font-medium">📞 {item.contact}</p>
            </div>

            <div className="text-gray-700 flex flex-wrap gap-x-6">
              <p><span className="font-medium">Address:</span> {item.address}</p>
              <p><span className="font-medium">City:</span> {item.city}</p>
              <p><span className="font-medium">Email:</span> {item.email}</p>
            </div>

          </div>
        ))}
      </div>

      {/* <RestaurantFooter /> */}

    </div>
  );
}
