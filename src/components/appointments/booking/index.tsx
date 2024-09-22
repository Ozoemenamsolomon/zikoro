"use client"

import React, { useEffect, useState } from 'react'
import Calender from './Calender'
import {useGetBookingAppointment} from "@/hooks"
import Image from 'next/image'
import { useAppointmentContext } from '../context/AppointmentContext'
import ProcessPayment from './ProcessPayment'

const Booking =  ({alias}:{alias:string}) => {
  const {appointment: appointmnetLink, isLoading, error, } = useGetBookingAppointment(alias)
  const {bookingFormData, isFormUp} = useAppointmentContext()
//   console.log({appointmnetLink, bookingFormData})
    const [delay, setDelay] = useState(true)

    useEffect(() => {
      setTimeout(() => {
        setDelay(false)
      }, 1000);
    }, [])
    
  return (
    <main className='relative py-8 md:py-4 sm:px-6 xl:px-12 flex flex-col gap-2 bg-[#F9FAFF]  min-h-screen   '>
        {
            !isLoading && error ? 
            <section className='z-50 fixed flex-col gap-2 inset-0 bg-slate-950/10 text-red-600 flex items-center text-center justify-center w-full'>
                    <p>{error}</p>
                    <p>Refresh the page</p>
            </section>
            : null
        }

        <header className='max-md:pl-4 shrink-0'>
            {
                isLoading || delay ?
                <div className='w-20 h-10 rounded-md animate-pulse bg-baseBg'></div>
                :
                appointmnetLink?.logo ?
                <div className='h-14 w-36'>
                    <Image src={appointmnetLink?.logo } alt='brand logo' width={120} height={85} className='h-full w-full object-contain' />
                </div>
                :
                <div className=''>
                    <Image src='/zikoro-b.png' alt='brand logo' width={100} height={50} />
                </div>
            }
        </header>
        {
            isFormUp==='pay' ?
            <ProcessPayment appointmentLink={appointmnetLink}/>
            :
            <section className="py-10  h-full  w-full flex  items-center justify-center gap-12">
                
                <section className="w-full max-w-7xl lg:max-h-[70vh] mx-auto  grid lg:flex gap-6 lg:justify-center ">

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
                            {appointmnetLink?.amount || bookingFormData?.currency ? <div className="flex  pb-2 w-full items-start">
                                <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Price</p>
                                {isLoading ?
                                <div className='w-32 h-10 rounded-md animate-pulse bg-slate-100'></div> :
                                <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5 flex ">{bookingFormData?.currency ? bookingFormData?.currency : appointmnetLink?.curency} {bookingFormData?.price ? bookingFormData?.price  : appointmnetLink?.amount}</p>}
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
                
            </section>
        }
        {
            appointmnetLink?.zikoroBranding ? 
            <footer className='shrink-0 flex w-full gap-4 justify-center items-center '>
                <p className="">Create your bookings with</p>
                <Image src={'/zikoro-b.png'} alt='zikoro booking' width={110} height={55}/>
            </footer> 
            : null
        }
    </main>
  )
}

export default Booking