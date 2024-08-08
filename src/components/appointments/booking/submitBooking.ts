import { format, parse } from "date-fns";
import { AppointmentLink, Booking } from "@/types/appointments";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type ValidateFunction = () => boolean;

interface SubmitBookingProps {
    setLoading: SetState<boolean>;
    setErrors: SetState<Record<string, string>>;
    validate: ValidateFunction;
    bookingFormData: Booking | null;
    setBookingFormData: SetState<Booking| null>;
    slotCounts: Record<string, number>| null
    setSlotCounts: SetState<Record<string, number>| null>;
    setInactiveSlots: SetState<string[]>;
    setSuccess: SetState<string>;
    maxBookingLimit: number;
    appointmentLink:AppointmentLink|null;
    pathname:any;
}

export const submitBooking = async ({
    setLoading,
    setErrors,
    validate,
    bookingFormData,
    setBookingFormData,
    slotCounts,
    setSlotCounts,
    setInactiveSlots,
    setSuccess,
    maxBookingLimit,
    appointmentLink,
    pathname,
}: SubmitBookingProps): Promise<void> => {
    setLoading(true);
    setErrors({});
    setSuccess('')

    if (!validate() && !pathname.includes('bookings')) {
        setLoading(false);
        return;
    }

    const timeStamp = generateAppointmentTime({
        timeRange: bookingFormData?.appointmentTime!,
        selectedDate: bookingFormData?.appointmentDate!
    });

    try {
        const response = await fetch('/api/appointments/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...bookingFormData, appointmentTime: timeStamp }),
        });

        const result = await response.json();

        if (response.ok) {
            setBookingFormData((prevData: Booking| null) => ({
                ...prevData!,
                appointmentTime: null,
            }));

            // send email
            const res  = await fetch('/api/email/send-bookings-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingFormData:{ ...bookingFormData, appointmentTime: timeStamp },
                    appointmentLink,
                }),
            });
            console.log({email: await res.json()})
            if(res.ok){
                setSuccess('Booking was successful, email reminder sent')
            } else {
                setSuccess(`Booking successful, some emails couldn't send`)
               
            }
            // console.log('Form submitted successfully',{bookingFormData, appointmentLink, result}, await res.json());

            const slot: string = result?.data?.appointmentTime;
            // update slot bookin count
            const newSlotCounts = { ...slotCounts };
            newSlotCounts[slot] = (newSlotCounts[slot] || 0) + 1;
            setSlotCounts(newSlotCounts);

            if (newSlotCounts[slot] >= maxBookingLimit) {
                setInactiveSlots((prev: string[]) => ([...prev, slot]));
            }

        } else {
            console.error('Form submission failed', result);
            setErrors({ general: result.error });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        setErrors({ general: 'An unexpected error occurred' });
    } finally {
        setLoading(false);
    }
};

interface BookingInput {
    timeRange: string;
    selectedDate: Date | string | null;
  }

export function generateAppointmentTime({ timeRange, selectedDate }: BookingInput): string | null {
    if (!timeRange) {
      return null;
    }
  
    const [startTime] = timeRange.split(' - ');
  
    const appointmentDateTime = parse(startTime, 'hh:mm a', new Date(selectedDate || Date.now()));
  
    if (isNaN(appointmentDateTime.getTime())) {
      console.error("Invalid startTime format:", startTime);
      return null;
    }
    return format(appointmentDateTime, 'HH:mm:ss');
  }
  