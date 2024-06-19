import React, { useState } from 'react';
import { FormProps } from '@/types/appointments'; 
import { SelectInput } from '../ui/CustomSelect';
import RadioButtons from '../ui/RadioButtons';
import { Paystack, Stripe } from '@/constants';
import { PlusCircle } from 'lucide-react';

const Payment: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  handleChange,
  setErrors,
  loading,
  setLoading,
}) => {

  return (
    <div className=" space-y-6 relative ">
      <div className="">
        <p className='pb-2'>Set pricing and currency</p>
        <div className="flex gap-8 items-center">
            <SelectInput
              name='amount'
              value={formData?.amount || 60}
              options={[
                {label:'20',value:20},
                {label:'40',value:40},
                {label:'60',value:60},
                {label:'80',value:80},
                {label:'100',value:100},
              ]}
              setFormData={setFormData!}
              setError={setErrors}
              className='w-32'
            />
            <SelectInput
              name='curency'
              value={formData?.curency || 'USD'}
              options={[
                {label:'USD',value:'USD'},
                {label:'CAD',value:'CAD'},
                {label:'EUR',value:'EUR'},
                {label:'NGN',value:'NGN'},
                {label:'AUD',value:'AUD'},
              ]}
              setFormData={setFormData!}
              className='w-32'
              setError={setErrors}
            />
        </div>

      </div>
      
      <div className="">
        <p className="pb-2">Connect your preferred payment gateway</p>
        <RadioButtons 
          formData={formData} 
          handleChange={handleChange!} 
          label1={<Paystack/>}
          label2={<Stripe/>}
          value1={'Paystack'} 
          value2={'Stripe'} 
          name='paymentGateway'
          />
      </div>

      <div className="flex gap-2 items-center ">
        <PlusCircle size={18} className='text-zikoroBlue'/>
        <p className="text-zikoroBlue">Add new payment method</p>
      </div>

      <div className="py-3 px-12 font-semibold text-center rounded-lg w-full bg-basePrimary text-white ">
        Connect
      </div>
      
      
    </div>
  );
};

export default Payment;
