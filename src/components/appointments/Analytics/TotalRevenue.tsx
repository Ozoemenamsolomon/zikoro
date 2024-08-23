import { RevenueIcon } from '@/constants';
import React from 'react';
import { LongArrowUp, LongArrowDown } from 'styled-icons/fa-solid'; // Import both up and down arrows for increase/decrease
import { SectionOneProps } from './SectionOne';
import { Booking } from '@/types/appointments';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { getTypeLabel } from '@/lib/bookingsAnalytics';

const TotalRevenue: React.FC<SectionOneProps> = ({
  isLoading,
  type,
  error,
  current,
  previous,
}) => {
  const calculateTotalRevenue = (bookings: Booking[]) => {
    return bookings.reduce((total, booking) => {
      return total + Number(booking.price);
    }, 0);
  };

  const currentRevenue = calculateTotalRevenue(current);
  const previousRevenue = calculateTotalRevenue(previous);

  const revenueChange = currentRevenue - previousRevenue;
  const percentageChange = previousRevenue === 0 ? 0 : (revenueChange / previousRevenue) * 100;

  const isIncrease = revenueChange > 0;
  const ArrowIcon = isIncrease ? LongArrowUp : LongArrowDown;
  const arrowColor = isIncrease ? 'text-green-500' : 'text-red-500';
  const revenueChangeText = `${isIncrease ? '+' : ''}${Math.abs(revenueChange)}`;

  return (
    <>
  {isLoading ? (
      <LoadingState />
    ) :  error ? (
      <ErrorState/>
    ) : (
    <div className='border bg-[#F9FAFF] p-4 rounded-md flex flex-col justify-center items-center gap-2'>
      <RevenueIcon />

      <h5 className="text-lg">Total Revenue</h5>

      <h3 className="text-2xl font-bold">${currentRevenue.toLocaleString()}</h3>

      <div className="flex justify-center items-center gap-3">
        <div className="flex items-center gap-2">
          <ArrowIcon size={12} className={arrowColor} />
          <p className={`text-lg ${arrowColor}`}>{revenueChangeText}</p>
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

export default TotalRevenue;
