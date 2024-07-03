"use client";

import { ChevronDown, RefreshCw, XCircle } from "lucide-react";
import React, { Suspense } from "react";
import { useGetBookings } from "@/hooks/services/appointments";
import { format, parseISO } from "date-fns";
import { Booking } from "@/types/appointments";
import PageLoading from "./ui/Loading";

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
  const { participantEmail, lastName, firstName, phone, appointmentDate, appointmentTime, appointmentType, id } = booking;
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

const Appointments = () => {
  const { bookings, isLoading } = useGetBookings();
  console.log({bookings})

  if (isLoading) {
    return <PageLoading isLoading={isLoading}/>;
  }

  const groupedBookings = groupBookingsByDate(bookings);

  return (
    <>
      <header className="flex w-full justify-between gap-4 flex-col sm:flex-row pb-10">
        <div>
          <h4 className="text-2xl font-semibold">Appointments</h4>
        </div>
        <div className="flex justify-end">
          <div className="rounded-full bg-basePrimary p-0.5">
            <button className="py-2 bg-white px-4 rounded-full flex gap-2 items-center text-sm">
              <p>Upcoming appointment</p>
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </header>

      <Suspense fallback={<div className="p-40 text-center">Loading...</div>}>
        <GroupedBookingSections groupedBookings={groupedBookings} />
      </Suspense>
    </>
  );
};

export default Appointments;
