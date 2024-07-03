'use client'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useClickOutside } from '@/lib'
import Image from 'next/image'


const Main = ({children}:{children:React.ReactNode}) => {
    const [show, setShow] = useState<boolean>(false)
    const sidebar = useRef(null)

    useClickOutside(sidebar,()=>setShow(false))

  return (
    <>
        <aside ref={sidebar} className={`${show ? 'z-50 w-[252px]':' w-0 -z-10'} transform transition-all duration-300 ease-in-out overflow-x-hidden border-r bg-white h-screen overflow-y-auto fixed top-0 left-0 lg:hidden `}>
            <div className="absolute top-6 right-6 flex justify-end w-full">
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
                    {/* <div className="" onClick={async ()=>{
                        const supabase = createClientComponentClient();
                        const error = await supabase.auth.signOut();
                        console.log({error})
                    }}>logout</div>
                    <div className="" onClick={async ()=>{
                        const supabase = createClientComponentClient();
                        const data = await supabase.auth.signInWithPassword({email:'ecudeji@gmail.com', password:'cat89boy'});
                        console.log({data,})
                    }}>signin</div> */}
                    
                    <div className="flex-shrink-0    ">
                        <Image src={'/zikoro-b.png'} alt={'zikro icon'} height={200} width={150}/>
                    </div>
                    
                </header>

                {children}
            </div>
        </article>
        
    </>
  )
}

export default Main