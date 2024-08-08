import { cn } from '@/lib';
import { AppointmentFormData } from '@/types/appointments';
import React, { useState } from 'react';

interface Props {
  formData: any; // Replace with your specific type if possible
  setFormData: React.Dispatch<React.SetStateAction<any>>; // Replace with your specific type if possible
  label: string;
  placeholder?: string;
  inputType: string;
  formField: string;
  formError: string;
  className?: string;
}

const AddMultipleInput: React.FC<Props> = ({
  formData,
  setFormData,
  label,
  placeholder,
  inputType,
  formField,
  formError,
  className,
}) => {
  const [data, setData] = useState('');
  const [error, setError] = useState(false);

  const addData = () => {
    if (data.trim().length > 0) {
      const newDataList = formData[formField]
        ? `${formData[formField]}, ${data}`
        : data;
      setFormData((prev:AppointmentFormData) => ({
        ...prev,
        [formField]: newDataList,
      }));
      setData('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const removeData = (selected: string) => {
    const newDataList = formData[formField]
      ?.split(', ')
      .filter((item:string) => item !== selected)
      .join(', ');

    setFormData((prev:AppointmentFormData) => ({
      ...prev,
      [formField]: newDataList || '',
    }));
  };

  return (
    <div className="">
      <p className="pb-2">{label}</p>
      <div className={`${error ? 'ring-2 ring-red-600' : ''} flex rounded-md gap-2 items-center border p-1`}>
        <input
          type={inputType}
          className={cn(
            " flex-1 rounded-md bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          value={data}
          placeholder={placeholder}
          onChange={(e) => {
            setError(false);
            setData(e.target.value);
          }}
        />
        <div
          onClick={addData}
          className="cursor-pointer rounded-md flex-shrink-0 text-white bg-yellow-500 hover:bg-yellow-600 py-2 px-6"
        >
          Invite
        </div>
      </div>
      {formError && <small className="text-red-600 pt-1">{formError}</small>}


      {formData[formField] ? (
        <div className="space-y-2 pt-2">
          {formData[formField] && formData[formField]?.split(', ').map((item:string, idx:number) => (
            <div
              key={idx}
              className="flex max-w-lg justify-between gap-6 items-center h-12 py-1 px-2 border rounded bg-gray-300/10"
            >
              <p>{item}</p>
              <p
                onClick={() => removeData(item)}
                className="text-red-600 text-sm cursor-pointer"
              >
                Remove
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AddMultipleInput;
