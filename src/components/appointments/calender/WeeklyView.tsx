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

    return (
        <div className="grid grid-cols-8">
            {/* First row with days */}
            <div className="flex justify-center items-center h-full text-slate-300 w-16">
                <Clock />
            </div>

            {days.map((day, idx) => (
                <div key={idx} className={`border p-2 text-center bg-slate-100 ${idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''}`}>
                    <h3 className="text font-medium">{format(day, 'eee dd')}</h3>
                </div>
            ))}

            {/* Rows with hours and appointments */}
            {hours.map(hour => (
                <React.Fragment key={hour.getHours()}>
                    <div className="flex w-16 items-center h-full p-2">
                        <h4 className="text font-medium">{format(hour, 'h a')}</h4>
                    </div>
                    {days.map(day => {
                        const dayString = format(day, 'eee MMM dd yyyy');
                        const list = appointments[dayString] || {};
                        const appointmentsForHour = list[hour.getHours()] || [];

                        return (
                            <div key={dayString + hour.getHours()} className="border bg-white p-2 h-24">
                                {appointmentsForHour.map(appointment => (
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
                </React.Fragment>
            ))}
        </div>
    );
};

export default WeeklyView;
