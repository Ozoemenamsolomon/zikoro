"use client";

import { AppointmentLink } from "@/types/appointments";

import { getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

export const useGetAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentLink[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getAppointments = async () => {
    setLoading(true);
    //
    const { data, status } = await getRequest<AppointmentLink[]>({
      endpoint: `/appointments`,
    });

    setLoading(false);

    return setAppointments(data.data);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return { appointments, isLoading, getAppointments };
};



export const useGetBookingAppointment = (appointmentAlias:string) => {
    const [appointment, setAppointment] = useState<AppointmentLink | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
  
    const getAppointment = async () => {
      setLoading(true);
      //
      const { data, status } = await getRequest<AppointmentLink>({
        endpoint: `/appointments/booking/${appointmentAlias}`,
      });
  
      setLoading(false);
  
      return setAppointment(data.data);
    };
  
    useEffect(() => {
      getAppointment();
    }, []);
  
    return { appointment, isLoading, getAppointment };
  };