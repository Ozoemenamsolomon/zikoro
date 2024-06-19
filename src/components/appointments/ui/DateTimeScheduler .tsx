import { Moon } from '@/constants';
import { timezones as Timezones } from '@/constants/timezones';
import { AppointmentLink } from '@/types/appointments';
import React, { useEffect, useState } from 'react';
import { SelectInput } from './CustomSelect';


export const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = String(i).padStart(2, '0');
      times.push(`${hour}:00`, `${hour}:30`);
    }
    return times;
  };
  
const timeOptions = generateTimeOptions();
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", ];
const timezones = Timezones;

interface DaySchedule {
  day: string;
  from: string;
  to: string;
  enabled: boolean;
}
interface DateTimeScheduler {
    setFormData: any;
    formData: AppointmentLink;
  }
const DateTimeScheduler = ({setFormData,formData}:DateTimeScheduler) => {
    
  // const [timezone, setTimezone] = useState<string>(timezones[0].value);
  const [schedules, setSchedules] = useState<DaySchedule[]>(daysOfWeek.map(day => ({
    day,
    from: '',
    to: '',
    enabled: false
  })));

  useEffect(() => {
    setFormData({
        ...formData,
        timezone: timezones[0].value,
        timeDetails: daysOfWeek.map(day => ({
            day,
            from: '',
            to: '',
            enabled: false
          }))
      })
  }, [])
  

  const handleToggleDay = (day: string) => {
    setSchedules(schedules.map(schedule => (
      schedule.day === day ? { ...schedule, enabled: !schedule.enabled } : schedule
    )));
  };

  const handleTimeChange = (day: string, type: "from" | "to", value: string) => {
    setSchedules(schedules.map(schedule => (
      schedule.day === day ? { ...schedule, [type]: value } : schedule
    )));

    setFormData({
        ...formData,
        timeDetails: schedules.map(schedule => (
            schedule.day === day ? { ...schedule, [type]: value } : schedule
          ))
      })
  };
console.log({formData})
  return (
    <div className="w-full">
      <div className="pb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">Select Timezone</label>
        <SelectInput 
          options={timezones}
          name='timeZone'
          value={formData?.timeZone || timezones[12].value}
          setFormData={setFormData}
        />
        {/* <select
          className="block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-zikoroBlue "
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {timezones.map(({label,value}, idx) => (
            <option key={idx} value={value}>{label}</option>
          ))}
        </select> */}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {schedules.map((schedule, idx) => (
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
            
                <div className=" col-span-2 grid w-full grid-cols-2 gap-4">
                <div className='p-2 w-full border rounded-md flex gap-4 items-center'>
                    <label className=" text-gray-70">From</label>
                    <select
                    disabled={!schedule?.enabled}
                    className=" w-full focus:outline-none "
                    value={schedule.from || '10:00'}
                    onChange={(e) => handleTimeChange(schedule.day, 'from', e.target.value)}
                    >
                    {/* <option value="" disabled>Select time</option> */}
                    {timeOptions.map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                    ))}
                    </select>
                </div>

                <div className='p-2 border rounded-md flex gap-4 items-center'>
                    <label className=" text-gray-70">To</label>
                    <select
                    disabled={!schedule?.enabled}
                    className=" w-full focus:outline-none "
                    value={schedule.to || '10:00'}
                    onChange={(e) => handleTimeChange(schedule.day, 'to', e.target.value)}
                    >
                    {/* <option value="" disabled>Select time</option> */}
                    {timeOptions.map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                    ))}
                    </select>
                </div>
                </div>

            </div>
        ))}

        { ['Saturday', 'Sunday'].map((item)=><div key={item} className="grid grid-cols-3  items-center w-full gap-6">
            <div className="col-span-1 flex gap-2 items-center">
                <div className={` bg-gray-300 ring-2 ring-gray-300  w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer `} >   
                    <div className="flex w-full justify-between font-semibold text-[9px]"> <p className='text-white'>ON</p><p className='text-gray-50'>OFF</p>  </div>
                    <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform `}></div>
                </div>
                <p className="text-">{item}</p>
            </div>

            <div className="col-span-2 p-2  bg-gray-500/10 border-gray-300 border rounded-lg w-full flex gap-4 items-center text-xl text-gray-500">
               <Moon/><p>Unavailable</p>
            </div>
        </div>)}

        
      </div>
    </div>
  );
};

export default DateTimeScheduler;
