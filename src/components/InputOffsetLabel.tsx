import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function InputOffsetLabel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <FormItem className="relative">
      <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
        {label}
      </FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
