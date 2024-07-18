import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { Booking } from '@/types/appointments';
import { cn } from '@/lib';

interface MonthlyViewProps {
    appointments: Record<string, Booking[]>;
    currentMonth: Date;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ appointments, currentMonth }) => {
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Calculate the number of empty boxes needed before the first day of the month
    const startDay = getDay(startDate);

    return (
        <section className="">
            <div className=" grid grid-cols-7 pb-3 text-slate-500">
                <div>Sunday</div>
                <div>Monday</div>
                <div>Tuesday</div>
                <div>Wednesday</div>
                <div>Thursday</div>
                <div>Friday</div>
                <div>Saturday</div>
            </div>

            <div className="grid grid-cols-7  ">
                {/* Render empty boxes before the first day of the month */}
                {Array.from({ length: startDay }).map((_, index) => (
                    <EmptyBox key={index} />
                ))}
                {days.map((day, dayIdx) => {
                    const dayString = format(day, 'eee MMM dd yyyy');
                    const list = appointments[dayString]
                    return (
                        <div  key={dayString} className="relative border bg-white p-2  w-full">
                            <div className={cn("flex flex-col justify-between h-32 overflow-hidden")}>
                               
                                <div className="flex justify-between shrink-0 gap-1 items-center pb-2">
                                    <time  dateTime={format(day, 'yyyy-MM-dd')}
                                    className=" font-medium">
                                        {format(day, 'd')}
                                    </time>
                                    {list?.length && <p className="text-[8px] shrink-0 md:text-[12px]">{list.length + ' ' + 'appt.'}</p>}
                                </div>

                                <div className="h-full flex flex-col gap-1 flex-start">
                                    {list?.slice(0,3)?.map(appointment => (
                                        <div key={appointment.id} className="flex  gap-1 items-center text-[10px] xl:text-sm">
                                            <div className="h-3 w-3 rounded shrink-0 "
                                                style={{
                                                    backgroundColor: appointment?.appointmentLinkId?.brandColour
                                                }}
                                            ></div>
                                            <p className=' flex-shrink-0  '>{appointment.appointmentTimeStr}</p>
                                        </div>
                                    ))}
                                </div>

                                {
                                list?.length > 3 ?
                                <div className="flex w-full shrink-0 justify-center ">
                                    <button type="button"><MoreHorizontal size={14}/></button>
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
