import React, { useEffect, useState } from 'react';
import { AppointmentUnavailability, Booking } from '@/types/appointments';
import { PlusCircle, Trash } from 'lucide-react';
import { generateTimeOptions } from '../ui/DateTimeScheduler';
import toast from 'react-hot-toast';
import { format, isValid, parse, parseISO } from 'date-fns';
import { useGetUnavailableDates } from '@/hooks';
import { useAppointmentContext } from '../context/AppointmentContext';

const timeOptions = generateTimeOptions();
// 2024-07-16
interface BookingInput {
  time: string;
  selectedDate: Date | string | null;
}

const TimePicker = ({ booking, isOpen,dayString, unavailableDates }: { dayString:string, booking: Booking, isOpen:string , unavailableDates:AppointmentUnavailability[]}) => {
  const { user } = useAppointmentContext();
  const {  isLoading, error: fetchError, getUnavailableDates } = useGetUnavailableDates(user?.id!);

  const [slot, setSlot] = useState<{ from: string, to: string }>({ from: '', to: '' });
  const [slotList, setSlotList] = useState<{ from: string, to: string, id: bigint|number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const filteredSlots = unavailableDates
      .filter(item => format(new Date(item.appointmentDate!), 'yyyy-MM-dd') === format(new Date(dayString), 'yyyy-MM-dd'))
      .map((item: AppointmentUnavailability) => ({
        from: format(item?.startDateTime!, 'hh:mm a'),
        to: format(item?.endDateTime!, 'hh:mm a'),
        id: item?.id!,
        appointmentDate: format(item?.appointmentDate!, 'eee MMM dd yyyy'),
      }));
    setSlotList(filteredSlots);
    console.log({isLoading, filteredSlots,unavailableDates, d:format(new Date(dayString), 'yyyy-MM-dd'), p:format(new Date(unavailableDates[0].appointmentDate!), 'yyyy-MM-dd'), c:unavailableDates
      .filter(item => format(new Date(item.appointmentDate!), 'yyyy-MM-dd') === format(new Date(dayString), 'yyyy-MM-dd'))})

  }, [unavailableDates, isOpen]);
  

  const handleTimeChange = ( field: 'from' | 'to', value: string) => {
    setSlot(prev=>({...prev, [field]:value}));
    if(field === 'from'){
      setSlot(prev=>({...prev, to:''}))
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('')
    if ( !slot.from || !slot.to) {
      setError('Please fill out all time slots.');
      return;
    }

    const formData  = {
      startDateTime: generateAppointmentTime({ time: slot.from, selectedDate: format(dayString, 'yyyy-MM-dd') }),
      endDateTime: generateAppointmentTime({ time: slot.to, selectedDate: format(dayString, 'yyyy-MM-dd') }),
      createdBy: user?.id!,
      appointmentDate: format(dayString, 'yyyy-MM-dd'),
    } 
    if (formData?.startDateTime! >= formData?.endDateTime!){
      setError('Select accurate time range.');
      return;
    }

try {
      console.log({formData},'==========',parse(`${dayString} ${slot.to}`, 'yyyy-MM-dd hh:mm a', new Date()) >= parse(`${dayString} ${slot.from}`, 'yyyy-MM-dd hh:mm a', new Date()))
      console.log({formData})
      setLoading(true);
      const response = await fetch('/api/appointments/calender/addunavailability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([formData])
      });

      const result = await response.json();
      console.log('Form submitted:', result);
console.log({result})
      if (!response.ok) {
        setError('Failed to submit form. Please try again.');
      } else {
        toast.success('Form submitted');
        setSlot({ from: '', to: '' });
        setSlotList(prev=>[...prev, {
          from: slot.from,
          to: slot.to,
          id: new Date().getMilliseconds(),
        }])
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = async (item: AppointmentUnavailability) => {
    
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/appointments/calender/deleteUnavailability?id=${item?.id}&userId=${user?.id!}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setError('Failed to delete item. Please try again.');
      } else {
        toast.success('Deletion Successful');
        setSlotList(slotList.filter(slot => slot.id !== item.id));
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // const addSlot = () => {
  //   setSlots(prev => [...prev, { from: '', to: '' }]);
  //   setError(null);
  // };
  return (
    <form onSubmit={handleSubmit}>
      <div className="border rounded-md border-zikoroBlue px-3 py-4 mb-4">
        <div className="bg-purple-100 rounded-md p-3 text-center mb-4">
          <h6 className="text-base font-medium">Edit unavailability</h6>
          <p className="text-sm">Add time when you will be unavailable today</p>
        </div>

        <div className="space-y-2 max-h-96 overflow-auto no-scrollbar">
           
            <div  className="flex px-4 justify-center gap-3 items-center w-full">
              <div className="flex h-10 w-32 justify-center items-center  bg-purple-100 rounded-md shrink-0">
                <select
                  className="bg-transparent no-scrollbar border-none focus:outline-none"
                  value={slot.from}
                  onChange={(e) => handleTimeChange('from', e.target.value)}
                  required
                >
                  <option value="" disabled>Start time</option>
                  {timeOptions.map((time: string, idx: number) => {
                    const exists = !!slotList.find(item => item.from === time);
                    return (
                      <option key={idx} value={time} disabled={exists}>{time}</option>
                    );
                  })}
                </select>
              </div>
              <hr className='w-4 border-gray-700'/>
              <div className="flex h-10 w-32 justify-center items-center  bg-purple-100 rounded-md shrink-0 ">
                <select
                  className="bg-transparent no-scrollbar border-none focus:outline-none"
                  value={slot.to}
                  onChange={(e) => handleTimeChange('to', e.target.value)}
                  required
                >
                  <option value="" disabled>End time</option>
                  {timeOptions.map((time: string, idx: number) => {
                    const exists = !!slotList.find(item => item.from === time);
                    const lessThanStart = 
                        generateAppointmentTime({ time: time, selectedDate: format(dayString, 'yyyy-MM-dd') })! <=
                        generateAppointmentTime({ time: slot.from, selectedDate: format(dayString, 'yyyy-MM-dd') })!
                    return (

                      <option key={idx} value={time} disabled={exists || lessThanStart}>{time}</option>
                    );
                  })}
                </select>
              </div>
              <Trash size={18}  className='opacity-0'/>
            </div>
           

          {isLoading ? (
            <p className="p-3 text-center w-full">Checking for data...</p>
          ) : (
            slotList.map((slot, idx) => (
               (
                <div key={idx} className="flex px-4 justify-between gap-3 items-center w-full">
                  <div className="flex h-10 w-32 justify-center items-center  bg-purple-100 rounded-md shrink-0">{slot.from}</div>
                  <hr className='w-4 border-gray-700'/>
                  <div className="flex h-10 w-32 justify-center items-center  bg-purple-100 rounded-md shrink-0">{slot.to}</div>
                  <Trash size={18} onClick={() => deleteSlot(slot)} />
                </div>
              )
            ))
          )}

          {/* <div className="flex">
            <div onClick={addSlot} className="flex gap-2 items-center text-zikoroBlue cursor-pointer">
              <PlusCircle size={18} />
              <p>Add Time</p>
            </div>
          </div> */}
        </div>

        <p className="text-red-500 text-sm h-3 text-center w-full">{error}</p>
      </div>

      <button type="submit" className="bg-basePrimary rounded-md p-3 text-center w-full text-white">
        {loading ? 'Submitting...' : 'Apply'}
      </button>
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
