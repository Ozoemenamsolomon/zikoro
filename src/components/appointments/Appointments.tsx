"use client";

import { ChevronDown } from "lucide-react";
import React, { Suspense } from "react";
import { RefreshCw, XCircle } from "lucide-react";
import { useGetAppointments } from "@/hooks/services/appointments";

const Appointments = () => {
  const { appointments, isLoading } = useGetAppointments();

  const data = [
    {
      id: 1,
      name: "John Doe",
      time: "10:30 AM – 12:30 PM",
      category: "Meeting",
    },
    {
      id: 2,
      name: "Jane Smith",
      time: "01:00 PM – 02:00 PM",
      category: "Work",
    },
    {
      id: 3,
      name: "Mike Johnson",
      time: "03:00 PM – 04:00 PM",
      category: "Call",
    },
    {
      id: 4,
      name: "Anna Brown",
      time: "05:00 PM – 06:00 PM",
      category: "Review",
    },
  ];

  return (
    <>
      <header className="flex w-full justify-between gap-4 flex-col sm:flex-row pb-10">
        <div className="">
          <h4 className="text-2xl font-semibold">Appointments</h4>
        </div>

        <div className="rounded-full bg-basePrimary p-0.5">
          <button className="py-2 bg-white px-4  rounded-full flex gap-2 items-center text-sm">
            <p>Upcoming appointment</p>
            <ChevronDown size={18} />
          </button>
        </div>
      </header>

      <section className="w-full h-screen bg-white rounded-lg p-6 py-8">
        <Suspense
          fallback={<div className="p-40 text-center ">Loading...</div>}
        >
          <div className="flex gap-4 items-center pb-6">
            <h5 className="font-semibold">Monday, 6 May, 2024 </h5>
            <p>–</p>
            <p className="text-purple-600">6 appointments</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b text-[12px]">
                  <th className="py-3 px-4 lex text-start justify-start">
                    Time
                  </th>
                  <th className="py-3 px-4 lex text-start justify-start">
                    Name
                  </th>
                  <th className="py-3 px-4 lex text-start justify-start">
                    Category
                  </th>
                  <th className="py-3 px-4 lex text-start justify-start"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? "" : "bg-purple-50 "
                    } rounded-full `}
                  >
                    <td className="py-2 px-4 ">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-14 w-14 rounded-full bg-[#D9D9D9] flex items-center justify-center text text-gray-600 mr-2 font-semibold">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 ">{item.time}</td>
                    <td className="py-2 px-4 ">{item.category}</td>
                    <td className="py-2 px-4 sticky ">
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
                ))}
              </tbody>
            </table>
          </div>
        </Suspense>
      </section>
    </>
  );
};

export default Appointments;
