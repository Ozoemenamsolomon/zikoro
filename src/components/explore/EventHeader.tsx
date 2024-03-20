"use client"
import React, { useState } from 'react'
import Image from "next/image"
import Location from '../svg/Location'

export default function EventHeader() {
   
    const [searchBox, setSearchBox] = useState('')

    const handleChange = (e:any) => {
        setSearchBox(e.target.value)
    }
    return (
           <div className=' bg-gradient-overlay relative '>
                <Image  src="/eventsBg.png" alt="Background" width={1662} height={1216}  className="object-cover w-full" />
                <div className="absolute inset-0 flex items-center lg:justify-center">
                    <div className="flex flex-col justify-between">

                        <p className="text-[32px] lg:text-[64px] text-white text-center justify-center font-bold">Explore A Wide <span className='block lg:inline'>Range Of Events</span></p>
                        
                        <div className='bg-white h-28 absolute bottom-0 mx-0 lg:mx-auto rounded-lg '>
                            {/* Big Form */}
                            <form action="" className='hidden lg:block px-12 py-10 pt-12 w-[1055px] h-[210px] bg-white rounded-lg shadow-md '>
                                <p className='text-2xl font-normal'>Find Events Easily</p>

                                <div className='pt-7 h-9 mt-6 flex items-center w-full gap-x-4'>

                                    <div className='flex flex-2 gap-x-2 px-10 py-[6px] rounded-md '>
                                        <Location/>
                                        <p className='text-base text-semibold'>Lagos</p>
                                    </div>

                                    <div className='h-[48px] flex justify-between gap-x-3 flex-1 items-center'>
                                        <div className=' p-1 border-[1px] border-indigo-800 rounded-xl w-[680px] h-full'>
                                                <input type="text" value={searchBox} name="searchBox" id="" onChange={handleChange} placeholder='search by event name, city, category' className='pl-4 outline-none text-base text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full'/>
                                        </div>

                                        <button className='bg-gradient-to-tr flex-1 from-custom-gradient-start to-custom-gradient-end text-white cursor-pointer px-5 text-base py-[13px] rounded-lg'> Search</button>
                                    </div>
                                   
                                </div>
                            </form>

                            {/* Small Form */}
                            <form action="" className='block lg:hidden px-[10px] py-[10px] pt-12 w-[355px] h-[160px] bg-white rounded-lg shadow-md '>
                                <p className='text-[20px] font-normal text-center'>Find Events Easily</p>


                                    <div className='h-[48px] flex justify-between gap-x-3 items-center'>
                                        <div className='flex flex-2 gap-x-2 px-10 py-[6px] rounded-md '>
                                            <Location/>
                                            <p className='text-base text-semibold'>Lagos</p>
                                        </div>
                                        <div className=' p-1 border-[1px] border-indigo-800 rounded-xl w-[274px] h-full'>
                                                <input type="text" value={searchBox} name="searchBox" id="" onChange={handleChange} placeholder='search by event name, city, category' className='pl-4 outline-none text-base text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full'/>
                                        </div>
                                    </div>

                                        
                                    {/* </div> */}
                                    <button className='block bg-gradient-to-tr flex-1 from-custom-gradient-start to-custom-gradient-end text-white cursor-pointer px-5 text-base py-[8px] rounded-lg'> Search</button>
                                   
                                
                            </form>
                        </div>

                    </div>
                </div>
        </div>
    )
}