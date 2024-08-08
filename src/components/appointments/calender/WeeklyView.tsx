import { useEffect, useState, useMemo } from 'react';
import {
    startOfWeek,
    addDays,
    format,
    isSameDay,
    parseISO,
    getHours,
    getMinutes,
    differenceInMinutes,setHours, setMinutes, setSeconds,
    getDay,eachHourOfInterval,endOfWeek,eachDayOfInterval,parse
} from 'date-fns';
import { Booking } from '@/types/appointments';
import { Clock, MoreVertical } from 'lucide-react';

interface WeeklyViewProps {
    appointments: Record<string, Record<number, Booking[]>>;
    currentDate: Date;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ appointments, currentDate }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); 
    const endDate = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: endDate });
    const hours = eachHourOfInterval({ start: new Date().setHours(0, 0, 0, 0), end: new Date().setHours(23, 59, 59, 999) });

    // Displaying current time
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(intervalId); // Clean up on component unmount
    }, []);

    const currentTimePosition = useMemo(() => {
        const currentHour = getHours(currentTime);
        const currentMinutes = getMinutes(currentTime);
        return (currentHour + currentMinutes / 60) * 6; // 6rem per hour
    }, [currentTime]);

    const shouldHideTime = useMemo(() => {
        const currentMinutes = getMinutes(currentTime);
        return (currentMinutes >= 55 && currentMinutes < 60) || (currentMinutes >= 0 && currentMinutes < 22);
    }, [currentTime]);

    return (

        <section className="sticky top-0 pb-10 ">
             {/* First row with days */}
            <div className="flex flex-nowrap gap-0 text-xs sm:text-sm lg:text-base">
                <div className="w-12 sm:w-20 shrink-0 pt-2 flex justify-center items-center h-full text-slate-300 ">
                    <Clock />
                </div>

                <div className="w-full grid grid-cols-7 ">
                    {days.map((day, idx) => {
                        const today = format(new Date(), 'eee dd')
                        const active = today === format(day, 'eee dd')
                        return (
                        <div key={idx} className={`  overflow-hidden border p-2 text-center bg-slate-100 ${idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''}`}>
                            <h3 className={`${active ? 'bg-zikoroBlue text-white':''} text font-medium py-1 rounded-md px-2 `}>{format(day, 'eee dd')}</h3>
                        </div>
                    )})}
                </div>
            </div>


            <div className="h-screen flex flex-nowrap gap-0 overflow-auto no-scrollbar relative">
                {/* current time display */}
                <div
                    className="absolute top-0  w-full left-0 flex flex-nowrap gap-0"
                    style={{ top: `${currentTimePosition }rem` }}
                >
                    <div className="w-12 sm:w-20 shrink-0 text-right relative ">
                        <p className={`${shouldHideTime ? 'hidden' : ''} absolute   -top-2 text-zikoroBlue right-2 text-[8px] sm:text-[12px] text-right  `}>
                            {format(currentTime, 'hh:mm aa')}
                        </p>
                    </div>
                    <div className="w-full relative">
                        <div className="h-2 w-2 bg-zikoroBlue rounded-full shrink-0 absolute z-10 -top-1 left-0"></div>
                        <hr className="left-0 w-full border-zikoroBlue" />
                    </div>
                </div>

                {/* hours grid at the left*/}
                <div className="w-12 sm:w-20 shrink-0 text-xs sm:text-sm lg:text-base">
                    {hours.map((hour, index) => (
                        <div key={index} className="flex w-full justify-center h-24 shrink-0 pr-2 ">
                        <h4 className=" font-medium">{format(hour, 'h a')}</h4>
                    </div>
                    ))}
                </div>

                <div className="w-full grid grid-cols-7 border-r">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = addDays(weekStart, dayIndex);
                    const dayString = format(day, 'eee MMM dd yyyy');
                    const record = appointments[dayString] as Record<number, Booking[]> | undefined;
                    const newList = record && Object.entries(record).flatMap(([key, value]) => {
                    if (Array.isArray(value)) {
                        
                        const [startTimeString, endTimeString] = value[0]?.appointmentTimeStr?.split(' - ')!;

                        const eventStart = combineDateAndTime(value[0]?.appointmentDate as string, startTimeString);
                        const eventEnd = combineDateAndTime(value[0]?.appointmentDate as string, endTimeString);

                        return {
                            timeStr: value[0].appointmentTimeStr,
                            eventStart,
                            eventEnd,
                            data: value,
                            id: value[0].id,
                        };
                    } else {
                        return [];
                    }
                    });

                    console.log({ record, newList, appointments });
                    return (
                        <div key={dayIndex} className="grid  border-l  relative">
                            
                                {hours.map((hour, index) => {
                                    return (<div key={index} className="h-24  border-b text-right pr-2">
                                    </div>)
                                })}

                                <div className="absolute w-full top-0">
                                    {newList?.map((event, idx) => {
                                        const eventStart = parseISO(event.eventStart);
                                        const eventEnd = parseISO(event.eventEnd);

                                        if (isSameDay(eventStart, day)) {
                                            const startHour = getHours(eventStart);
                                            const startMinutes = getMinutes(eventStart);
                                            const eventDuration = differenceInMinutes(eventEnd, eventStart);

                                            return (
                                                <div
                                                    key={idx}
                                                    className="absolute left-0 w-full px-1 leading-tight"
                                                    style={{
                                                        top: `${(startHour + startMinutes / 60) * 6}rem`,
                                                        height: `${(eventDuration / 60) * 6}rem`,
                                                        // borderColor: item?.scheduleColour
                                                    }}
                                                >
                                                    <div className=" w-full h-full flex flex-col justify-between overflow-auto no-scrollbar rounded-lg p-1 bg-slate-50 shadow-md border-t-2"
                                                    style={{
                                                        borderColor: event.data[0].scheduleColour!
                                                    }}>
                                                        <div className="sm:text-[10px] text-[8px] whitespace-nowrap">
                                                            {
                                                                event.data?.map((item, idx) => (
                                                                    <div key={idx} className="flex flex-1 overflow-auto no-scrollbar justify-between gap-2">
                                                                        <div className="whitespace-nowrap w-full flex-nowrap">
                                                                            <p className="whitespace-nowrap font-semibold capitalize">{item?.firstName + ' ' + item?.lastName}</p>
                                                                            <p className="whitespace-nowrap">{item?.appointmentName}</p>
                                                                        </div>
                                                                        <button><MoreVertical size={10} /></button>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>

                                                        <div className="sm:text-xs text-[8px]">{event?.timeStr}</div>
                                                    </div>
                                                    
                                                </div>
                                            );
                                        }

                                        return null;
                                    })}
                                </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </section>
    );
};

export default WeeklyView;



const combineDateAndTime = (dateString: string, timeString: string): string => {
    // Parse the date string into a Date object
    let date = parseISO(dateString);

    // Parse the time string into hours and minutes using 'date-fns/parse'
    const parsedTime = parse(timeString, 'hh:mm aa', new Date());

    // Set the hours and minutes on the date
    date = setHours(date, parsedTime.getHours());
    date = setMinutes(date, parsedTime.getMinutes());
    date = setSeconds(date, 0);

    // Return the combined date as an ISO string
    return date.toISOString();
};



