"use client";

import { useAppointmentContext } from "@/components/appointments/context/AppointmentContext";
import { AppointmentLink, AppointmentUnavailability, Booking, UserType } from "@/types/appointments";
import { getRequest } from "@/utils/api";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks, subMonths, subYears } from 'date-fns';


export const useGetAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentLink[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const getAppointments = async () => {
    try {
        setLoading(true);
        setError('')
        const { data, status, } = await getRequest<AppointmentLink[]>({
          endpoint: `/appointments/schedules`,
        });
        console.log({ data, status, } )
        
        if(status!==200){
          setError('Error fetching schedules!')
          toast.error('Error fetching schedules!')
        }
        setAppointments(data.data)
    } catch (error) {
        setError('Error fetching schedules!')
        toast.error('Error fetching schedules!')
    } finally { 
        setLoading(false) 
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return { appointments, isLoading,error,getAppointments };
};

export const useGetBookings = (bookingStatus?:string) => {
  const { user } = useAppointmentContext();
  console.log({userF:user})

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getBookings = async (date: Date | string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/appointments?date=${date}&userId=${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setError('Error fetching schedules!');
        toast.error('Error fetching schedules!');
        return;
      }

      const data = await response.json();
      // console.log('Fetched Appointments:', data);

      if (data?.error) {
        setError('Error fetching schedules!');
        toast.error('Error fetching schedules!');
        return;
      }

      setBookings(data.data);
      return data
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Error fetching schedules!');
      toast.error('Error fetching schedules!');
    } finally {
      setLoading(false);
    }
  };

  const getPastBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/appointments/old_appointments?userId=${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setError('Error fetching schedules!');
        toast.error('Error fetching schedules!');
        return;
      }

      const data = await response.json();
      console.log('Fetched Appointments:', data);

      if (data?.error) {
        setError('Error fetching schedules!');
        toast.error('Error fetching schedules!');
        return;
      }

      setBookings(data.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Error fetching schedules!');
      toast.error('Error fetching schedules!');
    } finally {
      setLoading(false);
    }
  };

  return { bookings, isLoading, error, getBookings, getPastBookings };
};


export const getAppointment = async (appointmentAlias:string) => {
  const { data, status } = await getRequest<AppointmentLink>({
    endpoint: `/appointments/booking/${appointmentAlias}`,
  });
  return  data.data;
};

export const getBookings = async (bookingStatus?:string ) => {
  const { data, status } = await getRequest<Booking>({
    endpoint: `/appointments/booking?bookingStatus=${bookingStatus}`,
  });
  return  data.data;
};

export const useGetBookingAppointment = (appointmentAlias: string) => {
  const [appointment, setAppointment] = useState<AppointmentLink | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAppointment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await getRequest<AppointmentLink>({
        endpoint: `/appointments/booking/${appointmentAlias}`,
      });

      if (status === 200) {
        setAppointment(data.data);
      } else {
        setError(`Error fetching data! Check Your network`);
      }
    } catch (err) {
      setError(`Error fetching data! Check Your network`);
    } finally {
      setLoading(false);
    }
  }, [appointmentAlias]);

  useEffect(() => {
    if (appointmentAlias) {
      getAppointment();
    }
  }, [appointmentAlias, getAppointment]);

  return { appointment, isLoading, error, getAppointment };
};

export const useGetBookingList = (appointmentAlias: string) => {
  const [bookings, setBookings] = useState<AppointmentLink | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAppointment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await getRequest<AppointmentLink>({
        endpoint: `/appointments/booking/list/${appointmentAlias}`,
      });

      if (status === 200) {
        setBookings(data.data);
      } else {
        setError(`Error: ${status}`);
      }
    } catch (err) {
      setError('server error');
    } finally {
      setLoading(false);
    }
  }, [appointmentAlias]);

  useEffect(() => {
    if (appointmentAlias) {
      getAppointment();
    }
  }, [appointmentAlias, getAppointment]);

  return { bookings, isLoading, error, getAppointment };
};

