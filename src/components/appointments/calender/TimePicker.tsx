import React, { useState } from 'react';
import { AppointmentUnavailability, Booking } from '@/types/appointments';
import { PlusCircle, Trash } from 'lucide-react';
import { generateTimeOptions } from '../ui/DateTimeScheduler';
import toast from 'react-hot-toast';
import { format, isValid, parse } from 'date-fns';

const timeOptions = generateTimeOptions();

interface BookingInput {
    time: string;
    selectedDate: Date | string | null;
  }

const TimePicker = ({ booking }: { booking: Booking }) => {
  const [slots, setSlots] = useState<{ from: string, to: string }[]>([{ from: '', to: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTimeChange = (index: number, field: 'from' | 'to', value: string) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slots.some(slot => !slot.from || !slot.to)) {
      setError('Please fill out all time slots.');
      return;
    }
  
    const formData: AppointmentUnavailability[] = slots.map(slot => ({
      startDateTime: generateAppointmentTime({time: slot.from, selectedDate: booking?.appointmentDate!}),
      endDateTime: generateAppointmentTime({time: slot.to, selectedDate: booking?.appointmentDate!}),
      createdBy: booking?.createdBy
    }));
  
    try {
      setLoading(true);
      setError('')
      const response = await fetch('/api/appointments/calender/addunavailability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('Form submitted:', result);
  
      if (!response.ok) {
        setError('Failed to submit form. Please try again.');
      } else {
        toast.success('Form submitted')
        setSlots([{ from: '', to: '' }])
      }
  
    } catch (error:any) {
      console.error('Error submitting form:', error);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = (index: number) => {
    if (slots.length > 1) {
      setSlots(prev => prev.filter((_, idx) => idx !== index));
    } else {
      setError('At least one slot is required.');
    }
  };

  const addSlot = () => {
    setSlots(prev => [...prev, { from: '', to: '' }]);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="border rounded-md border-zikoroBlue px-3 py-4 mb-4">
            <div className="bg-purple-100 rounded-md p-3 text-center mb-4">
                <h6 className="text-base  font-medium">Edit unavailability</h6>
                <p className="text-sm">Add time when you will be unavailable today</p>
            </div>

            <div className=" space-y-3">
                {slots.map((time, index) => (
                    <div key={index} className="flex px-4 justify-center gap-3 items-center w-full">
                    <div className="p-3 bg-purple-100 rounded-md shrink-0">
                        <select
                        className="bg-transparent no-scrollbar border-none focus:outline-none"
                        value={time.from}
                        onChange={(e) => handleTimeChange(index, 'from', e.target.value)}
                        required
                        >
                        <option value="" disabled>Start time</option>
                        {timeOptions.map((time: string, idx: number) => (
                            <option key={idx} value={time}>{time}</option>
                        ))}
                        </select>
                    </div>
                    <p>-</p>
                    <div className="p-3 bg-purple-100 rounded-md shrink-0">
                        <select
                        className="bg-transparent no-scrollbar border-none focus:outline-none"
                        value={time.to}
                        onChange={(e) => handleTimeChange(index, 'to', e.target.value)}
                        required
                        >
                        <option value="" disabled>End time</option>
                        {timeOptions.map((time: string, idx: number) => (
                            <option key={idx} value={time}>{time}</option>
                        ))}
                        </select>
                    </div>
                    <Trash size={20} onClick={() => deleteSlot(index)} />
                    </div>
                ))}

                <div className="flex">
                    <div onClick={addSlot} className="flex gap-2 items-center text-zikoroBlue cursor-pointer">
                        <PlusCircle size={18} />
                        <p>Add Time</p>
                    </div>
                </div>
            </div>

            <p className="text-red-500 text-sm h-3 text-center w-full">{error}</p>
        </div>

        <button type='submit' className='bg-basePrimary rounded-md p-3  text-center w-full text-white' >{loading?'Submiting...':'Apply'}</button>
    </form>
  );
};

export default TimePicker;

function generateAppointmentTime({ time, selectedDate }: BookingInput): string | null {
  if (!time) {
    return null;
  }

  const appointmentDateTime = parse(`${selectedDate} ${time}`, 'yyyy-MM-dd hh:mm a', new Date());

  if (!isValid(appointmentDateTime)) {
    console.error("Invalid time format:", time);
    return null;
  }

  return format(appointmentDateTime, 'yyyy-MM-dd HH:mm:ss');
}
