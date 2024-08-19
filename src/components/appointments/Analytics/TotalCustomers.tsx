import { CustomerIon, RevenueIcon } from '@/constants';
import React from 'react';
import { LongArrowUp, LongArrowDown } from 'styled-icons/fa-solid'; // Import both up and down arrows for increase/decrease
import { SectionOneProps } from './SectionOne';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { Booking } from '@/types/appointments';

const TotalCustomers: React.FC<SectionOneProps> = ({
  isLoading,
  type,
  error,
  current,
  previous,
}) => {
  // Helper function to extract unique customers
  const extractUniqueCustomers = (bookings: Booking[]) => {
    const customersSet = new Set();
    
    bookings.forEach((booking) => {
      // Create a unique identifier for the customer
      const customerIdentifier = `${booking.firstName} ${booking.lastName}`;
      customersSet.add(customerIdentifier);
    });

    return customersSet.size;
  };

  // Combine current and previous bookings
  const combinedBookings = [...current, ...previous];
  
  // Calculate total unique customers
  const totalCustomers = extractUniqueCustomers(combinedBookings);
  
  // Calculate the number of new customers
  const newCustomers = extractUniqueCustomers(current) - extractUniqueCustomers(previous);

  // Determine the arrow and color based on the new customer count
  const isIncrease = newCustomers > 0;
  const ArrowIcon = isIncrease ? LongArrowUp : LongArrowDown;
  const arrowColor = isIncrease ? 'text-green-500' : 'text-red-500';
  const newCustomersText = `${isIncrease ? '+' : ''}${Math.abs(newCustomers)}`;

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
              from last period
              {/* {isIncrease ? 'Increase' : 'Decrease'} from last period */}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalCustomers;
