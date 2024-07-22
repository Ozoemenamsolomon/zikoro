'use client'

import { AppointmentFormData, AppointmentLink, Booking } from '@/types/appointments'
import { DatePicker } from '@mui/x-date-pickers'
import React , { useEffect, useState } from 'react'
import Slots from './Slots'

import {
	add,
	eachDayOfInterval,
	endOfMonth,
	format,
	getDay,
	isEqual,
	isSameMonth,
	isToday,
	parse,
	isBefore,
	startOfToday,startOfDay,  addDays, 
} from 'date-fns';
import {  ChevronLeft, ChevronRight } from 'lucide-react'
import { SelectInput } from '../ui/CustomSelect'
import { useAppointmentContext } from '../context/AppointmentContext'
import DetailsForm from './DetailsForm'
import { Category } from '../create/CategoryForm'
import SelectOnly from '../ui/SeectInput'

function classNames(...classes: (string | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
export interface TimeDetail {
    day: string;
    from: string;
    to: string;
    enabled: boolean;
}
interface Slot {
    label: string;
    value: string;
  }
export interface SlotsResult {
selectDay: string;
slots: Slot[];
}
  interface CalendarProps {
    appointmnetLink: AppointmentLink | null;
    fetchingData: boolean;
  }

  
const Calender: React.FC<CalendarProps> = ({ appointmnetLink, fetchingData }) => {
    const [slotsLoading, setSlotsLoading] = useState(true)
    const {isFormUp} = useAppointmentContext()
    const {bookingFormData, setBookingFormData} = useAppointmentContext()

    let today = startOfToday();
    let [selectedDay, setSelectedDay] = useState<Date>();
    let [timeSlots, setTimeSlots] = useState<SlotsResult | null >(null);
	
    function getEnabledTimeDetails(): TimeDetail[] {
        if (!appointmnetLink || !appointmnetLink.timeDetails) {
          return [];
        }
        try {
          const timeDetails: TimeDetail[] = JSON.parse(appointmnetLink.timeDetails);
          const enabledItems: TimeDetail[] = timeDetails.filter(item => item.enabled);
          return enabledItems;
        } catch (error) {
          console.error('Failed to parse timeDetails:', error);
          return [];
        }
      }

    // Determine disabled days from the appointmentLink/timeDetails
    const isDayDisabled = (day: Date): boolean => {
        const enabledDays = getEnabledTimeDetails()
        const dayOfWeek = new Date(day).getDay();
        const daysMap: { [key: number]: string } = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
        };

		// Disable days before today
		const startOfDayToCheck = startOfDay(day);
		if (isBefore(startOfDayToCheck, startOfToday())) {
			return true
		}
        // Check if the day is enabled
        const dayName = daysMap[dayOfWeek];
        const isDayEnabled = enabledDays.some(item => item.day === dayName && item.enabled);

        return !isDayEnabled;
	  };

    // mount booked slots for the selected date
    useEffect(() => {
        if(!selectedDay && appointmnetLink){
            const nextAvailableDay = findNextAvailableDay(appointmnetLink?.timeDetails);
            const nextAvailableDate = new Date(nextAvailableDay.date);
            setSelectedDay(nextAvailableDate);
        } else if(selectedDay) {
            const selectedTimeSlots = generateSlots(
                getEnabledTimeDetails(), appointmnetLink?.duration!, appointmnetLink?.sessionBreak || 1, selectedDay)

                setTimeSlots(selectedTimeSlots)
                setSlotsLoading(false)
        }

    }, [selectedDay, appointmnetLink]);

    let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
	let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

	let days = eachDayOfInterval({
		start: firstDayCurrentMonth,
		end: endOfMonth(firstDayCurrentMonth),
	});

	function previousMonth() {
		let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
		setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
	}

	function nextMonth() {
		let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
		setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
	}

  const normalizedSelectedDay = startOfDay(selectedDay!);

  const appointmentTypeJson: Category[] = JSON.parse(appointmnetLink?.category || `[]`);

  const appointmentTypes: { label: string, value: string }[] = appointmentTypeJson ?
    appointmentTypeJson.map((item: Category) => ({
      label: item.name || '',
      value: item.name || '',
    }))
    : [];

  // useEffect(() => {
  //   setBookingFormData((prev) => ({
  //       ...prev,
  //       appointmentType: appointmentTypeJson[0]?.name || '',
  //     }));
  //   }, []);

    useEffect(() => {
      if(!bookingFormData?.appointmentType){
        const selectedAppointmentType = appointmentTypeJson.find((item: Category) => item.name === bookingFormData?.appointmentType) || appointmentTypeJson[0];
        setBookingFormData((prev) => ({
          ...prev,
          appointmentType: appointmentTypeJson[0]?.name || '',
          price: selectedAppointmentType?.amount || appointmnetLink?.amount,
          currency: selectedAppointmentType?.curency || appointmnetLink?.curency || '',
        }));
        console.log('aaaaaaa', {bookingFormData})
      } else {
        if (appointmentTypeJson.length) {
          const selectedAppointmentType = appointmentTypeJson.find((item: Category) => item.name === bookingFormData?.appointmentType) || appointmentTypeJson[0];
          setBookingFormData((prev) => ({
            ...prev,
            price: selectedAppointmentType.amount,
            currency: selectedAppointmentType.curency,
          }));
        }
        console.log('bbbbbbb', {bookingFormData, appointmentTypeJson})
      }
    // Add `appointmentTypeJson` and `bookingFormData.appointmentType` as dependencies to avoid infinite loops
  }, [ bookingFormData?.appointmentType]);

  return (
    <>
    {
    isFormUp ?
        <DetailsForm appointmentLink={appointmnetLink}/>
        :
        <div className="w-full md:h-[70vh] gap-6 max-sm:space-y-6 sm:flex ">
            <div className=" bg-white  sm:w-3/5 p-4 rounded-lg  flex-shrink-0 ">

                {appointmnetLink?.category ? 
                <div className="w-full pb-6 space-y-1">
                    <h5  className='font-semibold text-lg'>Select meeting category</h5  >
                    <SelectOnly
                        name='appointmentType'
                        value={bookingFormData?.appointmentType || ''}
                        options={appointmentTypes}
                        setFormData={setBookingFormData}
                        className='w-10/12 z-30'
                    />
                </div> : null}

                <p className='pb-1 font-semibold text-lg'>Select day</p>

                <div className="shadow-md border rounded-lg border-gray-200/50 pt-6 py-4">
                    <div className="flex  items-center w-full justify-between gap-4 px-4">
                        <div>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className=" p-1.5 text-gray-400 hover:text-gray-600">
                                {/* <span className="">Previous month</span> */}
                                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                        <h5 className=" ">
                            {format(firstDayCurrentMonth, 'MMMM yyyy')}
                        </h5>
                        <div>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className=" p-1.5 text-gray-400 hover:text-gray-600">
                                {/* <span className="">Next month</span> */}
                                <ChevronRight className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className=" grid grid-cols-7 mt-6 text-xs leading-6 text-center text-gray-500">
                        <div>S</div>
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                    </div>

                    <div className="grid grid-cols-7 mt-2 text-sm">
                        {days.map((day, dayIdx) => {
                            const normalizedDay = startOfDay(day);
                            return <div
                                key={day.toString()}
                                className={classNames(
                                    dayIdx === 0 && colStartClasses[getDay(day)],
                                    'py-1.5',
                                )}>
                                <button
                                    type="button"
                                    disabled={isDayDisabled(day)}
                                    onClick={() => {
                                        setSelectedDay(day)
                                        setBookingFormData({
                                            ...bookingFormData,
                                            appointmentDate: format(day, 'yyyy-MM-dd'),
                                        })
                                    }}
                                    className={classNames(
                                        isEqual(normalizedDay, normalizedSelectedDay) && 'text-white',
                                        !isEqual(normalizedDay, normalizedSelectedDay) &&
                                            isToday(normalizedDay) &&
                                            ' font-bold',
                                        !isEqual(normalizedDay, normalizedSelectedDay) &&
                                            !isToday(normalizedDay) &&
                                            isSameMonth(normalizedDay, firstDayCurrentMonth) &&
                                            'text-gray-90',
                                        !isEqual(normalizedDay, normalizedSelectedDay) &&
                                        !isSameMonth(normalizedDay, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                        
                                        // isEqual(day, selectedDay) && isToday(day) && 'bg-orange-500',
                                        isEqual((normalizedDay), normalizedSelectedDay)  && 'bg-zikoroBlue ',
                                        !isEqual(normalizedDay, normalizedSelectedDay) && 'hover:bg-gray-200',
                                        isDayDisabled(normalizedDay) && 'disabled text-gray-300 cursor-not-allowed',
                                        (isEqual(normalizedDay, normalizedSelectedDay) || isToday(normalizedDay)) &&
                                            'font-bold',
                                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full ',
                                    )}>
                                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                                        {format(day, 'd')}
                                    </time>
                                </button>
                            </div>
                        })}
                    </div>
                </div>
            </div>

            {
                slotsLoading ?
                <div className="bg-white  md:w-80 flex-1 flex-shrink-0 p-4 rounded-lg w-full flex justify-center items-center">loading...</div>
                :
                <Slots appointmnetLink={appointmnetLink} selectedDate={selectedDay} timeSlots={timeSlots} />
            }
        </div>
    }
    </>
    )
}

export default Calender

// Convert time in "HH:MM AM/PM" format to minutes since midnight
const convertTimeToMinutes = (time: string): number => {
  const [hoursMinutes, period] = time.split(' ');
  let [hours, minutes] = hoursMinutes.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

// Convert minutes since midnight to "HH:MM AM/PM" format
const convertMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = mins < 10 ? `0${mins}` : mins;

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

// Format a time string to 'HH:mm:ss' using a selected date
function formatTimeString(startTime: string, selectedDate: Date): string {
  const parsedTime = parse(startTime, 'h:mm a', new Date(selectedDate));
  const formattedTime = format(parsedTime, 'HH:mm:ss');
  return formattedTime;
}

// Generate slots for a given day, time range, duration, and session break
export const generateSlots = (
  timeRanges: TimeDetail[],
  duration: number,
  sessionBreak: number,
  selectedDay: Date
): SlotsResult | null => {
  const slots: Slot[] = [];

  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = selectedDay && daysOfTheWeek[selectedDay.getDay()];

  const selectedRange = timeRanges.find(range => range.day.toLowerCase() === dayName.toLowerCase() && range.enabled);

  if (!selectedRange) {
    return null;
  }

  const startMinutes = convertTimeToMinutes(selectedRange.from);
  const endMinutes = convertTimeToMinutes(selectedRange.to);
  let currentStart = startMinutes;

  while (currentStart + duration <= endMinutes) {
    const slotStart = convertMinutesToTime(currentStart);
    const slotEnd = convertMinutesToTime(currentStart + duration);

    const slotStartValue = formatTimeString(slotStart, selectedDay);

    slots.push({
      label: `${slotStart} - ${slotEnd}`,
      value: slotStartValue,
    });

    currentStart += duration + sessionBreak;
  }

  return {
    selectDay: format(selectedDay, 'yyyy-MM-dd'),
    slots,
  };
};


interface Schedule {
  day: string;
  from: string;
  to: string;
  enabled: boolean;
}

const findNextAvailableDay = (scheduleJson: string): Schedule & { date: string } => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const today = startOfToday();
  const todayDayOfWeek = getDay(today);

  const schedule: Schedule[] = JSON.parse(scheduleJson);

  // Check if today is enabled or find the next enabled day
  for (let i = 0; i < 7; i++) {
    const currentDayIndex = (todayDayOfWeek + i) % 7;
    const currentDay = daysOfWeek[currentDayIndex];

    const scheduleForCurrentDay = schedule.find(s => s.day === currentDay && s.enabled);

    if (scheduleForCurrentDay) {
      const nextDate = addDays(today, i);
      return { ...scheduleForCurrentDay, date: format(nextDate, 'yyyy-MM-dd') };
    }
  }

  // If no day is enabled, return the first available day in the schedule with the calculated date
  const firstEnabledDay = schedule.find(s => s.enabled) || schedule[0];
  const firstEnabledDayIndex = daysOfWeek.indexOf(firstEnabledDay.day);
  const daysUntilNextOccurrence = (firstEnabledDayIndex - todayDayOfWeek + 7) % 7;
  const nextDate = addDays(today, daysUntilNextOccurrence);

  return { ...firstEnabledDay, date: format(nextDate, 'yyyy-MM-dd') };
};

let colStartClasses = [
	'',
	'col-start-2',
	'col-start-3',
	'col-start-4',
	'col-start-5',
	'col-start-6',
	'col-start-7',
];