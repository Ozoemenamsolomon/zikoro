import { AppointmentUnavailability, Booking } from '@/types/appointments'
import { format } from 'date-fns'
import { Delete, MoveUpRight, PlusCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Arrow90degRight } from 'styled-icons/bootstrap'
import TimePicker from './TimePicker'

const Action = ({appointment, list, dayString, unavailableDates}:{
    appointment:Booking, list:Booking[], dayString:string, unavailableDates:AppointmentUnavailability[]
}) => {
    const [isOpen, setIsOpen] = useState<string>('')
  return (
    <React.Fragment>
        <div className="absolute inset-0 z-40 flex h-full flex-col gap-2 justify-center text-center p-2 pt-6"
        >
           { 
           list?.length ?
            <>
                <div className="flex justify-center">
                    <Link href={`/appointments#${appointment?.appointmentDate}?dt=${appointment?.appointmentTime} `} 
                    className="bg-zikoroBlue flex-nowrap overflow-hidden  text-[10px] xl:text-sm text-white flex items-center px-2 py-1 rounded-full justify-center gap-1">
                        <p className="shrink-0 flex-nowrap">View appointments</p>
                        <MoveUpRight size={14}/>
                    </Link >
                </div>

                <button onClick={()=>setIsOpen(dayString)}
                className='underline text-sm'>Set unavailability</button>
            </> 
            :
            <button onClick={()=>setIsOpen(dayString)}
            className='underline text-sm'>Set unavailability</button>
            }
        </div>

      <div className={`${isOpen===dayString ? 'visible z-50 ':'hidden '} transform transition-all duration-300 ease-in-out fixed inset-0 bg-black/5 flex justify-center items-center p-6 `}
        onClick={()=>setIsOpen('')}>

            <div onClick={e=>e.stopPropagation()}
            className="max-sm: max-w-lg px-6 py-12 flex flex-col items-center gap-4 bg-white shadow-xl rounded-md relative">

                <XCircle size={20} onClick={()=>setIsOpen('')} 
                className='cursor-pointer absolute right-6 top-6 text-gray-600' />

                <h5 className="text-lg pb-4 font-semibold tex-center">
                    {dayString}
                </h5>
                <TimePicker unavailableDates={unavailableDates} booking={appointment} isOpen={isOpen} dayString={dayString}/>
                
            </div>
        </div>
 
        
    </React.Fragment>
  )
}

export default Action