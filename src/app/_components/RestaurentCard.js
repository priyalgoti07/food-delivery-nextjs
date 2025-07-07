// components/RestaurentCard.jsx
import React from "react";
import { useRouter } from "next/navigation";

const RestaurentCard = ({ data }) => {
    const route = useRouter();

    return (
        <div
            className="min-w-[328px] min-h-[340px] bg-white rounded-xl h-fit shadow-md border border-[rgba(2,6,12,0.08)] no-underline block  cursor-pointer"
            onClick={() => route.push(`/explore/${data.name}?id=${data._id}`)}
        >
            <img
                src={data.img_path || "https://via.placeholder.com/300"}
                alt={data.name}
                className="w-full h-40 object-cover  rounded-t-xl  mb-3"
            />
            <div className="flex flex-col gap-2 p-4">
                <h2 className="text-lg font-semibold">{data.name}</h2>
                <p className="text-gray-600 text-sm truncate">{data.address}, {data.city}</p>
                <p className="text-gray-600 text-sm">📞 {data.contact}</p>
                <p className="text-gray-600 text-sm">{data.email}</p>
            </div>
        </div>
    );
};

export default RestaurentCard;
