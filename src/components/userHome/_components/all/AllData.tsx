"use client"

import useDisclose from "@/hooks/common/useDisclose";
import { EventWidget } from "..";
import { Event } from "@/types";

export function AllDatas({ data, title}:{title:string; data?: Event[];}) {
    const {onClose} = useDisclose()
    return (
        <div 
        role="button"
        onClick={onClose}
        className="w-full h-full inset-0 z-[500] bg-white/30 fixed">
            <div
            onClick={(e) => {
                e.stopPropagation()
            }}
            className="w-[95%] max-w-4xl bg-white absolute m-auto inset-0 rounded-lg shadow py-6 px-4 h-fit max-h-[85%] overflow-y-auto">
              <h2 className="mb-4 font-semibold text-base sm:text-lg">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {Array.isArray(data) && data?.map((event) => (
                    <EventWidget event={event} key={event?.id}/>
                  ))}  
                </div>
            </div>

        </div>
    )
}