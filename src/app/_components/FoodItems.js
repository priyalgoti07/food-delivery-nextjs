import React from "react";

const FoodItems = ({ foodList }) => {
    // Split into two rows
    const row1 = foodList.filter((_, i) => i % 2 === 0);
    const row2 = foodList.filter((_, i) => i % 2 !== 0);

    return (
        <>
        {/* first row */}
            {row1.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-[144px]">
                    <button className="w-[144px] h-[144px] flex items-center justify-center">
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
                            <div className="mt-4 w-[144px] h-[144px] flex items-center justify-center">
                                <img
                                    src={row2[index].img_path}
                                    alt={row2[index].name}
                                    className="pointer-events-none select-none w-full h-full object-cover rounded-full"
                                />
                            </div>
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
