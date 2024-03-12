"use client"
import React from 'react'
import Image from "next/image"


export default function CityEvent() {
   
    return (
            <div className='border-[1px] border-gray-200 rounded-md '>
                <Image className='object-cover' src="/city.png" alt="" width={608} height={406} />
                <p className='text-xl font-medium text-black text-center py-4'>Nigeria</p>
            </div>
    )
}