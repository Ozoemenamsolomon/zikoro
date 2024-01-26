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
}: {
  children: React.ReactNode;
  label: string;
  isRequired?: boolean;
}) {
  return (
    <FormItem className="relative">
      <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
        {label}
        {isRequired && <sup className="text-red-700">*</sup>}
      </FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
