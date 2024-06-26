'use client'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const Main = ({children}:{children:React.ReactNode}) => {
    const [show, setShow] = useState<boolean>(false)

  return (
    <>
        <aside className={`${show ? 'z-50 w-[252px]':' w-0 -z-10'} transform transition-all duration-300 ease-in-out overflow-x-hidden border-r bg-white h-screen overflow-y-auto fixed top-0 left-0 lg:hidden`}>
            <div className="flex justify-end w-full">
                <button type="button" onClick={()=>setShow(false)}><ChevronFirst size={18} className='text-gray-600'/></button>
            </div>
            <Sidebar/>
        </aside>

        <aside className={`max-lg:hidden flex-shrink-0 w-[252px] border-r bg-white h-screen overflow-auto fixed top-0 left-0 `}>
            <Sidebar/>
        </aside>

        <article className="lg:pl-[252px] w-full  ">
            <div className="p-4 sm:p-8 xl:px-14" >
                <button className='lg:hidden' type="button" onClick={()=>setShow(true)}>
                    <ChevronLast size={18} className='text-gray-600'/>
                </button>

                <header className='flex w-full gap-4 justify-center items-center pb-8 '>
                    <div className="" onClick={async ()=>{
                        const supabase = createClientComponentClient();
                        const error = await supabase.auth.signOut();
                        console.log({error})
                    }}>logout</div>
                    <div className="" onClick={async ()=>{
                        const supabase = createClientComponentClient();
                        const data = await supabase.auth.signInWithPassword({email:'ecudeji@gmail.com', password:'cat89boy'});
                        console.log({data,})
                    }}>signin</div>
                    <div className="flex-shrink-0 h-[47px] w-[47px] rounded-full  "
                    style={{background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)'
                    }}></div>
                    <div className="">
                        <p className="text-[#1F1F1F] text-[12px]">Zikoro</p>
                        <h5 className="text-[#1F1F1F] text-[16px] font-semibold">Bookings</h5>
                    </div>
                </header>

                {children}
            </div>
        </article>
        
    </>
  )
}

export default Main