import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KPIData } from "@/lib/bookingsAnalytics";
import { LongArrowUp, LongArrowDown } from "styled-icons/fa-solid"; // Import LongArrowDown

export const AppointmentTable = ({
  tableData,
  isLoading,
  error,
}: {
  tableData: KPIData[];
  isLoading: boolean;
  error: string;
}) => {
  return (
    <Table className="text-center">
      <TableCaption>
        <button type="button" className="underline hover:text-zikoroBlue duration-300">
          see full analysis
        </button>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-full">Name</TableHead>
          <TableHead>Bookings</TableHead>
          <TableHead>%</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          // Loading placeholders
          [...Array(4)].map((_, idx) => (
            <TableRow key={idx} className="animate-pulse">
              <TableCell className="flex w-full gap-2 items-center">
                <div className="w-3 h-3 shrink-0 rounded-full bg-[#F9FAFF]"></div>
                <div className="w-full h-4 bg-[#F9FAFF] rounded"></div>
              </TableCell>
              <TableCell>
                <div className="w-8 h-4 bg-[#F9FAFF] rounded mx-auto"></div>
              </TableCell>
              <TableCell className=" ">
                <div className="w-10 h-4 bg-[#F9FAFF] rounded"></div>
              </TableCell>
            </TableRow>
          ))
        ) : error ? (
          // Error message
          <TableRow>
            <TableCell colSpan={3} className="text-red-500">
              {'Error occured while fetching table data.'}
            </TableCell>
          </TableRow>
        ) : (
          // Data rows
          tableData.map(({ brandColor, appointmentName, percentageChange, numberOfBookings, isIncrease }, idx) => (
            <TableRow key={idx}>
              <TableCell className="flex w-full gap-2 items-center">
                <div className="w-3 h-3 shrink-0 rounded-full" style={{ backgroundColor: brandColor }}></div>
                <div className="w-full text-start">{appointmentName}</div>
              </TableCell>
              <TableCell>{numberOfBookings}</TableCell>
              <TableCell className="flex items-center gap-1">
                {isIncrease ? (
                  <LongArrowUp size={12} className="text-green-400" />
                ) : (
                  <LongArrowDown size={12} className="text-red-400" />
                )}
                <p className={isIncrease ? "text-green-500" : "text-red-500"}>
                  {percentageChange}
                </p>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
