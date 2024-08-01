import { MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { AppointmentUnavailability, Booking } from '@/types/appointments';
import { cn } from '@/lib';
import Action from './Action';

interface MonthlyViewProps {
    appointments: Record<string, Booking[]>;
    currentMonth: Date;
    unavailableDates?:AppointmentUnavailability[]
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ appointments, currentMonth, }) => {
    const [isHovered, setIsHovered] = useState('')

    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Calculate the number of empty boxes needed before the first day of the month
    const startDay = getDay(startDate);

    return (
        <section className="text-xs sm:text-sm 2xl-text-base">
            <div className=" grid grid-cols-7 pb-3 text-slate-500">
                <div className='px-0.5 overflow-hidden'>Sunday</div>
                <div className='px-0.5 overflow-hidden'>Monday</div>
                <div className='px-0.5 overflow-hidden'>Tuesday</div>
                <div className='px-0.5 overflow-hidden'>Wednesday</div>
                <div className='px-0.5 overflow-hidden'>Thursday</div>
                <div className='px-0.5 overflow-hidden'>Friday</div>
                <div className='px-0.5 overflow-hidden'>Saturday</div>
            </div>

            <div className="grid grid-cols-7  ">
                {/* Render empty boxes before the first day of the month */}
                {Array.from({ length: startDay }).map((_, index) => (
                    <EmptyBox key={index} />
                ))}
                {days.map((day, dayIdx) => {
                    const dayString = format(day, 'eee MMM dd yyyy');
                    const list = appointments[dayString] || []
                    const today = format(new Date(), 'dd MM yyyy')
                    const active = today === format(day, 'dd MM yyyy')
                    return (
                        <div  key={dayString} 
                        onMouseEnter={()=>setIsHovered( dayString )}
                        onMouseLeave={()=>setIsHovered('')}
                        className="relative border bg-white p-2  w-full"
                        >
                            <div className={cn("flex flex-col justify-between h-32 overflow-hidden")}>
                               
                                <div className="flex justify-between shrink-0 gap-1 items-center pb-2">
                                    <time  dateTime={format(day, 'yyyy-MM-dd')}
                                    className={`${active ? 'bg-zikoroBlue text-white':''} h-6 w-6 rounded-full flex justify-center items-center font-medium `}>
                                        {format(day, 'd')}
                                    </time>
                                    {list?.length ? <p className="text-[8px] shrink-0 md:text-[12px]">{list.length + ' ' + 'appt.'}</p> : null}
                                </div>

                                {
                                    isHovered===dayString ? 
                                    <Action  appointment={list[0]} list={list} dayString={dayString}/> 
                                    :
                                    <div className="h-full flex flex-col gap-1 flex-start">
                                        {list?.length ? list?.slice(0,3)?.map(appointment => (
                                            <div key={appointment.id} className="flex  gap-1 items-center text-[10px] xl:text-sm">
                                                <div className="h-3 w-3 rounded shrink-0 "
                                                    style={{
                                                        backgroundColor: appointment?.appointmentLinkId?.brandColour
                                                    }}
                                                ></div>
                                                <p className=' flex-shrink-0  '>{appointment.appointmentTimeStr}</p>
                                            </div>
                                        )) : null}
                                    </div>
                                }

                                {
                                list?.length > 3 ?
                                <div className="flex w-full shrink-0 justify-center ">
                                    <div ><MoreHorizontal size={14}/></div>
                                </div> : null
                                }

                            </div>

                        </div>
                    );
                })}
            </div>

        </section>
        
    );
};

export default MonthlyView;

const EmptyBox = () => {
    return (
        <div className="border w-full h-full bg-white "></div>
    )
}
