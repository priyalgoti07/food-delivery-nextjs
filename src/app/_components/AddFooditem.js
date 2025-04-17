import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AddFooditem = ({ setAddItem, editId }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [path, setPath] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(false);
    const route = useRouter()
    useEffect(() => {
        const handleUpdateRecord = async () => {
            try {
                let response = await fetch(`http://localhost:3000/api/restaurant/foods/edit/${editId}`)
                response = await response?.json()
                if (response.success) {
                    setName(response?.result?.name);
                    setPrice(response?.result?.price);
                    setPath(response?.result?.img_path);
                    setDescription(response?.result?.description);
                }
            } catch (error) {
                console.error("Error", error)
            }
        }
        if (editId) handleUpdateRecord()
    }, [])



    const handladdFood = async () => {
        let hasError = false;
        setError(false);
        if (!name || !price || !path || !description) {
            setError(true);
            hasError = true;
        }
        //If any error, stop here
        if (hasError) return;
        if (editId) {
            try {
                let response = await fetch(`http://localhost:3000/api/restaurant/foods/edit/${editId}`, { method: "PUT", body: JSON.stringify({ name, price, path, description }) })
                response = await response.json();
                if (response.success) {
                    alert("food item edit");
                    route.replace("/restaurant/dashboard")
                } else {
                    alert("Data is not updated please try again")
                }
            } catch (error) {
                console.error("Error", error)
            }
        } else {
            const restaurantUser = JSON.parse(localStorage?.getItem("restaurantUser"))
            let response = await fetch('http://localhost:3000/api/restaurant/foods', {
                method: "POST",
                body: JSON.stringify({
                    name,
                    img_path: path,
                    price,
                    description,
                    ...(restaurantUser?._id && { resto_id: restaurantUser._id })
                })
            })
            response = await response.json()
            if (response.success) {
                alert("food item add")
                setAddItem(false);
            } else {
                alert("food item not add")
            }
        }


    }
    return (
        <div className="flex flex-col items-center justify-center min-h-1/4bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <input
                    type="text"
                    name="name"
                    placeholder="Enter food name"
                    className={`w-full p-2 mb-1 border rounded-lg focus:outline-none focus:ring-2 ${error && !name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {error && !name && <p className="text-red-600 text-[12px] mb-2">enter food name</p>}
                <input
                    type="text"
                    name="price"
                    placeholder="Enter food price"
                    className={`w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 ${error && !price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {error && !price && <p className='text-red-600 text-[12px] mb-2'>enter price</p>}
                <input
                    type="text"
                    name="path"
                    placeholder="Enter image path"
                    className={`w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 ${error && !path ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                />
                {error && !path && <p className='text-red-600 text-[12px] mb-2'>enter imag path</p>}
                <input
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    className={`w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 ${error && !description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {error && !description && <p className='text-red-500 text-[12px] mb-2'>enter description</p>}
                <button type='submit' className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                    onClick={handladdFood}
                >{`${editId ? "Edit" : "Add"}  Foo item`}</button>
            </div>
        </div>

    )
}

export default AddFooditem