import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";

export default function InputOffsetLabel({
  children,
  label,
  isRequired,
  append,
  prepend,
}: {
  children: React.ReactNode;
  label: string;
  isRequired?: boolean;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
}) {
  return (
    <FormItem className="relative w-full">
      <FormLabel className="absolute top-0 z-10 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
        {label}
        {isRequired && <sup className="text-red-700">*</sup>}
      </FormLabel>
      {append && (
        <div className="absolute !my-0 left-2 z-10 h-full flex items-center">
          {append}
        </div>
      )}
      {prepend && (
        <div className="absolute !my-0 right-2 z-10 h-full flex items-center">
          {prepend}
        </div>
      )}
      <FormControl className="!mt-0">
        <div
          className={`${append ? "[&>*]:pl-8" : ""} ${
            prepend ? "[&>*]:pr-8" : ""
          }`}
        >
          {children}
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  );
}
