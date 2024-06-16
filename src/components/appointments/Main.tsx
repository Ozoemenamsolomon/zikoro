'use client'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import React, { useState } from 'react'
import Sidebar from './Sidebar'

const Main = ({children}:{children:React.ReactNode}) => {
    const [show, setShow] = useState<boolean>(false)
  return (
    <>

        <div className={`${show ? 'z-50 w-[252px]':' w-0 -z-10'} transform transition-all duration-300 ease-in-out overflow-x-hidden border-r bg-white h-screen overflow-y-auto fixed top-0 left-0 lg:hidden`}>
            <div className="flex justify-end w-full">
                <button type="button" onClick={()=>setShow(false)}><ChevronFirst/></button>
            </div>
            <Sidebar/>
        </div>

        <div className={`max-lg:hidden flex-shrink-0 w-[252px] border-r bg-white h-screen overflow-auto fixed top-0 left-0 `}>
            <Sidebar/>
        </div>

        <main className="lg:pl-[252px] w-full  ">
            <div className="p-4 sm:p-8">
                <button className='lg:hidden' type="button" onClick={()=>setShow(true)}><ChevronLast/></button>
                {children}
            </div>
        </main>
        
    </>
  )
}

export default Main