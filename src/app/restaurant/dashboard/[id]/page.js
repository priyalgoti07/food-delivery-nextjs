'use client'
import AddFooditem from '@/app/_components/AddFooditem';
import FooditemList from '@/app/_components/FooditemList';
import RestaurantFooter from '@/app/_components/RestaurantFooter';
import RestaurantHeader from '@/app/_components/RestaurantHeader';
import { useParams } from 'next/navigation';
import React from 'react'

const EditForm = () => {
    const params = useParams();
    return (
        <div>
            <RestaurantHeader />
            {
                params?.id ?
                    <div className='mt-10'>
                        <AddFooditem  editId={params.id}/>
                    </div>
                    : <h1>Loding</h1>}
            <RestaurantFooter />
        </div>
    )
}

export default EditForm