import { AppointmentsIcon, } from '@/constants'
import { useGetBookings } from '@/hooks';
import React, { useEffect, useState } from 'react'
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { SectionOneProps } from './SectionOne';
import { Booking } from '@/types/appointments';
import Link from 'next/link';

const CanceledAppointments: React.FC<SectionOneProps> = ({
  isLoading,
  error,
  current,
}) => {
  const [cancelled, setCancelled] = useState<Booking[]>([])

  const filterCancelledBookings = () => {
    const cancelledList = current?.filter((item) => item.bookingStatus === 'CANCELLED');
    return cancelledList;  
  };

  useEffect(() => {
    setCancelled(filterCancelledBookings())
    }, [current])

    
    return (
        <>
        {isLoading ? (
            <LoadingState />
          ) :  error ? (
            <ErrorState/>
          ) : (
        <div className='border bg-[#F9FAFF] p-4  rounded-md flex flex-col justify-center items-center gap-2'>
            <AppointmentsIcon/>
    
            <h5 className="text-">Cancelled Appointments</h5>
    
            <h3 className="text-2xl font-bold">{cancelled?.length}</h3>
    
            <Link href={'/appointments'} 
            type="button"
            className='underline hover:text-zikoroBlue duration-300'
            >see appointments
            </Link >
        </div>
         )}
         </>
       );
     };

export default CanceledAppointments