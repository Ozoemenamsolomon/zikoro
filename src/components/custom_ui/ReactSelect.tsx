"use client";

import Select from "react-select";
import {cn} from "@/lib"
import * as React from "react";
import {
  UseControllerProps,
  UseControllerReturn,
  useController,
  FieldValues,
} from "react-hook-form";

interface SelectProps<T extends FieldValues> extends UseControllerProps<T> {
  options: { value: string; label: string }[];
  error?: string;
  label?: string;
  placeHolder: string;
  bgColor?: string;
  height?: string;
  borderColor?: string;
  placeHolderColor?: string;
}
function ErrorText({ children }: { children?: string }) {
  return (
    <div>
      {children && <p className="pt-1 text-xs text-red-500 ">{children}</p>}
    </div>
  );
}

export const ReactSelect = React.forwardRef<
  HTMLSelectElement,
  SelectProps<FieldValues>
>((props, ref) => {
  const {
    label,
    options,
    bgColor,
    height,
    borderColor,
    placeHolderColor,
    error,
    placeHolder,
    defaultValue,
    ...controllerProps
  } = props;
  const {
    field: { onChange },
  } = useController(controllerProps) as UseControllerReturn<FieldValues>;

  return (
    <div className="w-full relative ">
      {/* {label && (
        <label
          className=" text-gray-600 mb-4 text-sm "
          htmlFor="select"
        >
          {label}
        </label>
      )} */}
     <div className={cn("w-full h-[2.75rem]", height)}>
     <Select
        defaultValue={defaultValue}
        placeholder={placeHolder}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            // borderColor: state?.isFocused
            //   ?"#818cf8"
            //   :  "#818cf8",
            // "&:hover": {
            //   borderColor: borderColor || "#6b7280",
            // },
            height: "100%",
           // backgroundColor: bgColor || "#ffffff",
            boxShadow: "0px",
            borderRadius: "6px",
            backgroundImage: 'linear-gradient(to right, #001FCC19 0%, #9D00FF19 100%)',
            border: '0px'
          }),

          option: (baseStyles, state) => ({
            ...baseStyles,
            textAlign: "start",
            color: state?.isSelected ? "black" : "black",
            backgroundColor: state?.isFocused ? "#e2e8f0" : "",
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            textAlign: "start",
            textDecoration: "capitalize",
            fontSize: "13px",
            padding: "4px",
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            textAlign: "start",
            color: '#6b7280',
            fontSize: "13px",
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "6px",
            zIndex: 100,
            fontSize: "13px",
          }),
          dropdownIndicator: (baseStyle) => ({
            ...baseStyle,
            borderRight: "0px",
          }),
          indicatorSeparator: (baseStyle) => ({
            ...baseStyle,
            width: "0px",
          }),
        }}
        options={options}
        onChange={(newValue) => onChange(newValue?.value)}
      />

     </div>
      <ErrorText>{error}</ErrorText>
    </div>
  );
});
