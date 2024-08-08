import { ArrowDownIcon } from '@/constants';
import React, { useState } from 'react';
import { FormProps } from '@/types/appointments'; 

interface DetailsProps extends FormProps {
  title: string;
  icon: JSX.Element;
  description: string;
  formComponent: JSX.Element;
}

const Details: React.FC<DetailsProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
  title,
  icon,
  description,
  formComponent,
}) => {
  const [drop, setDrop] = useState(false);

  return (
    <>
      {
        title==='Payment' && !formData?.isPaidAppointment ?
        null
        :
        <>
            <div
            onClick={() => setDrop(!drop)}
            className="p-4 flex rounded-md gap-6 justify-between items-center cursor-pointer"
            style={{
              background: `linear-gradient(269.83deg, rgba(156, 0, 254, 0.1) 0.14%, rgba(0, 31, 203, 0.1) 99.85%)`,
            }}
          >
            <div className="flex gap-3 justify-between items-center">
              <div>{icon}</div>
              <div className="space-y-">
                <h5 className="text-xl font-medium">{title}</h5>
                <p className="text-[#828282] text-[14px]">{description}</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${drop ? 'rotate-180' : 'rotate-0'} flex-shrink-0`}>
              <ArrowDownIcon h={14} w={14} color='#828282' className='flex-shrink-0'/>
            </div>
            </div>

            <div
          className={`transition-all duration-300  ${drop ? 'max-h-[1000rem] ease-in hide-scrollbar overflow-aut' : 'max-h-0 ease-out overflow-hidden'} `}
        >
          <div className="px-4 py-8">
            {formComponent}
          </div>
            </div>
        </>
    }
    </>
  );
};

export default Details;
