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
import { AppointmentFormData, DetailItem } from '@/types/appointments';
import { usePathname, useRouter } from 'next/navigation';
import { fetchUser } from '../auth';
import { toast } from 'react-toastify';
import PageLoading from '../ui/Loading';
import { useGetBookingAppointment } from '@/hooks';
import { DaySchedule } from '../ui/DateTimeScheduler ';
import SelectType from './SelectType';
import { useAppointmentContext } from '../context/AppointmentContext';
import { uploadImage } from './uploadImage';

const detailsArray: DetailItem[] = [
  {
    title: 'Appointment Details',
    icon: <CalenderIcon />,
    description: 'Let guest know about your appointment',
    formComponent: AppointmentDetails,
  },
  {
    title: 'Payment',
    icon: <AtmCardIcon />,
    description: 'Enable settings to receive payment ',
    formComponent: Payment,
  },
  {
    title: 'Set Availability',
    icon: <ClockIcon />,
    description: 'Let guest know when you will be available',
    formComponent: SetAvailability,
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

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", ];
const formdata = {
  appointmentName: '',
  category: '',
  duration: 15,
  loctionType: 'Onsite',
  locationDetails: '',
  timeZone: "(UTC+01:00) West Central Africa",
  timeDetails: daysOfWeek.map(day => ({
    day,
    from: '',
    to: '',
    enabled: false
  })),
  curency: '',
  amount: 0,
  paymentGateway: 'Zikoro manage',
  maxBooking: 1,
  sessionBreak: 5,
  statusOn: true,
  note: '',
  appointmentAlias: '',
  createdBy: null,
  businessName: null,
  logo: null,
  brandColour: '#0000FF',
  teamMembers: null,
  zikoroBranding: 'true',
  files: [],
};

interface ValidationErrors {
  [key: string]: string;
}

const CreateAppointments: React.FC<{ alias?: string }> = ({ alias }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const {setselectedType} = useAppointmentContext()
  const { appointment, isLoading, } = useGetBookingAppointment(alias!);
  const [isOpen, setIsOpen] = useState(true)

  const [formData, setFormData] = useState<AppointmentFormData>(formdata);
  const [errors, setErrors] = useState<{ [key: string]: string } | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (appointment) {
      try {
        // remove modal if it is edit mode.
        setIsOpen(false)
        // Parse timeDetails and category
        const parsedTimeDetails = JSON.parse(appointment.timeDetails || "[]") as DaySchedule[];
        const parsedCategory = JSON.parse(appointment.category || `""`) as string | string[];
  
        // Check if parsedCategory is an array and set isOpen
        if (Array.isArray(parsedCategory)) {
          setselectedType('multiple')
        }
  
        // Update formData with parsed values
        setFormData({ ...appointment, timeDetails: parsedTimeDetails, category: parsedCategory });
  
        // Debugging output
        console.log({ parsedCategory, parsedTimeDetails, formData });
      } catch (error) {
        console.error('Error parsing appointment details:', error);
      } finally {
        setLoading(false)
      }
    }
  }, [appointment]);
  

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

    let newErrors = { ...errors };
    delete newErrors[name];
    delete newErrors['general'];

    setErrors(newErrors);
  };

  const validate = (data: AppointmentFormData): boolean => {
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
    setErrors(error);
    return Object.keys(error).length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    if (validate(formData)) {
      setLoading(false);
      return;
    }
    const logoUrl = await uploadImage(formData.files!)
    delete formData['files']
    try {
      const payload = { ...formData, timeDetails: JSON.stringify(formData.timeDetails), logo: logoUrl || '' };
      let response;
// console.log({formData,payload})
      if (alias) {
        response = await fetch('/api/appointments/edit', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
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
        toast.success('Appointment created');
        push('/appointments/schedule');
      } else {
        setErrors({ general: result.error });
        toast.error('Form submission failed!');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (!alias) {
        const user = await fetchUser();
        setFormData((prev) => ({
          ...prev,
          createdBy: user?.id,
        }));
      }
    };
    fetch();
  }, [pathname]);


  return (
    <main className="py-4 sm:p-8">
      <SelectType onClose={()=>setIsOpen(false)} isOpen={isOpen}/>
      <PageLoading isLoading={loading || isLoading} />
      <Link href={'/appointments/schedule'} type="button" className="max-sm:pl-4">
        <BentArrowLeft w={20} />
      </Link>
      <section className="py-4 flex w-full justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-[6px] p-6 sm:p-[60px] grid gap-0.5">
          {errors && Object.keys(errors).length > 0 && (
            <>
              {errors.general ? (
                <p className="text-red-600 text-[12px]">{errors.general}</p>
              ) : (
                <p className="text-red-600 text-[12px]">{Object.values(errors).join(', ')}</p>
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
          <button
            type="submit"
            className="mt-6 py-3 text-center w-full rounded-md text-[#F2F2F2] font-semibold text-xl bg-basePrimary"
          >
            {loading ? 'Submitting...' : pathname.includes('edit') ? 'Edit Appointment' : 'Create Appointment'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateAppointments;
