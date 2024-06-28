import { ChevronDown } from 'lucide-react';
import React from 'react';

const AppointmentCalender = () => {
  return (
    <>
      <header className="flex w-full justify-between gap-4 flex-col sm:flex-row pb-10">
        <div className="flex gap-6 items-center">
          <h4 className="text-2xl font-semibold">May 2024</h4>
          <p className="">-</p>
          <p
            className="font-semibold"
            style={{
              background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            12 meetings
          </p>
        </div>

        <div className="flex justify-end">
          <div className="rounded-full bg-basePrimary p-0.5">
              <button
                className="py-2 bg-white px-4  rounded-full flex gap-2 items-center text-sm"
              >
                <p>Month view</p><ChevronDown size={18}/>
              </button>
          </div>
        </div>
      </header>

      <section className="w-full h-[50vh] bg-gray-100 rounded-lg">
        Calendar
      </section>
    </>
  );
};

export default AppointmentCalender;
