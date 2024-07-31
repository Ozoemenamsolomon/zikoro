"use client";

import { AppointmentLink, AppointmentUnavailability, Booking } from "@/types/appointments";

import { getRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";


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

export const useGetBookings = (pastAppointments?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getBookings = async () => {
    setLoading(true);
    try {
      const { data, status } = await getRequest<Booking[]>({
        endpoint: `/appointments`,
      });
      if (status !== 200) {
          setError('Error fetching schedules!')
          toast.error('Error fetching schedules!');
        return;
      }
      setBookings(data.data);
    } catch (error) {
      setError('Error fetching schedules!')
      setLoading(false);
      toast.error('Error fetching schedules!');
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  }

  const getPastBookings = async () => {
    setLoading(true);
    try {
      const { data, status } = await getRequest<Booking[]>({
        endpoint: `/appointments/old_appointments?date=${new Date().toISOString()}`,
      });
      if (status !== 200) {
        setError('Error fetching schedules!')
        toast.error('Error fetching schedules!');
        return;
      }
      setBookings(data.data);
    } catch (error) {
        setError('Error fetching schedules!')
        toast.error('Error fetching past schedules!');
        console.error('Error fetching past schedules:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (pastAppointments) {
      getPastBookings();
    } else {
      getBookings();
    }
  }, [pastAppointments]);

  return { bookings, isLoading,error, getBookings, getPastBookings };
};

export const getAppointment = async (appointmentAlias:string) => {
  const { data, status } = await getRequest<AppointmentLink>({
    endpoint: `/appointments/booking/${appointmentAlias}`,
  });
  return  data.data;
};

export const getBookings = async ( ) => {
  const { data, status } = await getRequest<Booking>({
    endpoint: `/appointments/booking`,
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

  return { unavailableDates, isLoading, error, getUnavailableDates };
};


