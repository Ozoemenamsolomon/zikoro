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
    <div className="w-full relative 3rem">
      {label && (
        <label
          className="absolute  -top-2 z-30 right-4 bg-white text-gray-600 text-tiny px-1"
          htmlFor="select"
        >
          {label}
        </label>
      )}
      <Select
        defaultValue={defaultValue}
        placeholder={placeHolder}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state?.isFocused
              ? borderColor || "#6b7280"
              : borderColor || "#e5e7eb",
            "&:hover": {
              borderColor: borderColor || "#6b7280",
            },
            height: height || "3rem",
            backgroundColor: bgColor || "#ffffff",
            boxShadow: "0px",
            borderRadius: "6px",
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
            color: placeHolderColor || "#e5e7eb",
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
      <ErrorText>{error}</ErrorText>
    </div>
  );
});
