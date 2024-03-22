"use client"
import React from 'react'
import CityEvent from './CityEvent'
import RightArrow from '../svg/RightArrow'
import { useRouter } from "next/navigation"

export default function CitiesEventList() {
    const router = useRouter()
    return (
            <div className='mt-[100px] max-w-6xl mx-auto px-3 lg:px-0'>
                {/* header */}
                <div className='flex justify-between'>
                        <p className='font-semibold text-[20px] lg:text-[32px]'>Events In Other Cities</p>
                        <div onClick={()=> router.push('/explore/events-cities')} className='hidden lg:flex gap-x-4 cursor-pointer items-center'>
                            <p className='bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold'>See All</p>
                            <RightArrow />
                        </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 lg:gap-y-0 gap-x-4 mt-[50px] bg-white '>
                    <CityEvent/>
                    <CityEvent/>
                    <CityEvent/>
                    <CityEvent/>
                </div>

                <div onClick={()=> router.push('/explore/events-cities')} className='flex lg:hidden mt-[30px] justify-end gap-x-4 cursor-pointer items-center'>
                            <p className='bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold'>See All</p>
                            <RightArrow />
                </div>
            </div>
      
    )
}

