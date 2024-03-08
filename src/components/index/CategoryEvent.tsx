"use client"
import React from 'react'
import Image from "next/image"

export default function CategoryEvent() {
    return (
            <div className='shadow-lg rounded-md '>
                <Image className='object-cover' src="/category.png" alt="" width={608} height={406} />
                <p className='text-xl font-medium text-black text-center py-4'>Sport</p>
            </div>
    )
}