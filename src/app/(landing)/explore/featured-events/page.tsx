"use client"
import React, { useState } from 'react'
import { Montserrat } from "next/font/google";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const montserrat = Montserrat({
    weight: [ '100', '300', '400', '500','600','700', '800'],
    subsets: ['latin'],
    display:'swap',
    fallback: ['Arial', 'sans-serif'],
  });

export default function FeaturedEvents() {

    const [searchBox, setSearchBox] = useState('')

    const handleChange = (e:any) => {
        setSearchBox(e.target.value)
    }
   
    return (
        <div  className={`${montserrat.className} `}>
            <Navbar/>
                {/* header */}
                    <div className='px-5 lg:px-0 max-w-full lg:max-w-6xl mx-auto pb-12'>
                            <div className='mt-24 text-center'>
                                <p className='text-[40px]  gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold'>Featured Events</p>
                                <p className='text-[24px] font-normal'>A collection of events hand-picked for you</p>
                            </div>

                                <div className='h-10 flex justify-between gap-x-3 max-w-xl mx-auto items-center mt-12'>
                                        <div className=' p-1 border-[1px] border-indigo-800 rounded-xl w-[500px] h-full'>
                                                <input type="text" value={searchBox} name="searchBox" id="" onChange={handleChange} placeholder='search by event name, city, category' className='pl-4 outline-none text-base text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full'/>
                                        </div>

                                        <button className='bg-gradient-to-tr flex-1 from-custom-gradient-start to-custom-gradient-end text-white cursor-pointer px-5 py-2 rounded-lg'> Search</button>
                                </div>
                    </div>
        </div>
    )
}