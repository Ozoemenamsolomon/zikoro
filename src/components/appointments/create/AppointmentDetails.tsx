import React from 'react';
import { FormProps } from '@/types/appointments'; 
import { InputCustom } from '@/components/ui/input-custom';
import { MapPin, Plus, PlusCircle } from 'lucide-react';
import { EditPenIcon } from '@/constants';
import RadioButtons from '../ui/RadioButtons';

const AppointmentDetails: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
  handleChange,
}) => {
  return (
    <div className=" space-y-4">
      <div>
        <InputCustom
          label='Appointment Name'
          type='text'
          error={errors?.appointmentName}
          name='appointmentName'
          value={formData?.appointmentName || ''}
          placeholder='Enter Appointment Name'
          className='py-6'
          onChange={handleChange}
        />
      </div>
      <div>
        <InputCustom
          label='Create appointment category (optional)'
          type='text'
          error={errors?.category}
          name='category'
          value={formData?.category || ''}
          placeholder='Enter category name'
          className='py-6'
          onChange={handleChange}
        />
        <div onClick={()=>console.log('cccccc')} className="text-zikoroBlue flex gap-2 pt-2 items-center">
          <PlusCircle size={14}/>
          <p>Add more</p>
        </div>
      </div>

      <div>
        <InputCustom
          label='Duration in minutes'
          type='number'
          error={errors?.duration}
          name='duration'
          value={formData?.duration || ''}
          placeholder=''
          className='py-6 w-40'
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="loctionType" className='pb-3'>Location type</label>
        <RadioButtons 
          formData={formData} 
          handleChange={handleChange!} 
          label1={'Onsite'} 
          label2={'Virtual'} 
          value1={'Onsite'} 
          value2={'Virtual'} 
          name='locationType'
          />
      </div>
      
      <div className="flex gap-2 items-center">
        <MapPin size={18} className='shrink-0 text-[#1F1F1F]'/>
        <InputCustom
          type='text'
          error={errors?.locationDetails}
          name='locationDetails'
          value={formData?.locationDetails || ''}
          placeholder='Enter Location'
          className='py-6 w-full'
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2 items-center">
        <EditPenIcon size='20'/>
        <InputCustom
          type='text'
          error={errors?.note}
          name='note'
          value={formData?.note || ''}
          placeholder='Add notes for appointment here'
          className='py-6 w-full'
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AppointmentDetails;
