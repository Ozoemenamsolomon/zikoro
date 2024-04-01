"use client"
import React from 'react'
import Image from "next/image"

export default function CategoryEvent() {
    return (
            <div className='border-[1px] border-gray-200 rounded-md '>
                <Image className='object-cover hidden lg:block' src="/category.png" alt="" width={608} height={406} />
                <Image className='object-cover block lg:hidden w-full' src="/category.png" alt="" width={294} height={308} />
                <p className='text-xl font-medium text-black text-center py-4'>Sport</p>
            </div>
    )
}