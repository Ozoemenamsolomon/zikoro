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
  disabled?: boolean;
}> = ({
  label,
  id,
  type = "text",
  containerClassName = "",
  placeholder = "",
  accept = "",
  disabled = false,
}) => {
  return (
    <div className={`${containerClassName} relative`}>
      <label
        htmlFor={id}
        className="block text-[12px] bg-white text-gray-700 absolute right-3 -top-2 rounded-sm"
      >
        {label}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        accept={accept}
        className={`p-4 w-[100%] rounded-md border border-[#f3f3f3] sm:text-sm`}
        placeholder={placeholder}
        disabled={disabled}
        // required
      />
    </div>
  );
};
