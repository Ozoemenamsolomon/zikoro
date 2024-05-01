"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib";

export function DropDownSelect({
  data,
  handleChange,
  children,
  className,
  isMultiple,
}: {
  data: string[] | number[] | undefined;
  handleChange: (value: any) => Promise<void>;
  children: React.ReactNode;
  className?: string;
  isMultiple?: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [position, setPosition] = useState({ X: 0, Y: 0 });
  const [checkedValue, setCheckedValues] = useState<string[]>([]);
  useEffect(() => {
    function updateButtonLocation() {
      if (buttonRef?.current) {
        const rect = buttonRef?.current?.getBoundingClientRect();
        setPosition({
          X: Math.round(rect.x),
          Y: Math.round(rect.y),
        });
      }
    }
    // initial button location
    updateButtonLocation();

    // Update button location when the window is resized

    window.addEventListener("scroll", updateButtonLocation);

    let parentElement = buttonRef.current?.parentElement;
    while (parentElement && parentElement !== document.documentElement) {
      const overflowStyle = window.getComputedStyle(parentElement).overflow;
      if (overflowStyle === "auto" || overflowStyle === "scroll") {
        parentElement.addEventListener("scroll", updateButtonLocation);
      }
      parentElement = parentElement.parentElement;
    }

    return () => {
      let currentParent = buttonRef.current?.parentElement;
      while (currentParent && currentParent !== document.documentElement) {
        const overflowStyle = window.getComputedStyle(currentParent).overflow;
        if (overflowStyle === "auto" || overflowStyle === "scroll") {
          currentParent.removeEventListener("scroll", updateButtonLocation);
        }
        currentParent = currentParent.parentElement;
      }
      window.addEventListener("scroll", updateButtonLocation);
    };
  }, [buttonRef]);

  function onClose() {
    setOpen((prev) => !prev);
  }

  function onchangeValue(value: string) {
    if (checkedValue.includes(value)) {
      setCheckedValues(checkedValue.filter((v) => v !== value));
    } else {
      if (isMultiple) {
        console.log('vvvv',value)
        setCheckedValues((prev) => [...prev, String(value)]);
      } else {
        setCheckedValues([String(value)]);
      }
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClose}
      className={cn("w-fit relative", className)}
    >
      {children}
      <span
        onClick={(e) => {
          e.stopPropagation();
         // console.log({ checkedValue });
          if (!isMultiple && checkedValue?.length > 0) {
        
            handleChange(checkedValue?.join(","));
          }

          if (isMultiple && checkedValue?.length > 0) {
         //   console.log("is Multiple")
            handleChange(checkedValue);
          }

          setOpen(false);
        }}
        className={cn(
          "w-full h-full inset-0 fixed z-[150px] hidden",
          isOpen && "block"
        )}
      ></span>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          transform: `translate(${position.X}px, ${position.Y + 30}px)`,
        }}
        className={cn(
          "transform hidden fixed left-0 z-[200] top-0",
          isOpen && "block"
        )}
      >
        <ul
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-[200px] relative py-2 rounded-md shadow-md border border-gray-200  bg-white h-fit max-h-[250px] overflow-y-auto"
        >
          {data &&
            data?.map((value, index) => (
              <li className="w-full p-2 ">
                <label
                  key={index}
                  className=" w-full relative text-sm flex items-center gap-x-2"
                >
                  <input
                    name="partner"
                    value={value}
                    checked={checkedValue.includes(String(value))}
                    onChange={() => onchangeValue(String(value))}
                    type="checkbox"
                    className="accent-basePrimary w-4 h-4"
                  />
                  <p className="w-full text-start text-ellipsis whitespace-nowrap overflow-hidden">
                    {value}
                  </p>
                </label>
              </li>
            ))}
        </ul>
      </div>
    </button>
  );
}
