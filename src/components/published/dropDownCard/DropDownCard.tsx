"use client";

import ReactDOM from "react-dom";
import _ from "lodash";

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
  let refinedData = _.uniqBy(data, "value");

  return (
    <>
      {
        <div className="absolute top-12 right-0">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[200px] relative z-[120] rounded-lg  shadow bg-white flex flex-col"
          >
            {refinedData.map(({ value }) => (
              <label
                key={value}
                className=" w-full  p-2 border-b gap-x-2 flex items-center hover:bg-gray-50 relative "
              >
                <input
                  type="checkbox"
                  className="accent-basePrimary h-3 w-3"
                  name={name}
                  value={value}
                  checked={selectedValues.includes(value)}
                  onChange={() => handleRadioChange(value)}
                />
                <span className="text-[13px]">{value}</span>
              </label>
            ))}
          </div>
        </div>
      }
    </>
  );
}
