"use client"

import React from 'react'
import Calender from './Calender'
import {useGetBookingAppointment} from "@/hooks"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'

const Booking =  ({alias}:{alias:string}) => {
  const {appointment: appointmnetLink, isLoading, getAppointment} = useGetBookingAppointment(alias)

  console.log({appointmnetLink})
    
  return (
    <main className='relative pt-10 sm:px-6 xl:px-12  bg-white min-h-screen  space-y-4'>
        <header >
            {
                isLoading ?
                <div className='w-48 h-10 rounded-md animate-pulse bg-gray-200'></div>
                :
                appointmnetLink?.logo ?
                <div className=''>
                    <Image src={appointmnetLink?.logo } alt='brand logo' width={35} height={20} />
                </div>
                :
                <div className=''>
                    <Image src='/zikoro-b.png' alt='brand logo' width={100} height={50} />
                </div>
            }
        </header>

        <section className="py-10  px-4 rounded-lg   w-full flex flex-col bg-[#F2F2F2] justify-between gap-12">

            <section className="w-full max-w-7xl lg:h-[70vh] mx-auto  grid lg:flex gap-6 lg:justify-center">

                <div className="bg-white w-full lg:w-80 overflow-auto xl:w-96  flex-shrink-0 p-6 rounded-lg   title ">
                <h4 className="text-lg font-semibold ">{appointmnetLink?.appointmentName}</h4>

                    <div className="pt-24  pb-8">
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Duration</p>
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.duration} mins</p>
                        </div>
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Location Type</p>
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.loctionType}</p>
                        </div>
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Location</p>
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.locationDetails}</p>
                        </div>
                        <div className="flex  pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Price</p>
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5 flex ">{appointmnetLink?.curency} {appointmnetLink?.amount}</p>
                        </div>
                        <div className="flex  pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Max booking</p>
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5 flex "> {appointmnetLink?.maxBooking}</p>
                        </div>
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Desc</p>
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.note}</p>
                        </div>
                    </div>
                </div>
               
               <Calender appointmnetLink={appointmnetLink} fetchingData={isLoading}/>

            </section>

            {appointmnetLink?.zikoroBranding ? <footer className=' flex w-full gap-4 justify-center items-center '>
                <p className="">Powered by</p>
                <Image src={'/zikoro-b.png'} alt='zikoro booking' width={110} height={55}/>
            </footer> : null}
        </section>

         
    </main>
  )
}

export default Booking