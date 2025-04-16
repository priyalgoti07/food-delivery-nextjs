import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const FooditemList = () => {
    const [fooditems, setFooditems] = useState([]);
    const router = useRouter()
    useEffect(() => {
        loadFooditems()
    }, [])

    const loadFooditems = async () => {
        const userId = JSON.parse(localStorage.getItem("restaurantUser"));
        let resto_id = userId._id
        try {
            let response = await fetch(`http://localhost:3000/api/restaurant/foods/${resto_id}`)
            response = await response.json()
            if (response.result) {
                setFooditems(response.result)
            } else {
                alert("food item list not loading")
            }
        } catch (error) {
            console.error("Error", error)
        }
    }

    const deletItem = async (id) => {
        try {
            let response = await fetch(`http://localhost:3000/api/restaurant/foods/${id}`, { method: "delete" })
            response = await response.json();
            if (response.success) {
                alert("item is Delete")
                loadFooditems()
            }
        } catch (error) {
            console.error("Error", error)
        }
    }

    const updateItem = (id) => {
        // setEditItem(id);
        // setAddItem(true);
        router.push(`dashboard/${id}`)
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Food Item List</h1>
            <table className="w-full table-auto border border-gray-300 border-collapse text-left">
                <thead className="bg-gray-100">
                    <tr>
                        {['Sr.NO', 'Name', 'Price', 'Description', 'Image', 'Action'].map((heading, index) => (
                            <th key={index} className="p-2 border">
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        fooditems.length > 0 && fooditems?.map((item, key) => {
                            return (
                                <tr className="divide-x divide-gray-300" key={key}>
                                    <td className="p-2 border">{key}</td>
                                    <td className="p-2 border">{item.name}</td>
                                    <td className="p-2 border">{item.price}</td>
                                    <td className="p-2 border">{item.descrition}</td>
                                    <td className="p-2 border"><img src={item?.img_path || null} className='w-[80px]' alt={item.name} /></td>
                                    <td className="p-2 border space-x-2">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => updateItem(item._id)}>Edit</button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => deletItem(item)}>Delete</button>
                                    </td>
                                </tr>

                            )
                        })
                    }

                </tbody>
            </table>
        </div>
    );
};

export default FooditemList;
