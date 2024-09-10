"use client";
import React, { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

interface DateAndTimeAdapterProps {
  children: ReactNode;
}
export const DateAndTimeAdapter = ({ children }: DateAndTimeAdapterProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {children}
    </LocalizationProvider>
  );
};
