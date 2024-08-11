import { Moon } from '@/constants';
import { timezones as Timezones } from '@/constants/timezones';
import { AppointmentFormData,  } from '@/types/appointments';
import React, { useEffect, useState } from 'react';
import { SelectInput } from './CustomSelect';
import { format } from 'date-fns';

export const generateTimeOptions = () => {
  const times: string[] = [];
  for (let i = 0; i < 24; i++) {
    const date = new Date(0, 0, 0, i);
    times.push(format(date, 'hh:mm a'));
    date.setMinutes(30);
    times.push(format(date, 'hh:mm a'));
  }
  return times;
};
  
const timeOptions = generateTimeOptions();
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", ];
const timezones = Timezones;

export interface DaySchedule {
  day: string;
  from: string;
  to: string;
  enabled: boolean;
}
interface DateTimeScheduler {
    setFormData: any;
    formData: AppointmentFormData;
    errors?:AppointmentFormData;
  }

const DateTimeScheduler = ({setFormData,errors,formData}:DateTimeScheduler) => {
  useEffect(() => {
    formData?.timeDetails
  }, [formData?.timeDetails])
  
  const handleToggleDay = (day: string) => {
    setFormData({
      ...formData,
      timeDetails: formData.timeDetails.map((schedule => (
        schedule.day === day ? { ...schedule, enabled: !schedule.enabled } : schedule
      )))
    })
  };

  const handleTimeChange = (day: string, type: "from" | "to", value: string) => {
    setFormData({
        ...formData,
        timeDetails: formData.timeDetails.map(schedule => (
            schedule.day === day ? { ...schedule, [type]: value } : schedule
          ))
      })
  };

  const Unavailable = 0

  return (
    <div className="w-full">
      <div className="pb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">Select Timezone</label>
        <SelectInput 
          options={timezones}
          name='timeZone'
          error={errors?.timeZone}
          value={formData?.timeZone  }
          // value={formData?.timeZone || timezones[12].value}
          setFormData={setFormData}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {formData.timeDetails.map((schedule, idx) => (
            <div key={idx}  className="grid grid-cols-3 gap-6 mb-2">
                <div className="col-span-1 flex w-full gap-2 items-center">
                    <div
                        className={` flex-shrink-0 ${schedule.enabled ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-gray-300 ring-2 ring-gray-300'} mr- w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer `}
                        onClick={() => handleToggleDay(schedule.day)}
                    >   
                        <div className="flex w-full justify-between font-semibold text-[9px]"> <p className='text-white'>ON</p><p className='text-gray-50'>OFF</p>  </div>
                        <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${schedule.enabled ? 'translate-x-7' : ''}`}></div>
                    </div>
                    <label className="text- font-medium text-gray-700">{schedule.day}</label>
                </div>
            
                {
                  schedule.enabled ?
                  <div className=" col-span-2 grid w-full grid-cols-2 gap-2">
                    <div className='p-2 py-3 w-full border rounded-md flex  items-center'>
                        <label className=" text-gray-70 text-sm">From</label>
                        <select
                        disabled={!schedule?.enabled}
                        className=" w-full focus:outline-none text-sm"
                        value={schedule.from || ''}
                        onChange={(e) => handleTimeChange(schedule.day, 'from', e.target.value)}
                        >
                        {/* <option value="" disabled>Select time</option> */}
                        {timeOptions.map((time, idx) => (
                            <option key={idx} value={time}>{time}</option>
                        ))}
                        </select>
                    </div>

                    <div className='p-2 border rounded-md flex gap-4 items-center'>
                        <label className=" text-gray-70 text-sm">To</label>
                        <select
                        disabled={!schedule?.enabled}
                        className=" w-full focus:outline-none text-sm"
                        value={schedule.to || ''}
                        onChange={(e) => handleTimeChange(schedule.day, 'to', e.target.value)}
                        >
                        {/* <option value="" disabled>Select time</option> */}
                        {timeOptions.map((time, idx) => (
                            <option key={idx} value={time}>{time}</option>
                        ))}
                        </select>
                    </div>
                </div>
                :
                <div className="col-span-2 p-2  bg-gray-500/10 border-gray-300 border rounded-lg w-full flex gap-4 items-center text-xl text-gray-500">
                  <Moon /><p>Unavailable</p>
                </div>
                }
            </div>
        ))}

      </div>
    </div>
  );
};

export default DateTimeScheduler;
