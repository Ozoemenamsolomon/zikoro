import { AppointmentsIcon, } from '@/constants'
import React, { useEffect, useState } from 'react'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import { SectionOneProps } from './SectionOne'
import { Booking } from '@/types/appointments'
import Link from 'next/link'

const RescheduledAppointments: React.FC<SectionOneProps> = ({
  isLoading,
  error,
  current,
}) => {
  const [rescheduled, setRescheduled] = useState<Booking[]>([])

  const filterCancelledBookings = () => {
    const cancelledList = current?.filter((item) => item.bookingStatus === 'RESCHEDULED');
    return cancelledList;  
  };

  useEffect(() => {
    setRescheduled(filterCancelledBookings())
    }, [current])

    return (
        <>
        {isLoading ? (
            <LoadingState />
          ) :  error ? (
            <ErrorState/>
          ) : (
        <div className='border bg-[#F9FAFF] p-4   rounded-md flex flex-col justify-center items-center gap-2'>
            <AppointmentsIcon/>
    
            <h5 className="text-">Rescheduled Appointments</h5>
    
            <h3 className="text-2xl font-bold">{rescheduled?.length}</h3>
    
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

export default RescheduledAppointments