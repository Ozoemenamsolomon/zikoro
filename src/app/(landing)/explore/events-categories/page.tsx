"use client"
import React from 'react'
import { Montserrat } from "next/font/google";
import CategoryEvent from '@/components/explore/CategoryEvent'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const montserrat = Montserrat({
    weight: [ '100', '300', '400', '500','600','700', '800'],
    subsets: ['latin'],
    display:'swap',
    fallback: ['Arial', 'sans-serif'],
  });

export default function EventsCategories() {
   
    return (
        <div  className={`${montserrat.className}`}>
            <Navbar/>
                {/* header */}
                    <div className='px-1 lg:px-0 max-w-full lg:max-w-6xl mx-auto pb-12 mt-40 lg:mt-48'>
                            <div className='mt-24 text-center'>
                                <p className='text-[24px] lg:text-[40px]  gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold'>Explore Event Categories</p>
                                <p className='text-[16px] lg:text-[24px] font-normal'>Discover exciting events in different categories across the globe</p>
                            </div>
                            
                            {/* Events categories */}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 lg:gap-y-12 mt-12 lg:mt-24 px-[10px] lg:px-0'>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                                <CategoryEvent/>
                               
                            </div>

                            <div className='gap-5 flex justify-center items-center pt-12'>
                                <button className=' text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white'>
                                    See more
                                </button>
                            </div>
                    </div>

            {/* Footer */}
            <Footer/>
        </div>
       
    )
}