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
import { ArrowLeft, ArrowRight, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import { SelectInput } from '../ui/CustomSelect'
import SubmitBtn from './SubmitBtn'
import { supabaseBrowserClient } from '@/utils/supabase/client'

function classNames(...classes: (string | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

interface TimeDetail {
    day: string;
    from: string;
    to: string;
    enabled: boolean;
}

export interface BookingFormData {
    appointmentLinkId: number | null;
    participantEmail: string | null;
    appointmentDate: string | null;  // ISO 8601 date string
    appointmentTime: string | null;  // HH:mm:ss format
  }
  
//   {
//     "id": 5,
//     "created_at": "2024-06-21T16:04:03.642942+00:00",
//     "appointmentName": "fift appointment",
//     "category": "Testing C",
//     "duration": 88,
//     "loctionType": "Virtual",
//     "locationDetails": "Google meet",
//     "timeZone": "(UTC+01:00) West Central Africa",
//     "timeDetails": "[{\"day\":\"Monday\",\"from\":\"08:00\",\"to\":\"\",\"enabled\":true},{\"day\":\"Tuesday\",\"from\":\"11:00 AM\",\"to\":\"\",\"enabled\":true},{\"day\":\"Wednesday\",\"from\":\"\",\"to\":\"\",\"enabled\":false},{\"day\":\"Thursday\",\"from\":\"\",\"to\":\"\",\"enabled\":false},{\"day\":\"Friday\",\"from\":\"\",\"to\":\"\",\"enabled\":false}]",
//     "curency": "USD",
//     "amount": 20,
//     "paymentGateway": "Stripe",
//     "maxBooking": 10,
//     "sessionBreak": 20,
//     "statusOn": true,
//     "note": "Growth mindset discussions and events. I am available for serious resasons only",
//     "appointmentAlias": "z5858jjhjpkdi3s",
//     "createdBy": 103,
//     "businessName": null,
//     "logo": null,
//     "brandColour": null,
//     "teamMembers": null,
//     "zikoroBranding": null
// }




const Calender = ({appointmnetLink}:{appointmnetLink:AppointmentLink}) => {
    let today = startOfToday();
	let [selectedDay, setSelectedDay] = useState<Date>(today);

	const [inactiveSlots, setInactiveSlots] = useState<Date[]>([])
	
	const [activeSlot, setActiveSlot] = useState<any>(null);
	const [active, setActive] = useState<number | null>(null)

    const [slotLoading, setSlotLoading] = useState<boolean>(false)

    function getEnabledTimeDetails(): TimeDetail[] {
        const timeDetails: TimeDetail[] = JSON.parse(appointmnetLink.timeDetails);
        const enabledItems: TimeDetail[] = timeDetails.filter(item => item.enabled);
        return enabledItems;
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
    	const handleInactiveSlots = async () => {

    		try {
                setSlotLoading(true)
    			// TODO: filter based on appointmentDate and location
    			const { data, error } = await supabaseBrowserClient
    				.from('bookings') 
    				.select('*')  
    				.ilike('appointmentLinkId', `%${appointmnetLink?.id}%`)
    				.eq('appointmentDate', format(selectedDay, 'EEE dd MMM yyyy')) 
    				console.log({ data, error, dtae: format(selectedDay, 'EEE dd MMM yyyy') });
    
    			if (data) {
    				const bookingList = data.map(item => new Date(new Date(item?.appointmentDate).getTime() + 60 * 60 * 1000));
    
    				setInactiveSlots(bookingList);
    				// console.log('inactive slots', bookingList);
    			} else {
    				console.log({ data, error });
    			}
    		} catch (error) {
    			console.error('Error fetching inactive slots:', error);
    		} finally {
                setSlotLoading(false)
            }
    	};
    
    	handleInactiveSlots();
    }, [selectedDay, ]);

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

    // TODO: Get user data
    
    const [categories, setCategories] = useState({
        category: 'Training 2'
    })

    const [formData, setFormData] = useState<Booking>({
        appointmentLinkId: appointmnetLink?.id!,
        participantEmail: 'ecudeji@gmail.com',
        appointmentDate: null,
        appointmentTime: null,
      })


  return (
    <div className="w-full gap-6 max-sm:space-y-6 sm:flex ">
        
        {/* date picker */}
        
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
                                    setActiveSlot(null)
                                    setFormData({
                                        ...formData,
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


        {/* slots */}

        <div className="bg-white  md:w-80 flex-1 flex-shrink-0 p-4 rounded-lg  slots">

            <div className="grid gap-3">
                {
                    timeSlots?.map(({label,value},i)=>{
                    return (
                        <button key={i} 
                            type='button'
                            className={`${formData.appointmentTime===value ? 'bg-purple-100':'border'}  px-4 py-3 text-center rounded-md `}
                            onClick={()=>setFormData({
                                ...formData,
                                appointmentTime: value,
                            })}
                        > {label}</button>
                    )
                    })
                }
                <SubmitBtn formData={formData} setFormData={setFormData}/>
            </div>
            
        </div>

        {/* <Slots/> */}
    </div>
  )
}

export default Calender

// TODO: Generate timeslots

const timeSlots = [
        { label: "8:00am - 9:00am", value: new Date(new Date().setHours(8, 0, 0, 0)).toISOString() },
        { label: "9:00am - 10:00am", value: new Date(new Date().setHours(9, 0, 0, 0)).toISOString() },
        { label: "10:00am - 11:00am", value: new Date(new Date().setHours(10, 0, 0, 0)).toISOString() },
        { label: "11:00am - 12:00pm", value: new Date(new Date().setHours(11, 0, 0, 0)).toISOString() },
        { label: "12:00pm - 1:00pm", value: new Date(new Date().setHours(12, 0, 0, 0)).toISOString() },
        // { label: "1:00pm - 2:00pm", value: new Date(new Date().setHours(13, 0, 0, 0)).toISOString() },
        { label: "2:00pm - 3:00pm", value: new Date(new Date().setHours(14, 0, 0, 0)).toISOString() },
        { label: "3:00pm - 4:00pm", value: new Date(new Date().setHours(15, 0, 0, 0)).toISOString() },
        // { label: "4:00pm - 5:00pm", value: new Date(new Date().setHours(16, 0, 0, 0)).toISOString() },
        { label: "5:00pm - 6:00pm", value: new Date(new Date().setHours(17, 0, 0, 0)).toISOString() }
      ];
      
let colStartClasses = [
	'',
	'col-start-2',
	'col-start-3',
	'col-start-4',
	'col-start-5',
	'col-start-6',
	'col-start-7',
];