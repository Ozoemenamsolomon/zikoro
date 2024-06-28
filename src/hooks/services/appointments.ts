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
      endpoint: `/appointments`,
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

export const getAppointment = async (appointmentAlias:string) => {
  const { data, status } = await getRequest<AppointmentLink>({
    endpoint: `/appointments/booking/${appointmentAlias}`,
  });
  return  data.data;
};

// export const useGetBookingAppointment = (appointmentAlias:string) => {
//     const [appointment, setAppointment] = useState<AppointmentLink | null>(null);
//     const [isLoading, setLoading] = useState<boolean>(false);
  
//     const getAppointment = async () => {
//       setLoading(true);
//       const { data, status } = await getRequest<AppointmentLink>({
//         endpoint: `/appointments/booking/${appointmentAlias}`,
//       });
  
//       setLoading(false);
  
//       return setAppointment(data.data);
//     };

//     console.log({appointmentAlias,appointment})

//     useEffect(() => {
//       if(appointmentAlias){
//         getAppointment();
//       }
//     }, [appointmentAlias]);
  
//     return { appointment, isLoading, getAppointment };
//   };

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