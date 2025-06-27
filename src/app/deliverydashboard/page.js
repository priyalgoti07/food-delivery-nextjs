'use client'
import React, { useEffect } from 'react'
import DeliveryHeader from '../_components/DeliveryHeader'
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    useEffect(() => {
        const delivery = JSON.parse(localStorage.getItem('delivertPartner'));
        if (!delivery) {
            router.push('/deliverypartner');
        }
    }, [])
    return (
        <div>
            <DeliveryHeader />
            <h1>Delivery Dashboard</h1>
        </div>
    )
}

export default Page