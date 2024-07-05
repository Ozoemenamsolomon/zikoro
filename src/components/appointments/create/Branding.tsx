import React from 'react';
import { AppointmentFormData, AppointmentLink, FormProps } from '@/types/appointments'; 
import { InputCustom } from '@/components/ui/input-custom';
import { ImgaeIcon } from '@/constants';
import ColorPicker from '../ui/ColorPicker';
import UploadImage from './uploadImage';

const Branding: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
  handleChange,
}) => {

  const handleToggleZikoroBranding = () => {
    if (setFormData) { 
      setFormData((prevFormData:AppointmentFormData) => ({
        ...prevFormData,
        zikoroBranding: prevFormData?.zikoroBranding ? '' : 'yes'
      }));
    }
  };
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
        
        <UploadImage formData={formData!} setFormData={setFormData!} multiple={false}/>
      </div>

      <div className="">
        <p className="pb-2">Brand Color</p>
        <div className="p-4 flex items-center justify-between w-full rounded-lg"
          style={{
            background: 'linear-gradient(269.83deg, rgba(156, 0, 254, 0.05) 0.14%, rgba(0, 31, 203, 0.05) 99.85%)'
          }}>

          <p>Choose Brand Color</p>

          <div className="flex pt-1 items-center gap-2 px-2 rounded-md bg-gray-100 border border-gray-200 text-gray-00 ">
            <p>{formData?.brandColour || '#00FFF'}</p>
            <ColorPicker position='right' 
              initialColor={formData?.brandColour!}
              onChange={(color)=>{
                if(setFormData){
                  setFormData((prev:AppointmentFormData)=>({
                      ...prev,
                      brandColour: color
                    }
                  ))
                }}}
            />
          </div>

        </div>
      </div>
      

      <div className="flex justify-between items-center gap-6">
        <div className="space-y-2">
          <p className='label'>Powered by Zikoro</p>
          <p className="text-wrap">Turning this off will hide powered by zikoro</p>
        </div>

        <div
          className={`flex-shrink-0 ${formData?.zikoroBranding ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-gray-300 ring-2 ring-gray-300'} w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer`}
          onClick={handleToggleZikoroBranding}
        >
          <div className="flex w-full justify-between font-semibold text-[9px]">
            <p className='text-white'>ON</p>
            <p className='text-gray-50'>OFF</p>
          </div>
          <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${formData?.zikoroBranding ? 'translate-x-7' : ''}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Branding;
