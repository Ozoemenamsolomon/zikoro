'use client'
import { cn, useClickOutside } from '@/lib'
import { Delete, Search, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'

interface NotificationProps {
    drop: boolean; className?:string;
    setDrop: (open: boolean) => void;
  }

const Notification: React.FC<NotificationProps> = ({ drop, className, setDrop }) => {
    const {push} = useRouter()
    const [action, setAction] = useState('recent')

  return (
    <div className={cn(`${drop ? 'animate-float-in block' : 'animate-float-out hidden'} z-50 transform absolute transition-all duration-500 tr right-0 w-96 sm:w-[28rem] shadow-xl bg-slate-50  pb-12 `, className) }>

        <div className="absolute top-0 w-full bg-gradient-to-r from-slate-100 to-purple-100 px-4 pb-4 pt-12 flex justify-between items-center">
            <h4 className="text-xl font-medium">Notifications</h4>
            <div className="flex gap-2 items-center">
                <Delete size={20}/>
                <XCircle size={20}/>
            </div>
        </div>

        <div className=" px-6 space-y-6 overflow-y-auto h-full max-h-[77vh] pt-24">
            <div className="pt-4 flex gap-1 justify-center items center">
                <div className="bg-white p-0.5 flex rounded-md border">
                    <button 
                    onClick={()=>setAction('recent')} 
                    className={`${action==='recent' ? ' bg-gradient-to-r  from-slate-100  to-purple-100  text-basePrimary':''} rounded-md px-6 py-2  `}>Recent</button>
                    <button 
                    onClick={()=>setAction('archived')} 
                    className={`${action==='archived' ? ' bg-gradient-to-r  from-slate-100  to-purple-100  text-basePrimary':''} rounded-md px-6 py-2  `}>Archived</button>
                </div>
            </div>

            <div className="py-2 rounded-md px-3 flex items-center gap-2 w-full border">
                <Search size={24} className='text-gray-400 srink-0 '/>

                <input type="search" name="search" id="search"
                placeholder='Search keyword'
                className='focus:outline-none bg-transparent focus:bg-transparent text-gray-700 w-full'
                />
            </div>

            {action==='recent' ? 
            <div className="space-y-4">
                {
                    [1,2,4,5]?.map((item,idx)=>{
                        return (
                            <div key={idx}  className="space-y-4 bg-white p-4 rounded-md shadow-sm">
                                <p className="text-sm">{new Date().toLocaleString()}</p>
                                <h5 className="text-lg font-medium">Notification Name</h5>
                                <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero error beatae similique quis ut pariatur possimus commodi, esse quidem praesentium.</p>
                                <div className="flex justify-end gap-4 items-center">
                                    <button className="hover:-translate-y-0.5 duration-200 text-basePrimary">View more</button><button className="hover:-translate-y-0.5 duration-200  underline">Dismiss</button>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="flex justify-center w-full ">
                    <button className='text-basePrimary underline font-mediumunderline'>Load More</button>
                </div>
            </div>
            :
            <div className="py-32 text-center w-full mx-auto">No new notifications at this time</div>
            }

        </div>
    </div>
  )
}

export default Notification