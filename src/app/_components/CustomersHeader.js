import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../../../public/food-logo.png';


const CustomersHeader = () => {
    return (
        <header className="w-full py-4 px-6 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Image src={logo} alt="Restaurant Logo" width={60} height={60} />
                    <h1 className="text-xl font-bold">Restaurant Portal</h1>
                </div>

                {/* Navigation Links */}
                <nav className='flex justify-around'>
                    <ul className="flex space-x-6">
                        <li><Link href="/">Login</Link></li>
                        <li>
                            <Link href="/">
                                Signup
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                Cart(0)
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                Add Restaurant
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                Login
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

    )
}

export default CustomersHeader