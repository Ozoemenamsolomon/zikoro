'use client'

import { AtmCardIcon, BentArrowLeft, CalenderIcon, ClockIcon, SettingsIcon, ThemeIcon } from '@/constants';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Details from './Details';
import SetAvailability from './SetAvailability';
import Payment from './Payment';
import AppointmentDetails from './AppointmentDetails';
import Branding from './Branding';
import Generalsettings from './Generalsettings';
import { DetailItem } from '@/types/appointments';
import { AppointmentLink } from '@/types/appointments';
import { usePathname, useRouter } from 'next/navigation';
import { fetchUser } from '../auth';

const detailsArray: DetailItem[] = [
  {
    title: 'Appointment Details',
    icon: <CalenderIcon />,
    description: 'Let guest know about your appointment',
    formComponent: AppointmentDetails,
  },
  {
    title: 'Set Availability',
    icon: <ClockIcon />,
    description: 'Let guest know when you will be available',
    formComponent: SetAvailability,
  },
  {
    title: 'Payment',
    icon: <AtmCardIcon />,
    description: 'Enable settings to receive payment ',
    formComponent: Payment,
  },
  {
    title: 'Branding',
    icon: <ThemeIcon />,
    description: 'Personalize your appointment page',
    formComponent: Branding,
  },
  {
    title: 'General Settings',
    icon: <SettingsIcon />,
    description: 'Additional Info for your appointment',
    formComponent: Generalsettings,
  },
];
// no validation fields = curency,amount,note,createdBy,businessName,branColor,teamMembers,zikoroBranding
const formdata = {
  appointmentName: '',
  category: '',
  duration: null,
  loctionType: 'Onsite',
  locationDetails: '',
  timeZone: '',
  timeDetails: '',
  curency: '',
  amount: 0,
  paymentGateway: 'Zikoro manage',
  maxBooking: 1,
  sessionBreak: 5,
  statusOn: false,
  note: '',
  appointmentAlias: '',
  createdBy: null,
  businessName: null,
  logo: null,
  brandColour: '#0000FF',
  teamMembers: null,
  zikoroBranding: null,
}

interface ValidationErrors {
  [key: string]: string;
}

const CreateAppointments: React.FC<{editData: AppointmentLink}> = ({editData}) => {
  const {push} = useRouter()
  const pathname = usePathname()
  const [formData, setFormData] = useState<AppointmentLink>(editData ? {...editData, timeDetails: JSON.parse(editData?.timeDetails)} : formdata);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors({
      ...errors,
      [name]: '',
      general: ''
    });
  };

  const validate = (data: AppointmentLink): boolean => {
    const error: ValidationErrors = {};
  
    if (!formData.appointmentName) {
      error.appointmentName = 'Appointment Name is required';
    }
  
    if (data.duration === null || data.duration <= 0) {
      error.duration = 'Duration must be a positive number';
    }
  
    if (!data.loctionType) {
      error.loctionType = 'Location Type is required';
    }
  
    if (!data.locationDetails) {
      error.locationDetails = 'Location Details are required';
    }
  
    if (!data.timeZone) {
      error.timeZone = 'Time Zone is required';
    }
  
    if (!data.timeDetails) {
      error.timeDetails = 'Time Details are required';
    }
  
    if (data.maxBooking <= 0) {
      error.maxBooking = 'Max Booking must be a positive number';
    }
  
    if (data.sessionBreak <= 0) {
      error.sessionBreak = 'Session Break must be a positive number';
    }
    setErrors(error)
    return Object.keys(error).length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    if(validate(formData)){
      setLoading(false);
      return
    }
  
    try {
      const payload = { ...formData, timeDetails: JSON.stringify(formData.timeDetails) };
      
      let response;
      
      if(editData) {
        console.log('EEEEE',{ formData,payload,  editData});
        // edit link
        response = await fetch('/api/appointments/edit', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

      }else {
        console.log('CCCC',{ formData,  editData});
        // create new appointment link
        response = await fetch('/api/appointments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

      }
      const result = await response.json();
  
      if (response.ok) {
        setFormData(formdata);
        console.log('Form submitted successfully', result);
        // Handle any additional success actions here
        push('/appointments/schedule')
      } else {
        console.error('Form submission failed', result);
        setErrors(result.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrors('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
    useEffect(() => {
      const fetch = async () => {
        const user = await fetchUser()
        console.log({user})
        setFormData({
          ...formData,
          createdBy: user?.id
        })
      }
      fetch()
    }, [pathname])

  return (
    <main className="p-4 sm:p-8">
      <Link href={'/appointments'} type="button">
        <BentArrowLeft w={20} />
      </Link>
      <section className="py-4 flex w-full justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-[6px] p-6 sm:p-[60px] grid gap-0.5">
          {errors && Object.keys(errors).length > 0 && (
            <>
              {errors.general ? (
                <p className="text-red-600 text-[12-px]">{errors.general}</p>
              ) : (
                <p className="text-red-600 text-[12-px]">{Object.values(errors).join(', ')}</p>
              )}
            </>
          )}

          {detailsArray.map((detail, index) => {
            const FormComponent = detail.formComponent;
            return (
              <Details
                key={index}
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                loading={loading}
                setLoading={setLoading}
                title={detail.title}
                icon={detail.icon}
                description={detail.description}
                formComponent={
                  <FormComponent
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    loading={loading}
                    setLoading={setLoading}
                    handleChange={handleChange}
                  />
                }
              />
            );
          })}
          <button type="submit"
            className='mt-6 py-3 text-center w-full rounded-md text-[#F2F2F2] font-semibold text-xl bg-basePrimary'
          >
            {loading ?  'Submiting...' : 'Create Appointment'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateAppointments;
