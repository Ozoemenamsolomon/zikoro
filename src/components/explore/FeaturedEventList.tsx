"use client"
import React from 'react'
import FeaturedEvent from './FeaturedEvent'
import RightArrow from '../svg/RightArrow'
import { useRouter } from "next/navigation"

export default function FeaturedEventList() {
    const router = useRouter()
    return (
            <div className='mt-[100px] max-w-6xl mx-auto'>
                {/* header */}
                <div className='flex justify-between'>
                        <p className='font-semibold text-3xl'>Featured Events</p>
                        <div onClick={()=> router.push('/explore/featured-events')} className='flex gap-x-4 cursor-pointer items-center'>
                            <p className='bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold'>See All</p>
                            <RightArrow />
                        </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 mt-[50px] bg-white '>
                    <FeaturedEvent/>
                    <FeaturedEvent/>
                    <FeaturedEvent/>
                    <FeaturedEvent/>
                </div>
            </div>
      
    )
}

