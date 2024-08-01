import Link from 'next/link'
import React from 'react'
import LinksCard from './LinksCard'
//  You haven't created any schedule. Your schedule will appear here. Start creating
const Empty = () => {
  return (
    <section className='relative w-full h-[85vh] flex justify-center overflow-hidden items-center flex-col text-center'>

        <section className="pt-8 opacity-40 absolute inset-0 grid max-[420px]:px-10  min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-[1700px]:grid-cols-5  gap-6">

            {
                [
                    {brandColour: "#F8A61C"},
                    {brandColour: "#FF5733"},
                    {brandColour: "#33FF57"},
                    {brandColour: "#3357FF"},
                    {brandColour: "#FF33A6"},
                    {brandColour: "#33FFA6"},
                    {brandColour: "#A633FF"},
                    {brandColour: "#FFA633"},
                    {brandColour: "#F8A61C"},
                    {brandColour: "#FF5733"},
                    {brandColour: "#33FF57"},
                    {brandColour: "#3357FF"},
                    {brandColour: "#FF33A6"},
                    {brandColour: "#33FFA6"},
                    {brandColour: "#FF33A6"},
                    {brandColour: "#A633FF"},
                  ]
                  ?.map((item,idx)=>{
                    return (
                        <LinksCard key={idx} data={item}/>
                    )
                })
            }
        </section>

        <div className="absolute inset-0 "></div>

    <div className="relative  max-w-xl mx-auto p-6 flex flex-col text-center  items-center justify-center">
      <h2 className="text-4xl font-bold pb-12" 
      style={{
        background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
         You haven't created any schedule.
      </h2>
      <p className='pb-4 font-semibold'> Your schedule will appear here.</p>

      <Link href={'/appointments/create'} className='py-3 px-6 font-semibold text-white rounded-md bg-basePrimary' >Start creating</Link>
    </div>
        
    </section>
  )
}

export default Empty