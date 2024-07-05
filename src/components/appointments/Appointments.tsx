"use client";

import { ChevronDown, RefreshCw, XCircle } from "lucide-react";
import React, { Suspense, useRef, useState } from "react";
import { useGetBookings } from "@/hooks/services/appointments";
import { format, parseISO } from "date-fns";
import { Booking } from "@/types/appointments";
import PageLoading from "./ui/Loading";
import NoAppointments from "./NoAppointments";
import { useEffect } from "react";
import { useClickOutside } from "@/lib";

interface GroupedBookings {
  [date: string]: Booking[];
}

const groupBookingsByDate = (bookings: Booking[]): GroupedBookings => {
  return bookings.reduce((acc: GroupedBookings, booking: Booking) => {
    const date = booking.appointmentDate;
    if (date) {
      const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(booking);
    }
    return acc;
  }, {});
};

const BookingRow = ({ booking }: { booking: Booking }) => {
  const { participantEmail, lastName, firstName, phone, appointmentDate, appointmentTime, notes, appointmentType, id } = booking;
  const dateTimeString = `${appointmentDate}T${appointmentTime}`;
  const dateTime = new Date(dateTimeString);
  return (
    <tr className="bg-white border-b">
      <td className="py-4 px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-2" style={{ background: 'linear-gradient(269.83deg, rgba(156, 0, 254, 0.12) 0.14%, rgba(0, 31, 203, 0.12) 99.85%)' }}>
            {(firstName + " " + lastName).split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-medium text-gray-800">{firstName} {lastName}</p>
            <p className="text-sm text-gray-500">{participantEmail}</p>
          </div>
        </div>
      </td>
      <td className="py-2 px-4">{format(dateTime, "hh:mm a")}</td>
      <td className="py-2 px-4">{appointmentType}</td>
      <td className="py-2 px-4">{notes}</td>
      <td className="py-2 px-4">
        <div className="flex space-x-2">
          <button className="text-blue-500 hover:text-blue-700">
            <RefreshCw size={18} />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <XCircle size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const BookingTable = ({ date, bookings }: { date: string, bookings: Booking[] }) => {
  const formattedDate = format(parseISO(date), "EEEE, d MMMM, yyyy");

  return (
    <section className="w-full bg-white rounded-lg p-6 py-8">
      <div className="flex gap-4 items-center pb-6">
        <h5 className="font-semibold">{formattedDate}</h5>
        <p>–</p>
        <p className="text-purple-600">{bookings.length} appointment(s)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="py-3 px-4 text-left text-sm font-medium">Name</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Time</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Appointment Type</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Notes</th>
              <th className="py-3 px-4 text-left text-sm font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};


const GroupedBookingSections = ({ groupedBookings }: { groupedBookings: GroupedBookings }) => (
  <div className="space-y-6">
    {Object.entries(groupedBookings).map(([date, bookings]) => (
      <BookingTable key={date} date={date} bookings={bookings} />
    ))}
  </div>
);

const Appointments: React.FC = () => {
  const { bookings, isLoading, getPastBookings,getBookings } = useGetBookings();
  const [list, setList] = useState<Booking[]>([]);
  const [drop, setDrop] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const dropRef = useRef(null)

  useClickOutside(dropRef, ()=>setDrop(false))

  useEffect(() => {
    if(filter === 'past'){
      getPastBookings();
    } else {
      getBookings()
    }
  }, [filter]);

  useEffect(() => {
    setList(bookings);
    // setLoading(isLoading);
  }, [bookings,]);

  const groupedBookings = groupBookingsByDate(list);

  return (
    <>
    <header className="flex w-full justify-between gap-4 flex-col sm:flex-row pb-10">
    <div>
      <h4 className="text-2xl font-semibold">Appointments</h4>
    </div>
    <div className="relative w-[15.5rem]">
      <div className="rounded-full w-[15.5rem] bg-basePrimary p-0.5">
        <button onClick={()=>setDrop(curr=>!curr)} className="py-2 w-full bg-white px-4 rounded-full flex justify-between gap-2 items-center text-sm">
          <p>{filter === 'upcoming' ? 'Upcoming appointments' : 'Past appointments'}</p>
          <ChevronDown size={18} className={`${drop ? 'rotate-180':' rotate-0 '} transform transition-all duration-300 ease-linear`}/>
        </button>
      </div>
      <div ref={dropRef} className={`${drop ? 'max-h-screen':'max-h-0 '} transform transition-all duration-300 ease-linear absolute right-0 w-full mt-1 bg-white rounded-md shadow-lg z-10 overflow-hidden`}>
        <ul className="py-1">
          <li
            className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer ${filter === 'upcoming' ? 'bg-gray-100' : ''}`}
            onClick={() => {
              setDrop(false)
              setFilter('upcoming')}}
          >
            Upcoming appointments
          </li>
          <li
            className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer ${filter === 'past' ? 'bg-gray-100' : ''}`}
            onClick={() => {
              setDrop(false)
              setFilter('past')}}
          >
            Past appointments
          </li>
        </ul>
      </div>
    </div>
  </header>

  <Suspense fallback={<div className="p-40 text-center">Loading...</div>}>
    {
     isLoading ? 
     <PageLoading isLoading={isLoading} />
     :
    list.length === 0 ? (
      <NoAppointments handleClick={() => setFilter('past')} />
    ) : (
      <GroupedBookingSections groupedBookings={groupedBookings} />
    )}
  </Suspense>
</>
  );
};

export default Appointments;