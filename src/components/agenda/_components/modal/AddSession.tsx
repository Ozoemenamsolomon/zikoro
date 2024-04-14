"use client"

import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { Button } from "@/components";
export function AddSession() {
    return (
        <div className="w-full h-full fixed inset-0 z-[300] bg-black/50">
            <div className="py-6 px-4 w-[95%] max-w-2xl mx-auto rounded-lg bg-white absolute inset-x-0 mt-36 max-h-[85%] h-fit">
                <div className="flex mb-4 items-center justify-between w-full">
                    <h2 className="font-semibold text-lg sm:text-2xl">Add Session</h2>
                     <Button>
                        <CloseOutline size={22}/>
                        </Button>   
                </div>

                <div className="flex items-start justify-start gap-y-3 w-full">
                    <div className="flex flex-col w-full items-start justify-start gap-y-1">
                        <p className="text-xs text-gray-500 sm:text-[13px]">Select the type of activity you are creating</p>
                            
                    </div>
                </div>
            </div>
        </div>
    )
}