export const useGetUnavailableDates = (userId: bigint,) => {
  const [unavailableDates, setUnavailableDates] = useState<AppointmentUnavailability[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getUnavailableDates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await getRequest<AppointmentUnavailability[] | null>({
        endpoint: `/appointments/calender/fetchUnavailability?userId=${userId}`,
      });

      if (status === 200) {
        setUnavailableDates(data.data);
      } else {
        console.log({error})
        setError(`Error: ${error}`);
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getUnavailableDates();
    }
  }, [userId, getUnavailableDates]);

  return { unavailableDates,setUnavailableDates, isLoading, error, getUnavailableDates };
};

export const useGetBookingsAnalytics = () => {
  // export const useGetBookingsAnalytics = (user:UserType) => {
  // console.log({userX:user})
  const {user, setUser} = useAppointmentContext()

  const [isLoading, setLoading] = useState<boolean>(true);
  const [type, setType] = useState<string>('weekly');
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<Booking[]>([])
  const [previous, setPrevious] = useState<Booking[]>([])

  const formatDateRange = (currentStart: string, currentEnd: string, previousStart: string, previousEnd: string, user:UserType): string => 
    `/appointments/booking/analytics?curStart=${currentStart}&curEnd=${currentEnd}&prevStart=${previousStart}&prevEnd=${previousEnd}&userId=${user?.id}`;

    const getBookings = useCallback(async (user:UserType) => {
      setLoading(true);
      setError(null);
      try {
        let currentStart, currentEnd, previousStart, previousEnd;
    
        if (type === 'weekly') {
          currentStart = startOfWeek(new Date()).toISOString();
          currentEnd = endOfWeek(new Date()).toISOString();
          previousStart = startOfWeek(subWeeks(new Date(), 1)).toISOString();
          previousEnd = endOfWeek(subWeeks(new Date(), 1)).toISOString();
        } else if (type === 'monthly') {
          currentStart = startOfMonth(new Date()).toISOString();
          currentEnd = endOfMonth(new Date()).toISOString();
          previousStart = startOfMonth(subMonths(new Date(), 1)).toISOString();
          previousEnd = endOfMonth(subMonths(new Date(), 1)).toISOString();
        } else if (type === 'yearly') {
          currentStart = startOfYear(new Date()).toISOString();
          currentEnd = endOfYear(new Date()).toISOString();
          previousStart = startOfYear(subYears(new Date(), 1)).toISOString();
          previousEnd = endOfYear(subYears(new Date(), 1)).toISOString();
        } else {
          throw new Error('Invalid type specified');
        }
    
        const { data, status } = await getRequest<{ cur: Booking[], prev: Booking[] }>({
          endpoint: formatDateRange(currentStart, currentEnd, previousStart, previousEnd, user),
        });

        if (status === 200) {
          setCurrent(data.cur || []);
          setPrevious(data.prev || []);
        } else {
          setError('Error fetching data!');
        }
    
      } catch (err) {
        console.log({err})
        setError('Server error');
      } finally {
        setLoading(false);
      }
    }, [type]);

    const getYearlyBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        let currentStart = startOfYear(new Date()).toISOString();
        let currentEnd = endOfYear(new Date()).toISOString();
        let previousStart = startOfYear(subYears(new Date(), 1)).toISOString();
        let previousEnd = endOfYear(subYears(new Date(), 1)).toISOString();
        const { data, status } = await getRequest<{ cur: Booking[], prev: Booking[] }>({
          endpoint: formatDateRange(currentStart, currentEnd, previousStart, previousEnd),
        });
        if (status === 200) {
          setCurrent(data.cur || []);
          setPrevious(data.prev || []);
        } else {
          setError('Error fetching data!');
        }
      } catch (err) {
        console.log({err})
        setError('Server error');
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      if(user) {
        getBookings(user)
      };
    }, [type,user]);

  return {isLoading,error,getBookings,current,previous, type, setType, getYearlyBooking}
}


