'use client'

import { AtmCardIcon, BentArrowLeft, CalenderIcon, ClockIcon, SettingsIcon, ThemeIcon } from '@/constants';
import Link from 'next/link';
import React, { useState } from 'react';
import Details from './Details';
import SetAvailability from './SetAvailability';
import Payment from './Payment';
import AppointmentDetails from './AppointmentDetails';
import Branding from './Branding';
import Generalsettings from './Generalsettings';
import { DetailItem } from '@/types/appointments';
import { AppointmentLink } from '@/types/appointments';

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

const CreateAppointments: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentLink>({});
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          data.append(key, value.toString());
        }
      });
      console.log({formData });

      // const response = await fetch('/api/appointment-links', {
      //   method: 'POST',
      //   body: data,
      // });

      // if (response.ok) {
      //   setFormData({});
      //   console.log('Form submitted successfully');
      // } else {
      //   console.error('Form submission failed');
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 sm:p-8">
      <Link href={'/appointments'} type="button">
        <BentArrowLeft w={14} />
      </Link>
      <section className="py-20 flex w-full justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-[6px] p-6 sm:p-[60px] grid gap-0.5">
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
            Create Appointment
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateAppointments;
