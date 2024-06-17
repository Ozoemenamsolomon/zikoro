'use client';

import { AtmCardIcon, BentArrowLeft, CalenderIcon, ClockIcon, RightArrow, SettingsIcon, ThemeIcon } from '@/constants';
import Link from 'next/link';
import Details from './Details';
import React, { useState } from 'react';
import SetAvailability from './SetAvailability';
import Payment from './Payment';
import AppointmentDetails from './AppointmentDetails';
import Branding from './Branding';
import Generalsettings from './Generalsettings';
import { DetailItem,  } from '../types'; 

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
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <main className="p-4 sm:p-8 ">
      <Link href={'/appointments'} type="button">
        <BentArrowLeft />
      </Link >
      <section className="py-20 flex w-full justify-center items-center">
        <form className="w-full max-w-2xl bg-white rounded-[6px] p-6 sm:p-[60px] grid gap-0.5">
            {detailsArray.map((detail, index) => {
                const FormComponent = detail.formComponent;
                return (
                <Details
                    key={index}
                    formData={formData}
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
                    />
                    }
                />
                );
            })}
            <button type="submit" 
            className='mt-6 py-3 text-center w-full rounded-md text-[#F2F2F2] font-semibold text-xl' 
            style={{background: `linear-gradient(269.83deg, rgba(156, 0, 254, 0.3) 0.14%, rgba(0, 31, 203, 0.3) 99.85%)`
            }}>Create Appointment</button>
        </form>
      </section>
    </main>
  );
};

export default CreateAppointments;
