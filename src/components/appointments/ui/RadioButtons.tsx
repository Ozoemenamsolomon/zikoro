import React from 'react';


interface CustomRadioButtonProps {
    name: string;
    value: string;
    label: string | any;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({ name, value, label, checked, onChange }) => {
    return (
      <label className="flex items-center space-x-1 cursor-pointer">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <span className={`inline-block w-3 h-3 ring-1 ring-offset-1 ring-gray-400 rounded-full border ${checked ? 'bg-gray-700 ' : 'bg-white'}`}></span>
        <span className="text-gray-700 pl-3">{label}</span>
      </label>
    );
  };
  

  interface LocationTypeProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label2?: any
    label1?: any
    name: string
    value1?: any
    value2?: any
  }
  
  const RadioButtons: React.FC<LocationTypeProps> = ({ formData, handleChange, label2,label1 ,name,value1, value2}) => {
    return (
      <div className="flex space-x-12">
        <CustomRadioButton
          name={name}
          value={value1}
          label={label1}
          checked={formData[name] === value1}
          onChange={handleChange}
        />
        <CustomRadioButton
          name={name}
          value={value2}
          label={label2}
          checked={formData[name] === value2}
          onChange={handleChange}
        />
      </div>
    );
  };
  
  export default RadioButtons;
