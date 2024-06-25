import React, { useState } from 'react';
import { FormProps } from '@/types/appointments'; 
import { InputCustom } from '@/components/ui/input-custom';
import { MapPin, Plus, PlusCircle } from 'lucide-react';
import { EditPenIcon, GoogleMeetIcon, ZoomIcon } from '@/constants';
import RadioButtons from '../ui/RadioButtons';
import { SelectInput } from '../ui/CustomSelect';

const AppointmentDetails: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
  handleChange,
}) => {
  const [isPaidAppointment, setIsPaidAppointment] = useState(false)
  // const [isOnsite, setIsVirtual] = useState(formData?.loctionType || 'Onsite')
  return (
    <div className=" space-y-4">
      <div className='flex gap-3 items-end'>
        <div className='flex-1 '>
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
        <div className="bg-zikoroBlue rounded-md h-12 w-12 shrink-0">
          {/* color picker */}
        </div>
      </div>

      <div className="flex gap-4 justify-between items-center">
        <div className="flex-1">
          <h5 className="text-lg font-medium">Make this a paid appointment</h5>
          <p className="text-sm text-gray-600">Guests will be charged to book this appointment</p>
        </div>
        <div className="shrink-0" onClick={()=>setIsPaidAppointment(curr=>!curr)}>
          ON
        </div>
      </div>

      <div className={`${isPaidAppointment ? 'max-h-screen':'max-h-0'} overflow-hidden transform  transition-all duration-300 pb-4`}>
        <p className='pb-2'>Set pricing and currency</p>
        <div className="flex gap-8 items-center">
            <SelectInput
              name='amount'
              value={formData?.amount || ''}
              options={[
                {label:'20',value:20},
                {label:'40',value:40},
                {label:'60',value:60},
                {label:'80',value:80},
                {label:'100',value:100},
              ]}
              setFormData={setFormData!}
              setError={setErrors}
              placeholder='select'
              className='w-32'
            />
            <SelectInput
              name='curency'
              value={formData?.curency || ''}
              options={[
                {label:'USD',value:'USD'},
                {label:'CAD',value:'CAD'},
                {label:'EUR',value:'EUR'},
                {label:'NGN',value:'NGN'},
                {label:'AUD',value:'AUD'},
              ]}
              setFormData={setFormData!}
              placeholder='select'
              className='w-32'
              setError={setErrors}
            />
      </div>


      </div>

      <div className="rounded-md space-y-4 bg-slate-50 border relative p-4 pt-6 ">
            <h5 className="text-lg font-medium px-1 bg-slate-5 absolute -top-4 left-3">Category 1</h5>
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

            <div className="flex gap-4 justify-between items-center">
              <div className="flex-1">
                <h5 className="text-lg font-medium">Make this a paid appointment</h5>
                <p className="text-sm text-gray-600">Guests will be charged to book this appointment</p>
              </div>
              <div className="shrink-0" onClick={()=>setIsPaidAppointment(curr=>!curr)}>
                  ON
              </div>
            </div>

            <div className={`${isPaidAppointment ? 'max-h-screen':'max-h-0'} overflow-hidden transform  transition-all duration-300 pb-4`}>
              <p className='pb-2'>Set pricing and currency</p>
              <div className="flex gap-8 items-center">
                  <SelectInput
                    name='amount'
                    value={formData?.amount || ''}
                    options={[
                      {label:'20',value:20},
                      {label:'40',value:40},
                      {label:'60',value:60},
                      {label:'80',value:80},
                      {label:'100',value:100},
                    ]}
                    setFormData={setFormData!}
                    setError={setErrors}
                    placeholder='select'
                    className='w-32'
                  />
                  <SelectInput
                    name='curency'
                    value={formData?.curency || ''}
                    options={[
                      {label:'USD',value:'USD'},
                      {label:'CAD',value:'CAD'},
                      {label:'EUR',value:'EUR'},
                      {label:'NGN',value:'NGN'},
                      {label:'AUD',value:'AUD'},
                    ]}
                    setFormData={setFormData!}
                    placeholder='select'
                    className='w-32'
                    setError={setErrors}
                  />
            </div>
            </div>
      </div>

      <div onClick={()=>console.log('cccccc')} className="text-zikoroBlue flex gap-2 pt-2 items-center">
          <PlusCircle size={14}/>
          <p>Create Appointment Category</p>
      </div>

      {/* <div>
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
      </div> */}

      <div>
        <SelectInput
          name='duration'
          value={formData?.duration || ''}
          options={[
            {label:'20',value:20},
            {label:'40',value:40},
            {label:'60',value:60},
            {label:'80',value:80},
            {label:'100',value:100},
          ]}
          setFormData={setFormData!}
          setError={setErrors}
          placeholder='select'
          className='w-32'
        />
        {/* <InputCustom
          label='Duration in minutes'
          type='number'
          error={errors?.duration}
          name='duration'
          value={formData?.duration || ''}
          placeholder=''
          className='py-6 w-40'
          onChange={handleChange}
        /> */}
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
          name='loctionType'
          />
      </div>
      
     {
      formData?.loctionType==='Onsite' ? 
        <div className={` flex gap-2 items-center `}>
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
          :
          <div className={`space-y-`}>
            
            <div className="pb-2 flex gap-4 items-center ">
              <div 
              onClick={ () => setFormData({
                ...formData,
                locationDetails: 'Google Meet',
              })}
              className={`${formData?.locationDetails==='Google Meet' ? 'border-gray-700':''} border cursor-pointer p-4 rounded-md flex items-center gap-4 text-xl `}>
                <GoogleMeetIcon/>
                <p>Google Meet</p>
              </div>
              <div 
              onClick={ () => setFormData({
                ...formData,
                locationDetails: 'Zoom',
              })}
              className={`${formData?.locationDetails==='Zoom' ? 'border-gray-700':''} border cursor-pointer p-4 rounded-md flex items-center gap-4 text-xl `} >
                  <ZoomIcon/>
                  <p>Zoom</p>
              </div>
            </div>

            <p className="">You haven’t configured your google meet yet,</p>
            <p className="cursor-pointer text-zikoroBlue">Click here to do that now.</p>
          </div>
      }

      <div className=" gap-2 items-center">
        {/* <EditPenIcon size='20'/> */}
        <InputCustom
          type='text'
          label='Appointment Description (optional)'
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
