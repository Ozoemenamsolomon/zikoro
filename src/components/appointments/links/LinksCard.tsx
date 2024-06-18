import { ClockIcon, EditPenBoxIcon, MapPin, ShareIcon } from '@/constants'
import React from 'react'

const LinksCard = () => {
  return (
    <div className={`w-72 p-4 border-2 space-y-2 rounded-lg `}>
        <div className="flex justify-between gap-6 items-center">
            <h4 className="text-lg font-medium">Link Name</h4>
            <div><EditPenBoxIcon/> </div>
        </div>

        <div className="">
            <div className=" flex  gap-4 items-center">
                <div><ClockIcon/></div>
                <p className="">60 mins</p>
            </div>
            <div className="flex  gap-4 items-center">
                <div><MapPin/> </div>
                <p className="">Virtual</p>
            </div>
        </div>

        <div className="flex justify-between gap-6 items-center">
            <p className=" font-medium">Status</p>
            <div>ON</div>
        </div>

        <hr className="font-bold border" />

        <div className="flex justify-between gap-6 items-center">
            <button className="underline">Copy link</button>

            <button className="flex  gap-1 items-center">
                <p className="">Share</p>
                <div><ShareIcon/> </div>
            </button>
        </div>


        
    </div>
  )
}

export default LinksCard