"use client"

import React from 'react'
import Calender from './Calender'
import {useGetBookingAppointment} from "@/hooks"
import Image from 'next/image'
import { useAppointmentContext } from '../context/AppointmentContext'

const Booking =  ({alias}:{alias:string}) => {
  const {appointment: appointmnetLink, isLoading, error, } = useGetBookingAppointment(alias)
  const {bookingFormData} = useAppointmentContext()
//   console.log({appointmnetLink})

    
  return (
    <main className='relative pt-10 sm:px-6 xl:px-12  bg-white min-h-screen  space-y-4'>
        {
            error ? 
            <section className='z-50 fixed flex-col gap-2 inset-0 bg-slate-500/20 text-red-600 flex items-center text-center justify-center w-full'>
                    <p>{error}</p>
                    <p>Refresh page</p>
            </section>
            :null
        }
        <header className='max-md:pl-4'>
            {
                isLoading ?
                <div className='w-20 h-10 rounded-md animate-pulse bg-[#F9FAFF]'></div>
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

        <section className="py-10  px-4 rounded-lg   w-full flex flex-col bg-[#F9FAFF] justify-between gap-12">

            <section className="w-full max-w-7xl lg:h-[70vh] mx-auto  grid lg:flex gap-6 lg:justify-center">

                <div className="bg-white w-full lg:w-80 overflow-auto xl:w-96  flex-shrink-0 p-6 rounded-lg   title ">
                {isLoading ?
                <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> : 
                <h4 className="text-lg font-semibold ">{appointmnetLink?.appointmentName}</h4>}

                    <div className="pt-24  pb-8">
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Duration</p>
                            {isLoading ?
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> : 
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.duration ? appointmnetLink?.duration + 'mins':''}</p>}
                        </div>
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Location Type</p>
                            {isLoading ?
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> :
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.loctionType}</p>}
                        </div>
                        <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Location</p>
                            {isLoading ?
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> :
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.locationDetails}</p>}
                        </div>
                        {appointmnetLink?.amount?<div className="flex  pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Price</p>
                            {isLoading ?
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> :
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5 flex ">{appointmnetLink?.curency} {appointmnetLink?.amount}</p>}
                        </div>:null}
                        <div className="flex  pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Max booking</p>
                            {isLoading ?
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> :
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5 flex "> {appointmnetLink?.maxBooking}</p>}
                        </div>
                        {appointmnetLink?.note ? <div className="flex pb-2 w-full items-start">
                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Desc</p>
                            {isLoading ?
                            <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> :
                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmnetLink?.note}</p>}
                        </div> : null}
                    </div>
                </div>
               
               <Calender appointmnetLink={appointmnetLink} fetchingData={isLoading}/>

            </section>

            {appointmnetLink?.zikoroBranding ? <footer className=' flex w-full gap-4 justify-center items-center '>
                <p className="">Create your bookings with</p>
                <Image src={'/zikoro-b.png'} alt='zikoro booking' width={110} height={55}/>
            </footer> : null}
        </section>

         
    </main>
  )
}

export default Booking