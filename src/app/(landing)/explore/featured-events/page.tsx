"use client"
import React, { useState } from 'react'
import { Montserrat } from "next/font/google";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FilterIcon, ArrowDownIcon } from '@/components/svg/Constants';
import FeaturedEvent from '@/components/explore/FeaturedEvent';

const montserrat = Montserrat({
    weight: [ '100', '200', '400', '500','600','700'],
    subsets: ['latin'],
    display:'swap',
    fallback: ['Arial', 'sans-serif'],
  });

export default function FeaturedEvents() {

    const [searchBox, setSearchBox] = useState('')

    const handleChange = (e:any) => {
        setSearchBox(e.target.value)
    }

    const eventCategories = ['Use cases', 'Conferences', 'Tradeshows & Exhibitions', 'Seminars & Workshops', 'Careers', 'Education', 'Culture & Arts', 'Celebrations', 'Sports', 'Job Fairs', 'Festivals', 'Charity']
   
    return (
        <div  className={`${montserrat.className} `}>
            <Navbar />
                {/* header */}
                    <div className='px-5 lg:px-0 max-w-full lg:max-w-7xl mx-auto pb-12'>
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

                                {/* main section */}
                                <div className='flex flex-col lg:flex-row justify-between mt-[50px] pb-[50px] border-r-0 border-l-[1px] border-b-[1px] border-gray-400 border-collapse rounded-lg'>

                                    {/* left */}
                                    
                                    <div className='border-t-[1px] border-gray-400 rounded-l-lg w-full lg:w-3/12'>
                                            <div className='flex gap-x-3 py-[43px] px-8 border-b-[1px] border-gray-400'>
                                                    <FilterIcon/> 
                                                    <p className='text-xl font-semibold'> Filters</p>
                                            </div>

                                            <div className='flex flex-col gap-y-12 mt-7'>
                                                {/* 1st section */}
                                                    <div className='px-8 cursor-pointer '>
                                                        <div className='flex justify-between items-center'>
                                                            <p className='text-lg font-semibold'>Event Type</p>
                                                            <ArrowDownIcon />
                                                        </div>
                                                        
                                                    </div>

                                                    {/* 2nd section */}
                                                    <div className='px-8 cursor-pointer'>
                                                        <div className='flex justify-between items-center'>
                                                            <p className='text-lg  font-semibold'>Event Date</p>
                                                            <ArrowDownIcon/>
                                                        </div>

                                                        {/* <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-8">
                                                             <button className='py-4 px-5'>
                                                                Hybrid
                                                             </button>
                                                        </div> */}
                                                        
                                                    </div>

                                                    {/* 3rd section */}
                                                    <div className='px-8 cursor-pointer'>
                                                        <div className='flex justify-between items-center'>
                                                            <p className='text-lg font-semibold'>Country</p>
                                                            <ArrowDownIcon/>
                                                        </div>
                                                        
                                                    </div>

                                                    {/* 4th section */}
                                                    <div className='px-8 cursor-pointer'>
                                                        <div className='flex justify-between items-center'>
                                                            <p className='text-lg font-semibold'>City</p>
                                                            <ArrowDownIcon/>
                                                        </div>
                                                        
                                                    </div>

                                                    {/* 5th section */}
                                                    <div className='px-8 cursor-pointer'>
                                                        <div className='flex justify-between items-center'>
                                                            <p className='text-lg font-semibold'>Price Range</p>
                                                            <ArrowDownIcon/>
                                                        </div>
                                                        
                                                    </div>

                                            </div>

                                            
                                    </div>
                
                                    {/* Right */}
                                    <div className='border-l-[1px] border-t-[1px] border-gray-400 w-full lg:w-9/12 '>
                                        {/* top */}
                                        <div className='flex'>
                                            <div className=" px-4 flex w-[950px] items-center overflow-x-auto scrollbar-hide py-7 gap-x-[10px]">
                                                { eventCategories.map((eventCategory) => (
                                                        <div className='py-[18px] px-5 t w-auto  cursor-pointer text-sm border-[1px] border-gray-400 rounded-lg whitespace-nowrap'>{eventCategory} </div>                                           
                                                    ))
                                                }
                                            </div>
                                        </div>
                                       
                                        {/* bottom */}
                                            <div className="py-2 px-4 h-[900px] flex flex-col justify-start border-t-[1px] border-gray-400  items-center overflow-y-auto scrollbar-hide pt-8">                                                
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                        <FeaturedEvent/>
                                                </div>

                                                <div className='gap-5 flex justify-center items-center pt-12'>
                                                    <button className=' text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white'>
                                                        See more
                                                    </button>
                                             </div>
                                        </div>
                                            

                                            
                                    </div>

                             </div>
                    </div>
                    <Footer/>
        </div>
    )
}