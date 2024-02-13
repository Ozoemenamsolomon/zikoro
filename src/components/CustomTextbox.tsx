"use client";
import { manrope } from "@/lib/fonts";

export const CustomTextBox: React.FC<{
  label: string;
  id: string;
  value?: string;
  name: string;
  placeholder?: string;
}> = ({ label, id, value, name, placeholder }) => {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`${manrope.className} font-medium block text-[12px] px-2 bg-white text-[#3E404B]  absolute right-3 -top-2 rounded-sm`}
      >
        {label}
      </label>
      <div className="mt-1">
        <textarea
          id={id}
          name={name}
          rows={4}
          placeholder={placeholder}
          value={value}
          className="p-5 w-[100%] rounded-md border border-[#f3f3f3] sm:text-sm text-[#3E404B] "
          required
        />
      </div>
    </div>
  );
};
