'use client'

import { AppointmentLink, Booking } from '@/types/appointments'
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
	startOfToday,startOfDay,
} from 'date-fns';
import {  ChevronLeft, ChevronRight } from 'lucide-react'
import { SelectInput } from '../ui/CustomSelect'
import { useAppointmentContext } from '../context/AppointmentContext'
import DetailsForm from './DetailsForm'

function classNames(...classes: (string | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
interface TimeDetail {
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
export interface BookingFormData {
    appointmentLinkId: number | null;
    participantEmail: string | null;
    appointmentDate: string | null; 
    appointmentTime: string | null;  
  }
  interface CalendarProps {
    appointmnetLink: AppointmentLink | null;
    fetchingData: boolean;
  }
  
  const Calender: React.FC<CalendarProps> = ({ appointmnetLink, fetchingData }) => {

    const {isFormUp} = useAppointmentContext()
    const {bookingFormData, setBookingFormData} = useAppointmentContext()

    let today = startOfToday();
	let [selectedDay, setSelectedDay] = useState<Date>(today);
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
        // Generate time slots
        const selectedTimeSlots = generateSlots(
            getEnabledTimeDetails(), appointmnetLink?.duration!, appointmnetLink?.sessionBreak || 1, selectedDay)

        console.log({selectedTimeSlots})
        setTimeSlots(selectedTimeSlots)
    }, [selectedDay ]);

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

	// function previousDay() {
	// 	const previousDay = add(selectedDay, { days: -1 });
	// 	setSelectedDay(previousDay);
	// 	setCurrentMonth(format(previousDay, 'MMM-yyyy'));
	// }

	// function nextDay() {
	// 	const nextDay = add(selectedDay, { days: 1 });
	// 	setSelectedDay(nextDay);
	// 	setCurrentMonth(format(nextDay, 'MMM-yyyy'));
	// }
    
    const [categories, setCategories] = useState({
        category: 'Training 2'
    })

  return (
    isFormUp ?
        <DetailsForm appointmentLink={appointmnetLink}/>
        :
        <div className=" w-full gap-6 max-sm:space-y-6 sm:flex ">
            <div className=" bg-white  sm:w-3/5 p-4 rounded-lg  flex-shrink-0 ">

                <div className=" pb-6 space-y-1">
                    <p>Select meeting category</p>
                    <SelectInput
                        name='category'
                        value={categories?.category}
                        options={
                            [
                                {label: 'Training', value: 'Training'},
                                {label: 'Training 2', value: 'Training 2'},
                                {label: 'Training 3', value: 'Training 3'},
                                {label: 'Training 4', value: 'Training 5'},
                            ]
                        }
                        setFormData={setCategories}
                        className='w-4/5 z-30'
                    />
                </div>

                <p className='pb-1'>Select day</p>

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
                                            appointmentDate: format(day, 'yyyy-MM-dd')
                                        })
                                    }}
                                    className={classNames(
                                        isEqual(day, selectedDay) && 'text-white',
                                        !isEqual(day, selectedDay) &&
                                            isToday(day) &&
                                            ' font-bold',
                                        !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-90',
                                        !isEqual(day, selectedDay) &&
                                        !isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                        
                                        // isEqual(day, selectedDay) && isToday(day) && 'bg-orange-500',
                                        isEqual(day, selectedDay)  && 'bg-zikoroBlue ',
                                        !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                                        isDayDisabled(day) && 'disabled text-gray-400 cursor-not-allowed',
                                        (isEqual(day, selectedDay) || isToday(day)) &&
                                            'font-bold',
                                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
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

            <Slots appointmnetLink={appointmnetLink} selectedDate={selectedDay} timeSlots={timeSlots} />
        </div>
        
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
const generateSlots = (
  timeRanges: TimeDetail[],
  duration: number,
  sessionBreak: number,
  selectedDay: Date
): SlotsResult | null => {
  const slots: Slot[] = [];

  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfTheWeek[selectedDay.getDay()];

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

let colStartClasses = [
	'',
	'col-start-2',
	'col-start-3',
	'col-start-4',
	'col-start-5',
	'col-start-6',
	'col-start-7',
];