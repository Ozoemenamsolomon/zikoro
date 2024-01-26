import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage
  } from "@/components";
  import React from "react";
  
  export function InputOffsetLabel({
    children,
    label,
  }: {
    children: React.ReactNode;
    label: string;
  }) {
    return (
      <FormItem className="relative w-full">
        <FormLabel className="absolute top-0 z-30 right-4 bg-white text-gray-600 text-xs px-1">
          {label}
        </FormLabel>
        <FormControl>{children}</FormControl>
        <FormMessage />
      </FormItem>
    );
  }