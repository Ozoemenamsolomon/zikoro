"use client";

import { AppointmentLink, Booking } from "@/types/appointments";

import { getRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const useGetAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentLink[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  
  const getAppointments = async () => {
    setLoading(true);
    //
    const { data, status, } = await getRequest<AppointmentLink[]>({
      endpoint: `/appointments/schedules`,
    });
    setLoading(false);
    if(status!==200){
      //useToast
      toast.error('Error fetching schedules!')
    }

    return setAppointments(data.data);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return { appointments, isLoading, getAppointments };
};

export const useGetBookings = (pastAppointments?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const getBookings = async () => {
    setLoading(true);
    try {
      const { data, status } = await getRequest<Booking[]>({
        endpoint: `/appointments`,
      });
      setLoading(false);
      if (status !== 200) {
        toast.error('Error fetching schedules!');
        return;
      }
      setBookings(data.data);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching schedules!');
      console.error('Error fetching schedules:', error);
    }
  };

  const getPastBookings = async () => {
    setLoading(true);
    try {
      const { data, status } = await getRequest<Booking[]>({
        endpoint: `/appointments/old_appointments?date=${new Date().toISOString()}`,
      });
      setLoading(false);
      if (status !== 200) {
        toast.error('Error fetching schedules!');
        return;
      }
      setBookings(data.data);
    } catch (error) {
      setLoading(false);
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

  return { bookings, isLoading, getBookings, getPastBookings };
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

