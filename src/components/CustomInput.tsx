"use client";
export const CustomInput: React.FC<{
  label: string;
  type?: string;
  id: string;
  containerClassName?: string;
  placeholder: string;
  accept?: string;
  inputDivClassName?: string;
  inputClassName?: string;
}> = ({
  label,
  id,
  type = "text",
  containerClassName = "",
  placeholder = "",
  accept = "",
  inputDivClassName,
  inputClassName,
}) => {
  return (
    <div className={`${containerClassName} relative py-[10px]`}>
      <label
        htmlFor={id}
        className="block text-[12px] bg-white text-gray-700 absolute right-3 top-0.5 rounded-sm"
      >
        {label}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        accept={accept}
        className={`p-4 w-[100%] rounded-md border-2 border-[#f3f3f3] sm:text-sm ${inputClassName}`}
        placeholder={placeholder}

        // required
      />
    </div>
  );
};
