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

        <button
          className="py-2 px-6 border-2"
          style={{
            borderRadius: '9999px', // Manually set a large border-radius
            borderImage: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%) 1',
            borderImageSlice: 1,
          }}
        >
          Month view
        </button>
      </header>

      <section className="w-full h-screen bg-gray-100 rounded-lg">
        Calendar
      </section>
    </>
  );
};

export default AppointmentCalender;
