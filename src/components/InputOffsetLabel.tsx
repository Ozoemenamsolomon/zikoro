import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import {cn} from "@/lib"

export default function InputOffsetLabel({
  children,
  label,
  isRequired,
  append,
  prepend,
  className
}: {
  children: React.ReactNode;
  label: string;
  isRequired?: boolean;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?:string
}) {
  return (
    <FormItem className={cn("relative space-y-4 w-full",className)}>
      <FormLabel className=" text-gray-600">
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
          }  border border-basePrimary rounded-md p-[0.2rem]`}
        >
          <div className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500">
            {children}
          </div>
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  );
}
