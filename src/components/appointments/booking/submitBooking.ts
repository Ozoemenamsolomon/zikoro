import { format, parse } from "date-fns";
import { Booking } from "@/types/appointments";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type ValidateFunction = () => boolean;

interface SubmitBookingProps {
    setLoading: SetState<boolean>;
    setErrors: SetState<Record<string, string>>;
    validate: ValidateFunction;
    bookingFormData: Booking;
    setBookingFormData: SetState<Booking>;
    slotCounts: Record<string, number>;
    setSlotCounts: SetState<Record<string, number>>;
    setInactiveSlots: SetState<string[]>;
    setSuccess: SetState<string>;
    maxBookingLimit: number;
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
    maxBookingLimit
}: SubmitBookingProps): Promise<void> => {
    setLoading(true);
    setErrors({});
    setSuccess('')

    if (!validate()) {
        setLoading(false);
        return;
    }

    const timeStamp = generateAppointmentTime({
        timeRange: bookingFormData.appointmentTime!,
        selectedDate: bookingFormData.appointmentDate!
    });

    // TODO: before submitting check if the particular slot has been booked max booking limit. To achieve this add a column in the booking table to record and track  the number of times this particular slot ha been booked. e.g (booking[bookingStage] += 1)
    try {
        const response = await fetch('/api/appointments/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...bookingFormData, appointmentTime: timeStamp }),
            // body: JSON.stringify({ ...bookingFormData, appointmentTime: timeStamp }),
        });

        const result = await response.json();
        console.log({ result, form: { ...bookingFormData, appointmentTime: timeStamp } });

        if (response.ok) {
            setBookingFormData((prevData: Booking) => ({
                ...prevData,
                appointmentTime: null,
            }));
            console.log('Form submitted successfully', result);

            setSuccess('Booking was successful')

            const slot: string = result?.data?.appointmentTime;

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

function generateAppointmentTime({ timeRange, selectedDate }: BookingInput): string | null {
    if (!timeRange) {
      console.error("Invalid timeRange:", timeRange);
      return null;
    }
  
    const [startTime] = timeRange.split(' - ');
  
    const appointmentDateTime = parse(startTime, 'hh:mm a', new Date(selectedDate || Date.now()));
  
    if (isNaN(appointmentDateTime.getTime())) {
      console.error("Invalid startTime format:", startTime);
      return null;
    }
  
    console.log({ timeRange, selectedDate, startTime, appointmentDateTime });
    return format(appointmentDateTime, 'HH:mm:ss');
  }
  