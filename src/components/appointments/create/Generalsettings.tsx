import React, { useState } from 'react';
import { FormProps } from '@/types/appointments'; 
import { InputCustom } from '@/components/ui/input-custom';
import { PlusCircle } from 'lucide-react';
import { SelectInput } from '../ui/CustomSelect';

const Generalsettings: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,handleChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="">
        <p className='pb-2'>Add Team members</p>
        <div className='flex gap-3 w-full items-end'>
            <InputCustom
              type='text'
              error={errors?.teamMembers}
              name='teamMembers'
              value={formData?.teamMembers || ''}
              placeholder='Enter Team member Email'
              className='py-6'
              onChange={handleChange}
            />
            <PlusCircle size={28} className='cursor-pointer mb-2 flex-shrink-0 text-gray-400'/>
        </div>
      </div>
      

      <div className="">
        <p className='pb-2'>Show <span className="font-semibold">unavailable</span> when core team {`member(s)`} is unavailable</p>
        <SelectInput
              name='a'
              value={formData?.a || ''}
              options={[
                {label:'Emma Udo',value:'Emma Udo'},
                {label:'John Smith',value:'John Smith'},
                {label:'Nsika Nols',value:'Nsika Nols'},
                {label:'Okeke Emi',value:'Okeke Emi'},
              ]}
              setFormData={setFormData!}
              className='w-full'
              setError={setErrors}
              icon='single'
            />
      </div>

      <div className="">
        <p className='pb-2'>Maximum bookings per session</p>
          <SelectInput
                name='maxBooking'
                value={formData?.maxBooking || ''}
                options={[
                  {label:'1',value:1},
                  {label:'5',value:5},
                  {label:'10',value:10},
                ]}
                setFormData={setFormData!}
                className='w-32 z-50 '
                setError={setErrors}
              />
      </div>

      <div className="">
        <label htmlFor="a" className='pb-2'>Break between sessions in minutes</label>
          <SelectInput
                name='sessionBreak'
                value={formData?.sessionBreak || ''}
                options={[
                  {label:'10',value:10},
                  {label:'15',value:15},
                  {label:'20',value:20},
                ]}
                setFormData={setFormData!}
                className='w-32'
                setError={setErrors}
              />
      </div>
    </div>
  );
};

export default Generalsettings;
