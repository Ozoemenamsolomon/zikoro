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
