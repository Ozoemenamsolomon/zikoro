import { AppointmentsIcon, } from '@/constants'
import { useGetBookings } from '@/hooks'
import React, { useEffect, useState } from 'react'
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useAppointmentContext } from '../context/AppointmentContext';
import { SectionOneProps } from './SectionOne';
import { parse, parseISO } from 'date-fns';
import { Booking } from '@/types/appointments';
import Link from 'next/link';

const UpcomingAppointments: React.FC<SectionOneProps> = ({
  isLoading,
  error,
  current,
}) => {
  const [upcoming, setUpcoming] = useState<Booking[]>([])
  const filterUpcoming = () => {
    let now = new Date(); 
    const newList = current?.filter((item) => {
      const appointmentDateTimeStr = `${item.appointmentDate}T${item.appointmentTime}`;
      const appointmentTime = parseISO(appointmentDateTimeStr);
      return appointmentTime > now;
    });
    
    return newList; 
  };
  
  useEffect(() => {
    setUpcoming(filterUpcoming())
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
    
            <h5 className="text-">Upcoming Appointments</h5>
    
            <h3 className="text-2xl font-bold">{upcoming.length}</h3>
    
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

export default UpcomingAppointments