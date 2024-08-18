import { BookingIcon } from '@/constants';
import { LongArrowUp, LongArrowDown } from 'styled-icons/fa-solid'; // Import LongArrowDown
import LoadingState from './LoadingState';
import { Booking } from '@/types/appointments';
import { SectionOneProps } from './SectionOne';
import ErrorState from './ErrorState';
import { getTypeLabel } from '@/lib/bookingsAnalytics';

const TotalBookings: React.FC<SectionOneProps> = ({
  isLoading,
  type,
  error,
  current,
  previous,
}) => {
  const currentBookings = current.length;
  const previousBookings = previous.length;
  const difference = currentBookings - previousBookings;
  const isPositive = difference >= 0;
  const formattedDifference = isPositive ? `+${difference}` : `${Math.abs(difference)}`;

  return (
    <>
      {isLoading ? (
        <LoadingState />
      ) :  error ? (
        <ErrorState/>
      ) : (
        <div className='border bg-[#F9FAFF] p-4 rounded-md flex flex-col justify-center items-center gap-2'>
          <div className="shrink-0">
            <BookingIcon />
          </div>
          
          <h5 className="text-lg">Total Bookings</h5>
          <h3 className="text-2xl font-bold">{currentBookings}</h3>
          
          <div className="flex justify-center items-center gap-3">
            <div className="flex gap-2 items-center">
              {isPositive ? (
                <LongArrowUp size={12} className="text-green-500" />
              ) : (
                <LongArrowDown size={12} className="text-red-600" />
              )}
              <p className={`text-lg ${isPositive ? 'text-green-500' : 'text-red-600'}`}>
                {formattedDifference}
              </p>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-600 shrink-0"></div>
            <p className="text-gray-600">this {getTypeLabel(type)}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalBookings;
