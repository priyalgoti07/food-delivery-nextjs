import React from "react";
import { useRouter } from "next/navigation";

const FoodItems = ({ foodList }) => {
    const route = useRouter();

    // Keep the shortest matching name (e.g. prefer "Dosa" over "Masala Dosa")
    const seen = new Map();

    const uniqueFoodList = foodList.filter((item) => {
        const name = item.name.toLowerCase();
        for (const key of seen.keys()) {
            if (name.includes(key) || key.includes(name)) {
                return false;
            }
        }
        seen.set(name, true);
        return true;
    });

    // Split into two rows
    const row1 = uniqueFoodList.filter((_, i) => i % 2 === 0);
    const row2 = uniqueFoodList.filter((_, i) => i % 2 !== 0);

    return (
        <>
            {/* first row */}
            {row1.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-[144px]">

                    <button onClick={() => route.push(`restaurantlist/${encodeURIComponent(item.name)}?id=${item._id}`)} className="w-[144px] h-[144px] flex items-center justify-center" >
                        <img
                            src={item.img_path}
                            alt={item.name}
                            className="pointer-events-none select-none w-full h-full object-cover rounded-full"
                        />
                    </button>
                    <p className="text-center mt-2 font-medium">{item.name}</p>
                    {/* second row */}

                    {row2[index] && (
                        <>
                            <button onClick={() => route.push(`/restaurantlist/${encodeURIComponent(row2[index].name)}?id=${row2[index]._id}`)} className="mt-4 w-[144px] h-[144px] flex items-center justify-center">
                                <img
                                    src={row2[index].img_path}
                                    alt={row2[index].name}
                                    className="pointer-events-none select-none w-full h-full object-cover rounded-full"

                                />
                            </button>
                            <p className="text-center mt-2 font-medium">
                                {row2[index].name}
                            </p>
                        </>
                    )}
                </div>
            ))}
        </>
    );
};

export default FoodItems;
