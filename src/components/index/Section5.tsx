"use client"
import React from 'react'
import { useRouter } from "next/navigation"


export default function Section5() {
    
    const router = useRouter()
    return (
            <div className='mt-5 lg:mt-24 bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end px-5 lg:px-0 '>
                    <div className=''>
                        <p className='text-2xl lg:text-4xl text-center text-white pt-28 lg:pt-32'>
                             Ready to execute impactful and memorable <span className=' inline lg:block'>events that resonate with participants?</span> 
                        </p>

                        <div className='flex justify-center items-center text-white mt-12 pb-32 space-x-6'>
                                    <button onClick={() => router.push('/api/auth/login')} className='cursor-pointer bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-sm lg:text-base py-4 px-5 rounded-md border-[.5px] border-white'> Get Started</button>
                                    <button className='cursor-pointer bg-transparent text-sm lg:text-base py-4 px-5 rounded-md border-[.5px]'> Contact Sales</button>
                        </div>
                    </div>
            </div>
    )
}