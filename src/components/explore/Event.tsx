"use client"
import React from 'react'
import Image from "next/image"
import Calendar from '../svg/Calendar'
import Location from '../svg/Location'


export default function Event() {
   
    return (
        <div className=''>
            {/* header */}
            <div className='relative '>
                <Image className='object-cover' src="/event.png" alt="" width={294} height={264} />
                <p className='text-base font-medium text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end absolute left-4 top-2 py-[5px] px-[10px] rounded-lg'>Hybrid</p>
            </div>
            
            {/* body */}
            <div className='pl-5 pr-5 border-[1px] border-gray-200 rounded-md'>
                <p className='mt-5 font-semibold '> Product Con </p>

                    <div className='mt-6 flex gap-x-[10px] '>
                        <Calendar/>
                        <p className='text-xl font-normal'>Fri, 01 Mar 2024</p>
                    </div>

                    <div className='mt-[10px] flex gap-x-[10px] mb-8 '>
                        <Location/>
                        <p className='text-xl font-normal'>Lagos, Nigeria</p>
                    </div>

                    <div className='border-t-[1px] border-gray-300 pt-8 flex justify-between pb-[15px]'>
                        <p className='text-base font-normal'>starting at</p>
                        <p className='text-xl font-medium'>₦ 500,000</p>
                    </div>
            </div>
        </div>
    )
}