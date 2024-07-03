'use client'

import React from 'react'
import LinksCard from './LinksCard'
import { useGetAppointments } from '@/hooks'
import PageLoading from '../ui/Loading'

const LinksPage = () => {
    const {appointments,isLoading,getAppointments} = useGetAppointments()
    console.log({appointments})
  return (
    <main className='w-full'>
        <h4 className='text-xl font-semibold'>My Schedules</h4>
        {
            isLoading ? 
            <PageLoading isLoading={isLoading}/>
            :
            // <section className="pt-10 mx-auto max-sm:space-y-6  max-w-sm sm:max-w-full sm:flex sm:flex-wrap  gap-6">
            <section className="pt-8 grid max-[420px]:px-10  min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-[1700px]:grid-cols-5  gap-6">
                {
                    appointments?.map((item,idx)=>{
                        return (
                            <LinksCard key={idx} data={item}/>
                        )
                    })
                }
            </section>
        }
    </main>
  )
}

export default LinksPage