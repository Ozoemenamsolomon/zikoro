import { InputCustom } from '@/components/ui/input-custom';
import React, {  useEffect, useState } from 'react';
import { useAppointmentContext } from '../context/AppointmentContext';
import { AppointmentLink,  } from '@/types/appointments';
import { XCircle } from 'lucide-react';
import { submitBooking } from './submitBooking';
import { usePathname } from 'next/navigation';

const DetailsForm = ({appointmentLink}:{appointmentLink:AppointmentLink | null}) => {

  const {bookingFormData, isFormUp, setIsFormUp, setBookingFormData, slotCounts, setSlotCounts,setInactiveSlots,} = useAppointmentContext()
  const maxBookingLimit = appointmentLink?.maxBooking!;

    const pathname = usePathname()

    useEffect(() => {
    setBookingFormData({
        ...bookingFormData!,
        appointmentLinkId: appointmentLink?.id,
        // currency: appointmentLink?.curency,
        // price: appointmentLink?.amount,
        bookingStatus: '',
        appointmentName: appointmentLink?.appointmentName,
        teamMembers: appointmentLink?.teamMembers,
        // appointmentType: appointmentLink?.category,
        scheduleColour: appointmentLink?.brandColour,
        feeType: appointmentLink?.isPaidAppointment ? 'Paid appointment' : 'Free',
        firstName: '',
        lastName:'',
        phone:'',
        participantEmail:'',
    })
  }, [appointmentLink])
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDisabled = !bookingFormData?.appointmentDate || !bookingFormData?.appointmentTime || !bookingFormData?.appointmentLinkId || !bookingFormData?.participantEmail;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setBookingFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validate = (): boolean => {
    const error: Record<string, string> = {};
    if (!bookingFormData?.firstName) {
      error.firstName = 'First name is required';
    }
    if (!bookingFormData?.lastName) {
      error.lastName = 'Last name is required';
    }
    // if (!bookingFormData?.notes) {
    //   error.notes = 'Add a note';
    // }
    if (!bookingFormData?.participantEmail) {
      error.participantEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(bookingFormData?.participantEmail)) {
      error.participantEmail = 'Email is invalid';
    }
    if (!bookingFormData?.phone) {
      error.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(bookingFormData?.phone.toString())) {
      error.phone = 'Phone number is invalid';
    }
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBooking({
      setLoading,
      setErrors,
      validate,
      bookingFormData,
      setBookingFormData,
      slotCounts,
      setSlotCounts,
      setInactiveSlots,
      maxBookingLimit,
      setSuccess,
      appointmentLink,
      pathname,
    });
  };
// console.log({price:bookingFormData})
  return (
    <div className= {`${isFormUp ? ' visible translate-x-0':' -translate-x-full '} transform transition-all duration-300 w-full relative flex flex-col bg-white h-full px-6 py-20 rounded-lg shadow-md  justify-center items-center` } >
        <p className="pb-4 text-lg font-semibold">Enter your details</p>
        {errors?.general ? <p className="pb-4 text-red-600 max-w-lg text-wrap">{errors?.general}</p> : null}
        {success  ? <p className="pb-4 max-w-lg text-wrap text-blue-600">{success}</p> : null}
      <div className="mx-auto space-y-4" >
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="space-y-1 flex-1 w-full">
                <div className="flex-1">
                  <InputCustom
                    label="First Name"
                    type="text"
                    error={errors?.firstName || ''}
                    name="firstName"
                    value={bookingFormData?.firstName || ''}
                    placeholder="Enter your first name"
                    className="py-6 w-full"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <InputCustom
                    label="Last Name"
                    type="text"
                    error={errors?.lastName || ''}
                    name="lastName"
                    value={bookingFormData?.lastName || ''}
                    placeholder="Enter your last name"
                    className="py-6 w-full"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <InputCustom
                    label="Email"
                    type="email"
                    error={errors?.participantEmail || ''}
                    name="participantEmail"
                    value={bookingFormData?.participantEmail || ''}
                    placeholder="Enter your email"
                    className="py-6 w-full"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <InputCustom
                    label="Phone"
                    type="tel"
                    error={errors?.phone || ''}
                    name="phone"
                    value={bookingFormData?.phone || ''}
                    placeholder="Enter your phone number"
                    className="py-6 w-full"
                    onChange={handleChange}
                  />
                </div>

            </div>

            <div className="flex-1 w-96 h-full grid  flex-col">
              <p className='pb-3 flex-nowrap'> Add a note to this appointment</p>
                  <textarea 
                    name="notes" id="notes"
                    onChange={handleChange}
                    value={bookingFormData?.notes || ''}
                    required
                    className={`${errors.notes ? 'ring-2 ring-red-600':''} sm:h-[17.6rem]  w-full focus:outline-none  p-3 h-24 border  rounded-xl `}
                    >
                  </textarea>
            </div>
        </div>

        <XCircle onClick={()=>setIsFormUp('')} size={20} className='text-gray-500 cursor-pointer absolute top-6 right-6'/>

         <div className="w-full">

           { 
            bookingFormData?.price ?
            // process for paid appointments
            <button
              onClick={()=>{
                setIsFormUp('pay') 
                // setBookingFormData({
                //   ...bookingFormData,
                //   price:appointmnetLink?.amount,
                //   currency:appointmnetLink?.curency,
                // })
              }}
              className={`w-full cursor-pointer py-2 px-4 bg-basePrimary text-white rounded ${loading  || isDisabled ? ' cursor-not-allowed opacity-30' : ''}`}
              disabled={loading || isDisabled}
            >
              Process and pay
            </button> 
            :
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isDisabled}
              className={`w-full px-4 py-3 rounded-md text-center bg-basePrimary text-white ${loading || isDisabled  ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Submitting...' : 'Book Appointment'}
            </button>

            }
        </div>
      </div>
    </div>
  );
};

export default DetailsForm;
