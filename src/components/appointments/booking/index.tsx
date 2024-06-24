"use client"

import { AppointmentLink } from '@/types/appointments'
import React from 'react'
import Calender from './Calender'
import {useGetBookingAppointment} from "@/hooks"

const Booking =  ({id}:{id:string}) => {
    const {appointment: appointmnetLink} = useGetBookingAppointment(id)
    
  return (
    <main className='relative p-6 xl:p-12 xl:pb-6 bg-[#F2F2F2] min-h-screen flex flex-col justify-between gap-12'>
        <section className="">
            <header>
                <h4 className="text-2xl font-semibold">Organization logo</h4>
            </header>

            <section className="rounded-lg w-full max-w-7xl mx-auto py-12 grid lg:flex gap-6 lg:justify-center">
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
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Desc</p>
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.note}</p>
                        </div>
                    </div>
                </div>
               {appointmnetLink && <Calender appointmnetLink={appointmnetLink}/>}
            </section>
        </section>

         <footer className=' flex w-full gap-4 justify-center items-center '>
            <p className="">Powered by</p>
            <div className="flex-shrink-0 h-[47px] w-[47px] rounded-full  "
            style={{background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)'
            }}></div>
            <div className="">
                <p className="text-[#1F1F1F] text-[12px]">Zikoro</p>
                <h5 className="text-[#1F1F1F] text-[16px] font-semibold">Bookings</h5>
            </div>
        </footer>
    </main>
  )
}

export default Booking