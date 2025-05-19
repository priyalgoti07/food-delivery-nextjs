'use client'
import CustomersHeader from '@/app/_components/CustomersHeader';
import { useParams } from 'next/navigation';
const Page = () => {
    const params = useParams();
    console.log("parmas------->", params)
    return (
        <>
            <CustomersHeader />
            <div className="relative bg-[url('https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg')] bg-cover bg-center min-h-[400px]">
                {/* Black shadow overlay */}
                <div className="absolute inset-0 bg-black opacity-50 "></div>
                <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                    <h1 className="text-6xl font-bold mb-4">{decodeURI(params.name)}</h1>

                </div>
            </div>
        </>
    )
}

export default Page