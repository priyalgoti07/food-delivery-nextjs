import Image from "next/image";
import CustomersHeader from "./_components/CustomersHeader";
import RestaurantFooter from "./_components/RestaurantFooter";

export default function Home() {
  return (
    <>
      <CustomersHeader />
      <div className="bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR65vKRtcRWEFPwjrJX0fsVWrKT42k58EYdyg&s')] bg-cover bg-center min-h-[300px]">
        <div className="text-black text-center pt-2">
          <h1 className="text-4xl font-bold mb-4">Food Delivery App</h1>
          <div className=" bg-[#ffff] border-1-[#ccc] rounded-md w-[70%] m-auto text-left p-1.5">
            <input
              type="text"
              placeholder="Select Place"
              className="p-2  text-black border-none focus:outline-none focus:ring-0 pl-3.5"
            />
            <input
              type="text"
              placeholder="Enter food or restaurant"
              className="p-2 md text-black focus:outline-none focus:ring-0 border-l border-[#ccc] flex-1 pl-3.5"
            />
          </div>
        </div>
      </div>
      <RestaurantFooter />

    </>
  );
}
