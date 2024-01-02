"use client";
export const CustomTextBox: React.FC<{
  label: string;
  id: string;
  value?: string;
  name: string;
}> = ({ label, id, value, name }) => {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-[12px]  bg-white text-gray-700 absolute right-2 -top-3 p-1 rounded-sm"
      >
        {label}
      </label>
      <div className="mt-1">
        <textarea
          id={id}
          name={name}
          rows={4}
          placeholder="Write a text"
          value={value}
          className="p-5 w-[100%] rounded-md border border-[#f3f3f3] sm:text-sm"
          // required
        />
      </div>
    </div>
  );
};
