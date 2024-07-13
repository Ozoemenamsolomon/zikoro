'use client'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useClickOutside } from '@/lib'
import Image from 'next/image'
import { NotificationIcon } from '@/constants'
import Notification from './Notification'


const Main = ({children}:{children:React.ReactNode}) => {
    const [show, setShow] = useState<boolean>(false)
    const [drop, setDrop] = useState<boolean>(false)
    const sidebar = useRef(null)
    const ref = useRef(null)

    useClickOutside(sidebar,()=>setShow(false))

    useClickOutside(ref, ()=>setDrop(false))

  return (
    <>
        <aside ref={sidebar} className={`${show ? 'z-50 w-[252px]':' w-0 -z-10'} transform transition-all duration-300 ease-in-out  border-r bg-white h-screen overflow-y-auto fixed top-0 left-0 lg:hidden `}>
            <div className="absolute top-6 right-6 flex justify-end w-full">
                <button type="button" onClick={()=>setShow(false)}><ChevronFirst size={18} className='text-gray-600'/></button>
            </div>
            <Sidebar/>
        </aside>

        <aside className={`max-lg:hidden z-50 flex-shrink-0 w-[252px] border-r bg-white h-screen overflow--auto fixed top-0 left-0 `}>
            <Sidebar/>
        </aside>

        <article className="lg:pl-[252px] w-full  h-full">
            <div className="p-4 sm:p-8 xl:px-14" >
                <button className='lg:hidden' type="button" onClick={()=>setShow(true)}>
                    <ChevronLast size={18} className='text-gray-600'/>
                </button>

                <header className='flex justify-between w-full gap-4  items-center pb-8 '>
                    <div></div>
                    <Image src={'/zikoro-b.png'} alt={'zikro icon'} height={180} width={100}/>

                    <div ref={ref} className="relative">
                        <button onClick={()=>setDrop(curr=>!curr)} className="hover:shadow-sm duration-300 relative">
                            <NotificationIcon/>
                            <div className="bg-basePrimary rounded-full focus:outline-none h-6 absolute -right-1 top-0 w-6  flex justify-center items-center ring ring-white text-white text-[12px]">22</div>
                        </button >

                        <Notification drop={drop} setDrop={setDrop}/>
                    </div>
                </header>

                {children}
            </div>
        </article>
        
    </>
  )
}

export default Main