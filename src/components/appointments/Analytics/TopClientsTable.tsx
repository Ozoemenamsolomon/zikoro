import * as React from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionOneProps } from "./SectionOne"
import { Booking } from "@/types/appointments"

interface ClientBooking {
  name: string
  email: string
  timesBooked: number
}

// Function to calculate top clients based on current data
const calculateTopClients = (data: Booking[]): ClientBooking[] => {
  const clientMap: Record<string, ClientBooking> = {}

  data.forEach(({ firstName, lastName, participantEmail }) => {
    const key = participantEmail!
    if (clientMap[key]) {
      clientMap[key].timesBooked += 1
    } else {
      clientMap[key] = { 
        name: firstName! + ' ' + lastName,
        email: participantEmail!,
        timesBooked: 1,
      }
    }
  })

  // Convert map to array and sort by timesBooked in descending order
  return Object.values(clientMap).sort((a, b) => b.timesBooked - a.timesBooked)
}

export const TopClients: React.FC<SectionOneProps> = ({
  isLoading,
  type,
  error,
  current,
  previous,
}) => {
  const topClients = React.useMemo(() => calculateTopClients(current), [current])
console.log({topClients, current})
  return (

    <Table className="text-center">
      
      <TableHeader className="   rounded-t-lg overflow-hidden" 
      style={{
        background: 'linear-gradient(269.83deg, rgba(156, 0, 254, 0.02) 0.14%, rgba(0, 31, 203, 0.02) 99.85%)',
      }}
      >
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead className="w-full"> Name</TableHead>
          <TableHead className="shrink-0 text-nowrap whitespace-nowrap">Times Booked</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
        isLoading ? (
          [...Array(4)].map((_, idx) => (
            <TableRow key={idx} className="animate-pulse">
              <TableCell className="">
                <div className="w-4 h-3 shrink-0 rounded-full bg-[#F9FAFF]"></div>
              </TableCell>
              <TableCell>
                <div className="w-full h-4 bg-[#F9FAFF] rounded mx-auto"></div>
              </TableCell>
              <TableCell className=" ">
                <div className="w-10 h-4 bg-[#F9FAFF] rounded"></div>
              </TableCell>
            </TableRow>
          ))
        ) : error ? (
          <TableRow className=" py-20">
            <TableCell className=""></TableCell>
              <TableCell className="flex justify-center items-center w-full text-red-500">
                <p>{error}</p>
              </TableCell>
            <TableCell className=""></TableCell>
         </TableRow>
        ) : 
        topClients.map((client, index) => (
          <TableRow key={client.email}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <div className="w-full text-start">
                <h5>{client.name}</h5>
                <p className="leading-none text-muted-foreground">{client.email}</p>
              </div>
            </TableCell>
            <TableCell>{client.timesBooked}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
