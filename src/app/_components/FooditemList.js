import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { request } from '../lib/request';

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
            const data = await request.get(`/api/restaurant/foods/${resto_id}`);
            if (data.result) {
                setFooditems(data.result);
            } else {
                alert("food item list not loading");
            }
        } catch (error) {
            console.error("Error", error);
        }
    }

    const deletItem = async (id) => {
        try {
            const data = await request.delete(`/api/restaurant/foods/${id}`);
            if (data.success) {
                alert("item is Delete")
                loadFooditems()
            }
        } catch (error) {
            console.error("Error", error)
        }
    }

    const updateItem = (id) => {
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
                                    <td className="p-2 border">{key +1}</td>
                                    <td className="p-2 border">{item.name}</td>
                                    <td className="p-2 border">{item.price}</td>
                                    <td className="p-2 border">{item.description}</td>
                                    <td className="p-2 border"><img src={item?.img_path || null} className='w-[80px]' alt={item.name} /></td>
                                    <td className="p-2 border space-x-2">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => updateItem(item._id)}>Edit</button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => deletItem(item._id)}>Delete</button>
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
