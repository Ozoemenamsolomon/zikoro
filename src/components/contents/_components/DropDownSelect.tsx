"use client";

import { useDropBoxPosition } from "@/context";
import { useEffect, useRef } from "react";
export function DropDownSelect({
  close,
  data,
  handleChange,
  currentValue,
}: {
  data: string[] | number[] | undefined;
  close: () => void;
  handleChange: (value: string) => Promise<void>;
  currentValue: string | number;
}) {
  const { position, getBoxHeight } = useDropBoxPosition();
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure boxRef is not null before using it
    if (boxRef.current) {
      getBoxHeight(boxRef?.current?.offsetHeight, boxRef?.current?.offsetWidth );
    }
  }, [boxRef]);
  
  return (
    <div ref={boxRef} style={position} className="absolute ">
      <button className="relative-box w-full h-full z-[99999999] fixed inset-0 bg-black/10"></button>
      <ul
        role="button"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[200px] relative z-[99999999999] max-w-[250px] py-2 rounded-md shadow-md border border-gray-200  bg-white h-fit max-h-[300px] overflow-y-auto"
      >
        {data &&
          data?.map((value, index) => (
            <li className="w-full py-2 border-b">
              <label
                key={index}
                className=" w-full flex  relative partner-container"
              >
                <input
                  name="partner"
                  value={value}
                  checked={currentValue === String(value)}
                  onChange={() => handleChange(String(value))}
                  type="checkbox"
                />
                <span className="partner-checkmark"></span>
                <p className="w-full text-start text-ellipsis whitespace-nowrap overflow-hidden">
                  {value}
                </p>
              </label>
            </li>
          ))}
      </ul>
    </div>
  );
}
