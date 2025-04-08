import React, { useState } from 'react'

const AddFooditem = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [path, setPath] = useState('');
    const [description, setDescription] = useState('');
    const handladdFood = () => {
        console.log(name, path, price, description)
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-1/4bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <input
                    type="text"
                    name="name"
                    placeholder="Enter food name"
                    className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Enter food price"
                    className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    type="text"
                    name="path"
                    placeholder="Enter image path"
                    className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type='submit' className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                    onClick={handladdFood}
                >Add Food item</button>
            </div>
        </div>

    )
}

export default AddFooditem