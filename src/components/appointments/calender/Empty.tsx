import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Empty = () => {
  return (
    <section className="w-full min-h-screen relative pt-40 ">
    <div className='absolute top-0 w-full h-full overflow-hidden'>
      <Image src={'/calender.png'} alt='calender' width={800} height={700} className='h-full w-full object-cover' />
    </div> 

    <div className="relative max-w-xl mx-auto p-6 flex flex-col text-center  items-center justify-center">
      <h2 className="text-2xl sm:text-4xl font-bold pb-12" 
      style={{
        background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Your Booked Appointments Schedule will Appear here
      </h2>
      <p className='pb-4 font-semibold'>Haven’t created an appointment?</p>

      <Link href={'/appointments/create'} className='py-3 px-6 font-semibold text-white rounded-md bg-basePrimary' >Start creating</Link>
    </div>
  </section>
  )
}

export default Empty