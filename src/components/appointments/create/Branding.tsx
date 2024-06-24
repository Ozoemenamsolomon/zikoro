import React, { useState } from 'react';
import { FormProps } from '@/types/appointments'; 
import { InputCustom } from '@/components/ui/input-custom';
import { ImgaeIcon } from '@/constants';

const Branding: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
  handleChange,
}) => {

  return (
    <div className="space-y-4">
      <div>
        <InputCustom
          label='Business Name'
          type='text'
          error={errors?.businessName}
          name='businessName'
          value={formData?.businessName || ''}
          placeholder='Enter Business Name'
          className='py-6'
          onChange={handleChange}
        />
      </div>

      <div className="">
        <p className="pb-4">Logo</p>
        <div className="border-b px-2 flex items-center gap-3 text-gray-500 pb-2">
          <ImgaeIcon/>
          <p>Upload Logo</p>
        </div>
      </div>

      <div className="">
        <p className="pb-2">Brand Color</p>
        <div className="p-4 flex items-center justify-between w-full rounded-lg"
        style={{
          background: 'linear-gradient(269.83deg, rgba(156, 0, 254, 0.05) 0.14%, rgba(0, 31, 203, 0.05) 99.85%)'
        }}>
          <p>Hex</p>
          <div className="flex items-center gap-2 p-1 rounded-md bg-[#BDBDBD]/50 border border-gray-400 text-gray-500 pr-3">
            <div className="bg-zikoroBlue h-10  w-10  rounded-md shrink-0"></div>
            <p>#1708FF</p>
          </div>
        </div>
      </div>
  </div>
  );
};

export default Branding;
