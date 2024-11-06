import { format, parse } from "date-fns";
import { AppointmentLink, Booking, BookingsContact } from "@/types/appointments";
import { useBookingsContact } from "@/hooks";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type ValidateFunction = () => boolean;

interface SubmitBookingProps {
    setLoading: SetState<boolean>;
    setErrors: SetState<Record<string, string>>;
    validate?: ValidateFunction;
    bookingFormData: Booking | null;
    setBookingFormData: SetState<Booking| null>;
    slotCounts: Record<string, number>| null
    setSlotCounts: SetState<Record<string, number>| null>;
    setInactiveSlots: SetState<string[]>;
    setSuccess: SetState<string>;
    maxBookingLimit: number;
    appointmentLink:AppointmentLink|null;
    pathname:any;
    insertBookingsContact: (contact: BookingsContact) => void
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
    insertBookingsContact,
}: SubmitBookingProps): Promise<{ bookingSuccess?: boolean; emailSuccess?: boolean }> => {

    setLoading(true);
    setErrors({});
    setSuccess('')

    let bookingSuccess=false, emailSuccess=false

    // if (validate && !validate() && !pathname.includes('bookings')) {
    //     setLoading(false);
    //     return {bookingSuccess, emailSuccess}
    // }

    const timeStamp = generateAppointmentTime({
        timeRange: bookingFormData?.appointmentTime!,
        selectedDate: bookingFormData?.appointmentDate!
    });

    try {
        // const sampleData: BookingsContact = {
        //     email: 'dube.doe@example.com',
        //     phone: '123-456-7890',
        //     whatsapp: '+1234567890',

        //     firstName: 'John',
        //     lastName: 'Doe',
        //     createdBy: 1001,
        //     favorite: true,
        //     profileImg: 'https://example.com/profile.jpg',
        //     age: 30,
        //   };
        // await insertBookingsContact(sampleData)
        const response = await fetch('/api/appointments/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...bookingFormData, appointmentTime: timeStamp }),
        });
        
        const result = await response.json();

        if (response.ok) {
            bookingSuccess=true
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
                    bookingFormData:{ 
                        ...bookingFormData, 
                        appointmentTime: timeStamp },
                        appointmentLink,
                }),
            });
            // console.log({email: await res.json(), appointmentLink, timeStamp})
            if(res.ok){
                emailSuccess=true
                console.log('==GOOD RES==')

                setSuccess('Booking was successful, email reminder sent')
                // insert contact
                
                let newContact:BookingsContact = {
                    email: bookingFormData?.participantEmail,
                    phone: bookingFormData?.phone,
                    whatsapp: '',
                    firstName: bookingFormData?.firstName,
                    lastName: bookingFormData?.lastName,
                    createdBy: appointmentLink?.createdBy?.id,
                } 
                await insertBookingsContact(newContact)
            } else {
            console.log('==BAD RES==')
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
        return {bookingSuccess, emailSuccess}
    } finally {
        setLoading(false);
    }
    return {bookingSuccess, emailSuccess}
};


// export const submitBooking = async ({
//     setLoading,
//     setErrors,
//     validate,
//     bookingFormData,
//     setBookingFormData,
//     slotCounts,
//     setSlotCounts,
//     setInactiveSlots,
//     setSuccess,
//     maxBookingLimit,
//     appointmentLink,
//     pathname,
// }: SubmitBookingProps): Promise<{ bookingSuccess: boolean; emailSuccess: boolean }> => {
//     setLoading(true);
//     setErrors({});
//     setSuccess('')

//     let bookingSuccess = false;
//     let emailSuccess = false;

//     if (validate && !validate() && !pathname.includes('bookings')) {
//         setLoading(false);
//         return { bookingSuccess, emailSuccess };
//     }

//     const timeStamp = generateAppointmentTime({
//         timeRange: bookingFormData?.appointmentTime!,
//         selectedDate: bookingFormData?.appointmentDate!
//     });

//     try {
//         const response = await fetch('/api/appointments/booking', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ ...bookingFormData, appointmentTime: timeStamp }),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             bookingSuccess = true;

//             setBookingFormData((prevData: Booking | null) => ({
//                 ...prevData!,
//                 appointmentTime: null,
//             }));

//             // Send email
//             const res = await fetch('/api/email/send-bookings-email', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     bookingFormData: { 
//                         ...bookingFormData, 
//                         appointmentTime: timeStamp 
//                     },
//                     appointmentLink,
//                 }),
//             });

//             if (res.ok) {
//                 emailSuccess = true;
//                 setSuccess('Booking was successful, email reminder sent');
//             } else {
//                 setSuccess(`Booking successful, some emails couldn't send`);
//             }

//             // Update slot booking count
//             const slot: string = result?.data?.appointmentTime;
//             const newSlotCounts = { ...slotCounts };
//             newSlotCounts[slot] = (newSlotCounts[slot] || 0) + 1;
//             setSlotCounts(newSlotCounts);

//             if (newSlotCounts[slot] >= maxBookingLimit) {
//                 setInactiveSlots((prev: string[]) => ([...prev, slot]));
//             }

//         } else {
//             console.error('Form submission failed', result);
//             setErrors({ general: result.error });
//         }
//     } catch (error) {
//         console.error('An error occurred:', error);
//         setErrors({ general: 'An unexpected error occurred' });
//     } finally {
//         setLoading(false);
//     }

//     return { bookingSuccess, emailSuccess };
// };


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
  