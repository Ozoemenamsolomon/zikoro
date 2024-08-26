import { cn, useClickOutside } from '@/lib';
import { ChevronDownIcon, ChevronsUpDownIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  options: string[] | Option[];
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?:string;
}

const SimpleSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  setValue,
  placeholder = 'Select',
  id,
  name,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null)

  const handleSelect = (optionValue: string) => {
    setValue(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  useClickOutside(ref, ()=>setIsOpen(false))

  return (
    <div ref={ref} className={cn("relative w-40 capitalize",className)}>
      {label && (
        <label htmlFor={id} className="mb-2 text-blue-600 font-semibold">
          {label}
        </label>
      )}
      <button
        id={id}
        name={name}
        onClick={toggleDropdown}
        disabled={disabled}
        className={`flex justify-between items-center w-full rounded-md border py-2 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 capitalize ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span>
          {(() => {
            const selectedOption = options.find(option => 
              typeof option === 'string' 
                ? option === value 
                : option.value === value
            );

            if (selectedOption) {
              return typeof selectedOption === 'string' 
                ? selectedOption 
                : selectedOption.label;
            }

            return placeholder;
          })()}
        </span>
        <ChevronsUpDownIcon size={20} className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <ul className="absolute mt-0.5 w-full rounded-md border bg-white shadow-lg z-10 text-sm">
          {options.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;

            return (
              <li
                key={index}
                onClick={() => handleSelect(optionValue)}
                className={`py-2  px-4 cursor-pointer hover:bg-gray-50 ${
                  value === optionValue ? 'bg-blue-50' : ''
                }`}
              >
                {optionLabel}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SimpleSelect;
