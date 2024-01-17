type DropDownType = {
  data: { value: string }[];
  name: string;
  selectedValues: string[];
  handleRadioChange: (value: string) => void;
};

export function DropDownCards({
  data,
  name,
  selectedValues,
  handleRadioChange,
}: DropDownType) {

    
  return (

    
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[200px] relative z-[120] rounded-lg  shadow bg-white flex flex-col"
    >
      {data.map(({ value }) => (
        <label
          key={value}
          className=" w-full flex  py-2 border-b  hover:bg-gray-50 relative drop-container"
        >
          <span className="text-xs sm:text-[13px]">{value}</span>
          <input
            type="checkbox"
            name={name}
            value={value}
            checked={selectedValues.includes(value)}
            onChange={() => handleRadioChange(value)}
          />
          <span className="drop-checkmark"></span>
        </label>
      ))}
    </div>
  );
}
