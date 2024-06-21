import React, { Suspense } from 'react'
import LinksCard from './LinksCard'
import { AppointmentLink } from '@/types/appointments'

const LinksPage = ({appointmnetLinks}:{appointmnetLinks:AppointmentLink[]}) => {
    console.log('AAAA',{appointmnetLinks})
  return (
    <main className=''>
        <h4 className='text-2xl font-semibold'>My Links</h4>
        <Suspense fallback={<div className='p-40 text-center '>Loading...</div>}>
            <section className="mt-10 flex flex-wrap gap-6 justify-center w-full">
                {
                    appointmnetLinks?.map((item,idx)=>{
                        return (
                            <LinksCard key={idx} data={item}/>
                        )
                    })
                }
            </section>
        </Suspense>

    </main>
  )
}

export default LinksPage