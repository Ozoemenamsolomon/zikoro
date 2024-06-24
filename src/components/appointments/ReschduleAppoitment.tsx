import { CalenderArrowIcon, EditPenIcon } from '@/constants'
import { Calendar, X,  } from 'lucide-react'
import React from 'react'

const RescheduleAppointment = () => {
  return (
    <section className='w-full h-screen flex justify-center items-center p-6'>
        <div className="sm:w-[540px] rounded-2xl text-center p-6 pt-20 sm:p-12 sm:pt-20 shadow-md bg-background flex flex-col items-center gap-6 text-sm">

            <X className='text-gray-500 hover:text-gray-700 cursor-pointer absolute top-6 right-6' size={20}/>

            <div className=""><CalenderArrowIcon/></div>

            <div className="flex flex-col items-center gap- w-full sm:w-[350px]">
                <h4 className="text-zikoroBlue text-2xl font-semibold">
                Reschedule Appointment
                </h4>
                <p className="pt-3">You are about to reschedule this appointment </p>
                <p className="font-medium sm:w-[260px]">Manuel Peters 10:30 AM – 12:30 PM Location: Virtual</p>
            </div>

            <div className="flex flex-col gap-2 items-center">
                <div className=" flex items-center gap-2">
                    <h5 className="text- font-medium">
                        Monday, 6 May 2024
                    </h5>
                    <Calendar size={14}/>
                </div>
                <div className="flex gap-4 itemscenter">
                    <div className="flex gap-2 items-center p-2 border rounded-md">
                        <p className="">From</p>
                        <input type="time" name="from" id="from" defaultValue={new Date().toLocaleTimeString()} />
                    </div>
                    <div className="flex gap-2 items-center p-2 border rounded-md">
                        <p className="">To</p>
                        <input type="time" name="to" id="to" defaultValue={new Date().toLocaleTimeString()} />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 sm:w-[390px] items-center">
                <div className="flex-shrink-0"><EditPenIcon/> </div>
                <div className="w-full">
                    <input 
                    type='text'
                        name='reason' 
                        id='reason' 
                        placeholder='Add notes to let invitees know why you rescheduled' 
                        className="w-full  px-3 py-2 border rounded-md"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center w-full gap-4 font-semibold">
                <div className="">
                    <button type="button" className='py-2 px-6 rounded-md text-white'
                    style={{background: `linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)`
                    }}
                    >
                        Reschedule Appointment
                    </button>
                </div>
                <div className="">
                    <button type="button" className='py-2 px-6 rounded-md hover:bg-gray-100 duration-300'
                    >
                        Go back
                    </button>
                </div>
            </div>

        </div>
        
    </section>
  )
}

export default RescheduleAppointment


