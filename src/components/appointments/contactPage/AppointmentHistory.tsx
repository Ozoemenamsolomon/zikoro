'use client'
import { FolderOpen } from 'lucide-react'
import React, { Suspense, useState } from 'react'

const AppointmentHistory = () => {
    const [historyList, sethistoryList] = useState([''])
  return (
    <section className='md:p-3'>
        <div className="md:border md:rounded-lg bg-white flex-col h-full justify-between">
            <div className="">
                <header className=" w-full py-4 text-center border-b bg-baseBg font-medium">
                    Appointment History
                </header>

                <div className="list  ">
                    {
                        // loading state
                        historyList && historyList?.length ? 
                        <>
                            <div className="w-full text-center py-4 font">Booked 35 times since 09 August, 2024</div>
                            <div className="min-h-96 flex flex-col items-center ">
                                List
                            </div>
                        </>
                        : 
                        <div className="h-96 w-full flex flex-col gap-2 justify-center items-center">
                            <FolderOpen size={60} className='text-purple-100'/>
                            <p className="text-center text-slate-500">No Appointments</p>
                        </div>
                    }

                    
                </div>
            </div>

            <div className="border-t w-full py-4">
                Pagination
            </div>

        </div>
    </section>
  )
}

export default AppointmentHistory