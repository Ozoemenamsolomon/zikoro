import React from 'react'

const Appointments = () => {
  return (
    <>
    <header className="flex w-full justify-between gap-4 flex-col sm:flex-row pb-10">
        <div className="flex gap-6 items-center">
          <h4 className="text-2xl font-semibold">Appointments</h4>
        </div>

        <button
          className="py-2 px-6 border-2 rounded-full "
          style={{
            borderRadius: '9999px', 
            borderImage: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%) 1',
            borderImageSlice: 1,
          }}
        >
          Upcoming appointment
        </button>
      </header>

        <section className="w-full h-screen bg-gray-100 rounded-lg">
        Appointments table
        </section>
    </>
  )
}

export default Appointments