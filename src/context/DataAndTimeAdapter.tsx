import React, { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DataAndTimeAdapterProps {
  children: ReactNode;
}
export const DataAndTimeAdapter = ({ children }: DataAndTimeAdapterProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
};
