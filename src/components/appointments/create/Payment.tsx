import React, { useState } from 'react';
import { FormProps } from '@/types/appointments'; 
import { SelectInput } from '../ui/CustomSelect';
import RadioButtons from '../ui/RadioButtons';
import { FlutterWaveIcon, Paystack, Stripe } from '@/constants';
import { PlusCircle, XCircle } from 'lucide-react';

const Payment: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  handleChange,
  setErrors,
  loading,
  setLoading,
}) => {
const [drop, setDrop] = useState(false)
  const paymentGateways = [
    { name: 'Paystack', component: <Paystack /> },
    { name: 'Zikoro manage', component: <Stripe /> },
    { name: 'Stripe', component: <Stripe /> },
    { name: 'Flutterwave', component: <FlutterWaveIcon /> },
  ];

  const handleSetFormData = (gateway: string) => {
    if (setFormData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        paymentGateway: gateway,
      }));
    }
  };
  
  return (
    <div className=" space-y-6 relative ">
      <div className="">
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
      
      <div className="">
        <p className="pb-2 ">Connect your preferred payment gateway</p>
        <p className="flex gap-4 items-center pb-4 cursor-pointer text-zikoroBlue" onClick={()=>setDrop(curr=>!curr)}>
          <PlusCircle className='text-zikoroBlue' size={20}/>
          <p>Add payment method</p>
        </p>
        <div className={`${drop ? 'max-h-screen': 'max-h-0'} transform transition-all overflow-hidden duration-500 ease-in-out`}>
            <div className="grid px-20 grid-cols-2 w-full justify-center gap-4 py-12 relative rounded-md shadow bg-white border">
                <XCircle
                  size={20}
                  className="absolute right-6 text-gray-400 top-6 cursor-pointer"
                  onClick={() => setDrop(false)}
                />
                {paymentGateways.map((gateway) => (
                  <div
                    key={gateway.name}
                    onClick={() => handleSetFormData(gateway.name)}
                    className={`${formData?.paymentGateway === gateway.name ? 'border-gray-400 border-2' : 'border-2'} cursor-pointer w-full flex justify-center p-4 rounded-md hover:shadow-md duration-300`}
                  >
                    {gateway.component}
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
