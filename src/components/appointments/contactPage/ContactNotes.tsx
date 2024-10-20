'use client'
import { Calendar } from '@/constants'
import { FolderOpen, PlusCircle } from 'lucide-react'
import React, { useState } from 'react'

const ContactNotes = () => {
    const [historyList, sethistoryList] = useState([''])
  return (
    <section className='md:p-3'>
        <div className="md:border md:rounded-lg bg-white flex-col h-full justify-between">
            <div className="">
                <header className=" w-full py-4 text-center border-b bg-baseBg font-medium">
                    Notes
                </header>

                <div className="notes  ">
                    {
                        // loading state
                        historyList && historyList?.length ? 
                        <section className='space-y-6 py-6'>
                            <div className="w-full text-center  md:px-4 flex justify-between">
                                <div className="">
                                    <button className="border py-1 px-2 rounded-md flex gap-2 items-center text-slate-600">
                                        <div className="bg-baseLight p-2 rounded-full"><Calendar/></div>
                                        <p>Go to date</p>
                                    </button>
                                </div>
                                <div className="">
                                    <button type="button" className='flex items-center gap-4 px-4 py-2 rounded-md bg-basePrimary text-white'>
                                        <PlusCircle />
                                        <p className="">Add Note</p>
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-96 grid sm:grid-cols-2 md:grid-cols- md:px-4 gap-4 ">
                                {
                                    [...Array(8)].map((_,idx)=>{
                                        return (
                                            <div key={idx} className="border rounded-lg h-60 w-full"></div>
                                        )
                                    })
                                }
                            </div>
                        </section>
                        : 
                        <div className="h-96 w-full flex flex-col gap-2 justify-center items-center">
                            <FolderOpen size={60} className='text-purple-100'/>
                            <p className="text-center text-slate-500">No Notes</p>
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

export default ContactNotes