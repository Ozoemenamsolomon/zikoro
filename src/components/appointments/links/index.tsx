'use client'

import React from 'react'
import LinksCard from './LinksCard'
import { useGetAppointments } from '@/hooks'

const LinksPage = () => {
    const {appointments,isLoading,getAppointments} = useGetAppointments()
    console.log('AAAA',{appointments})
  return (
    <main className=''>
        <h4 className='text-2xl font-semibold'>My Links</h4>
        {
            isLoading ? <div>Loading..</div> :
            <section className="mt-10 flex flex-wrap gap-6 justify-start w-full">
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