'use client'
import { useToast } from '@/components/ui/use-toast'
import { ClockIcon, EditPenBoxIcon, MapPin, ShareIcon } from '@/constants'
import { AppointmentLink } from '@/types/appointments'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { availableParallelism } from 'os'
import React, { useState } from 'react'

const LinksCard = ({data}:{data:AppointmentLink}) => {
    const {push} = useRouter()
    const [item, setItem] = useState(data)
    const [laoding, setLoading] = useState(false)

    const toast = useToast()
    const changeStatus = async (newState:boolean) => {
        setLoading(true)
        setItem({...item, statusOn: newState})
        try {
            const payload = { ...item, statusOn: newState,};
            const response = await fetch('/api/appointments/edit', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              });
            const result = await response.json();
            if (response.ok) {
                // setItem(result?.data);
                //toast.success
                console.log('Status changed successfully', result);
              } else {
                setItem({...item, statusOn: !newState})
                console.error('Failed to complete task', result);
                // toast.error
              }
      
        } catch (error) {
            console.log('Service not available')
        } finally {
            setLoading(false)
        }
    }
// console.log({data})
  return (
    <div className={`w-72 p-4 border-2 space-y-2 rounded-lg `}>
        <div className="flex justify-between gap-6 items-center">
            <h4 className="text-lg font-medium">{item?.appointmentName}</h4>
            <Link href={`/appointments/edit?d=${item.id}`}><EditPenBoxIcon/> </Link >
        </div>

        <div className="">
            <div className=" flex  gap-4 items-center">
                <div><ClockIcon/></div>
                <p className="">{item?.duration}</p>
            </div>
            <div className="flex  gap-4 items-center">
                <div><MapPin/> </div>
                <p className="">{item?.loctionType}</p>
            </div>
        </div>

        <div className="flex justify-between gap-6 items-center">
            <p className=" font-medium">Status</p>
            <div
                className={` flex-shrink-0 ${item?.statusOn ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-gray-300 ring-2 ring-gray-300'} mr- w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer `}
                onClick={() => changeStatus(!item?.statusOn )}
            >   
                <div className="flex w-full justify-between font-semibold text-[9px]"> <p className='text-white'>ON</p><p className='text-gray-50'>OFF</p>  </div>
                <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${item?.statusOn  ? 'translate-x-7' : ''}`}></div>
            </div>
        </div>

        <hr className="font-bold border" />

{/* links: /appointments/booking?b=${item.id} */}

        <div className="flex justify-between gap-6 items-center">
            <button className="underline">Copy link</button>

            <button onClick={()=>push(`/appointments/booking?b=${item.id}`)} className="flex  gap-1 items-center">
                <p className="">Share</p>
                <div><ShareIcon/> </div>
            </button>
        </div>


        
    </div>
  )
}

export default LinksCard