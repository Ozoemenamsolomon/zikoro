'use client'

import React, { useState, useEffect } from 'react';
import { format, endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths, subWeeks, addMonths, addWeeks, startOfDay, endOfDay, parseISO, isBefore, isAfter } from 'date-fns';
import { Booking } from '@/types/appointments';
import MonthlyView from './MonthlyView';
import { useAppointmentContext } from '../context/AppointmentContext';
import toast from 'react-hot-toast';
import Empty from './Empty';
import PageLoading from '../ui/Loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WeeklyView from './WeeklyView';
import { formatAppointmentsByMonth, formatAppointmentsByWeek } from '@/lib';
import { usePathname, useRouter,  } from 'next/navigation';

interface SearchParams {
    viewing: 'month' | 'week';
    date: Date;
  }

const Calendar: React.FC<SearchParams> = ({viewing,date}) => {
    const {replace} = useRouter()
    const pathname = usePathname()
    const {user} = useAppointmentContext()

    const [apiData, setApiData] = useState<{count:number, data:Booking[]} | null>(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)
    const [newUser, setNewUser] = useState<boolean>(false)
    const [view, setView] = useState<'month' | 'week'>(viewing||'month');
    const [appointments, setAppointments] = useState<Record<string, Booking[] | Record<number, Booking[]>>>({});
    const [currentDate, setCurrentDate] = useState(date || new Date());

    const [dateDisplay, setDateDisplay] = useState<string>('');
    const [count, setCount] = useState<number|null>(null);

    let retries = 2

    // const fetchAppointments = async () => {
    //     try {
    //         setLoading(true)
    //         setError('')
    //         let startDate: string;
    //         let endDate: string;

    //         if (view === 'month') {
    //             startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    //             endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
    //             setDateDisplay(format(currentDate, 'MMMM yyyy')) 
    //         } else {
    //             startDate = format(startOfWeek(currentDate), 'yyyy-MM-dd');
    //             endDate = format(endOfWeek(currentDate), 'yyyy-MM-dd');
    //             const start = format(startOfWeek(currentDate), 'MMM d');
    //             const end = format(endOfWeek(currentDate), 'd, yyyy');
    //             setDateDisplay(`${start} - ${end}`);
    //         }

    //         const res = await fetch(`/api/appointments/calender?view=${view}&startDate=${startDate}&endDate=${endDate}&userId=${user?.id}`); 
    //         const data = await res.json();
    //         console.log({RESULT:data})

    //         if (res.ok) {
    //             setCount(data?.count)
    //             setAppointments(data?.appointments);
    //         } else {
    //             toast.error('Error fetching data')
    //             setError(data?.error) // TODO: Doing production, use a more user friendly statement.
    //             setCount(0)
    //         }
    //     } catch (error) {
    //         if (retries > 0) {
    //             retries -= 1;
    //             return fetchAppointments();
    //           } else {
    //             setCount(0)
    //             setError('Server error! Check your network')
    //             toast.error('Error fetching data')
    //           }
    //     } finally {
    //         setLoading(false)
    //     }
    // };

    const filterData = (startDate: string, endDate: string, data: Booking[]): Booking[] => {
        console.log(view, 'FILTERING')
        const start = startOfDay(new Date(startDate));
        const end = endOfDay(new Date(endDate));
        
        const result =  data?.filter((item: Booking) => {
            const appointmentDate = parseISO(item.appointmentDate as string);
            return isAfter(appointmentDate, start) && isBefore(appointmentDate, end);
        })!;
        console.log({result})
        setCount(result?.length)
        return result
    };
    
    const reFormatData = async () => {
        try {
            setLoading(true);
            setError('');

    
            let startDate: string;
            let endDate: string;
    
            const setDateRangeAndAppointments = (view: string, currentDate: Date, data:Booking[]) => {
                
                if (view === 'month') {
                    console.log(view, 'SETTING DATES')

                    startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
                    endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
                    setDateDisplay(format(currentDate, 'MMMM yyyy'));
                    setAppointments(formatAppointmentsByMonth(filterData(startDate, endDate, data)));
                } else if (view === 'week') {
                    console.log(view, 'SETTING DATES')
                    startDate = format(startOfWeek(currentDate), 'yyyy-MM-dd');
                    endDate = format(endOfWeek(currentDate), 'yyyy-MM-dd');
                    const start = format(startOfWeek(currentDate), 'MMM d');
                    const end = format(endOfWeek(currentDate), 'd, yyyy');
                    setDateDisplay(`${start} - ${end}`);
                    setAppointments(formatAppointmentsByWeek(filterData(startDate, endDate, data)));
                }
            };
    
            // if (false) {
            if (appointments && Object.keys(appointments).length > 0 || apiData?.data?.length) {
                console.log('REFORMATING')
                setDateRangeAndAppointments(view, currentDate, apiData?.data!);
            } else {
                console.log('REFETCHING')

                const res = await fetch(`/api/appointments/calender?view=${view}&userId=${user?.id}`);
                const data = await res.json();
    
                if (res.ok) {
                    setApiData(data);
                    setCount(data?.count);
                    setDateRangeAndAppointments( view, currentDate, data?.data);
                } else {
                    setCount(0);
                    if(data?.error==='This is a new user'){
                        setNewUser(true)
                    } else {
                        toast.error('Error fetching data');
                        setError(data?.error); 
                    }
                }
            }
        } catch (error) {
            console.error('Error reformatting data:', error);
            setError('An unexpected error occurred'); // Provide a user-friendly error message.
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        replace(`${pathname}?viewing=${view}&date=${new Date(currentDate).toISOString()}`);

        if (user) reFormatData();
    }, [view, user, currentDate]);
    
    
    // useEffect(() => {
    //     if(user) fetchAppointments();
    // }, [view,user, currentDate]);

    const previous = () => {
        setCurrentDate(prevDate => (view === 'month' ? endOfMonth(subMonths(prevDate, 1)) : endOfWeek(subWeeks(prevDate, 1))));
    };

    const next = () => {
        setCurrentDate(prevDate => (view === 'month' ? endOfMonth(addMonths(prevDate, 1)) : endOfWeek(addWeeks(prevDate, 1))));
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <section className="flex w-full flex-shrink-0 justify-between gap-1 flex-col sm:flex-row pb-">
                <div className="flex gap-x- items-center">

                    <button 
                    onClick={previous}
                    type="button" className='text-basePrimary hover:-translate-x-0.5 duration-200'><ChevronLeft/></button>

                    <h4 className="text-xl font-semibold">{dateDisplay}</h4>

                    <button 
                    onClick={next}
                    type="button" className='text-basePrimary hover:translate-x-0.5 duration-200'><ChevronRight/></button>

                    {
                        !loading && count ?
                        <>
                            <p className="pr-2">-</p>
                            <p
                                className="font-semibold"
                                style={{
                                background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {!loading ? count + ' ' + 'meetings' : null}
                            </p>
                        </>
                        : null
                    }
                </div>

                <div className="flex justify-end">
                    <div className="bg-white p-1 flex rounded-xl border-2">
                        <button 
                        onClick={() => setView('week')}
                        className={`${view==='week' ? ' bg-gradient-to-r  from-slate-100  to-purple-100  text-basePrimary':''} rounded-lg px-6 py-2 font-semibold `}>Week View</button>
                        <button 
                        onClick={() => setView('month')} 
                        className={`${view==='month' ? ' bg-gradient-to-r  from-slate-100  to-purple-100  text-basePrimary':''} rounded-lg px-6 py-2  font-semibold`}>Month View</button>
                    </div>
                </div>
            </section>


            {
                loading ? 
                <PageLoading isLoading={loading} />
                :
                newUser ? 
                <Empty/>
                :
                error ? 
                <section className="py-20 text-center w-full">{error}</section>
                :
                view === 'month' ? (
                    <MonthlyView appointments={appointments as Record<string, Booking[]>} currentMonth={currentDate}  />
                ) : (
                    <WeeklyView appointments={appointments as Record<string, Record<number, Booking[]>>} currentDate={currentDate} />
                )
            }
        </div>
    );
};

export default Calendar;
