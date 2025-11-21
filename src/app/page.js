'use client'
import { useEffect, useRef, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import HomePageHeader from "./_components/HomePageHeader";
import Link from "next/link";
import RestaurantCarousel from "./_components/RestaurantCarousel";
import RestaurantFooter from "./_components/RestaurantFooter";
import { request } from "./lib/request";

export default function Home() {

  const [location, setLoaction] = useState([]);
  const [selectLoaction, setSelectLoaction] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [showLoaction, setShowLoaction] = useState(false);

  const foodScrollRef = useRef(null);
  const restaurantScrollRef = useRef(null);
  const restaurantSectionRef = useRef(null);

  useEffect(() => {
    loadLoction();
    loadRestaurants();
    getFoodsList()
  }, [])

  const buildQueryFromParams = (params) => {
    const query = new URLSearchParams();
    if (params?.location) query.append("location", params.location);
    if (params?.restaurant) query.append("restaurant", params.restaurant);
    const queryString = query.toString();
    return queryString ? `/api/customer?${queryString}` : "/api/customer";
  };

  const loadRestaurants = async (params = {}) => {
    try {
      const endpoint = buildQueryFromParams(params);
      const data = await request.get(endpoint);
      if (data?.success && Array.isArray(data?.result)) {
        setRestaurants(data.result);
      }
    } catch (error) {
      console.error("Failed to load restaurants", error);
    }
  };

  const loadLoction = async () => {
    try {
      const data = await request.get("/api/customer/locations");
      if (data?.success) {
        setLoaction(data.result);
      } else {
        alert("Somthing went wrong");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const getFoodsList = async () => {
    try {
      const data = await request.get("/api/restaurant/foods");
      if (data?.success && Array.isArray(data?.result)) {
        setFoodList(
          data.result.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) => t.name.toLowerCase() === item.name.toLowerCase()
              )
          )
        );
      }
    } catch (error) {
      console.error("Somthing went wrong", error);
    }
  };

  const handleListitem = (item) => {
    setSelectLoaction(item);
    setShowLoaction(false);
    loadRestaurants({ location: item })

    if (restaurants?.length > 0) {
      restaurantSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div onClick={() => setShowLoaction(false)} className="bg-white-100">
      <HomePageHeader />
      {/* Hero Section */}
      <div className="bg-orange-400 relative flex flex-col items-center justify-center pt-16 pb-8" >

        {/* lef side image */}
        <img className="absolute h-[450px] w-[250px] left-0 top-0" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Veggies_new.png" alt="left_img"></img>

        {/* Tegline */}
        <div className="flex items-center justify-between px-4 order-0">
          <div className="w-[60%] mx-auto text-center text-white text-5xl font-semibold leading-14 mb-4 pl-3">Order food &amp; groceries. Discover best restaurants. Yukky it!</div>
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
                  <RxCrossCircled className="w-4 h-4" onClick={() => {
                    loadRestaurants()
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} />
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
      <div className="flex items-center justify-center bg-orange-400 pr-2 pb-5">
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

      {/* Food List */}
      <div
        ref={restaurantSectionRef}
        className="w-[80%] mx-auto grid grid-cols-1 gap-4 p-4 m-16"
      >
        <main className="p-6">
          <RestaurantCarousel foodList={foodList} ref={foodScrollRef} />
        </main>
      </div>

      {/* Restaurant List */}
      <div
        ref={restaurantSectionRef}
        className="w-[80%] mx-auto grid grid-cols-1 gap-4 p-4 m-6"
      >
        <main className="p-6">
          <RestaurantCarousel restaurants={restaurants} ref={restaurantScrollRef} />
        </main>
      </div>

      {/* Footer */}
      <RestaurantFooter />
    </div>
  );
}
