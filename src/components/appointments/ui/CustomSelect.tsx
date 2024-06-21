import { UpDownArrow } from "@/constants";
import { cn } from "@/lib";
import { useClickOutside } from "@/lib/useClickOutside";
import { AppointmentLink } from "@/types/appointments";
import { ArrowDown, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, RefObject } from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectInputProps {
  options: Option[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  name: string;
  value: string | number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  setError?: React.Dispatch<React.SetStateAction<any>>;
  addNewItem?: any;
  className?: string;
  icon?: string
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  setFormData,
  name,
  value,
  label,
  placeholder='select',
  className,
  disabled,icon,
  setError,
  addNewItem,
}) => {
  const containerRef: RefObject<HTMLDivElement> = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (selectedValue: string | number) => {
    setFormData((prev: AppointmentLink | any) => ({ ...prev, [name]: selectedValue }));
    setIsOpen(false);
    // setSave && setSave(true);
    setError &&
      setError((prev: AppointmentLink | any) => {
        return {
          ...prev,
          general: '',
          [name]: '',
        };
      });
  };

  useClickOutside(containerRef, ()=>setIsOpen(false))

  const handleAddNewItem = () => {
    addNewItem && addNewItem();
    setIsOpen(false);
  };
  return (
    <div ref={containerRef} className={cn("relative z-30", className)}>
      {label && (
        <label className="block font- mb-2" htmlFor={name}>
          {label}
        </label>
      )}
      <div className={cn("relative w-full", className)}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(`flex justify-between items-center gap-4 appearance-none w-full border  px-2 py-2 rounded-md focus:outline-none focus:shadow-outline focus:border-blue-500 ${
            disabled ? 'cursor-not-allowed border-gray-300 bg-gray-100' : 'border-gray-300'
          }`, className )}
        >
          <p>{value ? (options.find((option) => option.value === value)?.label) : placeholder}</p>
            {
              icon ? <ChevronDown size={14}/> : 
            <UpDownArrow/>
            }
        </button>
        {isOpen && (
          <ul className={cn(` absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto `, className)}>
            {placeholder && !value && (
              <li
                onClick={() => handleChange('')}
                className="cursor-pointer hover:bg-gray-200 px-4 py-2 text-gray-700"
              >
                {placeholder}
              </li>
            )}
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleChange(option.value)}
                className={`cursor-pointer capitalize hover:bg-gray-200 px-4 py-1 ${
                  option.value === value ? 'bg-gray-100' : ''
                }`}
              >
                {option.label}
              </li>
            ))}
            {
            addNewItem && 
            <div className="p-2 hover:bg-blue-500/30 text-blue-500 cursor-pointer" onClick={handleAddNewItem}>
              Add new item
            </div>
          }
          </ul>
        )}
      </div>
    </div>
  );
};
