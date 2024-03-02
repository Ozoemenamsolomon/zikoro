"use client";

import Select from "react-select";
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
  isMulti?: boolean;
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
    error,
    placeHolder,
    defaultValue,
    isMulti,
    ...controllerProps
  } = props;
  const {
    field: { onChange },
  } = useController(controllerProps) as UseControllerReturn<FieldValues>;

  return (
    <div className="w-full relative 3rem">
      <label
        className="absolute -top-2 z-30 right-4 bg-white text-gray-600 text-xs px-1"
        htmlFor="select"
      >
        {label}
      </label>

      <Select
        defaultValue={defaultValue}
        placeholder={placeHolder}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state?.isFocused ? "#6b7280" : "#e5e7eb",
            "&:hover": {
              borderColor: "#6b7280",
            },
            height: "3rem",
            backgroundColor: "#ffffff",
            boxShadow: "0px",
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
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            textAlign: "start",
            color: "#e5e7eb",
            fontSize: "13px",
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "6px",
            zIndex: 100,
          }),
        }}
        options={options}
        onChange={(newValue) => onChange(newValue?.value)}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  );
});
