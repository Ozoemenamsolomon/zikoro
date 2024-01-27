import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage
  } from "@/components";
import { cn } from "@/lib";
  import React from "react";
  
  export function InputOffsetLabel({
    children,
    label,
    className
  }: {
    children: React.ReactNode;
    label: string;
    className?:string
  }) {
    return (
      <FormItem className={cn("relative w-full", className)}>
        <FormLabel className="absolute top-0 z-30 right-4 bg-white text-gray-600 text-xs px-1">
          {label}
        </FormLabel>
        <FormControl>{children}</FormControl>
        <FormMessage />
      </FormItem>
    );
  }