import React, { useState, useCallback } from 'react';
import { format, parse } from 'date-fns';
import { useAppointmentContext } from '../context/AppointmentContext';

interface SubmitType {
  maxBookingLimit:number
  validate: any
  setErrors:any
}

const SubmitBtn: React.FC<SubmitType> = ({maxBookingLimit, validate, setErrors }) => {
  
  const {bookingFormData, setBookingFormData,slotCounts, setSlotCounts,  setInactiveSlots} = useAppointmentContext()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const isDisabled = !bookingFormData.appointmentDate || !bookingFormData.appointmentTime || !bookingFormData.appointmentLinkId || !bookingFormData.participantEmail;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (isDisabled || !validate() ) {
      setLoading(false);
      return;
    }

    const timeStamp = generateAppointmentTime({ timeRange: bookingFormData.appointmentTime!, selectedDate: bookingFormData.appointmentDate! });
// TODO: check if the appointmentDate already > the maxbookinglimit

    try {
      const response = await fetch('/api/appointments/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingFormData, appointmentTime: timeStamp }),
      });

      const result = await response.json();
      console.log({ result, form: { ...bookingFormData, appointmentTime: timeStamp } });

      if (response.ok) {
        setBookingFormData((prevData) => ({
          ...prevData,
          appointmentDate: null,
          appointmentTime: null,
        }));
        console.log('Form submitted successfully', result);
        // update inactiveSlots
        let slot: string = result?.data?.appointmentTime;

        const newSlotCounts = {...slotCounts} 
        newSlotCounts[slot] = (newSlotCounts[slot] || 0) + 1;
        setSlotCounts(newSlotCounts)
        
        if (newSlotCounts[slot] >= maxBookingLimit) {
          setInactiveSlots(prev=>([...prev, slot]))
        }
        
        // updateSlots()
        // push('/appointments/links')
      } else {
        console.error('Form submission failed', result);
        setErrors({general: result.error});
      }
    } catch (error) {
      console.error('An error occurred:', error);
        setErrors({general: 'An unexpected error occurred'});
    } finally {
      setLoading(false);
    }
  }, [ isDisabled, setBookingFormData, ]);

  return (
    <div className="w-full">
      <button
        onClick={handleSubmit}
        type="submit"
        disabled={isDisabled}
        className={`w-full px-4 py-3 rounded-md text-center bg-basePrimary text-white ${loading || isDisabled  ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Submitting...' : 'Book Appointment'}
      </button>
      {error && <p className="text-center w-full text-sm  text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SubmitBtn;

interface BookingInput {
  timeRange: string;
  selectedDate: Date | string | null;
}

function generateAppointmentTime({ timeRange, selectedDate }: BookingInput): string | null {
  if (!timeRange) {
    console.error("Invalid timeRange:", timeRange);
    return null;
  }

  const [startTime] = timeRange.split(' - ');

  const appointmentDateTime = parse(startTime, 'hh:mm a', new Date(selectedDate || Date.now()));

  if (isNaN(appointmentDateTime.getTime())) {
    console.error("Invalid startTime format:", startTime);
    return null;
  }

  console.log({ timeRange, selectedDate, startTime, appointmentDateTime });
  return format(appointmentDateTime, 'HH:mm:ss');
}
