"use client"

import React from 'react'
import Calender from './Calender'
import {useGetBookingAppointment} from "@/hooks"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const Booking =  ({alias}:{alias:string}) => {
  const {appointment: appointmnetLink, isLoading, getAppointment} = useGetBookingAppointment(alias)
  console.log({appointmnetLink})
    
  return (
    <main className='relative pt-10 sm:px-6 xl:px-12  bg-white min-h-screen  space-y-4'>
        <header >
            <h4 className="text-2xl font-semibold max-sm:pl-4 ">Organization logo</h4>
        </header>
        <section className="py-12  px-4 rounded-lg   w-full flex flex-col bg-[#F2F2F2] justify-between gap-12">

            <section className="w-full max-w-7xl  mx-auto  grid lg:flex gap-6 lg:justify-center">

                <div className="bg-white w-full lg:w-80  xl:w-96  flex-shrink-0 p-6 rounded-lg   title ">
                    <p className="">Appointment details</p>

                    <div className="pt-24  pb-8">
                        <h4 className="text-xl font-semibold pb-6">{appointmnetLink?.appointmentName}</h4>

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

            <footer className=' flex w-full gap-4 justify-center items-center '>
                <div className="" onClick={async ()=>{
                    const supabase = createClientComponentClient();
                    const error = await supabase.auth.signOut();
                    console.log({error})
                }}>logout</div>
                <p className="">Powered by</p>
                <div className="flex-shrink-0 h-[47px] w-[47px] rounded-full  "
                style={{background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)'
                }}></div>
                <div className="">
                    <p className="text-[#1F1F1F] text-[12px]">Zikoro</p>
                    <h5 className="text-[#1F1F1F] text-[16px] font-semibold">Bookings</h5>
                </div>
            </footer>
        </section>

         
    </main>
  )
}

export default Booking