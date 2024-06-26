import { InputCustom } from '@/components/ui/input-custom';
import React, { useEffect, useState } from 'react';
import { useAppointmentContext } from '../context/AppointmentContext';
import { AppointmentLink, Booking } from '@/types/appointments';
import SubmitBtn from './SubmitBtn';
import { XCircle } from 'lucide-react';

const DetailsForm = ({appointmentLink}:{appointmentLink:AppointmentLink | null}) => {
  const {bookingFormData, isFormUp, setIsFormUp, setBookingFormData} = useAppointmentContext()
  const maxBookingLimit = 2;

  useEffect(() => {
    setBookingFormData({
        ...bookingFormData,
        appointmentLinkId: appointmentLink?.id,
        currency: appointmentLink?.curency,
        price: appointmentLink?.amount,
        bookingStatus: '',
        appointmentName: appointmentLink?.appointmentName,
        teamMembers: appointmentLink?.teamMembers,
        // appointmentType: appointmentLink?.category,
        scheduleColour: appointmentLink?.brandColour,
        feeType: '',
    })
  }, [appointmentLink])
  

  const [errors, setErrors] = useState<Partial<Booking>>({});
  const [loading, setLoading] = useState<boolean>(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setBookingFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validate = (): boolean => {
    const error: Partial<Booking> = {};
    if (!bookingFormData.firstName) {
      error.firstName = 'First name is required';
    }
    if (!bookingFormData.lastName) {
      error.lastName = 'Last name is required';
    }
    if (!bookingFormData.participantEmail) {
      error.participantEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(bookingFormData.participantEmail)) {
      error.participantEmail = 'Email is invalid';
    }
    if (!bookingFormData.phone) {
      error.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(bookingFormData.phone.toString())) {
      error.phone = 'Phone number is invalid';
    }

    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    delete bookingFormData["participantEmail"]

    try {
      console.log('Form data submitted:', bookingFormData);
      setTimeout(() => {
        setLoading(false);
        setBookingFormData({}); 
        alert('Form submitted successfully');
      }, 1000);
    } catch (error) {
      console.error('Form submission error:', error);
      setLoading(false);
    }
  };

  return (
    <div className= {`${isFormUp ? ' visible translate-x-0':' -translate-x-full '} transform transition-all duration-300 w-full relative flex flex-col bg-white h-full px-6 py-20 rounded-lg shadow-md  justify-center items-center` } >
        <p className="pb-4">Enter your details</p>
      <form className="space-y-3 max-w-sm w-full mx-auto" onSubmit={handleSubmit}>
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
            type="text"
            error={errors?.phone || ''}
            name="phone"
            value={bookingFormData?.phone || ''}
            placeholder="Enter your phone number"
            className="py-6 w-full"
            onChange={handleChange}
          />
        </div>

        <XCircle onClick={()=>setIsFormUp(false)} size={20} className='text-gray-500 cursor-pointer absolute top-6 right-6'/>

        <SubmitBtn validate={validate} maxBookingLimit={maxBookingLimit}/>
      </form>
    </div>
  );
};

export default DetailsForm;
