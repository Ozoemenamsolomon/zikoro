import { Booking } from '@/types/appointments'
import { format } from 'date-fns'
import { Delete, MoveUpRight, PlusCircle, Trash, XCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Arrow90degRight } from 'styled-icons/bootstrap'

const Action = ({appointment}:{
    appointment:Booking
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const date = format(new Date(appointment?.appointmentDate!), 'eeee, dd MMMM, yyyy' )

    console.log({appointment})
  return (
    <React.Fragment>
        <div className="absolute inset-0 z-40 flex h-full flex-col gap-2 justify-center text-center p-2 pt-6"
        >
            <div className="flex justify-center">
                <Link href={`/appointments#${appointment?.appointmentDate}?dt=${appointment?.appointmentTime} `} 
                className="bg-zikoroBlue flex-nowrap overflow-hidden  text-[10px] xl:text-sm text-white flex items-center px-2 py-1 rounded-full justify-center gap-1">
                    <p className="shrink-0 flex-nowrap">View appointments</p>
                    <MoveUpRight size={14}/>
                </Link >
            </div>

            <button onClick={()=>setIsOpen(true)}
            className='underline text-sm'>Set unavailability</button>
        </div>



        <div className={`${isOpen? 'visible z-50 ':'invisble -z-10'} transform transition-all duration-300 ease-in-out fixed inset-0 bg-black/5 flex justify-center items-center p-6 `}
        onClick={()=>setIsOpen(false)}>

            <div onClick={e=>e.stopPropagation()}
            className="max-sm: max-w-lg px-6 py-12 flex flex-col items-center gap-4 bg-white shadow-xl rounded-md relative">

                <XCircle onClick={()=>setIsOpen(false)} 
                className='cursor-pointer absolute right-6 top-6 text-gray-600' />

                <h5 className="text-large pb-4 font-semibold tex-center">
                    {date}
                </h5>

                <div className="border rounded-md border-zikoroBlue px-3 py-4">
                    <div className="bg-purple-100 rounded-md p-3 text-center mb-4">
                        <h6 className="text-base  font-medium">Edit unavailability</h6>
                        <p className="text-sm">Add time when you will be unavailable today</p>
                    </div>

                    <div className="flex mb-3 justify-center gap-3 items-center w-full">
                        <div className="bg-purple-100 p-2 rounded-md shrink-0">00:00 AM</div>
                        <p className="">-</p>
                        <div className="bg-purple-100 p-2 rounded-md shrink-0">00:00 AM</div>
                        <button><Trash size={20}/></button>
                    </div>

                    <div className="flex gap-2 items-center text-zikoroBlue">
                        <PlusCircle size={18} />
                        <p>Add Time</p>
                    </div>
                </div>

                <button className='bg-basePrimary rounded-md p-3  text-center w-full text-white' >Apply</button>
            </div>
        </div>

        
    </React.Fragment>
  )
}

export default Action