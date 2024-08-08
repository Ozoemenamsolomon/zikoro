import { UpDownArrow } from "@/constants";
import { cn } from "@/lib";
import { useClickOutside } from "@/lib/useClickOutside";
import { AppointmentFormData, AppointmentLink } from "@/types/appointments";
import { ChevronDown } from "lucide-react";
import { useRef, useState, RefObject, useEffect } from "react";

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
  className?: string;
  icon?: string;
  error?: string;
  type?:string;
  pattern?:string;
  onChange?: (name: string, value: string | number) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  setFormData,
  name,
  value,
  label,
  placeholder = 'Select',
  className,
  disabled,
  icon,
  setError,
  error,
  onChange,
  type,
  pattern,
}) => {
  const containerRef: RefObject<HTMLDivElement> = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    if(value) setInputValue(value)
  }, [value])

  const handleChange = (selectedValue: string | number) => {
    setInputValue(selectedValue.toString());
    if (onChange) {
      onChange(name, selectedValue);
    } else {
      setFormData((prev: AppointmentLink | any) => ({ ...prev, [name]: selectedValue }));
    }
    setIsOpen(false);
    setError &&
      setError((prev: AppointmentLink | any) => {
        return {
          ...prev,
          general: '',
          [name]: '',
        };
      });
  };

  useClickOutside(containerRef, () => setIsOpen(false));

  const filteredOptions = options.filter(option =>
    String(option.value).toLowerCase().includes(String(inputValue).toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(type==='number'){

    }
    setInputValue(e.target.value);
    setIsOpen(true);
    setFormData((prev:AppointmentFormData)=>{
      console.log({prev})
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  };
console.log({inputValue,value})
  return (
    <>
    <div ref={containerRef} className={cn("relative z-30", className)}>
      {label && (
        <label className="block font- mb-2" htmlFor={name}>
          {label}
        </label>
      )}
      <div className={cn("relative w-full", className)}>
        <input
          type={"text"}
          disabled={disabled}
          name={name}
          value={inputValue}
          // onChange={handleInputChange}
          onChange={(e) => {
            // Ensure the value only contains positive digits
            if(type==='number'){
              const value = e.target.value;
              e.target.value = value.replace(/\D/g, ''); // Remove non-digit characters
              handleInputChange(e);
            } else {
              handleInputChange(e);
            }
          }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(`appearance-none w-full border px-2 py-2 rounded-md focus:outline-none focus:shadow-outline focus:border-blue-500 ${
            disabled ? 'cursor-not-allowed border-gray-300 bg-gray-100' : 'border-gray-300'
          }`, className)}
          placeholder={placeholder }
          pattern={pattern||''}
        />
        <div className="absolute right-2 top-3 pointer-events-none">
          {icon ? <ChevronDown size={14} /> : <UpDownArrow  />}
        </div>
        

        {isOpen && (
          <ul className={cn(`absolute py-2 z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto hide-scrollbar`, className)}>
            {placeholder && !inputValue && (
              <li
                onClick={() => handleChange('')}
                className="cursor-pointer hover:bg-gray-200 px-4 py-1 text-gray-700"
              >
                {placeholder}
              </li>
            )}
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleChange(option.value)}
                className={`cursor-pointer capitalize hover:bg-gray-200 px-4 py- ${option.value === inputValue ? 'bg-gray-100' : ''}`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    {error ? <p className="text-red-600 text-[12px] pt-1">{error}</p> : null}
    </>
  );
};
