import { CustomerIon, RevenueIcon } from '@/constants';
import React, { useMemo, useCallback } from 'react';
import { LongArrowUp, LongArrowDown } from 'styled-icons/fa-solid'; 
import { SectionOneProps } from './SectionOne';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { Booking } from '@/types/appointments';
import { getTypeLabel } from '@/lib/bookingsAnalytics';

const TotalCustomers: React.FC<SectionOneProps> = ({
  isLoading,
  type,
  error,
  current,
  previous,
}) => {
  // Memoize the extraction of unique customers
  const extractUniqueCustomers = useCallback((bookings: Booking[]) => {
    const customersSet = new Set();
    console.log({length:bookings.length})
    bookings.forEach((booking) => {
      const customerIdentifier = `${booking.email}`;
      customersSet.add(customerIdentifier);
    });

    return customersSet.size;
  }, []);

  // Memoize combined bookings, total customers, and new customers calculations
  const { totalCustomers, newCustomers } = useMemo(() => {
    const combinedBookings = [...current, ...previous];
    const totalCustomers = extractUniqueCustomers(combinedBookings);
    const newCustomers = extractUniqueCustomers(current) - extractUniqueCustomers(previous);
    console.log({combinedBookingslength:combinedBookings.length})

    return { totalCustomers, newCustomers };
  }, [current, previous, extractUniqueCustomers]);

  // Memoize arrow icon and color
  const { ArrowIcon, arrowColor, newCustomersText } = useMemo(() => {
    const isIncrease = newCustomers > 0;
    console.log({isIncrease:isIncrease})

    return {
      ArrowIcon: isIncrease ? LongArrowUp : LongArrowDown,
      arrowColor: isIncrease ? 'text-green-500' : 'text-red-500',
      newCustomersText: `${isIncrease ? '+' : ''}${Math.abs(newCustomers)}`,
    };
  }, [newCustomers]);

  return (
    <>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className='border bg-[#F9FAFF] p-4 rounded-md flex flex-col justify-center items-center gap-2'>
          <CustomerIon />

          <h5 className="text-lg">Total Customers</h5>

          <h3 className="text-2xl font-bold">{totalCustomers}</h3>

          <div className="flex justify-center items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowIcon size={12} className={arrowColor} />
              <p className={`text-lg ${arrowColor}`}>{newCustomersText}</p>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-600 shrink-0"></div>
            <p className="text-gray-600">
              from last {getTypeLabel(type)}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalCustomers;
