'use client'

import { useGetBookings } from '@/hooks';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import PageLoading from '../ui/Loading';
import Calender from './Calender';
import Empty from './Empty';

const AppointmentCalender = () => {
  let today = format(new Date(), 'MMMM yyyy')
  const { bookings, isLoading,error, getPastBookings,getBookings } = useGetBookings();

  return (
      <Calender/>
  );
};

export default AppointmentCalender;
