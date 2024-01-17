import React, { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DateAndTimeAdapterProps {
  children: ReactNode;
}
export const DateAndTimeAdapter = ({ children }: DateAndTimeAdapterProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
};
