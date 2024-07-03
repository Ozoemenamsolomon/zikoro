'use client'

import React from 'react'
import LinksCard from './LinksCard'
import { useGetAppointments } from '@/hooks'

const LinksPage = () => {
    const {appointments,isLoading,getAppointments} = useGetAppointments()
    console.log({appointments})
  return (
    <main className='w-full'>
        <h4 className='text-2xl font-semibold'>My Links</h4>
        {
            isLoading ? <div>Loading...</div> 
            :
            <section className="pt-10 mx-auto max-sm:space-y-6  max-w-sm sm:max-w-full sm:flex sm:flex-wrap justify-  gap-6">
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