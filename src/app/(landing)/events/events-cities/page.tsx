"use client"
import React from 'react'
import Navbar from '@/components/index/Navbar'
import Footer from '@/components/index/Footer'
import { Montserrat } from "next/font/google";
import CityEvent from '@/components/index/CityEvent';


const montserrat = Montserrat({
    weight: [ '200','300', '400', '500','600', '700'],
    subsets: ['latin'],
    display:'swap',
    fallback: ['Arial', 'sans-serif'],
  });

export default function EventsCities() {
   
    return (
        <div  className={`${montserrat.className} `}>
            <Navbar/>
                {/* header */}
                    <div className='px-5 lg:px-0 max-w-full lg:max-w-6xl mx-auto pb-12'>
                            <div className='mt-24 text-center'>
                                <p className='text-[40px]  gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold'>Events in cities near you</p>
                                <p className='text-[24px] font-normal'>Discover exciting events in different cities across the globe</p>
                            </div>
                            
                            {/* Events categories */}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 mt-24'>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                                <CityEvent/>
                               
                            </div>

                            <div className='gap-5 flex justify-center items-center  pt-12 mx-aut'>
                                <button className=' text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white'>
                                    Next Page
                                </button>

                                <button  className='text-base text-zikoroBlue bg-transparent border border-indigo-800 py-[10px] px-5 rounded-md '>
                                    Prev Page
                                </button>
                            </div>
                    </div>

            {/* Footer */}
            <Footer/>
        </div>
    )
}