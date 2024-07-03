import React, { useState } from 'react';
import { AppointmentFormData, AppointmentLink, FormProps } from '@/types/appointments'; 
import { InputCustom } from '@/components/ui/input-custom';
import { MapPin, Plus, PlusCircle } from 'lucide-react';
import { EditPenIcon, GoogleMeetIcon, ZoomIcon } from '@/constants';
import RadioButtons from '../ui/RadioButtons';
import { SelectInput } from '../ui/CustomSelect';
import ColorPicker from '../ui/ColorPicker';
import { useAppointmentContext } from '../context/AppointmentContext';

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
  const {selectedType} = useAppointmentContext()

  return (
    <div className=" space-y-6">
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
        {/* <ColorPicker 
          position='right' 
          onChange={(color)=>{
            if(setFormData){
              setFormData((prev:AppointmentFormData)=>({
                  ...prev,
                  brandColour: color
                }
              ))
            }}}
        /> */}
      </div>

     

      <div>
        <p className='label'>Duration in minutes</p>
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
          className='w-48'
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
                onClick={ () => {
                  if(setFormData){
                    setFormData((prev:AppointmentFormData) => ({
                      ...prev,
                      locationDetails: 'Google Meet',
                    }))}
                  }}
                className={`${formData?.locationDetails==='Google Meet' ? 'border-gray-400 border-2':'border'}  cursor-pointer p-4 rounded-md flex items-center gap-4 text-xl `}>
                  <GoogleMeetIcon/>
                  <p>Google Meet</p>
                </div>
                <div 
                onClick={ () => {
                  if(setFormData){
                    setFormData((prev:AppointmentFormData) => ({
                      ...prev,
                      locationDetails: 'Zoom',
                    }))}
                  }}
                className={`${formData?.locationDetails==='Zoom' ? 'border-gray-400 border-2':'border'} border cursor-pointer p-4 rounded-md flex items-center gap-4 text-xl `} >
                    <ZoomIcon/>
                    <p>Zoom</p>
                </div>
              </div>

              <p className="">You haven’t configured your google meet yet,</p>
              <p className="cursor-pointer text-zikoroBlue">Click here to do that now.</p>
            </div>
        }

        

        { selectedType==='single' ?
          <>
            <div className="flex gap-4 justify-between items-center">
            <div className="flex-1">
              <h5 className="label">Make this a paid appointment</h5>
              <p className="text-sm text-gray-600">Guests will be charged to book this appointment</p>
            </div>
            <div
                className={` flex-shrink-0 ${isPaidAppointment ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-gray-300 ring-2 ring-gray-300'} mr- w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer `}
                onClick={()=>setIsPaidAppointment(curr=>!curr)}
            >   
                <div className="flex w-full justify-between font-semibold text-[9px]"> <p className='text-white'>ON</p><p className='text-gray-50'>OFF</p>  </div>
                <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${isPaidAppointment ? 'translate-x-7' : ''}`}></div>
            </div>
            </div> 

            <div className={`${isPaidAppointment ? 'max-h-screen visible':'max-h-0 invisible overflow-hidden'}  relative z-30 transform  transition-all duration-300 pb-4`}>
              <p className='pb-2 label'>Set curency and pricing</p>
              <div className="flex gap-8 items-center">
                  
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
                    className='w-32 z-50 '
                    setError={setErrors}
                  />
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
                    className='w-32 z-50 '
                  />
              </div>
            </div>

            <div className=" gap-2 items-center">
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
          </>
          :null
        }

        {
          selectedType === 'multiple' ? 
          <>
          <div>
            <div className="rounded-md space-y-4 bg-slate-50 border relative p-4 pt-6 ">
                  <h5 className="label px-1 bg-slate-5 absolute -top-3 bg-slate-50 left-3 ">Appointment Type 1</h5>
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
                    <div
                        className={` flex-shrink-0 ${isPaidAppointment ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-gray-300 ring-2 ring-gray-300'} mr- w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer `}
                        onClick={()=>setIsPaidAppointment(curr=>!curr)}
                    >   
                        <div className="flex w-full justify-between font-semibold text-[9px]"> <p className='text-white'>ON</p><p className='text-gray-50'>OFF</p>  </div>
                        <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${isPaidAppointment ? 'translate-x-7' : ''}`}></div>
                    </div>
                  </div>

                  <div className={`${isPaidAppointment ? 'max-h-screen visible':'max-h-0 invisible  overflow-hidden' } transform relative z-10 transition-all duration-300 pb-`}>
                    <p className='pb-2'>Set currency and pricing</p>
                    <div className="flex gap-8 items-center">
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
                          className='w-32 z-20'
                          setError={setErrors}
                        />
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
                          className='w-32 z-20'
                        />
                        
                  </div>
                  </div>

                  <div className="pb-2 gap-2 items-center">
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
          </div>

          <div onClick={()=>console.log('cccccc')} className="text-zikoroBlue flex gap-2 pt-2 items-center">
              <PlusCircle size={14}/>
              <p>Create Appointment Category</p>
          </div>
          </>
          : null
        }

    </div>
  );
};

export default AppointmentDetails;
