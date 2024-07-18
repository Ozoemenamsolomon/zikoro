import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, eachHourOfInterval } from 'date-fns';
import { Booking } from '@/types/appointments';
import { Clock } from 'lucide-react';

interface WeeklyViewProps {
    appointments: Record<string, Record<number, Booking[]>>;
    currentWeek: Date;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ appointments, currentWeek }) => {
    const startDate = startOfWeek(currentWeek);
    const endDate = endOfWeek(currentWeek);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const hours = eachHourOfInterval({ start: new Date().setHours(0, 0, 0, 0), end: new Date().setHours(23, 59, 59, 999) });

    console.log({ days, hours, appointments });

    return (
        <section className="sticky top-0 pb-10 ">
                <div className="flex flex-nowrap gap-0">
                {/* First row with days */}
                    <div className="w-16 shrink-0 pt-2 flex justify-center items-center h-full text-slate-300 ">
                        <Clock />
                    </div>

                    {days.map((day, idx) => (
                        <div key={idx} className={` flex-1 border p-2 text-center bg-slate-100 ${idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''}`}>
                            <h3 className="text font-medium">{format(day, 'eee dd')}</h3>
                        </div>
                    ))}
                </div>

                {/* Rows with hours and appointments */}
                <div className="h-screen overflow-auto no-scrollbar">
                {hours.map(hour => (
                    <div key={hour.getHours()} className='flex flex-nowrap gap-0 border-b '>
                        <div className="flex w-16 items-center h-24 shrink-0 p-2 ">
                            <h4 className="text font-medium">{format(hour, 'h a')}</h4>
                        </div>
                        {days.map(day => {
                            const dayString = format(day, 'eee MMM dd yyyy');
                            const hourString = format(hour, 'h');
                            const list = appointments[dayString] as Record<number, Booking[]> | undefined;
                            const appointmentsForHour = list ? list[Number(hourString)] || [] : [];
                            
                            return (
                                <div key={dayString + hour.getHours()} className=" flex-1 overflow-hidden border-x bg-white p-2 h-24">
                                    {appointmentsForHour?.length>0 && appointmentsForHour?.map((appointment: Booking) => (
                                        <div key={appointment.id} className="flex gap-1 items-center text-[10px] xl:text-sm">
                                            <div
                                                className="h-3 w-3 rounded shrink-0"
                                                style={{
                                                    backgroundColor: appointment?.scheduleColour!,
                                                }}
                                            ></div>
                                            <p className='flex-shrink-0'>{appointment.appointmentTimeStr}</p>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
                </div>
        </section>
    );
};

export default WeeklyView;
