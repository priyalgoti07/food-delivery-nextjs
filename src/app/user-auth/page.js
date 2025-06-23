'use client'
import React from 'react'
import CustomersHeader from '../_components/CustomersHeader'
import RestaurantFooter from '../_components/RestaurantFooter'
import UserSignup from '../_components/UserSignup'

const UserAuth = () => {
    return (
        <>
            <CustomersHeader />
            <UserSignup />
            <RestaurantFooter />
        </>
    )
}

export default UserAuth