'use client'

import { useGetBookings } from '@/hooks';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import PageLoading from '../ui/Loading';

const AppointmentCalender = () => {
  let today = format(new Date(), 'MMMM yyyy')
  const { bookings, isLoading,error, getPastBookings,getBookings } = useGetBookings();

  return (
    <section className='flex flex-col gap-8 h-full'>
      <div className="flex w-full flex-shrink-0 justify-between gap-4 flex-col sm:flex-row pb-">
        <div className="flex gap-6 items-center">
          <h4 className="text-2xl font-semibold">{today}</h4>
          <p className="">-</p>
          <p
            className="font-semibold"
            style={{
              background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {!isLoading ? bookings?.length + 'meetings' : null}
          </p>
        </div>

        <div className="flex justify-end">
          <div className="rounded-full bg-basePrimary p-0.5">
              <button
                className="py-2 bg-white px-4  rounded-full flex gap-2 items-center text-sm"
              >
                <p>Month view</p><ChevronDown size={18}/>
              </button>
          </div>
        </div>
      </div>

      {
        isLoading ? 
        <PageLoading isLoading={isLoading} />
        :
        error ? 
        <section className="py-20 text-center w-full">{error}</section>
        :
        !bookings?.length ?
        <section className="w-full min-h-screen relative pt-40 ">
          <div className='absolute top-0 w-full h-full overflow-hidden'>
            <Image src={'/calender.png'} alt='calender' width={800} height={700} className='h-full w-full object-cover' />
          </div> 

          <div className="relative max-w-xl mx-auto p-6 flex flex-col text-center  items-center justify-center">
            <h2 className="text-2xl sm:text-4xl font-bold pb-12" 
            style={{
              background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Your Booked Appointments Schedule will Appear here
            </h2>
            <p className='pb-4 font-semibold'>Haven’t created an appointment?</p>

            <Link href={'/appointments/create'} className='py-3 px-6 font-semibold text-white rounded-md bg-basePrimary' >Start creating</Link>
          </div>
        </section>
        :
        <>Calender</>
      }

    </section>
  );
};

export default AppointmentCalender;
