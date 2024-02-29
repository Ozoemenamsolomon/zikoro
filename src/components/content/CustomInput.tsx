"use client";
import { manrope } from "@/utils/fonts";

export const CustomInput: React.FC<{
  label?: string;
  name: string;
  type?: string;
  id: string;
  containerClassName?: string;
  placeholder?: string;
  accept?: string;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  multiple?: true;
  onChange?: (e: any) => void;
  fileInputRef?: any;
  onInput?: any;
  value?: string;
}> = ({
  label,
  name,
  id,
  type = "text",
  containerClassName = "",
  placeholder = "",
  accept = "",
  disabled = false,
  inputClassName,
  labelClassName,
  onChange,
  fileInputRef,
  onInput,
  value,
}) => {
  return (
    <div className={`${containerClassName} relative`}>
      <label
        htmlFor={id}
        className={`${manrope.className} ${labelClassName} font-medium block text-[12px] bg-white text-gray-700 absolute right-3 -top-2`}
      >
        {label}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        accept={accept}
        className={`h-14 px-4 w-full rounded-md border border-[#f3f3f3] sm:text-sm ${inputClassName}`}
        placeholder={placeholder}
        disabled={disabled}
        // required
        onChange={onChange}
        ref={fileInputRef}
        onInput={onInput}
        value={value}
      />
    </div>
  );
};
