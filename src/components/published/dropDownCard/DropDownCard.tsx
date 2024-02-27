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
  let parentContainer = document.getElementById("parent-container");

  if (parentContainer) {
    return (
      <>
        {
          <div className="absolute top-8 left-0">
            <button className="w-full h-full fixed inset-0 z-[100]"></button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-[200px] relative z-[120] rounded-lg  shadow bg-white flex flex-col"
            >
              {refinedData.map(({ value }) => (
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
          </div>
        }
      </>
    );
  }
}
