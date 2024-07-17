
import React, { useEffect, useState } from 'react';
import { AppointmentLink, Booking } from '@/types/appointments';
import {format,parse,} from 'date-fns';
import { SlotsResult } from './Calender';
import { useAppointmentContext } from '../context/AppointmentContext';
import { usePathname } from 'next/navigation';

interface SlotsType {
  selectedDate: Date | string |undefined;
  maxBookingLimit?:number;
  timeSlots: SlotsResult | null;
  appointmnetLink: AppointmentLink | null,
  reschedule?: any
}

const Slots: React.FC<SlotsType> = ({appointmnetLink, timeSlots, selectedDate, reschedule }) => {
  const {bookingFormData, setBookingFormData, slotCounts, setSlotCounts,inactiveSlots, setInactiveSlots, setIsFormUp} = useAppointmentContext()

  const [loading, setLoading] = useState(true);
  const maxBookingLimit = appointmnetLink?.maxBooking;

  const [error, setError] = useState('')
  const pathname = usePathname()
  const isBooking = pathname.includes('booking')

  const fetchBookedSlots = async () => {
    setLoading(true)
    setError('')
    try {
      // fetch slots based on appointmentLink.id and date
      const response = await fetch(`/api/appointments/booking/sessions/${format(selectedDate!, 'yyyy-MM-dd')}?appointmentLinkId=${appointmnetLink?.id}`, 
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok) {
        // console.log('Books fetched successfully', result);
        return result?.data
      } else {
        // console.error('Bookings failed', result);
        setError(result.error);
        return []
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const countBookingsBySlot = (bookings: Booking[]) => {
    const newSlotCounts:{ [key: string]: number } = {}

    bookings?.forEach((booking) => {
      const slot = booking.appointmentTime;
      if (slot) {
        newSlotCounts[slot] = (newSlotCounts[slot] || 0) + 1;
      }
    });
    setSlotCounts(newSlotCounts)
    // console.log({newSlotCounts})

    return newSlotCounts;
  };

  const getInactiveSlots = (slotCounts:any, maxBookingLimit:number) => {
    const inactiveSlots: string[] = [];

    Object.keys(slotCounts).forEach((slot) => {
      if (slotCounts[slot] >= maxBookingLimit) {
        inactiveSlots.push(slot);
      }
    });
    // console.log({inactiveSlots})
    return inactiveSlots;
  };

  const updateSlots = async () => {
    const bookings = await fetchBookedSlots();
    const slotCounts = countBookingsBySlot(bookings);
    const inactiveSlots = getInactiveSlots(slotCounts, maxBookingLimit!);
    setInactiveSlots(inactiveSlots);
    setLoading(false)
    // console.log({bookings})
  };

  useEffect(() => {
    updateSlots();
    // console.log('=====',{bookingFormData,selectedDate,timeSlots:timeSlots?.selectDay})
  }, [selectedDate && isBooking]);

  const isDisabled = !bookingFormData?.appointmentDate || !bookingFormData?.appointmentTime  


  return (
    <div className="bg-white relative overflow-hidden md:w-80 flex-1 flex-shrink-0 rounded-lg  ">
      {loading && isBooking ? 
        <div className="h-full w-full flex justify-center items-center">
          <p>loading...</p> 
        </div>
        : 
        <>
         {isBooking ? <h5 className="text-md bg-white px-4 py-3 font-semibold">Choose Time</h5> : null}
         <div className="overflow-auto h-full  w-full  ">
            <div className={` flex flex-col w-full gap-2 h-full p-4 ${isBooking ? 'pb-32' : ''} `}>
              {
                timeSlots?.slots?.map((slot,i)=>{
                  // console.log({timeSlots})
                  return (
                      <button key={i} 
                          type='button'
                          disabled={inactiveSlots.includes(slot.value)}

                          className={`w-full flex-shrink-0  h-12 p-0.5
                              ${bookingFormData?.appointmentTime===slot.label ? ' bg-basePrimary':'border'}  
                              ${inactiveSlots.includes(slot.value) ? 'disabled cursor-not-allowed opacity-30' : ''}
                              rounded-md hover:shadow duration-200`}
                              onClick={
                                isBooking ? ()=>setBookingFormData({
                                  ...bookingFormData,
                                  appointmentTime: slot.label,
                                  appointmentDate: format(selectedDate!, 'yyyy-MM-dd'),
                                  appointmentTimeStr:  slot.label,
                                  appointmentDuration: appointmnetLink?.duration!,
                                  createdBy: appointmnetLink?.createdBy?.id!,
                              }) 
                              :
                              ()=>setBookingFormData({
                                ...bookingFormData,
                                appointmentTime: slot.label,
                                appointmentTimeStr:  slot.label,
                            }) 
                            }
                      >
                        <div className={`w-full h-full rounded flex justify-center items-center text-center ${bookingFormData?.appointmentTime===slot.label ? ' bg-gradient-to-r from-white/90 to-pink-100':''} `}>
                          {slot.label}
                        </div> 
                      </button>
                  )
                  })
              }
              
            </div>
        </div>
        {
          isBooking  ?  
          <div className="absolute bottom-0 bg-white py-3 z-10 px-4 w-full">
            <button
              onClick={()=>{
                setIsFormUp(true) 
              }}
              type="submit"
              className={`w-full py-2 px-4 bg-basePrimary text-white rounded ${loading  || isDisabled ? ' cursor-not-allowed opacity-30' : ''}`}
              disabled={loading || isDisabled}
            >
              Proceed
            </button> 
          </div> 
          : null
        }

        </>
      }
    </div>
  );
};

export default Slots